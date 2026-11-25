import { describe, expect, it } from 'vitest';
import { validarEstadia, nocheDisponible } from './estadia';
import { diaSemana, diasEnMes, hoyEnBogota, noches, sumarDias } from './fechas';

const ocupadas = new Set(['2026-12-18', '2026-12-19']);
const hoy = '2026-11-24';

describe('estadía', () => {
  it('rechaza cruzar una noche ocupada', () => {
    expect(validarEstadia('2026-12-17', '2026-12-20', hoy, ocupadas)).toBe('ocupada');
  });
  it('permite salir el día que empieza una noche ocupada', () => {
    expect(validarEstadia('2026-12-16', '2026-12-18', hoy, ocupadas)).toBeNull();
  });
  it('rechaza fechas pasadas y orden invertido', () => {
    expect(validarEstadia('2026-11-20', '2026-11-26', hoy, ocupadas)).toBe('pasada');
    expect(validarEstadia('2026-12-10', '2026-12-10', hoy, ocupadas)).toBe('orden');
  });
  it('noche disponible', () => {
    expect(nocheDisponible('2026-11-24', hoy, ocupadas)).toBe(true);
    expect(nocheDisponible('2026-11-23', hoy, ocupadas)).toBe(false);
    expect(nocheDisponible('2026-12-18', hoy, ocupadas)).toBe(false);
  });
});

describe('fechas', () => {
  it('cruces de mes y año', () => {
    expect(sumarDias('2026-12-31', 1)).toBe('2027-01-01');
    expect(sumarDias('2028-02-28', 1)).toBe('2028-02-29');
    expect(noches('2026-12-30', '2027-01-02')).toEqual(['2026-12-30', '2026-12-31', '2027-01-01']);
  });
  it('día de la semana', () => {
    expect(diaSemana('2026-12-11')).toBe(5);
    expect(diaSemana('2027-01-01')).toBe(5);
  });
  it('días en mes', () => {
    expect(diasEnMes(2028, 2)).toBe(29);
    expect(diasEnMes(2027, 2)).toBe(28);
  });
  it('hoy en Bogotá aunque en UTC ya sea mañana', () => {
    // 2026-11-25 03:00 UTC = 2026-11-24 22:00 en Bogotá
    expect(hoyEnBogota(new Date('2026-11-25T03:00:00Z'))).toBe('2026-11-24');
  });
});
