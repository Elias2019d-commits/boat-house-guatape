/**
 * Fotos del sitio.
 *
 * Fotos originales de la clienta (noviembre 2026). Tres siguen siendo provisorias del kit:
 * agua-paddle, agua-jetski y galeria-jacuzzi-noche. TODO(clienta): originales de esas tres.
 * Para reemplazar una foto: pisa el archivo en `src/assets/fotos/` con el mismo nombre
 * y, si es foto de título, ajusta `horizonte`: la altura de la línea del agua, de 0 (arriba)
 * a 1 (abajo). Ejemplo: 0.56 = el agua toca las montañas al 56 % de la altura de la foto.
 * `foco` es el punto horizontal que se conserva cuando el celular recorta los lados (0 a 1).
 */
import type { ImageMetadata } from 'astro';

import jacuzziAtardecer from '../assets/fotos/jacuzzi-atardecer.jpg';
// TODO(clienta): original en alta de esta foto (la del kit es de 720 × 1280)
import casaAmanecer from '../assets/fotos/casa-amanecer.jpg';
import casaCanoaPenol from '../assets/fotos/casa-canoa-penol.jpg';
import terrazaDia from '../assets/fotos/terraza-dia.jpg';
import jetskiPaddlePenol from '../assets/fotos/jetski-paddle-penol.jpg';
import jacuzziPalma from '../assets/fotos/jacuzzi-palma-atardecer.jpg';
import terrazaNoche from '../assets/fotos/terraza-noche.jpg';
import camaPenol from '../assets/fotos/cama-penol.jpg';
import livingCocina from '../assets/fotos/living-cocina.jpg';
import casaCanoa from '../assets/fotos/casa-canoa.jpg';
import sorpresaGlobos from '../assets/fotos/sorpresa-globos.jpg';
import jacuzziDia from '../assets/fotos/jacuzzi-dia.jpg';
import livingJacuzzi from '../assets/fotos/living-jacuzzi.jpg';
import interiorNoche from '../assets/fotos/interior-noche.jpg';
import camaCanoa from '../assets/fotos/cama-canoa.jpg';
import jacuzziEspuma from '../assets/fotos/jacuzzi-espuma-atardecer.jpg';
import cocinaCama from '../assets/fotos/cocina-cama.jpg';
import camaSol from '../assets/fotos/cama-sol.jpg';
import ventanalAtardecer from '../assets/fotos/ventanal-atardecer.jpg';
import atardecerVentana from '../assets/fotos/atardecer-ventana.jpg';
// provisorias del kit que siguen en uso (sin original de la clienta todavía)
import aguaPaddle from '../assets/fotos/agua-paddle.jpg';
import aguaJetski from '../assets/fotos/agua-jetski.jpg';
import gJacuzziNoche from '../assets/fotos/galeria-jacuzzi-noche.jpg';

export interface FotoTitulo {
  src: ImageMetadata;
  alt: string;
  horizonte: number;
  /** punto horizontal que se conserva al recortar (0 a 1) */
  foco: number;
  /** punto vertical que se conserva al recortar (0 a 1). Por defecto 0.5 */
  focoY?: number;
}

export const titulos = {
  portada: {
    src: casaAmanecer,
    alt: 'La casa flotante de vidrio y madera sobre el embalse quieto, con el cielo rosado del amanecer y una palma en la terraza.',
    horizonte: 0.6,
    foco: 0.7,
    focoY: 0.62,
  },
  casa: {
    src: casaCanoaPenol,
    alt: 'La casa flotante con su deck de madera y una canoa amarrada; al fondo, la Piedra del Peñol.',
    horizonte: 0.4,
    foco: 0.45,
  },
  incluye: {
    src: terrazaDia,
    alt: 'La terraza de arriba con césped, sillas, parasol y una palma, frente al embalse en un día despejado.',
    horizonte: 0.53,
    foco: 0.5,
  },
  agua: {
    src: jetskiPaddlePenol,
    alt: 'Dos jet ski amarrados junto a la casa y un paddle board apoyado en la pared, con el Peñol a lo lejos.',
    horizonte: 0.625,
    foco: 0.6,
  },
  galeria: {
    src: jacuzziPalma,
    alt: 'Jacuzzi lleno de espuma junto al ventanal, con el cielo rosado del atardecer sobre el agua.',
    horizonte: 0.485,
    foco: 0.4,
  },
  reserva: {
    src: terrazaNoche,
    alt: 'La terraza de noche, con luces cálidas en la baranda y el embalse reflejando las nubes.',
    horizonte: 0.505,
    foco: 0.5,
  },
} satisfies Record<string, FotoTitulo>;

export const casa = {
  interior: {
    src: camaPenol,
    alt: 'La cama frente a los ventanales abiertos, con el sofá, el embalse y el Peñol al fondo.',
  },
  estructura: {
    src: livingCocina,
    alt: 'La sala con el mini-bar y las puertas de vidrio abiertas hacia el comedor de la cubierta.',
  },
};

export const agua = {
  kayak: {
    src: aguaPaddle,
    alt: 'Una huésped de espaldas, arrodillada sobre un paddle board en el agua verde del embalse.',
  },
  jetski: {
    src: aguaJetski,
    alt: 'Jet skis junto a la casa flotante, con el Peñol a lo lejos.',
  },
};

export const planes: Record<string, { src: ImageMetadata; alt: string }> = {
  noche: { src: casaCanoa, alt: 'La casa flotante de día con su canoa amarrada.' },
  extreme: { src: jetskiPaddlePenol, alt: 'Jet ski listo junto a la casa.' },
  sorpresa: { src: sorpresaGlobos, alt: 'Cama decorada con globos rojos en forma de corazón.' },
};

export type Momento = 'dia' | 'atardecer' | 'noche' | 'interior';

export interface FotoGaleria {
  src: ImageMetadata;
  alt: string;
  momento: Momento;
}

export const galeria: FotoGaleria[] = [
  { src: jacuzziAtardecer, momento: 'atardecer', alt: 'El jacuzzi encendido en la cubierta al atardecer, con el embalse quieto y la orilla en sombra.' },
  { src: jacuzziDia, momento: 'dia', alt: 'El jacuzzi de agua turquesa en la cubierta, bajo un cielo azul con nubes.' },
  { src: jacuzziEspuma, momento: 'atardecer', alt: 'Espuma desbordando el jacuzzi mientras el cielo se pone naranja sobre la orilla.' },
  { src: cocinaCama, momento: 'interior', alt: 'La cama y la cocina con muebles de madera, con una ventana abierta al bosque.' },
  { src: terrazaNoche, momento: 'noche', alt: 'La terraza de noche con dos sillas, una palma y las luces de la baranda.' },
  { src: casaCanoa, momento: 'dia', alt: 'La casa de dos niveles con su canoa blanca amarrada al deck.' },
  { src: camaSol, momento: 'atardecer', alt: 'El sol bajando sobre el agua, visto desde la cama a través del ventanal.' },
  { src: livingJacuzzi, momento: 'interior', alt: 'El sofá frente al ventanal, con el jacuzzi, la malla y el Peñol afuera.' },
  { src: interiorNoche, momento: 'noche', alt: 'Noche de película desde la cama, con velas en la cubierta y las luces del pueblo al fondo.' },
  { src: camaCanoa, momento: 'interior', alt: 'La cama al sol con las puertas abiertas al embalse y la canoa justo afuera.' },
  { src: ventanalAtardecer, momento: 'atardecer', alt: 'El ventanal con el logo de la casa reflejando el atardecer sobre el agua.' },
  { src: terrazaDia, momento: 'dia', alt: 'La terraza de arriba con césped, parasol y una palma, frente al embalse.' },
  { src: atardecerVentana, momento: 'atardecer', alt: 'La puerta abierta al atardecer, con la montaña y el agua dorada.' },
  { src: gJacuzziNoche, momento: 'noche', alt: 'Jacuzzi iluminado en la cubierta, con la orilla oscura y unas pocas luces al fondo.' },
  { src: sorpresaGlobos, momento: 'interior', alt: 'La cama decorada para una sorpresa, con globos de corazón y vista al agua.' },
];

/**
 * Qué incluye: la foto que acompaña a cada ítem mientras la lista se recorre.
 * Solo fotos que muestran de verdad ese ítem. Los que no tienen foto (lancha, desayuno,
 * parlante) se muestran con una escena animada en línea fina (EscenaIncluye.astro).
 * `pos` es el encuadre (object-position) para que el objeto quede a la vista.
 */
export const incluyeFotos: Partial<Record<string, { src: ImageMetadata; alt: string; pos?: string }>> = {
  jacuzzi: { src: jacuzziDia, alt: 'El jacuzzi privado en la cubierta, frente al embalse.', pos: '40% 60%' },
  kayak: { src: casaCanoa, alt: 'El kayak blanco amarrado al deck de la casa.', pos: '62% 70%' },
  paddle: { src: aguaPaddle, alt: 'Una huésped sobre el paddle board en el embalse.', pos: '50% 62%' },
  malla: { src: livingJacuzzi, alt: 'La malla catamarán tendida sobre el agua junto a la cubierta.', pos: '20% 62%' },
  bbq: { src: casaCanoaPenol, alt: 'La parrilla de la zona BBQ en la terraza de arriba.', pos: '12% 42%' },
  cocina: { src: cocinaCama, alt: 'La cocina dotada, con estufa, lavaplatos y nevera.', pos: '62% 55%' },
  wifi: { src: interiorNoche, alt: 'La TV encendida de noche, vista desde la cama.', pos: '72% 40%' },
  cama: { src: camaPenol, alt: 'La cama queen frente a los ventanales y el Peñol.', pos: '50% 62%' },
};
