# PRD — Sous-page **Annonces** (04c) · RST Front Pages

> Document de référence à donner à Claude Code en complément du `PRD.md` global et des PRD précédents (`PRD-CULTES.md`, `PRD-CANTIQUES.md`).
> **Objectif** : reproduire à l'identique la sous-page « Annonces » (onglet contextuel de la page 04 — L'Église / Actualité). Pas le footer, pas la nav, pas l'en-tête : **uniquement le contenu de la sous-page Annonces** (du hero jusqu'à la fin de la chronologie).
> Mise en hi-fi : remplacer `assets/sanctuary.jpeg` par une vraie image d'annonce phare, brancher les filtres État + Type, alimenter la chronologie par les vraies annonces saisies au secrétariat. **L'architecture, les espacements, la typographie, les couleurs et la composition ne changent pas.**

---

## 0. Localisation dans l'app

```
Page 04 — L'Église / Actualité
└── ctx-nav (sous-onglets contextuels)
    ├── Cette semaine
    ├── Cultes              (cf. PRD-CULTES.md)
    ├── Cantiques           (cf. PRD-CANTIQUES.md)
    ├── Annonces            ← ★ CETTE PRD
    └── Témoignages
```

Conteneur d'affichage :

```html
<div class="ctx-view" data-ctx-view="annonces">
  ...contenu de la sous-page...
</div>
```

---

## 1. Intention de la page

C'est **un bulletin paroissial**, pas un catalogue d'événements (pas Eventbrite, pas Meetup).

| À faire | À NE PAS faire |
|---|---|
| Présenter les annonces avec **3 états temporels** : à venir / aujourd'hui / passées — visibles ensemble | Cacher les passées, séparer en onglets « passés/futurs » |
| Une seule **annonce phare** (carte large image+texte) au sommet, pour l'événement de la saison | Plusieurs cartes héro, carrousel auto |
| Chronologie verticale **groupée par mois** | Calendrier visuel type Google Calendar |
| Les **annonces passées s'estompent** (`opacity: .55`) sans disparaître — mémoire de la vie de l'assemblée | Les supprimer ou les archiver hors-vue |
| Aujourd'hui = mise en évidence forte (filet bleu, fond teinté, point pulsant) | Notifications push, badges « LIVE NOW » agressifs |
| Métadonnées sobres : type · sous-type, date numérique grande, courte description | Boutons « Acheter », compteurs participants, géolocalisation |

Utilisateur cible : un membre qui veut savoir **ce qui vient cette saison** et **vérifier ce qui s'est passé** (mission, sortie, concert).

---

## 2. Structure de la page (de haut en bas)

```
┌─────────────────────────────────────────────────────────────┐
│ HERO (ann-hero)                                             │
│   eyebrow · h1 (titre 2 lignes) · lede                      │
├─────────────────────────────────────────────────────────────┤
│ FILTERS (ann-filters)                                       │
│   chips "État" : Toutes · À venir · Aujourd'hui · Passées   │
│   chips "Type" : Réunion · Voyage · Sortie · Exceptionnelle │
├─────────────────────────────────────────────────────────────┤
│ FEATURED (ann-featured)                                     │
│   ┌──────────────────────┬──────────────────────────────┐   │
│   │ [image plein bleed]  │ eyebrow · h2 · description   │   │
│   │ flag-soon overlay    │ meta-grid : Quand · Où · Type│   │
│   │                      │ "En savoir plus →"            │   │
│   └──────────────────────┴──────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│ CHRONOLOGY (ann-chrono) — par mois                          │
│   ─────────────────────────                                 │
│   Mai 2026                              3 annonces          │
│   ──┬──────┬──────────────────────┬────────                 │
│   10 │ SAM. │ Réunion · Jeunesse   │ À venir (rouge)         │
│      │ MAI  │ H3 + description     │                        │
│   ──┼──────┼──────────────────────┼────────                 │
│   17 │ SAM. │ Sortie · Famille     │ À venir                 │
│   ...                                                       │
│                                                             │
│   Avril 2026                            4 annonces          │
│   ──┬──────┬──────────────────────┬────────                 │
│   30 │ JEU. │ Réunion · Prière     │ ● Aujourd'hui (bleu)    │
│   ──┼──────┼──────────────────────┼────────                 │
│   26 │ DIM. │ Réunion · Culte      │ Passée (gris)           │
│      │ AVR  │ (carte estompée .55) │                        │
│   ...                                                       │
└─────────────────────────────────────────────────────────────┘
```

**Container max-width** : `1280px`, marges latérales `32px` (mobile : `22px`).

---

## 3. Tokens de design (rappel + sémantique spécifique)

```css
--paper      : #FAF7F0
--paper-2    : #F4F1EA   /* fond derrière l'image phare avant chargement */
--ink        : #0C0E14
--ink-2      : #2A2D38
--ink-3      : #6B6E7A
--accent     : #A62020   /* ROUGE — flag "À VENIR", tag "À venir" sur cartes */
--note       : #15364B   /* BLEU — flag "AUJOURD'HUI", filet gauche carte du jour, point pulsant, fond rouge léger des cartes today */

--f-serif    : 'Cormorant Garamond', serif    /* h1, h2, h3, label de mois italique, m-val italique */
--f-num      : 'Bodoni Moda', serif           /* gros nombre du jour (48px) */
--f-body     : 'Inter', system-ui, sans-serif /* eyebrow, méta, chips, type, état */
```

**Sémantique des 3 états temporels** (CRITIQUE) :

| État | Class | Fond carte | Filet/marqueur | Tag droite | Date (dn) |
|---|---|---|---|---|---|
| À venir | `.state-soon` | aucun | aucun | `.state-soon-tag` ROUGE 600 | `--ink` |
| Aujourd'hui | `.state-today` | `rgba(166,32,32,.04)` (fond rouge très léger) + filet gauche `--note` (bleu) 2px | margin négatif L/R 16px + padding L/R 20px | `.state-today-tag` BLEU 600 + ● pulsant bleu 7px | `--note` (bleu) |
| Passée | `.state-past` | aucun | aucun mais `opacity: 0.55` sur toute la carte | `.state-past-tag` GRIS `--ink-3` | hérité (estompé) |

Sur la **featured card**, les `status-flag` ont des couleurs de fond pleines :
- `.flag-soon` → fond `--accent` (rouge)
- `.flag-today` → fond `--note` (bleu)
- `.flag-past` → fond `--ink-3` (gris)

---

## 4. Section par section — spécifications

### 4.1 Hero (`<section class="ann-hero">`)

Mêmes règles partagées que `cultes-hero` / `cant-hero` (cf. PRD précédentes) :
`max-width: 1280px, padding: 60px 32px 40px, border-bottom: 1.5px solid --ink`. Inner `max-width: 760px`.

Composition :
1. **Eyebrow** — « Bulletin de l'Église » (`--f-body`, 11px, .22em, uppercase, `--ink-3`)
2. **H1** — « Ce qui vient, [BR] *ce qui se prépare.* » (italique gris-encre 2 sur la 2e ligne) — `--f-serif`, 500, `clamp(40px, 5.4vw, 64px)`, line-height 1.04
3. **Lede** — « Réunions, voyages, sorties, occasions exceptionnelles. Le bulletin recense toutes les annonces — passées, du jour, à venir. » (`--f-serif`, 19px, line-height 1.55, `--ink-2`, max-width 620px)

---

### 4.2 Filtres (`<section class="ann-filters">`)

**Mêmes règles** que `.cultes-filters` (chips identiques, mêmes styles `.chip` / `.chip.active` / `.chip.muted`).
`padding: 22px 32px, border-bottom: 1px solid rgba(12,14,20,.15)`.

**2 groupes** :

#### Groupe 1 — « État »
- « Toutes » (`.active` par défaut, fond noir)
- « À venir »
- « Aujourd'hui »
- « Passées » (`.muted`, dashed)

#### Groupe 2 — « Type »
- « Réunion »
- « Voyage »
- « Sortie »
- « Exceptionnelle »

(Pas de barre de recherche sur ce filtre — différence avec Cultes/Cantiques.)

---

### 4.3 Annonce phare (`<section class="ann-featured">`)

**Padding** : `48px 32px 28px`. Container `max-width: 1280px`.

**Carte** (`<article class="featured-card">`) :
- Grid : `1.05fr 1fr` (image légèrement plus large que texte)
- `border: 1.5px solid --ink, background: --paper`
- Pas de gap (les deux moitiés se touchent)

#### Côté gauche — image (`<div class="featured-img">`)

`position: relative, background: --paper-2, min-height: 380px, overflow: hidden`.

- `<img>` plein bleed : `position: absolute, inset: 0, width: 100%, height: 100%, object-fit: cover, filter: grayscale(.15)`
- **Status flag** en surimpression (top-left) : `<span class="status-flag flag-soon">À VENIR</span>`
  `position: absolute, top: 16px, left: 16px, font-family: --f-body, font-size: 10.5px, letter-spacing: .26em, uppercase, color: #fff, padding: 6px 14px, font-weight: 600`
  - `.flag-soon` → `background: --accent` (ROUGE)
  - `.flag-today` → `background: --note` (BLEU)
  - `.flag-past` → `background: --ink-3` (GRIS)
  - Sans suffixe → `background: --ink` (noir, par défaut)

#### Côté droit — corps (`<div class="featured-body">`)

`padding: 40px 36px 36px, display: flex, flex-direction: column`.

1. **Eyebrow** (`<div class="featured-eyebrow">`) — « Annonce phare · Été 2026 » (11px, .26em, uppercase, `--ink-3`, `margin-bottom: 12px`)
2. **H2** — « Voyage missionnaire [BR] *à Marseille.* »
   `--f-serif, 500, clamp(30px, 3.4vw, 40px), line-height 1.05, margin: 0 0 14px, color --ink` ; `em` italique `--ink-2`.
3. **Paragraphe** — `<p>` description longue (`--f-body, 15px, line-height 1.6, color --ink-2, margin: 0 0 24px, max-width: 50ch`)
   Texte exact : « Une semaine de prédication, de baptêmes et de visites de frères dans le sud. Cette mission s'inscrit dans le prolongement de l'œuvre de fondation — comme en 2003, comme en 2010. Inscriptions ouvertes au secrétariat jusqu'au 15 juin 2026. »
4. **Meta-grid** (`<div class="featured-meta">`) — 3 colonnes égales, encadré par 2 filets gris :
   `grid-template-columns: repeat(3, 1fr), gap: 18px, padding: 18px 0, border-top: 1px solid rgba(12,14,20,.15), border-bottom: 1px solid rgba(12,14,20,.15), margin-bottom: 22px`
   Chaque colonne `<div>` flex column gap 2px contient :
   - `<span class="m-lbl">` — libellé uppercase (`--f-body, 10.5px, .22em, --ink-3`)
   - `<span class="m-val">` — valeur en serif italique (`--f-serif italic, 15px, --ink`)

   3 colonnes de la wireframe :
   | Quand | Où | Type |
   |---|---|---|
   | Du 12 au 18 juillet 2026 | Marseille · 13ᵉ et 14ᵉ | Voyage missionnaire |

5. **Lien d'action** (`<a class="more-line">En savoir plus →</a>`)
   `align-self: flex-start, --f-body, 12px, .14em, uppercase, color --ink, border-bottom: 1px solid --ink, padding-bottom: 2px, no underline`

---

### 4.4 Chronologie (`<section class="ann-chrono">`)

**Padding** : `28px 32px 60px`. Container `max-width: 1280px`.

Composée de **groupes mensuels** (`<div class="chrono-month">`), chacun avec :

#### En-tête de mois (`<div class="month-head">`)
`display: flex, justify-content: space-between, align-items: baseline, border-bottom: 1.5px solid --ink, padding-bottom: 10px, margin-bottom: 8px`

- À gauche : `<span class="month-lbl">Mai 2026</span>`
  **Différence importante** : sur Annonces, le label de mois est en **serif italique 24px noir** (pas en uppercase Inter comme ailleurs)
  `--f-serif, font-style: italic, font-size: 24px, color --ink, border 0, padding 0, text-transform: none, letter-spacing 0`
- À droite : `<span class="month-count">3 annonces</span>`
  `--f-body, 11px, .22em, uppercase, --ink-3`

#### Liste de cartes (`<div class="chrono-list">`)

Chaque annonce = `<article class="ann-card">` + un modificateur d'état (`.state-soon`, `.state-today`, ou `.state-past`).

Grid de la carte : `110px 1fr 130px, gap: 28px, padding: 24px 4px, border-bottom: 1px solid rgba(12,14,20,.12), align-items: start`.
`:hover` → `background: rgba(12,14,20,.02)`

**3 cellules** :

##### a. Date (`<div class="ann-date">`)
Flex column, `padding-top: 4px`.

- `<span class="dn">10</span>` — gros chiffre du jour
  `--f-num (Bodoni), font-size: 48px, line-height 1, color --ink, font-weight 500, letter-spacing -0.01em`
- `<span class="dl">SAM. MAI</span>` — abréviation jour + mois
  `--f-body, 11px, .22em, uppercase, --ink-3, margin-top: 4px`

**Variations selon l'état** :
- `.state-soon .ann-date .dn` → `color: --ink`
- `.state-today .ann-date .dn` → `color: --note` (BLEU)
- `.state-past` → la date hérite de `opacity: 0.55` de la carte parente

##### b. Corps (`<div class="ann-body">`)
`padding-top: 6px`.

- `<span class="ann-type">` — catégorie · sous-catégorie
  `--f-body, 11px, .22em, uppercase, --ink-3, display: block, margin-bottom: 6px`
- `<h3>` — titre de l'annonce
  `--f-serif, 500, 22px, line-height 1.25, --ink, margin: 0 0 8px`
- `<p>` — description courte (1–2 lignes)
  `--f-body, 14px, line-height 1.55, --ink-2, margin 0, max-width 60ch`

##### c. Tag d'état (`<div class="ann-state">`)
`text-align: right, --f-body, 10.5px, .22em, uppercase, padding-top: 10px`.

3 variantes :
- `.state-soon-tag` → texte « À venir », `color: --accent (ROUGE), font-weight: 600`
- `.state-today-tag` → texte « Aujourd'hui », `color: --note (BLEU), font-weight: 600` + **pseudo-élément `::before`** = point pulsant 7×7 rond `--note` avec `animation: ctxLivePulse 1.6s ease-out infinite`. Le tag est en `display: inline-flex, align-items: center, gap: 6px, justify-content: flex-end, width: 100%`
- `.state-past-tag` → texte « Passée », `color: --ink-3` (gris, normal)

##### Modifieurs sur la carte parente
- `.ann-card.state-past` → `opacity: 0.55` (toute la carte estompe)
- `.ann-card.state-today` → met en évidence avec :
  - `background: rgba(166,32,32,.04)` (fond rouge très léger — note la valeur `166,32,32` qui correspond à `--accent` en rgba)
  - `margin-left: -16px, margin-right: -16px`
  - `padding-left: 20px, padding-right: 20px`
  - `border-left: 2px solid --note` (BLEU)
  - `border-bottom-color: rgba(12,14,20,.12)` (préserve le filet bas standard)

#### Animation du point pulsant
À déclarer une fois (peut être déjà présente dans la page parente) :

```css
@keyframes ctxLivePulse {
  0%   { box-shadow: 0 0 0 0 rgba(21,54,75,.6); }
  70%  { box-shadow: 0 0 0 8px rgba(21,54,75,0); }
  100% { box-shadow: 0 0 0 0 rgba(21,54,75,0); }
}
```

#### Annotation pied de page
Ligne sobre sous la chronologie :
```html
<span class="annot t-sm annot-blue" style="display: block; max-width: 1100px; margin: 0 auto 60px; padding: 0 32px; color: var(--ink-3);">
  3 états temporels · même grammaire éditoriale · les passées s'estompent sans disparaître
</span>
```
(Cette annotation est utilisée comme rappel de design — peut être retirée en hi-fi.)

---

### 4.5 Données wireframe — à reprendre tel quel

#### Annonce phare
| Champ | Valeur |
|---|---|
| flag | `flag-soon` (À VENIR) |
| eyebrow | Annonce phare · Été 2026 |
| titre | Voyage missionnaire / *à Marseille.* |
| description | Une semaine de prédication, de baptêmes et de visites de frères dans le sud. Cette mission s'inscrit dans le prolongement de l'œuvre de fondation — comme en 2003, comme en 2010. Inscriptions ouvertes au secrétariat jusqu'au 15 juin 2026. |
| Quand | Du 12 au 18 juillet 2026 |
| Où | Marseille · 13ᵉ et 14ᵉ |
| Type | Voyage missionnaire |
| image | `assets/sanctuary.jpeg` (placeholder à remplacer) |

#### Mai 2026 (3 annonces — toutes `.state-soon`)
| dn | dl | type | titre | description |
|---|---|---|---|---|
| 10 | SAM. MAI | Réunion · Jeunesse | Réunion de jeunes | Soirée d'enseignement et de partage à la salle Bacchus, ouverte aux jeunes adultes de l'assemblée et invités. |
| 17 | SAM. MAI | Sortie · Famille | Sortie famille · forêt de Sénart | Journée détente et fraternité ouverte à tous. Pique-nique partagé, jeux et temps de prière en plein air. |
| 24 | DIM. MAI | Réunion · Exceptionnelle | Concert · Les Aiglons | Concert de cantiques par le groupe Les Aiglons, suivi d'une partie de partage sur la Parole. Ouvert à l'assemblée et aux invités. |

#### Avril 2026 (4 annonces — 1 today + 3 past)
| dn | dl | état | type | titre | description |
|---|---|---|---|---|---|
| 30 | JEU. AVR | `today` | Réunion · Prière | Veillée de prière | Veillée mensuelle à la salle Bacchus. Temps de prière prolongé dès 19H — les frères et sœurs sont attendus. |
| 26 | DIM. AVR | `past` | Réunion · Culte | Culte du dimanche · L'Ordre de l'Église #14 | Prédication sur Matthieu 7 — « Le Roc qui ne tombe pas ». Disponible dans la bibliothèque des cultes. |
| 19 | DIM. AVR | `past` | Voyage · Mission | Mission · Lille | Visite de l'assemblée sœur de Lille. Semaine de prédication et baptêmes. Compte rendu publié. |
| 12 | DIM. AVR | `past` | Réunion · Culte | Service de témoignages | Service exceptionnel — récits de la fidélité de Dieu cette saison. Six témoignages partagés. |

---

## 5. Comportements (JavaScript)

### 5.1 Filtres État + Type
Click sur `.chip` :
- Toggle visuel : retire `.active` des frères, applique sur le chip cliqué
- Filtrage des `.ann-card` selon l'état (`.state-soon` / `.state-today` / `.state-past`) ou le type (extrait depuis le `.ann-type` ou un `data-type`).
- Les groupes État et Type se combinent (logique ET).

### 5.2 Click sur une carte d'annonce
Optionnel : route vers une page détail (`/annonces/<slug>`) ou panneau modal avec image complète, métadonnées étendues, lien d'inscription, etc. Hors scope du wireframe.

### 5.3 Calcul automatique des états
Côté backend : à partir de la date de l'annonce vs `Date.now()` :
- date >= aujourd'hui+1 → `state-soon`
- date == aujourd'hui (même jour) → `state-today`
- date < aujourd'hui → `state-past`

L'animation pulsante du point bleu doit être active uniquement sur les cartes `.state-today`.

### 5.4 Featured card
La sélection de la featured card est manuelle (saisie au secrétariat = champ `isFeatured: true` sur une seule annonce active). Le `status-flag` correspond à l'état temporel calculé.

---

## 6. Schéma de données suggéré

```ts
type Announcement = {
  id: string;                               // 'ann-2026-07-12-marseille'
  date: string;                             // '2026-07-12' ISO (date de début)
  endDate?: string;                         // pour événements multi-jours
  weekday: 'Lun.' | 'Mar.' | 'Mer.' | 'Jeu.' | 'Ven.' | 'Sam.' | 'Dim.';
  monthAbbr: 'JAN' | 'FÉV' | 'MAR' | 'AVR' | 'MAI' | 'JUI' | ...;
  type: 'Réunion' | 'Voyage' | 'Sortie' | 'Exceptionnelle';
  subType?: string;                         // 'Jeunesse', 'Famille', 'Mission', 'Culte', 'Prière'…
  title: string;
  titleEm?: string;                         // 2e moitié italique pour featured uniquement
  description: string;                      // 1–3 phrases
  longDescription?: string;                 // pour la page détail
  image?: string;                           // requis pour featured
  isFeatured?: boolean;                     // une seule active à la fois
  featuredEyebrow?: string;                 // 'Annonce phare · Été 2026'
  // calculés côté front :
  state: 'soon' | 'today' | 'past';
  // featured-meta
  meta?: Array<{ lbl: string; val: string }>;  // [{lbl:'Quand', val:'Du 12 au 18 juillet 2026'}, ...]
  ctaLabel?: string;                        // 'En savoir plus'
  ctaUrl?: string;
};

type AnnouncementMonth = {
  label: string;                            // 'Mai 2026'
  count: number;                            // 3
  items: Announcement[];                    // triés par date asc dans le mois
};
```

Les groupes mensuels sont triés **mois en cours en premier puis mois antérieurs descendants** (Mai 2026 avant Avril 2026 dans le wireframe parce que l'utilisateur regarde « ce qui vient » avant « ce qui s'est passé »).

---

## 7. HTML de référence — à recopier _verbatim_

```html
<div class="ctx-view" data-ctx-view="annonces">

  <!-- 4.1 HERO -->
  <section class="ann-hero anchored">
    <div class="ann-hero-inner">
      <div class="eyebrow">Bulletin de l'Église</div>
      <h1>Ce qui vient,<br/><em>ce qui se prépare.</em></h1>
      <p class="lede">Réunions, voyages, sorties, occasions exceptionnelles. Le bulletin recense toutes les annonces — passées, du jour, à venir.</p>
    </div>
  </section>

  <!-- 4.2 FILTERS -->
  <section class="ann-filters anchored">
    <div class="filters-inner">
      <div class="filter-group">
        <span class="lbl">État</span>
        <a href="#" class="chip active">Toutes</a>
        <a href="#" class="chip">À venir</a>
        <a href="#" class="chip">Aujourd'hui</a>
        <a href="#" class="chip muted">Passées</a>
      </div>
      <div class="filter-group">
        <span class="lbl">Type</span>
        <a href="#" class="chip">Réunion</a>
        <a href="#" class="chip">Voyage</a>
        <a href="#" class="chip">Sortie</a>
        <a href="#" class="chip">Exceptionnelle</a>
      </div>
    </div>
  </section>

  <!-- 4.3 FEATURED -->
  <section class="ann-featured anchored">
    <article class="featured-card">
      <div class="featured-img">
        <img src="assets/sanctuary.jpeg" alt="" />
        <span class="status-flag flag-soon">À VENIR</span>
      </div>
      <div class="featured-body">
        <div class="featured-eyebrow">Annonce phare · Été 2026</div>
        <h2>Voyage missionnaire<br/><em>à Marseille.</em></h2>
        <p>Une semaine de prédication, de baptêmes et de visites de frères dans le sud. Cette mission s'inscrit dans le prolongement de l'œuvre de fondation — comme en 2003, comme en 2010. Inscriptions ouvertes au secrétariat jusqu'au 15 juin 2026.</p>
        <div class="featured-meta">
          <div><span class="m-lbl">Quand</span><span class="m-val">Du 12 au 18 juillet 2026</span></div>
          <div><span class="m-lbl">Où</span><span class="m-val">Marseille · 13ᵉ et 14ᵉ</span></div>
          <div><span class="m-lbl">Type</span><span class="m-val">Voyage missionnaire</span></div>
        </div>
        <a href="#" class="more-line">En savoir plus →</a>
      </div>
    </article>
  </section>

  <!-- 4.4 CHRONOLOGY -->
  <section class="ann-chrono anchored">

    <!-- Mai 2026 -->
    <div class="chrono-month">
      <div class="month-head">
        <span class="month-lbl">Mai 2026</span>
        <span class="month-count">3 annonces</span>
      </div>
      <div class="chrono-list">

        <article class="ann-card state-soon">
          <div class="ann-date">
            <span class="dn">10</span>
            <span class="dl">SAM. MAI</span>
          </div>
          <div class="ann-body">
            <span class="ann-type">Réunion · Jeunesse</span>
            <h3>Réunion de jeunes</h3>
            <p>Soirée d'enseignement et de partage à la salle Bacchus, ouverte aux jeunes adultes de l'assemblée et invités.</p>
          </div>
          <div class="ann-state state-soon-tag">À venir</div>
        </article>

        <article class="ann-card state-soon">
          <div class="ann-date">
            <span class="dn">17</span>
            <span class="dl">SAM. MAI</span>
          </div>
          <div class="ann-body">
            <span class="ann-type">Sortie · Famille</span>
            <h3>Sortie famille · forêt de Sénart</h3>
            <p>Journée détente et fraternité ouverte à tous. Pique-nique partagé, jeux et temps de prière en plein air.</p>
          </div>
          <div class="ann-state state-soon-tag">À venir</div>
        </article>

        <article class="ann-card state-soon">
          <div class="ann-date">
            <span class="dn">24</span>
            <span class="dl">DIM. MAI</span>
          </div>
          <div class="ann-body">
            <span class="ann-type">Réunion · Exceptionnelle</span>
            <h3>Concert · Les Aiglons</h3>
            <p>Concert de cantiques par le groupe Les Aiglons, suivi d'une partie de partage sur la Parole. Ouvert à l'assemblée et aux invités.</p>
          </div>
          <div class="ann-state state-soon-tag">À venir</div>
        </article>

      </div>
    </div>

    <!-- Avril 2026 -->
    <div class="chrono-month">
      <div class="month-head">
        <span class="month-lbl">Avril 2026</span>
        <span class="month-count">4 annonces</span>
      </div>
      <div class="chrono-list">

        <article class="ann-card state-today">
          <div class="ann-date">
            <span class="dn">30</span>
            <span class="dl">JEU. AVR</span>
          </div>
          <div class="ann-body">
            <span class="ann-type">Réunion · Prière</span>
            <h3>Veillée de prière</h3>
            <p>Veillée mensuelle à la salle Bacchus. Temps de prière prolongé dès 19H — les frères et sœurs sont attendus.</p>
          </div>
          <div class="ann-state state-today-tag">Aujourd'hui</div>
        </article>

        <article class="ann-card state-past">
          <div class="ann-date">
            <span class="dn">26</span>
            <span class="dl">DIM. AVR</span>
          </div>
          <div class="ann-body">
            <span class="ann-type">Réunion · Culte</span>
            <h3>Culte du dimanche · L'Ordre de l'Église #14</h3>
            <p>Prédication sur Matthieu 7 — « Le Roc qui ne tombe pas ». Disponible dans la bibliothèque des cultes.</p>
          </div>
          <div class="ann-state state-past-tag">Passée</div>
        </article>

        <article class="ann-card state-past">
          <div class="ann-date">
            <span class="dn">19</span>
            <span class="dl">DIM. AVR</span>
          </div>
          <div class="ann-body">
            <span class="ann-type">Voyage · Mission</span>
            <h3>Mission · Lille</h3>
            <p>Visite de l'assemblée sœur de Lille. Semaine de prédication et baptêmes. Compte rendu publié.</p>
          </div>
          <div class="ann-state state-past-tag">Passée</div>
        </article>

        <article class="ann-card state-past">
          <div class="ann-date">
            <span class="dn">12</span>
            <span class="dl">DIM. AVR</span>
          </div>
          <div class="ann-body">
            <span class="ann-type">Réunion · Culte</span>
            <h3>Service de témoignages</h3>
            <p>Service exceptionnel — récits de la fidélité de Dieu cette saison. Six témoignages partagés.</p>
          </div>
          <div class="ann-state state-past-tag">Passée</div>
        </article>

      </div>
    </div>

  </section>

</div>
```

---

## 8. CSS de référence — à recopier _verbatim_

> Sélecteurs scopés sous `#page-eglise`. Si tu reproduis dans un composant isolé, retire le préfixe.
> La barre de filtres `.ann-filters` partage TOUS ses styles avec `.cultes-filters` (cf. PRD-CULTES.md §8). La règle CSS partagée :
> ```css
> .cultes-filters, .ann-filters { ... }
> .cultes-filters .filters-inner, .ann-filters .filters-inner { ... }
> ```
> Reprendre les styles `.chip`, `.chip.active`, `.chip.muted`, `.filter-group`, `.filter-group .lbl` du PRD-CULTES.md.

```css
/* ====== HERO partagé (mêmes règles que cultes-hero / cant-hero) ===== */
.ann-hero {
  max-width: 1280px; margin: 0 auto;
  padding: 60px 32px 40px;
  border-bottom: 1.5px solid var(--ink);
  position: relative;
}
.ann-hero-inner { max-width: 760px; }
.ann-hero h1 {
  font-family: var(--f-serif); font-weight: 500;
  font-size: clamp(40px, 5.4vw, 64px);
  line-height: 1.04; letter-spacing: -0.01em;
  margin: 14px 0 18px;
  color: var(--ink);
  text-wrap: pretty;
}
.ann-hero h1 em { font-style: italic; color: var(--ink-2); }
.ann-hero .lede {
  font-family: var(--f-serif);
  font-size: 19px; line-height: 1.55;
  color: var(--ink-2);
  max-width: 620px;
  margin: 0;
}

/* ====== 04c ANNONCES ======================================== */

/* Featured */
.ann-featured {
  max-width: 1280px; margin: 0 auto;
  padding: 48px 32px 28px;
}
.featured-card {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 0;
  border: 1.5px solid var(--ink);
  background: var(--paper);
}
.featured-img {
  position: relative;
  background: var(--paper-2);
  min-height: 380px;
  overflow: hidden;
}
.featured-img img {
  position: absolute; inset: 0;
  width: 100%; height: 100%; object-fit: cover;
  filter: grayscale(.15);
}
.status-flag {
  position: absolute; top: 16px; left: 16px;
  z-index: 2;
  font-family: var(--f-body); font-size: 10.5px;
  letter-spacing: .26em; text-transform: uppercase;
  color: #fff;
  padding: 6px 14px;
  background: var(--ink);
  font-weight: 600;
}
.status-flag.flag-soon  { background: var(--accent); }
.status-flag.flag-today { background: var(--note); }
.status-flag.flag-past  { background: var(--ink-3); }

.featured-body {
  padding: 40px 36px 36px;
  display: flex; flex-direction: column;
}
.featured-eyebrow {
  font-family: var(--f-body); font-size: 11px;
  letter-spacing: .26em; text-transform: uppercase;
  color: var(--ink-3);
  margin-bottom: 12px;
}
.featured-body h2 {
  font-family: var(--f-serif); font-weight: 500;
  font-size: clamp(30px, 3.4vw, 40px);
  line-height: 1.05;
  margin: 0 0 14px;
  color: var(--ink);
}
.featured-body h2 em { font-style: italic; color: var(--ink-2); }
.featured-body p {
  font-family: var(--f-body); font-size: 15px; line-height: 1.6;
  color: var(--ink-2);
  margin: 0 0 24px;
  max-width: 50ch;
}
.featured-meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  padding: 18px 0;
  border-top: 1px solid rgba(12,14,20,.15);
  border-bottom: 1px solid rgba(12,14,20,.15);
  margin-bottom: 22px;
}
.featured-meta > div {
  display: flex; flex-direction: column; gap: 2px;
}
.featured-meta .m-lbl {
  font-family: var(--f-body); font-size: 10.5px;
  letter-spacing: .22em; text-transform: uppercase;
  color: var(--ink-3);
}
.featured-meta .m-val {
  font-family: var(--f-serif); font-style: italic;
  font-size: 15px; color: var(--ink);
}
.more-line {
  align-self: flex-start;
  font-family: var(--f-body); font-size: 12px;
  letter-spacing: .14em; text-transform: uppercase;
  color: var(--ink); text-decoration: none;
  border-bottom: 1px solid var(--ink);
  padding-bottom: 2px;
}

/* Chronology */
.ann-chrono {
  max-width: 1280px; margin: 0 auto;
  padding: 28px 32px 60px;
}
.chrono-month { margin-bottom: 48px; }
.chrono-month:last-child { margin-bottom: 0; }
.month-head {
  display: flex; justify-content: space-between; align-items: baseline;
  border-bottom: 1.5px solid var(--ink);
  padding-bottom: 10px;
  margin-bottom: 8px;
}
.month-head .month-lbl {
  font-family: var(--f-serif); font-style: italic;
  font-size: 24px; color: var(--ink);
  border: 0; padding: 0; text-transform: none; letter-spacing: 0;
}
.month-head .month-count {
  font-family: var(--f-body); font-size: 11px;
  letter-spacing: .22em; text-transform: uppercase;
  color: var(--ink-3);
}

.ann-card {
  display: grid;
  grid-template-columns: 110px 1fr 130px;
  gap: 28px;
  padding: 24px 4px;
  border-bottom: 1px solid rgba(12,14,20,.12);
  align-items: start;
  transition: background .15s;
}
.ann-card:hover { background: rgba(12,14,20,.02); }
.ann-card.state-past { opacity: 0.55; }
.ann-card.state-today {
  background: rgba(166,32,32,.04);
  margin-left: -16px; margin-right: -16px;
  padding-left: 20px; padding-right: 20px;
  border-left: 2px solid var(--note);
  border-bottom-color: rgba(12,14,20,.12);
}

.ann-date {
  display: flex; flex-direction: column; align-items: flex-start;
  padding-top: 4px;
}
.ann-date .dn {
  font-family: var(--f-num);
  font-size: 48px; line-height: 1;
  color: var(--ink);
  font-weight: 500;
  letter-spacing: -0.01em;
}
.ann-date .dl {
  font-family: var(--f-body); font-size: 11px;
  letter-spacing: .22em; text-transform: uppercase;
  color: var(--ink-3);
  margin-top: 4px;
}
.ann-card.state-soon  .ann-date .dn { color: var(--ink); }
.ann-card.state-today .ann-date .dn { color: var(--note); }

.ann-body { padding-top: 6px; }
.ann-type {
  font-family: var(--f-body); font-size: 11px;
  letter-spacing: .22em; text-transform: uppercase;
  color: var(--ink-3);
  display: block; margin-bottom: 6px;
}
.ann-body h3 {
  font-family: var(--f-serif); font-weight: 500;
  font-size: 22px; line-height: 1.25;
  color: var(--ink); margin: 0 0 8px;
}
.ann-body p {
  font-family: var(--f-body); font-size: 14px; line-height: 1.55;
  color: var(--ink-2); margin: 0;
  max-width: 60ch;
}

.ann-state {
  text-align: right;
  font-family: var(--f-body); font-size: 10.5px;
  letter-spacing: .22em; text-transform: uppercase;
  padding-top: 10px;
}
.state-soon-tag  { color: var(--accent); font-weight: 600; }
.state-today-tag {
  color: var(--note); font-weight: 600;
  display: inline-flex; align-items: center; gap: 6px;
  justify-content: flex-end;
  width: 100%;
}
.state-today-tag::before {
  content: ""; width: 7px; height: 7px; border-radius: 50%;
  background: var(--note);
  animation: ctxLivePulse 1.6s ease-out infinite;
}
.state-past-tag { color: var(--ink-3); }

@keyframes ctxLivePulse {
  0%   { box-shadow: 0 0 0 0 rgba(21,54,75,.6); }
  70%  { box-shadow: 0 0 0 8px rgba(21,54,75,0); }
  100% { box-shadow: 0 0 0 0 rgba(21,54,75,0); }
}
```

### Mobile (≤ 820px)

```css
@media (max-width: 820px) {
  .ann-hero { padding: 40px 22px 28px; }
  .ann-filters { padding: 18px 22px; }
  .filter-group { flex-wrap: wrap; }

  /* Featured : empile image au-dessus du corps */
  .ann-featured { padding: 32px 22px 22px; }
  .featured-card {
    grid-template-columns: 1fr;
  }
  .featured-img { min-height: 240px; }
  .featured-body { padding: 28px 22px 26px; }
  .featured-meta {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  /* Chronology : carte en 2 lignes (date+état au-dessus du corps) */
  .ann-chrono { padding: 22px 22px 50px; }
  .ann-card {
    grid-template-columns: 80px 1fr;
    gap: 18px;
  }
  .ann-date .dn { font-size: 38px; }
  .ann-state {
    grid-column: 1 / -1;
    text-align: left;
    padding-top: 6px;
  }
  .ann-card.state-today {
    margin-left: -14px; margin-right: -14px;
    padding-left: 14px; padding-right: 14px;
  }
}
```

---

## 9. Hi-fi : ce qui change par rapport au wireframe

| Élément | Wireframe | Hi-fi cible |
|---|---|---|
| `.featured-img img` | `assets/sanctuary.jpeg` (placeholder) | Vraie photo de l'événement annoncé (ex. carte postale Marseille, photo précédente mission) |
| Filtres État + Type | Visuels seulement | Branchés (filtrage côté client ou via query params) |
| État temporel d'une carte | Hardcodé (`state-soon` / `state-today` / `state-past`) | Calculé à partir de la date courante côté serveur ou client |
| Featured | Une seule carte hardcodée | Saisie au secrétariat avec champ `isFeatured: true` ; rotation manuelle saisonnière |
| Chronologie | 2 mois × N annonces hardcodés | Listée depuis la base de données, paginée (par ex. 6 mois affichés + bouton « Voir plus »). Tri : mois courant + futurs en haut, mois passés en bas |
| Click sur une carte | Aucun | Soit ouvre un panneau détail, soit redirige vers `/annonces/<slug>` avec image plein bleed + texte long + lien d'inscription |
| `.state-today` | Un seul exemple | Plusieurs annonces peuvent être `state-today` simultanément (toute annonce dont la date est aujourd'hui) |

**À NE PAS faire en hi-fi** :
- Calendrier visuel (vue mensuelle/hebdomadaire) — la chronologie verticale est la seule vue
- Boutons « Acheter », tarification, RSVP avec compteur
- Images sur les cartes de la chronologie (seule la featured a une image)
- Cacher les annonces passées ou les déplacer dans un onglet séparé
- Notifications push, bannières « Live now »
- Faire disparaître l'animation pulsante du point bleu — c'est la signature visuelle de l'état « aujourd'hui »
- Changer la sémantique 3 états : ROUGE = futur, BLEU = présent, GRIS estompé = passé

---

## 10. Checklist de validation

- [ ] Hero : eyebrow « Bulletin de l'Église » + titre 2 lignes (italique 2e) + lede
- [ ] Filtres : groupe État (Toutes actif noir, À venir, Aujourd'hui, Passées en dashed) + groupe Type (4 chips) — pas de barre de recherche
- [ ] Featured card : grid `1.05fr 1fr`, bordure noire 1.5px, sans gap, min-height 380px sur l'image
- [ ] Image phare : plein bleed, grayscale .15, flag `À VENIR` rouge en haut-gauche
- [ ] Corps featured : eyebrow uppercase + h2 2 lignes (italique 2e) + paragraphe 50ch + meta-grid 3 colonnes (Quand/Où/Type) avec filets haut et bas + lien `En savoir plus →` souligné
- [ ] Meta values en serif italique 15px, libellés en Inter 10.5px uppercase
- [ ] Chronologie : 2 groupes mensuels (Mai en premier, Avril ensuite)
- [ ] En-tête mois : « Mai 2026 » en serif italique 24px noir + count à droite uppercase, filet noir 1.5px en bas
- [ ] Carte annonce : grid 110px / 1fr / 130px, gap 28px
- [ ] Cellule date : nombre Bodoni 48px, abréviation jour+mois en Inter 11px uppercase, gap 4px
- [ ] Mai 2026 : 3 cartes `.state-soon` — date noire, tag « À venir » rouge 600
- [ ] Avril 30 : carte `.state-today` — fond rouge .04, filet gauche bleu 2px, margin négatif L/R 16px, date BLEUE, tag « Aujourd'hui » BLEU avec point pulsant ●
- [ ] Avril 26, 19, 12 : cartes `.state-past` avec `opacity: 0.55` (toute la carte estompe), tag « Passée » gris
- [ ] Animation `ctxLivePulse` 1.6s active sur le point ::before du tag today
- [ ] Mobile ≤820px : featured passe en 1 colonne (image au-dessus), meta-grid en 1 colonne, cartes annonces grid 80px/1fr avec tag état en pleine largeur sous le corps
- [ ] Aucun footer, aucune nav, aucun élément en dehors du `<div class="ctx-view" data-ctx-view="annonces">`

---

**Fin du PRD Annonces.**
À utiliser conjointement avec le `PRD.md` global, le `PRD-CULTES.md` (réutilise `.chip`, `.filter-group`, `.lbl`) et le `PRD-CANTIQUES.md`.
