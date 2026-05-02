# PRD — Sous-page **Cultes** (04a) · RST Front Pages

> Document de référence à donner à Claude Code en complément du `PRD.md` global.
> **Objectif** : reproduire à l'identique la sous-page « Cultes » (onglet contextuel de la page 04 — L'Église / Actualité). Pas le footer, pas la nav, pas l'en-tête : **uniquement le contenu de la sous-page Cultes** (du hero jusqu'à la fin de la fiche prédication).
> Cette page doit, à pixel près, ressembler à la version wireframe livrée — la mise en hi-fi se limite à : remplacer les placeholders d'images par de vraies photos, ajouter de vraies vidéos lecteur, brancher les filtres et l'archive sur de vraies données. **L'architecture, les espacements, la typographie, les couleurs et la composition ne changent pas.**

---

## 0. Localisation dans l'app

```
Page 04 — L'Église / Actualité
└── ctx-nav (sous-onglets contextuels)
    ├── Cette semaine          ← vue par défaut, à NE PAS toucher
    ├── Cultes                 ← ★ CETTE PRD
    ├── Cantiques
    ├── Annonces
    └── Témoignages
```

La sous-page **Cultes** s'affiche dans le conteneur :

```html
<div class="ctx-view" data-ctx-view="cultes">
  ...contenu de la sous-page...
</div>
```

Toggle d'affichage géré par le JS de la page 04 : un seul `.ctx-view` est `is-active` à la fois.

---

## 1. Intention de la page

C'est **une bibliothèque de prédications**, pas une galerie YouTube.

| À faire | À NE PAS faire |
|---|---|
| Présenter chaque culte comme une **fiche d'étude** complète (vidéo + passages + citations + plan) | Suggérer « vidéos similaires », pousser de l'engagement, recommander algorithmiquement |
| Sobriété éditoriale, lecture posée | Vignettes accrocheuses, miniatures sur-éditées, accroches type « TU NE VAS PAS CROIRE » |
| Métadonnées rigoureuses (référence, série, prédicateur, runtime) | Compteurs de vues, likes, badges trending |
| Outils de téléchargement (audio MP3, vidéo MP4, plan PDF) | Streaming-only, autoplay |
| Chaque sermon = un **objet** dont on peut extraire les passages cités, les citations Branham et le plan | Une simple liste vidéo |

L'utilisateur cible : un membre de l'assemblée qui veut **réétudier** un message déjà prêché — pas un visiteur qui découvre.

---

## 2. Structure de la page (de haut en bas)

```
┌─────────────────────────────────────────────────────────────┐
│ HERO (cultes-hero)                                          │
│   eyebrow · h1 (verset Romains 10.17) · ref · lede ·         │
│   blockquote Branham                                         │
├─────────────────────────────────────────────────────────────┤
│ FILTERS (cultes-filters)                                    │
│   chips "Classer par"  ·  chips "Période"  ·  search        │
├─────────────────────────────────────────────────────────────┤
│ BOARD (cultes-board) — grid 2 colonnes 320px / 1fr · gap 56 │
│  ┌──────────────────┐  ┌──────────────────────────────────┐ │
│  │ ARCHIVE          │  │ ACTIVE SERMON                    │ │
│  │ (archive-col)    │  │ (sermon-col)                     │ │
│  │                  │  │                                  │ │
│  │ Avril 2026       │  │ meta (série · date)              │ │
│  │ • item actif     │  │ titre h2                         │ │
│  │ • item           │  │ prédicateur                      │ │
│  │ • item           │  │ ┌────────────────────────────┐   │ │
│  │ • item           │  │ │ video-poster (16/9)        │   │ │
│  │ • item           │  │ └────────────────────────────┘   │ │
│  │                  │  │ runtime                          │ │
│  │ Mars 2026        │  │                                  │ │
│  │ • item           │  │ tabs internes :                  │ │
│  │ • item           │  │ [Passages] [Branham] [Plan]      │ │
│  │ • item           │  │                                  │ │
│  │                  │  │ panneau actif                    │ │
│  │ [Voir plus ↓]    │  │                                  │ │
│  │                  │  │ ─── sermon-actions ───            │ │
│  │                  │  │ [Audio] [Vidéo] [PDF] [Partager] │ │
│  └──────────────────┘  └──────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Container max-width** : `1280px`, marges latérales `32px` (mobile : `22px`).

---

## 3. Tokens de design (rappel — déjà dans le PRD global)

```css
/* Couleurs (variables existantes) */
--paper      : #FAF7F0   /* fond global */
--paper-2    : #F4F1EA   /* fond sous-bloc, items actifs */
--ink        : #0C0E14   /* texte principal, filets noirs */
--ink-2      : #2A2D38   /* texte secondaire */
--ink-3      : #6B6E7A   /* méta, captions, dates */
--accent     : #A62020   /* ROUGE — séries, plan-num, filets actifs, item actif filet gauche */
--note-blue  : #15364B   /* BLEU — actions secondaires (pas utilisé sur Cultes) */

/* Polices */
--f-serif    : 'Cormorant Garamond', serif    /* titres, citations, paroles */
--f-engrave  : 'Cinzel', 'Trajan Pro', serif  /* hero RST, monumental — pas utilisé sur Cultes */
--f-num      : 'Bodoni Moda', serif           /* dates archive, runtime numérique */
--f-body     : 'Inter', system-ui, sans-serif /* eyebrow, méta, boutons, chips */
```

**Sémantique couleur sur cette page** :
- ROUGE (`--accent`) = série du sermon, plan numéroté romain, filet gauche de l'item d'archive actif, soulignement de l'onglet interne actif, filet gauche des citations Branham
- ENCRE (`--ink`) = filets de séparation principaux, texte de citations bibliques, boutons de téléchargement, item actif (fond `--paper-2`)
- Pas de bleu sur cette page.

---

## 4. Section par section — spécifications

### 4.1 Hero (`<section class="cultes-hero">`)

**Padding** : `60px 32px 40px`. Bordure basse : `1.5px solid var(--ink)`.
**Container interne** : `max-width: 760px` (texte respirant, pas pleine largeur).

**Composition verticale** :
1. **Eyebrow** — « Les prédications de l'assemblée »
   `font-family: --f-body, font-size: 11px, letter-spacing: .22em, text-transform: uppercase, color: --ink-3`
2. **H1** — Verset de Romains 10:17, en deux lignes via `<br/>`. Italique sur la 2e moitié.
   `font-family: --f-serif, font-weight: 500, font-size: clamp(40px, 5.4vw, 64px), line-height: 1.04, letter-spacing: -0.01em, color: --ink`
   Contenu exact : `« La foi vient de ce qu'on entend, [BR] et ce qu'on entend vient de la Parole. »` — la 2e ligne dans `<em>`, italique avec `color: --ink-2`.
3. **Référence** — « Romains 10 . 17 »
   `font-family: --f-body, font-size: 11px, letter-spacing: .26em, text-transform: uppercase, color: --accent (rouge), font-weight: 600`
   Marge : `margin: -8px 0 22px;` (remonte légèrement sous le titre)
4. **Lede** (paragraphe d'intro)
   `font-family: --f-serif, font-size: 19px, line-height: 1.55, color: --ink-2, max-width: 620px`
   Texte exact : « Chaque culte est conservé ici comme un objet d'étude — vidéo, passages bibliques cités, citations du prophète et plan structurel rassemblés dans une seule fiche, pour la lecture, la méditation et le partage. »
5. **Blockquote Branham** — encadré paper-2 avec filet gauche rouge
   `padding: 18px 22px, border-left: 2px solid --accent, background: --paper-2, font-family: --f-serif, font-style: italic, font-size: 16px, line-height: 1.5, max-width: 640px, margin-top: 26px`
   Citation : « La Parole prêchée est la semence ; elle ne tombe pas par terre, elle reste, elle germe à son temps. »
   `<cite>` à l'intérieur : `display: block, margin-top: 10px, font-style: normal, font-family: --f-body, font-size: 10.5px, letter-spacing: .22em, text-transform: uppercase, color: --ink-3`
   Source : « — W. M. Branham · THE SPOKEN WORD IS THE ORIGINAL SEED · 62-0318M »

---

### 4.2 Barre de filtres (`<section class="cultes-filters">`)

**Padding** : `22px 32px`. Bordure basse : `1px solid rgba(12,14,20,.15)`.
**Container interne** : `max-width: 1280px`, flex `align-items: center, gap: 32px, flex-wrap: wrap`.

**3 groupes** dans la barre :

#### Groupe 1 — « Classer par »
- Label `<span class="lbl">Classer par</span>` — `font-size: 11px, letter-spacing: .22em, uppercase, color: --ink-3`
- 3 chips :
  - « Date » (active par défaut)
  - « Série »
  - « Livre biblique »

#### Groupe 2 — « Période »
- Label « Période »
- 4 chips :
  - « 2026 »
  - « 2025 »
  - « 2024 »
  - « Archives ↓ » (classe `.muted` — `border-style: dashed, color: --ink-3`)

#### Groupe 3 — Recherche (à droite via `margin-left: auto`)
- `<div class="filter-search">` flex avec :
  - Icône loupe `⌕` (`<span class="search-icon">`)
  - Input texte avec placeholder « Rechercher · titre, verset, mot-clé »
- Style : ligne sous-soulignée (`border-bottom: 1px solid rgba(12,14,20,.25)`), pas de fond, pas de cadre.

**Style des chips** :
```css
font-family: --f-body, font-size: 12px, letter-spacing: .04em
color: --ink-2
padding: 6px 12px
border: 1px solid rgba(12,14,20,.2)
border-radius: 999px
transition: all .15s

:hover  → border-color: --ink, color: --ink
.active → background: --ink, color: --paper, border-color: --ink
.muted  → color: --ink-3, border-style: dashed
```

**Comportement** : un seul chip actif par groupe. Click → toggle visuel only (filtrage réel = brancher côté backend ensuite).

---

### 4.3 Board 2 colonnes (`<section class="cultes-board">`)

**Padding** : `48px 32px 80px`. **Grid** : `320px 1fr`, `gap: 56px`. Pas de bordure.

#### 4.3.1 Colonne archive (à gauche, `<aside class="archive-col">`)

Liste de cultes **groupés par mois**. Chaque groupe = un `<div class="month-block">` :

```html
<div class="month-block">
  <div class="month-lbl">Avril 2026</div>
  <ul class="archive-list">
    <li class="archive-item is-active">
      <span class="when">Dim. 26 . 04</span>
      <span class="title">Le Roc qui ne tombe pas</span>
      <span class="series">L'Ordre de l'Église #14</span>
    </li>
    ...
  </ul>
</div>
```

**Label de mois** (`.month-lbl`) :
`font-family: --f-body, font-size: 11px, letter-spacing: .26em, uppercase, color: --ink-3, padding-bottom: 10px, margin-bottom: 4px, border-bottom: 1.5px solid --ink`

**Item d'archive** (`.archive-item`) :
- Grid : `84px 1fr` colonnes / 2 lignes auto
- `column-gap: 14px, padding: 14px 4px, border-bottom: 1px solid rgba(12,14,20,.1), cursor: pointer`
- `:hover` → `background: rgba(12,14,20,.03)`
- `.is-active` → `background: --paper-2, border-left: 2px solid --accent (rouge), padding-left: 12px, margin-left: -14px, padding-right: 8px`

**Cellules de l'item** :
- `.when` (date) : grid-row 1/span 2, grid-col 1, `font-family: --f-num (Bodoni), font-size: 12px, color: --ink-3, letter-spacing: .04em`
- `.title` : grid-row 1, grid-col 2, `font-family: --f-serif, font-weight: 500, font-size: 15px, line-height: 1.3, color: --ink`
- `.series` : grid-row 2, grid-col 2, `font-family: --f-body, font-size: 11px, letter-spacing: .12em, uppercase, color: --ink-3, margin-top: 4px`

**Bouton « Voir plus de cultes ↓ »** en bas (`<button class="archive-more">`) :
`margin-top: 12px, background: transparent, border: 0, font-family: --f-body, font-size: 12px, letter-spacing: .14em, uppercase, color: --ink, padding: 8px 0, border-bottom: 1px solid --ink, cursor: pointer`

**Données wireframe — à reprendre tel quel** :

> **Avril 2026**
> - Dim. 26 . 04 · **Le Roc qui ne tombe pas** · L'Ordre de l'Église #14 _(actif)_
> - Mer. 22 . 04 · Le serviteur fidèle · L'Ordre de l'Église #13
> - Dim. 19 . 04 · Une prière qui tient · L'Ordre de l'Église #12
> - Mer. 15 . 04 · L'autel oublié · L'Ordre de l'Église #11
> - Dim. 12 . 04 · Quand le silence parle · Étude libre
>
> **Mars 2026**
> - Dim. 29 . 03 · La maison du potier · L'Ordre de l'Église #10
> - Mer. 25 . 03 · Bâtir sans précipiter · L'Ordre de l'Église #09
> - Dim. 22 . 03 · Le pain quotidien · Étude libre

---

#### 4.3.2 Colonne sermon actif (à droite, `<article class="sermon-col">`)

C'est la fiche du culte sélectionné dans l'archive. Quand l'utilisateur clique un item d'archive, **toute cette colonne se met à jour** (vidéo + titre + onglets + contenu) — l'item d'archive devient `.is-active`.

##### a. Méta du sermon (`<div class="sermon-meta">`)
Flex avec `gap: 16px, flex-wrap: wrap, margin-bottom: 14px` :
- `.series-tag` — « L'Ordre de l'Église · #14 »
  `font-family: --f-body, font-size: 11px, letter-spacing: .26em, uppercase, color: --accent (rouge), font-weight: 600`
- `.when-tag` — « Dimanche 26 avril 2026 · 09H00 »
  `font-family: --f-num (Bodoni), font-size: 12px, color: --ink-3, letter-spacing: .04em`

##### b. Titre du sermon (`<h2 class="sermon-title">`)
Texte : « Le Roc qui [BR] **ne tombe pas.** » — la 2e ligne dans `<em>` (italique, `color: --ink-2`).
`font-family: --f-serif, font-weight: 500, font-size: clamp(36px, 4.6vw, 56px), line-height: 1.04, letter-spacing: -0.01em, margin: 0 0 12px, color: --ink`

##### c. Prédicateur (`<div class="sermon-by">`)
Texte : « Rev. Robert Ndaye M. »
`font-family: --f-body, font-size: 13px, color: --ink-2, letter-spacing: .02em, margin-bottom: 28px`

##### d. Vidéo (`<div class="sermon-video">`)
Wrapper avec `margin-bottom: 32px`.

`.video-poster` :
- `aspect-ratio: 16/9, background: #050507, position: relative, border-radius: 6px, overflow: hidden, margin-bottom: 10px`
- Image de fond : `<img src="assets/sanctuary.jpeg">` en `position: absolute, inset: 0, width: 100%, height: 100%, object-fit: cover, filter: grayscale(.3) brightness(.55)`
- Bouton play centré (`<div class="play-btn">▶</div>`) :
  `position: absolute, inset: 0, margin: auto, width: 64px, height: 64px, border-radius: 50%, background: rgba(255,255,255,.95), color: #050507, display: flex, align-items: center, justify-content: center, font-size: 22px, padding-left: 4px`

`.video-runtime` :
Texte : « 1H 28MIN · audio + vidéo · disponible en téléchargement »
`font-family: --f-body, font-size: 11px, letter-spacing: .18em, uppercase, color: --ink-3`

##### e. Onglets internes (`<div class="sermon-tabs" role="tablist">`)

3 onglets, **un seul actif** à la fois.

```html
<div class="sermon-tabs" role="tablist">
  <button class="stab is-active" data-stab="passages">Passages</button>
  <button class="stab" data-stab="branham">Citations Branham</button>
  <button class="stab" data-stab="plan">Plan</button>
</div>
```

Conteneur : `display: flex, border-bottom: 1.5px solid --ink, margin-bottom: 32px`.

`.stab` :
`background: transparent, border: 0, font-family: --f-body, font-size: 13px, letter-spacing: .04em, color: --ink-3, padding: 14px 22px 14px 0, margin-right: 28px, cursor: pointer, position: relative`

`.stab:hover` → `color: --ink`
`.stab.is-active` → `color: --ink, font-weight: 500`
`.stab.is-active::after` → barre rouge sous l'onglet actif :
`content: "", position: absolute, left: 0, right: 22px, bottom: -1.5px, height: 2px, background: --accent (rouge)`

##### f. Panneaux d'onglets (`.stab-panel`)

```css
.stab-panel { display: none; }
.stab-panel.is-active { display: block; }
```

###### Panneau « Passages » (`data-stab-panel="passages"`)

Suite de blocs `<div class="passage-block">` (`margin-bottom: 28px`) chacun composé :

- **Référence** (`<div class="ref-line">`)
  `font-family: --f-body, font-size: 11px, letter-spacing: .26em, uppercase, color: --ink, font-weight: 600, margin-bottom: 8px`
- **Citation biblique** (`<blockquote class="bibl">`)
  `border-left: 2px solid --ink, padding-left: 18px, margin: 0, font-family: --f-serif, font-size: 17px, line-height: 1.55, color: --ink, text-wrap: pretty`

**Contenu wireframe** (4 passages — à conserver) :
1. **Matthieu 7 . 24–27** — « C'est pourquoi, quiconque entend ces paroles que je dis et les met en pratique, sera semblable à un homme prudent qui a bâti sa maison sur le roc. La pluie est tombée, les torrents sont venus, les vents ont soufflé et se sont jetés contre cette maison : elle n'est point tombée, parce qu'elle était fondée sur le roc. »
2. **1 Corinthiens 3 . 11** — « Car personne ne peut poser un autre fondement que celui qui a été posé, savoir Jésus-Christ. »
3. **Ésaïe 28 . 16** — « C'est pourquoi ainsi parle le Seigneur, l'Éternel : Voici, j'ai mis pour fondement en Sion une pierre, une pierre éprouvée, une pierre angulaire de prix, solidement posée ; celui qui la prendra pour appui n'aura point hâte de fuir. »
4. **Psaume 18 . 2** — « L'Éternel est mon rocher, ma forteresse, mon libérateur. Mon Dieu est mon rocher, où je trouve un abri. »

###### Panneau « Citations Branham » (`data-stab-panel="branham"`)

Suite de blocs `<div class="bran-block">` (`margin-bottom: 28px`) :

- **Source** (`<div class="bran-source">`)
  `font-family: --f-body, font-size: 10.5px, letter-spacing: .22em, uppercase, color: --ink-3, margin-bottom: 8px`
- **Citation** (`<blockquote class="bran">`)
  `border-left: 2px solid --accent (ROUGE), padding-left: 18px, margin: 0, font-family: --f-serif, font-style: italic, font-size: 17px, line-height: 1.55, color: --ink, text-wrap: pretty`

**Différence visuelle clé avec les passages bibliques** : filet gauche **ROUGE** + texte en **italique** (les passages bibliques ont filet noir + texte droit).

**Contenu wireframe** (3 citations) :
1. Source : « CHRIST IS THE MYSTERY OF GOD REVEALED · 63-0728 · §117 »
   « La maison qui est bâtie sur le Roc, c'est la maison qui est bâtie sur la révélation de qui est Jésus-Christ — pas l'imagination de qui Il est, mais la révélation. »
2. Source : « THE TOKEN · 63-0901M · §244 »
   « Quand le vent souffle, mes amis, vérifiez votre fondement. Ce que vous croyez en silence le dimanche, c'est ce qui tient le mardi. »
3. Source : « THE STATURE OF A PERFECT MAN · 62-1014M · §389 »
   « Vous ne pouvez pas bâtir sur le sable et appeler ça un édifice. Le Roc, c'est Christ — la révélation que la Parole est ce qu'Elle dit qu'Elle est. »

###### Panneau « Plan » (`data-stab-panel="plan"`)

Liste ordonnée `<ol class="plan-list">` (`list-style: none, margin: 0, padding: 0`).

Chaque `<li>` :
- Grid : `56px 1fr, gap: 20px, padding: 22px 0, border-bottom: 1px solid rgba(12,14,20,.1)`
- Premier `<li>` : `padding-top: 4px` ; dernier : `border-bottom: 0`

**Cellules** :
- `<span class="plan-num">` — chiffre romain : I, II, III, IV
  `font-family: --f-serif, font-style: italic, font-size: 28px, color: --accent (ROUGE), line-height: 1, padding-top: 4px`
- `<div class="plan-body">` :
  - `<h4>` titre du point : `font-family: --f-serif, font-weight: 500, font-size: 19px, line-height: 1.3, color: --ink, margin: 0 0 6px`
  - `<p>` description : `font-family: --f-body, font-size: 14px, line-height: 1.55, color: --ink-2, margin: 0, max-width: 60ch`

**Contenu wireframe** (4 points) :
- **I** — Le fondement n'est ni une opinion ni une émotion. _Distinction entre la foi héritée et la foi éprouvée. Trois épreuves nommées sans détour._
- **II** — Ce qui tient quand le vent souffle. _La Parole lue, comprise, mise en pratique. Lecture en parallèle de Matthieu 7 et 1 Corinthiens 3._
- **III** — Ce qui tombe — et pourquoi. _Le sable comme image de la vie sans fondement révélé. Avertissements pastoraux._
- **IV** — Application pour cette semaine. _Trois pratiques concrètes : la lecture quotidienne, l'autel domestique, la prière silencieuse._

##### g. Pied de fiche (`<div class="sermon-actions">`)

Flex `gap: 14px, flex-wrap: wrap, margin-top: 32px, padding-top: 24px, border-top: 1px solid rgba(12,14,20,.15)`.

4 boutons `<a class="btn-line">` :
- ↓ Audio MP3
- ↓ Vidéo MP4
- ↓ Plan en PDF
- Partager

Style `.btn-line` :
`font-family: --f-body, font-size: 12px, letter-spacing: .14em, uppercase, color: --ink, border: 1.5px solid --ink, padding: 10px 18px, text-decoration: none, transition: all .15s`
`:hover` → `background: --ink, color: --paper`

---

## 5. Comportements (JavaScript)

### 5.1 Onglets internes
Click sur `.stab[data-stab]` :
1. Retire `.is-active` de tous les `.stab` du `.sermon-col` parent
2. Ajoute `.is-active` au bouton cliqué
3. Retire `.is-active` de tous les `.stab-panel`
4. Ajoute `.is-active` au panneau dont `data-stab-panel` correspond

```js
document.addEventListener('click', (e) => {
  const stab = e.target.closest('.stab[data-stab]');
  if (!stab) return;
  const id = stab.dataset.stab;
  const scope = stab.closest('.sermon-col');
  if (!scope) return;
  scope.querySelectorAll('.stab').forEach(b => b.classList.toggle('is-active', b === stab));
  scope.querySelectorAll('.stab-panel').forEach(p => p.classList.toggle('is-active', p.dataset.stabPanel === id));
});
```

### 5.2 Filtres (chips)
Click sur `.chip` dans un `.filter-group` :
- Toggle visuel : retire `.active` des chips frères, applique sur le chip cliqué
- Le filtrage de la liste d'archives est branché côté backend (hors scope de cette PRD)

### 5.3 Recherche
Input `text` dans `.filter-search` — branchement backend (pas d'autocomplete dans le wireframe).

### 5.4 Sélection d'un culte dans l'archive
Click sur `.archive-item` :
1. Retire `.is-active` de tous les `.archive-item` (toutes années / mois)
2. Ajoute `.is-active` à l'item cliqué
3. Met à jour la fiche de droite (`.sermon-col`) avec les nouvelles données : titre, série, date, vidéo, prédicateur, passages, citations, plan
4. (Optionnel hi-fi) Réinitialise l'onglet interne actif sur « Passages »
5. (Optionnel hi-fi) Met à jour l'URL avec un slug (ex. `/cultes/2026-04-26-le-roc-qui-ne-tombe-pas`) pour partage profond

---

## 6. Schéma de données suggéré

Pour brancher la page sur un backend, chaque culte = un objet JSON :

```ts
type Sermon = {
  id: string;                    // 'sermon-2026-04-26'
  date: string;                  // '2026-04-26' (ISO)
  weekday: 'Dim.' | 'Mer.' | 'Ven.';
  service: 'Culte' | 'Étude';
  title: string;                 // 'Le Roc qui ne tombe pas'
  titleEm?: string;              // 2e moitié italique (optionnel)
  series?: { name: string; number: number };  // { name: "L'Ordre de l'Église", number: 14 }
  preacher: string;              // 'Rev. Robert Ndaye M.'
  startTime: string;             // '09H00'
  duration: string;              // '1H 28MIN'
  poster: string;                // path image vignette
  videoUrl: string;
  audioUrl: string;
  pdfUrl: string;
  passages: Array<{
    ref: string;                 // 'Matthieu 7 . 24–27'
    text: string;                // citation biblique
  }>;
  branhamQuotes: Array<{
    source: string;              // 'CHRIST IS THE MYSTERY OF GOD REVEALED · 63-0728 · §117'
    text: string;
  }>;
  plan: Array<{
    roman: string;               // 'I', 'II', 'III', 'IV'
    title: string;
    description: string;
  }>;
};
```

Liste de l'archive groupée par mois :

```ts
type ArchiveMonth = {
  label: string;                 // 'Avril 2026'
  items: Array<{ id: string; weekday: string; date: string; title: string; series: string }>;
};
```

---

## 7. HTML de référence — à recopier _verbatim_

Voici le markup exact tel qu'il existe dans le wireframe. **C'est la source de vérité visuelle** : reproduire à l'identique, ne pas réinterpréter.

```html
<div class="ctx-view" data-ctx-view="cultes">

  <!-- 4.1 HERO -->
  <section class="cultes-hero anchored">
    <div class="cultes-hero-inner">
      <div class="eyebrow">Les prédications de l'assemblée</div>
      <h1>« La foi vient de ce qu'on entend,<br/><em>et ce qu'on entend vient de la Parole. »</em></h1>
      <div class="cultes-hero-ref">Romains 10 . 17</div>
      <p class="lede">Chaque culte est conservé ici comme un objet d'étude — vidéo, passages bibliques cités, citations du prophète et plan structurel rassemblés dans une seule fiche, pour la lecture, la méditation et le partage.</p>
      <blockquote class="cultes-hero-bran">
        « La Parole prêchée est la semence ; elle ne tombe pas par terre, elle reste, elle germe à son temps. »
        <cite>— W. M. Branham · THE SPOKEN WORD IS THE ORIGINAL SEED · 62-0318M</cite>
      </blockquote>
    </div>
  </section>

  <!-- 4.2 FILTERS -->
  <section class="cultes-filters anchored">
    <div class="filters-inner">
      <div class="filter-group">
        <span class="lbl">Classer par</span>
        <a href="#" class="chip active">Date</a>
        <a href="#" class="chip">Série</a>
        <a href="#" class="chip">Livre biblique</a>
      </div>
      <div class="filter-group">
        <span class="lbl">Période</span>
        <a href="#" class="chip">2026</a>
        <a href="#" class="chip">2025</a>
        <a href="#" class="chip">2024</a>
        <a href="#" class="chip muted">Archives ↓</a>
      </div>
      <div class="filter-search">
        <span class="search-icon" aria-hidden="true">⌕</span>
        <input type="text" placeholder="Rechercher · titre, verset, mot-clé" />
      </div>
    </div>
  </section>

  <!-- 4.3 BOARD -->
  <section class="cultes-board anchored">

    <!-- 4.3.1 Archive col -->
    <aside class="archive-col">
      <div class="month-block">
        <div class="month-lbl">Avril 2026</div>
        <ul class="archive-list">
          <li class="archive-item is-active">
            <span class="when">Dim. 26 . 04</span>
            <span class="title">Le Roc qui ne tombe pas</span>
            <span class="series">L'Ordre de l'Église #14</span>
          </li>
          <li class="archive-item">
            <span class="when">Mer. 22 . 04</span>
            <span class="title">Le serviteur fidèle</span>
            <span class="series">L'Ordre de l'Église #13</span>
          </li>
          <li class="archive-item">
            <span class="when">Dim. 19 . 04</span>
            <span class="title">Une prière qui tient</span>
            <span class="series">L'Ordre de l'Église #12</span>
          </li>
          <li class="archive-item">
            <span class="when">Mer. 15 . 04</span>
            <span class="title">L'autel oublié</span>
            <span class="series">L'Ordre de l'Église #11</span>
          </li>
          <li class="archive-item">
            <span class="when">Dim. 12 . 04</span>
            <span class="title">Quand le silence parle</span>
            <span class="series">Étude libre</span>
          </li>
        </ul>
      </div>

      <div class="month-block">
        <div class="month-lbl">Mars 2026</div>
        <ul class="archive-list">
          <li class="archive-item">
            <span class="when">Dim. 29 . 03</span>
            <span class="title">La maison du potier</span>
            <span class="series">L'Ordre de l'Église #10</span>
          </li>
          <li class="archive-item">
            <span class="when">Mer. 25 . 03</span>
            <span class="title">Bâtir sans précipiter</span>
            <span class="series">L'Ordre de l'Église #09</span>
          </li>
          <li class="archive-item">
            <span class="when">Dim. 22 . 03</span>
            <span class="title">Le pain quotidien</span>
            <span class="series">Étude libre</span>
          </li>
        </ul>
      </div>

      <button class="archive-more">Voir plus de cultes ↓</button>
    </aside>

    <!-- 4.3.2 Active sermon col -->
    <article class="sermon-col">
      <div class="sermon-meta">
        <span class="series-tag">L'Ordre de l'Église · #14</span>
        <span class="when-tag">Dimanche 26 avril 2026 · 09H00</span>
      </div>
      <h2 class="sermon-title">Le Roc qui<br/><em>ne tombe pas.</em></h2>
      <div class="sermon-by">Rev. Robert Ndaye M.</div>

      <div class="sermon-video">
        <div class="video-poster">
          <img src="assets/sanctuary.jpeg" alt="" />
          <div class="play-btn" aria-hidden="true">▶</div>
        </div>
        <div class="video-runtime">1H 28MIN · audio + vidéo · disponible en téléchargement</div>
      </div>

      <div class="sermon-tabs" role="tablist">
        <button class="stab is-active" data-stab="passages">Passages</button>
        <button class="stab" data-stab="branham">Citations Branham</button>
        <button class="stab" data-stab="plan">Plan</button>
      </div>

      <!-- Passages -->
      <div class="stab-panel is-active" data-stab-panel="passages">
        <div class="passage-block">
          <div class="ref-line">Matthieu 7 . 24–27</div>
          <blockquote class="bibl">
            C'est pourquoi, quiconque entend ces paroles que je dis et les met en pratique, sera semblable à un homme prudent qui a bâti sa maison sur le roc. La pluie est tombée, les torrents sont venus, les vents ont soufflé et se sont jetés contre cette maison : elle n'est point tombée, parce qu'elle était fondée sur le roc.
          </blockquote>
        </div>
        <div class="passage-block">
          <div class="ref-line">1 Corinthiens 3 . 11</div>
          <blockquote class="bibl">
            Car personne ne peut poser un autre fondement que celui qui a été posé, savoir Jésus-Christ.
          </blockquote>
        </div>
        <div class="passage-block">
          <div class="ref-line">Ésaïe 28 . 16</div>
          <blockquote class="bibl">
            C'est pourquoi ainsi parle le Seigneur, l'Éternel : Voici, j'ai mis pour fondement en Sion une pierre, une pierre éprouvée, une pierre angulaire de prix, solidement posée ; celui qui la prendra pour appui n'aura point hâte de fuir.
          </blockquote>
        </div>
        <div class="passage-block">
          <div class="ref-line">Psaume 18 . 2</div>
          <blockquote class="bibl">
            L'Éternel est mon rocher, ma forteresse, mon libérateur. Mon Dieu est mon rocher, où je trouve un abri.
          </blockquote>
        </div>
      </div>

      <!-- Branham -->
      <div class="stab-panel" data-stab-panel="branham">
        <div class="bran-block">
          <div class="bran-source">CHRIST IS THE MYSTERY OF GOD REVEALED · 63-0728 · §117</div>
          <blockquote class="bran">
            La maison qui est bâtie sur le Roc, c'est la maison qui est bâtie sur la révélation de qui est Jésus-Christ — pas l'imagination de qui Il est, mais la révélation.
          </blockquote>
        </div>
        <div class="bran-block">
          <div class="bran-source">THE TOKEN · 63-0901M · §244</div>
          <blockquote class="bran">
            Quand le vent souffle, mes amis, vérifiez votre fondement. Ce que vous croyez en silence le dimanche, c'est ce qui tient le mardi.
          </blockquote>
        </div>
        <div class="bran-block">
          <div class="bran-source">THE STATURE OF A PERFECT MAN · 62-1014M · §389</div>
          <blockquote class="bran">
            Vous ne pouvez pas bâtir sur le sable et appeler ça un édifice. Le Roc, c'est Christ — la révélation que la Parole est ce qu'Elle dit qu'Elle est.
          </blockquote>
        </div>
      </div>

      <!-- Plan -->
      <div class="stab-panel" data-stab-panel="plan">
        <ol class="plan-list">
          <li>
            <span class="plan-num">I</span>
            <div class="plan-body">
              <h4>Le fondement n'est ni une opinion ni une émotion</h4>
              <p>Distinction entre la foi héritée et la foi éprouvée. Trois épreuves nommées sans détour.</p>
            </div>
          </li>
          <li>
            <span class="plan-num">II</span>
            <div class="plan-body">
              <h4>Ce qui tient quand le vent souffle</h4>
              <p>La Parole lue, comprise, mise en pratique. Lecture en parallèle de Matthieu 7 et 1 Corinthiens 3.</p>
            </div>
          </li>
          <li>
            <span class="plan-num">III</span>
            <div class="plan-body">
              <h4>Ce qui tombe — et pourquoi</h4>
              <p>Le sable comme image de la vie sans fondement révélé. Avertissements pastoraux.</p>
            </div>
          </li>
          <li>
            <span class="plan-num">IV</span>
            <div class="plan-body">
              <h4>Application pour cette semaine</h4>
              <p>Trois pratiques concrètes : la lecture quotidienne, l'autel domestique, la prière silencieuse.</p>
            </div>
          </li>
        </ol>
      </div>

      <div class="sermon-actions">
        <a href="#" class="btn-line">↓ Audio MP3</a>
        <a href="#" class="btn-line">↓ Vidéo MP4</a>
        <a href="#" class="btn-line">↓ Plan en PDF</a>
        <a href="#" class="btn-line">Partager</a>
      </div>
    </article>

  </section>

</div>
```

---

## 8. CSS de référence — à recopier _verbatim_

> **Note** : tous les sélecteurs ci-dessous sont scopés sous `#page-eglise` parce que la sous-page vit dans la page 04. Si tu reproduis dans un environnement différent (composant React isolé, page standalone), remplace `#page-eglise` par la racine du composant ou laisse vide.

```css
/* ====== 04a CULTES ========================================== */

/* Hero shared base */
.cultes-hero {
  max-width: 1280px; margin: 0 auto;
  padding: 60px 32px 40px;
  border-bottom: 1.5px solid var(--ink);
  position: relative;
}
.cultes-hero-inner { max-width: 760px; }
.cultes-hero h1 {
  font-family: var(--f-serif); font-weight: 500;
  font-size: clamp(40px, 5.4vw, 64px);
  line-height: 1.04; letter-spacing: -0.01em;
  margin: 14px 0 18px;
  color: var(--ink);
  text-wrap: pretty;
}
.cultes-hero h1 em { font-style: italic; color: var(--ink-2); }
.cultes-hero .lede {
  font-family: var(--f-serif);
  font-size: 19px; line-height: 1.55;
  color: var(--ink-2);
  max-width: 620px;
  margin: 0;
}
.cultes-hero-ref {
  font-family: var(--f-body); font-size: 11px;
  letter-spacing: .26em; text-transform: uppercase;
  color: var(--accent); font-weight: 600;
  margin: -8px 0 22px;
}
.cultes-hero-bran {
  margin: 26px 0 0;
  padding: 18px 22px;
  border-left: 2px solid var(--accent);
  background: var(--paper-2);
  font-family: var(--f-serif);
  font-style: italic;
  font-size: 16px; line-height: 1.5;
  color: var(--ink);
  max-width: 640px;
}
.cultes-hero-bran cite {
  display: block;
  margin-top: 10px;
  font-style: normal;
  font-family: var(--f-body); font-size: 10.5px;
  letter-spacing: .22em; text-transform: uppercase;
  color: var(--ink-3);
}

/* Filters bar */
.cultes-filters {
  max-width: 1280px; margin: 0 auto;
  padding: 22px 32px;
  border-bottom: 1px solid rgba(12,14,20,.15);
}
.cultes-filters .filters-inner {
  display: flex; align-items: center; gap: 32px; flex-wrap: wrap;
}
.filter-group {
  display: inline-flex; align-items: center; gap: 10px;
}
.filter-group .lbl {
  font-family: var(--f-body); font-size: 11px;
  letter-spacing: .22em; text-transform: uppercase;
  color: var(--ink-3);
  margin-right: 4px;
}
.chip {
  font-family: var(--f-body); font-size: 12px;
  letter-spacing: .04em;
  color: var(--ink-2);
  padding: 6px 12px;
  border: 1px solid rgba(12,14,20,.2);
  border-radius: 999px;
  text-decoration: none;
  transition: all .15s;
}
.chip:hover { border-color: var(--ink); color: var(--ink); }
.chip.active {
  background: var(--ink); color: var(--paper);
  border-color: var(--ink);
}
.chip.muted { color: var(--ink-3); border-style: dashed; }
.filter-search {
  flex: 1; min-width: 220px;
  margin-left: auto;
  display: inline-flex; align-items: center; gap: 8px;
  border-bottom: 1px solid rgba(12,14,20,.25);
  padding: 6px 4px;
}
.filter-search .search-icon { font-size: 16px; color: var(--ink-3); }
.filter-search input {
  flex: 1; border: 0; background: transparent;
  font-family: var(--f-body); font-size: 13px;
  color: var(--ink); outline: none;
  padding: 2px 0;
}
.filter-search input::placeholder { color: var(--ink-3); }

/* 2-col board */
.cultes-board {
  max-width: 1280px; margin: 0 auto;
  padding: 48px 32px 80px;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 56px;
}

/* Archive column */
.archive-col { position: relative; }
.month-block { margin-bottom: 32px; }
.month-lbl {
  font-family: var(--f-body); font-size: 11px;
  letter-spacing: .26em; text-transform: uppercase;
  color: var(--ink-3);
  padding-bottom: 10px;
  margin-bottom: 4px;
  border-bottom: 1.5px solid var(--ink);
}
.archive-list { list-style: none; margin: 0; padding: 0; }
.archive-item {
  display: grid;
  grid-template-columns: 84px 1fr;
  grid-template-rows: auto auto;
  column-gap: 14px;
  padding: 14px 4px;
  border-bottom: 1px solid rgba(12,14,20,.1);
  cursor: pointer;
  transition: background .15s;
}
.archive-item:hover { background: rgba(12,14,20,.03); }
.archive-item.is-active {
  background: var(--paper-2);
  border-left: 2px solid var(--accent);
  padding-left: 12px;
  margin-left: -14px;
  padding-right: 8px;
}
.archive-item .when {
  grid-row: 1 / span 2; grid-column: 1;
  font-family: var(--f-num); font-size: 12px;
  color: var(--ink-3);
  letter-spacing: .04em;
  align-self: start; padding-top: 2px;
}
.archive-item .title {
  grid-row: 1; grid-column: 2;
  font-family: var(--f-serif); font-weight: 500;
  font-size: 15px; line-height: 1.3;
  color: var(--ink);
}
.archive-item .series {
  grid-row: 2; grid-column: 2;
  font-family: var(--f-body); font-size: 11px;
  letter-spacing: .12em; text-transform: uppercase;
  color: var(--ink-3);
  margin-top: 4px;
}
.archive-more {
  margin-top: 12px;
  background: transparent; border: 0;
  font-family: var(--f-body); font-size: 12px;
  letter-spacing: .14em; text-transform: uppercase;
  color: var(--ink); padding: 8px 0;
  cursor: pointer;
  border-bottom: 1px solid var(--ink);
}

/* Sermon column */
.sermon-col { position: relative; }
.sermon-meta {
  display: flex; align-items: center; gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.sermon-meta .series-tag {
  font-family: var(--f-body); font-size: 11px;
  letter-spacing: .26em; text-transform: uppercase;
  color: var(--accent);
  font-weight: 600;
}
.sermon-meta .when-tag {
  font-family: var(--f-num); font-size: 12px;
  color: var(--ink-3); letter-spacing: .04em;
}
.sermon-title {
  font-family: var(--f-serif); font-weight: 500;
  font-size: clamp(36px, 4.6vw, 56px);
  line-height: 1.04; letter-spacing: -0.01em;
  margin: 0 0 12px;
  color: var(--ink);
}
.sermon-title em { font-style: italic; color: var(--ink-2); }
.sermon-by {
  font-family: var(--f-body); font-size: 13px;
  color: var(--ink-2);
  letter-spacing: .02em;
  margin-bottom: 28px;
}
.sermon-video { margin-bottom: 32px; }
.sermon-video .video-poster {
  aspect-ratio: 16/9;
  background: #050507;
  position: relative;
  border-radius: 6px; overflow: hidden;
  margin-bottom: 10px;
}
.sermon-video .video-poster img {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
  filter: grayscale(.3) brightness(.55);
}
.sermon-video .play-btn {
  position: absolute; inset: 0; margin: auto;
  width: 64px; height: 64px;
  border-radius: 50%;
  background: rgba(255,255,255,.95);
  color: #050507;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; padding-left: 4px;
}
.sermon-video .video-runtime {
  font-family: var(--f-body); font-size: 11px;
  letter-spacing: .18em; text-transform: uppercase;
  color: var(--ink-3);
}

/* Internal tabs */
.sermon-tabs {
  display: flex; gap: 0;
  border-bottom: 1.5px solid var(--ink);
  margin-bottom: 32px;
}
.stab {
  background: transparent; border: 0;
  font-family: var(--f-body); font-size: 13px;
  letter-spacing: .04em;
  color: var(--ink-3);
  padding: 14px 22px 14px 0;
  margin-right: 28px;
  cursor: pointer;
  position: relative;
  text-transform: none;
}
.stab:hover { color: var(--ink); }
.stab.is-active { color: var(--ink); font-weight: 500; }
.stab.is-active::after {
  content: ""; position: absolute;
  left: 0; right: 22px; bottom: -1.5px;
  height: 2px; background: var(--accent);
}
.stab-panel { display: none; }
.stab-panel.is-active { display: block; }

/* Passages */
.passage-block { margin-bottom: 28px; }
.passage-block .ref-line {
  font-family: var(--f-body); font-size: 11px;
  letter-spacing: .26em; text-transform: uppercase;
  color: var(--ink); font-weight: 600;
  margin-bottom: 8px;
}
.bibl {
  border-left: 2px solid var(--ink);
  padding-left: 18px;
  margin: 0;
  font-family: var(--f-serif);
  font-size: 17px; line-height: 1.55;
  color: var(--ink);
  text-wrap: pretty;
}

/* Branham */
.bran-block { margin-bottom: 28px; }
.bran-source {
  font-family: var(--f-body); font-size: 10.5px;
  letter-spacing: .22em; text-transform: uppercase;
  color: var(--ink-3);
  margin-bottom: 8px;
}
.bran {
  border-left: 2px solid var(--accent);
  padding-left: 18px;
  margin: 0;
  font-family: var(--f-serif);
  font-style: italic;
  font-size: 17px; line-height: 1.55;
  color: var(--ink);
  text-wrap: pretty;
}

/* Plan */
.plan-list {
  list-style: none; margin: 0; padding: 0;
  counter-reset: plan;
}
.plan-list li {
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 20px;
  padding: 22px 0;
  border-bottom: 1px solid rgba(12,14,20,.1);
}
.plan-list li:first-child { padding-top: 4px; }
.plan-list li:last-child { border-bottom: 0; }
.plan-num {
  font-family: var(--f-serif); font-style: italic;
  font-size: 28px; color: var(--accent);
  line-height: 1; padding-top: 4px;
}
.plan-body h4 {
  font-family: var(--f-serif); font-weight: 500;
  font-size: 19px; line-height: 1.3;
  color: var(--ink); margin: 0 0 6px;
}
.plan-body p {
  font-family: var(--f-body); font-size: 14px; line-height: 1.55;
  color: var(--ink-2); margin: 0;
  max-width: 60ch;
}

/* Sermon footer actions */
.sermon-actions {
  display: flex; gap: 14px; flex-wrap: wrap;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(12,14,20,.15);
}
.btn-line {
  font-family: var(--f-body); font-size: 12px;
  letter-spacing: .14em; text-transform: uppercase;
  color: var(--ink);
  border: 1.5px solid var(--ink);
  padding: 10px 18px;
  text-decoration: none;
  transition: all .15s;
}
.btn-line:hover { background: var(--ink); color: var(--paper); }
```

### Mobile (≤ 820px)

```css
@media (max-width: 820px) {
  .cultes-hero { padding: 40px 22px 28px; }
  .cultes-filters { padding: 18px 22px; }
  .filter-search { margin-left: 0; width: 100%; }
  .filter-group { flex-wrap: wrap; }

  /* Effondre la grid 2 colonnes en stack avec sermon en haut, archive en bas */
  .cultes-board {
    grid-template-columns: 1fr;
    gap: 36px;
    padding: 32px 22px 60px;
  }
  .archive-col {
    order: 2;
    padding-top: 24px;
    border-top: 1.5px solid var(--ink);
  }
  .sermon-col { order: 1; }
  .archive-item { grid-template-columns: 70px 1fr; }
  .sermon-tabs { overflow-x: auto; flex-wrap: nowrap; }
  .stab {
    flex-shrink: 0;
    padding: 12px 18px 12px 0;
    margin-right: 18px;
    font-size: 12px;
  }
}
```

---

## 9. Hi-fi : ce qui change par rapport au wireframe

| Élément | Wireframe | Hi-fi cible |
|---|---|---|
| Vignette vidéo | `assets/sanctuary.jpeg` filtrée + bouton play CSS | Vraie miniature personnalisée par sermon (rendu YouTube/Cloudinary) + lecteur réel au click |
| Datas archive | 8 entrées hardcodées sur 2 mois | Liste paginée depuis backend, infinite scroll sur « Voir plus de cultes ↓ » |
| Filtres | Visuels seulement | Branchés (query params, état URL persistant) |
| Recherche | Input vide | Autocomplete fuzzy sur titre/verset/série |
| Onglets internes | Switch JS du panneau actif | Idem (pas de changement) |
| Item d'archive actif | Hardcodé en `.is-active` | Calculé depuis l'URL ou le sermon courant |
| `sanctuary.jpeg` placeholder | Photo générique de la salle | À remplacer par une **vraie miniature de la prédication** (capture ou photo prise pendant le culte) |

**À NE PAS faire en hi-fi** :
- Ajouter une grille de « vidéos suggérées » sous la fiche
- Ajouter compteurs de vues, likes, partages avec compteur
- Ajouter recommandation algorithmique
- Changer la sémantique couleur (rouge = série/Branham/plan ; encre = passages bibliques + UI principale)
- Remplacer Cormorant par une autre serif
- Mettre la nav contextuelle dans le scope de cette modification (elle est gérée par la page 04 parente)

---

## 10. Checklist de validation

À cocher après reproduction :

- [ ] Hero : eyebrow + titre 2 lignes (italique sur la 2e) + ref rouge + lede + blockquote Branham filet rouge
- [ ] Filtres : 3 chips « Classer par » (Date actif), 4 chips « Période » (dont Archives en dashed), recherche à droite avec icône
- [ ] Grid 320px / 1fr avec gap 56px (effondre en stack ≤ 820px, sermon au-dessus de l'archive)
- [ ] Archive : 2 mois (Avril, Mars 2026), 8 items, premier item `.is-active` avec filet gauche rouge + fond paper-2
- [ ] Item d'archive : date Bodoni Moda à gauche, titre Cormorant + série uppercase à droite
- [ ] Bouton « Voir plus de cultes ↓ » sous l'archive
- [ ] Sermon : série rouge + date Bodoni en méta, titre Cormorant 2 lignes (italique 2e), prédicateur Inter
- [ ] Vidéo : poster 16/9, image filtrée grayscale .3 brightness .55, bouton play 64px rond blanc avec ▶
- [ ] Runtime « 1H 28MIN · audio + vidéo · disponible en téléchargement »
- [ ] 3 onglets : Passages / Citations Branham / Plan, soulignement rouge sur actif
- [ ] Passages : 4 références bibliques en filet noir, citations en Cormorant droit
- [ ] Branham : 3 citations en filet ROUGE + italique, source uppercase au-dessus
- [ ] Plan : 4 points avec chiffre romain rouge italique 28px (I, II, III, IV)
- [ ] Pied : 4 boutons outlined Inter uppercase (Audio MP3, Vidéo MP4, Plan PDF, Partager)
- [ ] Hover boutons : fond noir, texte blanc
- [ ] Aucun footer, aucune nav, aucun élément en dehors du `<div class="ctx-view" data-ctx-view="cultes">`

---

**Fin du PRD Cultes.**
À utiliser conjointement avec le `PRD.md` global (qui fournit les tokens couleurs/polices, la stack technique, les conventions de routing et le ton éditorial).
