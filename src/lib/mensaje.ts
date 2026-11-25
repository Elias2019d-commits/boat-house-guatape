import { fechaLarga, partes, type ISO } from './fechas';
import { pesos, type Cotizacion, type Plan } from './precios';

export const WHATSAPP = '573117197851';

export interface Solicitud {
  llegada: ISO;
  salida: ISO;
  plan: Plan;
  ocasion?: string | null;
  cotizacion: Cotizacion;
}

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

/** "del viernes 11 al domingo 13 de diciembre" */
export function rangoFechas(llegada: ISO, salida: ISO): string {
  const [y1, m1] = partes(llegada);
  const [y2, m2] = partes(salida);
  if (y1 !== y2) return `del ${fechaLarga(llegada, true)} al ${fechaLarga(salida, true)}`;
  if (m1 !== m2) return `del ${fechaLarga(llegada)} al ${fechaLarga(salida)}`;
  const [dia, num] = fechaLarga(llegada).split(' ');
  return `del ${dia} ${num} al ${fechaLarga(salida)}`;
}

/** "(2 noches de fin de semana)" / "(1 noche de semana y 1 de fin de semana)" */
export function detalleTarifas(c: Cotizacion): string {
  const partesTxt: string[] = [];
  const items: [number, string][] = [
    [c.semana, 'semana'],
    [c.finde, 'fin de semana'],
    [c.especial, 'fecha especial'],
  ];
  const presentes = items.filter(([n]) => n > 0);
  presentes.forEach(([n, nombre], i) => {
    partesTxt.push(i === 0 ? `${plural(n, 'noche', 'noches')} de ${nombre}` : `${n} de ${nombre}`);
  });
  if (partesTxt.length <= 1) return partesTxt.join('');
  return partesTxt.slice(0, -1).join(', ') + ' y ' + partesTxt[partesTxt.length - 1];
}

export function armarMensaje(s: Solicitud): string {
  const n = s.cotizacion.noches.length;
  const lineas = [
    `Hola, Boat House. Quiero reservar ${rangoFechas(s.llegada, s.salida)} (${plural(n, 'noche', 'noches')}), para 2 personas.`,
    `Plan: ${s.plan.nombre}.`,
  ];
  if (s.ocasion) lineas.push(`Celebramos: ${s.ocasion}.`);
  lineas.push(
    s.cotizacion.total == null
      ? 'Total: por confirmar.'
      : `Total estimado: ${pesos(s.cotizacion.total)} (${detalleTarifas(s.cotizacion)}).`,
  );
  lineas.push('¿Me confirman disponibilidad?');
  return lineas.join('\n');
}

export function enlaceWhatsApp(mensaje: string): string {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
}
