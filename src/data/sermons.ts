import type { Sermon } from '../types';

/* ============================================================
   Prédications réelles archivées sur la chaîne YouTube Kollonell.
   Les `videoUrl` pointent vers les vraies vidéos publiques.
   Les passages bibliques sont conservés comme propositions
   éditoriales — les citations Branham et plans sont laissés
   vides volontairement (à renseigner par l'équipe pastorale).
   ============================================================ */

export const sermons: Sermon[] = [

  /* ── Avril 2026 — service du mercredi (le plus récent) ─── */
  {
    id: 'demi-chretiens-2026-04-29',
    titre: 'Nous ne sommes pas des demi-chrétiens.',
    titleEm: 'des demi-chrétiens.',
    serie: 'Culte du mercredi',
    date: '2026-04-29',
    heure: '19H30',
    predicateur: 'Fr. Michel Orodapo',
    description:
      "Service du mercredi à l'assemblée Roc Séculaire Tabernacle, Vitry-sur-Seine.",
    videoUrl: 'https://www.youtube.com/watch?v=WmhljxW5zUU',
    audioUrl: undefined,
    passages: [],
    citationsBranham: [],
    plan: [],
  },

  /* ── Février 2026 — service dominical ─── */
  {
    id: 'cle-de-voute-bible',
    titre: 'La clé de voûte de la Bible',
    titleEm: 'de la Bible',
    serie: 'Étude doctrinale',
    date: '2026-02-01',
    heure: '09H00',
    predicateur: 'Rév. Robert Ndaye M.',
    duree: '1H 32MIN',
    description:
      "Service dominical en direct depuis l'assemblée Roc Séculaire Tabernacle, Vitry-sur-Seine.",
    videoUrl: 'https://www.youtube.com/watch?v=BIek0FhvbuE',
    audioUrl: undefined,
    passages: [
      {
        reference: 'Éphésiens 2 . 19-22',
        texte:
          "Ainsi donc, vous n'êtes plus des étrangers, ni des hommes du dehors ; mais vous êtes concitoyens des saints, gens de la maison de Dieu. Vous avez été édifiés sur le fondement des apôtres et des prophètes, Jésus-Christ lui-même étant la pierre angulaire.",
      },
      {
        reference: '1 Pierre 2 . 6-7',
        texte:
          "Voici, je mets en Sion une pierre angulaire, choisie, précieuse ; et celui qui croit en elle ne sera point confus. L'honneur est donc pour vous, qui croyez. Mais, pour les incrédules, la pierre qu'ont rejetée ceux qui bâtissaient est devenue la principale de l'angle.",
      },
      {
        reference: 'Psaume 118 . 22',
        texte:
          "La pierre qu'ont rejetée ceux qui bâtissaient est devenue la principale de l'angle.",
      },
    ],
    citationsBranham: [],
    plan: [],
  },

  /* ── Octobre 2024 — service du mercredi ─────── */
  {
    id: 'service-mercredi-23-10-2024',
    titre: 'Service du mercredi',
    serie: 'Culte du mercredi',
    date: '2024-10-23',
    heure: '19H30',
    predicateur: 'Rév. Robert Ndaye M.',
    description: 'Service en direct, mercredi soir.',
    videoUrl: 'https://www.youtube.com/watch?v=oStj4xjdXzs',
    audioUrl: undefined,
    passages: [],
    citationsBranham: [],
    plan: [],
  },

  /* ── Convention internationale ─────────────────────── */
  {
    id: 'bon-et-fidele-serviteur',
    titre: 'Bon et fidèle serviteur',
    titleEm: 'serviteur',
    serie: 'Convention Internationale',
    date: '2024-08-15',
    heure: '10H00',
    predicateur: 'Fr. Jules Kayembe',
    description: 'Message de la Convention internationale.',
    videoUrl: 'https://www.youtube.com/watch?v=0T3fd4EN9PM',
    audioUrl: undefined,
    passages: [],
    citationsBranham: [],
    plan: [],
  },

  /* ── Novembre 2022 ─────────────────────────────────── */
  {
    id: 'caractere-des-membres',
    titre: "Le caractère des membres fait la beauté d'une église",
    titleEm: "d'une église",
    serie: "L'Ordre de l'Église",
    date: '2022-11-13',
    heure: '09H00',
    predicateur: 'Rév. Robert Ndaye M.',
    description: 'Service dominical du 13 novembre 2022.',
    videoUrl: 'https://www.youtube.com/watch?v=BVIswVRY-EQ',
    audioUrl: undefined,
    passages: [],
    citationsBranham: [],
    plan: [],
  },

  /* ── Avril 2022 ──────────────────────────────────────── */
  {
    id: 'pouvoir-du-sang',
    titre: 'Le pouvoir du sang de Jésus-Christ',
    titleEm: 'de Jésus-Christ',
    serie: 'Étude libre',
    date: '2022-04-13',
    heure: '19H30',
    predicateur: 'Rév. Robert Ndaye M.',
    description: 'Service du mercredi 13 avril 2022.',
    videoUrl: 'https://www.youtube.com/watch?v=dzvVBbZlVoM',
    audioUrl: undefined,
    passages: [],
    citationsBranham: [],
    plan: [],
  },

  /* ── Pâques 2022 ────────────────────────────────────── */
  {
    id: 'vrai-sens-calvaire',
    titre: 'Le vrai sens du Calvaire',
    titleEm: 'du Calvaire',
    serie: 'Étude libre',
    date: '2022-04-17',
    heure: '09H00',
    predicateur: 'Rév. Robert Ndaye M.',
    description: 'Méditation pascale.',
    videoUrl: 'https://www.youtube.com/watch?v=Xw3toA100_4',
    audioUrl: undefined,
    passages: [],
    citationsBranham: [],
    plan: [],
  },

  /* ── Janvier 2022 ───────────────────────────────────── */
  {
    id: 'veritable-revelation-eglise-10',
    titre: "La véritable révélation de la véritable Église — part. 10",
    serie: "La véritable révélation de la véritable Église",
    numeroSerie: 10,
    date: '2022-01-16',
    heure: '09H00',
    predicateur: 'Past. Robert Ndaye M.',
    description: 'Dixième volet de la série doctrinale sur l\'Église.',
    videoUrl: 'https://www.youtube.com/watch?v=WNwUFO-C9Dk',
    audioUrl: undefined,
    passages: [],
    citationsBranham: [],
    plan: [],
  },

  /* ── 2021 — promesses divines ──────────────────────── */
  {
    id: 'infaillibilite-promesses-divines',
    titre: "L'infaillibilité des promesses divines",
    titleEm: 'des promesses divines',
    serie: 'Étude libre',
    date: '2021-11-07',
    heure: '09H00',
    predicateur: 'Past. Robert Ndaye M.',
    description: 'Méditation sur la fidélité de Dieu à Sa Parole.',
    videoUrl: 'https://www.youtube.com/watch?v=NumCPxov-aw',
    audioUrl: undefined,
    passages: [],
    citationsBranham: [],
    plan: [],
  },

  /* ── 2021 — espérance ──────────────────────────────── */
  {
    id: 'espere-en-eternel',
    titre: "Ce qui espère en l'Éternel ne mourra jamais",
    titleEm: 'ne mourra jamais',
    serie: 'Étude libre',
    date: '2021-01-30',
    heure: '09H00',
    predicateur: 'Rév. Robert Ndaye M.',
    description: "Méditation sur l'espérance chrétienne.",
    videoUrl: 'https://www.youtube.com/watch?v=QeGaWZ4BGcE',
    audioUrl: undefined,
    passages: [],
    citationsBranham: [],
    plan: [],
  },
];
