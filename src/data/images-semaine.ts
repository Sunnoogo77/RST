import type { ImageSemaine } from '../types';

// Galerie de la semaine — 6 photos en grille asymétrique (2 grandes + 4 petites).
// Photos à fournir chaque semaine par le pasteur ou le responsable de communication.
// Voir README.md §Mise à jour hebdomadaire.
export const imagesSemaine: ImageSemaine[] = [
  {
    id: 'img-01',
    src: '/images/placeholder-gallery.svg',
    caption: 'Culte du dimanche 27 avril 2026',
    estGrande: true,
  },
  {
    id: 'img-02',
    src: '/images/placeholder-gallery.svg',
    caption: 'Moment de louange',
    estGrande: true,
  },
  {
    id: 'img-03',
    src: '/images/placeholder-gallery.svg',
    caption: 'Fraternité après le culte',
    estGrande: false,
  },
  {
    id: 'img-04',
    src: '/images/placeholder-gallery.svg',
    caption: 'École du dimanche',
    estGrande: false,
  },
  {
    id: 'img-05',
    src: '/images/placeholder-gallery.svg',
    caption: 'Prière en assemblée',
    estGrande: false,
  },
  {
    id: 'img-06',
    src: '/images/placeholder-gallery.svg',
    caption: 'Accueil des visiteurs',
    estGrande: false,
  },
];
