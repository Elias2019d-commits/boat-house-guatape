import { diaSemana, noches, sumarDias, type ISO } from './fechas';
import { esFestivo } from './festivos';

export interface Plan {
  id: string;
  nombre: string;
  resumen: string;
  detalle?: string;
  semana: number | null;
  finde: number | null;
  todo?: string;
}

export interface FechaEspecial {
  desde: ISO;
  hasta: ISO; // inclusive: última noche con este precio
  nombre: string;
  precios: Record<string, number>;
}

export interface ConfigPrecios {
  moneda: string;
  festivoComoFinde: boolean;
  planes: Plan[];
  fechasEspeciales: FechaEspecial[];
}

export type Tarifa = 'semana' | 'finde' | 'especial';

export interface Noche {
  fecha: ISO;
  tarifa: Tarifa;
  precio: number | null;
  especial?: string;
}

/**
 * Tarifa de una noche según el día en que empieza.
 * vie, sáb, dom → fin de semana. Lun–jue → semana, salvo que el día siguiente
 * sea festivo y `festivoComoFinde` esté activo.
 */
export function tarifaBase(fecha: ISO, festivoComoFinde: boolean): 'semana' | 'finde' {
  const dow = diaSemana(fecha);
  if (dow === 5 || dow === 6 || dow === 0) return 'finde';
  if (festivoComoFinde && esFestivo(sumarDias(fecha, 1))) return 'finde';
  return 'semana';
}

export function precioNoche(fecha: ISO, plan: Plan, cfg: ConfigPrecios): Noche {
  const esp = cfg.fechasEspeciales.find(
    (e) => fecha >= e.desde && fecha <= e.hasta && e.precios[plan.id] != null,
  );
  if (esp) return { fecha, tarifa: 'especial', precio: esp.precios[plan.id], especial: esp.nombre };
  const tarifa = tarifaBase(fecha, cfg.festivoComoFinde);
  return { fecha, tarifa, precio: plan[tarifa] };
}

export interface Cotizacion {
  noches: Noche[];
  total: number | null; // null si algún precio está por confirmar
  semana: number;
  finde: number;
  especial: number;
}

export function cotizar(llegada: ISO, salida: ISO, plan: Plan, cfg: ConfigPrecios): Cotizacion {
  const lista = noches(llegada, salida).map((f) => precioNoche(f, plan, cfg));
  const total = lista.some((n) => n.precio == null)
    ? null
    : lista.reduce((s, n) => s + (n.precio as number), 0);
  return {
    noches: lista,
    total,
    semana: lista.filter((n) => n.tarifa === 'semana').length,
    finde: lista.filter((n) => n.tarifa === 'finde').length,
    especial: lista.filter((n) => n.tarifa === 'especial').length,
  };
}

/** $1.400.000 */
export function pesos(n: number): string {
  return '$' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** 550.000 → "550"; 1.010.000 → "1.010" (miles, para la celda del calendario). */
export function miles(n: number): string {
  return Math.round(n / 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
