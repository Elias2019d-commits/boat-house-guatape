import { iso, sumarDias, diaSemana, type ISO } from './fechas';

/** Domingo de Pascua (algoritmo anónimo gregoriano / Meeus-Jones-Butcher). */
export function domingoDePascua(y: number): ISO {
  const a = y % 19;
  const b = Math.floor(y / 100);
  const c = y % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;
  return iso(y, mes, dia);
}

/** Ley Emiliani: si no cae lunes, pasa al lunes siguiente. */
function alLunes(f: ISO): ISO {
  const dow = diaSemana(f);
  return dow === 1 ? f : sumarDias(f, (8 - dow) % 7);
}

const cache = new Map<number, Set<ISO>>();

/** Festivos de Colombia para un año (Ley 51 de 1983). */
export function festivosColombia(y: number): ISO[] {
  const fijos: [number, number][] = [[1, 1], [5, 1], [7, 20], [8, 7], [12, 8], [12, 25]];
  const emiliani: [number, number][] = [[1, 6], [3, 19], [6, 29], [8, 15], [10, 12], [11, 1], [11, 11]];
  const pascua = domingoDePascua(y);
  const lista = [
    ...fijos.map(([m, d]) => iso(y, m, d)),
    ...emiliani.map(([m, d]) => alLunes(iso(y, m, d))),
    sumarDias(pascua, -3), // jueves santo
    sumarDias(pascua, -2), // viernes santo
    sumarDias(pascua, 43), // Ascensión (lunes)
    sumarDias(pascua, 64), // Corpus Christi (lunes)
    sumarDias(pascua, 71), // Sagrado Corazón (lunes)
  ];
  return [...new Set(lista)].sort();
}

export function esFestivo(f: ISO): boolean {
  const y = Number(f.slice(0, 4));
  let s = cache.get(y);
  if (!s) {
    s = new Set(festivosColombia(y));
    cache.set(y, s);
  }
  return s.has(f);
}
