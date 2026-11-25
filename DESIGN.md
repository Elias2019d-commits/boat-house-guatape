# Boat House Guatapé: plan de diseño

Fuente de verdad: la propuesta aprobada (PDF) y `PROMPT-claude-code.md`. Este documento no cambia paleta, tipografías ni concepto. Define cómo se ejecutan.

Decisiones confirmadas el 2026-11-24:
- El plan 2 se llama **Extreme Plan**.
- En Qué incluye va **wifi y TV**. No se nombra Starlink.
- El mensaje de WhatsApp incluye **"para 2 personas"**.

---

## 1. Tokens

### 1.1 Color

```css
--bruma:   #E5E8E2;  /* fondo principal, mañana */
--espuma:  #F6F7F3;  /* superficies claras, texto sobre foto */
--velo:    #D3DCD6;  /* Bruma con velo de Agua, día */
--embalse: #2F4437;  /* marca: títulos, botón principal */
--agua:    #6B827D;  /* líneas, íconos, texto ≥ 24 px. Nunca texto chico */
--noche:   #13201D;  /* texto de lectura, secciones de noche */
--teca:    #8C5B36;  /* precios, avisos */
--ocaso:   #E8A45F;  /* solo el botón reservar sobre oscuro */
```

Pares de texto que se usan (todos de la tabla aprobada):

| Contexto | Texto | Fondo | Contraste |
|---|---|---|---|
| Lectura (mañana y día) | Noche | Bruma / Velo | 13,6:1 / ~11:1 |
| Títulos y botón principal | Embalse | Bruma | 8,5:1 |
| Precios sobre claro | Teca | Espuma | 5,3:1 |
| Lectura de noche | Bruma | Noche | 13,6:1 |
| Reservar sobre oscuro | Noche sobre botón Ocaso / Ocaso como texto | Noche | 7,9:1 |
| Atardecer | Espuma / Bruma | Embalse | ≥ 8:1 |
| Sobre foto | Espuma | foto + velo de legibilidad local (ver 1.7) | — |

Precios en las secciones de noche: en Ocaso no (es el acento único del botón). Van en Bruma con peso 400; Teca queda para precios sobre Espuma (tarjetas de plan claras y resumen).

**El día al bajar.** Cuatro capas `position: fixed` detrás del contenido (Bruma, Velo, Atardecer, Noche). Cada sección declara su momento con `data-momento`. Un solo `IntersectionObserver` + `scroll` pasivo con `requestAnimationFrame` interpola **solo la `opacity`** de cada capa a lo largo de una zona de transición de ~60 vh entre secciones. Nunca se anima `background-color`. Sin JS o con reduced motion, cada sección pinta su propio fondo sólido (corte suave, sin interpolación).

Capa Atardecer: Embalse con luz Ocaso que entra. No es un degradé decorativo de borde a borde: es un resplandor radial grande, de baja intensidad (Ocaso al 22 % → 0), anclado abajo a la derecha, como el sol entrando de costado. Es el mismo recurso de la página 5 del PDF.

### 1.2 Tipografía

Autoalojadas en `woff2`, `font-display: swap`. Preload solo de las dos críticas: Spectral 200 (título de portada) y Hanken Grotesk variable.

| Archivo | Uso |
|---|---|
| Spectral 200 | portada y títulos de sección |
| Spectral 300 | subtítulos, frases |
| Spectral 300 italic | **solo** reseñas |
| Spectral 400 | precio grande del resumen |
| Hanken Grotesk variable (400–600) | texto, botones, calendario, formularios |

Escala (mobile / desktop), con `clamp()` entre 360 y 1440 px:

| Token | Tamaño | Fuente | Interlineado | Tracking |
|---|---|---|---|---|
| `--t-portada` | 64 → 72 px | Spectral 200 | 1.02 | −0,02 em |
| `--t-titulo` | 36 → 48 px | Spectral 200/300 | 1.08 | −0,015 em |
| `--t-sub` | 24 → 28 px | Spectral 300 | 1.25 | −0,005 em |
| `--t-texto` | 17 → 18 px | Hanken 400 | 1.6 | 0 |
| `--t-frase` | 20 → 22 px | Spectral 300 (bajadas) | 1.5 | 0 |
| `--t-detalle` | 14 px | Hanken 450 | 1.45 | 0,005 em |

- Medida máxima: `max-width: 62ch` en texto Hanken y `68ch` en Spectral. Nunca más de 80 caracteres.
- Todo en minúscula de oración. Nada de `text-transform: uppercase`.
- Cifras: `font-variant-numeric: tabular-nums` en el calendario y el desglose. Nada de monoespaciadas.

### 1.3 Espaciado

Escala base 4 px con pasos nombrados:

```
--s-1: 4px   --s-2: 8px   --s-3: 12px  --s-4: 16px  --s-5: 24px
--s-6: 32px  --s-7: 48px  --s-8: 64px  --s-9: 96px  --s-10: 144px
--gutter:  clamp(20px, 5vw, 64px)          /* margen lateral */
--seccion: clamp(112px, 16vw, 224px)       /* aire entre secciones */
```

El aire entre secciones (`--seccion`) es deliberadamente grande. Dentro de una sección el ritmo es más apretado (s-5 a s-7), así cada bloque se lee como una unidad.

Grilla desktop: 12 columnas, `--gutter` como margen, columnas de 24 px de separación. El texto vive en las columnas 1–6 (izquierda). Las fotos van de borde a borde o desde la columna 5 hasta el borde derecho.

### 1.4 Radios y bordes

```
--r-foto:   3px    /* fotos y tarjetas */
--r-campo:  4px    /* días del calendario, campos */
--r-pill:   999px  /* solo botones y chips de ocasión */
--linea:    1px solid color-mix(in srgb, var(--agua) 45%, transparent)
```

### 1.5 Sombras

Casi ninguna. Las tarjetas se separan por tono (Espuma sobre Bruma) y por una línea Agua, no por sombra.
- `--sombra-flotante: 0 8px 24px -12px rgb(19 32 29 / .35)`: solo para el botón flotante de reservar y el visor de la galería.

### 1.6 Movimiento

Curvas (de la skill de Emil Kowalski):

```
--ease-out:    cubic-bezier(0.23, 1, 0.32, 1);    /* respuestas a la persona */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);   /* algo que ya está en pantalla y se mueve */
--ease-agua:   cubic-bezier(0.33, 0, 0.15, 1);    /* el momento de carga: lento al final, sin rebote */
```

Duraciones:

| Token | ms | Dónde |
|---|---|---|
| `--d-toque` | 140 | botón presionado (`scale(.97)`), chip |
| `--d-corta` | 200 | selección de día, cambio de plan, foco |
| `--d-media` | 280 | acordeón (contenido: opacity + translateY 4 px; la altura usa `grid-template-rows` sin animarla, ver 5.3), pasos de reserva |
| `--d-visor` | 360 | abrir y cerrar el visor de la galería |
| `--d-carga` | 1600 | el único momento orquestado (portada) |

Solo `transform` y `opacity`. Con `prefers-reduced-motion: reduce`: no hay movimiento. Los cambios de estado quedan como fundido de opacidad de 120 ms o instantáneos, el reflejo queda quieto y las capas de fondo no se interpolan.

**El momento de carga (único).** Portada:
1. 0–900 ms: el título aparece **desde la línea del agua hacia arriba**. Cada línea está en un contenedor con `overflow: hidden` cuyo borde inferior es la línea del agua; el texto entra con `translateY(100%) → 0` y `opacity .0 → 1`, con `--ease-agua`. Retraso de 120 ms entre línea y línea.
2. 500–1600 ms: el reflejo se forma debajo: `opacity 0 → .18` y `scaleY(.6) → 1` desde la línea del agua (`transform-origin: top`).
3. 1100–1600 ms: bajada y botón: solo opacity.

Nada más en el sitio se anima solo. Sin fade-up por sección.

**La ondulación del reflejo.** Filtro SVG `feTurbulence` + `feDisplacementMap` aplicado **una vez** al reflejo (estático, escala 3–4 px). Con el scroll, el reflejo se desplaza unos pocos px en X (`transform`), como dice la página 10: "su reflejo se mueve suave con el scroll". El filtro no se anima (sería caro y no es transform/opacity). Con reduced motion, queda quieto.

### 1.7 Título sobre la línea del agua

Componente `<TituloAgua>`:

```astro
<TituloAgua foto={portada} horizonte={0.56} foco={0.5} nivel="portada">
  Vive una experiencia sobre el agua
</TituloAgua>
```

- La foto va con `object-fit: cover`. Como el recorte depende del viewport, la línea del agua **en pantalla** se calcula: con la relación de aspecto de la foto, la del contenedor y `object-position`, se obtiene la `y` real del horizonte. Se resuelve en CSS con custom properties y `@container` (sin JS) para los casos comunes y un script de 20 líneas de respaldo en `resize` para los demás.
- La **línea base** de la última línea del título queda sobre esa `y` (se compensa el descendente de Spectral con `text-box-trim` donde exista y una corrección medida donde no).
- Reflejo: el mismo texto, `aria-hidden="true"`, `transform: scaleY(-1)`, `opacity: .18`, `mask-image: linear-gradient(to bottom, #000 0, transparent 70%)` (máscara funcional, no decorativa), ondulación SVG.
- Legibilidad sobre la foto: un velo **local** solo detrás del bloque de texto (Noche al 35 % → 0, radial y difuso), nunca un filtro sobre la foto entera.

Horizontes medidos sobre las fotos provisorias (se cambian en `src/data/fotos.ts` al llegar las originales):

| Foto | Sección | `horizonte` |
|---|---|---|
| `portada.jpg` | Portada | 0.56 |
| `hero-dia.jpg` | La casa | 0.48 |
| `incluye-terraza.jpg` | Qué incluye | 0.50 |
| `agua-paddle.jpg` | En el agua | 0.30 |
| `hero-atardecer.jpg` | Galería | 0.36 |
| `hero-noche.jpg` | Reserva | 0.49 |

### 1.8 Íconos

Set propio de 11 íconos en SVG inline, grilla de 24 px, trazo 1,25 px, `stroke-linecap: round`, sin relleno, color `currentColor` (Agua o Embalse). Dibujados a partir de objetos reales de la casa: lancha, jacuzzi con vapor, taza y pan, kayak, paddle, malla, parrilla, olla, onda wifi + pantalla, parlante, cama. Ningún ícono de librería, ningún emoji.

---

## 2. Revisión del plan contra lo genérico

Lo que haría por defecto para "glamping de lujo" y lo que cambio:

| Reflejo genérico | Qué hago en su lugar |
|---|---|
| Fondo crema con acento dorado | Bruma (gris verdoso) y Teca solo en precios |
| Tres tarjetas de plan idénticas con sombra | Lista editorial: cada plan es una fila con foto pequeña, nombre en Spectral y precios en dos columnas, separada por una línea Agua. El plan elegido se marca con borde Embalse de 1,5 px, como en la página 11 |
| Grilla de 11 íconos en cuadrícula de tarjetas | Lista en dos columnas, ícono + texto en línea, sin cajas |
| Galería en masonry con hover zoom | Tira horizontal con scroll snap, sin hover; filtros como pestañas de texto subrayadas |
| Eyebrow "NUESTRA CASA" sobre cada título | Sin etiquetas. El título dice lo que es |
| Testimonios en carrusel de tarjetas | Una cita grande en Spectral itálica sobre el atardecer, sola |
| Fade-up en cada sección | Nada. Un solo momento al cargar |

---

## 3. Recorrido y wireframes

Ancho de referencia: mobile 390 px, desktop 1440 px. `▓` = foto, `~~~` = línea del agua, `╌╌╌` = reflejo, `[ ]` = botón.

### Navegación

```
MOBILE                                DESKTOP
┌──────────────────────────────┐      ┌────────────────────────────────────────────────────────────┐
│ logo(espuma)            ≡    │      │ logo     la casa  qué incluye  galería  preguntas  [reservar]│
└──────────────────────────────┘      └────────────────────────────────────────────────────────────┘
```
- Sobre la portada: transparente, logo y links en Espuma. Al pasar la portada: Bruma al 92 % con línea inferior Agua, logo en Noche. Sin `backdrop-filter`.
- Mobile: menú en hoja a pantalla completa, fondo Noche, links en Spectral 300 24 px.

### 1. Portada · mañana

```
MOBILE (390 × 100svh)                 DESKTOP (1440 × 100svh)
┌──────────────────────────────┐      ┌────────────────────────────────────────────────────────────┐
│▓▓ logo ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ≡ ▓▓│      │▓ logo ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ nav ▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│      │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓ Vive una ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│      │▓  Vive una experiencia ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓ experiencia ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│      │▓  sobre el agua ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓ sobre el agua ▓▓▓▓▓▓▓▓▓▓▓▓▓▓│      │~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~│ ← 56 %
│~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~│      │▓  ╌╌╌╌╌ ╌╌╌╌╌╌╌╌ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓ ╌╌╌╌ ╌╌╌╌ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│      │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│      │▓  Casa flotante con jacuzzi privado    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓ Casa flotante con jacuzzi ▓▓│      │▓  en el embalse de Guatapé, pensada    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓ privado en el embalse de ▓▓▓│      │▓  para dos. Te llevamos en lancha.     ▓▓▓ [ver fechas disp.]▓│
│▓ Guatapé, pensada para dos. ▓│      └────────────────────────────────────────────────────────────┘
│▓ Te llevamos en lancha. ▓▓▓▓▓│
│▓ [   ver fechas disponibles ]│      Botón: pill Ocaso con texto Noche (la portada es oscura).
└──────────────────────────────┘
```
- `portada.jpg` es apaisada: en mobile se recorta a los lados con `object-position: 38% 50%`, así el horizonte sigue al 56 %.
- La bajada y el botón quedan en el tercio inferior, sobre el agua. El botón lleva a `#reserva` con scroll suave (instantáneo con reduced motion).

### 2. La casa · mañana (Bruma)

```
MOBILE                                DESKTOP
┌──────────────────────────────┐      ┌────────────────────────────────────────────────────────────┐
│▓▓▓▓▓▓▓▓ hero-dia ▓▓▓▓▓▓▓▓▓▓▓▓│      │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ hero-dia (borde a borde, 82vh) ▓▓▓▓▓▓▓▓▓│
│▓ La casa ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│      │▓  La casa ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~│      │~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~│
│▓ ╌╌╌╌╌ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│      │▓  ╌╌╌╌╌ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│      └────────────────────────────────────────────────────────────┘
├──────────────────────────────┤
│                              │      ┌───────────────────────────┬────────────────────────────────┐
│ Dos niveles sobre el agua.   │      │ Dos niveles sobre el agua. │ ▓▓▓▓▓▓▓▓ casa-interior ▓▓▓▓▓▓▓▓│
│ (Spectral 300, frase)        │      │                            │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│                              │      │ Ventanales de piso a techo,│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│ Ventanales de piso a techo,  │      │ jacuzzi privado en la      │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│ jacuzzi privado en la        │      │ cubierta y una terraza     │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│ cubierta y una terraza arriba│      │ arriba con vista abierta al├─────────────┬──────────────────┤
│ con el Peñol al fondo.       │      │ embalse y la Piedra del    │▓ estructura ▓│ (aire)          │
│ Cama queen.                  │      │ Peñol al fondo. Cama queen.│▓▓▓▓▓▓▓▓▓▓▓▓▓│                  │
│ ▓▓▓▓▓▓ casa-interior ▓▓▓▓▓▓▓▓│      └───────────────────────────┴─────────────┴──────────────────┘
│ ▓▓▓▓▓▓ casa-estructura ▓▓▓▓▓▓│      Texto: columnas 1–5. Fotos: columnas 7–12, la segunda más
└──────────────────────────────┘      chica y desfasada hacia abajo (asimetría, no grilla de tarjetas).
```

### 3. Qué incluye · día (Velo)

```
MOBILE                                DESKTOP
┌──────────────────────────────┐      ┌────────────────────────────────────────────────────────────┐
│▓▓▓▓ incluye-terraza ▓▓▓▓▓▓▓▓▓│      │▓▓▓▓▓▓▓▓▓▓▓▓▓ incluye-terraza (borde a borde, 70vh) ▓▓▓▓▓▓▓▓▓▓│
│▓ Qué incluye ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│      │▓  Qué incluye ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~│      │~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~│
│▓ ╌╌╌╌╌╌╌ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│      └────────────────────────────────────────────────────────────┘
└──────────────────────────────┘
 Por pareja, por noche.                ┌───────────────────────┬────────────────────────────────────┐
                                       │ Por pareja, por noche. │ ⌇ traslado en lancha  ⌇ cama queen │
 ⌇ traslado en lancha                  │                        │ ⌇ jacuzzi privado     ⌇ zona BBQ   │
 ⌇ jacuzzi privado                     │ check-in 3:00 p. m.    │ ⌇ ingredientes para   ⌇ cocina     │
 ⌇ ingredientes para el desayuno       │ check-out 12:00 m.     │   el desayuno           dotada     │
 ⌇ kayak                               │                        │ ⌇ kayak               ⌇ wifi y TV  │
 ⌇ paddle board                        │ Con costo adicional:   │ ⌇ paddle board        ⌇ parlante   │
 ⌇ malla catamarán                     │ mini-bar (bebidas y    │ ⌇ malla catamarán       JBL        │
 ⌇ zona BBQ                            │ mecato). (Teca)        │                                    │
 ⌇ cocina dotada                       └───────────────────────┴────────────────────────────────────┘
 ⌇ wifi y TV                           Lista en 2 columnas, sin cajas, ícono Agua 24 px + texto
 ⌇ parlante JBL                        Hanken 18 px, separador Agua de 1 px entre filas.
 ⌇ cama queen
 ─────────────
 Con costo adicional: mini-bar
 (bebidas y mecato).
 Check-in 3:00 p. m.
 Check-out 12:00 m.
```

### 4. En el agua · día (Velo)

```
MOBILE                                DESKTOP
┌──────────────────────────────┐      ┌──────────────────────────────┬─────────────────────────────┐
│▓▓ agua-paddle ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│      │▓▓▓▓▓▓▓▓▓▓ agua-paddle ▓▓▓▓▓▓▓│                             │
│▓ En el agua ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│      │▓ En el agua ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ Kayak y paddle board        │
│~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~│      │~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~│ incluidos, a la hora que    │
│▓ ╌╌╌╌╌╌ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│      │▓ ╌╌╌╌╌╌ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ quieras.                    │
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│      │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│                             │
└──────────────────────────────┘      │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ ▓▓ agua-kayak ▓▓▓▓▓▓▓▓▓▓▓▓▓ │
 Kayak y paddle board incluidos,      └──────────────────────────────┴─────────────────────────────┘
 a la hora que quieras.
                                       ┌──────────────┬───────────────────────────────────────────┐
 ▓▓▓▓▓ agua-kayak ▓▓▓▓▓▓▓▓▓▓▓▓▓▓      │▓ agua-jetski ▓│ Jet ski, aparte                           │
                                       │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ Una hora de jet ski con sonido, dentro    │
 ▓▓ agua-jetski ▓▓                     │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ del Extreme Plan. Lanchas y jet ski de    │
 Jet ski, aparte                       │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ @nauticaguatape.     ver el Extreme Plan  │
 Una hora con sonido, dentro del       └──────────────┴───────────────────────────────────────────┘
 Extreme Plan. Lanchas y jet ski
 de @nauticaguatape.
 ver el Extreme Plan (link subrayado)
```

### 5. Galería · atardecer (Embalse + Ocaso)

```
MOBILE                                DESKTOP
┌──────────────────────────────┐      ┌────────────────────────────────────────────────────────────┐
│▓▓ hero-atardecer ▓▓▓▓▓▓▓▓▓▓▓▓│      │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ hero-atardecer (78vh) ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓ Galería ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│      │▓ Galería ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~│      │~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~│
└──────────────────────────────┘      └────────────────────────────────────────────────────────────┘
 día  atardecer  noche  interior       día   atardecer   noche   interior    (pestañas, subrayado
 ‾‾‾                                   ‾‾‾                                    Espuma en la activa)
┌──────────────────┐┌───────          ┌──────────────┐┌──────────────────────┐┌──────────────┐┌────
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓││▓▓▓▓▓▓▓          │▓▓▓▓▓▓▓▓▓▓▓▓▓▓││▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓││▓▓▓▓▓▓▓▓▓▓▓▓▓▓││▓▓▓▓
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓││▓▓▓▓▓▓▓          │▓▓▓▓▓▓▓▓▓▓▓▓▓▓││▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓││▓▓▓▓▓▓▓▓▓▓▓▓▓▓││▓▓▓▓
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓││▓▓▓▓▓▓▓          └──────────────┘└──────────────────────┘└──────────────┘└────
└──────────────────┘└───────          Tira con scroll-snap; cada foto respeta su proporción, altura
 ‹ 3 de 8 ›                            fija 62vh. Flechas de texto ‹ › a la derecha, sin hover.
 Desliza con el dedo; la siguiente asoma 15 %.
```

Visor ampliado (`<dialog>` nativo, `aria-modal`): fondo Noche al 96 %, foto centrada, `‹ ›` y cerrar con ← → Esc, swipe en touch, foco atrapado y devuelto a la miniatura al cerrar. Texto alternativo visible como pie (Hanken 14 px, Bruma). Las fotos mantienen su color: sin filtro ni velo.

### 6. Reseñas · atardecer

```
MOBILE                                DESKTOP
                                       ┌────────────────────────────────────────────────────────────┐
 «La mejor experiencia, vale           │        «La mejor experiencia, vale totalmente la pena      │
 totalmente la pena hospedarse         │        hospedarse en esta cabaña y la atención 10/10.»     │
 en esta cabaña y la atención          │        (Spectral 300 italic, 36 px, Espuma, columnas 2–9)   │
 10/10.»                               │                                                            │
 (Spectral 300 italic 28 px)           │        @luisamarcelo_23                                    │
                                       │                                                            │
 @luisamarcelo_23                      │        Somos 20,7 mil en Instagram. ver @boat_house_guatape│
                                       └────────────────────────────────────────────────────────────┘
 Somos 20,7 mil en Instagram.
 ver @boat_house_guatape
```
- Estructura de datos `src/data/resenas.json` (`texto`, `autor`, `fuente`, `url?`). Con una reseña: cita sola. Con dos o más: lista vertical, sin carrusel automático.
- Ocaso no se usa en texto aquí: el resplandor de fondo hace el trabajo de la luz.

### 7. Planes, precios y reserva · noche (`#reserva`)

```
MOBILE                                DESKTOP
┌──────────────────────────────┐      ┌────────────────────────────────────────────────────────────┐
│▓▓ hero-noche ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│      │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ hero-noche (64vh) ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓ Planes y reserva ▓▓▓▓▓▓▓▓▓▓▓│      │▓ Planes y reserva ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~│      │~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~│
└──────────────────────────────┘      └────────────────────────────────────────────────────────────┘

 Precios por pareja, por noche.        Precios por pareja, por noche.
                                                                   semana       fin de semana
 ▓▓ La noche en Boat House             ▓▓ La noche en Boat House   $550.000     $700.000
    semana $550.000                    ───────────────────────────────────────────────────────────
    fin de semana $700.000             ▓▓ Extreme Plan             $860.000     $1.010.000
 ──────────────────────                   + 1 h de jet ski con sonido (motor 1630)
 ▓▓ Extreme Plan                       ───────────────────────────────────────────────────────────
    semana $860.000                    ▓▓ Sorpresa frente al agua  precio por confirmar
    fin de semana $1.010.000              globos, flores y pétalos
 ──────────────────────                Semana: noches que empiezan lunes a jueves.
 ▓▓ Sorpresa frente al agua            Fin de semana: viernes, sábado y domingo.
    precio por confirmar
```

Reserva en 3 pasos. Mobile: pasos uno debajo del otro, el resumen se arma a medida. Desktop: tres columnas como en la página 11.

```
MOBILE                                DESKTOP
 1. Elige tus fechas                  ┌───────────────────┬───────────────────┬───────────────────┐
 ┌──────────────────────────────┐     │ 1. Elige tus      │ 2. Elige tu plan  │ 3. Envía por      │
 │ diciembre 2026          ‹  › │     │    fechas         │                   │    WhatsApp       │
 │ lu  ma  mi  ju  vi  sá  do   │     │ diciembre 2026 ‹› │ ┌───────────────┐ │ 2 noches          │
 │      1   2   3   4  ̶5̶  ̶6̶    │     │ lu ma mi ju vi sá │ │La noche en B.H│ │ vie 11 · $700.000 │
 │     550 550 550 700           │     │  …calendario…     │ └───────────────┘ │ sáb 12 · $700.000 │
 │  7   8   9  10 [11][12][13]   │     │                   │ ┌───────────────┐ │ ───────────────── │
 │ 700 700 550 550 700 700 700   │     │ ■ tu estadía      │ │Extreme Plan   │ │ total estimado    │
 │ …                             │     │ ̶o̶ ocupado         │ └───────────────┘ │ $1.400.000        │
 └──────────────────────────────┘     │                   │ ┌───────────────┐ │ sujeto a confirm. │
 ■ tu estadía   ̶o̶ ocupado              │                   │ │Sorpresa…      │ │                   │
                                       │                   │ └───────────────┘ │ ┌───────────────┐ │
 2. Elige tu plan                      │                   │ ¿Celebran algo?   │ │ mensaje armado│ │
 ( ) La noche en Boat House            │                   │ (aniversario)     │ └───────────────┘ │
 ( ) Extreme Plan                      │                   │ (cumpleaños)      │                   │
 ( ) Sorpresa frente al agua           │                   │ (pedida)          │ [Enviar solicitud │
 ¿Celebran algo?                       │                   │ (solo porque sí)  │  por WhatsApp]    │
 (aniversario)(cumpleaños)(pedida)     │                   │                   │ La web no cobra ni│
 (solo porque sí)                      │                   │                   │ guarda datos.     │
                                       └───────────────────┴───────────────────┴───────────────────┘
 3. Envía por WhatsApp
 2 noches · desglose · total
 [  Enviar solicitud por WhatsApp  ]
 La web no cobra ni guarda datos: la reserva se confirma por WhatsApp.
```
Nota: en el wireframe `vie 11 · $700.000` usa punto medio solo como separador dentro del dibujo. En el sitio el desglose es una tabla de dos columnas (noche / precio), sin "A · B".

Botón de envío: pill Ocaso, texto Noche, 56 px de alto. Mientras falte algo (fechas o plan), queda deshabilitado con un texto que dice qué falta ("Elige la fecha de salida").

**Calendario.** Celdas de 44 × 52 px como mínimo en mobile (día + precio abreviado "550" / "700" en 11 px Bruma al 70 %, en miles). Patrón ARIA *grid* de fechas (APG): flechas, Inicio/Fin, RePág/AvPág para mes, Enter/Espacio para elegir; `aria-selected`, `aria-disabled` y etiqueta completa ("viernes 11 de diciembre, tarifa fin de semana, $700.000"). Ocupadas: número tachado, `aria-disabled`, texto "ocupado". Una estadía no puede cruzar una noche ocupada; si se intenta, aviso en línea en Teca. El día de salida puede ser un día ocupado (se libera a las 12:00 m.). Mobile: un mes por vez. Desktop: un mes por vez (dos en ≥ 1280 px).

### 8. Preguntas frecuentes · noche

```
MOBILE / DESKTOP (columnas 1–8)
 Preguntas
 ───────────────────────────────────────────
 ¿Cómo se llega?                          +
 ───────────────────────────────────────────
 El traslado en lancha está incluido. Te
 pasamos el punto de encuentro por WhatsApp.
 ───────────────────────────────────────────
 ¿Qué actividades incluye?                +
 ¿Tiene wifi?                             +
 ¿Hay dónde poner música?                 +
 ¿Tenemos que llevar bebidas?             +
 Horarios                                 +
 ───────────────────────────────────────────
```
- `<button aria-expanded aria-controls>` + región. El `+` es un trazo SVG que rota 45° (`transform`).
- Sin título con foto: aquí no hay horizonte y no se fuerza el gesto.

### 9. Cómo llegar y contacto · noche

```
MOBILE                                DESKTOP
 Cómo llegar                          ┌───────────────────────────┬────────────────────────────────┐
                                      │ Cómo llegar               │  ┌──────────────────────────┐  │
 Salimos en lancha desde el muelle.   │                           │  │  mapa del muelle         │  │
 Te pasamos el punto exacto por       │ Salimos en lancha desde   │  │  TODO: falta ubicación   │  │
 WhatsApp.                            │ el muelle. Te pasamos el  │  │  (bloque Noche + línea)  │  │
 ┌──────────────────────────────┐     │ punto exacto por WhatsApp.│  └──────────────────────────┘  │
 │ mapa: TODO ubicación         │     │                           │                                │
 └──────────────────────────────┘     │ WhatsApp +57 311 719 7851 │                                │
 WhatsApp +57 311 719 7851            │ Instagram @boat_house_…   │                                │
 Instagram @boat_house_guatape        │ TikTok                    │                                │
 TikTok                               ├───────────────────────────┴────────────────────────────────┤
 ─────────────                        │ logo (Bruma)          Embalse de Guatapé, Antioquia        │
 logo (Bruma)                         └────────────────────────────────────────────────────────────┘
```
- El mapa no se embebe todavía (no hay ubicación). Queda un bloque con `TODO` visible en el código y, en el sitio, el texto "Te pasamos la ubicación del muelle por WhatsApp".
- El link de TikTok sale del Linktree. **Lo necesito** (ver Pendientes).

### Botón flotante de reservar (mobile)

```
 ┌──────────────────────────────┐
 │ …contenido…                  │
 │                              │
 │ [ reservar ]                 │  ← pill Embalse sobre claro / Ocaso sobre oscuro,
 └──────────────────────────────┘    abajo a la izquierda, 48 px de alto
```
- Abajo a la **izquierda** con `env(safe-area-inset-bottom)`, para no tapar el botón de WhatsApp del sistema (que suele ir a la derecha).
- Aparece cuando la portada sale de pantalla y se oculta mientras `#reserva` está visible (opacity + translateY 8 px, 200 ms).
- El documento tiene `padding-bottom` igual a su altura en mobile, así nunca tapa el final de la página.

---

## 4. Lógica de precios

### 4.1 Datos: `src/data/precios.json`

```json
{
  "moneda": "COP",
  "festivoComoFinde": true,
  "planes": [
    { "id": "noche",    "nombre": "La noche en Boat House",  "semana": 550000, "finde": 700000 },
    { "id": "extreme",  "nombre": "Extreme Plan",            "semana": 860000, "finde": 1010000,
      "detalle": "alojamiento una noche + 1 hora de jet ski con sonido, motor 1630" },
    { "id": "sorpresa", "nombre": "Sorpresa frente al agua", "semana": null,   "finde": null,
      "detalle": "globos, flores y pétalos", "todo": "TODO: precio pendiente de la clienta" }
  ],
  "fechasEspeciales": [
    // { "desde": "2026-12-24", "hasta": "2027-01-01", "nombre": "fin de año", "precios": { "noche": 900000 } }
  ]
}
```

`ocupado.json`: `{ "noches": ["2026-12-05", "2026-12-06", …], "actualizado": "…", "fuente": "manual" }`. Cada fecha es una **noche** (la que empieza ese día).

### 4.2 Regla

Para cada noche (identificada por la fecha en que empieza):

1. Si la fecha cae en un rango de `fechasEspeciales` y ese rango tiene precio para el plan → ese precio.
2. Si no, si el día es viernes, sábado o domingo → `finde`.
3. Si no, si `festivoComoFinde` y **el día siguiente** es festivo en Colombia → `finde`.
4. Si no → `semana`.

Total = suma de las noches. Noches = días entre llegada y salida. Se trabaja con fechas calendario puras (`YYYY-MM-DD`, sin hora ni zona) para evitar errores de zona horaria; "hoy" se toma en `America/Bogota`.

Plan sin precio (Sorpresa): se puede elegir; el resumen dice "precio por confirmar" en lugar del total y el mensaje dice "Total: por confirmar".

### 4.3 Festivos de Colombia (`src/lib/festivos.ts`)

- Fijos: 1 ene, 1 may, 20 jul, 7 ago, 8 dic, 25 dic.
- Ley Emiliani (pasan al lunes siguiente si no caen lunes): 6 ene, 19 mar, 29 jun, 15 ago, 12 oct, 1 nov, 11 nov.
- Según la Pascua (algoritmo de Butcher): jueves y viernes santo (−3, −2); Ascensión (+43), Corpus Christi (+64) y Sagrado Corazón (+71), los tres ya en lunes.

Resultado calculado para 2026 (va en los tests):
`01-01, 01-12, 03-23, 04-02, 04-03, 05-01, 05-18, 06-08, 06-15, 06-29, 07-20, 08-07, 08-17, 10-12, 11-02, 11-16, 12-08, 12-25`

Y 2027:
`01-01, 01-11, 03-22, 03-25, 03-26, 05-01, 05-10, 05-31, 06-07, 07-05, 07-20, 08-07, 08-16, 10-18, 11-01, 11-15, 12-08, 12-25`

### 4.4 Ejemplos (plan La noche en Boat House)

| Estadía | Noches | Tarifa por noche | Total |
|---|---|---|---|
| vie 11 → dom 13 dic 2026 | 2 | vie finde 700 + sáb finde 700 | **$1.400.000** (el ejemplo del brief) |
| mar 15 → jue 17 dic 2026 | 2 | mar 550 + mié 550 | **$1.100.000** |
| jue 10 → sáb 12 dic 2026 | 2 | jue semana 550 + vie finde 700 | **$1.250.000** |
| dom 13 → mar 15 dic 2026 | 2 | dom finde 700 + lun 550 | **$1.250.000** |
| lun 7 → mié 9 dic 2026 | 2 | lun **finde** 700 (8 dic es festivo) + mar 550 | **$1.250.000** |
| dom 16 → lun 17 ago 2026 | 1 | dom finde 700 (también víspera de festivo) | **$700.000** |
| jue 31 dic 2026 → sáb 2 ene 2027 (cruce de año) | 2 | jue **finde** 700 (1 ene festivo) + vie 700 | **$1.400.000** |
| lun 30 nov → mié 2 dic 2026 (cruce de mes) | 2 | lun 550 + mar 550 | **$1.100.000** |

Extreme Plan, vie 11 → dom 13 dic 2026: 1.010.000 × 2 = **$2.020.000**.

Con `festivoComoFinde: false`, el caso "lun 7 → mié 9 dic" queda en $1.100.000.

### 4.5 Mensaje de WhatsApp

```
Hola, Boat House. Quiero reservar del viernes 11 al domingo 13 de diciembre (2 noches), para 2 personas.
Plan: La noche en Boat House.
Celebramos: aniversario.
Total estimado: $1.400.000 (2 noches de fin de semana).
¿Me confirman disponibilidad?
```
- Si las noches mezclan tarifas: "(1 noche de semana y 1 de fin de semana)".
- Si cruza de año, se nombra el año: "del jueves 31 de diciembre de 2026 al sábado 2 de enero de 2027".
- Sin ocasión elegida, la línea "Celebramos" no va.
- Formato de pesos: `Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })` normalizado a `$1.400.000` (sin espacio).
- URL: `https://wa.me/573117197851?text=` + `encodeURIComponent(mensaje)`.

### 4.6 Tests (Vitest)

- `festivos.test.ts`: las 18 fechas de 2026 y las 18 de 2027 exactas.
- `precios.test.ts`: todos los ejemplos de 4.4, `festivoComoFinde` en false, fecha especial que pisa la tarifa, plan sin precio.
- `calendario.test.ts`: rango que cruza una noche ocupada se rechaza, salida en día ocupado se permite, fechas pasadas en zona Bogotá, cruce de mes y de año, 29 de febrero (2028).
- `mensaje.test.ts`: el mensaje del brief exacto, la codificación de la URL, sin ocasión, plan sin precio, cruce de año.

---

## 5. Implementación

### 5.1 Estructura

```
src/
  data/       precios.json  ocupado.json  resenas.json  fotos.ts (ruta, alt, horizonte, foco, categoría)
  lib/        festivos.ts  precios.ts  fechas.ts  mensaje.ts   (+ *.test.ts)
  components/ TituloAgua.astro  Nav.astro  Icono.astro  Calendario.astro  Reserva.astro
              Galeria.astro  Preguntas.astro  BotonReservar.astro
  scripts/    momentos.ts  calendario.ts  reserva.ts  galeria.ts  titulo-agua.ts
  styles/     tokens.css  base.css
  pages/      index.astro
scripts/ical-a-ocupado.mjs
.github/workflows/deploy.yml  sync-ical.yml
```

Reemplazar una foto = cambiar el archivo en `src/assets/fotos/` y su `horizonte` en `fotos.ts`. Todo pasa por `astro:assets` (`<Picture>` con AVIF/WebP, `srcset`, `width`/`height`, `loading="lazy"` salvo la portada, que va `eager` con `fetchpriority="high"`).

### 5.2 Disponibilidad

- Ahora: `ocupado.json` a mano.
- `sync-ical.yml`: cron cada 3 h; si no existe el secret `ICAL_URL`, termina sin hacer nada. Si existe, descarga el iCal, convierte cada evento en noches, reescribe `ocupado.json`, y si cambió, hace commit y dispara el deploy.

### 5.3 Notas técnicas

- Acordeón: `grid-template-rows: 0fr → 1fr` cambia sin transición; lo que se anima es la opacidad y un `translateY(4px)` del contenido. Cumple "solo transform y opacity".
- Galería: `scroll-snap-type: x mandatory`, `overscroll-behavior-x: contain`, `touch-action: pan-x pan-y`.
- Botón presionado: `scale(.97)` en 140 ms. Sin hover decorativo en tarjetas; los links se subrayan.
- Foco: `outline: 2px solid` en Embalse sobre claro y Ocaso sobre oscuro, `outline-offset: 3px`.
- Datos estructurados `LodgingBusiness` con `checkinTime` 15:00, `checkoutTime` 12:00, teléfono, dirección en Guatapé (Antioquia, CO), `priceRange` "$550.000–$1.010.000".

---

## 6. Pendientes de la clienta (quedan como `TODO` en el código)

- Fotos y videos originales.
- Logo en vector.
- Precio del plan Sorpresa.
- Regla de festivos (por defecto: la noche previa a festivo cobra fin de semana).
- Persona adicional y política de cancelación.
- Ubicación del muelle.
- Dominio.
- **Link de TikTok** del Linktree: no lo tengo. Si no me lo pasas, queda con `TODO` y sin link.


---

## 7. Movimiento premium (cambio pedido el 2026-11-24)

Después de ver la primera versión, se pidió un sitio más premium y con más animación, tomando como referencia de nivel (no para copiar) otro sitio. Esto reemplaza la regla de "un solo momento al cargar". Se mantiene todo lo demás de la identidad. Todo el movimiento depende de la clase `html.movido`, que solo se pone con JS y sin `prefers-reduced-motion`: sin ella, el sitio se ve quieto y completo.

| Momento | Qué pasa | Dónde |
|---|---|---|
| Intro (primera visita de la sesión) | Fondo Noche, se dibuja la línea del agua, el logo sale de ella con su reflejo ondulado y el horizonte se parte en dos para mostrar la casa. Se salta con un clic o una tecla. | `Intro.astro` |
| Escenas con título | La foto se abre desde su propia línea del agua (clip-path), con zoom de 1,22 a 1; la línea se traza y se desvanece; las palabras del título emergen del agua una a una y el reflejo se forma debajo. | `TituloAgua.astro` |
| Parallax | La foto y su título se mueven juntos (el título nunca se despega del horizonte). La portada baja más lento que el scroll. | `movimiento.ts` |
| Textos | Suben enfocándose (opacidad, 28 px y desenfoque a nítido), escalonados. | `movimiento.css` |
| Fotos sueltas | Se abren desde el centro, como un horizonte, con zoom suave. | `movimiento.css` |
| Qué incluye | Recorrido: al bajar, el ítem que cruza la línea de referencia se ilumina (línea que se traza, ícono y texto que avanzan) y la foto fija de al lado se abre desde el horizonte con la escena de ese ítem. En desktop también responde al pasar el mouse. Los íconos se dibujan trazo a trazo. | `QueIncluye.astro` |
| Reseña | Palabra por palabra, de borroso a nítido. | `movimiento.css` |
| Galería (desktop) | La sección se fija y el scroll vertical mueve la tira en horizontal, con parallax dentro de cada foto y línea de progreso. La miniatura se transforma en la foto ampliada (View Transitions). En celular, deslizar con el dedo. | `Galeria.astro` |
| Botones | El relleno sube al pasar el mouse y el botón sigue un poco al cursor (magnético). | `movimiento.css` |
| Barra | Se esconde al bajar y vuelve al subir; una línea fina avanza con el recorrido. | `Nav.astro` |
| Calendario | Al elegir la salida, el rango se llena noche por noche; la llegada y la salida aparecen creciendo suave, sin rebote; el total cuenta hasta su valor. | `calendario.css`, `reserva.ts` |
| Preguntas | La respuesta se despliega con altura animada y el + gira a ×. | `Preguntas.astro` |
| Cierre | "Nos vemos sobre el agua.": la línea cruza la pantalla y la frase sale de ella con su reflejo ondulando, seguida del botón de fechas. | `Despedida.astro` |
| Scroll | Suave con inercia (Lenis) solo con mouse o trackpad. | `movimiento.ts` |

Portada: foto de la casa entera al amanecer (`casa-amanecer.jpg`, horizonte 0,60). TODO(clienta): original en alta resolución, la del kit es de 720 × 1280.
