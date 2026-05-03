# PRD-ADMIN.md — Roc Séculaire Tabernacle, Interface d'Administration

> **Version :** 1.0 — 2 mai 2026
> **Auteur :** audit architectural (Claude Opus 4.7)
> **Statut :** brouillon validé en cadrage avec Sunnoogo, prêt pour Claude Design (maquette) puis agent de codage (implémentation)
> **Périmètre :** ce document est **autonome**. Il décrit l'admin V1 de RST. Il ne traite ni de la refonte de la vitrine, ni de l'intégration Stripe (hors scope V1).

---

## §0 — Contexte et objectifs

**Roc Séculaire Tabernacle (RST)** est une assemblée chrétienne fondée le 24 janvier 1999 à Vitry-sur-Seine (94400), attachée au Message de William M. Branham. Le pasteur titulaire est le **Révérend Robert Ndaye M.**.

Le site vitrine actuel, terminé à ~82 %, est une **SPA React 18 + Vite 5 + TypeScript strict** déployée sur GitHub Pages, alimentée par des **fichiers TypeScript statiques** dans `src/data/`. Pour mettre à jour un sermon, une annonce ou un témoignage, il faut aujourd'hui éditer le code et redéployer — ce qui n'est pas tenable pour un usage hebdomadaire par l'équipe pastorale.

**Objectif V1** : remplacer cette source statique par un **backend Django 5 + DRF + PostgreSQL** alimenté par une **interface d'administration séparée** (`admin.rocseculaire.fr`), utilisable par 1 à 2 personnes (pasteur ou délégué) :

- **Sans toucher au code** de la vitrine
- **Sans déploiement** (les changements sont visibles en quelques secondes)
- **Avec validation à quatre yeux** (un éditeur saisit, un validateur publie)
- **En français et en anglais simultanément** pour le contenu rédactionnel

L'admin est un outil **utilitaire et productif**, pas éditorial. Police sans-serif (Inter), palette neutre (gris/blanc/bleu fonctionnel), densité d'information élevée. Aucune référence au design system Cormorant Garamond / ink-paper-accent de la vitrine.

---

## §1 — Audit du frontend existant

### 1.1 Pages publiques inventoriées

| Route | Composant | Données consommées | Fréquence MAJ |
|---|---|---|---|
| `/` | `Accueil.tsx` | `rendezVous`, `sermons[0]`, `projetNehemie`, `motDuPasteur` | hebdomadaire (dernier sermon, collecte) |
| `/nehemie` | `Nehemie.tsx` | `projetNehemie`, galerie auto-discovery `src/assets/nehemie/*` | mensuelle |
| `/genese` | `Sommaire.tsx` | `PILIERS_GENESE`, `EVENEMENTS_GENESE` | **statique (figé V1)** |
| `/genese/{slug}` | 9 sous-pages | `presentation`, `naissance`, `mission`, `branham`, `actes`, `offices`, `services`, `marseille`, `reunion-jeunes-2005` | **statique (figé V1)** |
| `/eglise` (`index`) | `CetteSemaine.tsx` | `vlogSemaine`, `imagesSemaine`, `annonces.slice(0,3)` | hebdomadaire (chaque lundi) |
| `/eglise/cultes` | `Cultes.tsx` | `sermons[]` complet | hebdomadaire (1-2 ajouts) |
| `/eglise/cantiques` | `Cantiques.tsx` | `cantiques[]` complet | mensuelle |
| `/eglise/annonces` | `Annonces.tsx` | `annonces[]` complet | hebdomadaire à mensuelle |
| `/eglise/annonces/:id` | `AnnonceDetail.tsx` | `annonces.find(id)` | événementielle |
| `/eglise/temoignages` | `Temoignages.tsx` | `temoignages[]` (8 cartes) | mensuelle |

### 1.2 Fichiers de données détectés dans `src/data/`

| Fichier | Entité | Entrées en dur | Volume cible |
|---|---|---|---|
| `sermons.ts` | `Sermon[]` | 10 | 200+ à terme (archive 25 ans) |
| `cantiques.ts` | `Cantique[]` + `cantiqueCounts` | 10 | 100+ |
| `annonces.ts` | `Annonce[]` | 5 (3 à venir, 2 passées) | 50/an |
| `temoignages.ts` | `Temoignage[]` + counters | 8 cartes (mosaïque figée) | 94 historiques + nouveaux |
| `nehemie.ts` | `ProjetNehemie` (singleton) | 1 | 1 (mis à jour) |
| `rendez-vous.ts` | `RendezVous[]` | 3 (mer/dim/ven) | 3 (figé) |
| `images-semaine.ts` | `ImageSemaine[]` | 6 emplacements | 6 fixes (rotatifs hebdo) |
| `vlog-semaine.ts` | `VlogSemaine` (singleton) | 1 | 1 actif + N archives |
| `genese/*.ts` | `GenesePage[]` (9 pages) | 9 | **figé V1** |
| `genese/mot-du-pasteur.ts` | `MotDuPasteur` (singleton) | 1 | **figé V1** |

### 1.3 Types TypeScript existants (`src/types/index.ts`)

Liste exhaustive des interfaces utilisées par les routes publiques :

- `RendezVous` — id, jour `mercredi|dimanche|vendredi`, titre, heureDebut, heureFin, description
- `Sermon` — id, titre, titleEm?, serie, numeroSerie?, date ISO, heure, predicateur, duree?, description?, videoUrl?, audioUrl?, passages[], citationsBranham[], plan[]
- `PassageBiblique` — reference, texte
- `CitationBranham` — source, texte
- `PlanItem` — numero `I..VI`, titre, description
- `Cantique` — id, numero, titre, titleEm?, famille `recueil|message|compose`, solisteOuChoeur, detailBy?, dateEnregistrement?, recordedAt?, duration?, recordingType?, videoUrl?, audioUrl?, pdfUrl?, estVedette?, lyrics? `VerseBlock[]`
- `VerseBlock` — type `verse|refrain`, label, lines[]
- `Annonce` — id, titre, titreEm?, statut `a-venir|aujourd-hui|passee`, type `reunion|voyage|sortie|exceptionnelle`, sousType?, sousTypeLabel?, date, dateFin?, dl?, dateDisplay?, lieu, description, image?, affiche?, contentBlocks?, estPhare?, featuredEyebrow?, featuredMeta?, ctaUrl?
- `AnnonceContentBlock` — `paragraph` ou `image{src,alt?,size?}`
- `Temoignage` — id, auteur, type `citation|illustre|recit`, accentRouge?, cite, quoteText?, eyebrow?, titre?, corps?, image?, hasDetail?, detail?, date
- `TemoignageDetailData` — tag, byline, readingMinutes, paragraphs `lede|p|pull`[], versetRef, versetText
- `ProjetNehemie` — objectif, collecte, devise, miseAJour, batisseurs[], montants[], modesDon[]
- `Batisseur` — initiales, engagement
- `MontantContribution` — id, valeur (number|null), label, titre, description
- `ModeDon` — id, icone, titre, instructions
- `GenesePage`, `GeneseBlock`, `GeneseTemoignageItem` — **figé V1, ne pas modéliser**
- `ImageSemaine` — id, src, caption, estGrande?
- `VlogSemaine` — date, titreMessage, titreSuffix?, pitchMessage, serie, predicateur, heureCulte, verset{reference,texte}, poster?, replayUrl?, filDuMessage{paragraphe1,paragraphe2,versets[]}, cantiqueSemaine{titre,soliste,audioUrl?,videoUrl?,vuesCount?,dateEnregistrement?}, temoignageSemaine{auteur,texte}

### 1.4 Médias utilisés

| Type | Origine | Format | Quantité |
|---|---|---|---|
| Images statiques (vitrine) | `public/genese/`, `public/images/`, `public/images/annonces/<slug>/` | PNG, JPG, JPEG | ~30 fichiers |
| Galerie Néhémie | `src/assets/nehemie/` (auto-discovery `import.meta.glob`) | PNG, JPG, JPEG, WEBP | 5 fichiers |
| Vidéos prédications | URLs externes YouTube (chaîne `@kollonell`) | embed YouTube | toutes |
| Vidéos cantiques | URLs externes YouTube | embed YouTube | toutes |
| Audio MP3 | **non utilisé en V1** (décision Sunnoogo : abandonné, trop lourd) | — | 0 |
| PDF | non utilisé en V1 | — | 0 |
| Affiches d'annonces | `public/images/annonces/<slug>/affiche.{png,jpeg}` | PNG, JPEG | 4 affiches |

### 1.5 i18n

Le frontend traduit via `react-i18next` les **libellés UI** (navigation, eyebrows, CTA, labels, accessibilité) — voir `src/i18n/fr.json` et `src/i18n/en.json`. **Aucune donnée métier (titre de sermon, paroles, description d'annonce) n'est traduite côté frontend.**

L'admin V1 introduit la traduction du **contenu rédactionnel** : Sermons, Cantiques, Annonces, Témoignages disposent d'une version FR et d'une version EN, saisies en parallèle. Les passages bibliques et citations Branham restent en français uniquement (décision Sunnoogo).

### 1.6 Fichiers manquants ou attendus

- **Aucun `CLAUDE.md`** à la racine (référencé dans le brief mais inexistant).
- **Aucun `PRD.md`** — la vitrine n'a pas de PRD écrit, seulement le `README.md`.
- **Aucun `ROADMAP.md`** alors que le `README.md` ligne 114 y fait référence.

Ces absences ne bloquent pas l'audit : le code et les types sont l'unique source de vérité du contrat de données.

---

## §2 — Modélisation des entités métier

> Convention : champs marqués `[FR/EN]` sont à saisir en français ET en anglais via une table `<Entité>Traduction` séparée (one-to-many). Les autres sont communs aux deux langues.

### 2.1 Personne

```
ENTITÉ : Personne
DESCRIPTION : Un individu identifié au sein de l'assemblée — pasteur, prédicateur, soliste, choriste. Remplace les strings libres ("Rév. Robert Ndaye M.", "Fr. Jules Kayembe") du frontend actuel.
FRÉQUENCE DE CRÉATION : 1 à 5 par an (équipe stable)
RELATIONS : référencée par Sermon (FK predicateur), Cantique (M2M interpretes), peut servir Bâtisseur Néhémie plus tard
PROPRIÉTÉS :
  - id : UUID, PK
  - civilite : choice [Rév., Past., Fr., Sœur, Pasteur, autre]
  - prenom : CharField, max 80
  - nom : CharField, max 80
  - nom_affichage : CharField calculé ("Rév. Robert Ndaye M."), override possible
  - role_principal : choice [pasteur, predicateur, soliste, choeur, musicien, ancien, autre]
  - photo : ImageField, optionnel
  - bio_courte : [FR/EN], TextField, max 500, optionnel
  - actif : boolean, default true
  - cree_le, modifie_le : auto
```

### 2.2 Serie (de prédications)

```
ENTITÉ : Serie
DESCRIPTION : Suite cohérente de sermons sur un thème ("L'Ordre de l'Église", "La véritable révélation de la véritable Église"). Aujourd'hui string libre dans le code.
FRÉQUENCE : 2 à 5 nouvelles par an
PROPRIÉTÉS :
  - id : UUID
  - titre : [FR/EN], CharField, max 200
  - description : [FR/EN], TextField, optionnel
  - close : boolean, default false (true si la série est terminée)
  - cree_le, modifie_le : auto
```

### 2.3 Sermon

```
ENTITÉ : Sermon
DESCRIPTION : Une prédication donnée lors d'un culte. Diffusée en direct sur YouTube en FR + EN simultanément, donc deux URL vidéo possibles. Données pédagogiques (passages, citations) en FR uniquement.
FRÉQUENCE : 1 à 2 par semaine (mercredi + dimanche)
RELATIONS : appartient à Serie (optionnel), prêché par Personne (PROTECT), contient PassageBiblique (CASCADE) et CitationBranham (CASCADE)
WORKFLOW : brouillon → en_revue → publie → archive
PROPRIÉTÉS communes :
  - id : UUID, PK
  - slug : SlugField, unique, dérivé du titre FR
  - serie : FK Serie, nullable, SET_NULL
  - numero_dans_serie : PositiveIntegerField, nullable
  - date_culte : DateTimeField (date + heure)
  - type_culte : choice [mercredi-etude, dimanche-culte, vendredi-priere, evenement-special]
  - predicateur : FK Personne, PROTECT
  - duree_minutes : PositiveIntegerField, nullable
  - statut : choice [brouillon, en_revue, publie, rejete, archive]
  - publie_le : DateTimeField, nullable (set à la transition vers "publie")
  - cree_par, modifie_par, valide_par : FK User
  - cree_le, modifie_le : auto

TABLE FILLE SermonTraduction (une ligne par langue) :
  - sermon : FK Sermon, CASCADE
  - langue : choice [fr, en]
  - titre : CharField, max 200
  - titre_em : CharField, max 80, optionnel (partie italique)
  - description_courte : TextField, max 500, optionnel
  - youtube_url : URLField, optionnel
  - UNIQUE (sermon, langue)

TABLE FILLE PassageBiblique (FR uniquement) :
  - sermon : FK Sermon, CASCADE
  - ordre : PositiveIntegerField (drag&drop)
  - reference : CharField max 80 ("Matthieu 7.24-25")
  - texte : TextField

TABLE FILLE CitationBranham (FR uniquement) :
  - sermon : FK Sermon, CASCADE
  - ordre : PositiveIntegerField
  - source : CharField max 100 ("63-0728" ou "La foi parfaite, 25.08.1965")
  - texte : TextField

TABLE FILLE PlanItem (FR uniquement) :
  - sermon : FK Sermon, CASCADE
  - ordre : PositiveIntegerField (1..N, plus la limite I..VI du frontend)
  - numero_romain : CharField max 6 (calculé à l'affichage I, II, III...)
  - titre : CharField max 200
  - description : TextField
```

### 2.4 Cantique

```
ENTITÉ : Cantique
DESCRIPTION : Un cantique de l'hymnaire RST. Trois familles : du recueil, du Message, composé ici. Diffusé sur YouTube. Paroles publiables en FR et EN.
FRÉQUENCE : 0 à 2 par mois
RELATIONS : peut avoir N interprètes (M2M Personne)
WORKFLOW : brouillon → en_revue → publie → archive
PROPRIÉTÉS communes :
  - id : UUID
  - slug : SlugField unique
  - numero : CharField max 4 (numérotation interne hymnaire : "47", "309")
  - famille : choice [recueil, message, compose]
  - interpretes : M2M Personne
  - interpretes_libelle : CharField max 200, optionnel (override : "Fr. Jules Kayembe · acoustique")
  - duration : CharField max 16, optionnel ("5MIN 42")
  - recording_type : choice [studio, culte, live], optionnel
  - recorded_at : CharField max 32, optionnel ("13.04.2026", "Pâques 2026")
  - est_vedette : boolean, default false (carte 2×2 dans la grille)
  - statut : choice [brouillon, en_revue, publie, archive]
  - publie_le, cree_par, modifie_par, valide_par, cree_le, modifie_le

TABLE FILLE CantiqueTraduction (FR + EN) :
  - cantique : FK, CASCADE
  - langue : choice [fr, en]
  - titre : CharField max 200
  - titre_em : CharField max 80, optionnel
  - detail_by : CharField max 300, optionnel
  - youtube_url : URLField, optionnel (le clip peut être différent en FR/EN)
  - lyrics : JSONField (liste de VerseBlock)
  - UNIQUE (cantique, langue)

Format lyrics (JSONField) :
  [
    { "type": "verse" | "refrain", "label": "1" | "℟", "lines": ["...", "..."] },
    ...
  ]
```

### 2.5 Annonce

```
ENTITÉ : Annonce
DESCRIPTION : Information du bulletin de l'Église — réunion, voyage, sortie, événement exceptionnel. Le statut (à venir / aujourd'hui / passée) est calculé dynamiquement par le backend depuis la date.
FRÉQUENCE : 2 à 4 par mois
WORKFLOW : brouillon → en_revue → publie → archive
PROPRIÉTÉS communes :
  - id : UUID
  - slug : SlugField unique
  - type : choice [reunion, voyage, sortie, exceptionnelle]
  - sous_type : CharField max 60, optionnel ("Jeunesse", "Couples", "Mission")
  - date_debut : DateTimeField (date + heure début, précis pour calcul "aujourd'hui")
  - date_fin : DateTimeField, optionnel (événements multi-jours)
  - lieu : CharField max 200
  - affiche : ImageField, optionnel
  - image : ImageField, optionnel
  - cta_url : URLField, optionnel
  - est_phare : boolean, default false (mise en avant manuelle, override carrousel)
  - featured_eyebrow : CharField max 80, optionnel
  - featured_meta : JSONField, optionnel ([{lbl, val}])
  - statut : choice [brouillon, en_revue, publie, archive]
  - statut_calcule : property (a-venir | aujourd-hui | passee) — non stocké, calculé à la lecture
  - publie_le, cree_par, modifie_par, valide_par, cree_le, modifie_le

TABLE FILLE AnnonceTraduction (FR + EN) :
  - annonce : FK, CASCADE
  - langue : choice [fr, en]
  - titre : CharField max 200
  - titre_em : CharField max 80, optionnel
  - sous_type_label : CharField max 100, optionnel ("Réunion · Couples")
  - description : TextField
  - date_display : CharField max 100, optionnel (override "Du 22 au 25 mai 2026")
  - dl : CharField max 12, optionnel ("VEN. MAI")
  - content_blocks : JSONField, optionnel — compte-rendu des annonces passées
  - UNIQUE (annonce, langue)

Format content_blocks :
  [
    { "kind": "paragraph", "text": "..." },
    { "kind": "image", "src": "<media-id-uuid>", "alt": "...", "size": "small|medium|wide" }
  ]
```

### 2.6 Temoignage

```
ENTITÉ : Temoignage
DESCRIPTION : Récit d'un membre ou visiteur racontant l'œuvre de Dieu. Trois formats : citation courte, récit illustré (avec image), récit long (avec détail). Soumis publiquement via formulaire ou saisi par admin. Modération obligatoire.
FRÉQUENCE : 1 à 4 par mois
WORKFLOW : recu → en_revue → publie → rejete (cas distinct du workflow standard car la soumission est externe)
PROPRIÉTÉS communes :
  - id : UUID
  - slug : SlugField unique
  - type : choice [citation, illustre, recit]
  - accent_rouge : boolean, default false (filet rouge sur la mosaïque)
  - image : ImageField, optionnel (pour type=illustre)
  - has_detail : boolean, default false
  - source : choice [admin, soumission_publique]
  - date_recue : DateTimeField
  - email_contact : EmailField, optionnel (si soumission publique)
  - statut : choice [recu, en_revue, publie, rejete]
  - motif_rejet : TextField, optionnel
  - publie_le, cree_par, modifie_par, valide_par, cree_le, modifie_le

TABLE FILLE TemoignageTraduction (FR + EN) :
  - temoignage : FK, CASCADE
  - langue : choice [fr, en]
  - auteur : CharField max 100 ("— une sœur · Île-de-France")
  - cite : CharField max 100 (attribution <cite>)
  - quote_text : TextField, optionnel (citation courte)
  - eyebrow : CharField max 80, optionnel ("Récit · 14.03.2026")
  - titre : CharField max 200, optionnel
  - corps : TextField, optionnel
  - paragraphs : JSONField, optionnel (pour type=recit avec détail)
    Format : [{ "kind": "lede"|"p"|"pull", "text": "..." }]
  - byline : CharField max 200, optionnel
  - reading_minutes : PositiveIntegerField, optionnel
  - tag : CharField max 100, optionnel
  - verset_ref : CharField max 80, optionnel (Matthieu 7.24)
  - verset_text : TextField, optionnel
  - UNIQUE (temoignage, langue)
```

### 2.7 ProjetNehemie (singleton)

```
ENTITÉ : ProjetNehemie
DESCRIPTION : Singleton (une seule ligne en base, garantie par contrainte). L'admin met à jour mensuellement le montant collecté.
PROPRIÉTÉS :
  - id : 1 (singleton — pk fixé)
  - objectif : DecimalField (max 12 chiffres, 2 décimales) — 500000.00
  - collecte : DecimalField — 54259.00
  - devise : CharField max 4, default "€"
  - mise_a_jour : DateField (date de la dernière MAJ déclarée par l'admin)
  - mise_a_jour_par : FK User
  - cree_le, modifie_le : auto
  - HISTORIQUE : django-simple-history activé sur ce modèle (léger, ~1 ligne par MAJ ⇒ négligeable)
```

> **Hors scope V1 :** liste des bâtisseurs, jalons (acquisition/rénovation/inauguration), modes de don détaillés, montants de contribution. Restent dans la vitrine en dur (`src/data/nehemie.ts`) pour V1.

### 2.8 RendezVous

```
ENTITÉ : RendezVous
DESCRIPTION : Horaires fixes des cultes (mercredi, dimanche, vendredi). 3 lignes, modifiables mais structure stable.
PROPRIÉTÉS :
  - id : UUID
  - jour : choice [mercredi, dimanche, vendredi], unique
  - heure_debut : TimeField
  - heure_fin : TimeField
  - actif : boolean, default true

TABLE FILLE RendezVousTraduction (FR + EN) :
  - titre : CharField ("Culte du mercredi" / "Wednesday Service")
  - description : TextField
```

### 2.9 ImageSemaine

```
ENTITÉ : ImageSemaine
DESCRIPTION : Photos de la galerie hebdomadaire (6 emplacements en grille asymétrique : 2 grandes + 4 petites). Rotatives chaque lundi.
PROPRIÉTÉS :
  - id : UUID
  - image : ImageField (variantes responsive auto-générées)
  - caption : [FR/EN] CharField max 200
  - est_grande : boolean, default false (occupe 2× dans la grille)
  - ordre : PositiveIntegerField (1..6)
  - semaine_iso : IntegerField (numéro de semaine ISO 8601)
  - annee : IntegerField
  - actif : boolean, default true (les 6 actuels en true ; les anciens sont false mais conservés en archive)
  - cree_le, modifie_le : auto
```

### 2.10 VlogSemaine

```
ENTITÉ : VlogSemaine
DESCRIPTION : "Cette semaine" — vitrine du dernier culte. Un seul vlog actif à la fois, les anciens sont conservés en archive (statut=archive) mais non affichés en V1.
PROPRIÉTÉS communes :
  - id : UUID
  - date_culte : DateField
  - heure_culte : TimeField
  - sermon : FK Sermon, nullable, SET_NULL (lien vers le sermon de la semaine si déjà créé)
  - cantique_semaine : FK Cantique, nullable, SET_NULL
  - poster : ImageField, optionnel
  - replay_url : URLField, optionnel
  - statut : choice [brouillon, publie, archive]  (un seul peut être "publie" à la fois — contrainte applicative)
  - publie_le, cree_par, modifie_par, valide_par, cree_le, modifie_le

TABLE FILLE VlogSemaineTraduction (FR + EN) :
  - titre_message : CharField max 200
  - titre_suffix : CharField max 80, optionnel
  - pitch_message : TextField
  - serie : CharField max 200, optionnel
  - predicateur_libelle : CharField max 100 (peut différer de la FK Sermon si vlog créé sans sermon)
  - verset_reference : CharField max 80
  - verset_texte : TextField
  - fil_paragraphe1 : TextField
  - fil_paragraphe2 : TextField, optionnel
  - fil_versets : JSONField (liste de strings)
  - temoignage_auteur : CharField max 100
  - temoignage_texte : TextField
```

### 2.11 ParametresAssemblee (hors scope V1)

> Adresse, téléphone, email, IBAN, lien YouTube, lien Maps — restent en dur dans la vitrine (`Footer.tsx`, `nehemie.ts`). À ajouter dans une V2 si besoin.

---

## §3 — Architecture technique cible

### 3.1 Schéma général

```
┌──────────────────────────────────────────────────────────────────┐
│  Couche 1 — Backend Django 5 + DRF + PostgreSQL                  │
│  Repo: rst-backend                                               │
│  Domaine API: api.rocseculaire.fr                                │
│                                                                  │
│  ┌─ apps/                                                        │
│  │  ├─ accounts/    (User, sessions, 2FA TOTP)                   │
│  │  ├─ personnes/   (Personne)                                   │
│  │  ├─ sermons/     (Sermon, Serie, Passage, Citation, Plan)     │
│  │  ├─ cantiques/   (Cantique)                                   │
│  │  ├─ annonces/    (Annonce)                                    │
│  │  ├─ temoignages/ (Temoignage, soumission publique)            │
│  │  ├─ nehemie/     (ProjetNehemie singleton)                    │
│  │  ├─ semaine/     (RendezVous, ImageSemaine, VlogSemaine)      │
│  │  └─ medias/      (upload, variantes responsive, métadonnées)  │
│  │                                                               │
│  └─ API REST /api/v1/                                            │
│       ├─ endpoints publics (lecture, contenu publié uniquement)  │
│       └─ endpoints admin   (CRUD, file de modération, brouillons)│
│                                                                  │
│  Stockage médias : django-storages → MEDIA_ROOT local V1,        │
│                    abstraction prête pour S3/R2 plus tard        │
└──────────────────────────────────────────────────────────────────┘
                          │                          │
                GET public, contenu publié           CRUD authentifié
                          │                          │
                          ↓                          ↓
┌────────────────────────────────────┐   ┌──────────────────────────────────┐
│  Couche 2 — Vitrine                │   │  Couche 3 — Admin                │
│  Repo: rst-vitrine (existant)      │   │  Repo: rst-admin (à créer)       │
│  Domaine: rocseculaire.fr          │   │  Domaine: admin.rocseculaire.fr  │
│                                    │   │                                  │
│  React 18 + Vite 5 + TS strict     │   │  React 18 + Vite 5 + TS strict   │
│  Cormorant Garamond, palette       │   │  Inter, palette neutre           │
│  éditoriale ink/paper/accent       │   │  productive (gris/blanc/bleu)    │
│  i18next (libellés UI uniquement)  │   │  Tableaux denses, formulaires,   │
│  fetch GET /api/v1/* publics       │   │  TipTap (éditeur riche),         │
│  pas d'authentification            │   │  drag&drop uploader              │
│                                    │   │  session cookie HttpOnly         │
└────────────────────────────────────┘   └──────────────────────────────────┘
```

### 3.2 Repos Git

**Trois repos séparés** (décision Sunnoogo) :

| Repo | Contenu | Déploiement |
|---|---|---|
| `rst-vitrine` | code actuel | GitHub Pages V1, VPS plus tard |
| `rst-admin` | nouveau projet React/Vite/TS | VPS, sous-domaine `admin.` |
| `rst-backend` | Django + DRF + Postgres | VPS, sous-domaine `api.` |

**Justification** : trois cycles de release indépendants, équipes potentiellement différentes, sécurité (l'admin et le backend ne sont jamais bundlés avec la vitrine publique).

### 3.3 Domaines et CORS

```
rocseculaire.fr           → vitrine (build statique)
admin.rocseculaire.fr     → admin (build statique servi par nginx)
api.rocseculaire.fr       → backend Django (gunicorn derrière nginx)
```

**CORS Django** : `CORS_ALLOWED_ORIGINS = ['https://rocseculaire.fr', 'https://admin.rocseculaire.fr']`. Pas de wildcard.

**CSRF** : sessions admin protégées par CSRF token (header `X-CSRFToken`), récupéré via `GET /api/v1/auth/csrf/`. La vitrine publique n'envoie pas de cookies (lecture seule), donc pas de CSRF.

### 3.4 Authentification — Django sessions

**Choix : Django sessions, pas JWT.** Justification :
- Deux utilisateurs internes, même organisation, sous-domaine partagé `*.rocseculaire.fr` → `SESSION_COOKIE_DOMAIN = '.rocseculaire.fr'` permet à `admin.` de partager la session si besoin.
- Pas de mobile app, pas d'API tierce, pas de besoin de stateless.
- Sessions sont plus simples à révoquer (logout = invalidate côté serveur).
- Cookie `HttpOnly + Secure + SameSite=Lax` (pas Strict, sinon l'admin ne peut pas pointer vers le backend depuis un sous-domaine différent).

### 3.5 Stockage médias

V1 : `MEDIA_ROOT` local sur le VPS (`/var/www/rst/media/`), servi par nginx avec `Cache-Control: public, max-age=31536000, immutable` sur les variantes responsive.

V2 (anticipée) : `django-storages` + S3-compatible (Cloudflare R2 ou Bunny CDN). Aucune réécriture du code applicatif — seulement du settings.

Génération des variantes : `Pillow` + `django-imagekit` (ou `easy-thumbnails`) pour produire automatiquement `thumbnail` (320px), `medium` (768px), `full` (1600px). Le frontend reçoit l'URL des trois.

### 3.6 Déploiement

**VPS Linux** (recommandation : Hetzner CX22 ou OVH VPS Value pour ~5-7 €/mois). Stack :
- nginx (reverse proxy + serveur statique pour vitrine et admin)
- gunicorn (Django)
- PostgreSQL 16
- redis (cache + sessions, optionnel V1)
- certbot Let's Encrypt (3 certificats : apex, admin., api.)

**CI/CD** : GitHub Actions sur chaque repo, build → tests → deploy via SSH. La vitrine peut rester sur GitHub Pages V1 si Sunnoogo le souhaite (le passage à VPS est une question ouverte §11).

---

## §4 — Modèle de données détaillé

> Notation Django ORM. Tous les modèles publiables héritent d'un mixin commun.

### 4.1 Mixins communs

```python
class TimestampedMixin(models.Model):
    cree_le = models.DateTimeField(auto_now_add=True)
    modifie_le = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class AuditMixin(models.Model):
    cree_par = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, on_delete=models.SET_NULL,
        related_name='%(class)s_cree',
    )
    modifie_par = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, on_delete=models.SET_NULL,
        related_name='%(class)s_modifie',
    )
    valide_par = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, blank=True, on_delete=models.SET_NULL,
        related_name='%(class)s_valide',
    )

    class Meta:
        abstract = True


class StatutWorkflowChoices(models.TextChoices):
    BROUILLON = 'brouillon', 'Brouillon'
    EN_REVUE  = 'en_revue',  'En revue'
    PUBLIE    = 'publie',    'Publié'
    REJETE    = 'rejete',    'Rejeté'
    ARCHIVE   = 'archive',   'Archivé'


class PublishableMixin(models.Model):
    statut = models.CharField(
        max_length=12, choices=StatutWorkflowChoices.choices,
        default=StatutWorkflowChoices.BROUILLON,
    )
    publie_le = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True


class LangueChoices(models.TextChoices):
    FR = 'fr', 'Français'
    EN = 'en', 'English'
```

### 4.2 Personne

```python
class Personne(TimestampedMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    civilite = models.CharField(max_length=12, choices=[
        ('Rév.','Rév.'), ('Past.','Past.'), ('Fr.','Fr.'),
        ('Sœur','Sœur'), ('Pasteur','Pasteur'), ('autre','autre'),
    ], default='Fr.')
    prenom = models.CharField(max_length=80)
    nom = models.CharField(max_length=80)
    nom_affichage = models.CharField(max_length=200, blank=True,
        help_text="Override du libellé. Calculé si vide.")
    role_principal = models.CharField(max_length=16, choices=[
        ('pasteur','Pasteur'), ('predicateur','Prédicateur'),
        ('soliste','Soliste'), ('choeur','Chœur'),
        ('musicien','Musicien'), ('ancien','Ancien'),
        ('autre','Autre'),
    ])
    photo = models.ImageField(upload_to='personnes/', blank=True)
    bio_courte_fr = models.TextField(max_length=500, blank=True)
    bio_courte_en = models.TextField(max_length=500, blank=True)
    actif = models.BooleanField(default=True)

    class Meta:
        ordering = ['nom', 'prenom']
        indexes = [models.Index(fields=['role_principal', 'actif'])]

    def __str__(self):
        return self.nom_affichage or f"{self.civilite} {self.prenom} {self.nom}"
```

### 4.3 Sermon (modèle principal)

```python
class TypeCulteChoices(models.TextChoices):
    MERCREDI = 'mercredi-etude',     'Culte du mercredi'
    DIMANCHE = 'dimanche-culte',     'Culte du dimanche'
    VENDREDI = 'vendredi-priere',    'Vendredi prière'
    SPECIAL  = 'evenement-special',  'Événement spécial'


class Sermon(TimestampedMixin, AuditMixin, PublishableMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(unique=True, max_length=120)
    serie = models.ForeignKey(
        'Serie', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='sermons',
    )
    numero_dans_serie = models.PositiveIntegerField(null=True, blank=True)
    date_culte = models.DateTimeField()
    type_culte = models.CharField(max_length=24, choices=TypeCulteChoices.choices)
    predicateur = models.ForeignKey(
        Personne, on_delete=models.PROTECT, related_name='sermons',
        limit_choices_to={'actif': True},
    )
    duree_minutes = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        ordering = ['-date_culte']
        indexes = [
            models.Index(fields=['-date_culte', 'statut']),
            models.Index(fields=['serie', 'numero_dans_serie']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['serie', 'numero_dans_serie'],
                condition=models.Q(serie__isnull=False),
                name='unique_numero_par_serie',
            ),
        ]


class SermonTraduction(models.Model):
    sermon = models.ForeignKey(Sermon, on_delete=models.CASCADE,
                               related_name='traductions')
    langue = models.CharField(max_length=2, choices=LangueChoices.choices)
    titre = models.CharField(max_length=200)
    titre_em = models.CharField(max_length=80, blank=True)
    description_courte = models.TextField(max_length=500, blank=True)
    youtube_url = models.URLField(blank=True)

    class Meta:
        unique_together = [['sermon', 'langue']]


class PassageBiblique(models.Model):  # FR uniquement
    sermon = models.ForeignKey(Sermon, on_delete=models.CASCADE,
                               related_name='passages')
    ordre = models.PositiveIntegerField(default=0)
    reference = models.CharField(max_length=80)  # "Matthieu 7.24-25"
    texte = models.TextField()

    class Meta:
        ordering = ['ordre']


class CitationBranham(models.Model):  # FR uniquement
    sermon = models.ForeignKey(Sermon, on_delete=models.CASCADE,
                               related_name='citations_branham')
    ordre = models.PositiveIntegerField(default=0)
    source = models.CharField(max_length=100)  # "63-0728" ou texte libre
    texte = models.TextField()

    class Meta:
        ordering = ['ordre']


class PlanItem(models.Model):  # FR uniquement
    sermon = models.ForeignKey(Sermon, on_delete=models.CASCADE,
                               related_name='plan')
    ordre = models.PositiveIntegerField(default=0)
    titre = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    @property
    def numero_romain(self):
        return _to_roman(self.ordre + 1)  # I, II, III...

    class Meta:
        ordering = ['ordre']
```

### 4.4 Cantique

```python
class FamilleCantiqueChoices(models.TextChoices):
    RECUEIL = 'recueil', 'Du recueil'
    MESSAGE = 'message', 'Du Message'
    COMPOSE = 'compose', 'Composé ici'


class Cantique(TimestampedMixin, AuditMixin, PublishableMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(unique=True)
    numero = models.CharField(max_length=4)
    famille = models.CharField(max_length=8, choices=FamilleCantiqueChoices.choices)
    interpretes = models.ManyToManyField(Personne, related_name='cantiques', blank=True)
    interpretes_libelle = models.CharField(max_length=200, blank=True)
    duration = models.CharField(max_length=16, blank=True)
    recording_type = models.CharField(max_length=8, blank=True, choices=[
        ('studio','Studio'), ('culte','Culte'), ('live','Live'),
    ])
    recorded_at = models.CharField(max_length=32, blank=True)
    est_vedette = models.BooleanField(default=False)

    class Meta:
        ordering = ['numero']
        indexes = [models.Index(fields=['famille', 'statut'])]


class CantiqueTraduction(models.Model):
    cantique = models.ForeignKey(Cantique, on_delete=models.CASCADE,
                                 related_name='traductions')
    langue = models.CharField(max_length=2, choices=LangueChoices.choices)
    titre = models.CharField(max_length=200)
    titre_em = models.CharField(max_length=80, blank=True)
    detail_by = models.CharField(max_length=300, blank=True)
    youtube_url = models.URLField(blank=True)
    lyrics = models.JSONField(default=list, blank=True)
    # Format: [{"type":"verse"|"refrain", "label":"1"|"℟", "lines":["...","..."]}]

    class Meta:
        unique_together = [['cantique', 'langue']]
```

### 4.5 Annonce

```python
class TypeAnnonceChoices(models.TextChoices):
    REUNION         = 'reunion',         'Réunion'
    VOYAGE          = 'voyage',          'Voyage'
    SORTIE          = 'sortie',          'Sortie'
    EXCEPTIONNELLE  = 'exceptionnelle',  'Exceptionnelle'


class Annonce(TimestampedMixin, AuditMixin, PublishableMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(unique=True)
    type = models.CharField(max_length=16, choices=TypeAnnonceChoices.choices)
    sous_type = models.CharField(max_length=60, blank=True)
    date_debut = models.DateTimeField()
    date_fin = models.DateTimeField(null=True, blank=True)
    lieu = models.CharField(max_length=200)
    affiche = models.ImageField(upload_to='annonces/affiches/', blank=True)
    image = models.ImageField(upload_to='annonces/images/', blank=True)
    cta_url = models.URLField(blank=True)
    est_phare = models.BooleanField(default=False,
        help_text="Force l'annonce en tête du carrousel.")
    featured_eyebrow = models.CharField(max_length=80, blank=True)
    featured_meta = models.JSONField(default=list, blank=True)

    @property
    def statut_temporel(self) -> str:
        """Calculé à la lecture : a-venir | aujourd-hui | passee."""
        now = timezone.now()
        fin = self.date_fin or self.date_debut
        if now < self.date_debut:
            return 'a-venir'
        if now <= fin:
            return 'aujourd-hui'
        return 'passee'

    class Meta:
        ordering = ['-date_debut']
        indexes = [
            models.Index(fields=['date_debut', 'statut']),
            models.Index(fields=['est_phare', '-date_debut']),
        ]


class AnnonceTraduction(models.Model):
    annonce = models.ForeignKey(Annonce, on_delete=models.CASCADE,
                                related_name='traductions')
    langue = models.CharField(max_length=2, choices=LangueChoices.choices)
    titre = models.CharField(max_length=200)
    titre_em = models.CharField(max_length=80, blank=True)
    sous_type_label = models.CharField(max_length=100, blank=True)
    description = models.TextField()
    date_display = models.CharField(max_length=100, blank=True)
    dl = models.CharField(max_length=12, blank=True)
    content_blocks = models.JSONField(default=list, blank=True)

    class Meta:
        unique_together = [['annonce', 'langue']]
```

### 4.6 Temoignage

```python
class StatutTemoignageChoices(models.TextChoices):
    RECU      = 'recu',     'Reçu'
    EN_REVUE  = 'en_revue', 'En revue'
    PUBLIE    = 'publie',   'Publié'
    REJETE    = 'rejete',   'Rejeté'


class Temoignage(TimestampedMixin, AuditMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(unique=True)
    type = models.CharField(max_length=10, choices=[
        ('citation','Citation'), ('illustre','Illustré'), ('recit','Récit'),
    ])
    accent_rouge = models.BooleanField(default=False)
    image = models.ImageField(upload_to='temoignages/', blank=True)
    has_detail = models.BooleanField(default=False)
    source = models.CharField(max_length=20, choices=[
        ('admin','Saisi par admin'),
        ('soumission_publique','Soumission publique'),
    ], default='admin')
    date_recue = models.DateTimeField(default=timezone.now)
    email_contact = models.EmailField(blank=True)
    statut = models.CharField(
        max_length=12, choices=StatutTemoignageChoices.choices,
        default=StatutTemoignageChoices.RECU,
    )
    motif_rejet = models.TextField(blank=True)
    publie_le = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-date_recue']
        indexes = [
            models.Index(fields=['statut', '-date_recue']),
            models.Index(fields=['type', 'statut']),
        ]


class TemoignageTraduction(models.Model):
    temoignage = models.ForeignKey(Temoignage, on_delete=models.CASCADE,
                                   related_name='traductions')
    langue = models.CharField(max_length=2, choices=LangueChoices.choices)
    auteur = models.CharField(max_length=100)
    cite = models.CharField(max_length=100)
    quote_text = models.TextField(blank=True)
    eyebrow = models.CharField(max_length=80, blank=True)
    titre = models.CharField(max_length=200, blank=True)
    corps = models.TextField(blank=True)
    paragraphs = models.JSONField(default=list, blank=True)
    byline = models.CharField(max_length=200, blank=True)
    reading_minutes = models.PositiveIntegerField(null=True, blank=True)
    tag = models.CharField(max_length=100, blank=True)
    verset_ref = models.CharField(max_length=80, blank=True)
    verset_text = models.TextField(blank=True)

    class Meta:
        unique_together = [['temoignage', 'langue']]
```

### 4.7 ProjetNehemie (singleton)

```python
class ProjetNehemie(TimestampedMixin):
    id = models.PositiveSmallIntegerField(primary_key=True, default=1)
    objectif = models.DecimalField(max_digits=12, decimal_places=2)
    collecte = models.DecimalField(max_digits=12, decimal_places=2)
    devise = models.CharField(max_length=4, default='€')
    mise_a_jour = models.DateField()
    mise_a_jour_par = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL,
    )

    history = HistoricalRecords()  # django-simple-history (léger)

    def save(self, *args, **kwargs):
        self.pk = 1  # singleton lock
        super().save(*args, **kwargs)

    @classmethod
    def get_solo(cls):
        obj, _ = cls.objects.get_or_create(
            pk=1,
            defaults={'objectif': 500000, 'collecte': 0, 'mise_a_jour': date.today()},
        )
        return obj
```

### 4.8 RendezVous

```python
class JourCulteChoices(models.TextChoices):
    MERCREDI = 'mercredi', 'Mercredi'
    DIMANCHE = 'dimanche', 'Dimanche'
    VENDREDI = 'vendredi', 'Vendredi'


class RendezVous(TimestampedMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    jour = models.CharField(max_length=10, choices=JourCulteChoices.choices, unique=True)
    heure_debut = models.TimeField()
    heure_fin = models.TimeField()
    actif = models.BooleanField(default=True)


class RendezVousTraduction(models.Model):
    rendez_vous = models.ForeignKey(RendezVous, on_delete=models.CASCADE,
                                    related_name='traductions')
    langue = models.CharField(max_length=2, choices=LangueChoices.choices)
    titre = models.CharField(max_length=120)
    description = models.TextField()

    class Meta:
        unique_together = [['rendez_vous', 'langue']]
```

### 4.9 ImageSemaine et VlogSemaine — voir §2.9 et §2.10 (modèles analogues, omis ici pour compacité ; à compléter par l'agent de codage selon la même convention).

---

## §5 — API REST — endpoints et permissions

> Préfixe global : `/api/v1/`. Format JSON. Pagination par défaut : 20 éléments, page-number.

### 5.1 Authentification et session

| Méthode | Endpoint | Permission | Description |
|---|---|---|---|
| GET | `/auth/csrf/` | ouvert | renvoie le cookie CSRF |
| POST | `/auth/login/` | ouvert (rate-limited) | email + password [+ otp si 2FA] |
| POST | `/auth/logout/` | IsAuthenticated | invalide la session |
| GET | `/auth/me/` | IsAuthenticated | profil + rôle utilisateur |
| POST | `/auth/2fa/enable/` | IsAuthenticated | enrôle TOTP |
| POST | `/auth/2fa/verify/` | IsAuthenticated | confirme TOTP |

### 5.2 Sermons

| Méthode | Endpoint | Permission | Filtres |
|---|---|---|---|
| GET | `/sermons/` | public | `?statut=publie` (forcé), `?serie=`, `?predicateur=`, `?type_culte=`, `?annee=`, `?lang=fr|en`, full-text `?q=` |
| GET | `/sermons/{slug}/` | public | détail (publié uniquement pour les anonymes) |
| GET | `/sermons/admin/` | IsAdminUser | inclut brouillons, en revue, archivés |
| GET | `/sermons/admin/{slug}/` | IsAdminUser | détail avec toutes les langues, tous les statuts |
| POST | `/sermons/admin/` | IsAdminUser | crée en `brouillon` |
| PATCH | `/sermons/admin/{slug}/` | IsAdminUser | maj partielle (création progressive) |
| POST | `/sermons/admin/{slug}/soumettre/` | IsAdminUser (éditeur) | brouillon → en_revue |
| POST | `/sermons/admin/{slug}/publier/` | IsAdminUser **validateur** | en_revue → publie (set publie_le) |
| POST | `/sermons/admin/{slug}/rejeter/` | IsAdminUser validateur | en_revue → rejete + motif |
| POST | `/sermons/admin/{slug}/archiver/` | IsAdminUser | publie → archive |
| DELETE | `/sermons/admin/{slug}/` | IsAdminUser validateur | suppression dure (soft delete recommandé en §10) |

### 5.3 Sous-ressources Sermon

| Méthode | Endpoint | Permission |
|---|---|---|
| POST/PATCH/DELETE | `/sermons/admin/{slug}/passages/` | IsAdminUser |
| POST/PATCH/DELETE | `/sermons/admin/{slug}/citations/` | IsAdminUser |
| POST/PATCH/DELETE | `/sermons/admin/{slug}/plan/` | IsAdminUser |

Format de réponse Sermon (lecture publique, FR par défaut) :

```json
{
  "id": "uuid",
  "slug": "demi-chretiens-2026-04-29",
  "titre": "Nous ne sommes pas des demi-chrétiens.",
  "titre_em": "des demi-chrétiens.",
  "description_courte": "Service du mercredi...",
  "youtube_url": "https://www.youtube.com/watch?v=WmhljxW5zUU",
  "serie": { "id": "uuid", "titre": "Culte du mercredi" },
  "numero_dans_serie": null,
  "date_culte": "2026-04-29T19:30:00+02:00",
  "type_culte": "mercredi-etude",
  "predicateur": {
    "id": "uuid",
    "nom_affichage": "Fr. Michel Orodapo",
    "photo_url": "https://api.../media/personnes/orodapo_thumb.jpg"
  },
  "duree_minutes": null,
  "passages": [],
  "citations_branham": [],
  "plan": [],
  "publie_le": "2026-04-29T22:15:00+02:00",
  "lang_disponibles": ["fr", "en"]
}
```

### 5.4 Cantiques, Annonces, Témoignages, Personnes

Endpoints CRUD analogues, avec leurs filtres respectifs :

```
GET    /cantiques/                 ?famille=, ?interprete=, ?q=, ?lang=
GET    /annonces/                  ?type=, ?periode=, ?statut_temporel=
GET    /annonces/{slug}/
GET    /temoignages/               ?type=, ?lang=
GET    /personnes/                 ?role=, ?actif=
```

### 5.5 Soumission publique de témoignage

```
POST /temoignages/soumettre/        → public, captcha + rate-limit
  body : { auteur, email_contact, type, quote_text|corps, lang }
  effet : crée Temoignage(statut='recu', source='soumission_publique')
  réponse : 201 Created + message « Merci, votre témoignage est en revue »
```

### 5.6 Néhémie

```
GET   /nehemie/                    public  → { objectif, collecte, devise, mise_a_jour, pourcentage }
PUT   /nehemie/                    IsAdminUser → met à jour collecte, mise_a_jour
GET   /nehemie/historique/         IsAdminUser → liste des MAJ via simple-history
```

### 5.7 Médias

```
POST   /medias/upload/              IsAdminUser, multipart  → { id, url, variantes:{thumbnail,medium,full}, type, taille, mime }
GET    /medias/                     IsAdminUser, paginé      → bibliothèque
DELETE /medias/{id}/                IsAdminUser
GET    /medias/{id}/utilise-par/    IsAdminUser              → liste des entités qui référencent ce média (sécurité avant suppression)
```

### 5.8 Format des erreurs

```json
{
  "error": {
    "code": "validation_error",
    "message": "Le champ 'titre' est obligatoire.",
    "details": {
      "fr": { "titre": ["Ce champ est obligatoire."] }
    }
  }
}
```

Codes : `validation_error` (400), `authentication_required` (401), `permission_denied` (403), `not_found` (404), `conflict` (409, ex. slug déjà pris), `rate_limited` (429), `server_error` (500).

---

## §6 — Spécification de l'interface admin

### 6.1 Layout général

```
┌────────────────────────────────────────────────────────────────────┐
│  HEADER (60 px) — fond gris très clair, ombre fine                 │
│  [logo RST mini] [Roc Séculaire · Admin]    [Voir le site →] [👤▾] │
└────────────────────────────────────────────────────────────────────┘
┌──────────────┬─────────────────────────────────────────────────────┐
│  SIDEBAR     │  MAIN                                               │
│  (220 px,    │  ┌─ Breadcrumb : Accueil › Cultes › Édition         │
│   fixe)      │  ├─ Titre H1 + actions principales (droite)         │
│              │  └─ Contenu : tableau / formulaire / dashboard      │
│  Dashboard   │                                                     │
│  Personnes   │                                                     │
│  Cultes ▾    │                                                     │
│  Cantiques   │                                                     │
│  Annonces    │                                                     │
│  Témoignages │                                                     │
│   ↳ File de  │                                                     │
│      modé-   │                                                     │
│      ration  │                                                     │
│  Cette       │                                                     │
│   semaine    │                                                     │
│  Néhémie     │                                                     │
│  Médiathèque │                                                     │
│  ───         │                                                     │
│  Réglages    │                                                     │
└──────────────┴─────────────────────────────────────────────────────┘
```

**Tokens design admin** (à finaliser dans Claude Design) :
- Police principale : **Inter** (system fallback : -apple-system, Segoe UI)
- Palette : `--gray-50` à `--gray-900`, `--blue-500` (accent bouton primaire), `--green-500` (succès), `--amber-500` (en revue), `--red-500` (rejet/erreur)
- Spacing : système 4 px (4, 8, 12, 16, 24, 32, 48, 64)
- Coins : `--radius-sm: 4px`, `--radius-md: 6px`, `--radius-lg: 8px`
- Pas de Cormorant Garamond, pas d'italique éditorial

### 6.2 Écran 1 — Login

```
┌──────────────── Centré (400 px) ─────────────────┐
│                                                  │
│        [logo RST]                                │
│        Roc Séculaire — Admin                     │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │ Email                                      │  │
│  │ [_________________________________]        │  │
│  │                                            │  │
│  │ Mot de passe                               │  │
│  │ [_________________________________] 👁     │  │
│  │                                            │  │
│  │ [si 2FA activé : Code TOTP                 │  │
│  │  [_______]                       ]         │  │
│  │                                            │  │
│  │ [   Se connecter   ]                       │  │
│  │                                            │  │
│  │ Mot de passe oublié ?                      │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

### 6.3 Écran 2 — Dashboard

Trois rangées, densité élevée :

**Rangée 1 — Cartes de synthèse (4 colonnes)** :
- *Cette semaine* : prochain culte (date, prédicateur, titre s'il existe), bouton « Compléter le sermon »
- *File de modération* : N témoignages reçus, M sermons en revue. Bouton « Traiter (N+M) »
- *Projet Néhémie* : `54 259 € / 500 000 € (10,9 %)` — dernière MAJ il y a X jours. Bouton « Mettre à jour »
- *Statistiques* : nombre total publié par type (sermons, cantiques, annonces, témoignages)

**Rangée 2 — Activité récente** : 10 dernières créations/modifications avec auteur et timestamp.

**Rangée 3 — Actions rapides** : 4 boutons larges « + Sermon », « + Annonce », « + Cantique », « MAJ Néhémie ».

### 6.4 Écran 3 — Liste des sermons

Tableau dense, sticky header :

| date ▼ | titre | série | prédicateur | type | statut | actions |
|---|---|---|---|---|---|---|

- **Filtres** au-dessus : période (toutes / 2026 / 2025 / 2024), série (select), prédicateur (select), type de culte (chips), statut (chips). Recherche full-text sur titre et descriptions.
- **Statut** : pastille colorée + libellé (gris brouillon, ambre en_revue, vert publie, rouge rejete, gris foncé archive).
- **Actions par ligne** (kebab menu ⋯) : Éditer, Dupliquer, Soumettre/Publier/Archiver selon statut, Supprimer (validateur seulement).
- **Bouton primaire** en haut à droite : « + Nouveau sermon » → ouvre l'éditeur.
- Pagination : 25 par page.

### 6.5 Écran 4 — Édition d'un sermon

Formulaire long en sections collapsibles, autosave brouillon toutes les 30 secondes.

```
┌─────────────────────────────────────────────────────────────────┐
│  Édition · Nous ne sommes pas des demi-chrétiens.    [Brouillon]│
│  [Voir public] [Soumettre à validation] [Enregistrer brouillon] │
└─────────────────────────────────────────────────────────────────┘

▼ §1 Métadonnées
  Date du culte :    [2026-04-29] [19:30]
  Type :             ( ) Mercredi  (•) Dimanche  ( ) Vendredi  ( ) Spécial
  Série :            [Select... ▾]    Numéro : [__]    [+ Nouvelle série]
  Prédicateur :      [Select Personne ▾]    [+ Nouvelle personne]
  Durée (min) :      [__]

▼ §2 Contenu rédactionnel  [tab FR | tab EN]

  Onglet FR :
    Titre :              [_________________________________________]
    Partie italique :    [____________________]  (optionnel, ex: "des demi-chrétiens.")
    Slug :               [demi-chretiens-2026-04-29] (auto, modifiable)
    URL YouTube :        [https://www.youtube.com/watch?v=...]
    Description courte : [Service du mercredi à l'assemblée RST.]    (max 500)

  Onglet EN :
    Title:               [____________________]
    Italic part:         [____________________]
    YouTube URL (EN):    [____________________]
    Short description:   [____________________]

▼ §3 Passages bibliques  (FR uniquement, drag&drop pour réordonner)
  ┌─────────────────────────────────────────────────────────────┐
  │  Référence : [Éphésiens 2 . 19-22]                          │
  │  Texte : [textarea multi-lignes]                            │
  │  ⋮⋮ drag · ✕ supprimer                                       │
  └─────────────────────────────────────────────────────────────┘
  [+ Ajouter un passage]

▼ §4 Citations Branham  (FR, drag&drop)
  Source : [63-0728]
  Texte : [textarea]
  [+ Ajouter une citation]

▼ §5 Plan du message  (FR, drag&drop)
  I. Titre [___________]   Description [textarea]
  II. ...
  [+ Ajouter une étape]

▼ §6 Publication
  Statut actuel : Brouillon
  Audit :  Créé par tapsobascaleb le 2 mai 2026 · Modifié il y a 12 min

  [Soumettre à validation →]
```

**Validations** :
- Titre FR obligatoire dès soumission. Titre EN obligatoire avant publication finale.
- URL YouTube validée (regex `youtube\.com|youtu\.be`).
- Date du culte requise.
- Slug unique en base (alerte temps réel).

### 6.6 Écran 5 — Liste des cantiques

Mêmes principes que sermons. Filtres : famille (chips Tous/Recueil/Message/Composé), interprète (select), `est_vedette` (toggle), recherche (titre + paroles FR + EN).

### 6.7 Écran 6 — Édition d'un cantique

```
▼ §1 Métadonnées
  Numéro : [01]    Famille : (•) Composé ici  ( ) Du recueil  ( ) Du Message
  Interprètes : [chips multi-select Personne ▾]
  Libellé override : [Fr. Jules Kayembe · acoustique]
  Durée : [7MIN 26]   Type d'enregistrement : [Studio ▾]
  Recorded at : [Pâques 2026]
  ☑ Cantique vedette (apparaît en 2×2 dans la grille publique)

▼ §2 Contenu — Onglet FR
  Titre : [___]   URL YouTube FR : [___]
  Paroles (éditeur structuré) :
    [+ Ajouter un couplet] [+ Ajouter un refrain]
    Couplet 1 : (textarea multi-lignes)
    Refrain ℟ : (textarea multi-lignes)
    Couplet 2 : ...

▼ §2 Contenu — Onglet EN  (mêmes champs)

▼ §3 Publication / workflow (cf. sermon)
```

Les paroles utilisent un éditeur **structuré** (pas WYSIWYG riche), un mini-composant qui génère le JSON `[{ type, label, lines }]`. Boutons : « + Couplet » (auto-numérotation 1, 2, 3...), « + Refrain » (label `℟`), « + Pont » (label libre), drag&drop pour réordonner.

### 6.8 Écran 7 — Liste des annonces

Tableau avec colonne **statut temporel** (calculé) : pastille verte « À venir », bleue « Aujourd'hui », grise « Passée ». Filtres : type (chips), période (cette année / archives), statut workflow.

Tri par défaut : `date_debut` croissant pour à-venir, décroissant pour passées.

### 6.9 Écran 8 — Édition d'une annonce

```
▼ §1 Métadonnées
  Type : (•) Réunion  ( ) Voyage  ( ) Sortie  ( ) Exceptionnelle
  Sous-type : [Couples] (libre, suggestion auto)
  Date début : [2026-05-08] [19:30]
  Date fin :   [2026-05-08] [22:00]    (optionnel, multi-jours)
  Lieu : [Salle Bacchus, Vitry-sur-Seine]
  ☑ Annonce phare (force la mise en avant carrousel)

▼ §2 Médias
  Affiche : [drag&drop ou parcourir]    (preview 200×280)
  Image complémentaire : [drag&drop]    (preview 400×225)
  CTA URL : [https://...]               (optionnel)

▼ §3 Contenu — Onglet FR
  Titre : [___]    Italique : [___]
  Sous-type label override : [Réunion · Couples]
  Description : [textarea, max 800 caractères]
  Date display override : [Du 22 au 25 mai 2026]   (optionnel)
  DL court : [VEN. MAI]
  Featured eyebrow : [Annonce phare · Mai 2026]
  Featured meta : [+ Ajouter (label, valeur)]

▼ §4 Compte-rendu (annonces passées uniquement)
  Bloc-builder :
    [+ Paragraphe]  [+ Image]
    Paragraphe 1 : [textarea]
    Image 1 : [picker média + alt + taille small/medium/wide]
    Paragraphe 2 : [textarea]
    ...

▼ §5 Onglet EN  (mêmes champs)

▼ §6 Publication
```

### 6.10 Écran 9 — Liste des témoignages (avec file de modération)

Trois sections empilées dans la même page :

1. **À traiter** (`statut=recu`) — encadré ambre. Pour chaque : auteur, type, langue, extrait 80 char, source (admin/public), date reçue. Actions : « Examiner ».
2. **En revue** (`statut=en_revue`) — qui les a soumis, qui doit valider.
3. **Publiés** — tableau standard, filtrable.

### 6.11 Écran 10 — Édition / examen d'un témoignage

```
▼ §1 Métadonnées
  Type : (•) Citation  ( ) Illustré  ( ) Récit
  Source : Soumission publique (envoyée par tapsobascaleb@... le 28/04/2026)
  Date reçue : 28 . 04 . 2026
  ☐ Accent rouge (mosaïque)

▼ §2 Contenu — Onglet FR
  Auteur (anonymisable) : [— une sœur · Île-de-France]
  Cite : [— une sœur · Île-de-France]
  Texte court (citation) : [textarea]
  -- ou (selon type) --
  Eyebrow : [Récit · 14 . 03 . 2026]
  Titre : [___]
  Corps : [textarea ou éditeur riche TipTap]
  Image illustration : [picker média]   ☑ Avec récit détaillé
  Récit complet (paragraphs structurés lede/p/pull) :
    [+ Ajouter paragraphe] : Type [Lede ▾] Texte [textarea]
  Verset cité : Référence [Matthieu 7 . 24]  Texte [...]

▼ §2 Onglet EN

▼ §3 Décision
  ( ) Approuver et publier      → statut = publie
  ( ) Rejeter (motif obligatoire) → statut = rejete
  ( ) Garder en revue
  Motif (si rejet) : [textarea]
  [Confirmer la décision]
```

### 6.12 Écran 11 — Cette semaine (vlog hebdo)

Page dédiée, un seul vlog actif visible en haut, archives en bas (déroulant).

```
▼ Vlog actif (Semaine 18 · 2026-04-29)
  [aperçu vidéo embed]  [bouton "Remplacer le vlog"]

  Métadonnées (FR / EN tabs)
  Sermon associé : [Select sermon ▾] ou [créer]
  Cantique de la semaine : [Select cantique ▾]
  Verset thème : [référence] [texte]
  Fil du message (paragraphes, versets cités)
  Témoignage de la semaine : [auteur] [texte]

  Photos de la semaine (6 emplacements) :
  [grande 1] [grande 2] [petite 3] [petite 4] [petite 5] [petite 6]
  drag&drop pour remplacer chaque tuile, picker dans la médiathèque

▼ Archives (déroulant)
  Liste des vlogs précédents, lecture seule (réactivable plus tard).
```

### 6.13 Écran 12 — Néhémie

```
┌─ Avancement ────────────────────────────────────┐
│  Objectif :     [500 000] €                     │
│  Collecté :     [54 259]  €  (10,9 %)           │
│  Mise à jour :  [2026-04-27]                    │
│  [Enregistrer la mise à jour]                   │
└─────────────────────────────────────────────────┘

┌─ Historique des mises à jour ───────────────────┐
│  27.04.2026  54 259 €  (+1 200 €) — Sunnoogo    │
│  25.03.2026  53 059 €  (+850 €)   — Sunnoogo    │
│  ...                                            │
└─────────────────────────────────────────────────┘
```

### 6.14 Écran 13 — Personnes

Tableau : photo, civilité, prénom, nom, rôle, actif. Filtres : rôle (chips), actif (toggle).

Édition : civilité, prénom, nom, override nom_affichage, rôle, photo (upload), bio FR, bio EN, actif.

### 6.15 Écran 14 — Médiathèque

Grille de vignettes (paginée), filtres par type (image / affiche / photo), recherche par nom de fichier ou alt. Actions : voir détails, copier URL, voir « Utilisé par » (sécurité avant suppression), supprimer.

Upload : drag&drop dans une zone large, génère automatiquement les variantes responsive.

### 6.16 Écran 15 — Réglages

V1 : gestion des utilisateurs (lister, ajouter, désactiver, attribuer rôle éditeur/validateur, forcer reset de mot de passe, gérer 2FA).

V2 (hors scope) : édition de l'adresse, téléphone, IBAN, libellés UI traduisibles.

### 6.17 Composants UI à concevoir

- Tableaux denses avec sticky header, tri client, multi-tri
- Sélecteurs date+heure (suggestion : `react-datepicker` ou natif)
- Multi-select avec recherche (suggestion : `react-select` ou `cmdk`)
- Éditeur riche WYSIWYG : **TipTap** (pour témoignages corps, descriptions longues annonces)
- Éditeur structuré (paroles cantiques, plan sermon, paragraphs témoignage) : composant maison
- Drag&drop uploader fichier (suggestion : `react-dropzone`)
- Picker médiathèque modal
- Toggle de publication / pastille de statut
- Breadcrumbs cliquables
- Modales de confirmation (suppression, rejet)
- Tabs FR/EN sur tous les formulaires de contenu rédactionnel

---

## §7 — Gestion des médias et stockage

### 7.1 Types de médias par entité

| Entité | Champ média | Type | Taille max recommandée |
|---|---|---|---|
| Sermon | `youtube_url` (FR + EN) | URL externe | — |
| Cantique | `youtube_url` (FR + EN) | URL externe | — |
| Annonce | `affiche` | Image PNG/JPEG | 5 Mo |
| Annonce | `image` | Image PNG/JPEG | 3 Mo |
| Annonce | `content_blocks[].src` (compte-rendu) | Image | 3 Mo |
| Témoignage | `image` | Image PNG/JPEG | 3 Mo |
| Personne | `photo` | Image JPEG | 2 Mo |
| ImageSemaine | `image` | Image PNG/JPEG | 5 Mo |
| VlogSemaine | `poster` | Image | 3 Mo |

**Pas d'audio MP3, pas de PDF en V1** (décision Sunnoogo).

### 7.2 Variantes responsive

Génération automatique via `Pillow` (ou `django-imagekit`) à l'upload :
- `thumbnail` — 320 px largeur
- `medium` — 768 px
- `full` — 1600 px (max), avec compression JPEG qualité 85

Chaque image renvoie un objet `{ id, url, variantes: { thumbnail, medium, full }, mime, taille_octets, alt }`.

### 7.3 CDN

V1 : VPS direct via nginx avec headers de cache longs (`Cache-Control: public, max-age=31536000, immutable`) et noms de fichiers contenant un hash.

V2 (anticipée) : Cloudflare devant le VPS (gratuit, CDN+SSL+protection DDoS) ou Bunny CDN (~1 €/mois pour le projet).

### 7.4 Vidéos

Pas de stockage vidéo serveur. **YouTube uniquement**, via embed iframe sur la vitrine. La chaîne RST utilise `@kollonell` pour les prédications.

### 7.5 Suppression et nettoyage

- **Médiathèque** : avant suppression, l'admin voit la liste « Utilisé par » (sermons, annonces, témoignages qui référencent ce média). Si vide, suppression hard ; sinon, blocage.
- **Images de la semaine** : rotation chaque lundi. Les 6 anciennes passent à `actif=false` et sont conservées en archive (consultables plus tard, non affichées en V1).
- **Job hebdomadaire** : nettoyage des médias orphelins (uploadés mais jamais référencés depuis 30 jours).

---

## §8 — Authentification et sécurité

### 8.1 Stratégie

- **Django sessions** sur `admin.rocseculaire.fr`, cookie `HttpOnly + Secure + SameSite=Lax`.
- **Pas de connexion par fournisseur tiers** (Google, Microsoft) en V1.
- **Backend de mot de passe** : Argon2 (`PASSWORD_HASHERS = ['django.contrib.auth.hashers.Argon2PasswordHasher', ...]`).

### 8.2 Politique de mot de passe

- Longueur minimale : **12 caractères**
- Au moins une majuscule, une minuscule, un chiffre, un caractère spécial
- Vérification contre la liste `pwned-passwords` (via `django-pwned-passwords` ou check direct API HIBP)
- Expiration : aucune (pas de rotation forcée — guideline NIST 2017+)
- Changement : libre, sans validation par mail au début

### 8.3 Rate limiting et protection brute force

- `django-axes` : 5 tentatives échouées en 30 minutes → IP bloquée 1h
- Sur `/auth/login/` : 10 req/min par IP (`django-ratelimit`)
- Sur `/temoignages/soumettre/` : 3 soumissions/heure par IP + reCAPTCHA v3

### 8.4 2FA TOTP

- **Recommandé fortement, optionnel V1**, devient obligatoire V2.
- Implémenté via `django-otp` + `django-otp-totp`.
- Activation depuis l'écran Réglages → Profil utilisateur.

### 8.5 CORS

```python
CORS_ALLOWED_ORIGINS = [
    'https://rocseculaire.fr',
    'https://www.rocseculaire.fr',
    'https://admin.rocseculaire.fr',
]
CORS_ALLOW_CREDENTIALS = True  # nécessaire pour cookie session admin
SESSION_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_DOMAIN = '.rocseculaire.fr'
```

### 8.6 CSRF

Tous les endpoints qui mutent (POST/PUT/PATCH/DELETE) requièrent un token CSRF, fourni par `GET /api/v1/auth/csrf/` puis envoyé en header `X-CSRFToken`.

### 8.7 Logs d'audit

- `cree_par`, `modifie_par`, `valide_par` sur toutes les entités publiables
- `django-simple-history` activé sur `Sermon`, `Cantique`, `Annonce`, `Temoignage`, `ProjetNehemie`
- Logs Django standard envoyés vers `journalctl` (VPS systemd) pour les actions sensibles : login, logout, échecs auth, suppressions

### 8.8 Données personnelles (RGPD)

Soumissions publiques de témoignages :
- Captcha + collecte d'email (consentement explicite)
- Mention claire « En envoyant ce témoignage, vous acceptez qu'il soit examiné et potentiellement publié sous une forme anonymisée »
- Droit à l'effacement : un endpoint de suppression réservé au validateur permet de retirer un témoignage publié et l'email associé

---

## §9 — Migration des données actuelles

### 9.1 Données à migrer (depuis `src/data/*.ts`)

| Source | Cible | Volume |
|---|---|---|
| `sermons.ts` (10 entrées) | `Sermon` + traductions FR (l'EN restera vide en V1, à compléter par l'admin) | 10 |
| `cantiques.ts` (10 entrées) | `Cantique` + traductions FR | 10 |
| `annonces.ts` (5 entrées) | `Annonce` + traductions FR | 5 |
| `temoignages.ts` (8 entrées) | `Temoignage` + traductions FR | 8 |
| `nehemie.ts` (singleton) | `ProjetNehemie` (seulement objectif/collecte/miseAJour) | 1 |
| `rendez-vous.ts` (3 entrées) | `RendezVous` + traductions FR | 3 |
| `images-semaine.ts` (6 entrées) | `ImageSemaine` (statut actif) | 6 |
| `vlog-semaine.ts` (singleton) | `VlogSemaine` actif + traduction FR | 1 |
| Strings prédicateurs uniques | `Personne` (déduplication par nom complet) | ~6 personnes |
| Strings séries uniques | `Serie` (déduplication par titre) | ~6 séries |

### 9.2 Procédure

1. **Extraction** : un script Python (`scripts/extract_legacy.py`) parse les fichiers TS via `ts2json` (ou un parseur AST simple), produit `legacy_data.json` normalisé.
2. **Import** : management command Django `python manage.py import_legacy_data legacy_data.json`. Idempotent (UPSERT sur slug).
3. **Médias** : copie des fichiers de `public/images/`, `public/images/annonces/<slug>/`, `public/genese/` vers `MEDIA_ROOT/legacy/`. Mise à jour des chemins dans les modèles.
4. **Validation** : tests automatiques (`pytest`) qui rendent chaque page publique de la vitrine en lisant l'API et comparent les données affichées avec les données originales (snapshot test).
5. **Rollback** : sauvegarde des fichiers `src/data/` dans la branche `legacy-static-data` avant suppression côté vitrine.

### 9.3 Ce qui n'est PAS migré (V1)

- Pages Genèse (figées, restent en TypeScript dans la vitrine)
- Mot du pasteur (figé)
- Bâtisseurs Néhémie (abandonné)
- Modes de don, montants de contribution (restent dans la vitrine)
- Réglages assemblée, footer (restent dans la vitrine)
- Audio MP3 sermons (abandonnés)

---

## §10 — Champs proposés en complément

Liste des champs **non présents dans le frontend** mais recommandés. Chacun justifié par un cas d'usage admin réel.

| Champ | Sur entités | Justification |
|---|---|---|
| `cree_par`, `modifie_par`, `valide_par` (FK User) | toutes les entités publiables | Audit minimal, requis par le workflow à 4 yeux |
| `publie_le` (DateTime) | toutes les entités publiables | Distinct de `cree_le` ; sert au tri public et aux statistiques de fréquence de publication |
| `slug` (SlugField unique) | Sermon, Cantique, Annonce, Temoignage | URL stables, évite les fuites d'UUID et permet `/eglise/cultes/{slug}` |
| `meta_title`, `meta_description`, `og_image` | Sermon, Cantique (et plus tard Annonce) | SEO et partages réseaux sociaux. À traduire FR/EN |
| `ordre_affichage` (PositiveInteger) | ImageSemaine, PassageBiblique, CitationBranham, PlanItem | Permet le drag&drop de réordonnancement |
| `nombre_vues` (PositiveInteger) | Sermon, Cantique | Analytics légères ; incrémenté côté backend lors d'un GET public (avec déduplication IP+24h) |
| `supprime_le` (DateTime nullable) — soft delete | Sermon, Cantique, Annonce, Temoignage | Évite les suppressions accidentelles ; un job de purge nettoie après 30 jours |
| `motif_rejet` (Text) | Temoignage | Permet à l'éditeur de comprendre pourquoi son témoignage a été rejeté |
| `lang_disponibles` (calculé) | toutes les entités traduisibles | Le frontend public sait quelles langues sont publiées |
| `featured_meta` (JSONField) | Annonce | Aujourd'hui hardcodé `[{lbl, val}]` dans `annonces.ts` ; on conserve en JSON pour souplesse |
| `bio_courte_fr`, `bio_courte_en` | Personne | Préparation d'une future page « Notre équipe » |
| `email_contact` (Email) | Temoignage | Permet de revenir vers l'auteur d'une soumission publique pour clarification |

---

## §11 — Questions ouvertes pour le commanditaire

> Décisions que l'audit n'a **pas pu trancher** seul. À résoudre avec Sunnoogo avant la phase de codage.

### Q1 — Hébergement

Quel fournisseur VPS ? Hetzner CX22 (~5 €/mois, Allemagne) ou OVH VPS Value (~6 €/mois, France) ? Préférence pour un hébergeur français pour la conformité RGPD ?

### Q2 — Domaine et DNS

Le domaine `rocseculaire.fr` est-il déjà réservé ? Si oui, où ? Les DNS sont-ils gérés par le registrar ou délégués (Cloudflare) ?

### Q3 — Vitrine après backend

Trois scénarios pour la vitrine après mise en production de l'API :
1. **Reste statique sur GitHub Pages**, fait des `fetch` directs à `api.rocseculaire.fr` au runtime côté client. Simple, mais SEO faible (pas de SSR).
2. **Passe en SSG** (Astro ou Vite SSG), build périodique qui interroge l'API et génère des HTML statiques. Bon SEO, latence de publication ~10 minutes (rebuild).
3. **Passe en SSR** (Next.js, Remix). Bon SEO, latence faible. Plus complexe, nécessite un serveur Node ou edge.

**Recommandation** : option 1 pour V1 (zéro changement), option 2 pour V1.5 si SEO devient prioritaire.

### Q4 — 2FA TOTP : optionnel ou obligatoire dès V1 ?

Recommandation : optionnel V1, fortement encouragé, **obligatoire V2** (~3 mois après mise en prod).

### Q5 — Stripe / paiement carte Néhémie

Hors scope V1 confirmé ? Ou intégration prévue dans le périmètre V1 (~2 semaines de travail supplémentaires) ?

### Q6 — Programmation de publication différée

L'admin n'a pas demandé cette fonction (création progressive lui suffit). À reconfirmer : un sermon `en_revue` reste en attente de publication manuelle, ou peut-on programmer une auto-publication à `date_culte + 3h` (par exemple) ?

### Q7 — Newsletter et notifications

L'admin envoie-t-il des emails (newsletter, notification de nouveau sermon) à un mailing-list de l'assemblée ? Hors scope V1 ?

### Q8 — Soumission publique de témoignages — captcha

reCAPTCHA v3 (Google) ou hCaptcha (privacy-friendly) ? Recommandation : hCaptcha pour respect RGPD.

### Q9 — Backup PostgreSQL

Stratégie de sauvegarde : `pg_dump` quotidien envoyé sur un stockage tiers (Backblaze B2 ~1 €/mois) ? Rétention 30 jours ?

### Q10 — Documentation utilisateur

Le pasteur (utilisateur final) a-t-il besoin d'une documentation écrite ou d'une vidéo de prise en main ? Inclure dans la phase E.

### Q11 — Bâtisseurs et jalons Néhémie

Réintroduire ces entités en V1.5 ou V2 si la collecte le justifie ? Pour V1, les bâtisseurs actuels affichés sur la vitrine restent dans `src/data/nehemie.ts`.

### Q12 — Pages Genèse

Confirmer définitivement : éditables jamais, ou éditables un jour ? Si jamais, l'agent de codage peut supprimer toute trace dans le PRD V2.

---

## §12 — ROADMAP de mise en œuvre

> Estimations en jours-homme, pour 1 développeur senior à plein temps (à diviser par 2 si Sunnoogo travaille à temps partiel sur le projet).

### Phase A — Fondations backend (5 j)

- A1. Init Django 5 + DRF + PostgreSQL + structure des apps (1 j)
- A2. Auth Django sessions + endpoints `/auth/*` + tests (1 j)
- A3. Modèles `Personne`, `Serie`, `User` custom + migrations (1 j)
- A4. Tests unitaires modèles + setup CI GitHub Actions (1 j)
- A5. Documentation API initiale (drf-spectacular → OpenAPI) (1 j)

**Risques** : choix du backend de session (DB vs Redis) ; configuration cookie cross-subdomain en local (souvent piégeux).

### Phase B — Modèles métier et API publique (10 j)

- B1. Modèle `Sermon` + sous-modèles + traductions + tests (2 j)
- B2. Modèle `Cantique` + tests (1 j)
- B3. Modèles `Annonce`, `Temoignage` + soumission publique + tests (2 j)
- B4. Singletons `ProjetNehemie`, `VlogSemaine`, `RendezVous`, `ImageSemaine` (1 j)
- B5. Serializers + ViewSets DRF en lecture publique (filtres, pagination, tri) (2 j)
- B6. Migration des données `src/data/` → script + management command + tests snapshot (2 j)

**Risques** : qualité du parsing TS → JSON ; gestion fine des slugs uniques pour la rétrocompatibilité d'URL.

### Phase C — Maquette admin dans Claude Design (parallèle, 3-5 j)

- C1. Génération initiale avec ce PRD comme prompt
- C2. Itérations avec Sunnoogo sur les écrans clés (formulaire sermon, file de modération, dashboard)
- C3. Export du handoff bundle (variables, composants, exports d'écrans)

### Phase D — Implémentation admin frontend (12 j)

- D1. Init projet React + Vite + TS + tokens design admin (1 j)
- D2. Routing protégé + layout sidebar + login + 2FA (2 j)
- D3. Dashboard + écrans Personnes (1 j)
- D4. Écrans Sermons (liste + édition + workflow) (2 j)
- D5. Écrans Cantiques (liste + édition + éditeur paroles structuré) (1.5 j)
- D6. Écrans Annonces (liste + édition + bloc-builder compte-rendu) (1.5 j)
- D7. Écrans Témoignages (file de modération + édition) (1.5 j)
- D8. Écran Cette semaine (vlog hebdo) (1 j)
- D9. Écran Néhémie + Médiathèque + Réglages utilisateurs (1.5 j)

**Risques** : gestion des onglets FR/EN sur tous les formulaires (composant transverse) ; éditeur structuré paroles (pas off-the-shelf, à coder).

### Phase E — Polissage et déploiement (5 j)

- E1. Logs d'audit + django-simple-history + 2FA optionnel (1 j)
- E2. Backup automatique PostgreSQL via cron + médias (1 j)
- E3. Déploiement VPS : nginx, gunicorn, systemd, Let's Encrypt 3 certificats (1.5 j)
- E4. Documentation utilisateur (PDF / vidéo de prise en main pour le pasteur) (1 j)
- E5. Recette finale avec Sunnoogo + corrections (0.5 j)

**Total estimé** : **32-37 jours-homme** sur 8-10 semaines calendaires si développeur à temps partiel.

### Risques transverses

- **Saisie FR + EN** : la double saisie peut décourager l'admin. Prévoir dans la maquette un raccourci « copier FR → EN » et accepter la publication FR seul, EN ajouté plus tard (publish partiel).
- **Workflow à 4 yeux** : si une seule personne est dispo, prévoir le rôle « validateur de secours » ou autoriser auto-validation pour les contenus mineurs (typos).
- **Migration des médias** : les chemins `/images/...` du frontend statique doivent pointer vers `/media/...` après migration. Risque de liens cassés.
- **YouTube** : si une vidéo est supprimée par YouTube, le frontend continue d'afficher un embed cassé. Prévoir un check périodique (job hebdo `python manage.py check_youtube_urls`).

---

**Fin du PRD-ADMIN.md.**

> Ce document est le **cahier des charges de référence** pour les phases C (maquette Claude Design) et D (implémentation backend + admin). Toute évolution doit faire l'objet d'une nouvelle version (v1.1, v2.0). Les questions ouvertes du §11 doivent être tranchées avant le début de la phase D.
