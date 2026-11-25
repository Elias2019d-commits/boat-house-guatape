# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (estático) + TypeScript, CSS propio con custom properties, islas en TS plano, Vitest. Deploy en GitHub Pages con `withastro/action` (cuenta `Elias2019d-commits`). Definido por el brief (`PROMPT-claude-code.md`).

## Users

Parejas que llegan desde Instagram (@boat_house_guatape, 20,7 mil seguidores), casi siempre en el celular, que quieren una noche especial cerca de Medellín: aniversario, cumpleaños, pedida o "solo porque sí". Deciden mirando fotos y precios, y reservan por WhatsApp.

## Product Purpose

Reemplazar el Linktree por una página que muestre la casa, aclare qué incluye y cuánto cuesta, y deje la solicitud de reserva lista para enviar por WhatsApp. Éxito: más mensajes de WhatsApp con fechas, plan y total ya resueltos, y menos preguntas repetidas.

## Positioning

Una casa bote para dos, sola en el embalse de Guatapé, con jacuzzi privado en la cubierta y la Piedra del Peñol al frente. Se llega en lancha. Nada de esto lo puede decir un glamping en tierra.

## Operating Context

- Reserva 100 % por WhatsApp (+57 311 719 7851). El sitio no cobra ni guarda datos.
- Ocupación hoy desconocida: se carga a mano en `ocupado.json`; más adelante, iCal por GitHub Action.
- Lanchas y jet ski: @nauticaguatape.

## Capabilities and Constraints

- Planes por pareja y por noche: La noche en Boat House, Extreme Plan, Sorpresa frente al agua (precio pendiente).
- Tarifa por día de inicio de la noche: lun–jue semana, vie–dom fin de semana; festivos colombianos pendientes de confirmar (por defecto la noche previa a festivo cobra fin de semana).
- Check-in 3:00 p. m., check-out 12:00 m.
- Pendientes (nunca inventar): fotos/videos originales, logo vector, precio Sorpresa, regla de festivos, persona adicional, cancelación, ubicación del muelle, dominio.

## Brand Commitments

Identidad aprobada en `Boat House Guatapé - Propuesta de identidad visual.pdf`: concepto "la línea del agua", paleta Bruma/Espuma/Embalse/Agua/Noche/Teca/Ocaso, Spectral + Hanken Grotesk, logo de una sola tinta. Tono cercano, español de Colombia, tuteo, minúscula de oración.

Decisiones confirmadas el 2026-11-24: el plan 2 se llama "Extreme Plan"; en Qué incluye va "wifi y TV" (sin nombrar Starlink); el mensaje de WhatsApp dice "para 2 personas".

## Evidence on Hand

- Fotos provisorias en `assets/fotos/` (comprimidas, algunas con marca de agua).
- Logo provisorio en `assets/logo/`.
- Precios en `assets/referencia-precios/`.
- Una reseña real: «La mejor experiencia, vale totalmente la pena hospedarse en esta cabaña y la atención 10/10.» — @luisamarcelo_23. No hay más reseñas: no inventar.

## Product Principles

1. La casa y el embalse hablan; la web se hace a un lado.
2. Llegar a WhatsApp con todo resuelto: fechas, plan, total.
3. Nunca afirmar un dato que la clienta no confirmó.
4. Pensado primero para el celular que viene de Instagram.

## Accessibility & Inclusion

WCAG AA: foco visible, calendario/galería/acordeón con ARIA correcto, textos alternativos descriptivos, `prefers-reduced-motion` respetado. Agua (#6B827D) nunca en texto chico.
