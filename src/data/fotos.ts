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
// TODO(clienta): original en alta de esta foto. La del kit (720 × 1280) se reescaló x2 con
// superresolución (FSRCNN) mientras tanto.
import casaAmanecer from '../assets/fotos/casa-amanecer.jpg';
// fotos nuevas de la clienta (noviembre 2026)
import portadaCasa from '../assets/fotos/portada-casa-atardecer.jpg';
import casaNocheEstrellas from '../assets/fotos/casa-noche-estrellas.jpg';
import jacuzziPanoramica from '../assets/fotos/jacuzzi-espuma-panoramica.jpg';
import casaNocheLuces from '../assets/fotos/casa-noche-luces.jpg';
import zonaBbq from '../assets/fotos/zona-bbq.jpg';
import livingPenol from '../assets/fotos/living-penol.jpg';
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
// TODO(clienta): original de la lancha (esta sale de una captura de Instagram, reescalada x2)
import lancha from '../assets/fotos/lancha.jpg';
import aguaJetski from '../assets/fotos/agua-jetski.jpg';
import gJacuzziNoche from '../assets/fotos/galeria-jacuzzi-noche.jpg';
// del Instagram de la casa (sin el texto sobreimpreso y reescalada)
import jacuzziNocheIg from '../assets/fotos/jacuzzi-noche-ig.jpg';

export interface FotoTitulo {
  src: ImageMetadata;
  alt: string;
  horizonte: number;
  /** punto horizontal que se conserva al recortar (0 a 1) */
  foco: number;
  /** altura de la escena (0 a 1) donde se quiere ver la línea del agua. Por defecto 0.58 (0.6 en la portada) */
  meta?: number;
  /** solo portada: imagen en public/ que marca el agua (blanco) y la casa (negro) para el agua viva */
  mascara?: string;
}

export const titulos = {
  portada: {
    src: portadaCasa,
    alt: 'La casa flotante de dos niveles sobre el agua quieta al atardecer, con la palma y el parasol en la terraza.',
    horizonte: 0.575,
    foco: 0.58,
    // TODO: si se cambia la foto de portada, rehacer esta máscara (o quitarla: sin ella todo
    // lo que está debajo del horizonte se mueve como agua)
    mascara: 'agua/portada.png',
  },
  casa: {
    src: casaNocheEstrellas,
    alt: 'La casa flotante iluminada de noche bajo un cielo con estrellas, con las luces del pueblo reflejadas en el agua.',
    horizonte: 0.553,
    foco: 0.62,
  },
  incluye: {
    src: livingPenol,
    alt: 'La sala con el sofá y los ventanales abiertos al jacuzzi, la malla y el embalse, con la Piedra del Peñol al fondo.',
    horizonte: 0.467,
    foco: 0.42,
  },
  agua: {
    src: jetskiPaddlePenol,
    alt: 'Dos jet ski amarrados junto a la casa y un paddle board apoyado en la pared, con el Peñol a lo lejos.',
    horizonte: 0.625,
    foco: 0.6,
  },
  galeria: {
    src: jacuzziPanoramica,
    alt: 'El jacuzzi lleno de espuma en la cubierta, frente al embalse al atardecer.',
    horizonte: 0.437,
    foco: 0.68,
  },
  reserva: {
    src: casaNocheLuces,
    alt: 'La casa flotante al anochecer, con las luces encendidas adentro y el bosque detrás.',
    horizonte: 0.625,
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

// orden pensado para alternar momentos y que no queden fotos parecidas juntas;
// el jacuzzi al atardecer cierra la galería
export const galeria: FotoGaleria[] = [
  { src: casaCanoa, momento: 'dia', alt: 'La casa de dos niveles con su canoa blanca amarrada al deck.' },
  { src: jacuzziNocheIg, momento: 'noche', alt: 'El jacuzzi iluminado en la cubierta de noche, con nubes sobre el embalse quieto.' },
  { src: camaSol, momento: 'atardecer', alt: 'El sol bajando sobre el agua, visto desde la cama a través del ventanal.' },
  { src: cocinaCama, momento: 'interior', alt: 'La cama y la cocina con muebles de madera, con una ventana abierta al bosque.' },
  { src: terrazaNoche, momento: 'noche', alt: 'La terraza de noche con dos sillas, una palma y las luces de la baranda.' },
  { src: jacuzziDia, momento: 'dia', alt: 'El jacuzzi de agua turquesa en la cubierta, bajo un cielo azul con nubes.' },
  { src: ventanalAtardecer, momento: 'atardecer', alt: 'El ventanal con el logo de la casa reflejando el atardecer sobre el agua.' },
  { src: livingJacuzzi, momento: 'interior', alt: 'El sofá frente al ventanal, con el jacuzzi, la malla y el Peñol afuera.' },
  { src: interiorNoche, momento: 'noche', alt: 'Noche de película desde la cama, con velas en la cubierta y las luces del pueblo al fondo.' },
  { src: terrazaDia, momento: 'dia', alt: 'La terraza de arriba con césped, parasol y una palma, frente al embalse.' },
  { src: lancha, momento: 'dia', alt: 'La lancha del traslado en el muelle, con la Piedra del Peñol al fondo.' },
  { src: jacuzziEspuma, momento: 'atardecer', alt: 'Espuma desbordando el jacuzzi mientras el cielo se pone naranja sobre la orilla.' },
  { src: camaCanoa, momento: 'interior', alt: 'La cama al sol con las puertas abiertas al embalse y la canoa justo afuera.' },
  { src: casaCanoaPenol, momento: 'dia', alt: 'La casa flotante con su deck y la canoa, frente a la Piedra del Peñol.' },
  { src: gJacuzziNoche, momento: 'noche', alt: 'Jacuzzi iluminado en la cubierta, con la orilla oscura y unas pocas luces al fondo.' },
  { src: atardecerVentana, momento: 'atardecer', alt: 'La puerta abierta al atardecer, con la montaña y el agua dorada.' },
  { src: jetskiPaddlePenol, momento: 'dia', alt: 'Jet skis amarrados junto a la casa y el paddle board, con el Peñol a lo lejos.' },
  { src: aguaPaddle, momento: 'dia', alt: 'Una huésped de espaldas sobre el paddle board en el agua verde del embalse.' },
  { src: sorpresaGlobos, momento: 'interior', alt: 'La cama decorada para una sorpresa, con globos de corazón y vista al agua.' },
  { src: casaAmanecer, momento: 'atardecer', alt: 'La casa flotante al amanecer, con la palma en la terraza y el cielo rosado sobre el embalse.' },
  { src: jacuzziPalma, momento: 'atardecer', alt: 'Jacuzzi lleno de espuma junto al ventanal, con el cielo rosado del atardecer sobre el agua.' },
  { src: jacuzziAtardecer, momento: 'atardecer', alt: 'El jacuzzi encendido en la cubierta al atardecer, con el embalse quieto y la orilla en sombra.' },
];

/**
 * Qué incluye: la foto que acompaña a cada ítem mientras la lista se recorre.
 * Solo fotos que muestran de verdad ese ítem.
 * `pos` es el encuadre (object-position) para que el objeto quede a la vista.
 */
export const incluyeFotos: Partial<Record<string, { src: ImageMetadata; alt: string; pos?: string }>> = {
  lancha: { src: lancha, alt: 'La lancha del traslado amarrada al muelle, con la Piedra del Peñol al fondo.', pos: '50% 60%' },
  jacuzzi: { src: jacuzziAtardecer, alt: 'El jacuzzi privado encendido en la cubierta, frente al atardecer.', pos: '50% 62%' },
  kayak: { src: casaCanoa, alt: 'El kayak blanco amarrado al deck de la casa.', pos: '62% 70%' },
  paddle: { src: aguaPaddle, alt: 'Una huésped sobre el paddle board en el embalse.', pos: '50% 62%' },
  malla: { src: livingJacuzzi, alt: 'La malla catamarán tendida sobre el agua junto a la cubierta.', pos: '20% 62%' },
  bbq: { src: zonaBbq, alt: 'La zona BBQ en la terraza, con la parrilla, una mesa y vista al embalse.', pos: '60% 60%' },
  cocina: { src: cocinaCama, alt: 'La cocina dotada, con estufa, lavaplatos y nevera.', pos: '62% 55%' },
  wifi: { src: interiorNoche, alt: 'La TV encendida de noche, vista desde la cama.', pos: '72% 40%' },
  cama: { src: camaPenol, alt: 'La cama queen frente a los ventanales y el Peñol.', pos: '50% 62%' },
};
