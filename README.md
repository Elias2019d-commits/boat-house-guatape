# Boat House Guatapé

Sitio de una sola página para Boat House Guatapé, casa flotante con jacuzzi privado en el embalse de Guatapé. Hecho con Astro, sin frameworks de interfaz. Las reservas se arman en la página y se envían por WhatsApp: el sitio no cobra ni guarda datos.

- Diseño y decisiones: [DESIGN.md](DESIGN.md)
- Contexto del producto: [PRODUCT.md](PRODUCT.md)

## Trabajar en el sitio

Hace falta Node 22 o más nuevo.

```bash
npm install
npm run dev      # http://localhost:4321/boat-house-guatape/
npm test         # tests de precios, festivos, fechas y mensaje de WhatsApp
npm run build    # revisa tipos y genera dist/
```

## Cambiar precios

Todo está en [`src/data/precios.json`](src/data/precios.json). No hace falta tocar código.

- `planes`: cada plan tiene `semana` y `finde` (en pesos, sin puntos: `550000`). Si un precio todavía no está definido, déjalo en `null` y el sitio muestra "Precio por confirmar".
- Regla de tarifa: cada noche se cobra según el día en que empieza. De lunes a jueves es tarifa de semana; viernes, sábado y domingo, de fin de semana.
- `festivoComoFinde`: con `true`, la noche anterior a un festivo de Colombia también cobra fin de semana (por ejemplo, el lunes antes de un martes festivo). Con `false`, no. Los festivos se calculan solos: fijos, Ley Emiliani y los que dependen de la Pascua.
- `fechasEspeciales`: precios propios para temporadas (fin de año, Semana Santa). Ejemplo:

```json
"fechasEspeciales": [
  { "desde": "2026-12-24", "hasta": "2027-01-01", "nombre": "fin de año", "precios": { "noche": 900000, "extreme": 1200000 } }
]
```

`hasta` es la última noche con ese precio. Un plan que no aparece en `precios` usa su tarifa normal.

Después de cualquier cambio, corre `npm test` para confirmar que nada se rompió.

## Marcar fechas ocupadas

### A mano

En [`src/data/ocupado.json`](src/data/ocupado.json), agrega a `noches` cada noche ocupada, en formato `AAAA-MM-DD`. Una reserva del viernes 11 al domingo 13 de diciembre ocupa dos noches:

```json
"noches": ["2026-12-11", "2026-12-12"]
```

El domingo 13 queda libre para que otra pareja llegue ese día (la salida es a las 12:00 m.).

### Automático desde Airbnb, Booking o Google Calendar

1. Copia el link iCal del calendario de reservas (en Airbnb: Calendario → Disponibilidad → Exportar calendario).
2. En GitHub, ve a **Settings → Secrets and variables → Actions → New repository secret**, con el nombre `ICAL_URL` y el link como valor.
3. Listo: la acción **Sincronizar ocupación (iCal)** corre cada 3 horas, actualiza `ocupado.json` y vuelve a publicar el sitio si hubo cambios. También se puede correr a mano desde la pestaña **Actions**.

Si el secret no existe, la acción no hace nada.

## Reemplazar fotos

Las fotos están en [`src/assets/fotos/`](src/assets/fotos/) y se declaran en [`src/data/fotos.ts`](src/data/fotos.ts). Astro las optimiza solas (AVIF y WebP en varios tamaños), así que puedes subirlas en alta calidad.

1. Pon la foto nueva en `src/assets/fotos/` (JPG, hasta unos 2400 px de lado).
2. En `fotos.ts`, apunta el `import` correspondiente al archivo nuevo y actualiza su texto alternativo (`alt`): una frase que describa lo que se ve.
3. Si es una foto con título (`titulos` en `fotos.ts`), ajusta:
   - `horizonte`: la altura de la línea del agua, donde el agua toca la orilla o las montañas, de `0` (arriba) a `1` (abajo). Ejemplo: en una foto de 2000 px de alto con el agua a 1200 px, `horizonte: 0.6`. El título se apoya justo sobre esa línea.
   - `foco` y `focoY`: el punto que se conserva cuando la pantalla recorta la foto (de `0` a `1`, horizontal y vertical).
4. Para "Qué incluye", `incluyeFotos` asigna una foto a cada ítem. Usa solo fotos que muestren ese ítem de verdad; si un ítem no tiene foto, sácalo de `incluyeFotos` y se muestra una escena animada.

Revisa el resultado con `npm run dev` en celular y computadora.

## Publicar

El sitio se publica en GitHub Pages con cada `push` a `main` (acción **Publicar en GitHub Pages**). La acción corre los tests y, si pasan, compila y publica.

La primera vez, en el repositorio: **Settings → Pages → Source: GitHub Actions**.

Dirección actual: https://elias2019d-commits.github.io/boat-house-guatape/

### Dominio propio

Cuando haya dominio (por ejemplo `boathouseguatape.com`):

1. En [`astro.config.mjs`](astro.config.mjs), cambia `site` por el dominio y borra la línea `base`.
2. Cambia también la dirección del sitemap en [`public/robots.txt`](public/robots.txt).
3. Agrega `public/CNAME` con el dominio y configúralo en **Settings → Pages → Custom domain**.

## Pendientes de la clienta

Están marcados con `TODO(clienta)` en el código:

- Fotos originales en alta de la portada (casa al amanecer) y de la lancha: hoy están reescaladas con superresolución desde una versión chica. También las del paddle, los jet ski y el jacuzzi de noche, y una foto del parlante.
- Logo en vector (hoy es una versión provisoria en `public/logo.svg`).
- Precio del plan Sorpresa frente al agua.
- Regla de festivos (por defecto, la noche anterior a un festivo cobra fin de semana).
- Persona adicional y política de cancelación.
- Ubicación del muelle (para el mapa).
- Dominio.
