import type { RendezVous } from '../types';

export const rendezVous: RendezVous[] = [
  {
    id: 'mercredi',
    jour: 'mercredi',
    titre: 'Étude biblique',
    heureDebut: '19H00',
    heureFin: '21H00',
    description: 'Étude approfondie de la Parole, verset par verset, dans la lumière du Message.',
  },
  {
    id: 'dimanche',
    jour: 'dimanche',
    titre: 'Culte du dimanche',
    heureDebut: '09H00',
    heureFin: '12H00',
    description:
      "Culte principal de l'assemblée. Prédication, louange, communion fraternelle.",
  },
  {
    id: 'vendredi',
    jour: 'vendredi',
    titre: 'Veillée de prière',
    heureDebut: '19H00',
    heureFin: '21H00',
    description: 'Réunion de prière intercessive et de communion fraternelle.',
  },
];
