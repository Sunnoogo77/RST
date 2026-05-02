/* ============================================================
   RST — Types métier partagés
   Ces interfaces sont le contrat futur des serializers Django.
   Ne pas modifier les noms de champs sans coordination back-end.
   ============================================================ */

/* ----------------------------------------------------------
   Rendez-vous (horaires de cultes)
---------------------------------------------------------- */
export type JourCulte = 'mercredi' | 'dimanche' | 'vendredi';

export interface RendezVous {
  id: string;
  jour: JourCulte;
  titre: string;        // "Étude biblique" | "Culte du dimanche" | "Veillée de prière"
  heureDebut: string;   // "19H00"
  heureFin: string;     // "21H00"
  description: string;
}

/* ----------------------------------------------------------
   Hero portrait (rotation aléatoire)
---------------------------------------------------------- */
export interface MessageHero {
  id: string;
  src: string;          // chemin relatif depuis public/ ou import
  alt: string;
  credit?: string;
  objectPosition?: string; // CSS object-position pour cadrer le sujet
}

/* ----------------------------------------------------------
   Sermons / Prédications
---------------------------------------------------------- */
export interface PassageBiblique {
  reference: string;  // "Matthieu 7.24-25"
  texte: string;
}

export interface CitationBranham {
  source: string;  // "63-0728"
  texte: string;
}

export interface PlanItem {
  numero: 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';
  titre: string;
  description: string;
}

export interface Sermon {
  id: string;
  titre: string;
  titleEm?: string;    // partie italique en 2e ligne du h2 fiche : "ne tombe pas."
  serie: string;       // "L'Ordre de l'Église" | "Étude libre"
  numeroSerie?: number; // 14 — absent pour Étude libre
  date: string;        // ISO "2026-04-26"
  heure: string;       // "09H00"
  predicateur: string; // "Rev. Robert Ndaye M."
  duree?: string;      // "1H 28MIN"
  description?: string;
  videoUrl?: string;
  audioUrl?: string;
  passages: PassageBiblique[];
  citationsBranham: CitationBranham[];
  plan: PlanItem[];
}

/* ----------------------------------------------------------
   Cantiques / Hymnaire
---------------------------------------------------------- */
export type CantiqueFamille = 'recueil' | 'message' | 'compose';

export interface VerseBlock {
  type: 'verse' | 'refrain';
  label: string;   // '1', '2', '3', '℟'
  lines: string[];
}

export interface Cantique {
  id: string;
  numero: string;              // "47", "309" — sans préfixe
  titre: string;
  titleEm?: string;            // partie italique du titre en detail h2
  famille: CantiqueFamille;
  solisteOuChoeur: string;     // affiché dans la carte de grille
  detailBy?: string;           // surcharge du sous-titre en fiche détail
  dateEnregistrement?: string; // "2024" (année)
  recordedAt?: string;         // "13 . 04 . 2026" (date affichage)
  duration?: string;           // "5MIN 42"
  recordingType?: 'studio' | 'culte' | 'live';
  videoUrl?: string;
  audioUrl?: string;
  pdfUrl?: string;
  estVedette?: boolean;        // carte 2×2 dans la grille
  lyrics?: VerseBlock[];
}

/* ----------------------------------------------------------
   Annonces / Bulletin
---------------------------------------------------------- */
export type AnnonceStatut = 'a-venir' | 'aujourd-hui' | 'passee';
export type AnnonceType = 'reunion' | 'voyage' | 'sortie' | 'exceptionnelle';

export interface Annonce {
  id: string;
  titre: string;
  titreEm?: string;          // partie italique du titre featured : "à Marseille."
  statut: AnnonceStatut;
  type: AnnonceType;
  sousType?: string;          // sous-catégorie : "Jeunesse", "Famille", "Culte", "Prière", "Mission"
  sousTypeLabel?: string;     // surcharge du span ann-type complet : "Réunion · Exceptionnelle"
  date: string;               // ISO "2026-05-10"
  dl?: string;                // abréviation jour+mois : "SAM. MAI" (surcharge d'affichage)
  dateDisplay?: string;       // surcharge globale : "DATE À VENIR", "ÉTÉ 2026"
  lieu: string;
  description: string;
  image?: string;
  estPhare?: boolean;
  featuredEyebrow?: string;   // "Annonce phare · Été 2026"
  featuredMeta?: Array<{ lbl: string; val: string }>;
  ctaUrl?: string;
}

/* ----------------------------------------------------------
   Témoignages
---------------------------------------------------------- */
export type TemoignageType = 'citation' | 'illustre' | 'recit';

export interface TemoignageParagraph {
  kind: 'lede' | 'p' | 'pull';
  text: string;
}

export interface TemoignageDetailData {
  tag: string;           // "Récit · 14 . 03 . 2026 · 7 min de lecture"
  byline: string;        // "Frère R. · 41 ans · baptisé le 28 . 09 . 2025 · publié avec son accord"
  readingMinutes: number;
  paragraphs: TemoignageParagraph[];
  versetRef: string;     // "Matthieu 7 . 24"
  versetText: string;    // "Quiconque entend ces paroles..."
}

export interface Temoignage {
  id: string;
  auteur: string;        // anonymisé : "— une sœur · Île-de-France"
  type: TemoignageType;
  accentRouge?: boolean; // applique le filet rouge + guillemet rouge (la classe "accent-blue" du wireframe)
  cite: string;          // attribution formatée pour <cite>
  quoteText?: string;    // texte du <q> pour les citations courtes
  eyebrow?: string;      // "Récit · 14 . 03 . 2026" pour story/illu
  titre?: string;        // <h3> pour story/illu
  corps?: string;        // corps de texte pour story/illu
  image?: string;        // chemin image pour illu
  hasDetail?: boolean;   // affiche "Lire le récit complet →"
  detail?: TemoignageDetailData;
  date: string;
}

/* ----------------------------------------------------------
   Projet Néhémie
---------------------------------------------------------- */
export interface MontantContribution {
  id: string;
  valeur: number | null; // null = "Libre"
  label: string;         // "50 €" | "200 €" | "Libre"
  titre: string;
  description: string;
}

export interface ModeDon {
  id: string;
  icone: string;          // lettre unique dans un cercle
  titre: string;
  instructions: string;
}

export interface Batisseur {
  initiales: string;   // "R.N."
  engagement: string;  // "50 € / mois"
}

export interface ProjetNehemie {
  objectif: number;    // 50000
  collecte: number;    // 12500
  devise: string;      // "€"
  miseAJour: string;   // ISO date
  batisseurs: Batisseur[];
  montants: MontantContribution[];
  modesDon: ModeDon[];
}

/* ----------------------------------------------------------
   Page Histoire
---------------------------------------------------------- */
export interface SectionHistoire {
  id: string;
  titre: string;          // "Les commencements"
  periode: string;        // "1999–2003"
  lede: string;           // 1 phrase courte
  corps: string;          // paragraphe (placeholder éditorial)
  citationPull?: string;
  citationSource?: string;
}

/* ----------------------------------------------------------
   Équipe / Piliers liturgiques
---------------------------------------------------------- */
export type PilierFonction = 'pasteur' | 'musique' | 'ecole-dimanche' | 'huissiers';

export interface MembreEquipe {
  id: string;
  nom: string;
  fonction: PilierFonction;
  photo?: string;
}

/* ----------------------------------------------------------
   Images de la semaine (galerie)
---------------------------------------------------------- */
export interface ImageSemaine {
  id: string;
  src: string;
  caption: string;
  estGrande?: boolean; // prend 2× dans la grille asymétrique
}

/* ----------------------------------------------------------
   Vlog hebdomadaire (Cette semaine)
---------------------------------------------------------- */
export interface VlogSemaine {
  date: string;           // ISO "2026-04-26"
  titreMessage: string;
  titreSuffix?: string;   // dernier mot en italique : "pas."
  pitchMessage: string;
  serie: string;
  predicateur: string;    // "Rev. Robert Ndaye M."
  heureCulte: string;     // "09H00"
  verset: {
    reference: string;    // "MATTHIEU 7 · 24"
    texte: string;
  };
  poster?: string;
  replayUrl?: string;
  filDuMessage: {
    paragraphe1: string;
    paragraphe2: string;
    versets: string[];
  };
  cantiqueSemaine: {
    titre: string;
    soliste: string;
    audioUrl?: string;
    videoUrl?: string;
    vuesCount?: string;          // "12 480 vues"
    dateEnregistrement?: string; // "13.04.2026"
  };
  temoignageSemaine: {
    auteur: string;
    texte: string;
  };
}
