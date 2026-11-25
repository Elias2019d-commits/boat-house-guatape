/**
 * Agua viva en la portada (WebGL).
 *
 * La foto de portada se dibuja en un canvas y todo lo que está debajo de su línea del
 * agua se comporta como agua: oleaje suave permanente, y ondas reales (que deforman el
 * reflejo) donde cae una gota. Al abrir la página caen gotas frente a la casa mientras
 * la escena se abre, y el agua se calma. Después, tocar el agua (celular) o pasar el
 * mouse (computadora) genera ondas.
 *
 * Se carga solo con JS, sin "reducir movimiento" y si el dispositivo tiene WebGL.
 * Si algo falla, la foto normal queda en su lugar.
 */

const MAX_GOTAS = 10;

const VERT = `
attribute vec2 a;
varying vec2 v;
void main() {
  v = vec2(a.x * 0.5 + 0.5, 0.5 - a.y * 0.5);
  gl_Position = vec4(a, 0.0, 1.0);
}`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D foto;
uniform sampler2D mascara; // blanco = agua; negro = casa (no se mueve)
uniform vec4 rect;      // posición de la foto dentro del canvas (x, y, ancho, alto), 0 a 1
uniform float hz;       // línea del agua, 0 a 1 desde arriba
uniform float tiempo;
uniform float aspecto;  // ancho / alto del canvas
uniform float calma;    // intensidad del oleaje (1 = normal)
uniform vec4 gotas[${MAX_GOTAS}]; // x, y, inicio, fuerza
varying vec2 v;

void main() {
  vec2 p = v;
  float prof = clamp((p.y - hz) / max(0.001, 1.0 - hz), 0.0, 1.0);
  vec2 base = clamp((p - rect.xy) / rect.zw, 0.0, 1.0);
  float agua = smoothstep(hz + 0.002, hz + 0.045, p.y) * texture2D(mascara, base).r;

  // oleaje: bandas horizontales que se juntan cerca del horizonte (perspectiva)
  float fase = 1.5 / (max(p.y - hz, 0.0) + 0.025);
  float o1 = sin(fase * 9.0 + tiempo * 1.25 + sin(p.x * 6.0 + tiempo * 0.5) * 1.3);
  float o2 = sin(fase * 5.0 - tiempo * 0.85 + p.x * 10.0);
  vec2 off = vec2(o1 * 0.0032 + o2 * 0.0018, o2 * 0.0022) * prof * calma;
  float brillo = o1 * 0.018 * prof * min(calma, 2.0);

  for (int i = 0; i < ${MAX_GOTAS}; i++) {
    vec4 g = gotas[i];
    float dt = tiempo - g.z;
    if (g.w > 0.0 && dt > 0.0 && dt < 5.0) {
      float pg = clamp((g.y - hz) / max(0.001, 1.0 - hz), 0.08, 1.0);
      float aplana = mix(0.2, 0.5, pg);
      vec2 q = p - g.xy;
      q.x *= aspecto;
      q.y /= aplana;
      float r = length(q);
      float frente = dt * (0.12 + 0.26 * pg);
      float d = r - frente;
      // anillos detrás del frente de la onda, que se apagan con el tiempo y la distancia
      float env = exp(-max(-d, 0.0) * 9.0 / pg) * smoothstep(0.025 * pg, 0.0, d);
      float h = sin(d * 95.0 / pg) * env * g.w * exp(-dt * 0.75) / (1.0 + r * 4.0);
      vec2 dir = normalize(vec2(q.x / aspecto, q.y * aplana) + vec2(1e-5));
      off += dir * h * 0.014 * pg;
      brillo += h * 0.07;
    }
  }

  off *= agua;
  brillo *= agua;
  vec2 uv = clamp((p + off - rect.xy) / rect.zw, 0.001, 0.999);
  vec3 c = texture2D(foto, uv).rgb + brillo;
  gl_FragColor = vec4(c, 1.0);
}`;

export function iniciarAguaGL(escena: HTMLElement) {
  const contenedor = escena.querySelector<HTMLElement>('.escena__foto');
  const img = contenedor?.querySelector('img');
  if (!contenedor || !img) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'agua-gl';
  canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, premultipliedAlpha: false });
  if (!gl) return;

  const shader = (tipo: number, src: string) => {
    const s = gl.createShader(tipo)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vs = shader(gl.VERTEX_SHADER, VERT);
  const fs = shader(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = (n: string) => gl.getUniformLocation(prog, n);
  const uRect = u('rect');
  const uHz = u('hz');
  const uTiempo = u('tiempo');
  const uAspecto = u('aspecto');
  const uCalma = u('calma');
  const uGotas = u('gotas');

  const nuevaTextura = (unidad: number) => {
    const t = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unidad);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return t;
  };
  const tex = nuevaTextura(0);
  gl.uniform1i(u('foto'), 0);
  // máscara: mientras no carga (o si la foto no tiene), todo lo de abajo del horizonte es agua
  const texMascara = nuevaTextura(1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, 1, 1, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, new Uint8Array([255]));
  gl.uniform1i(u('mascara'), 1);
  const urlMascara = escena.dataset.mascara;
  if (urlMascara) {
    const m = new Image();
    m.onload = () => {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, texMascara);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, gl.LUMINANCE, gl.UNSIGNED_BYTE, m);
    };
    m.src = urlMascara;
  }

  const hzFoto = Number(getComputedStyle(escena).getPropertyValue('--hz')) || 0.5;
  const gotas = new Float32Array(MAX_GOTAS * 4);
  let siguiente = 0;
  const t0 = performance.now();
  const ahora = () => (performance.now() - t0) / 1000;
  let calma = 1;
  let hzCanvas = 0.5;
  let aspecto = 1;
  let listo = false;

  function medir() {
    const w = contenedor!.clientWidth;
    const h = contenedor!.clientHeight;
    if (!w || !h) return;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const escala = Math.min(1, 1800 / (w * dpr));
    canvas.width = Math.round(w * dpr * escala);
    canvas.height = Math.round(h * dpr * escala);
    gl!.viewport(0, 0, canvas.width, canvas.height);
    // posición de la foto sin transformaciones (offset*), relativa al contenedor
    const x = img!.offsetLeft / w;
    const y = img!.offsetTop / h;
    const iw = img!.offsetWidth / w;
    const ih = img!.offsetHeight / h;
    gl!.uniform4f(uRect, x, y, iw, ih);
    hzCanvas = y + hzFoto * ih;
    gl!.uniform1f(uHz, hzCanvas);
    aspecto = w / h;
    gl!.uniform1f(uAspecto, aspecto);
  }

  function gota(x: number, y: number, fuerza: number, retraso = 0) {
    const i = siguiente++ % MAX_GOTAS;
    gotas.set([x, y, ahora() + retraso, fuerza], i * 4);
  }

  function subirFoto() {
    try {
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, tex);
      gl!.pixelStorei(gl!.UNPACK_FLIP_Y_WEBGL, false);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGB, gl!.RGB, gl!.UNSIGNED_BYTE, img!);
      return true;
    } catch {
      return false;
    }
  }

  // ---------- bucle (solo mientras la portada se ve) ----------
  let visible = true;
  let corriendo = false;
  function cuadro() {
    if (!visible || document.hidden) {
      corriendo = false;
      return;
    }
    gl!.uniform1f(uTiempo, ahora());
    gl!.uniform1f(uCalma, calma);
    gl!.uniform4fv(uGotas, gotas);
    gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    if (!listo) {
      listo = true;
      escena.classList.add('gl-activo');
    }
    requestAnimationFrame(cuadro);
  }
  function arrancar() {
    if (!corriendo) {
      corriendo = true;
      requestAnimationFrame(cuadro);
    }
  }
  new IntersectionObserver(([x]) => {
    visible = x.isIntersecting;
    if (visible) arrancar();
  }).observe(escena);
  document.addEventListener('visibilitychange', () => !document.hidden && arrancar());

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    escena.classList.remove('gl-activo');
    visible = false;
    canvas.remove();
  });

  // ---------- la apertura: gotas mientras la escena se abre y el agua se calma ----------
  function apertura() {
    const inicio = ahora();
    const yAgua = (f: number) => hzCanvas + (1 - hzCanvas) * f;
    gota(0.5, yAgua(0.42), 1.4, 0.35);
    gota(0.3, yAgua(0.62), 0.9, 1.0);
    gota(0.72, yAgua(0.3), 0.7, 1.6);
    const calmar = () => {
      const t = ahora() - inicio;
      // empieza agitada y se asienta en 3,5 s
      calma = 1 + 4 * Math.pow(Math.max(0, 1 - t / 3.5), 2);
      if (t < 3.5) requestAnimationFrame(calmar);
      else calma = 1;
    };
    calmar();
    pista();
  }

  // en el celular, una pista discreta: "Toca el agua" (se va al primer toque)
  function pista() {
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const el = document.createElement('p');
    el.className = 'agua-pista';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<span class="agua-pista__ondas"><i></i><i></i></span>Toca el agua';
    escena.appendChild(el);
    const quitar = () => {
      el.classList.remove('ver');
      setTimeout(() => el.remove(), 700);
    };
    setTimeout(() => el.classList.add('ver'), 3200);
    setTimeout(quitar, 10000);
    escena.addEventListener('agua:toque', quitar, { once: true });
  }

  // ---------- tocar el agua ----------
  const enAgua = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    return y > hzCanvas + 0.015 && y < 1 && x > 0 && x < 1 ? [x, y] : null;
  };
  escena.addEventListener('pointerdown', (e) => {
    const p = enAgua(e);
    if (p) {
      gota(p[0], p[1], 1);
      escena.dispatchEvent(new CustomEvent('agua:toque'));
    }
  });
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let ultima = 0;
    escena.addEventListener('pointermove', (e) => {
      const t = performance.now();
      if (t - ultima < 140 || Math.hypot(e.movementX, e.movementY) < 4) return;
      const p = enAgua(e);
      if (!p) return;
      ultima = t;
      gota(p[0], p[1], 0.35);
    });
  }

  // ---------- montaje ----------
  const montar = () => {
    if (!subirFoto()) return;
    contenedor.appendChild(canvas);
    medir();
    new ResizeObserver(medir).observe(contenedor);
    arrancar();
    if (escena.classList.contains('visto')) apertura();
    else
      new MutationObserver((_, obs) => {
        if (escena.classList.contains('visto')) {
          obs.disconnect();
          apertura();
        }
      }).observe(escena, { attributes: true, attributeFilter: ['class'] });
  };
  if (img.complete && img.naturalWidth) montar();
  else img.addEventListener('load', montar, { once: true });
}
