import type { Annonce } from '../types';

export const annonces: Annonce[] = [
  /* ── ANNONCE PHARE ───────────────────────────────────────── */
  {
    id: 'voyage-marseille',
    titre: 'Voyage missionnaire',
    titreEm: 'à Marseille.',
    statut: 'a-venir',
    type: 'voyage',
    sousType: 'Mission',
    date: '2026-07-12',
    dl: 'DIM. JUIL',
    lieu: 'Marseille · 13ᵉ et 14ᵉ',
    description:
      "Une semaine de prédication, de baptêmes et de visites de frères dans le sud. Cette mission s'inscrit dans le prolongement de l'œuvre de fondation — comme en 2003, comme en 2010. Inscriptions ouvertes au secrétariat jusqu'au 15 juin 2026.",
    estPhare: true,
    featuredEyebrow: 'Annonce phare · Été 2026',
    featuredMeta: [
      { lbl: 'Quand', val: 'Du 12 au 18 juillet 2026' },
      { lbl: 'Où',   val: 'Marseille · 13ᵉ et 14ᵉ' },
      { lbl: 'Type', val: 'Voyage missionnaire' },
    ],
    ctaUrl: '#',
  },

  /* ── MAI 2026 — À venir ───────────────────────────────────── */
  {
    id: 'reunion-jeunes',
    titre: 'Réunion de jeunes',
    statut: 'a-venir',
    type: 'reunion',
    sousType: 'Jeunesse',
    date: '2026-05-10',
    dl: 'SAM. MAI',
    lieu: 'Salle Bacchus',
    description:
      "Soirée d'enseignement et de partage à la salle Bacchus, ouverte aux jeunes adultes de l'assemblée et invités.",
  },
  {
    id: 'sortie-senart',
    titre: 'Sortie famille · forêt de Sénart',
    statut: 'a-venir',
    type: 'sortie',
    sousType: 'Famille',
    date: '2026-05-17',
    dl: 'SAM. MAI',
    lieu: 'Forêt de Sénart',
    description:
      'Journée détente et fraternité ouverte à tous. Pique-nique partagé, jeux et temps de prière en plein air.',
  },
  {
    id: 'concert-aiglons',
    titre: 'Concert · Les Aiglons',
    statut: 'a-venir',
    type: 'exceptionnelle',
    sousTypeLabel: 'Réunion · Exceptionnelle',
    date: '2026-05-24',
    dl: 'DIM. MAI',
    lieu: 'Salle Bacchus',
    description:
      "Concert de cantiques par le groupe Les Aiglons, suivi d'une partie de partage sur la Parole. Ouvert à l'assemblée et aux invités.",
  },

  /* ── AVRIL 2026 — Aujourd'hui ────────────────────────────── */
  {
    id: 'veillée-prière-avr',
    titre: 'Veillée de prière',
    statut: 'aujourd-hui',
    type: 'reunion',
    sousType: 'Prière',
    date: '2026-04-30',
    dl: 'JEU. AVR',
    lieu: 'Salle Bacchus',
    description:
      'Veillée mensuelle à la salle Bacchus. Temps de prière prolongé dès 19H — les frères et sœurs sont attendus.',
  },

  /* ── AVRIL 2026 — Passées ────────────────────────────────── */
  {
    id: 'culte-26-avr',
    titre: "Culte du dimanche · L'Ordre de l'Église #14",
    statut: 'passee',
    type: 'reunion',
    sousType: 'Culte',
    date: '2026-04-26',
    dl: 'DIM. AVR',
    lieu: 'Salle Bacchus',
    description:
      "Prédication sur Matthieu 7 — « Le Roc qui ne tombe pas ». Disponible dans la bibliothèque des cultes.",
  },
  {
    id: 'mission-lille',
    titre: 'Mission · Lille',
    statut: 'passee',
    type: 'voyage',
    sousType: 'Mission',
    date: '2026-04-19',
    dl: 'DIM. AVR',
    lieu: 'Lille',
    description:
      "Visite de l'assemblée sœur de Lille. Semaine de prédication et baptêmes. Compte rendu publié.",
  },
  {
    id: 'service-temoignages',
    titre: 'Service de témoignages',
    statut: 'passee',
    type: 'reunion',
    sousTypeLabel: 'Réunion · Culte',
    date: '2026-04-12',
    dl: 'DIM. AVR',
    lieu: 'Salle Bacchus',
    description:
      'Service exceptionnel — récits de la fidélité de Dieu cette saison. Six témoignages partagés.',
  },
];
