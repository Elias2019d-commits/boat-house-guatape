/**
 * Movimiento del sitio. Todo parte de la clase `movido` que pone el script del <head>
 * cuando hay JS (sin JS el contenido se muestra quieto y completo). Si el sistema pide
 * reducir movimiento, también pone `suave`: se mantienen los fundidos y se quitan
 * desplazamientos, zoom, parallax, scroll con inercia y ondas.
 *
 * - intro de la primera visita y arranque de la portada
 * - revelados al entrar en pantalla ([data-revelar])
 * - parallax de las escenas ([data-parallax]) y reflejo que se mece con el scroll
 * - scroll suave con inercia (solo mouse/trackpad)
 * - botones magnéticos ([data-iman]) en desktop
 */
import Lenis from 'lenis';

const raiz = document.documentElement;
const fino = matchMedia('(hover: hover) and (pointer: fine)');
const suave = raiz.classList.contains('suave');

export let lenis: Lenis | null = null;

if (raiz.classList.contains('movido')) iniciar();

function iniciar() {
  introYPortada();
  revelados();
  palabras();
  if (suave) return;
  parallax();
  aguaViva();
  if (fino.matches) {
    scrollSuave();
    imanes();
  }
}

/* ---------- agua viva en la portada (WebGL, se carga aparte) ---------- */
function aguaViva() {
  const portada = document.querySelector<HTMLElement>('.escena--portada');
  if (!portada) return;
  import('./agua-gl').then((m) => m.iniciarAguaGL(portada)).catch(() => {});
}

/* ---------- intro y portada ---------- */
function introYPortada() {
  const portada = document.querySelector<HTMLElement>('[data-revelar="portada"]');
  const seccion = document.querySelector<HTMLElement>('[data-portada]');
  const intro = document.querySelector<HTMLElement>('[data-intro]');
  const arrancar = () => {
    portada?.classList.add('visto');
    seccion?.classList.add('visto');
  };

  if (raiz.classList.contains('con-intro') && intro) {
    let listo = false;
    const abrir = () => {
      if (listo) return;
      listo = true;
      intro.classList.add('abre');
      setTimeout(arrancar, 150);
      setTimeout(() => {
        raiz.classList.remove('con-intro');
        try {
          sessionStorage.setItem('bh-intro', '1');
        } catch {}
      }, 1300);
    };
    setTimeout(abrir, 1700);
    intro.addEventListener('click', abrir);
    addEventListener('keydown', abrir, { once: true });
  } else {
    setTimeout(arrancar, 60);
  }
}

/* ---------- revelados ---------- */
function revelados() {
  // grupos: cada hijo recibe su índice para escalonar
  document.querySelectorAll<HTMLElement>('[data-revelar="grupo"]').forEach((g) => {
    [...g.children].forEach((h, i) => (h as HTMLElement).style.setProperty('--i', String(i)));
  });

  const io = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('visto');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -14% 0px', threshold: 0.01 },
  );
  const pendientes = new Set(document.querySelectorAll<HTMLElement>('[data-revelar]:not([data-revelar="portada"])'));
  pendientes.forEach((el) => io.observe(el));

  // con un scroll muy rápido un elemento puede saltar de abajo a arriba sin cruzar la
  // pantalla: lo que ya quedó atrás se muestra igual
  let espera = 0;
  addEventListener(
    'scroll',
    () => {
      if (espera) return;
      espera = window.setTimeout(() => {
        espera = 0;
        for (const el of pendientes) {
          if (el.classList.contains('visto')) {
            pendientes.delete(el);
            continue;
          }
          if (el.getBoundingClientRect().top < innerHeight * 0.86) {
            el.classList.add('visto');
            io.unobserve(el);
            pendientes.delete(el);
          }
        }
      }, 120);
    },
    { passive: true },
  );
}

/* ---------- palabras que se enfocan una a una (reseñas) ---------- */
function palabras() {
  document.querySelectorAll<HTMLElement>('[data-palabras]').forEach((el) => {
    const texto = el.textContent ?? '';
    const limpio = texto.trim();
    const seguro = (t: string) => t.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
    // el texto completo queda para lectores de pantalla; las palabras sueltas son solo visuales
    el.innerHTML =
      `<span class="visually-hidden">${seguro(limpio)}</span>` +
      limpio
        .split(/\s+/)
        .map((p, i) => `<span class="palabra" aria-hidden="true" style="--i:${i}">${seguro(p)}</span>`)
        .join(' ');
  });
}

/* ---------- parallax y reflejo ---------- */
function parallax() {
  const capas = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
  const reflejos = [...document.querySelectorAll<HTMLElement>('[data-reflejo]')];
  const limitar = (v: number, max: number) => Math.min(max, Math.max(-max, v));

  // se recalculan todas las escenas en cada scroll (son pocas): así un salto largo,
  // por ejemplo volver al inicio desde abajo, nunca deja una escena corrida
  const pintar = () => {
    const vh = innerHeight;
    for (const capa of capas) {
      const escena = capa.parentElement!;
      const r = escena.getBoundingClientRect();
      const f = Number(capa.dataset.parallax);
      // la portada baja más lento que el scroll; las demás escenas se deslizan apenas,
      // siempre dentro del margen que cubre el zoom de la foto (ver TituloAgua)
      const t = capa.closest('.escena--portada')
        ? limitar(-r.top * f, r.height * 0.5)
        : limitar((vh / 2 - (r.top + r.height / 2)) * f, r.height * 0.04);
      capa.style.transform = `translate3d(0, ${t.toFixed(1)}px, 0)`;
    }
    for (const r of reflejos) {
      const top = r.getBoundingClientRect().top;
      if (top < -200 || top > vh + 200) continue;
      r.style.setProperty('--desliz', `${(Math.sin(top / 80) * 4).toFixed(2)}px`);
    }
  };
  addEventListener('scroll', pintar, { passive: true });
  addEventListener('resize', pintar, { passive: true });
  pintar();
}

/* ---------- scroll suave ---------- */
function scrollSuave() {
  lenis = new Lenis({ lerp: 0.085, anchors: { offset: -72 }, autoRaf: true });
  // los diálogos y el menú bloquean el scroll de la página
  new MutationObserver(() => {
    const bloqueado = raiz.style.overflow === 'hidden' || raiz.classList.contains('con-intro');
    if (bloqueado) lenis?.stop();
    else lenis?.start();
  }).observe(raiz, { attributes: true, attributeFilter: ['style', 'class'] });
}

/* ---------- botones magnéticos ---------- */
function imanes() {
  document.querySelectorAll<HTMLElement>('[data-iman]').forEach((b) => {
    b.addEventListener('pointermove', (e) => {
      const r = b.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * 0.22;
      const y = (e.clientY - (r.top + r.height / 2)) * 0.32;
      b.style.setProperty('--ix', `${x.toFixed(1)}px`);
      b.style.setProperty('--iy', `${y.toFixed(1)}px`);
    });
    b.addEventListener('pointerleave', () => {
      b.style.setProperty('--ix', '0px');
      b.style.setProperty('--iy', '0px');
    });
  });
}

/* ---------- el agua responde: ondas al tocar y reflejo que se agita ---------- */
if (raiz.classList.contains('movido') && !suave) {
  agua();
  reflejoVivo();
}

function agua() {
  let activas = 0;
  let ultima = 0;

  const gota = (escena: HTMLElement, x: number, y: number, fuerza = 1) => {
    if (activas > 8 || escena.classList.contains('gl-activo')) return;
    const linea = escena.querySelector<HTMLElement>('[data-agua]')!.getBoundingClientRect().top;
    const r = escena.getBoundingClientRect();
    if (y < linea + 6) return; // solo sobre el agua, nunca en el cielo
    // perspectiva: cerca del horizonte las ondas son chicas y aplanadas
    const prof = Math.min(1, Math.max(0.18, (y - linea) / Math.max(1, r.bottom - linea)));
    const el = document.createElement('span');
    el.className = 'gota';
    el.style.left = `${x - r.left}px`;
    el.style.top = `${y - r.top}px`;
    el.style.setProperty('--t', `${(70 + 230 * prof) * fuerza}px`);
    el.style.setProperty('--aplana', String(0.22 + 0.16 * prof));
    el.innerHTML = '<i></i><i></i><i></i>';
    escena.appendChild(el);
    activas++;
    setTimeout(() => {
      el.remove();
      activas--;
    }, 2300);
  };

  document.querySelectorAll<HTMLElement>('[data-escena]').forEach((escena) => {
    // click y no pointerdown: un toque que empieza un scroll no hace ondas
    escena.addEventListener('click', (e) => gota(escena, e.clientX, e.clientY));
    if (fino.matches) {
      // con el mouse, pasar por el agua deja una estela de ondas pequeñas
      escena.addEventListener('pointermove', (e) => {
        const ahora = performance.now();
        if (ahora - ultima < 160 || Math.hypot(e.movementX, e.movementY) < 6) return;
        ultima = ahora;
        gota(escena, e.clientX, e.clientY, 0.45);
      });
    }
  });
}

function reflejoVivo() {
  if (!fino.matches) return;
  const mapa = document.querySelector<SVGFEDisplacementMapElement>('#onda-viva feDisplacementMap');
  const portada = document.querySelector<HTMLElement>('.escena--portada');
  if (!mapa || !portada) return;
  const base = 6;
  let actual = base;
  let objetivo = base;
  let corriendo = false;
  const paso = () => {
    actual += (objetivo - actual) * 0.08;
    objetivo += (base - objetivo) * 0.04;
    mapa.setAttribute('scale', actual.toFixed(2));
    if (Math.abs(actual - base) > 0.05 || Math.abs(objetivo - base) > 0.05) requestAnimationFrame(paso);
    else corriendo = false;
  };
  portada.addEventListener('pointermove', (e) => {
    const v = Math.hypot(e.movementX, e.movementY);
    objetivo = Math.min(34, Math.max(objetivo, base + v * 0.6));
    if (!corriendo) {
      corriendo = true;
      requestAnimationFrame(paso);
    }
  });
}
