import type { Cantique } from '../types';

export const cantiques: Cantique[] = [

  /* ── Vedette ─────────────────────────────────────────────── */
  {
    id: 'hymn-47',
    numero: '47',
    titre: "L'Éternel est ma lumière",
    titleEm: 'ma lumière.',
    famille: 'compose',
    solisteOuChoeur: "Chœur RST · dirigé par fr. Jules Kayembe",
    detailBy: "Composé et dirigé par fr. Jules Kayembe · enregistré le 13 . 04 . 2026 · Chœur RST",
    recordedAt: '13 . 04 . 2026',
    duration: '5MIN 42',
    recordingType: 'studio',
    estVedette: true,
    lyrics: [
      {
        type: 'verse',
        label: '1',
        lines: [
          "L'Éternel est ma lumière et mon salut,",
          "De qui aurais-je crainte ?",
          "L'Éternel est le rempart de ma vie,",
          "De qui aurais-je peur ?",
        ],
      },
      {
        type: 'refrain',
        label: '℟',
        lines: [
          "Une chose, je la demande à l'Éternel,",
          "Je la recherche : habiter dans Sa maison,",
          "Tous les jours de ma vie.",
        ],
      },
      {
        type: 'verse',
        label: '2',
        lines: [
          "Quand des méchants s'avancent contre moi,",
          "Pour dévorer ma chair,",
          "Ce sont eux, mes adversaires et mes ennemis,",
          "Qui chancellent et tombent.",
        ],
      },
      {
        type: 'refrain',
        label: '℟',
        lines: [
          "Une chose, je la demande à l'Éternel,",
          "Je la recherche : habiter dans Sa maison,",
          "Tous les jours de ma vie.",
        ],
      },
      {
        type: 'verse',
        label: '3',
        lines: [
          "Espère en l'Éternel,",
          "Fortifie-toi et que ton cœur s'affermisse,",
          "Espère en l'Éternel.",
        ],
      },
    ],
  },

  /* ── Cartes standard ─────────────────────────────────────── */
  {
    id: 'hymn-12',
    numero: '12',
    titre: "Seul l'Agneau est digne",
    famille: 'message',
    solisteOuChoeur: 'Soliste · sœur Lumumba',
    lyrics: [],
  },
  {
    id: 'hymn-309',
    numero: '309',
    titre: 'Près de Toi, Seigneur',
    famille: 'recueil',
    solisteOuChoeur: 'Chœur RST',
    lyrics: [],
  },
  {
    id: 'hymn-28',
    numero: '28',
    titre: "L'Aigle volera",
    famille: 'message',
    solisteOuChoeur: 'Chœur RST · arrangement libre',
    lyrics: [],
  },
  {
    id: 'hymn-41',
    numero: '41',
    titre: 'Sur le Roc je tiens',
    famille: 'compose',
    solisteOuChoeur: 'Composé par fr. Jules Kayembe · 2024',
    lyrics: [],
  },
  {
    id: 'hymn-211',
    numero: '211',
    titre: 'À Toi la gloire',
    famille: 'recueil',
    solisteOuChoeur: 'Assemblée · culte du dimanche',
    lyrics: [],
  },
  {
    id: 'hymn-175',
    numero: '175',
    titre: 'Plus près de Toi mon Dieu',
    famille: 'recueil',
    solisteOuChoeur: 'Soliste · sœur Esther Ndaye',
    lyrics: [],
  },
  {
    id: 'hymn-19',
    numero: '19',
    titre: 'Au pied de la Croix',
    famille: 'message',
    solisteOuChoeur: 'Chœur RST',
    lyrics: [],
  },
];

export const cantiqueCounts = {
  tous: 84,
  recueil: 62,
  message: 14,
  compose: 8,
} as const;
