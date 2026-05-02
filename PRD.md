# PROMPT — Reproduction high-fidelity du site RST (Roc Séculaire Tabernacle)

> À donner à Claude Code (ou tout autre agent codeur) **avec le fichier `wireframes-variation-b.html` joint en référence**.
> Le wireframe est la source de vérité pour la structure, les copies, les composants et le système visuel. Ta mission est de produire la **version hi-fi finale**, prête pour la production.

---

## 0 — Contexte du projet

Tu construis le site web officiel de **Roc Séculaire Tabernacle (RST)**, une assemblée chrétienne francophone basée à **Vitry-sur-Seine (94)**, attachée au **Message de William M. Branham** (1909–1965). L'assemblée existe depuis **1999**, est rattachée à un **réseau de 11 nations** (Angola, Cameroun, Congo, Côte d'Ivoire, France métropolitaine, Guadeloupe, Guyane, Haïti, Martinique, R.D. Congo, Seychelles), et son pasteur est le **Rev. Robert Ndaye M.**

L'audience visée :
- **Membres de l'assemblée** (français, créoles, africains francophones, large spectre d'âge)
- **Visiteurs curieux** du Message qui cherchent une assemblée locale
- **Familles de la diaspora** rattachées à l'œuvre

Le ton du site est **éditorial, sacré, posé, sobre**. Pas startup. Pas méga-church américaine. Pas New Age. C'est un lieu de Parole, pas de divertissement. Le design doit transpirer ça : densité typographique élevée, hiérarchie classique, citations bibliques traitées comme matière première et non comme décoration.

---

## 1 — Ce que tu reçois

1. Le fichier **`wireframes-variation-b.html`** — un wireframe basse-fidélité avec annotations manuscrites bleues. C'est ta **bible structurelle** : reprends-en l'arborescence, les composants, les copies, les tableaux de chiffres, les noms de section, l'ordre des informations.
2. Les assets dans `assets/` : `logo-rst.png` (logo officiel ovale), `wmb-portrait.jpeg` (portrait W. M. Branham), `sanctuary.jpeg` (intérieur de la salle), `pastor-ndaye.png`, `landing-ref.png`, `history-ref.png`, `jesus.avif`, `rst-tokens.css`.

---

## 2 — Architecture du site

Le site comprend **4 pages principales** et **4 sous-pages** sur la page 04. Toutes accessibles depuis une seule barre de navigation supérieure (header global). Sur la page 04, une **navigation contextuelle secondaire** apparaît juste sous le header pour basculer entre les sous-vues.

### Pages principales

1. **01 — Accueil** (`/` — page d'entrée)
2. **02 — Projet Néhémie** (`/nehemie` — projet de construction / collecte)
3. **03 — Histoire de l'Église** (`/histoire` — récit éditorial sobre)
4. **04 — L'Église / Actualité** (`/eglise` — vlog vivant, mis à jour chaque semaine)

### Sous-pages de la page 04 (nav contextuelle)

- **04a — Cette semaine** *(vue par défaut, dynamique : reflète le dernier dimanche)*
- **04b — Cultes** (bibliothèque-ressource des prédications)
- **04c — Cantiques** (hymnaire — recueil + Message + composés ici)
- **04d — Annonces** (bulletin paroissial)
- **04e — Témoignages** (mur narratif)

> ⚠️ La page `02 — Projet Néhémie` est **liée** à un encart « Bâtissons ensemble » sur la page 01 et à des cards sur la page 04. Garde la cohérence.

---

## 3 — Système visuel (à respecter strictement)

### 3.1 — Palette de couleurs

```css
/* Tons d'encre (texte, lignes) */
--ink:        #0C0E14;   /* noir principal — titres, corps */
--ink-2:      #2A2E3A;   /* gris-noir secondaire */
--ink-3:      #6B7280;   /* gris discret — méta, captions */
--line-soft:  rgba(12,14,20,.15);  /* hairlines */

/* Papier */
--paper:      #FFFFFF;   /* fond principal */
--paper-2:    #F4F1EA;   /* fond crème/parchemin — encadrés, citations Branham */

/* Accents sémantiques */
--accent:     #15364B;   /* BLEU RST profond — actions principales, dons, CTA majeurs */
--note:       #A62020;   /* ROUGE RST — vidéo, live, lien YouTube UNIQUEMENT */
```

**Règle absolue de sémantique des couleurs :**

- **🔴 Rouge (`--note`)** = VIDÉO / LIVE / YOUTUBE uniquement. Pastille « LIVE » dans le header, bouton « LIVE » du hero (avec triangle play ▶), bouton « Écouter le message », lecteur vidéo, drapeau « En direct ». **JAMAIS** pour des CTA d'action ou de don.
- **🔵 Bleu (`--accent`)** = ACTION / IDENTITÉ / DON. Bouton « CONTRIBUER », bouton « Découvrir l'église », filets décoratifs (citations Branham), accents typographiques (chiffres romains, accents éditoriaux), commutateur de langue actif.
- **⚫ Encre noire (`--ink`)** = neutre par défaut. Texte de corps, titres, filets de séparation, boutons secondaires (`btn-line`), états « aujourd'hui » dans la chronologie.
- **Crème (`--paper-2`)** = arrière-plan d'encadrés citations bibliques, fiches de cantique vedette, sections « bulletin », panneau « lyrics ».

### 3.2 — Typographie

```css
--f-serif:    "Cormorant Garamond", "EB Garamond", Georgia, serif;
              /* corps éditorial, titres, citations, lede */

--f-engrave:  "Cinzel", "Trajan Pro", serif;
              /* USAGE LIMITÉ : nom sacré "ROC SÉCULAIRE TABERNACLE",
                 horaires de culte (Trajan Pro inline avec Cinzel en repli) */

--f-num:      "Bodoni Moda", "Didot", "Bodoni 72", serif;
              /* TOUS LES CHIFFRES : objectifs, montants, jauges, dates,
                 numéros de cantiques, durées vidéo, % collecte */

--f-body:     "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
              /* eyebrow, méta, navigation, boutons, captions, toolbars */
```

**Règles typographiques :**

- Les titres (`h1`, `h2`) utilisent `--f-serif` en `font-weight: 500`, avec `letter-spacing: -0.01em` et `line-height: 1.04`.
- Le mot **« ROC SÉCULAIRE TABERNACLE »** dans le hero accueil est en **Cinzel 600** (pas Cormorant), letter-spacing élargi (~0.03em), pour évoquer l'inscription gravée.
- Les **chiffres** (50 000 €, 12 500 €, № 47, 09H00) sont en **Bodoni Moda** — haut contraste, élégant. Jamais en sans-serif.
- Les **eyebrows** (étiquettes de section) : `--f-body`, 11px, `letter-spacing: .26em`, `text-transform: uppercase`, couleur `--ink-3`.
- Les **citations bibliques** (`blockquote.bibl`) : `--f-serif` 17px italique, filet noir 2px à gauche, `padding-left: 18px`.
- Les **citations Branham** (`blockquote.bran`) : `--f-serif` italique, **filet rouge `--note` 2px à gauche** (sauf dans le hero Cultes où c'est l'accent). La source est en `--f-body`, 10.5px, letter-spacing élargi, uppercase, `--ink-3`.
- Mise en italique des mots accentués dans les `h1` via `<em>` — couleur `--ink-2` (un cran plus clair).

### 3.3 — Grammaire de mise en page

- **Largeur max éditoriale** : 1280px (full-width sections), 1100px (sections internes), 760px (page détail témoignage / récit long).
- **Padding pages** : 60–80px en haut/bas, 32px sur les côtés en desktop, 22px en mobile.
- **Filets** : `1.5px solid var(--ink)` pour les séparations majeures (en-tête de section), `1px solid var(--line-soft)` pour les divisions internes.
- **Coins arrondis** : 6px max sur les vidéos/posters, 999px pulls (chips, boutons pill rouges/bleus). Le reste est carré — c'est éditorial, pas Bootstrap.
- **Ombres** : `0 6px 0 #000` (offset solide noir) sur le frame du wireframe → **À SUPPRIMER en hi-fi**. Les ombres en hi-fi sont **soft** : `0 1px 2px rgba(0,0,0,.04), 0 4px 12px rgba(0,0,0,.06)`.
- **Espacement** : règle de proportion forte. Verticalement, jamais moins de 24px entre éléments adjacents non-liés. 60–80px entre sections.

### 3.4 — Boutons (vocabulaire)

| Classe | Usage | Style |
|---|---|---|
| `.btn-primary.is-video` | « LIVE », vidéo | Pill rouge `--note`, triangle play ▶ inline, ombre rouge douce, animation de pulsation |
| `.btn-blue` | « CONTRIBUER », « ÉCOUTER LE MESSAGE » | Pill bleu `--accent`, blanc, hover plus sombre |
| `.btn-secondary` | « Découvrir l'église » | Pill outline noir, hover = fond noir + texte blanc |
| `.btn-line` | Téléchargements (Audio MP3, PDF, etc.) | Rectangle outline noir, uppercase, 12px |
| `.more-line` | Liens « En savoir plus → » | Inline, soulignement 1px, uppercase 12px |

---

## 4 — Pages détaillées

### 4.1 — En-tête global (`<header class="site-header">`)

Présent sur **toutes** les pages. Trois zones :

1. **Gauche** : `<a class="site-logo" href="/">` — `<img>` du logo ovale RST + bloc texte `<div class="site-logo-name"><span class="big">RST</span><span class="sm">Roc Séculaire Tabernacle</span></div>`. Le texte est en Cinzel 600, le big est 18px, le sm 10px letter-spaced.
2. **Centre** : `<nav class="site-nav">` avec liens vers les 4 pages principales. État actif = soulignement rouge `--note` 2px (sauf sur la 04 où c'est neutre — la nav contextuelle prend le relais). Liens : « Accueil · Projet Néhémie · Histoire · L'Église ». Hover = couleur `--ink`.
3. **Droite** : `<div class="site-utility">` — pastille **LIVE** rouge pulsante (clic → page 04), commutateur de langue `FR | EN` (le actif est en `--accent`).

La hauteur fixe ~80px, fond `--paper`, filet bas 1px `--line-soft`. Sticky en scroll (avec backdrop-blur léger).

### 4.2 — Page 01 — Accueil

**Hero plein-écran** (min-height: 720px) avec deux colonnes :

- **Gauche (texte, ~57%)** : Eyebrow vide réservé. Trois lignes en flex-column centrées vers le **bas-gauche** :
  1. `Assemblée Chrétienne` en italique Cormorant 22px
  2. `Roc Séculaire Tabernacle` en **Cinzel 600**, 56–72px, color blanc-cassé
  3. CTAs : `[LIVE ▶]` (pill rouge pulsé) + `[Découvrir l'église]` (outline blanc)
  Background : noir profond avec **silhouette SVG de la Tour Eiffel** discrète (opacité ~0.18) à gauche, qui n'est pas dominante mais contextualise l'Île-de-France.
- **Droite (~43%)** : Portrait noir & blanc — par défaut WMB, peut tourner aléatoirement avec d'autres portraits liés au Message (rotation à chaque chargement via JS, pool extensible). object-position: center 18% pour cadrer sur le visage. Léger filtre grayscale + brightness pour intégrer.

Le hero a un filet vertical fin entre les deux colonnes.

**Bandeau « En direct »** (sticky sous le hero) : barre noire pleine largeur, `LIVE ●` pulsé + titre du message en cours / prochain culte + bouton « Écouter le message » (bleu pill).

**Section « Trois rendez-vous »** : grille 3 colonnes sur fond crème. Mercredi / Dimanche / Vendredi — chaque cellule contient `JOUR` (eyebrow), titre éditorial (« Étude biblique » / « Culte du dimanche » / « Veillée de prière »), horaire en **Trajan Pro / Cinzel** (`19H00 — 21H00`), et 1–2 lignes de description.

**Section « Notre prédication »** : citation biblique pleine largeur dans un encadré paper-2, suivi d'un paragraphe éditorial sur l'identité doctrinale de l'assemblée, suivi d'une citation Branham avec source.

**Section « Bâtissons ensemble »** (Néhémie banner) : 2 colonnes — image sanctuaire à gauche, texte éditorial à droite : eyebrow « Projet Néhémie · 2026 », titre `Bâtir une maison<br/><em>qui tient debout.</em>`, description, jauge de collecte `12 500 € / 50 000 €` (chiffres en **Bodoni Moda 60px**), CTA `[CONTRIBUER]` (pill bleu).

**Section « Quatre voies de soutien »** : grille 4 colonnes avec chiffres romains en `--f-serif` italique 88px **bleus** (I, II, III, IV) et texte court : Prière · Présence · Service · Don.

**Section « Le dernier message »** : eyebrow « Dimanche 26 avril 2026 · Culte », `<h3>` du titre + sous-ligne série (`L'ORDRE DE L'ÉGLISE #14 · LE RÉTABLISSEMENT DE L'AUTEL`), 1 paragraphe, bouton `[ÉCOUTER LE MESSAGE]` (bleu pill, fond `rgb(21, 54, 181)` inline).

**Footer global** (4 colonnes) : Identité (logo + 1 phrase) · Liturgie (pasteur, huissiers, musique, école du dimanche) · Onze nations · Contact. Mention légale en bas avec lien YouTube et commutateur FR/EN. Fond noir, texte blanc.

### 4.3 — Page 02 — Projet Néhémie

Page de fundraising éditorial. Plus dense.

- **Hero Néhémie** : titre `Néhémie<br/><em>est revenu bâtir.</em>`, lede de 3–4 lignes situant le projet (acquisition + rénovation du sanctuaire), photo sanctuaire pleine largeur en dessous.
- **Section « Pourquoi maintenant »** : récit en 2 colonnes, 1 citation biblique pull en bloc.
- **Section Avancement** : 3 cellules en grille égale — `OBJECTIF · 50 000 €` / `COLLECTÉ · 12 500 €` / `RESTE À COLLECTER · 37 500 €`. Chiffres énormes en **Bodoni Moda 60px** (Trajan inline pour l'objectif). Barre de progression fine (1.5px haut) en `--accent` sur 25%.
- **Section « Choisir votre contribution »** : 3 cards de montants (50€ / 200€ / Libre) en chiffres **Bodoni Moda**, chaque card avec un titre court, description du « ce que ça finance », et bouton `[Contribuer]` bleu.
- **Section « Comment donner »** : 4 modes (Virement · Chèque · Carte · Espèces) en grille avec icône typographique (lettre dans un cercle outline) et instructions précises (RIB partiel masqué, adresse postale du trésorier, lien Stripe placeholder).
- **Section « Les bâtisseurs »** : citation biblique de Néhémie, liste des membres déjà engagés (anonymisée par initiales), invitation à rejoindre.
- **Footer global** identique.

### 4.4 — Page 03 — Histoire

Page éditoriale longue, **monocolonne 760px max**, traitée comme un essai imprimé.

- **Hero** : pleine largeur fond crème, eyebrow `ÎLE DE FRANCE · DEPUIS 1999`, titre `Une assemblée née<br/><em>d'une fidélité.</em>`, lede.
- **Article** en 4 sections : `Les commencements (1999–2003)` · `L'enracinement (2003–2010)` · `L'extension (2010–2020)` · `Aujourd'hui (2020–...)`. Chaque section a un sous-titre `h2`, un paragraphe lede, du corps narratif, et au moins 1 citation pull (`blockquote.bigq` — 22–28px italique, filet bleu 2px à gauche).
- **Bloc « Les piliers »** : grille 4 colonnes (filet à droite entre chaque) — Pasteur · Musique · École du dimanche · Huissiers — chacun avec une mini-photo carrée, un nom, une fonction.
- **Citation finale** pleine largeur fond crème, citation Branham avec source.
- **Lien sortie** : `[Lire la fondation doctrinale →]` (un lien `more-line` simple).

### 4.5 — Page 04 — L'Église (vue par défaut « Cette semaine »)

C'est la page **vivante** du site, mise à jour hebdomadairement. La nav contextuelle apparaît juste sous le header global (filet bas 1.5px `--ink`) :

```
[Cette semaine]  Cultes  Cantiques  Annonces  Témoignages       [LIVE • FR | EN]
```

Vue par défaut **Cette semaine** :

- **Hero vlog** : video-poster 16:9 grand format avec image sanctuary, drapeau **EN DIRECT** rouge pulsant en overlay top-left, bouton play centré rond blanc, titre du dernier message à droite (eyebrow date + `h2` titre + 2 lignes de pitch + bouton `[Voir le replay]` bleu).
- **Section « Le fil du message »** : eyebrow + 2 paragraphes éditoriaux qui résument le sermon de la semaine, terminé par 1–2 versets cités.
- **Section « Images de la semaine »** : galerie 6 photos en grille asymétrique (2 grandes 4 petites), pas de lightbox, juste captions courtes.
- **Section duo « Cantique spécial » + « Témoignage de la semaine »** : 2 colonnes — cantique (titre, soliste, mini-player audio) + témoignage court (récit de 4 lignes signé).
- **Section « Annonces à venir »** : 3 cards (Réunion jeunes / Concert Aiglons / Voyage Marseille) avec date, titre, pitch, bouton `[Voir toutes les annonces]` qui pointe vers la sous-page 04d.

### 4.6 — Sous-page 04a — Cultes

Bibliothèque-ressource des prédications. **Pas de feed YouTube-like** — c'est un outil d'étude.

- **Hero Cultes** : eyebrow `LES PRÉDICATIONS DE L'ASSEMBLÉE`, titre `« La foi vient de ce qu'on entend, et ce qu'on entend vient de la Parole. »`, réf `ROMAINS 10 . 17` (en accent rouge `--note`), lede explicatif, encadré citation Branham (filet rouge sur fond crème).
- **Barre de filtres** : groupes `Classer par [Date | Série | Livre biblique]` + `Période [2026 | 2025 | 2024 | Archives ↓]` + champ recherche (icône ⌕ + input).
- **Layout 2 colonnes** :
  - **Gauche (320px)** : archive groupée par mois. Chaque mois a un label `AVRIL 2026` (filet bas noir), puis liste d'items `JOUR/DATE | TITRE | SÉRIE`. L'item actif a fond crème + filet gauche rouge.
  - **Droite (1fr)** : fiche de la prédication active.
    - Méta : `L'ORDRE DE L'ÉGLISE · #14` (eyebrow rouge) + `Dimanche 26 avril 2026 · 09H00`.
    - Titre `Le Roc qui<br/><em>ne tombe pas.</em>` + auteur `Rev. Robert Ndaye M.`
    - Vidéo poster 16:9 + runtime
    - **3 onglets internes** : `[Passages]` `[Citations Branham]` `[Plan]`. État actif = soulignement rouge.
      - **Passages** : 4 blocs ref + citation biblique en filet noir.
      - **Citations Branham** : 3 blocs source (sermon code) + citation italique en filet rouge.
      - **Plan** : liste numérotée romaine I–IV (numéro en `--f-serif` italique 28px **rouge accent**), chaque item a un sous-titre + description.
    - Footer actions : `[↓ Audio MP3]` `[↓ Vidéo MP4]` `[↓ Plan en PDF]` `[Partager]` (`btn-line` outline).

### 4.7 — Sous-page 04b — Cantiques

Hymnaire numérique. Trois familles : **Du recueil · Du Message · Composés ici**.

- **Hero Cantiques** : eyebrow `L'HYMNAIRE`, titre `Les chants<br/><em>de l'assemblée.</em>`, lede sur les 3 familles.
- **Barre de familles** : `[Tous · 84]` `[Du recueil · 62]` `[Du Message · 14]` `[Composés ici · 8]` (chips, actif = fond noir blanc) + champ recherche.
- **Grille de cartes** (4 colonnes) : chaque carte a une miniature 16:9 avec dégradé bleu profond (placeholder de pochette), bouton play rond blanc au centre, étiquette de famille en pied de miniature. Sous la miniature : titre cantique en `--f-serif` 18px, méta (chœur / soliste), pied avec № en **Bodoni Moda** + date d'enregistrement. Le **cantique vedette** prend 2×2 (`grid-row: span 2`).
- **Vue détail** (en bas de page, accessible par clic carte) : 2 colonnes — vidéo grand format à gauche, **paroles** à droite dans un panneau crème.
  - Toolbar paroles : `[A−] [A] [A+] | [↓ PDF]`
  - Versets numérotés (1, 2, 3) en `--f-serif` italique rouge, refrain marqué `℟` en filet gauche italique gris.

### 4.8 — Sous-page 04c — Annonces

Bulletin paroissial. **3 états temporels** :

- 🔵 **À venir** (filet bleu, drapeau bleu)
- 🔴 **Aujourd'hui** (filet rouge, drapeau rouge, point pulsant)
- ⚫ **Passée** (opacité 0.55, drapeau gris)

- **Hero** : `BULLETIN DE L'ÉGLISE` / `Ce qui vient,<br/><em>ce qui se prépare.</em>`
- **Filtres** : `[Toutes | À venir | Aujourd'hui | Passées]` + types (Réunion / Voyage / Sortie / Exceptionnelle).
- **Annonce phare** : carte 2 colonnes pleine largeur avec image (sanctuary) + drapeau de statut, body éditorial + grille 3 méta (Quand / Où / Type).
- **Chronologie** groupée par mois : `MAI 2026 · 3 annonces` puis liste de cards. Chaque card : grande date à gauche (jour 48px Bodoni Moda + libellé `SAM. MAI`), corps central (type-eyebrow + titre + 2 lignes), drapeau d'état à droite.

### 4.9 — Sous-page 04d — Témoignages

Mur narratif asymétrique. **Pas de note, pas d'étoiles, pas de Trustpilot.**

- **Hero** : `MUR DES TÉMOIGNAGES` / `Ce que Dieu<br/><em>a fait parmi nous.</em>` / lede sur la nature pastorale du témoignage.
- **Bar action** : `[+ Partager mon témoignage]` (`btn-line`) + compteur `94 témoignages · depuis 1999`.
- **Mosaïque 6 colonnes** mélangeant 3 types de cards :
  - **Citations courtes (`tem-quote`)** : fond crème, filet gauche noir (ou bleu pour les variantes), guillemet géant en glyphe Cormorant 64px, citation 18px serif, signature uppercase letter-spaced. Span 2 colonnes.
  - **Récits illustrés (`tem-illu`)** : grille 220px image / 1fr texte, sur fond paper avec border 1px. Eyebrow date + titre 22px + paragraphe + lien `[Lire le récit complet →]` + signature. Span 4 colonnes × 2 rangées.
  - **Récits texte (`tem-story`)** : pas d'image, eyebrow + titre + paragraphe + signature. Span 2–3 colonnes.
- **Vue détail récit long** : monocolonne 760px max, titre `h2` 52px serif, méta auteur, body en `--f-serif` 18px line-height 1.7, **lede 22px**, citation pull en filet bleu, encadré pied avec verset cité.

---

## 5 — Comportements interactifs

- **Onglets pages principales** (`.tab[data-tab]`) : clic → masque toutes les `.page`, affiche la cible. Scroll top instantané. Notifie le parent par `postMessage({ slideIndexChanged: N })`. **À convertir en navigation par URL hash** (`#/accueil`, `#/nehemie`, `#/histoire`, `#/eglise`) ou par routing SPA en hi-fi.
- **Nav contextuelle 04** (`.ctx-nav a[data-ctx]`) : clic → masque les `.ctx-view`, affiche `[data-ctx-view="<id>"]`. Scroll top du frame eglise.
- **Onglets internes Cultes** (`.stab[data-stab]`) : portée par sermon-col.
- **Familles cantiques** (`.fam[data-fam]`) : visuel uniquement dans le wireframe — en hi-fi, **filtrer la grille**.
- **Filtres chips** : toggle visuel par groupe, exclusivité (un seul actif par groupe).
- **Rotation portrait hero** : à chaque page load, pick aléatoire dans un pool d'images (extensible à nuée, motifs, etc.).
- **Pulsation LIVE** : animation CSS keyframe sur le point rouge de la pastille, du badge vidéo, et du tag « Aujourd'hui » en chronologie.
- **Sticky header** : opacité backdrop-filter blur(8px) au scroll.

---

## 6 — Ce qui change entre wireframe et hi-fi

| Élément | Wireframe | Hi-fi |
|---|---|---|
| Frame extérieur | `box-shadow: 6px 6px 0 #000` | **Supprimé** — édition pleine largeur |
| Annotations bleues | Visibles partout | **Toutes supprimées** (`<span class="annot">`) |
| Topbar avec onglets | Visible | **Remplacée par routing URL réel** ou nav globale unifiée |
| Tweaks panel | Présent | **Supprimé** (script + bouton) |
| Polices basse-fi | Caveat (manuscrit) | **Aucune** |
| Police annotations | Architects Daughter | **Aucune** |
| Frame `.frame.anchored` | Bordure cadre | **Supprimé**, flat layout |
| Photos/illustrations | Placeholders crème + texte | **Vraies photos** (l'utilisateur fournira ou tu utilises celles d'`assets/`) |
| Mode sketch | Disponible | **Désactivé** |
| Indicateurs de page-meta | Visibles en haut de chaque page | **Supprimés** |

---

## 7 — Stack technique recommandé

- **HTML/CSS/JS vanilla** ou **React 18 + Vite** (au choix). Pas de framework lourd type Next.js (overkill pour ce site quasi-statique).
- **Routing** : hash-based (`#/page`) ou client-side router minimal.
- **Pas de CMS** dans la première version, mais structurer le code pour qu'un futur CMS (Sanity, Decap) puisse alimenter les sections dynamiques (sermons, annonces, cantiques, témoignages).
- **Responsive** : breakpoints 820px (mobile) et 1280px (desktop). Mobile-first dans la mesure du raisonnable, mais le site est consulté à 70% sur desktop par les membres âgés.
- **Accessibilité** : contrastes AAA pour le corps, AA pour les méta. Toutes les images ont un `alt`. Navigation clavier complète. `aria-current` sur les liens actifs. `aria-live="polite"` sur les badges LIVE.
- **Performance** : images en `loading="lazy"` sauf le hero. Format AVIF/WebP avec fallback JPEG. Polices Google Fonts en `display=swap` avec preconnect.
- **SEO** : titres uniques par page, meta description, Open Graph (`og:title`, `og:image`, `og:description`), schema.org `Church` et `Event` pour les annonces.

---

## 8 — Ton & copywriting

Garde **toutes les copies du wireframe à l'identique** sauf instruction contraire. Si tu dois écrire de nouvelles copies (404, formulaire de contact, etc.) :

- Pas de superlatifs commerciaux (« incroyable », « unique », « extraordinaire »).
- Pas d'emoji.
- Pas de jargon Tech ni de novlangue startup.
- Phrases courtes, langue française soutenue mais pas guindée.
- Citations bibliques en français Louis Segond ou Darby, jamais en paraphrase moderne.
- Citations Branham toujours sourcées avec le code de sermon (ex. `63-0728`).

---

## 9 — Ce que tu dois LIVRER

1. Un dossier de projet structuré (`src/`, `public/`, `assets/`).
2. Les **8 pages** (4 principales + 4 sous-pages de la 04) entièrement codées, navigables, responsive.
3. Le **système de design** isolé dans `tokens.css` ou un thème (variables CSS).
4. Un fichier `README.md` qui explique la structure, comment ajouter un sermon / cantique / annonce / témoignage.
5. Un build de production prêt à déployer (`dist/` ou équivalent).
6. **Aucun lorem ipsum.** Aucun placeholder « TODO ». Le site est **présenté demain** — il doit être prêt à montrer.

---

## 10 — Ce que tu ne dois PAS faire

- ❌ Ne change pas la palette de couleurs.
- ❌ Ne remplace pas Cormorant / Cinzel / Bodoni Moda par d'autres polices.
- ❌ N'ajoute pas de gradients colorés à la mode (mauve→rose, etc.).
- ❌ N'ajoute pas d'animations Lottie / particules / scroll-jacking.
- ❌ N'ajoute pas de sections « Stats » avec des chiffres inventés (« 500+ membres », « 20 ans d'histoire » — sauf si le wireframe les contient déjà).
- ❌ Ne mets pas d'emoji nulle part.
- ❌ Ne change pas la sémantique des couleurs (rouge = vidéo only).
- ❌ Ne mets pas de carrousels infinis ni de modales pop-up de newsletter.
- ❌ Ne génère pas de SVG d'illustration cartoon. Si tu manques d'image, mets un placeholder gris uni avec un caption explicite (« photo à fournir »).

---

**Tu travailles pour une assemblée chrétienne posée et sérieuse. Le site doit refléter ça : sobre, dense, beau, lisible, sans bruit. Vise l'élégance d'une revue éditoriale — pas le clinquant d'une megachurch.**

Bonne reproduction.
