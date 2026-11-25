import { noches, type ISO } from './fechas';

export type Rechazo = 'pasada' | 'ocupada' | 'orden' | null;

/** Una noche se puede reservar si no es pasada ni está ocupada. */
export function nocheDisponible(f: ISO, hoy: ISO, ocupadas: Set<ISO>): boolean {
  return f >= hoy && !ocupadas.has(f);
}

/**
 * Valida una estadía. El día de salida puede ser una noche ocupada
 * (la casa se libera a las 12:00 m.), pero ninguna noche dentro de la estadía.
 */
export function validarEstadia(llegada: ISO, salida: ISO, hoy: ISO, ocupadas: Set<ISO>): Rechazo {
  if (salida <= llegada) return 'orden';
  if (llegada < hoy) return 'pasada';
  if (noches(llegada, salida).some((f) => ocupadas.has(f))) return 'ocupada';
  return null;
}
