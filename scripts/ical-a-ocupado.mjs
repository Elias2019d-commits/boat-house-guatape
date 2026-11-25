#!/usr/bin/env node
/**
 * Lee un calendario iCal (Airbnb, Booking o Google Calendar) desde la variable
 * de entorno ICAL_URL y reescribe src/data/ocupado.json con las noches ocupadas.
 *
 * Cada evento ocupa las noches desde su inicio (DTSTART) hasta el día anterior a
 * su fin (DTEND), que es como Airbnb y Booking exportan las reservas.
 * Si no hay ICAL_URL, no hace nada.
 */
import { readFile, writeFile } from 'node:fs/promises';

const url = process.env.ICAL_URL;
if (!url) {
  console.log('Sin ICAL_URL: no se actualiza la ocupación.');
  process.exit(0);
}

const destino = new URL('../src/data/ocupado.json', import.meta.url);

const res = await fetch(url, { headers: { 'user-agent': 'boat-house-sitio/1.0' } });
if (!res.ok) {
  console.error(`No se pudo leer el calendario (${res.status}).`);
  process.exit(1);
}
const texto = (await res.text()).replace(/\r?\n[ \t]/g, ''); // líneas plegadas

const aISO = (v) => {
  const m = v.match(/(\d{4})(\d{2})(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
};
const sumarDia = (iso, n) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

const noches = new Set();
for (const bloque of texto.split('BEGIN:VEVENT').slice(1)) {
  const inicio = aISO(bloque.match(/^DTSTART[^:]*:(.+)$/m)?.[1] ?? '');
  const finRaw = bloque.match(/^DTEND[^:]*:(.+)$/m)?.[1];
  if (!inicio) continue;
  const fin = finRaw ? aISO(finRaw) : sumarDia(inicio, 1);
  for (let d = inicio; d < fin; d = sumarDia(d, 1)) noches.add(d);
}

const hoy = new Date().toISOString().slice(0, 10);
const lista = [...noches].filter((d) => d >= sumarDia(hoy, -1)).sort();

const anterior = JSON.parse(await readFile(destino, 'utf8'));
if (JSON.stringify(anterior.noches) === JSON.stringify(lista)) {
  console.log('Sin cambios en la ocupación.');
  process.exit(0);
}

await writeFile(
  destino,
  JSON.stringify(
    {
      fuente: 'ical',
      actualizado: new Date().toISOString().slice(0, 10),
      nota: anterior.nota,
      noches: lista,
    },
    null,
    2,
  ) + '\n',
);
console.log(`Ocupación actualizada: ${lista.length} noches.`);
