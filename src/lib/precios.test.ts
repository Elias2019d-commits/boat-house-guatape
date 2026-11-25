import { describe, expect, it } from 'vitest';
import datos from '../data/precios.json';
import { cotizar, miles, pesos, type ConfigPrecios } from './precios';

const cfg = datos as ConfigPrecios;
const noche = cfg.planes.find((p) => p.id === 'noche')!;
const extreme = cfg.planes.find((p) => p.id === 'extreme')!;
const sorpresa = cfg.planes.find((p) => p.id === 'sorpresa')!;

const total = (a: string, b: string, plan = noche, c = cfg) => cotizar(a, b, plan, c).total;

describe('cotización, La noche en Boat House', () => {
  it.each([
    ['vie 11 → dom 13 dic 2026', '2026-12-11', '2026-12-13', 1_400_000],
    ['mar 15 → jue 17 dic 2026', '2026-12-15', '2026-12-17', 1_100_000],
    ['jue 10 → sáb 12 dic 2026', '2026-12-10', '2026-12-12', 1_250_000],
    ['dom 13 → mar 15 dic 2026', '2026-12-13', '2026-12-15', 1_250_000],
    ['lun 7 → mié 9 dic 2026 (8 dic festivo)', '2026-12-07', '2026-12-09', 1_250_000],
    ['dom 16 → lun 17 ago 2026', '2026-08-16', '2026-08-17', 700_000],
    ['cruce de año jue 31 dic → sáb 2 ene', '2026-12-31', '2027-01-02', 1_400_000],
    ['cruce de mes lun 30 nov → mié 2 dic', '2026-11-30', '2026-12-02', 1_100_000],
  ])('%s', (_, a, b, esperado) => {
    expect(total(a, b)).toBe(esperado);
  });

  it('desglosa tarifas', () => {
    const c = cotizar('2026-12-10', '2026-12-12', noche, cfg);
    expect(c.noches.map((n) => n.tarifa)).toEqual(['semana', 'finde']);
    expect(c.semana).toBe(1);
    expect(c.finde).toBe(1);
  });

  it('febrero de año bisiesto', () => {
    // 28 feb 2028 es lunes, 29 es martes
    const c = cotizar('2028-02-28', '2028-03-01', noche, cfg);
    expect(c.noches.map((n) => n.fecha)).toEqual(['2028-02-28', '2028-02-29']);
    expect(c.total).toBe(1_100_000);
  });
});

describe('reglas configurables', () => {
  it('festivoComoFinde en false', () => {
    expect(total('2026-12-07', '2026-12-09', noche, { ...cfg, festivoComoFinde: false })).toBe(1_100_000);
  });

  it('fecha especial pisa la tarifa', () => {
    const c: ConfigPrecios = {
      ...cfg,
      fechasEspeciales: [{ desde: '2026-12-24', hasta: '2026-12-31', nombre: 'fin de año', precios: { noche: 900_000 } }],
    };
    const r = cotizar('2026-12-23', '2026-12-25', noche, c);
    expect(r.noches.map((n) => n.precio)).toEqual([550_000, 900_000]);
    expect(r.especial).toBe(1);
    // plan sin precio especial usa la tarifa normal (jue 24, víspera del festivo 25 → finde)
    expect(cotizar('2026-12-24', '2026-12-25', extreme, c).total).toBe(1_010_000);
    expect(cotizar('2026-12-23', '2026-12-24', extreme, c).total).toBe(860_000);
  });

  it('Extreme Plan', () => {
    expect(total('2026-12-11', '2026-12-13', extreme)).toBe(2_020_000);
  });

  it('plan sin precio deja el total por confirmar', () => {
    expect(total('2026-12-11', '2026-12-13', sorpresa)).toBeNull();
  });
});

describe('formato', () => {
  it('pesos', () => {
    expect(pesos(1_400_000)).toBe('$1.400.000');
    expect(pesos(550_000)).toBe('$550.000');
  });
  it('miles', () => {
    expect(miles(550_000)).toBe('550');
    expect(miles(1_010_000)).toBe('1.010');
  });
});
