import { describe, expect, it } from 'vitest';
import datos from '../data/precios.json';
import { cotizar, type ConfigPrecios } from './precios';
import { armarMensaje, enlaceWhatsApp, rangoFechas } from './mensaje';

const cfg = datos as ConfigPrecios;
const plan = (id: string) => cfg.planes.find((p) => p.id === id)!;

function solicitud(llegada: string, salida: string, id = 'noche', ocasion: string | null = 'aniversario') {
  return { llegada, salida, plan: plan(id), ocasion, cotizacion: cotizar(llegada, salida, plan(id), cfg) };
}

describe('mensaje de WhatsApp', () => {
  it('el ejemplo del brief', () => {
    expect(armarMensaje(solicitud('2026-12-11', '2026-12-13'))).toBe(
      [
        'Hola, Boat House. Quiero reservar del viernes 11 al domingo 13 de diciembre (2 noches), para 2 personas.',
        'Plan: La noche en Boat House.',
        'Celebramos: aniversario.',
        'Total estimado: $1.400.000 (2 noches de fin de semana).',
        '¿Me confirman disponibilidad?',
      ].join('\n'),
    );
  });

  it('sin ocasión no lleva la línea', () => {
    expect(armarMensaje(solicitud('2026-12-11', '2026-12-12', 'noche', null))).not.toContain('Celebramos');
  });

  it('tarifas mezcladas y una noche', () => {
    const m = armarMensaje(solicitud('2026-12-10', '2026-12-12'));
    expect(m).toContain('(1 noche de semana y 1 de fin de semana)');
    expect(armarMensaje(solicitud('2026-12-15', '2026-12-16'))).toContain('(1 noche), para 2 personas');
  });

  it('plan sin precio', () => {
    expect(armarMensaje(solicitud('2026-12-11', '2026-12-13', 'sorpresa'))).toContain('Total: por confirmar.');
  });

  it('rangos con cruce de mes y de año', () => {
    expect(rangoFechas('2026-11-30', '2026-12-02')).toBe('del lunes 30 de noviembre al miércoles 2 de diciembre');
    expect(rangoFechas('2026-12-31', '2027-01-02')).toBe(
      'del jueves 31 de diciembre de 2026 al sábado 2 de enero de 2027',
    );
  });

  it('codifica la URL', () => {
    const url = enlaceWhatsApp('Hola, ¿sí?\nPlan: $1.400.000');
    expect(url).toBe('https://wa.me/573117197851?text=Hola%2C%20%C2%BFs%C3%AD%3F%0APlan%3A%20%241.400.000');
  });
});
