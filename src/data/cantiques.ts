import type { Cantique } from '../types';

/* ============================================================
   Cantiques réels de l'assemblée — vidéos hébergées
   sur les chaînes YouTube Kollonell et AGAPAO TV.
   Les paroles sont laissées vides volontairement
   (à renseigner par l'équipe musicale).
   ============================================================ */

export const cantiques: Cantique[] = [

  /* ── Vedette : Cantique spécial Pâques 2026 ─────────── */
  {
    id: 'paques-2026-amonaki-pasi',
    numero: '01',
    titre: 'Cantique spécial — Pâques 2026',
    titleEm: 'Pâques 2026',
    famille: 'compose',
    solisteOuChoeur: 'Fr. Jules Kayembe',
    detailBy: 'Fr. Jules Kayembe · enregistré pour Pâques 2026 · Roc Séculaire Tabernacle',
    recordedAt: 'Pâques 2026',
    duration: '7MIN 26',
    recordingType: 'studio',
    videoUrl: 'https://www.youtube.com/watch?v=7OLGUUubcGM',
    estVedette: true,
    lyrics: [],
  },

  /* ── Composés ici · acoustiques de fr. Jules ────────── */
  {
    id: 'chaque-instant',
    numero: '02',
    titre: 'Chaque instant',
    famille: 'compose',
    solisteOuChoeur: 'Fr. Jules Kayembe · acoustique',
    recordingType: 'studio',
    videoUrl: 'https://www.youtube.com/watch?v=op6mald-WnE',
    lyrics: [],
  },
  {
    id: 'c-est-la-trace',
    numero: '03',
    titre: "C'est la trace",
    famille: 'compose',
    solisteOuChoeur: 'Fr. Jules Kayembe · acoustique',
    recordingType: 'studio',
    videoUrl: 'https://www.youtube.com/watch?v=YzBtvB5maTM',
    lyrics: [],
  },
  {
    id: 'ville-de-perles',
    numero: '04',
    titre: 'Ville de perles et de lumière',
    famille: 'compose',
    solisteOuChoeur: 'Fr. Jules Kayembe · acoustique',
    recordingType: 'studio',
    videoUrl: 'https://www.youtube.com/watch?v=JD8Zc8SffPo',
    lyrics: [],
  },
  {
    id: 'roc-seculaire-ne-chancelle-pas',
    numero: '05',
    titre: 'Roc Séculaire ne chancelle pas',
    famille: 'compose',
    solisteOuChoeur: 'Fr. Jules Kayembe',
    videoUrl: 'https://www.youtube.com/watch?v=oWHm58YIACI',
    lyrics: [],
  },

  /* ── Lives au culte ─────────────────────────────────── */
  {
    id: 'je-veux-monter',
    numero: '06',
    titre: 'Je veux monter sur la montagne',
    famille: 'compose',
    solisteOuChoeur: 'Fr. Jules Kayembe · live au culte',
    recordedAt: '24 . 07 . 2022',
    recordingType: 'live',
    videoUrl: 'https://www.youtube.com/watch?v=GIFxKt1CkRo',
    lyrics: [],
  },
  {
    id: 'que-me-serait-il-arrive',
    numero: '07',
    titre: 'Que me serait-il arrivé ?',
    famille: 'compose',
    solisteOuChoeur: 'Fr. Jules Kayembe · live au culte',
    recordedAt: '15 . 05 . 2022',
    recordingType: 'live',
    videoUrl: 'https://www.youtube.com/watch?v=5u8SpeC0_qs',
    lyrics: [],
  },
  {
    id: 'ton-amour-nous-environne',
    numero: '08',
    titre: 'Ton amour nous environne',
    famille: 'compose',
    solisteOuChoeur: 'Past. Robert Ndaye feat. Fr. Jules Kayembe',
    recordingType: 'live',
    videoUrl: 'https://www.youtube.com/watch?v=29SmF9wfaGY',
    lyrics: [],
  },

  /* ── Compilations ───────────────────────────────────── */
  {
    id: 'celebration-musique-21',
    numero: '09',
    titre: 'Célébration de Dieu par la musique',
    famille: 'compose',
    solisteOuChoeur: 'Fr. Jules Kayembe & Rév. Robert Ndaye · 21 cantiques',
    recordingType: 'live',
    videoUrl: 'https://www.youtube.com/watch?v=GdPuf714RkM',
    lyrics: [],
  },
  {
    id: '1h-dans-sa-presence',
    numero: '10',
    titre: 'Une heure dans Sa présence',
    famille: 'compose',
    solisteOuChoeur: 'Fr. Jules Kayembe · 11 cantiques inspirés',
    recordingType: 'live',
    videoUrl: 'https://www.youtube.com/watch?v=RUoXYRQnRvw',
    lyrics: [],
  },
];

export const cantiqueCounts = {
  tous: cantiques.length,
  recueil: cantiques.filter((c) => c.famille === 'recueil').length,
  message: cantiques.filter((c) => c.famille === 'message').length,
  compose: cantiques.filter((c) => c.famille === 'compose').length,
} as const;
