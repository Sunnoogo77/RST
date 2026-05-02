# PRD — Sous-page **Témoignages** (04d) · RST Front Pages

> Document de référence à donner à Claude Code en complément du `PRD.md` global et des PRD précédents (`PRD-CULTES.md`, `PRD-CANTIQUES.md`, `PRD-ANNONCES.md`).
> **Objectif** : reproduire à l'identique la sous-page « Témoignages » (onglet contextuel de la page 04 — L'Église / Actualité). Pas le footer, pas la nav, pas l'en-tête : **uniquement le contenu de la sous-page Témoignages** (du hero jusqu'à la fin de la page détail).
> Mise en hi-fi : remplacer `assets/sanctuary.jpeg` et `assets/wmb-portrait.jpeg` par de vraies photos de témoins (avec consentement écrit), brancher le formulaire « Partager mon témoignage » au secrétariat, alimenter la mosaïque par les vrais témoignages saisis. **L'architecture, les espacements, la typographie, les couleurs et la composition ne changent pas.**

---

## 0. Localisation dans l'app

```
Page 04 — L'Église / Actualité
└── ctx-nav (sous-onglets contextuels)
    ├── Cette semaine
    ├── Cultes              (cf. PRD-CULTES.md)
    ├── Cantiques           (cf. PRD-CANTIQUES.md)
    ├── Annonces            (cf. PRD-ANNONCES.md)
    └── Témoignages         ← ★ CETTE PRD
```

Conteneur d'affichage :

```html
<div class="ctx-view" data-ctx-view="temoignages">
  ...contenu de la sous-page...
</div>
```

---

## 1. Intention de la page

C'est **un mur narratif pastoral**, pas une page d'avis (pas Trustpilot, pas Google Reviews).

| À faire | À NE PAS faire |
|---|---|
| Présenter des **récits** : courts (citations) ou longs (récits avec image), nommés ou anonymes | Notation par étoiles, scores, classement |
| **Mosaïque asymétrique** (grille 6 colonnes avec spans variables) — chaque témoignage a son poids visuel propre | Grille uniforme « cards à reviews » de e-commerce |
| Citations courtes en encadrés `--paper-2` avec gros guillemet `"` typographique | Vignettes d'avatars circulaires + nom complet + lieu détaillé |
| Récits illustrés avec photo en haut + corps en bas (carte blanche bordée) | Photos de profil rondes, badges « vérifié » |
| Une page **détail** (récit long) en colonne unique 760px serif, sobre — la plus longue forme du site | Lecture suggérée, « autres témoignages », recommandations |
| Bloc CTA discret « + Partager mon témoignage » + compteur sobre « 94 témoignages · depuis 1999 » | Boutons « Donner mon avis ! » avec étoiles |
| Pull-quote dans le détail avec filet rouge gauche (le seul accent rouge fort de la page) | Multiples couleurs, encarts colorés |

Utilisateur cible : un membre ou un visiteur qui veut **comprendre ce que Dieu a fait dans cette assemblée** à travers des récits réels — sans tomber dans le marketing religieux ou la performance émotionnelle.

---

## 2. Structure de la page (de haut en bas)

```
┌─────────────────────────────────────────────────────────────┐
│ HERO (tem-hero)                                             │
│   eyebrow · h1 (titre 2 lignes) · lede                      │
├─────────────────────────────────────────────────────────────┤
│ ACTIONS (tem-actions)                                       │
│   [+ Partager mon témoignage]    94 témoignages · depuis 1999│
├─────────────────────────────────────────────────────────────┤
│ MOSAIC (tem-mosaic)  — grille 6 colonnes asymétrique        │
│ ┌─────────┬───────────────────────────────────────┐         │
│ │ q1 (×2) │ i1 illustré récit (×4 col × 2 lignes) │         │
│ ├─────────┤                                       │         │
│ │q2 ROUGE │                                       │         │
│ │  (×2)   │                                       │         │
│ ├─────────┴───────────────────┬───────────────────┤         │
│ │ s1 récit moyen (×3)         │ q3 cit (×3)       │         │
│ ├─────────────────────────────┴───────┬───────────┤         │
│ │ i2 illustré récit (×4 col × 2 lig)  │ s2 (×2)   │         │
│ │                                     ├───────────┤         │
│ │                                     │ q4 (×2)   │         │
│ └─────────────────────────────────────┴───────────┘         │
├─────────────────────────────────────────────────────────────┤
│ DETAIL (tem-detail)  — récit long, max-width 760px          │
│   ← Retour aux témoignages   |  Récit · 14.03.2026 · 7 min  │
│   ───────────────────────────────                           │
│   H2 (titre du récit, 2 lignes italique)                    │
│   par-ligne (frère R. · 41 ans · baptisé...)                │
│   ───────────────────────────────                           │
│                                                             │
│   .tem-lede (paragraphe d'ouverture, 22px)                  │
│   p · p · p · p (corps en serif 18px)                       │
│   .tem-q-pull (pull-quote, filet rouge gauche)              │
│   p · p ...                                                 │
│                                                             │
│   ┌──────────────────────────────────┐                      │
│   │ VERSET CITÉ DANS CE RÉCIT        │                      │
│   │ Matthieu 7.24 — « ... »          │                      │
│   └──────────────────────────────────┘                      │
└─────────────────────────────────────────────────────────────┘
```

**Containers max-width** :
- Hero, Actions, Mosaic : `1280px` (marges latérales 32px)
- Detail : `760px` (marges latérales 32px) — colonne lecture

---

## 3. Tokens de design (rappel + sémantique spécifique)

```css
--paper      : #FAF7F0
--paper-2    : #F4F1EA   /* fond des citations courtes (tem-quote) et de l'encart "Verset cité" */
--ink        : #0C0E14
--ink-2      : #2A2D38
--ink-3      : #6B6E7A
--accent     : #A62020   /* ROUGE — filet gauche d'UNE seule citation (.accent-blue / paradoxalement nommée) + pull-quote .tem-q-pull dans le détail */
--note       : #15364B   /* BLEU — peu utilisé sur cette page (annotation secondaire seulement) */

--f-serif    : 'Cormorant Garamond', serif    /* h1, h2, h3, q (citation), p du détail (corpus narratif), tem-lede, pull-quote, m-val, glyph » */
--f-body     : 'Inter', system-ui, sans-serif /* eyebrow, cite, tag, label, counter, back-link */
```

**Hiérarchie typographique de la page** (CRITIQUE — c'est le contraste qui porte le ton pastoral) :

| Élément | Famille | Taille | Style |
|---|---|---|---|
| h1 hero | serif | clamp(40, 5.4vw, 64px) | regular 500, italique sur 2e ligne |
| h2 détail | serif | clamp(36, 4.4vw, 52px) | regular 500, italique sur 2e ligne |
| h3 (récits mosaïque) | serif | 22px | regular 500 |
| `.tem-lede` détail | serif | 22px | regular |
| `p` détail | serif | 18px | regular line-height 1.7 (corps narratif) |
| `q` citation | serif | 18px | regular line-height 1.45 |
| `.tem-q-pull` | serif | 24px | italique, line-height 1.4 |
| `.tem-glyph` (« ") | serif | 64px | regular |
| `.tem-foot-ref` | serif | 16px | italique |
| `cite`, eyebrow, tags | Inter | 11px | uppercase, letter-spacing .18-.22em |
| `back-link` | Inter | 12px | uppercase, letter-spacing .14em |

**Le contraste de tailles entre serif (récits) et Inter (méta) doit être fort** — c'est la signature éditoriale.

---

## 4. Section par section — spécifications

### 4.1 Hero (`<section class="tem-hero">`)

Mêmes règles partagées que `cultes-hero` / `cant-hero` / `ann-hero` (cf. PRD précédentes) :
`max-width: 1280px, padding: 60px 32px 40px, border-bottom: 1.5px solid --ink`. Inner `max-width: 760px`.

Composition :
1. **Eyebrow** — « Mur des témoignages » (`--f-body`, 11px, .22em, uppercase, `--ink-3`)
2. **H1** — « Ce que Dieu [BR] *a fait parmi nous.* » (italique gris-encre 2 sur la 2e ligne) — `--f-serif`, 500, `clamp(40px, 5.4vw, 64px)`, line-height 1.04
3. **Lede** — « Pas de notes. Pas d'étoiles. Juste des récits — courts ou longs, anonymes ou nommés. Le témoignage est un récit pastoral, pas une recommandation. » (`--f-serif`, 19px, line-height 1.55, `--ink-2`, max-width 620px)

> ⚠️ **Important** : la formule « Pas de notes. Pas d'étoiles. » est un parti-pris explicite. Ne pas la lisser en hi-fi — c'est la déclaration d'intention de la page.

---

### 4.2 Actions (`<section class="tem-actions">`)

`padding: 24px 32px, max-width: 1280px, display: flex, align-items: center, justify-content: space-between, border-bottom: 1px solid rgba(12,14,20,.15), flex-wrap: wrap, gap: 12px`.

Deux éléments :

#### a. Bouton de partage (`<a class="btn-line tem-share">`)
- Réutilise le composant `.btn-line` du site (bouton à filet, sans fond plein)
- Modificateur `.tem-share` ajoute `background: var(--paper-2)` (fond crème léger pour différencier du fond paper principal)
- Texte exact : « + Partager mon témoignage »
- Le `+` est un caractère typographique, pas une icône — laissé tel quel en hi-fi

#### b. Compteur (`<span class="tem-counter">`)
- `--f-body, 11px, .22em, uppercase, --ink-3`
- Texte exact : « 94 témoignages · depuis 1999 »
- En hi-fi : compteur dynamique connecté au backend, format `{N} témoignages · depuis 1999`

> Pas de barre de recherche, pas de filtres sur cette page — c'est volontaire. La mosaïque est navigable par lecture, pas par requête.

---

### 4.3 Mosaïque asymétrique (`<section class="tem-mosaic">`)

`max-width: 1280px, padding: 48px 32px 60px, display: grid, grid-template-columns: repeat(6, 1fr), gap: 28px 24px`.

**Grille 6 colonnes** + spans variables sur chaque carte. Toutes les cartes sont des `<article class="tem [variant] [position]">`.

#### Placement des 8 cartes (CRITIQUE — c'est la composition)

| Position class | Type | Span colonnes | Span lignes |
|---|---|---|---|
| `.tem-q1` | quote | 2 | 1 |
| `.tem-i1` | illu | 4 | 2 |
| `.tem-q2` | quote (`.accent-blue`) | 2 | 1 |
| `.tem-s1` | story | 3 | 1 |
| `.tem-q3` | quote | 3 | 1 |
| `.tem-i2` | illu | 4 | 2 |
| `.tem-s2` | story | 2 | 1 |
| `.tem-q4` | quote | 2 | 1 |

**Lecture visuelle attendue** :
- Ligne 1 : `[q1 ×2] [i1 ×4 (chevauche 2 lignes)]`
- Ligne 2 : `[q2 ×2]`
- Ligne 3 : `[s1 ×3] [q3 ×3]`
- Ligne 4 : `[i2 ×4 (chevauche 2 lignes)] [s2 ×2]`
- Ligne 5 : `[q4 ×2]`

(L'auto-flow dense de la grille gère le positionnement à partir des `grid-column: span N` / `grid-row: span N`.)

#### a. Citations courtes (`.tem-quote`)

`padding: 18px 22px 22px, background: var(--paper-2), border-left: 2px solid --ink`.

Composition :
1. `<div class="tem-glyph">"</div>` — gros guillemet typographique
   `--f-serif, 64px, line-height 0.4, color --ink, height 32px, margin-bottom 4px`
   `aria-hidden="true"` (décoratif)
2. `<q>` — la citation
   `quotes: "" "" (supprime guillemets auto), --f-serif, 18px, line-height 1.45, color --ink, display block, text-wrap pretty`
3. `<cite>` — attribution
   `--f-body, 11px, .18em, uppercase, --ink-3, font-style: normal, margin-top 14px, display block`

**Modificateur `.accent-blue`** (mal nommé — il colore en ROUGE, pas en bleu — c'est un legs du wireframe à conserver tel quel) :
- `border-left-color: var(--accent)` (ROUGE)
- `.tem-glyph { color: var(--accent) }` (le guillemet aussi en rouge)

> ⚠️ Le nom de classe `.accent-blue` est trompeur mais appliqué tel quel pour ne pas casser l'existant. En hi-fi, possibilité de renommer en `.accent-red` ou `.tem-quote--accent` — à coordonner avec le dev.
> **Une seule** citation porte ce modificateur dans le wireframe (`.tem-q2`). C'est un accent rare, pas une option par défaut.

#### b. Récits moyens (`.tem-story`)

Texte seul, sans image. `padding: 0 4px`.

Composition :
1. `<div class="tem-eyebrow">Récit · 09 . 02 . 2026</div>` — date avec espaces fines autour des points
   `--f-body, 11px, .22em, uppercase, --ink-3, margin-bottom 10px`
2. `<h3>` — titre du récit
   `--f-serif, 500, 22px, line-height 1.25, --ink, margin: 0 0 12px, text-wrap pretty`
3. `<p>` — corps (3-5 phrases)
   `--f-body, 14.5px, line-height 1.6, --ink-2, margin 0`
4. `<cite>` — attribution
   `--f-body, 11px, .18em, uppercase, --ink-3, font-style normal, margin-top 14px, display block`

#### c. Récits illustrés (`.tem-illu`)

`display: grid, grid-template-rows: 220px 1fr, background: var(--paper), border: 1px solid rgba(12,14,20,.12)`.

Composition :
1. `<div class="tem-img">` — image plein bleed, 220px de haut
   - `overflow: hidden, background: var(--paper-2)`
   - `<img>` à l'intérieur : `width 100%, height 100%, object-fit cover, filter grayscale(.2)`
2. `<div class="tem-content">` — corps texte
   - `padding: 22px 24px 24px`
   - `<div class="tem-eyebrow">Récit · 14 . 03 . 2026</div>`
   - `<h3>` — titre (mêmes règles que `.tem-story h3`)
   - `<p>` — paragraphe (4-6 phrases)
   - `<a class="more-line">Lire le récit complet →</a>` (`display: inline-block, margin-top: 14px` — plus l'autre styling de `.more-line` partagé : Inter 12px, .14em, uppercase, --ink, border-bottom 1px solid --ink, padding-bottom 2px)
   - `<cite>` — attribution

> Le filtre `grayscale(.2)` n'est PAS optionnel — c'est l'unification visuelle des photos témoins (qui peuvent être de qualités très différentes) avec l'esthétique éditoriale de la page.

---

### 4.4 Detail view — récit long (`<section class="tem-detail">`)

Section séparée, **colonne lecture étroite** (760px max-width).
`padding: 70px 32px 90px, border-top: 1.5px solid var(--ink), position: relative`.

#### a. En-tête méta (`<div class="tem-detail-meta">`)
`display: flex, justify-content: space-between, align-items: center, margin-bottom: 18px, flex-wrap: wrap, gap: 12px`.

- À gauche : `<a class="back-link">← Retour aux témoignages</a>`
  `--f-body, 12px, .14em, uppercase, --ink-2, no underline. :hover { color --ink }`
- À droite : `<span class="tem-detail-tag">Récit · 14 . 03 . 2026 · 7 min de lecture</span>`
  `--f-body, 11px, .22em, uppercase, --ink-3`

#### b. Titre H2 (`<h2 class="tem-detail-title">`)
`--f-serif, 500, clamp(36px, 4.4vw, 52px), line-height 1.04, letter-spacing -0.01em, margin: 0 0 14px, color --ink`.
2 lignes typiques avec `<br/>` ; `em` sur la 2e ligne en italique `--ink-2`.

Texte exact : « J'ai retrouvé [BR] *mon père dans le Père. »* »
(Les guillemets français `« »` font partie du titre.)

#### c. Par-ligne (`<div class="tem-detail-by">`)
`--f-body, 13px, --ink-2, letter-spacing .02em, margin-bottom 40px, padding-bottom 24px, border-bottom: 1px solid rgba(12,14,20,.15)`.

Format : « Frère R. · 41 ans · baptisé le 28 . 09 . 2025 · publié avec son accord ».

> ⚠️ La mention « publié avec son accord » est cruciale — elle rappelle la dimension éthique. À conserver systématiquement en hi-fi (rendue dynamique : seuls les récits avec consentement écrit sont publiés).

#### d. Corps narratif (`<article class="tem-detail-body">`)

**Tout en serif Cormorant** — c'est la seule section du site où le corps de texte long est en serif (pas en Inter).

- `<p class="tem-lede">` — paragraphe d'ouverture
  `--f-serif, 22px, line-height 1.5, color --ink, margin-bottom 32px`
- `<p>` — paragraphes standards
  `--f-serif, 18px, line-height 1.7, color --ink, margin: 0 0 22px, text-wrap pretty`
- `<blockquote class="tem-q-pull">` — pull-quote (1 seul par récit en moyenne)
  `border-left: 2px solid var(--accent) [ROUGE], padding-left: 24px, margin: 36px 0, --f-serif, italic, 24px, line-height 1.4, color --ink`
  Pas de balise `<p>` à l'intérieur — le texte direct dans le `<blockquote>`.
- `<div class="tem-detail-foot">` — encart « Verset cité dans ce récit »
  `margin-top: 48px, padding: 22px 24px, background: var(--paper-2), border-left: 2px solid var(--ink)`
  - `<span class="tem-foot-lbl">` — libellé (`--f-body, 11px, .22em, uppercase, --ink-3, display block, margin-bottom 6px`)
  - `<span class="tem-foot-ref">` — référence + verset (`--f-serif, italic, 16px, --ink, line-height 1.5`)

---

### 4.5 Données wireframe — à reprendre tel quel

#### Hero
- eyebrow : « Mur des témoignages »
- h1 : « Ce que Dieu / *a fait parmi nous.* »
- lede : « Pas de notes. Pas d'étoiles. Juste des récits — courts ou longs, anonymes ou nommés. Le témoignage est un récit pastoral, pas une recommandation. »

#### Actions
- bouton : « + Partager mon témoignage »
- compteur : « 94 témoignages · depuis 1999 »

#### Mosaïque (8 témoignages)

**q1** (citation courte, 2 col)
> « Je suis venue un dimanche par hasard, j'avais besoin d'entendre quelque chose de stable. Trois mois plus tard, c'est devenu mon assemblée — et ma maison tient debout. »
> — une sœur · Île-de-France

**i1** (récit illustré, 4 col × 2 lignes — image `assets/sanctuary.jpeg`)
- eyebrow : Récit · 14 . 03 . 2026
- h3 : « J'ai retrouvé mon père dans le Père. »
- p : « J'avais quitté la foi adolescente comme on quitte une maison trop étroite. Vingt ans plus tard, à un mariage, un frère m'a parlé du Message simplement, sans pression. Je suis revenu à RST le dimanche d'après. Je n'étais pas venu chercher Dieu. C'est Lui qui m'attendait. »
- a : Lire le récit complet →
- cite : — frère R. · 41 ans · baptisé le 28 . 09 . 2025

**q2** (citation courte, 2 col, **avec accent rouge `.accent-blue`**)
> « Mon enfant a été guéri — pas comme dans un livre. Comme dans la Bible. »
> — une mère · 33 ans

**s1** (récit moyen, 3 col)
- eyebrow : Récit · 09 . 02 . 2026
- h3 : Le travail revenu après la prière de l'autel
- p : « Trois mois sans contrat. La saison de prière commune nous a portés — mon épouse et moi. Le mardi qui a suivi le jeûne, j'ai reçu un appel d'une entreprise que je n'avais jamais sollicitée. Aujourd'hui je suis en CDI depuis un an. Je n'aurais jamais cru qu'une prière ordinaire puisse répondre aussi clairement. »
- cite : — frère J.K. · 37 ans · membre depuis 2018

**q3** (citation courte, 3 col)
> « Ici, on m'a appris à lire la Bible — pas à la commenter. »
> — jeune adulte · 23 ans

**i2** (récit illustré, 4 col × 2 lignes — image `assets/wmb-portrait.jpeg`)
- eyebrow : Récit · 21 . 01 . 2026
- h3 : « Le Message ne m'a pas séduit. Il m'a tenu. »
- p : « Je suis arrivé sceptique. Pendant un an, j'ai écouté sans m'engager. Puis une nuit d'épreuve réelle — un deuil — la Parole prêchée a tenu là où mon mental s'est effondré. Ce qui ne sert qu'à plaire ne tient pas dans le deuil. Le Roc, oui. »
- a : Lire le récit complet →
- cite : — frère M. · 52 ans · baptisé le 24 . 01 . 2024

**s2** (récit moyen, 2 col)
- eyebrow : Récit · 15 . 12 . 2025
- h3 : Restauration du foyer
- p : « Mon mariage tenait par les murs. Aucune trahison spectaculaire — juste un silence qui s'épaississait. Une sœur âgée nous a invités à venir au culte du dimanche, sans question. Six mois plus tard, on prie ensemble. Un an après, on rit ensemble. Dieu a réparé ce qu'aucun conseil n'avait su réparer. »
- cite : — un couple · 16 ans de mariage

**q4** (citation courte, 2 col)
> « Je n'ai pas trouvé une église. J'ai trouvé une maison. »
> — une sœur · venue de R.D. Congo en 2022

#### Detail (récit long développant `i1`)
- back : ← Retour aux témoignages
- tag : Récit · 14 . 03 . 2026 · 7 min de lecture
- h2 : « J'ai retrouvé / *mon père dans le Père. »* »
- by : Frère R. · 41 ans · baptisé le 28 . 09 . 2025 · publié avec son accord

5 paragraphes (1 lede + 3 p + 1 final) avec une pull-quote insérée :
- **lede** : « J'avais quitté la foi adolescente comme on quitte une maison trop étroite. Pendant vingt ans, j'ai cru que la liberté c'était de partir. Je l'ai compris à un mariage, en mars dernier, quand un homme que je ne connaissais pas m'a parlé de Christ comme on parle d'un ami sûr. »
- **p** : « Mon père est mort quand j'avais douze ans. Je ne le savais pas, mais une grande partie de mon refus de Dieu venait de là. Comment faire confiance à un Père céleste quand le père terrestre s'absente sans préavis ? J'ai construit ma vie autour de ce silence, en faisant comme si l'absence était une réponse. »
- **pull-quote** : « Je n'étais pas venu chercher Dieu. C'est Lui qui m'attendait. »
- **p** : « Le frère, à ce mariage, n'a pas cherché à me convaincre. Il m'a juste dit : "Viens dimanche écouter, sans engagement." Je suis venu — et le pasteur a prêché sur Matthieu 7. Pas un mot sur la performance, pas un mot sur ce qu'il fallait faire. Juste : "Sur quoi ta vie est-elle bâtie ?" »
- **p** : « Je suis rentré chez moi. J'ai pleuré comme un enfant. J'ai compris ce soir-là que le Père que j'avais cherché en mon père absent, je l'avais sous les yeux depuis toujours dans la Parole. »
- **p** : « J'ai été baptisé six mois plus tard. La paix n'est pas spectaculaire — elle est solide. Comme le Roc. »

**Encart final** :
- lbl : Verset cité dans ce récit
- ref : Matthieu 7 . 24 — « Quiconque entend ces paroles que je dis et les met en pratique. »

---

## 5. Comportements (JavaScript)

### 5.1 Click sur « Lire le récit complet » (cartes `.tem-illu`)
Route vers la page détail correspondante (`/temoignages/<slug>`). Dans le wireframe, la section `.tem-detail` est rendue en bas de page comme un aperçu permanent — en hi-fi, c'est une vraie route (la mosaïque et le détail sont deux pages distinctes).

### 5.2 Click sur « + Partager mon témoignage »
Ouvre soit :
- un formulaire modal (champs : nom OU pseudo, âge, durée d'appartenance, témoignage long-form 200-2000 mots, verset clé, accord de publication coché obligatoirement, contact pour validation par le secrétariat)
- ou une page dédiée `/temoignages/partager`

**Workflow éditorial** : tout témoignage soumis est revu par le secrétariat avant publication. Aucune publication automatique.

### 5.3 Click sur « ← Retour aux témoignages »
Retour à la page mosaïque. Si arrivé via lien direct, retour à `/eglise#temoignages`.

### 5.4 Pas de filtres ni de recherche
Volontaire. La mosaïque se lit comme un mur, pas comme un catalogue.

### 5.5 Pagination de la mosaïque
À 50+ témoignages, charger par paquets (par exemple 20 cartes initiales + bouton « Voir plus » qui en charge 20 de plus). Pas de scroll infini agressif.

---

## 6. Schéma de données suggéré

```ts
type Testimony = {
  id: string;                                // 'tem-2026-03-14-pere'
  date: string;                              // '2026-03-14' ISO (date de publication)
  type: 'quote' | 'story' | 'illu';          // détermine la classe CSS
  accent?: 'red';                            // optionnel — applique .accent-blue (= rouge en réalité)
  // commun
  cite: string;                              // '— frère R. · 41 ans · baptisé le 28 . 09 . 2025'
  // pour quote
  quoteText?: string;                        // le `<q>`, sans guillemets
  // pour story / illu
  eyebrow?: string;                          // 'Récit · 14 . 03 . 2026'
  title?: string;                            // h3 — peut contenir « » et accents
  body?: string;                             // 1-3 phrases pour mosaic, version courte
  // pour illu
  image?: string;                            // chemin photo (consentement requis)
  // pour story / illu — détail long
  hasDetail?: boolean;                       // s'il y a une page détail dédiée
  slug?: string;                             // 'pere-dans-le-pere' pour l'URL
  // statut éditorial
  isPublished: boolean;
  isAnonymous: boolean;                      // si true, name reste vide / "une sœur"
  consentDate?: string;                      // date du consentement écrit
};

type TestimonyDetail = {
  id: string;
  testimony: Testimony;                      // ref vers la version courte
  readingMinutes: number;                    // pour le tag '7 min de lecture'
  byline: string;                            // 'Frère R. · 41 ans · baptisé le 28 . 09 . 2025 · publié avec son accord'
  paragraphs: Array<
    | { kind: 'lede'; text: string }
    | { kind: 'p'; text: string }
    | { kind: 'pull-quote'; text: string }
  >;
  versetRef: string;                         // 'Matthieu 7 . 24'
  versetText: string;                        // « Quiconque entend ces paroles... »
};

// La position dans la mosaïque (q1, i1, q2, ...) est calculée côté front
// à partir de l'ordre des items et de leur type — pas stockée en BDD.
```

**Algorithme de placement mosaïque** (suggéré) :
```
position 1 : quote (×2)
position 2 : illu  (×4 × 2 lignes)
position 3 : quote (×2)         ← peut porter accent
position 4 : story (×3)
position 5 : quote (×3)
position 6 : illu  (×4 × 2 lignes)
position 7 : story (×2)
position 8 : quote (×2)
[répéter le pattern pour les paquets suivants]
```

Le rythme `quote / illu / quote / story / quote / illu / story / quote` est intentionnel — il alterne la densité visuelle pour éviter l'effet de mur uniforme.

---

## 7. HTML de référence — à recopier _verbatim_

```html
<div class="ctx-view" data-ctx-view="temoignages">

  <!-- 4.1 HERO -->
  <section class="tem-hero anchored">
    <div class="tem-hero-inner">
      <div class="eyebrow">Mur des témoignages</div>
      <h1>Ce que Dieu<br/><em>a fait parmi nous.</em></h1>
      <p class="lede">Pas de notes. Pas d'étoiles. Juste des récits — courts ou longs, anonymes ou nommés. Le témoignage est un récit pastoral, pas une recommandation.</p>
    </div>
  </section>

  <!-- 4.2 ACTIONS -->
  <section class="tem-actions anchored">
    <a href="#" class="btn-line tem-share">+ Partager mon témoignage</a>
    <span class="tem-counter">94 témoignages · depuis 1999</span>
  </section>

  <!-- 4.3 MOSAIC -->
  <section class="tem-mosaic anchored">

    <!-- Citation courte (1) -->
    <article class="tem tem-quote tem-q1">
      <div class="tem-glyph" aria-hidden="true">"</div>
      <q>Je suis venue un dimanche par hasard, j'avais besoin d'entendre quelque chose de stable. Trois mois plus tard, c'est devenu mon assemblée — et ma maison tient debout.</q>
      <cite>— une sœur · Île-de-France</cite>
    </article>

    <!-- Récit illustré (1) -->
    <article class="tem tem-illu tem-i1">
      <div class="tem-img"><img src="assets/sanctuary.jpeg" alt="" /></div>
      <div class="tem-content">
        <div class="tem-eyebrow">Récit · 14 . 03 . 2026</div>
        <h3>« J'ai retrouvé mon père dans le Père. »</h3>
        <p>J'avais quitté la foi adolescente comme on quitte une maison trop étroite. Vingt ans plus tard, à un mariage, un frère m'a parlé du Message simplement, sans pression. Je suis revenu à RST le dimanche d'après. Je n'étais pas venu chercher Dieu. C'est Lui qui m'attendait.</p>
        <a href="#" class="more-line">Lire le récit complet →</a>
        <cite>— frère R. · 41 ans · baptisé le 28 . 09 . 2025</cite>
      </div>
    </article>

    <!-- Citation courte (2) — avec accent rouge -->
    <article class="tem tem-quote tem-q2 accent-blue">
      <div class="tem-glyph" aria-hidden="true">"</div>
      <q>Mon enfant a été guéri — pas comme dans un livre. Comme dans la Bible.</q>
      <cite>— une mère · 33 ans</cite>
    </article>

    <!-- Récit moyen -->
    <article class="tem tem-story tem-s1">
      <div class="tem-eyebrow">Récit · 09 . 02 . 2026</div>
      <h3>Le travail revenu après la prière de l'autel</h3>
      <p>Trois mois sans contrat. La saison de prière commune nous a portés — mon épouse et moi. Le mardi qui a suivi le jeûne, j'ai reçu un appel d'une entreprise que je n'avais jamais sollicitée. Aujourd'hui je suis en CDI depuis un an. Je n'aurais jamais cru qu'une prière ordinaire puisse répondre aussi clairement.</p>
      <cite>— frère J.K. · 37 ans · membre depuis 2018</cite>
    </article>

    <!-- Citation courte (3) -->
    <article class="tem tem-quote tem-q3">
      <div class="tem-glyph" aria-hidden="true">"</div>
      <q>Ici, on m'a appris à lire la Bible — pas à la commenter.</q>
      <cite>— jeune adulte · 23 ans</cite>
    </article>

    <!-- Récit illustré (2) -->
    <article class="tem tem-illu tem-i2">
      <div class="tem-img"><img src="assets/wmb-portrait.jpeg" alt="" /></div>
      <div class="tem-content">
        <div class="tem-eyebrow">Récit · 21 . 01 . 2026</div>
        <h3>« Le Message ne m'a pas séduit. Il m'a tenu. »</h3>
        <p>Je suis arrivé sceptique. Pendant un an, j'ai écouté sans m'engager. Puis une nuit d'épreuve réelle — un deuil — la Parole prêchée a tenu là où mon mental s'est effondré. Ce qui ne sert qu'à plaire ne tient pas dans le deuil. Le Roc, oui.</p>
        <a href="#" class="more-line">Lire le récit complet →</a>
        <cite>— frère M. · 52 ans · baptisé le 24 . 01 . 2024</cite>
      </div>
    </article>

    <!-- Récit moyen -->
    <article class="tem tem-story tem-s2">
      <div class="tem-eyebrow">Récit · 15 . 12 . 2025</div>
      <h3>Restauration du foyer</h3>
      <p>Mon mariage tenait par les murs. Aucune trahison spectaculaire — juste un silence qui s'épaississait. Une sœur âgée nous a invités à venir au culte du dimanche, sans question. Six mois plus tard, on prie ensemble. Un an après, on rit ensemble. Dieu a réparé ce qu'aucun conseil n'avait su réparer.</p>
      <cite>— un couple · 16 ans de mariage</cite>
    </article>

    <!-- Citation courte (4) -->
    <article class="tem tem-quote tem-q4">
      <div class="tem-glyph" aria-hidden="true">"</div>
      <q>Je n'ai pas trouvé une église. J'ai trouvé une maison.</q>
      <cite>— une sœur · venue de R.D. Congo en 2022</cite>
    </article>

  </section>

  <!-- 4.4 DETAIL -->
  <section class="tem-detail anchored">
    <div class="tem-detail-meta">
      <a href="#" class="back-link">← Retour aux témoignages</a>
      <span class="tem-detail-tag">Récit · 14 . 03 . 2026 · 7 min de lecture</span>
    </div>
    <h2 class="tem-detail-title">« J'ai retrouvé<br/><em>mon père dans le Père. »</em></h2>
    <div class="tem-detail-by">Frère R. · 41 ans · baptisé le 28 . 09 . 2025 · publié avec son accord</div>

    <article class="tem-detail-body">
      <p class="tem-lede">J'avais quitté la foi adolescente comme on quitte une maison trop étroite. Pendant vingt ans, j'ai cru que la liberté c'était de partir. Je l'ai compris à un mariage, en mars dernier, quand un homme que je ne connaissais pas m'a parlé de Christ comme on parle d'un ami sûr.</p>

      <p>Mon père est mort quand j'avais douze ans. Je ne le savais pas, mais une grande partie de mon refus de Dieu venait de là. Comment faire confiance à un Père céleste quand le père terrestre s'absente sans préavis ? J'ai construit ma vie autour de ce silence, en faisant comme si l'absence était une réponse.</p>

      <blockquote class="tem-q-pull">
        Je n'étais pas venu chercher Dieu. C'est Lui qui m'attendait.
      </blockquote>

      <p>Le frère, à ce mariage, n'a pas cherché à me convaincre. Il m'a juste dit : « Viens dimanche écouter, sans engagement. » Je suis venu — et le pasteur a prêché sur Matthieu 7. Pas un mot sur la performance, pas un mot sur ce qu'il fallait faire. Juste : « Sur quoi ta vie est-elle bâtie ? »</p>

      <p>Je suis rentré chez moi. J'ai pleuré comme un enfant. J'ai compris ce soir-là que le Père que j'avais cherché en mon père absent, je l'avais sous les yeux depuis toujours dans la Parole.</p>

      <p>J'ai été baptisé six mois plus tard. La paix n'est pas spectaculaire — elle est solide. Comme le Roc.</p>

      <div class="tem-detail-foot">
        <span class="tem-foot-lbl">Verset cité dans ce récit</span>
        <span class="tem-foot-ref">Matthieu 7 . 24 — « Quiconque entend ces paroles que je dis et les met en pratique. »</span>
      </div>
    </article>
  </section>

</div>
```

> Note : le glyphe `"` (U+201C, LEFT DOUBLE QUOTATION MARK) doit être un vrai caractère typographique, pas une chaîne `&quot;` ou `&#x201C;`. C'est la forme courbe.

---

## 8. CSS de référence — à recopier _verbatim_

> Sélecteurs scopés sous `#page-eglise`. Si tu reproduis dans un composant isolé, retire le préfixe.
> La règle hero `.tem-hero` est partagée avec `.cultes-hero` / `.cant-hero` / `.ann-hero` (cf. PRD précédentes).
> La règle `.detail-meta` / `.back-link` est partagée avec la sous-page Cultes (cf. PRD-CULTES.md §8).

```css
/* ====== HERO partagé (mêmes règles que cultes-hero / cant-hero / ann-hero) */
.tem-hero {
  max-width: 1280px; margin: 0 auto;
  padding: 60px 32px 40px;
  border-bottom: 1.5px solid var(--ink);
  position: relative;
}
.tem-hero-inner { max-width: 760px; }
.tem-hero h1 {
  font-family: var(--f-serif); font-weight: 500;
  font-size: clamp(40px, 5.4vw, 64px);
  line-height: 1.04; letter-spacing: -0.01em;
  margin: 14px 0 18px;
  color: var(--ink);
  text-wrap: pretty;
}
.tem-hero h1 em { font-style: italic; color: var(--ink-2); }
.tem-hero .lede {
  font-family: var(--f-serif);
  font-size: 19px; line-height: 1.55;
  color: var(--ink-2);
  max-width: 620px;
  margin: 0;
}

/* ====== 04d TÉMOIGNAGES ===================================== */

/* Actions */
.tem-actions {
  max-width: 1280px; margin: 0 auto;
  padding: 24px 32px;
  display: flex; align-items: center; justify-content: space-between;
  border-bottom: 1px solid rgba(12,14,20,.15);
  flex-wrap: wrap; gap: 12px;
}
.tem-share {
  background: var(--paper-2);
  /* hérite des autres styles de .btn-line — voir le shared kit */
}
.tem-counter {
  font-family: var(--f-body); font-size: 11px;
  letter-spacing: .22em; text-transform: uppercase;
  color: var(--ink-3);
}

/* Mosaïque asymétrique */
.tem-mosaic {
  max-width: 1280px; margin: 0 auto;
  padding: 48px 32px 60px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 28px 24px;
}
.tem {
  padding: 0;
  position: relative;
}
.tem cite {
  display: block;
  font-family: var(--f-body); font-size: 11px;
  letter-spacing: .18em; text-transform: uppercase;
  color: var(--ink-3);
  font-style: normal;
  margin-top: 14px;
}

/* Quote tem */
.tem-quote {
  padding: 18px 22px 22px;
  background: var(--paper-2);
  border-left: 2px solid var(--ink);
}
.tem-quote .tem-glyph {
  font-family: var(--f-serif);
  font-size: 64px; line-height: 0.4;
  color: var(--ink);
  height: 32px;
  margin-bottom: 4px;
}
.tem-quote q {
  quotes: "" "";
  font-family: var(--f-serif);
  font-size: 18px; line-height: 1.45;
  color: var(--ink);
  display: block;
  text-wrap: pretty;
}
.tem-quote.accent-blue {
  border-left-color: var(--accent);
}
.tem-quote.accent-blue .tem-glyph {
  color: var(--accent);
}

/* Story tem (text only) */
.tem-story { padding: 0 4px; }
.tem-story h3,
.tem-illu h3 {
  font-family: var(--f-serif); font-weight: 500;
  font-size: 22px; line-height: 1.25;
  color: var(--ink); margin: 0 0 12px;
  text-wrap: pretty;
}
.tem-story p,
.tem-illu p {
  font-family: var(--f-body); font-size: 14.5px; line-height: 1.6;
  color: var(--ink-2); margin: 0;
}
.tem-eyebrow {
  font-family: var(--f-body); font-size: 11px;
  letter-spacing: .22em; text-transform: uppercase;
  color: var(--ink-3);
  margin-bottom: 10px;
}

/* Illustrated tem */
.tem-illu {
  display: grid;
  grid-template-rows: 220px 1fr;
  background: var(--paper);
  border: 1px solid rgba(12,14,20,.12);
}
.tem-illu .tem-img {
  overflow: hidden;
  background: var(--paper-2);
}
.tem-illu .tem-img img {
  width: 100%; height: 100%; object-fit: cover;
  filter: grayscale(.2);
}
.tem-illu .tem-content {
  padding: 22px 24px 24px;
}
.tem-illu .more-line {
  display: inline-block; margin-top: 14px;
}

/* Mosaic placement */
.tem-q1 { grid-column: span 2; grid-row: span 1; }
.tem-i1 { grid-column: span 4; grid-row: span 2; }
.tem-q2 { grid-column: span 2; grid-row: span 1; }
.tem-s1 { grid-column: span 3; grid-row: span 1; }
.tem-q3 { grid-column: span 3; grid-row: span 1; }
.tem-i2 { grid-column: span 4; grid-row: span 2; }
.tem-s2 { grid-column: span 2; grid-row: span 1; }
.tem-q4 { grid-column: span 2; grid-row: span 1; }

/* Témoignage detail */
.tem-detail {
  max-width: 760px; margin: 0 auto;
  padding: 70px 32px 90px;
  border-top: 1.5px solid var(--ink);
  position: relative;
}
.tem-detail-meta {
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
.tem-detail-tag {
  font-family: var(--f-body); font-size: 11px;
  letter-spacing: .22em; text-transform: uppercase;
  color: var(--ink-3);
}
.tem-detail-title {
  font-family: var(--f-serif); font-weight: 500;
  font-size: clamp(36px, 4.4vw, 52px);
  line-height: 1.04; letter-spacing: -0.01em;
  margin: 0 0 14px;
  color: var(--ink);
}
.tem-detail-title em { font-style: italic; color: var(--ink-2); }
.tem-detail-by {
  font-family: var(--f-body); font-size: 13px;
  color: var(--ink-2); letter-spacing: .02em;
  margin-bottom: 40px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(12,14,20,.15);
}
.tem-detail-body p {
  font-family: var(--f-serif);
  font-size: 18px; line-height: 1.7;
  color: var(--ink);
  margin: 0 0 22px;
  text-wrap: pretty;
}
.tem-detail-body .tem-lede {
  font-size: 22px;
  color: var(--ink);
  line-height: 1.5;
  margin-bottom: 32px;
}
.tem-q-pull {
  border-left: 2px solid var(--accent);
  padding-left: 24px;
  margin: 36px 0;
  font-family: var(--f-serif);
  font-style: italic;
  font-size: 24px; line-height: 1.4;
  color: var(--ink);
}
.tem-detail-foot {
  margin-top: 48px;
  padding: 22px 24px;
  background: var(--paper-2);
  border-left: 2px solid var(--ink);
}
.tem-detail-foot .tem-foot-lbl {
  display: block;
  font-family: var(--f-body); font-size: 11px;
  letter-spacing: .22em; text-transform: uppercase;
  color: var(--ink-3);
  margin-bottom: 6px;
}
.tem-detail-foot .tem-foot-ref {
  font-family: var(--f-serif); font-style: italic;
  font-size: 16px; color: var(--ink);
  line-height: 1.5;
}
```

### Mobile (≤ 820px)

```css
@media (max-width: 820px) {
  .tem-hero { padding: 40px 22px 28px; }

  /* Mosaïque : empile en 1 colonne, toutes les positions ramenées à span 1 */
  .tem-mosaic {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 40px 22px 50px;
  }
  .tem-q1, .tem-i1, .tem-q2,
  .tem-s1, .tem-q3, .tem-i2,
  .tem-s2, .tem-q4 { grid-column: span 1; grid-row: span 1; }
  .tem-illu { grid-template-rows: 200px 1fr; }

  /* Detail : padding réduit, tailles serif réduites */
  .tem-detail { padding: 50px 22px 70px; }
  .tem-detail-body p { font-size: 16px; }
  .tem-detail-body .tem-lede { font-size: 19px; }
  .tem-q-pull { font-size: 20px; padding-left: 18px; margin: 24px 0; }
}
```

> Note : `.btn-line` et `.more-line` sont des composants partagés du site global (cf. `PRD.md`). À reprendre tels quels.

---

## 9. Hi-fi : ce qui change par rapport au wireframe

| Élément | Wireframe | Hi-fi cible |
|---|---|---|
| `.tem-img img` | `assets/sanctuary.jpeg` / `assets/wmb-portrait.jpeg` (placeholders) | Vraies photos des témoins (avec consentement écrit) ou photos métaphoriques sobres (lieu, objet) si témoin anonyme |
| Mosaïque | 8 cartes hardcodées | Liste depuis BDD — placement automatique via algorithme de répétition du pattern q/i/q/s/q/i/s/q |
| Bouton « Partager » | Lien `href="#"` | Modal ou page formulaire, soumission au secrétariat |
| Page détail | Une seule page hardcodée en bas de la mosaïque | Vraie route `/temoignages/<slug>` ; pour les récits courts (`tem-quote`, `tem-story`), pas de page détail |
| Pull-quote `.tem-q-pull` | Une seule | Plusieurs autorisées par récit, mais 1-2 max conseillées (rythme de lecture) |
| Encart « Verset cité » | Une seule occurrence | Optionnel — afficher seulement si le récit cite explicitement un passage |
| Compteur | `94 témoignages` hardcodé | Compteur dynamique des témoignages publiés |
| `.accent-blue` | Sur 1 carte (q2) | Modificateur disponible — à utiliser **avec parcimonie** (1 carte sur 6-8 max) |
| `tem-detail-by` | Texte fixe | Inclure systématiquement « publié avec son accord » ou « publié anonymement à sa demande » selon le cas |

**À NE PAS faire en hi-fi** :
- Avatars circulaires, photos de profil
- Notation (étoiles, scores, badges « vérifié »)
- Filtres par catégorie (« guérison », « famille », « professionnel »...) — la mosaïque est volontairement non-taxonomisée
- Recherche full-text — un témoignage n'est pas un article SEO
- Pagination « 1 2 3 4 5 » — utiliser un simple « Voir plus »
- Lecture suggérée / témoignages similaires en bas de la page détail
- Boutons de partage social (la confidentialité prime)
- Likes, commentaires, réactions
- Auto-rotation, carrousel
- Encart de don « Soutenez l'œuvre » dans la marge — la page n'est pas une vitrine commerciale
- Changer le serif Cormorant pour les corps narratifs en Inter — c'est la signature de la page

---

## 10. Checklist de validation

- [ ] Hero : eyebrow « Mur des témoignages » + titre 2 lignes (italique 2e) + lede avec « Pas de notes. Pas d'étoiles. » verbatim
- [ ] Actions : bouton `.btn-line.tem-share` avec fond `--paper-2` à gauche + counter Inter uppercase à droite, filet bas 1px
- [ ] Mosaïque : grille 6 colonnes, gap 28px × 24px, padding 48 32 60
- [ ] 4 quotes (`.tem-quote`) avec fond `--paper-2`, filet gauche noir 2px, gros guillemet `"` 64px, q en serif 18px line-height 1.45, cite en Inter 11px uppercase
- [ ] 1 quote `.accent-blue` (q2) : filet gauche ROUGE + guillemet ROUGE
- [ ] 2 récits moyens (`.tem-story`) : eyebrow Inter + h3 serif 22px + p Inter 14.5px + cite
- [ ] 2 récits illustrés (`.tem-illu`) : grid 220px / 1fr, image grayscale .2, contenu padding 22 24 24, lien « Lire le récit complet → »
- [ ] Placement mosaïque exact : q1(2) · i1(4×2) · q2(2) · s1(3) · q3(3) · i2(4×2) · s2(2) · q4(2)
- [ ] Detail : max-width 760px, border-top noir 1.5px, padding 70 32 90
- [ ] Detail-meta : back-link à gauche + tag à droite, marge 18 + filet bas après tem-detail-by
- [ ] H2 détail : serif 500 clamp(36, 4.4vw, 52), 2 lignes, italique 2e, guillemets `« »` français
- [ ] tem-detail-by : Inter 13px, contient « publié avec son accord »
- [ ] Corps détail : `<p class="tem-lede">` 22px serif, `<p>` 18px serif line-height 1.7
- [ ] Pull-quote `.tem-q-pull` : filet gauche ROUGE 2px, padding-left 24, margin 36 0, serif italique 24px
- [ ] Encart final `.tem-detail-foot` : fond `--paper-2`, filet gauche noir 2px, padding 22 24, margin-top 48, lbl Inter uppercase + ref serif italique 16px
- [ ] Mobile ≤820px : mosaïque en 1 colonne, toutes positions ramenées à span 1, illu rows 200px, detail padding 50 22 70, p 16px, lede 19px, pull-quote 20px
- [ ] Aucun footer, aucune nav, aucun élément en dehors du `<div class="ctx-view" data-ctx-view="temoignages">`
- [ ] Aucune étoile, aucun avatar circulaire, aucune notation
- [ ] Tous les guillemets sont typographiques (`« »` français pour citations imbriquées, `"` pour glyph décoratif)

---

**Fin du PRD Témoignages.**
À utiliser conjointement avec le `PRD.md` global et les PRD précédents (`PRD-CULTES.md`, `PRD-CANTIQUES.md`, `PRD-ANNONCES.md`).
