# JOURNAL — Refonte visuelle Liquid Glass (branche `feat/glass-redesign`)

> Mission : appliquer un langage visuel inspiré de **iOS 26 / macOS Tahoe Liquid Glass** sur la vitrine RST, sans toucher à la logique React, aux données, au routing, à l'i18n ou aux fichiers `.tsx`.
> Référence : `design-reference/glass-bundle/RST Liquid Glass Design System/`.

---

## 1. Périmètre — fichiers modifiés

### Tokens / globaux
- `src/styles/tokens.css` — ajout de tokens `--glass-*`, ramp d'encre froide, ombres multi-couches, easing, glass blur recipe. **Conservation** des tokens historiques (`--ink`, `--paper`, `--accent`, `--note`, `--f-serif`, `--f-engrave`, `--f-num`) pour ne rien casser dans les CSS Modules existants. La famille `--f-body` est repipée vers la stack SF Pro / Inter pour adopter la voix glass partout.
- `src/styles/global.css` — fond canvas bluish-off-white avec dégradés radiaux ambiants (rouge/bleu très diffus), conservation du reset et de la sémantique `blockquote.bibl/.bran`, `.lede`, `.num`, `.engrave`, `.container*`, `.skip-link`, `.hairline*`.

### Layout
- `src/components/layout/Header/Header.module.css` — header sticky en panneau de verre flottant (max-width contenue dans une pill nav), backdrop-blur, lift au hover sur les liens, conservation totale de la logique `.hidden`/`.scrolled`/`.onDark`/`.onLight`/`.onProtectedDark` et du drawer mobile.
- `src/components/layout/Footer/Footer.module.css` — bascule vers un footer clair en glass léger (toujours posé sur le canvas), ramp neutre cool, accents `--note` conservés sur les CTA YouTube/map.

### Composants UI
- `src/components/ui/Button/Button.module.css` — variantes `video` (rouge — LIVE), `blue` (bleu primaire glassé), `secondary` (glass neutre + outline subtle), `line`, `more` ; hover scale 1.02, press scale 0.97.
- `src/components/ui/LivePill/LivePill.module.css` — pill rouge en glass (fill `--rst-red` + ombre rouge + dot pulsant blanc), arrondi 999px conservé.
- `src/components/ui/Eyebrow/Eyebrow.module.css` — typographie tracking glass, bascule vers ink-cool ramp.
- `src/components/ui/Citation/Citation.module.css` — citations toujours en serif, filets `--ink` / `--note` / `--accent` conservés ; subtilement encadrées en panneau crème glassé.
- `src/components/ui/HairlineDivider/HairlineDivider.module.css` — inchangé sémantiquement (filet souple/majeur).

### Pages
- `src/routes/Accueil.module.css` — **HERO INTOUCHÉ** (image Jésus + masques de transition + radial blue côté texte). Sections `schedule`, `lastMsg`, `histoire`, `nehemieBanner` glassées en cartes flottantes sur canvas neutre.
- `src/routes/Nehemie.module.css` — **HERO INTOUCHÉ** (image lieu + panneau bleu + verset). Sections projet/stats/gallery/futurePanel glassées, `participationBand` conservée mais panneaux internes glassés.
- `src/routes/Genese/*.module.css` — bandes éditoriales glassées légèrement, conservation des typos sérif Cormorant.
- `src/routes/Eglise/EgliseLayout.module.css` — sous-nav contextuelle adaptée en pill flottante glass.
- `src/routes/Eglise/{Cultes,Cantiques,CetteSemaine,Annonces,Temoignages,AnnonceDetail}.module.css` — cartes principales glassées.
- `src/components/ui/Lightbox/Lightbox.module.css` — scrim glass + modale arrondie 28px.
- `src/routes/DesignSystem.module.css` — ajustements mineurs.

### NON modifiés (interdits par §4 du brief)
- Aucun `.tsx`, aucun `.ts`, aucun fichier `data/`, `types/`, `i18n/`, `App.tsx`.
- Aucune image dans `public/` ni `assets-source/`.
- `package.json`, `CLAUDE.md`, `PRD.md`, `README.md`.

---

## 2. Palette glass extraite (codes hex exacts)

Pipettés depuis `design-reference/glass-bundle/RST Liquid Glass Design System/colors_and_type.css`.

### Marque (accents identitaires conservés)
| Token glass         | Hex / valeur                       | Usage                              |
|---------------------|------------------------------------|------------------------------------|
| `--rst-red`         | `#C8332A`                          | LIVE pill, vidéo, italiques d'accent rouges |
| `--rst-red-deep`    | `#A6231A`                          | hover/pressed rouge                |
| `--rst-red-soft`    | `#E26057`                          | tint clair                         |
| `--rst-red-wash`    | `rgba(200, 51, 42, 0.08)`          | glass tint chaud                   |
| `--rst-blue`        | `#1E47A1`                          | CTA primaire, focus rings, accent bleu (s'éloigne du bleu marine `#15364B` historique mais reste l'identité RST officielle pipettée du logo) |
| `--rst-blue-deep`   | `#15366E`                          | hover/pressed bleu                 |
| `--rst-blue-soft`   | `#4F73C7`                          | tint clair                         |
| `--rst-blue-wash`   | `rgba(30, 71, 161, 0.08)`          | glass tint froid                   |

> Note d'arbitrage : la palette glass propose `--rst-blue: #1E47A1` (bleu Apple-style plus clair que le bleu marine `#15364B` du design éditorial actuel `--accent`). Le brief §7 demande de préserver "le bleu RST officiel pipetté du logo" — j'interprète comme `#1E47A1` du bundle. Je conserve `--accent: #15364B` côte à côte pour ne pas casser les CSS Modules qui s'y réfèrent (Footer, Eglise, Genese), mais je le rapproche du nouveau bleu glass pour cohérence visuelle.

### Foundation neutre (off-white bluish iOS-style)
| Token              | Valeur     | Usage                                     |
|--------------------|------------|-------------------------------------------|
| `--bg-canvas`      | `#F5F7FB`  | fond global de page                       |
| `--bg-elevated`    | `#FFFFFF`  | surface solide rare                       |
| `--bg-tint`        | `#EEF1F7`  | bande tintée subtile                      |
| `--bg-tint-deep`   | `#E4E9F2`  | bande plus marquée                        |

### Encre — ramp neutre froide 5 paliers
`--ink-1: #0B0F19` → `--ink-2: #2A2F3D` → `--ink-3: #5A6173` → `--ink-4: #8A91A3` → `--ink-5: #B8BDCC`.

> Mapping vers les anciens tokens : `--ink` (= `#0C0E14`) reste pour ne rien casser ; `--ink-2` glissé vers `#2A2F3D` (très proche du `#2A2E3A` actuel) ; `--ink-3` glissé vers `#5A6173`.

### Glass fills
| Token              | Valeur                               | Usage                                  |
|--------------------|--------------------------------------|----------------------------------------|
| `--glass-thin`     | `rgba(255,255,255,0.45)`             | sur-imagerie, feather-light            |
| `--glass-regular`  | `rgba(255,255,255,0.62)`             | surfaces par défaut                    |
| `--glass-thick`    | `rgba(255,255,255,0.78)`             | cartes lisibles                        |
| `--glass-solid`    | `rgba(255,255,255,0.92)`             | quasi-opaque (modales)                 |
| `--glass-blue`     | `rgba(229,235,248,0.62)`             | tint cool                              |
| `--glass-warm`     | `rgba(252,248,245,0.62)`             | tint chaud                             |
| `--glass-dark`     | `rgba(20,24,38,0.55)`                | glass dark (héros sombres)             |
| `--glass-dark-thick` | `rgba(20,24,38,0.78)`              | glass dark dense                       |

### Backdrop blur
- `--glass-blur: blur(40px) saturate(180%)` — par défaut.
- `--glass-blur-strong: blur(60px) saturate(200%)` — héros / modales.
- `--glass-blur-light: blur(20px) saturate(160%)` — chrome (pills, boutons).

### Bordure glass
- `--glass-border: 1px solid rgba(255,255,255,0.5)`.
- `--glass-inset-highlight: inset 0 1px 0 0 rgba(255,255,255,0.7), inset 0 -1px 0 0 rgba(0,0,0,0.04)`.

### Ombres multi-couches
- `--shadow-1` : très soft (1px + 2px blur).
- `--shadow-2` : élévation moyenne (4px + 16px blur + inset highlight).
- `--shadow-3` : carte par défaut (1+4+16 px stacks 3-8% noir).
- `--shadow-4` : modale flottante (24+48+96 px).
- `--shadow-hover` : lift au hover (carte qui prend de la hauteur).
- `--shadow-blue` : `0 4px 12px rgba(30,71,161,.18)` — ombre teintée bleue pour CTA primaire.
- `--shadow-red` : `0 4px 12px rgba(200,51,42,.22)` — ombre teintée rouge pour LIVE.

### Radii
- `--r-xs: 8px`, `--r-sm: 12px` (boutons), `--r-md: 16px` (cartes par défaut), `--r-lg: 20px` (cartes héros), `--r-xl: 28px` (modales), `--r-2xl: 36px`, `--r-pill: 999px`.

> Conservation du `--r-sm: 6px` historique pour vidéos/posters de la vitrine ? Non — je le passe à 12px pour adopter le langage glass (les vidéos auront un radius plus généreux). C'est bien dans le périmètre CSS pure (rule §4 ok).

### Motion
- `--ease: cubic-bezier(0.4, 0, 0.2, 1)`.
- `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`.
- `--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)` (réservé moments délice).
- `--t-fast: 180ms`, `--t-base: 320ms`, `--t-slow: 520ms`.
- `--hover-lift: scale(1.02)`, `--press-shrink: scale(0.97)`.

---

## 3. Typographie glass extraite

| Token        | Stack                                                                                       | Usage                                              |
|--------------|---------------------------------------------------------------------------------------------|----------------------------------------------------|
| `--f-display`| `"SF Pro Display", -apple-system, BlinkMacSystemFont, "Inter", system-ui, sans-serif`       | titres display, h1-h4 modernes                     |
| `--f-text`   | `"SF Pro Text", -apple-system, BlinkMacSystemFont, "Inter", system-ui, sans-serif`          | corps UI, nav, boutons, captions — alias de `--f-body` |
| `--f-serif`  | `"Cormorant Garamond", "EB Garamond", Georgia, serif`                                       | mots italiques accentués (« le **Roc** », « **adorer et édifier** »), citations |
| `--f-engrave`| `"Cinzel", "Trajan Pro", serif`                                                             | wordmark "ROC SÉCULAIRE TABERNACLE", eyebrows engravés rares, horaires de culte |
| `--f-num`    | `"Bodoni Moda", "Didot", "Bodoni 72", serif`                                                | conservé pour les chiffres éditoriaux (collecte, dates) — l'identité numérique RST y tient |

### Échelle fluide
- `--t-display: clamp(48px, 7vw, 88px)`.
- `--t-h1: clamp(40px, 5.4vw, 64px)`.
- `--t-h2: clamp(30px, 3.8vw, 44px)`.
- `--t-h3: clamp(22px, 2.4vw, 28px)`.
- `--t-h4: 18px`, `--t-body: 16px`, `--t-body-sm: 14px`, `--t-caption: 13px`, `--t-eyebrow: 11px`.

### Stratégie d'application
- Le bundle dit "SF Pro pour tout, Cormorant en accent italique seulement". Or la vitrine actuelle est massivement en Cormorant (h1-h6, p, blockquotes). Je **garde Cormorant pour les titres éditoriaux** et **bascule `--f-body` vers SF Pro** : les eyebrows, captions, méta, nav, boutons reçoivent SF Pro / Inter (cleanier, plus iOS). Les `<p>` héritent de Cormorant — c'est la voix éditoriale conservée. Compromis qui honore la voix RST tout en injectant le langage Apple sur le chrome.

---

## 4. Composants glass clés identifiés

| Composant          | Recipe glass                                                                                          |
|--------------------|-------------------------------------------------------------------------------------------------------|
| **Header sticky**  | Pill flottante, `--glass-regular` + `--glass-blur-strong`, border 1px white-translucent, `--shadow-2` + inset highlight, max-width `--max-width`, marges 16px. Lift hover 1.02 sur les liens. |
| **Footer**         | Footer clair posé sur canvas (pas glass blurré pour éviter cost GPU sur la zone basse), fond `var(--bg-tint)` avec hairline, ink ramp ; CTA YouTube/map en accent `--rst-red`. |
| **Button glass primary (.blue)** | Fill `--rst-blue`, `--shadow-blue`, hover `--rst-blue-deep` + lift, radius `--r-pill`. |
| **Button glass neutral (.secondary)** | Fill `--glass-thick`, border `rgba(255,255,255,0.6)`, `--shadow-2` + inset highlight, radius `--r-pill`. |
| **Button live (.video)** | Fill `--rst-red`, `--shadow-red`, animation glow conservée. |
| **LivePill**       | Fill `--rst-red`, ombre teintée rouge, dot pulsant `1.6s ease-in-out`. |
| **Carte feature/section** | Fill `--glass-thick`, blur `--glass-blur` (uniquement où le perf le permet), border, `--shadow-3`, radius `--r-lg`. Hover : `scale(1.02)` + ombre plus profonde. |
| **Sous-nav Eglise** | Pill flottante glass sticky (`--glass-blur-light`, `--glass-thick`). |
| **Modale (Lightbox)** | `--glass-solid` + `--glass-blur-strong`, radius `--r-xl`, `--shadow-4` ; scrim `rgba(11,15,25,.32)` + blur 8px. |

### Performance — règle d'application
- `backdrop-filter` UNIQUEMENT sur : header sticky, sous-nav sticky, modale, encadré verset hero Néhémie (déjà existant), pill nav active, lightbox.
- Pour les cartes de section internes : fond semi-opaque (`rgba(255,255,255,0.78)` sur canvas) + ombre soft, **sans** backdrop-filter. C'est visuellement très proche, beaucoup moins coûteux GPU.
- @media (max-width: 820px) : remplacement systématique des `backdrop-filter` par fonds plus opaques (`rgba(255,255,255,0.92)`).

---

## 5. Éléments de la vitrine actuelle intouchables (cf. §4 et §5 du brief)

### Image hero composite Accueil — JÉSUS + cercles RST
Fichiers concernés (CSS UNIQUEMENT — pas modifiés en TSX) :
- `src/routes/Accueil.module.css` — règles à **NE PAS TOUCHER** :
  - `.hero` (fond `#02040f`, `min-height: 100vh`, padding-top header).
  - `.hero::before` (transition noir-vers-clair côté gauche, masque le bord du masque).
  - `.heroBackdrop`, `.heroInner` (grille colonnes).
  - `.heroJesus`, `.heroJesusImg` (et leurs masks `mask-image: linear-gradient(90deg,...)` qui forment la transition de couleur main-crafted).
  - `.heroJesus::before`, `.heroJesus::after` (vignettages radiaux qui adoucissent la frontière).
  - `.heroTextGroup::before` (radial blue qui simule les cercles RST côté texte).
  - Tout le bloc responsive `@media (max-width: 820px) .heroJesus*` (la composition mobile a été calibrée à la main).
- Ne pas toucher aux balises `<img>` Accueil dans le `.tsx` (interdit par §4 de toute façon).
- Ne pas modifier `public/images/jesus.jpg`.

Je peux ajuster autour : `.heroAssemblee`, `.heroTitle`, `.heroCtas`, `.heroGhostBtn` (couleurs/typo glass-friendly mais sans dénaturer la mise en scène).

### Image hero Néhémie
- `src/routes/Nehemie.module.css` — règles à **NE PAS TOUCHER** :
  - `.hero` (grille 1fr 9fr, `min-height: 100svh`, fond `#06091c`).
  - `.heroDark` (panneau bleu sombre).
  - `.heroImg`, `.heroImgEl`, `.heroImg::before` (gradients de fondu bleu→image).
  - `.heroContent` (positionnement absolu du texte sur l'image).
  - `.heroQuoteBox` (encadré verset déjà glassé — `rgba(6,9,28,.82)` + blur 6px ; je le laisse intact).
  - Bloc responsive `@media (max-width: 820px) .hero*` (calibrage mobile).
- Ne pas toucher à `public/images/sanctuaire.jpeg`.

Je peux ajuster autour : couleurs des typos hero (heroTitle, heroSub) si besoin de cohérence ink-ramp, mais préserver lisibilité sur fond sombre.

### Conservation absolue — composition / structure / contenu
- Aucun `.tsx` / `.ts`.
- Aucune réorganisation de l'ordre des sections.
- Aucun changement de copy textuel.
- Aucune nouvelle dépendance npm.

---

## 6. Plan d'exécution — ordre des commits

1. `feat(glass): add liquid-glass tokens alongside legacy palette` — `tokens.css`.
2. `feat(glass): apply ambient gradient canvas to global body` — `global.css`.
3. `feat(glass): convert sticky header to floating glass pill nav` — `Header.module.css`.
4. `feat(glass): rework footer with glass-light surface on canvas` — `Footer.module.css`.
5. `feat(glass): liquid-glass UI primitives (Button, LivePill, Eyebrow, Citation, HairlineDivider, Lightbox)` — composants ui/.
6. `feat(glass): apply liquid glass to homepage sections (preserve hero composite)` — `Accueil.module.css`.
7. `feat(glass): apply liquid glass to Nehemie sections (preserve hero composite)` — `Nehemie.module.css`.
8. `feat(glass): liquid-glass treatment for Genese pages` — `Genese/*.module.css`.
9. `feat(glass): liquid-glass treatment for Eglise pages and sub-nav` — `Eglise/*.module.css`.
10. `chore(glass): typecheck + lint pass` — vérifications finales si nécessaires.

---

## 7. Limitations / suggestions (à valider au réveil)

### Préexistants (non liés au glass)
- **Lint warning sur `Header.tsx` ligne 56** (`react-hooks/exhaustive-deps` — `burgerRef.current` may have changed). Cette warning est préexistante sur `main` et le brief §4 m'interdit de modifier les `.tsx`. `pnpm lint` se termine donc avec exit 1 à cause du `--max-warnings 0`. Solution proposée à valider : copier `burgerRef.current` dans une variable locale de l'effet (3 lignes de code dans `Header.tsx`) — à faire si tu valides la branche.

### Choix d'arbitrage assumés
- **Bleu RST**. Le bundle glass propose `#1E47A1` (Apple-flavored) alors que la vitrine actuelle utilisait `#15364B` (bleu marine). J'ai basculé `--accent` vers `#1E47A1` (alias de `--rst-blue`) car le brief §7 demande "le bleu pipetté du logo officiel" — le bundle glass affirme l'avoir pipetté du logo, donc je m'aligne. Si tu préfères revenir au bleu marine `#15364B`, il suffit de modifier la ligne `--rst-blue` dans `tokens.css`.
- **Cormorant conservé** sur les `<p>` et headings éditoriaux malgré la recommandation du bundle de tout passer en SF Pro. C'est la voix RST — préservée. SF Pro n'arrive que sur le chrome (nav, eyebrows, méta, captions, boutons).
- **Bodoni Moda conservé** pour les chiffres (--f-num) malgré le bundle qui pousse SF Pro pour tout. C'est l'ADN éditorial du site (collecte, dates, durées) — gardé.
- **Header `.onProtectedDark`** garde son fond `#06091c` solide (pas de glass) pour s'adosser parfaitement à la bande hero des pages Genese / Eglise — la transition glass aurait montré une frontière visible.

### Suggestions hors-périmètre (à valider/rejeter)
- Le `--max-warnings 0` du script lint est strict. Si tu valides la branche, il faudra soit corriger le warning préexistant dans `Header.tsx` (1 effet à patcher), soit assouplir `--max-warnings`.
- Le `participationBand` de `Nehemie` reste full-bleed dark (volontaire — moment de contraste éditorial). Si tu préfères un panneau glass uniforme, c'est facile à faire.
- Les fichiers `.module.css` comportent des références `rgba(12, 14, 20, .x)` qui correspondent à l'ancien ink charbon ; elles n'ont pas toutes été migrées vers `var(--ink-1)` etc. pour limiter la surface de diff. Le rendu reste cohérent car `--ink: #0C0E14` est toujours défini. Migration full-token possible en un commit dédié.

### Pages effectivement glassées (récap)
- `/` (Accueil) — hero **intouché**, sections post-hero glassées.
- `/nehemie` — hero **intouché**, sections post-hero glassées.
- `/genese` (Sommaire) + 9 sous-pages PageGenese — sub-nav glass, articles éditoriaux en cartes glass.
- `/eglise` (CetteSemaine) — sub-nav glass, hero, fil, galerie, duo, annonces.
- `/eglise/cultes` — filtres + chips glass, board glass, lecteur vidéo glass.
- `/eglise/cantiques` — familles glass, vignettes radius, lyrics panel glass.
- `/eglise/annonces` — featuredCard glass card, filtres glass.
- `/eglise/temoignages` — actions bar glass, mosaic tiles glass (quote / story / illu).
- `/eglise/annonces/:id` (AnnonceDetail) — poster frame glass, CTA bleu pill.
- `/design-system` — hérite tout du tokens.css (rien à toucher).

---

## 8. État d'avancement

- [x] Lecture du bundle glass (SKILL, README, colors_and_type, components, index.html).
- [x] Lecture des tokens et global RST actuels.
- [x] Inventaire des `.module.css`.
- [x] Plan détaillé écrit (ce document).
- [x] Application du glass sur tokens + global.
- [x] Application du glass sur header/footer.
- [x] Application du glass sur composants UI.
- [x] Application du glass sur pages (Accueil, Nehemie, Genese, Eglise).
- [x] Vérification : `pnpm tsc --noEmit` passe (exit 0).
- [x] Vérification : `pnpm build` réussit (159 kB CSS, 414 kB JS).
- [x] Vérification : les 8 routes répondent en HTTP 200 sur `pnpm dev`.
- [⚠] `pnpm lint` : 1 warning préexistant non-glass dans Header.tsx (cf. §7).

### Commits réalisés sur la branche

```
git log --oneline feat/glass-redesign --not main
```
1. `feat(glass): introduce liquid-glass tokens and ambient canvas`
2. `feat(glass): convert header and footer to liquid-glass surfaces`
3. `feat(glass): liquid-glass treatment on UI primitives`
4. `feat(glass): apply liquid glass to homepage sections`
5. `feat(glass): apply liquid glass to Nehemie sections`
6. `feat(glass): liquid-glass treatment for Genese pages`
7. `feat(glass): liquid-glass treatment for Eglise pages`
8. `chore(glass): finalize JOURNAL-GLASS.md`
