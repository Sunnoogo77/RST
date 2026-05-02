# PRD — Sous-page **Cantiques** (04b) · RST Front Pages

> Document de référence à donner à Claude Code en complément du `PRD.md` global et du `PRD-CULTES.md`.
> **Objectif** : reproduire à l'identique la sous-page « Cantiques » (onglet contextuel de la page 04 — L'Église / Actualité). Pas le footer, pas la nav, pas l'en-tête : **uniquement le contenu de la sous-page Cantiques** (du hero jusqu'à la fin de la fiche détaillée du cantique).
> Mise en hi-fi : remplacer les placeholders d'images par de vraies vignettes, brancher le lecteur sur de vraies vidéos, brancher familles et recherche sur de vraies données. **L'architecture, les espacements, la typographie, les couleurs et la composition ne changent pas.**

---

## 0. Localisation dans l'app

```
Page 04 — L'Église / Actualité
└── ctx-nav (sous-onglets contextuels)
    ├── Cette semaine
    ├── Cultes              (cf. PRD-CULTES.md)
    ├── Cantiques           ← ★ CETTE PRD
    ├── Annonces
    └── Témoignages
```

Conteneur d'affichage :

```html
<div class="ctx-view" data-ctx-view="cantiques">
  ...contenu de la sous-page...
</div>
```

Toggle d'affichage géré par le JS de la page 04 : un seul `.ctx-view` est `is-active` à la fois.

---

## 1. Intention de la page

C'est **un hymnaire numérique**, pas un mini-player.

| À faire | À NE PAS faire |
|---|---|
| Présenter chaque cantique comme une **fiche** : enregistrement vidéo + paroles complètes versifiées | Lecteur audio collé en bas d'écran type Spotify/SoundCloud |
| Classer par **familles** : recueil traditionnel, cantiques du Message, cantiques composés à RST | Mélanger sans hiérarchie |
| Lecture posée des paroles (typo serif, taille A−/A/A+, export PDF) | Karaoké défilant, lyrics synchronisées, animations |
| Numérotation rigoureuse (№ d'hymnaire) | Likes, étoiles, classements |
| Mettre en avant le cantique **vedette** de la semaine (carte 2×2) | Auto-rotation, carrousel |
| Soliste / chœur / arrangement précisés | Profils d'artistes, biographies, commentaires |

Utilisateur cible : un membre de l'assemblée qui veut **chanter avec** le chœur, retrouver un № précis, ou imprimer les paroles pour le culte.

---

## 2. Structure de la page (de haut en bas)

```
┌─────────────────────────────────────────────────────────────┐
│ HERO (cant-hero)                                            │
│   eyebrow · h1 (titre 2 lignes, italique 2e) · lede         │
├─────────────────────────────────────────────────────────────┤
│ FAMILY TABS (cant-families)                                 │
│   [Tous · 84] [Du recueil · 62] [Du Message · 14]           │
│   [Composés ici · 8]                  · search à droite     │
├─────────────────────────────────────────────────────────────┤
│ GRID (cant-grid) — 4 colonnes égales · gap 28×24            │
│  ┌───────────────────────┐  ┌───────────┐  ┌───────────┐   │
│  │ FEATURED              │  │ card      │  │ card      │   │
│  │ (span 2 col × 2 row)  │  │           │  │           │   │
│  │  thumb 16/10 + play   │  ├───────────┤  ├───────────┤   │
│  │  fam-tag overlay      │  │ card      │  │ card      │   │
│  │  H3 26px              │  │           │  │           │   │
│  │  meta + № + date      │  │           │  │           │   │
│  └───────────────────────┘  └───────────┘  └───────────┘   │
│  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐                    │
│  │ card  │ │ card  │ │ card  │ │ card  │                    │
│  └───────┘ └───────┘ └───────┘ └───────┘                    │
├─────────────────────────────────────────────────────────────┤
│ DETAIL (cant-detail) — état "fiche ouverte"                 │
│   meta : ← Retour à l'hymnaire   |   tag (famille · №)      │
│   h2 titre 2 lignes (italique 2e)                           │
│   sous-titre prédicateur/compositeur                        │
│   ┌──────────────────────────┐  ┌─────────────────────────┐ │
│   │ VIDEO (poster 16/9)      │  │ LYRICS (paper-2 box)    │ │
│   │ play-btn 72px            │  │ toolbar : A− A A+ │ PDF │ │
│   │ "5MIN 42 · enreg. studio"│  │ ─────                   │ │
│   │                          │  │ 1  paroles couplet 1    │ │
│   │                          │  │ ℟  refrain (italique)   │ │
│   │                          │  │ 2  couplet 2            │ │
│   │                          │  │ ℟  refrain              │ │
│   │                          │  │ 3  couplet 3            │ │
│   └──────────────────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Container max-width** : `1280px`, marges latérales `32px` (mobile : `22px`).

---

## 3. Tokens de design (rappel)

```css
--paper      : #FAF7F0
--paper-2    : #F4F1EA   /* fond du panneau Paroles, fond featured */
--ink        : #0C0E14
--ink-2      : #2A2D38
--ink-3      : #6B6E7A
--accent     : #A62020   /* ROUGE — № de strophes (1, 2, 3…), titres em italique uniquement via héritage */
--note-blue  : #15364B   /* BLEU — overlay des vignettes vidéo (gradient) */

--f-serif    : 'Cormorant Garamond', serif    /* titres, paroles */
--f-num      : 'Bodoni Moda', serif           /* dates, numéros, runtime */
--f-body     : 'Inter', system-ui, sans-serif /* eyebrow, fam-tag, toolbar, meta */
```

**Sémantique couleur sur cette page** :
- **BLEU** (`#22356D` / `--note-blue`) : utilisé en overlay gradient sur les vignettes vidéo (`linear-gradient(135deg, rgba(34,53,109,.85), rgba(12,14,20,.95))`) — c'est la signature visuelle des miniatures de cantiques (différence avec Cultes qui montre une vraie photo filtrée).
- **ROUGE** (`--accent`) : numéros de strophes (1, 2, 3) dans la fiche paroles ; titre `em` italique sur le hero hérite déjà du gris-encre 2 (pas de rouge sur le titre).
- **ENCRE** (`--ink`) : filets, séparateurs, fonds des chips actives, fond du bouton « A » actif dans la toolbar paroles.

---

## 4. Section par section — spécifications

### 4.1 Hero (`<section class="cant-hero">`)

**Padding** : `60px 32px 40px`. Bordure basse : `1.5px solid var(--ink)`.
**Container interne** : `max-width: 760px`.

Composition :
1. **Eyebrow** — « L'hymnaire »
   `font-family: --f-body, font-size: 11px, letter-spacing: .22em, uppercase, color: --ink-3`
2. **H1** — « Les chants [BR] *de l'assemblée.* » (2e ligne en italique gris-encre 2)
   `font-family: --f-serif, font-weight: 500, font-size: clamp(40px, 5.4vw, 64px), line-height: 1.04, letter-spacing: -0.01em, color: --ink, margin: 14px 0 18px`
3. **Lede**
   `font-family: --f-serif, font-size: 19px, line-height: 1.55, color: --ink-2, max-width: 620px, margin: 0`
   Texte exact : « Les cantiques sont la voix de Roc Séculaire. Ceux du recueil, ceux du Message, ceux qui sont nés ici. Trois familles, un seul hymnaire. »

**Pas de référence biblique, pas de blockquote Branham** sur ce hero (différence avec Cultes).

---

### 4.2 Onglets familles + recherche (`<section class="cant-families">`)

**Padding** : `22px 32px`. Bordure basse : `1px solid rgba(12,14,20,.15)`.
**Container** : flex, `align-items: center, gap: 32px, flex-wrap: wrap`.

#### Onglets (`<div class="fam-tabs" role="tablist">`)

4 boutons `<button class="fam">` :
- « Tous · 84 » (`.is-active` par défaut)
- « Du recueil · 62 »
- « Du Message · 14 »
- « Composés ici · 8 »

Chaque bouton a `data-fam="tous|recueil|message|composes"`.

Style `.fam` :
`background: transparent, font-family: --f-body, font-size: 12px, letter-spacing: .04em, color: --ink-2, padding: 8px 14px, border: 1px solid rgba(12,14,20,.2), border-radius: 999px, cursor: pointer, transition: all .15s`

`.fam:hover` → `border-color: --ink, color: --ink`
`.fam.is-active` → `background: --ink, color: --paper, border-color: --ink`

#### Recherche (`<div class="fam-search">`)

Identique à la barre de recherche des Cultes : icône `⌕` + input texte avec placeholder « Rechercher un cantique ».
`flex: 1, min-width: 220px, margin-left: auto, border-bottom: 1px solid rgba(12,14,20,.25), padding: 6px 4px`.

---

### 4.3 Grille des cantiques (`<section class="cant-grid">`)

**Padding** : `48px 32px 70px`. **Grid** : `repeat(4, 1fr)`, `gap: 28px 24px`.

Chaque cantique = `<article class="cant-card">`. Le **premier** (vedette de la semaine) porte aussi `.is-featured` qui le fait s'étendre sur **2 colonnes × 2 lignes** dans la grille.

#### Anatomie d'une carte

```html
<article class="cant-card">
  <div class="cant-thumb">
    <div class="play-btn" aria-hidden="true">▶</div>
    <span class="fam-tag">Du Message</span>     <!-- famille du cantique -->
  </div>
  <div class="cant-body">
    <h3>Titre du cantique</h3>
    <div class="cant-meta">Soliste · sœur Lumumba</div>
    <div class="cant-foot">
      <span class="cant-num">№ 12</span>
      <!-- optionnel pour la featured uniquement -->
      <span class="cant-date">Enregistré · 13 . 04 . 2026</span>
    </div>
  </div>
</article>
```

**Vignette** (`.cant-thumb`) :
- `aspect-ratio: 16/9` (et `16/10` si `.is-featured`)
- `background: #050507, border-radius: 6px, overflow: hidden, margin-bottom: 14px, position: relative`
- **Pseudo `::before`** qui couvre toute la zone : `background: linear-gradient(135deg, rgba(34,53,109,.85), rgba(12,14,20,.95))` — c'est l'overlay BLEU profond signature des cantiques. Pas de vraie image dans le wireframe, mais en hi-fi on peut mettre une photo derrière (le gradient reste par-dessus).
- **Bouton play** centré : `48px` rond blanc avec ▶ noir (`64px` si `.is-featured`).
- **Tag famille** en bas-gauche : `position: absolute, bottom: 12px, left: 12px, font-family: --f-body, font-size: 10.5px, letter-spacing: .22em, uppercase, color: rgba(255,255,255,.92), padding: 4px 10px, background: rgba(255,255,255,.12), border: 1px solid rgba(255,255,255,.4)` — pas de border-radius, c'est un rectangle.

**Corps** (`.cant-body`) :
- `<h3>` : `font-family: --f-serif, font-weight: 500, font-size: 18px, line-height: 1.25, color: --ink, margin: 0 0 4px` (taille `26px` si `.is-featured`).
- `.cant-meta` : `font-family: --f-body, font-size: 12px, color: --ink-2, letter-spacing: .02em, margin-bottom: 8px`.
- `.cant-foot` : flex `justify-content: space-between, align-items: baseline, font-family: --f-num (Bodoni), font-size: 11px, color: --ink-3, letter-spacing: .04em, border-top: 1px solid rgba(12,14,20,.12), padding-top: 8px`.

**Carte vedette** (`.cant-card.is-featured`) :
- `grid-column: span 2; grid-row: span 2;` (occupe un carré 2×2 dans la grille de 4 colonnes)
- thumb en `aspect-ratio: 16/10` (légèrement plus haute), play-btn `64×64`, h3 en `26px`
- Inclut une `cant-date` dans le footer (« Enregistré · 13 . 04 . 2026 »)

**Données wireframe — à reprendre tel quel** (8 cartes dans cet ordre) :

| Pos | Famille | Titre | Méta | № | Featured |
|---|---|---|---|---|---|
| 1 | Composé ici | **L'Éternel est ma lumière** | Chœur RST · dirigé par fr. Jules Kayembe | 47 | ★ + date 13 . 04 . 2026 |
| 2 | Du Message | Seul l'Agneau est digne | Soliste · sœur Lumumba | 12 | |
| 3 | Du recueil | Près de Toi, Seigneur | Chœur RST | 309 | |
| 4 | Du Message | L'Aigle volera | Chœur RST · arrangement libre | 28 | |
| 5 | Composé ici | Sur le Roc je tiens | Composé par fr. Jules Kayembe · 2024 | 41 | |
| 6 | Du recueil | À Toi la gloire | Assemblée · culte du dimanche | 211 | |
| 7 | Du recueil | Plus près de Toi mon Dieu | Soliste · sœur Esther Ndaye | 175 | |
| 8 | Du Message | Au pied de la Croix | Chœur RST | 19 | |

---

### 4.4 Fiche détaillée d'un cantique (`<section class="cant-detail">`)

**Affichée sous la grille dans le wireframe** (état preview de la fiche ouverte). En hi-fi, on peut soit :
- Afficher cette fiche en remplacement de la grille (route dédiée `/cantiques/47-l-eternel-est-ma-lumiere`), OU
- Afficher en panneau ouvert sous la grille (état actuel du wireframe).

**Padding** : `60px 32px 80px`. Bordure haute : `1.5px solid var(--ink)`.

#### a. Méta (`<div class="detail-meta">`)
Flex `justify-content: space-between, align-items: center, margin-bottom: 18px, flex-wrap: wrap, gap: 12px` :
- Lien retour `<a class="back-link">` : « ← Retour à l'hymnaire »
  `font-family: --f-body, font-size: 12px, letter-spacing: .14em, uppercase, color: --ink-2, text-decoration: none`. Hover → `--ink`.
- Tag famille + № `<span class="detail-tag">` : « Composé ici · № 47 »
  `font-family: --f-body, font-size: 11px, letter-spacing: .22em, uppercase, color: --ink-3`.

#### b. Titre (`<h2 class="detail-title">`)
« L'Éternel est [BR] *ma lumière.* » (2e ligne italique gris-encre 2)
`font-family: --f-serif, font-weight: 500, font-size: clamp(40px, 5vw, 56px), line-height: 1.04, letter-spacing: -0.01em, margin: 0 0 12px, color: --ink`

#### c. Sous-titre (`<div class="detail-by">`)
« Composé et dirigé par fr. Jules Kayembe · enregistré le 13 . 04 . 2026 · Chœur RST »
`font-family: --f-body, font-size: 13px, color: --ink-2, letter-spacing: .02em, margin-bottom: 36px`

#### d. Grid 2 colonnes (`<div class="detail-grid">`)
`grid-template-columns: 1.1fr 1fr, gap: 48px, align-items: start`. Vidéo à gauche, paroles à droite.

##### d.1. Vidéo (`<div class="detail-video">`)

```html
<div class="detail-video">
  <div class="video-poster">
    <div class="play-btn" aria-hidden="true">▶</div>
  </div>
  <div class="video-meta">5MIN 42 · enregistrement studio</div>
</div>
```

`.video-poster` :
- `aspect-ratio: 16/9, background: linear-gradient(135deg, rgba(34,53,109,.9), rgba(12,14,20,.95)), border-radius: 6px, overflow: hidden, margin-bottom: 10px, position: relative`
- Bouton play centré : **72×72**, blanc 95%, ▶ noir, `font-size: 24px, padding-left: 4px`.

`.video-meta` :
`font-family: --f-body, font-size: 11px, letter-spacing: .18em, uppercase, color: --ink-3`

##### d.2. Paroles (`<div class="detail-lyrics">`)

Conteneur :
`border: 1px solid rgba(12,14,20,.15), background: --paper-2, padding: 24px 28px`

###### Toolbar (`<div class="lyric-toolbar">`)
Flex `justify-content: space-between, align-items: center, padding-bottom: 12px, margin-bottom: 18px, border-bottom: 1px solid rgba(12,14,20,.15)`.

- À gauche : `<span class="lyr-lbl">Paroles</span>`
  `font-family: --f-body, font-size: 11px, letter-spacing: .26em, uppercase, color: --ink-3`
- À droite (`<div class="lyr-tools">`) : `display: inline-flex, align-items: center, gap: 6px`.
  - 3 contrôles taille : `<a class="lyr-tool">A−</a>`, `<a class="lyr-tool active">A</a>`, `<a class="lyr-tool">A+</a>`
  - Séparateur `<span class="div"></span>` : `width: 1px, height: 14px, background: rgba(12,14,20,.2), margin: 0 4px`
  - Lien PDF : `<a class="lyr-tool">↓ PDF</a>`

Style `.lyr-tool` :
`font-family: --f-body, font-size: 11px, color: --ink-2, text-decoration: none, padding: 4px 8px, border-radius: 3px`
`.lyr-tool.active` → `background: --ink, color: --paper`

###### Corps des paroles (`<div class="lyric-body">`)

Suite de `<div class="verse-block">` (et `.refrain` pour les refrains) :

```html
<div class="verse-block">
  <span class="verse-num">1</span>
  <p>Ligne 1<br/>Ligne 2<br/>Ligne 3<br/>Ligne 4</p>
</div>

<div class="verse-block refrain">
  <span class="verse-num">℟</span>      <!-- caractère unicode "response" -->
  <p>Ligne refrain 1<br/>Ligne refrain 2<br/>...</p>
</div>
```

Style `.verse-block` :
`display: grid, grid-template-columns: 32px 1fr, gap: 14px, margin-bottom: 18px`

`.verse-num` :
`font-family: --f-serif, font-style: italic, font-size: 18px, color: --accent (ROUGE), text-align: right, padding-top: 2px`

`.verse-block p` :
`font-family: --f-serif, font-size: 17px, line-height: 1.65, color: --ink, margin: 0`

**Refrain** (`.verse-block.refrain`) :
- Le `<p>` : `font-style: italic, color: --ink-2, border-left: 2px solid --ink-3, padding-left: 14px`
- Le `.verse-num` : passe en `font-style: normal, color: --ink-3` (le ℟ devient gris droit, pas rouge italique)

**Contenu wireframe** (5 blocs : 1, ℟, 2, ℟, 3) — à reprendre :

> **1** L'Éternel est ma lumière et mon salut, / De qui aurais-je crainte ? / L'Éternel est le rempart de ma vie, / De qui aurais-je peur ?
>
> **℟** Une chose, je la demande à l'Éternel, / Je la recherche : habiter dans Sa maison, / Tous les jours de ma vie.
>
> **2** Quand des méchants s'avancent contre moi, / Pour dévorer ma chair, / Ce sont eux, mes adversaires et mes ennemis, / Qui chancellent et tombent.
>
> **℟** *(même refrain)*
>
> **3** Espère en l'Éternel, / Fortifie-toi et que ton cœur s'affermisse, / Espère en l'Éternel.

Sauts de ligne avec `<br/>` à l'intérieur d'un seul `<p>` par bloc.

---

## 5. Comportements (JavaScript)

### 5.1 Onglets familles
Click sur `.fam[data-fam]` :
- Toggle `.is-active` parmi les 4 boutons
- Filtre les `.cant-card` visibles selon la valeur de `data-fam` (en hi-fi). Dans le wireframe, c'est purement visuel.

### 5.2 Recherche
Branchement backend (autocomplete fuzzy sur titre, paroles, № en hi-fi).

### 5.3 Click sur une carte de la grille
Ouvre la fiche détaillée (`.cant-detail`) :
- Hi-fi option A : route `/cantiques/<id>` avec retour via `.back-link`
- Hi-fi option B : scroll vers `.cant-detail` qui se met à jour avec les données de la carte cliquée

### 5.4 Toolbar paroles
- Click sur `A−` / `A` / `A+` : applique une classe globale au `.lyric-body` qui change la `font-size` des `<p>` (ex. 15px / 17px / 19px). Toggle `.active` sur le bouton cliqué.
- Click sur `↓ PDF` : génère/télécharge le PDF des paroles seules.

### 5.5 Click sur le poster vidéo
Remplace le poster par le lecteur réel (YouTube embed, Cloudinary, ou `<video>` HTML5).

---

## 6. Schéma de données suggéré

```ts
type Hymn = {
  id: string;                        // 'hymn-47'
  number: number;                    // 47
  family: 'recueil' | 'message' | 'composes';
  familyLabel: 'Du recueil' | 'Du Message' | 'Composé ici';
  title: string;                     // "L'Éternel est ma lumière"
  titleEm?: string;                  // partie italique 2e ligne (optionnel)
  performers: string;                // "Chœur RST · dirigé par fr. Jules Kayembe"
  composer?: string;                 // pour "Composé ici"
  recordedAt?: string;               // ISO date pour featured
  duration: string;                  // "5MIN 42"
  recordingType: 'studio' | 'culte' | 'live';
  videoUrl: string;
  pdfUrl: string;
  isFeatured?: boolean;              // une seule à la fois en page
  lyrics: Array<{
    type: 'verse' | 'refrain';
    label: string;                   // '1', '2', '℟'
    lines: string[];                 // chaque ligne séparée
  }>;
};

type FamilyCount = {
  family: 'tous' | 'recueil' | 'message' | 'composes';
  label: string;                     // "Tous · 84"
  count: number;
};
```

---

## 7. HTML de référence — à recopier _verbatim_

```html
<div class="ctx-view" data-ctx-view="cantiques">

  <!-- 4.1 HERO -->
  <section class="cant-hero anchored">
    <div class="cant-hero-inner">
      <div class="eyebrow">L'hymnaire</div>
      <h1>Les chants<br/><em>de l'assemblée.</em></h1>
      <p class="lede">Les cantiques sont la voix de Roc Séculaire. Ceux du recueil, ceux du Message, ceux qui sont nés ici. Trois familles, un seul hymnaire.</p>
    </div>
  </section>

  <!-- 4.2 FAMILY TABS + SEARCH -->
  <section class="cant-families anchored">
    <div class="fam-tabs" role="tablist">
      <button class="fam is-active" data-fam="tous">Tous · 84</button>
      <button class="fam" data-fam="recueil">Du recueil · 62</button>
      <button class="fam" data-fam="message">Du Message · 14</button>
      <button class="fam" data-fam="composes">Composés ici · 8</button>
    </div>
    <div class="fam-search">
      <span class="search-icon" aria-hidden="true">⌕</span>
      <input type="text" placeholder="Rechercher un cantique" />
    </div>
  </section>

  <!-- 4.3 GRID -->
  <section class="cant-grid anchored">
    <article class="cant-card is-featured">
      <div class="cant-thumb">
        <div class="play-btn" aria-hidden="true">▶</div>
        <span class="fam-tag">Composé ici</span>
      </div>
      <div class="cant-body">
        <h3>L'Éternel est ma lumière</h3>
        <div class="cant-meta">Chœur RST · dirigé par fr. Jules Kayembe</div>
        <div class="cant-foot">
          <span class="cant-num">№ 47</span>
          <span class="cant-date">Enregistré · 13 . 04 . 2026</span>
        </div>
      </div>
    </article>
    <article class="cant-card">
      <div class="cant-thumb"><div class="play-btn" aria-hidden="true">▶</div><span class="fam-tag">Du Message</span></div>
      <div class="cant-body">
        <h3>Seul l'Agneau est digne</h3>
        <div class="cant-meta">Soliste · sœur Lumumba</div>
        <div class="cant-foot"><span class="cant-num">№ 12</span></div>
      </div>
    </article>
    <article class="cant-card">
      <div class="cant-thumb"><div class="play-btn" aria-hidden="true">▶</div><span class="fam-tag">Du recueil</span></div>
      <div class="cant-body">
        <h3>Près de Toi, Seigneur</h3>
        <div class="cant-meta">Chœur RST</div>
        <div class="cant-foot"><span class="cant-num">№ 309</span></div>
      </div>
    </article>
    <article class="cant-card">
      <div class="cant-thumb"><div class="play-btn" aria-hidden="true">▶</div><span class="fam-tag">Du Message</span></div>
      <div class="cant-body">
        <h3>L'Aigle volera</h3>
        <div class="cant-meta">Chœur RST · arrangement libre</div>
        <div class="cant-foot"><span class="cant-num">№ 28</span></div>
      </div>
    </article>
    <article class="cant-card">
      <div class="cant-thumb"><div class="play-btn" aria-hidden="true">▶</div><span class="fam-tag">Composé ici</span></div>
      <div class="cant-body">
        <h3>Sur le Roc je tiens</h3>
        <div class="cant-meta">Composé par fr. Jules Kayembe · 2024</div>
        <div class="cant-foot"><span class="cant-num">№ 41</span></div>
      </div>
    </article>
    <article class="cant-card">
      <div class="cant-thumb"><div class="play-btn" aria-hidden="true">▶</div><span class="fam-tag">Du recueil</span></div>
      <div class="cant-body">
        <h3>À Toi la gloire</h3>
        <div class="cant-meta">Assemblée · culte du dimanche</div>
        <div class="cant-foot"><span class="cant-num">№ 211</span></div>
      </div>
    </article>
    <article class="cant-card">
      <div class="cant-thumb"><div class="play-btn" aria-hidden="true">▶</div><span class="fam-tag">Du recueil</span></div>
      <div class="cant-body">
        <h3>Plus près de Toi mon Dieu</h3>
        <div class="cant-meta">Soliste · sœur Esther Ndaye</div>
        <div class="cant-foot"><span class="cant-num">№ 175</span></div>
      </div>
    </article>
    <article class="cant-card">
      <div class="cant-thumb"><div class="play-btn" aria-hidden="true">▶</div><span class="fam-tag">Du Message</span></div>
      <div class="cant-body">
        <h3>Au pied de la Croix</h3>
        <div class="cant-meta">Chœur RST</div>
        <div class="cant-foot"><span class="cant-num">№ 19</span></div>
      </div>
    </article>
  </section>

  <!-- 4.4 DETAIL -->
  <section class="cant-detail anchored">
    <div class="detail-meta">
      <a href="#" class="back-link">← Retour à l'hymnaire</a>
      <span class="detail-tag">Composé ici · № 47</span>
    </div>
    <h2 class="detail-title">L'Éternel est<br/><em>ma lumière.</em></h2>
    <div class="detail-by">Composé et dirigé par fr. Jules Kayembe · enregistré le 13 . 04 . 2026 · Chœur RST</div>

    <div class="detail-grid">
      <div class="detail-video">
        <div class="video-poster">
          <div class="play-btn" aria-hidden="true">▶</div>
        </div>
        <div class="video-meta">5MIN 42 · enregistrement studio</div>
      </div>

      <div class="detail-lyrics">
        <div class="lyric-toolbar">
          <span class="lyr-lbl">Paroles</span>
          <div class="lyr-tools">
            <a href="#" class="lyr-tool">A−</a>
            <a href="#" class="lyr-tool active">A</a>
            <a href="#" class="lyr-tool">A+</a>
            <span class="div"></span>
            <a href="#" class="lyr-tool">↓ PDF</a>
          </div>
        </div>
        <div class="lyric-body">
          <div class="verse-block">
            <span class="verse-num">1</span>
            <p>L'Éternel est ma lumière et mon salut,<br/>De qui aurais-je crainte ?<br/>L'Éternel est le rempart de ma vie,<br/>De qui aurais-je peur ?</p>
          </div>
          <div class="verse-block refrain">
            <span class="verse-num">℟</span>
            <p>Une chose, je la demande à l'Éternel,<br/>Je la recherche : habiter dans Sa maison,<br/>Tous les jours de ma vie.</p>
          </div>
          <div class="verse-block">
            <span class="verse-num">2</span>
            <p>Quand des méchants s'avancent contre moi,<br/>Pour dévorer ma chair,<br/>Ce sont eux, mes adversaires et mes ennemis,<br/>Qui chancellent et tombent.</p>
          </div>
          <div class="verse-block refrain">
            <span class="verse-num">℟</span>
            <p>Une chose, je la demande à l'Éternel,<br/>Je la recherche : habiter dans Sa maison,<br/>Tous les jours de ma vie.</p>
          </div>
          <div class="verse-block">
            <span class="verse-num">3</span>
            <p>Espère en l'Éternel,<br/>Fortifie-toi et que ton cœur s'affermisse,<br/>Espère en l'Éternel.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

</div>
```

---

## 8. CSS de référence — à recopier _verbatim_

> Sélecteurs scopés sous `#page-eglise` dans le projet. Si tu reproduis dans un composant isolé, remplace par la racine du composant ou retire le préfixe.

```css
/* ====== HERO partagé (mêmes règles que cultes-hero) ===== */
.cant-hero {
  max-width: 1280px; margin: 0 auto;
  padding: 60px 32px 40px;
  border-bottom: 1.5px solid var(--ink);
  position: relative;
}
.cant-hero-inner { max-width: 760px; }
.cant-hero h1 {
  font-family: var(--f-serif); font-weight: 500;
  font-size: clamp(40px, 5.4vw, 64px);
  line-height: 1.04; letter-spacing: -0.01em;
  margin: 14px 0 18px;
  color: var(--ink);
  text-wrap: pretty;
}
.cant-hero h1 em { font-style: italic; color: var(--ink-2); }
.cant-hero .lede {
  font-family: var(--f-serif);
  font-size: 19px; line-height: 1.55;
  color: var(--ink-2);
  max-width: 620px;
  margin: 0;
}

/* ====== 04b CANTIQUES ======================================= */

/* Family tabs + search bar */
.cant-families {
  max-width: 1280px; margin: 0 auto;
  padding: 22px 32px;
  border-bottom: 1px solid rgba(12,14,20,.15);
  display: flex; align-items: center; gap: 32px;
  flex-wrap: wrap;
}
.fam-tabs {
  display: flex; gap: 6px; flex-wrap: wrap;
}
.fam {
  background: transparent;
  font-family: var(--f-body); font-size: 12px;
  letter-spacing: .04em;
  color: var(--ink-2);
  padding: 8px 14px;
  border: 1px solid rgba(12,14,20,.2);
  border-radius: 999px;
  cursor: pointer;
  transition: all .15s;
}
.fam:hover { border-color: var(--ink); color: var(--ink); }
.fam.is-active {
  background: var(--ink); color: var(--paper);
  border-color: var(--ink);
}
.fam-search {
  flex: 1; min-width: 220px;
  margin-left: auto;
  display: inline-flex; align-items: center; gap: 8px;
  border-bottom: 1px solid rgba(12,14,20,.25);
  padding: 6px 4px;
}
.fam-search .search-icon { color: var(--ink-3); font-size: 16px; }
.fam-search input {
  flex: 1; border: 0; background: transparent;
  font-family: var(--f-body); font-size: 13px; color: var(--ink); outline: none;
}
.fam-search input::placeholder { color: var(--ink-3); }

/* Cantique grid */
.cant-grid {
  max-width: 1280px; margin: 0 auto;
  padding: 48px 32px 70px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px 24px;
}
.cant-card {
  display: block;
  cursor: pointer;
}
.cant-card.is-featured { grid-column: span 2; grid-row: span 2; }

.cant-thumb {
  aspect-ratio: 16/9;
  background: #050507;
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 14px;
}
.cant-card.is-featured .cant-thumb { aspect-ratio: 16/10; }
.cant-thumb::before {
  content: "";
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(34,53,109,.85), rgba(12,14,20,.95));
}
.cant-thumb .play-btn {
  position: absolute; inset: 0; margin: auto;
  width: 48px; height: 48px;
  border-radius: 50%;
  background: rgba(255,255,255,.95); color: #050507;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; padding-left: 3px;
  z-index: 2;
}
.cant-card.is-featured .cant-thumb .play-btn {
  width: 64px; height: 64px; font-size: 22px;
}
.cant-thumb .fam-tag {
  position: absolute; bottom: 12px; left: 12px;
  font-family: var(--f-body); font-size: 10.5px;
  letter-spacing: .22em; text-transform: uppercase;
  color: rgba(255,255,255,.92);
  z-index: 2;
  padding: 4px 10px;
  background: rgba(255,255,255,.12);
  border: 1px solid rgba(255,255,255,.4);
}

.cant-body h3 {
  font-family: var(--f-serif); font-weight: 500;
  font-size: 18px; line-height: 1.25;
  color: var(--ink); margin: 0 0 4px;
}
.cant-card.is-featured .cant-body h3 { font-size: 26px; }

.cant-meta {
  font-family: var(--f-body); font-size: 12px;
  color: var(--ink-2); letter-spacing: .02em;
  margin-bottom: 8px;
}
.cant-foot {
  display: flex; justify-content: space-between; align-items: baseline;
  font-family: var(--f-num); font-size: 11px;
  color: var(--ink-3); letter-spacing: .04em;
  border-top: 1px solid rgba(12,14,20,.12);
  padding-top: 8px;
}

/* Cantique detail */
.cant-detail {
  max-width: 1280px; margin: 0 auto;
  padding: 60px 32px 80px;
  border-top: 1.5px solid var(--ink);
  position: relative;
}
.detail-meta {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 18px;
  flex-wrap: wrap; gap: 12px;
}
.back-link {
  font-family: var(--f-body); font-size: 12px;
  letter-spacing: .14em; text-transform: uppercase;
  color: var(--ink-2);
  text-decoration: none;
}
.back-link:hover { color: var(--ink); }
.detail-tag {
  font-family: var(--f-body); font-size: 11px;
  letter-spacing: .22em; text-transform: uppercase;
  color: var(--ink-3);
}
.detail-title {
  font-family: var(--f-serif); font-weight: 500;
  font-size: clamp(40px, 5vw, 56px);
  line-height: 1.04; letter-spacing: -0.01em;
  margin: 0 0 12px;
  color: var(--ink);
}
.detail-title em { font-style: italic; color: var(--ink-2); }
.detail-by {
  font-family: var(--f-body); font-size: 13px;
  color: var(--ink-2); letter-spacing: .02em;
  margin-bottom: 36px;
}
.detail-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 48px;
  align-items: start;
}

/* Detail video */
.detail-video .video-poster {
  aspect-ratio: 16/9;
  background: linear-gradient(135deg, rgba(34,53,109,.9), rgba(12,14,20,.95));
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 10px;
}
.detail-video .play-btn {
  position: absolute; inset: 0; margin: auto;
  width: 72px; height: 72px;
  border-radius: 50%;
  background: rgba(255,255,255,.95); color: #050507;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; padding-left: 4px;
}
.detail-video .video-meta {
  font-family: var(--f-body); font-size: 11px;
  letter-spacing: .18em; text-transform: uppercase;
  color: var(--ink-3);
}

/* Lyrics */
.detail-lyrics {
  border: 1px solid rgba(12,14,20,.15);
  background: var(--paper-2);
  padding: 24px 28px;
}
.lyric-toolbar {
  display: flex; justify-content: space-between; align-items: center;
  padding-bottom: 12px;
  margin-bottom: 18px;
  border-bottom: 1px solid rgba(12,14,20,.15);
}
.lyr-lbl {
  font-family: var(--f-body); font-size: 11px;
  letter-spacing: .26em; text-transform: uppercase;
  color: var(--ink-3);
}
.lyr-tools {
  display: inline-flex; align-items: center; gap: 6px;
}
.lyr-tool {
  font-family: var(--f-body); font-size: 11px;
  color: var(--ink-2);
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 3px;
}
.lyr-tool.active { background: var(--ink); color: var(--paper); }
.lyr-tools .div {
  width: 1px; height: 14px;
  background: rgba(12,14,20,.2);
  margin: 0 4px;
}

.verse-block {
  display: grid;
  grid-template-columns: 32px 1fr;
  gap: 14px;
  margin-bottom: 18px;
}
.verse-num {
  font-family: var(--f-serif); font-style: italic;
  font-size: 18px;
  color: var(--accent);
  text-align: right;
  padding-top: 2px;
}
.verse-block p {
  font-family: var(--f-serif);
  font-size: 17px; line-height: 1.65;
  color: var(--ink);
  margin: 0;
}
.verse-block.refrain p {
  font-style: italic;
  color: var(--ink-2);
  border-left: 2px solid var(--ink-3);
  padding-left: 14px;
}
.verse-block.refrain .verse-num {
  font-style: normal;
  color: var(--ink-3);
}
```

### Mobile (≤ 820px)

```css
@media (max-width: 820px) {
  .cant-hero { padding: 40px 22px 28px; }

  .cant-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 22px 16px;
    padding: 32px 22px 50px;
  }
  .cant-card.is-featured {
    grid-column: span 2; grid-row: span 1;
  }

  .detail-grid {
    grid-template-columns: 1fr; gap: 28px;
  }
  .cant-detail { padding: 40px 22px 60px; }
}
```

---

## 9. Hi-fi : ce qui change par rapport au wireframe

| Élément | Wireframe | Hi-fi cible |
|---|---|---|
| Vignette `cant-thumb` | Gradient bleu seul (rgba 34,53,109 → ink) | Vraie image (capture vidéo, photo du chœur) **derrière** le gradient (le gradient garde sa transparence, l'image transparaît à 15-50%) |
| Bouton play | CSS rond ▶ | Click déclenche le lecteur réel (YouTube embed, ou `<video>` HTML5) |
| `cant-grid` | 8 cards hardcodées | Liste paginée depuis backend, infinite scroll ou pagination en bas |
| Familles · counts | Hardcodés (84/62/14/8) | Calculés depuis le backend |
| Recherche | Input vide | Autocomplete fuzzy (titre, paroles, №) |
| Toolbar A−/A/A+ | Visuel only | Branchée à un `<style>` ou classe sur `.lyric-body` qui change `font-size` (ex. 15/17/19px) |
| ↓ PDF | Lien `#` | Génération PDF (server-side ou client) avec en-tête № + titre + paroles versifiées |
| Detail | Affichée sous la grille en preview | Soit route dédiée `/cantiques/<id>`, soit panneau qui se met à jour au click sur une carte |

**À NE PAS faire en hi-fi** :
- Lecteur audio sticky en bas d'écran (mini-player)
- Karaoké défilant ou highlight synchronisé sur les paroles
- Notation (étoiles, likes, partages avec compteurs)
- Recommandations « cantiques similaires »
- Autoplay au scroll
- Changer la sémantique du gradient bleu — c'est la signature visuelle de la sous-page Cantiques (différence claire avec Cultes qui montre des photos filtrées)
- Mettre des photos d'artistes/biographies — l'hymnaire est centré sur **l'œuvre**, pas sur les interprètes

---

## 10. Checklist de validation

- [ ] Hero : eyebrow « L'hymnaire » + titre 2 lignes (italique 2e) + lede (pas de ref biblique, pas de blockquote Branham)
- [ ] Onglets familles : 4 boutons pillules (Tous · 84, Du recueil · 62, Du Message · 14, Composés ici · 8), 1er actif noir
- [ ] Recherche à droite avec icône loupe + placeholder « Rechercher un cantique »
- [ ] Grid 4 colonnes égales, gap 28×24
- [ ] Première carte `.is-featured` : occupe 2×2, thumb 16/10, play 64px, h3 à 26px, footer avec № + date d'enregistrement
- [ ] 7 cartes standards : thumb 16/9, play 48px, h3 à 18px
- [ ] Toutes les vignettes ont l'overlay gradient BLEU (rgba 34,53,109 .85 → rgba 12,14,20 .95) à 135deg
- [ ] Tag famille (`.fam-tag`) en bas-gauche de chaque vignette : blanc semi-transparent + bordure blanche, pas de border-radius
- [ ] Footer de carte : `.cant-num` à gauche en Bodoni, séparateur 1px en haut
- [ ] Section detail séparée par filet noir 1.5px en haut
- [ ] Detail meta : `← Retour à l'hymnaire` à gauche, tag famille · № à droite
- [ ] Detail title 2 lignes (italique 2e), sous-titre prédicateur/compositeur
- [ ] Grid `1.1fr 1fr` : vidéo gauche / paroles droite, gap 48px
- [ ] Vidéo detail : poster 16/9 avec gradient bleu, play-btn 72×72
- [ ] Paroles : box `--paper-2` border 1px, padding 24×28
- [ ] Toolbar paroles : « Paroles » uppercase à gauche, A− / A / A+ / | / ↓ PDF à droite. Bouton « A » actif en fond noir, texte paper
- [ ] Versets : grid 32px / 1fr, № rouge italique 18px à droite (`text-align: right`)
- [ ] Refrains : `<p>` italique gris-encre 2 + filet gauche `--ink-3` 2px ; ℟ en gris droit (pas rouge italique)
- [ ] 5 blocs visibles : 1, ℟, 2, ℟, 3
- [ ] Mobile ≤820px : grille 2 colonnes (featured passe à span 2 / span 1), detail-grid en 1 colonne
- [ ] Aucun footer, aucune nav, aucun élément en dehors du `<div class="ctx-view" data-ctx-view="cantiques">`

---

**Fin du PRD Cantiques.**
À utiliser conjointement avec le `PRD.md` global et le `PRD-CULTES.md`.
