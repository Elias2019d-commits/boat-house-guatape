import preciosJson from '../data/precios.json';
import ocupadoJson from '../data/ocupado.json';
import {
  DIAS,
  DIAS_CORTOS,
  MESES,
  diasEnMes,
  diferenciaDias as diferencia,
  diaSemana,
  fechaLarga,
  hoyEnBogota,
  iso,
  partes,
  sumarDias,
  type ISO,
} from '../lib/fechas';
import { cotizar, miles, pesos, precioNoche, type ConfigPrecios, type Plan } from '../lib/precios';
import { nocheDisponible, validarEstadia } from '../lib/estadia';
import { armarMensaje, enlaceWhatsApp, rangoFechas } from '../lib/mensaje';

const cfg = preciosJson as ConfigPrecios;
const ocupadas = new Set<ISO>(ocupadoJson.noches);
const MESES_ADELANTE = 12;

interface Estado {
  llegada: ISO | null;
  salida: ISO | null;
  foco: ISO;
  mes: [number, number]; // primer mes visible
  plan: Plan;
  ocasion: string | null;
}

const NOMBRE_TARIFA = { semana: 'semana', finde: 'fin de semana', especial: 'fecha especial' } as const;

export function iniciarReserva(raiz: HTMLElement) {
  const cal = raiz.querySelector<HTMLElement>('[data-calendario]')!;
  const aviso = raiz.querySelector<HTMLElement>('[data-aviso-fechas]')!;
  const ayuda = raiz.querySelector<HTMLElement>('[data-ayuda-fechas]')!;
  const resumen = raiz.querySelector<HTMLElement>('[data-resumen]')!;
  const enviar = raiz.querySelector<HTMLAnchorElement>('[data-enviar]')!;
  const falta = raiz.querySelector<HTMLElement>('[data-falta]')!;

  const hoy = hoyEnBogota();
  const [hy, hm] = partes(hoy);
  const limite = iso(hy + 1, hm, 1); // último mes navegable: 12 meses adelante
  const ancho = matchMedia('(min-width: 1280px)');

  const e: Estado = {
    llegada: null,
    salida: null,
    foco: hoy,
    mes: [hy, hm],
    plan: cfg.planes[0],
    ocasion: null,
  };

  const mesesVisibles = () => (ancho.matches ? 2 : 1);
  const sumarMes = ([y, m]: [number, number], n: number): [number, number] => {
    const t = y * 12 + (m - 1) + n;
    return [Math.floor(t / 12), (t % 12) + 1];
  };
  const indiceMes = ([y, m]: [number, number]) => y * 12 + m;
  const primerMes: [number, number] = [hy, hm];
  const ultimoMes = sumarMes(primerMes, MESES_ADELANTE - 1);

  /** Primer día ocupado después de la llegada: la salida no puede pasar de ahí. */
  function topeSalida(llegada: ISO): ISO | null {
    for (let i = 1; i <= 366; i++) {
      const f = sumarDias(llegada, i);
      if (ocupadas.has(f)) return f;
    }
    return null;
  }

  function estadoDia(f: ISO) {
    const pasada = f < hoy;
    const ocupada = ocupadas.has(f);
    const fueraRango = f >= limite;
    let elegible = !pasada && !ocupada && !fueraRango;
    let comoSalida = false;
    if (e.llegada && !e.salida && f > e.llegada) {
      const tope = topeSalida(e.llegada);
      comoSalida = tope == null || f <= tope;
      elegible = comoSalida && !fueraRango;
      if (!comoSalida && !pasada && !ocupada) elegible = true; // reinicia la llegada
    }
    const enRango = !!(e.llegada && e.salida && f > e.llegada && f < e.salida);
    return { pasada, ocupada, elegible, comoSalida, enRango };
  }

  function etiqueta(f: ISO, s: ReturnType<typeof estadoDia>): string {
    const partesTxt = [fechaLarga(f, true)];
    if (s.pasada) partesTxt.push('fecha pasada');
    else if (s.ocupada && !s.comoSalida) partesTxt.push('ocupado');
    else {
      if (s.ocupada && s.comoSalida) partesTxt.push('ocupado esa noche, se puede elegir como salida');
      if (!s.ocupada) {
        const n = precioNoche(f, e.plan, cfg);
        if (n.precio != null) partesTxt.push(`tarifa ${NOMBRE_TARIFA[n.tarifa]}, ${pesos(n.precio)} la noche`);
      }
    }
    if (f === e.llegada) partesTxt.push('llegada elegida');
    if (f === e.salida) partesTxt.push('salida elegida');
    return partesTxt.join(', ');
  }

  function render(enfocar = false) {
    const n = mesesVisibles();
    const frag = document.createDocumentFragment();

    const cabeza = document.createElement('div');
    cabeza.className = 'cal__cabeza';
    const prev = boton('cal__nav', 'Mes anterior', '<path d="M14.5 6 8.5 12l6 6"/>');
    const next = boton('cal__nav', 'Mes siguiente', '<path d="M9.5 6l6 6-6 6"/>');
    prev.disabled = indiceMes(e.mes) <= indiceMes(primerMes);
    next.disabled = indiceMes(sumarMes(e.mes, n - 1)) >= indiceMes(ultimoMes);
    prev.addEventListener('click', () => cambiarMes(-1));
    next.addEventListener('click', () => cambiarMes(1));

    const meses = document.createElement('div');
    meses.className = 'cal__meses';

    for (let k = 0; k < n; k++) {
      const [y, m] = sumarMes(e.mes, k);
      meses.appendChild(mesTabla(y, m));
    }

    const titulo = document.createElement('p');
    titulo.className = 'cal__titulo';
    titulo.setAttribute('aria-live', 'polite');
    const [y0, m0] = e.mes;
    const [y1, m1] = sumarMes(e.mes, n - 1);
    titulo.textContent =
      n === 1 ? `${MESES[m0 - 1]} ${y0}` : `${MESES[m0 - 1]} y ${MESES[m1 - 1]} ${y1 !== y0 ? `${y0}–${y1}` : y0}`;

    cabeza.append(titulo, prev, next);
    frag.append(cabeza, meses);
    cal.replaceChildren(frag);

    if (enfocar) cal.querySelector<HTMLButtonElement>(`[data-fecha="${e.foco}"]`)?.focus();
  }

  function boton(cls: string, label: string, path: string) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = cls;
    b.setAttribute('aria-label', label);
    b.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
    return b;
  }

  function mesTabla(y: number, m: number) {
    const id = `cal-${y}-${m}`;
    const caja = document.createElement('div');
    caja.className = 'cal__mes';
    const h = document.createElement('p');
    h.className = 'cal__nombre';
    h.id = id;
    h.textContent = `${MESES[m - 1]} ${y}`;
    const tabla = document.createElement('table');
    tabla.setAttribute('role', 'grid');
    tabla.setAttribute('aria-labelledby', id);
    const thead = document.createElement('thead');
    const trh = document.createElement('tr');
    // lunes primero
    [1, 2, 3, 4, 5, 6, 0].forEach((d) => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.abbr = DIAS[d];
      th.textContent = DIAS_CORTOS[d];
      trh.appendChild(th);
    });
    thead.appendChild(trh);
    tabla.appendChild(thead);

    const tbody = document.createElement('tbody');
    const primero = iso(y, m, 1);
    const desfase = (diaSemana(primero) + 6) % 7;
    const total = diasEnMes(y, m);
    let tr = document.createElement('tr');
    for (let i = 0; i < desfase; i++) tr.appendChild(document.createElement('td'));

    for (let d = 1; d <= total; d++) {
      const f = iso(y, m, d);
      const s = estadoDia(f);
      const td = document.createElement('td');
      td.setAttribute('role', 'gridcell');
      const esInicio = f === e.llegada;
      const esFin = f === e.salida;
      td.setAttribute('aria-selected', String(esInicio || esFin || s.enRango));
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'dia';
      b.dataset.fecha = f;
      b.tabIndex = f === e.foco ? 0 : -1;
      if (!s.elegible) b.setAttribute('aria-disabled', 'true');
      if (s.pasada) b.classList.add('dia--pasada');
      if (s.ocupada) b.classList.add('dia--ocupada');
      if (esInicio) b.classList.add('dia--inicio');
      if (esFin) b.classList.add('dia--fin');
      if (s.enRango) {
        b.classList.add('dia--rango');
        b.style.setProperty('--k', String(Math.max(0, diferencia(e.llegada!, f))));
      }
      if (f === hoy) b.classList.add('dia--hoy');
      b.setAttribute('aria-label', etiqueta(f, s));

      const num = document.createElement('span');
      num.className = 'dia__num';
      num.textContent = String(d);
      b.appendChild(num);
      if (!s.pasada && !s.ocupada) {
        const n = precioNoche(f, e.plan, cfg);
        if (n.precio != null) {
          const p = document.createElement('span');
          p.className = `dia__precio dia__precio--${n.tarifa}`;
          p.textContent = miles(n.precio);
          p.setAttribute('aria-hidden', 'true');
          b.appendChild(p);
        }
      }
      td.appendChild(b);
      tr.appendChild(td);
      if ((desfase + d) % 7 === 0) {
        tbody.appendChild(tr);
        tr = document.createElement('tr');
      }
    }
    if (tr.children.length) {
      while (tr.children.length < 7) tr.appendChild(document.createElement('td'));
      tbody.appendChild(tr);
    }
    tabla.appendChild(tbody);
    caja.append(h, tabla);
    return caja;
  }

  function cambiarMes(dir: number) {
    const nuevo = sumarMes(e.mes, dir);
    if (indiceMes(nuevo) < indiceMes(primerMes)) return;
    if (indiceMes(sumarMes(nuevo, mesesVisibles() - 1)) > indiceMes(ultimoMes)) return;
    e.mes = nuevo;
    const [y, m] = nuevo;
    const candidato = iso(y, m, 1);
    e.foco = candidato < hoy ? hoy : candidato;
    render();
  }

  function elegir(f: ISO) {
    const s = estadoDia(f);
    aviso.textContent = '';
    if (s.pasada || f >= limite) return;

    if (!e.llegada || e.salida) {
      if (!nocheDisponible(f, hoy, ocupadas)) {
        aviso.textContent = 'Esa noche ya está ocupada. Elige otra fecha de llegada.';
        return;
      }
      e.llegada = f;
      e.salida = null;
      cal.dataset.anim = 'inicio';
      setTimeout(() => delete cal.dataset.anim, 800);
    } else if (f <= e.llegada) {
      if (!nocheDisponible(f, hoy, ocupadas)) {
        aviso.textContent = 'Esa noche ya está ocupada. Elige otra fecha de llegada.';
        return;
      }
      e.llegada = f;
    } else {
      const r = validarEstadia(e.llegada, f, hoy, ocupadas);
      if (r === 'ocupada') {
        if (nocheDisponible(f, hoy, ocupadas)) {
          aviso.textContent = 'Hay noches ocupadas en el medio. Empezamos una nueva estadía desde ese día.';
          e.llegada = f;
        } else {
          aviso.textContent = 'Hay noches ocupadas en el medio. Elige una salida más cercana.';
        }
      } else {
        e.salida = f;
        cal.dataset.anim = 'rango';
        setTimeout(() => delete cal.dataset.anim, 1400);
      }
    }
    e.foco = f;
    render(true);
    actualizar();
  }

  function moverFoco(dias: number) {
    let f = sumarDias(e.foco, dias);
    if (f < hoy) f = hoy;
    const [ly, lm] = ultimoMes;
    const ultimoDia = iso(ly, lm, diasEnMes(ly, lm));
    if (f > ultimoDia) f = ultimoDia;
    e.foco = f;
    const [fy, fm] = partes(f);
    const idx = indiceMes([fy, fm]);
    if (idx < indiceMes(e.mes)) e.mes = [fy, fm];
    else if (idx > indiceMes(sumarMes(e.mes, mesesVisibles() - 1))) e.mes = sumarMes([fy, fm], -(mesesVisibles() - 1));
    render(true);
  }

  cal.addEventListener('click', (ev) => {
    const b = (ev.target as HTMLElement).closest<HTMLButtonElement>('[data-fecha]');
    if (b) elegir(b.dataset.fecha!);
  });

  cal.addEventListener('keydown', (ev) => {
    const b = (ev.target as HTMLElement).closest<HTMLButtonElement>('[data-fecha]');
    if (!b) return;
    e.foco = b.dataset.fecha!;
    const dow = (diaSemana(e.foco) + 6) % 7; // 0 = lunes
    const [fy, fm, fd] = partes(e.foco);
    const mapa: Record<string, () => void> = {
      ArrowLeft: () => moverFoco(-1),
      ArrowRight: () => moverFoco(1),
      ArrowUp: () => moverFoco(-7),
      ArrowDown: () => moverFoco(7),
      Home: () => moverFoco(-dow),
      End: () => moverFoco(6 - dow),
      PageUp: () => {
        const [py, pm] = sumarMes([fy, fm], -1);
        moverFoco(diferencia(e.foco, iso(py, pm, Math.min(fd, diasEnMes(py, pm)))));
      },
      PageDown: () => {
        const [ny, nm] = sumarMes([fy, fm], 1);
        moverFoco(diferencia(e.foco, iso(ny, nm, Math.min(fd, diasEnMes(ny, nm)))));
      },
    };
    if (mapa[ev.key]) {
      ev.preventDefault();
      mapa[ev.key]();
    }
  });

  // plan y ocasión
  raiz.querySelectorAll<HTMLInputElement>('input[name="plan"]').forEach((r) =>
    r.addEventListener('change', () => {
      e.plan = cfg.planes.find((p) => p.id === r.value)!;
      render();
      actualizar();
    }),
  );
  const chips = [...raiz.querySelectorAll<HTMLInputElement>('input[name="ocasion"]')];
  chips.forEach((c) =>
    c.addEventListener('change', () => {
      if (c.checked) chips.forEach((o) => o !== c && (o.checked = false));
      e.ocasion = c.checked ? c.value : null;
      actualizar();
    }),
  );

  function actualizar() {
    if (!e.llegada) {
      ayuda.textContent = 'Toca el día de llegada y después el de salida.';
    } else if (!e.salida) {
      ayuda.textContent = `Llegada: ${fechaLarga(e.llegada)}. Ahora toca el día de salida.`;
    } else {
      ayuda.textContent = 'Para cambiar las fechas, toca un nuevo día de llegada.';
    }

    if (!e.llegada || !e.salida) {
      totalPrevio = 0;
      resumen.innerHTML =
        '<p class="resumen__vacio">Cuando elijas tus fechas, aquí ves cada noche y el total estimado.</p>';
      bloquear(e.llegada ? 'Elige la fecha de salida.' : 'Elige la fecha de llegada.');
      return;
    }

    const c = cotizar(e.llegada, e.salida, e.plan, cfg);
    const n = c.noches.length;
    const filas = c.noches
      .map((x) => {
        const [, , d] = partes(x.fecha);
        const dia = DIAS[diaSemana(x.fecha)];
        const tarifa = x.especial ?? NOMBRE_TARIFA[x.tarifa];
        return `<tr><th scope="row">${dia} ${d} <span class="resumen__tarifa">${tarifa}</span></th><td>${x.precio == null ? 'por confirmar' : pesos(x.precio)}</td></tr>`;
      })
      .join('');
    resumen.innerHTML = `
      <p class="resumen__rango">${capital(rangoFechas(e.llegada, e.salida))}, ${n} ${n === 1 ? 'noche' : 'noches'}.</p>
      <p class="resumen__plan">${e.plan.nombre}${e.ocasion ? `. Celebran: ${e.ocasion}` : ''}.</p>
      <table><caption class="visually-hidden">Precio de cada noche</caption><tbody>${filas}</tbody></table>
      <p class="resumen__total"><span>Total estimado</span><strong><span aria-hidden="true" data-cuenta>${c.total == null ? 'Por confirmar' : pesos(totalPrevio)}</span><span class="visually-hidden">${c.total == null ? 'Por confirmar' : pesos(c.total)}</span></strong></p>
      <p class="resumen__sujeto">Sujeto a confirmación de disponibilidad.</p>`;

    if (c.total != null) contar(resumen.querySelector<HTMLElement>('[data-cuenta]')!, totalPrevio, c.total);
    totalPrevio = c.total ?? 0;

    const msg = armarMensaje({
      llegada: e.llegada,
      salida: e.salida,
      plan: e.plan,
      ocasion: e.ocasion,
      cotizacion: c,
    });
    enviar.href = enlaceWhatsApp(msg);
    enviar.target = '_blank';
    enviar.rel = 'noopener';
    enviar.removeAttribute('aria-disabled');
    enviar.removeAttribute('role');
    falta.textContent = 'Se abre WhatsApp con el mensaje listo; puedes editarlo antes de enviarlo.';
  }

  let totalPrevio = 0;
  const reducir = matchMedia('(prefers-reduced-motion: reduce)');
  function contar(el: HTMLElement, desde: number, hasta: number) {
    if (reducir.matches || desde === hasta) {
      el.textContent = pesos(hasta);
      return;
    }
    const t0 = performance.now();
    const dur = 900;
    const paso = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const k = p === 1 ? 1 : 1 - Math.pow(2, -10 * p); // expo out, termina exacto
      // redondeado a miles para que los dígitos no tiemblen
      el.textContent = pesos(Math.round((desde + (hasta - desde) * k) / 1000) * 1000);
      if (p < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  }

  function bloquear(texto: string) {
    enviar.removeAttribute('href');
    enviar.removeAttribute('target');
    enviar.setAttribute('aria-disabled', 'true');
    enviar.setAttribute('role', 'link');
    enviar.tabIndex = 0;
    falta.textContent = texto;
  }

  enviar.addEventListener('click', (ev) => {
    if (enviar.getAttribute('aria-disabled') === 'true') {
      ev.preventDefault();
      cal.querySelector<HTMLButtonElement>('[tabindex="0"]')?.focus();
    }
  });
  enviar.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' && enviar.getAttribute('aria-disabled') === 'true') {
      ev.preventDefault();
      cal.querySelector<HTMLButtonElement>('[tabindex="0"]')?.focus();
    }
  });

  ancho.addEventListener('change', () => render());
  render();
  actualizar();
}

const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
