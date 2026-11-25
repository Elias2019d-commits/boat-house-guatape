/**
 * Fechas calendario puras ("YYYY-MM-DD"), sin hora ni zona horaria.
 * Todo el cálculo de noches y tarifas trabaja sobre estas cadenas para que
 * no haya corrimientos por zona horaria del navegador.
 */
export type ISO = string;

const pad = (n: number) => String(n).padStart(2, '0');

export function iso(y: number, m: number, d: number): ISO {
  return `${y}-${pad(m)}-${pad(d)}`;
}

export function partes(f: ISO): [number, number, number] {
  const [y, m, d] = f.split('-').map(Number);
  return [y, m, d];
}

/** Días desde 1970-01-01 (UTC), útil para sumar y restar sin zonas. */
function aDias(f: ISO): number {
  const [y, m, d] = partes(f);
  return Math.round(Date.UTC(y, m - 1, d) / 86_400_000);
}

function deDias(n: number): ISO {
  const dt = new Date(n * 86_400_000);
  return iso(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
}

export function sumarDias(f: ISO, n: number): ISO {
  return deDias(aDias(f) + n);
}

export function diferenciaDias(desde: ISO, hasta: ISO): number {
  return aDias(hasta) - aDias(desde);
}

/** 0 = domingo … 6 = sábado. */
export function diaSemana(f: ISO): number {
  return (aDias(f) + 4) % 7; // 1970-01-01 fue jueves
}

export function diasEnMes(y: number, m: number): number {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

/** Lista de noches de una estadía: desde la llegada hasta el día antes de la salida. */
export function noches(llegada: ISO, salida: ISO): ISO[] {
  const n = diferenciaDias(llegada, salida);
  return Array.from({ length: Math.max(0, n) }, (_, i) => sumarDias(llegada, i));
}

/** "Hoy" en Colombia, sin importar la zona del dispositivo. */
export function hoyEnBogota(ahora: Date = new Date()): ISO {
  const f = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(ahora);
  return f; // en-CA da YYYY-MM-DD
}

export const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];
export const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
export const DIAS_CORTOS = ['do', 'lu', 'ma', 'mi', 'ju', 'vi', 'sá'];

/** "viernes 11 de diciembre" (con año si se pide). */
export function fechaLarga(f: ISO, conAnio = false): string {
  const [y, m, d] = partes(f);
  const base = `${DIAS[diaSemana(f)]} ${d} de ${MESES[m - 1]}`;
  return conAnio ? `${base} de ${y}` : base;
}
