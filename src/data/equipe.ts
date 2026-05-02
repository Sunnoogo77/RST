import type { MembreEquipe } from '../types';

// Les noms des responsables de ministère (hors pasteur) sont à fournir
// par le pasteur après la présentation. Voir README.md §Contenu à compléter.
export const equipe: MembreEquipe[] = [
  {
    id: 'pasteur',
    nom: 'Rev. Robert Ndaye M.',
    fonction: 'pasteur',
    photo: '/images/pastor-ndaye.jpeg',
  },
  {
    id: 'musique',
    nom: 'Responsable à définir',
    fonction: 'musique',
    photo: undefined,
  },
  {
    id: 'ecole-dimanche',
    nom: 'Responsable à définir',
    fonction: 'ecole-dimanche',
    photo: undefined,
  },
  {
    id: 'huissiers',
    nom: 'Responsable à définir',
    fonction: 'huissiers',
    photo: undefined,
  },
];
