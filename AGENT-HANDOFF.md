# AGENT-HANDOFF — RST Vitrine

> **À qui s'adresse ce document ?**
> À tout agent (humain ou LLM) qui reprend le code de la vitrine RST pour y
> apporter des modifications, et notamment au prochain agent dont la mission
> est de **brancher cette vitrine sur l'API du back-office interne** (la web
> app d'administration que l'équipe RST utilisera pour publier prédications,
> cantiques, annonces, témoignages, etc.).
>
> Ce document n'est pas exhaustif — il extrait les décisions et patterns
> structurants qui ne se devinent pas en lisant le code. Pour le détail
> métier (modèles, endpoints attendus, workflow admin), voir `PRD-ADMIN.md`
> à la racine du repo.

---

## 1. Quick orientation (30 secondes)

- **Nature** : SPA React 18 + Vite 5 + TypeScript strict + CSS Modules.
  Vitrine publique de l'assemblée *Roc Séculaire Tabernacle* (Vitry-sur-Seine).
- **Design system** : iOS-26 *Liquid Glass* (tokens dans `src/styles/tokens.css`,
  base globale dans `src/styles/global.css`). Voix éditoriale Cormorant
  Garamond pour les titres et corps long, SF Pro / Inter pour l'UI, Bodoni
  Moda pour les chiffres, Cinzel pour les éléments engravés rares.
- **Déploiement** : GitHub Pages via `.github/workflows/deploy.yml` à chaque
  push sur `main`. La base path est résolue automatiquement depuis
  `GITHUB_REPOSITORY` dans `vite.config.ts` (override avec `VITE_BASE`).
- **Données** : actuellement statiques (`src/data/*.ts`). Mission du prochain
  agent = remplacer ces imports par des appels API vers le back-office.
- **Branche** : `main` est lue en direct par le manager du client. Toujours
  **créer une branche dédiée** depuis `main` pour tout travail non urgent.
  Ne pas pousser sur `main` directement.

### Commandes utiles

```bash
pnpm dev          # Dev server sur http://localhost:5173/
pnpm build        # tsc -b && vite build
pnpm typecheck    # tsc --noEmit
pnpm lint         # ESLint strict
pnpm preview      # Sert la build de prod localement
```

---

## 2. Arborescence essentielle

```
src/
├─ App.tsx                  # Routes + Shell (gère le masquage du Header/Footer
│                             pour les watch pages immersives)
├─ main.tsx
├─ assets/                  # Images bundlées (Vite resolve via import.meta.glob)
│  └─ nehemie/              # Galerie sanctuaire (auto-discovered, cf. Néhémie)
├─ components/
│  ├─ layout/
│  │  ├─ Header/            # Header global glass-sticky, gère 4 états
│  │  │                       (onDark, onLight, scrolled, onProtectedDark)
│  │  └─ Footer/
│  └─ ui/                   # Atoms + composants partagés
│     ├─ Button/
│     ├─ Citation/
│     ├─ Eyebrow/
│     ├─ FilterSheet/       # Modal bottom-sheet iOS-like (mobile)
│     ├─ HairlineDivider/
│     ├─ HymnaireBrowser/   # Contenu hymnaire partagé (search + grid + recueil)
│     ├─ Lightbox/
│     ├─ LivePill/          # Bouton LIVE pulse
│     └─ YouTubePlayer/     # Wrapper de l'IFrame Player API + overlay custom
├─ data/                    # ⚠️  À REMPLACER PAR DES APPELS API (cf. §4)
│  ├─ annonces.ts
│  ├─ cantiques.ts
│  ├─ genese/               # 10 fichiers : un par sous-page Genèse
│  ├─ images-semaine.ts
│  ├─ nehemie.ts
│  ├─ rendez-vous.ts
│  ├─ sermons.ts
│  ├─ sessions-adoration.ts
│  ├─ temoignages.ts
│  └─ vlog-semaine.ts
├─ hooks/
│  ├─ useScrollDirection.ts
│  └─ useSubnavOnDark.ts    # Détection dynamique du fond de la subnav (cf. §6)
├─ i18n/                    # react-i18next, fr + en
├─ routes/                  # Une route = une page (.tsx) + .module.css
│  ├─ Accueil.tsx
│  ├─ Nehemie.tsx
│  ├─ DesignSystem.tsx      # /design-system : showcase tokens (dev only)
│  ├─ NotFound.tsx
│  ├─ Eglise/
│  │  ├─ EgliseLayout.tsx   # Subnav L'Église (5 onglets)
│  │  ├─ CetteSemaine.tsx   # /eglise (default)
│  │  ├─ Cultes.tsx         # /eglise/cultes — bibliothèque des prédications
│  │  ├─ CultesWatch.tsx    # /eglise/cultes/watch/:id — lecteur immersif
│  │  ├─ Cantiques.tsx      # /eglise/cantiques — entry hymnaire (hero + embed)
│  │  ├─ CantiquesWatch.tsx # /eglise/cantiques/watch/* — 3 modes (browse/cantique/session)
│  │  ├─ Annonces.tsx + AnnonceDetail.tsx
│  │  └─ Temoignages.tsx
│  └─ Genese/
│     ├─ GeneseLayout.tsx   # Subnav Genèse (8 onglets)
│     ├─ Sommaire.tsx
│     ├─ PageGenese.tsx     # Wrapper générique partagé par les 10 sous-pages
│     ├─ Presentation.tsx
│     └─ … (Naissance, Mission, Branham, Actes, Offices, Services,
│           Marseille, ReunionJeunes2005)
├─ styles/
│  ├─ global.css            # Reset, baseline typo, safe-area, anti-zoom iOS,
│  │                          tap-highlight, min-height pour [data-page-hero]
│  └─ tokens.css            # ⭐ Source de vérité visuelle (couleurs, glass,
│                             shadows, radii, motion, fonts, safe-area)
├─ types/index.ts           # Contrat TypeScript = futur contrat des serializers
└─ utils/
   ├─ asset.ts              # asset('/path') → préfixe le base path Vite
   └─ youtube.ts            # youtubeId() / youtubeThumbnail() helpers
```

---

## 3. Tech stack & conventions

- **React 18.3** (functional components + hooks uniquement, pas de class).
- **TypeScript strict** (`tsc --noEmit` doit passer ; `noUnusedLocals` actif).
- **React Router v6** avec routes nested. `App.tsx > Shell` regarde le pathname
  pour masquer Header/Footer sur les watch pages (`isWatchPage`).
- **CSS Modules** (`*.module.css`). Pas de Tailwind, pas de styled-components.
  Les classes sont hashées : importer la même feuille depuis 2 fichiers
  partage les hashes (cf. `HymnaireBrowser` qui importe les styles de
  `CantiquesWatch.module.css`).
- **i18n** : `react-i18next` + `i18next-browser-languagedetector`. Le sélecteur
  FR/EN vit dans le Header. Toutes les chaînes texte des landing pages
  passent par `t('clé')`.
- **Pas de state manager** (pas de Redux/Zustand). Les pages tirent leurs
  données directement depuis `src/data/*.ts`.
- **Aliases** : `@/` → `src/` (cf. `vite.config.ts`).

---

## 4. ⚠️ DATA LAYER — la mission du prochain agent

Tous les fichiers `src/data/*.ts` sont **statiques** et **simulent** ce que
fournira l'API du back-office. Chaque fichier exporte une constante typée
selon `src/types/index.ts`. Le contrat de champs est celui que doivent
renvoyer les serializers Django (cf. PRD-ADMIN.md §3 *Modèle de données*).

| Fichier                         | Type exporté            | Pages consommatrices                            |
| ------------------------------- | ----------------------- | ----------------------------------------------- |
| `annonces.ts`                   | `Annonce[]`             | Annonces.tsx, AnnonceDetail.tsx                 |
| `cantiques.ts`                  | `Cantique[]` + `cantiqueCounts` | Cantiques.tsx, CantiquesWatch.tsx, HymnaireBrowser |
| `genese/*.ts`                   | `PageGeneseData`        | Sommaire.tsx, PageGenese.tsx (wrapper)          |
| `images-semaine.ts`             | `ImageSemaine[]`        | CetteSemaine.tsx                                |
| `nehemie.ts`                    | `ProjetNehemie`         | Nehemie.tsx, Accueil.tsx (bandeau projet)       |
| `rendez-vous.ts`                | `RendezVous[]`          | Accueil.tsx, CetteSemaine.tsx                   |
| `sermons.ts`                    | `Sermon[]`              | Cultes.tsx, CultesWatch.tsx, CetteSemaine.tsx   |
| `sessions-adoration.ts`         | `SessionAdoration[]`    | Cantiques.tsx, CantiquesWatch.tsx, HymnaireBrowser |
| `temoignages.ts`                | `Temoignage[]`          | Temoignages.tsx, CetteSemaine.tsx               |
| `vlog-semaine.ts`               | `VlogSemaine`           | CetteSemaine.tsx                                |

### Stratégie de remplacement recommandée

1. **Garder les types intacts** (`src/types/index.ts`) — c'est le contrat
   commun front ↔ back. Si un champ doit évoluer, coordonner avec le
   back-end (faire des migrations propres, pas de breaking change silencieux).
2. **Remplacer les exports `data/*.ts`** par des hooks `useXxx()` qui
   appellent l'API. Suggestion : `src/api/` pour les fetchers, `src/hooks/`
   pour les `useAnnonces()`, `useSermons()`, etc.
3. **Loader / error states** : ajouter des skeletons Glass-style (déjà des
   tokens shadows/glass à dispo). Ne pas casser le visuel : afficher des
   placeholders qui ressemblent au layout final.
4. **Auth** : la vitrine est **publique** — pas de login user-facing.
   Le back est privé (PRD-ADMIN §6). Les appels API peuvent rester
   anonymes/cache CDN. Auth Django session restera sur `admin.rocseculaire.fr`.
5. **i18n** : actuellement seuls les clés UI sont traduites ; le contenu
   métier (titres de sermons, paroles, annonces, etc.) est unilingue.
   PRD-ADMIN décrit les `SermonTraduction`/`CantiqueTraduction` à venir.

### Détails à respecter par flux

- **Sermons** : un `Sermon` peut avoir une `typeCulte`, des `passages`,
  citations Branham, plan, série. Le filtre `/eglise/cultes` exploite
  `typeCulte` + `predicateur` + `serie` + `année`. Préserver ces champs.
- **Cantiques** : un `Cantique` a une `famille` (`recueil` | `special` |
  `adoration`), des `occurrences[]` (chaque occurrence = une vidéo
  YouTube avec `startSec`/`endSec` optionnels), des `lyrics[]` structurés
  en `VerseBlock[]`. Le watch player fait du deep-linking via les startSec.
- **Sessions adoration** : indexées via `cantiquesContenus[]` (cantiqueId
  + timecode). Le SessionView fait de l'**auto-sync** des paroles via
  `onTimeUpdate` (cf. §6). Les timecodes doivent être respectés.
- **Annonces** : champ `statut` (`a-venir` | `aujourd-hui` | `passee`) +
  `contentBlocks` (compte-rendu post-événement). Cf. PRD §3.
- **Néhémie** : singleton (`projetNehemie`). La galerie sanctuaire utilise
  `import.meta.glob('../assets/nehemie/*.{png,jpg,jpeg,webp}', { eager: true })`
  — pour brancher sur l'API, soit on garde les images en build (CDN
  statique), soit on passe à une liste URL retournée par l'API.

---

## 5. Routes & shells

### Routes définies dans `src/App.tsx`

| Path                                                    | Composant         | Notes                                          |
| ------------------------------------------------------- | ----------------- | ---------------------------------------------- |
| `/`                                                     | Accueil           | Hero landing + sections schedule/message/histoire/nehemie |
| `/nehemie`                                              | Nehemie           | Page projet bâtisseurs                         |
| `/genese`                                               | Sommaire          | Index Genèse                                   |
| `/genese/:slug`                                         | PageGenese (10×)  | Présentation, Naissance, Mission, Branham, …  |
| `/histoire`                                             | redirect → /genese | Legacy                                        |
| `/eglise`                                               | CetteSemaine      | Default child of EgliseLayout                  |
| `/eglise/cultes`                                        | Cultes            | Bibliothèque prédications                      |
| `/eglise/cantiques`                                     | Cantiques         | Hero + hymnaire embed                          |
| `/eglise/annonces` + `/:id`                             | Annonces / Detail |                                                |
| `/eglise/temoignages`                                   | Temoignages       |                                                |
| `/eglise/cultes/watch/:id`                              | CultesWatch       | **Watch shell immersif** (cf. §6)              |
| `/eglise/cantiques/watch/hymnaire/:famille`             | CantiquesWatch    | Mode BROWSE (mini-bibliothèque scopée famille) |
| `/eglise/cantiques/watch/:slug`                         | CantiquesWatch    | Mode CANTIQUE (vidéo + paroles)                |
| `/eglise/cantiques/watch/session-:slug`                 | CantiquesWatch    | Mode SESSION (vidéo + index + paroles)         |
| `/design-system`                                        | DesignSystem      | Showcase tokens (dev only — pas linkable)      |

### Shells (chrome) — App.tsx > Shell

```ts
const isWatchPage =
  pathname.startsWith('/eglise/cultes/watch/') ||
  pathname.startsWith('/eglise/cantiques/watch/');
```

Sur les watch pages, Header global et Footer sont **masqués** (les watch
pages ont leur propre topbar custom). Tout le reste du site utilise
Header + Footer + sub-layouts.

### Sub-layouts (subnav)

- **EgliseLayout** : 5 onglets (Cette semaine, Cultes, Cantiques, Annonces,
  Témoignages). Sticky sous le Header. Utilise `useSubnavOnDark()`.
- **GeneseLayout** : 8 onglets (Sommaire, Présentation, Naissance, Mission,
  Branham, Actes, Offices, Services). Même pattern.

---

## 6. Patterns transverses (à connaître absolument)

### 6.1 Subnav dynamique sombre/clair — `useSubnavOnDark`

**Problème historique** : la sticky subnav (Église, Genèse) doit afficher du
texte blanc sur fond sombre quand elle survole un hero dark, et du texte
sombre sur fond clair quand elle survole du contenu canvas. Un simple
seuil `scrollY < 420` ne marche pas car chaque page a un hero de hauteur
différente.

**Solution** :
1. Chaque page met `data-page-hero` sur son `<section>` de hero.
2. Le hook `src/hooks/useSubnavOnDark.ts` détecte dynamiquement en temps
   réel si la subnav survole encore le hero (via `getBoundingClientRect`)
   et bascule entre `subnavDark` / `subnavLight` au scroll.
3. **Robustesse SPA** : retry rAF (~830ms) + MutationObserver fallback
   pour attraper le hero quand React l'a enfin monté après une navigation
   client-side.
4. **Pattern Cultes** : pour que les heros soient assez grands et que la
   subnav reste sombre généreusement, TOUS les heros (Cultes, Cantiques,
   CetteSemaine, Annonces, Témoignages, PageGenese, Sommaire) utilisent :

   ```css
   .hero {
     margin-top: -120px;       /* remonte sous le header */
     padding: 180px X 64px;    /* compense le margin et garde le contenu visible */
     background: <dark gradient>;
   }
   @media (max-width: 820px) {
     .hero { margin-top: -110px; padding: 142px X 56px; }
   }
   @media (max-width: 480px) {
     .hero { margin-top: -110px; padding: 134px X 40px; }
   }
   ```

   Si tu ajoutes une nouvelle page avec subnav, **suis ce pattern**.

5. La subnav porte aussi `data-sticky-subnav` (utilisé par `getStickyOffset()`
   pour mesurer son bord inférieur en pixels réels).

### 6.2 Watch shell immersif (CultesWatch + CantiquesWatch)

- `.watchPage` = `position: fixed; inset: 0; height: 100dvh`. Plus de
  scroll de page, le scroll se fait à l'intérieur du shell.
- Layout : `topbar` (custom) + `body` (grid / flex selon mode).
- Sur mobile (≤820px ou ≤980px), on **bascule le background** du
  `.watchPage` vers `var(--bg-canvas)` (off-white) pour qu'aucun "dark"
  ne puisse transparaître en bas du scroll, peu importe la hauteur du
  contenu. La topbar garde son fond dark via son propre `background`.
- iOS : `100dvh` (et non `100vh`) pour que le clavier mobile rétracte
  correctement la zone visible. Safe-area `env(safe-area-inset-*)`
  respectée sur topbar et padding-bottom.

### 6.3 HymnaireBrowser — composant partagé

`src/components/ui/HymnaireBrowser/HymnaireBrowser.tsx` contient TOUTE la
logique de browsing cantique/session (header + search + chips année +
grille 16:9 OU table des matières recueil + featured cards).

Utilisé dans **2 contextes** :
- Standalone watch shell : `/eglise/cantiques/watch/hymnaire/:famille`
  (`FamilleBrowseView` dans CantiquesWatch.tsx, wrapper léger).
- Embedded : page `/eglise/cantiques` sous le hero (bande pills + rouleau
  blanc avec HymnaireBrowser inside).

Le composant importe ses styles directement depuis
`../../routes/Eglise/CantiquesWatch.module.css` — c'est volontaire et
légitime (CSS Modules hash les classes, l'import inter-fichier est sûr).
Ne pas dupliquer ces styles.

### 6.4 FilterSheet — modal bottom-sheet iOS-like

`src/components/ui/FilterSheet/FilterSheet.tsx`. Pattern réutilisable :
backdrop + panneau qui glisse depuis le bas via `translateY(100%) → 0`.
Header sticky (titre + ✕), body scrollable, footer optionnel (`onApply`/
`onReset` masqué si pas passé). Respecte `safe-bottom`. Anim
`cubic-bezier(0.4, 0, 0.2, 1)` 320ms.

Utilisé dans :
- Cultes (library) : bouton "Filtrer" mobile → sheet avec filtres.
- CultesWatch : bouton "Filtrer" dans la topbar mobile → sheet.
- CantiquesWatch cantique mode mobile : bouton "Paroles" → sheet lyrics.
- CantiquesWatch session mode mobile : 2 boutons "Cantiques" / "Paroles"
  → 2 sheets dédiées.

**Pour le contexte FilterGroup/FilterRow** : ces composants sont stylés
pour la sidebar dark de Cultes. Quand utilisés dans la FilterSheet (fond
blanc), wrapper dans `<div className={styles.filterBlocksLight}>` qui
inverse les couleurs en cascade. Cf. Cultes.module.css + CultesWatch.module.css.

### 6.5 YouTubePlayer custom

`src/components/ui/YouTubePlayer/YouTubePlayer.tsx`. Charge l'API IFrame
dynamiquement (singleton promise). Expose des contrôles overlay custom
(barre, big play, volume, fullscreen, raccourcis clavier). Props utiles :
- `videoUrl`, `videoKey` (re-init au changement),
- `startSec` / `endSec` (deep-link YouTube + watcher JS qui pause
  exactement à `endSec`),
- `onTimeUpdate(currentSec)` : pollé à ~4 Hz, utilisé par SessionView
  pour synchroniser automatiquement les paroles affichées selon le
  cantique en cours dans la session (cantiquesContenus + timecode).

### 6.6 Données Néhémie galerie sanctuaire

`src/routes/Nehemie.tsx` utilise `import.meta.glob` :
```ts
const galerieModules = import.meta.glob<{ default: string }>(
  '../assets/nehemie/*.{png,jpg,jpeg,webp}',
  { eager: true },
);
```
Toute image ajoutée dans `src/assets/nehemie/` est automatiquement incluse
dans la galerie. Le nom de fichier (kebab/underscore → mots, Title Case)
sert de caption. Renommer si besoin de cosmétique.

---

## 7. Conventions mobile-first (iOS feel)

Document toutes les règles globales appliquées (cf. `src/styles/global.css`
et `src/styles/tokens.css`) :

- `<meta viewport-fit=cover>` activé pour les safe-areas iOS.
- Tokens safe-area : `--safe-top`, `--safe-right`, `--safe-bottom`, `--safe-left`.
- `--touch-min: 44px` (norme Apple HIG). Boutons/icônes interactifs ≥ 44px.
- `-webkit-tap-highlight-color: transparent` sur `html` (plus de flash gris).
- `touch-action: manipulation` sur tous les interactifs (élimine délai 300ms).
- `input/textarea/select { font-size: 16px }` sur ≤820px (anti-zoom iOS au focus).
- `[data-page-hero] { min-height: max(70vh, 480px); }` desktop, `max(58vh, 360px)`
  mobile — garantit que les heros remplissent l'écran.
- Watch pages : `100dvh` (et non `100vh`) pour le clavier mobile.
- Subnav layouts : `padding: 0 max(var(--pad-x-mob), var(--safe-left))` pour
  notch landscape (iPhone Pro).
- Sur mobile (≤480px), grilles `.browseGrid`, `.relatedGrid`, `.moreGrid`,
  `.recueilFeaturedGrid` passent en **2 colonnes** (densité YouTube-like).
  Sur ≤360px iPhone SE, retour en 1 colonne.

Pour tout nouveau composant interactif sur mobile, **respecter ces
conventions** plutôt que d'ajouter ses propres règles concurrentes.

---

## 8. Design system — `src/styles/tokens.css`

Lecture obligatoire. Tokens clés :
- **Brand** : `--rst-red`, `--rst-blue` (+ deep/soft/wash variantes).
- **Foundation** : `--bg-canvas` (off-white bluish #F5F7FB), `--bg-elevated`,
  `--bg-tint`, `--bg-tint-deep`.
- **Ink** : `--ink-1` à `--ink-5` (ramp froide).
- **Glass** : `--glass-thin/regular/thick/solid/blue/warm/dark/dark-thick`
  + `--glass-blur/blur-strong/blur-light` + `--glass-border-gradient`.
- **Shadows** : `--shadow-1` à `--shadow-4` + `--shadow-blue/red/hover`.
- **Radii** : `--r-xs` (8px) → `--r-2xl` (36px) + `--r-pill` (999px).
- **Spacing** : `--space-4` à `--space-120` (échelle 4-based).
- **Layout** : `--max-width: 1280px`, `--max-content: 1100px`,
  `--max-article: 720px`, `--pad-x: 32px` / `--pad-x-mob: 20px`,
  `--header-h: 74px`.
- **Motion** : `--ease` (Apple standard), `--ease-out`, `--ease-spring`,
  `--t-fast: 180ms`, `--t-base: 320ms`, `--t-slow: 520ms`.
- **Typo** : `--f-display/text/serif/engrave/num` + échelle fluide
  `--t-display/h1/h2/h3` via `clamp()`.

Le `DesignSystem.tsx` (route `/design-system`, non-linkable depuis la nav)
affiche un showcase des tokens — utile pour vérifier visuellement après
un changement.

---

## 9. Discipline branche & déploiement

- `main` est **lu en direct par le manager du client** sur GitHub Pages.
  Chaque push déclenche un déploiement automatique (`.github/workflows/deploy.yml`).
- **NE JAMAIS pousser sur main directement pour un travail expérimental**.
  Créer une branche depuis `main` : `git checkout -b feat/<nom-ou-ticket>`.
- Tests visuels indispensables avant push :
  - `pnpm typecheck` (zéro erreur)
  - `pnpm build` (zéro erreur, bundle CSS/JS gzip cohérents)
  - Visite locale (`pnpm dev`) desktop + mobile via DevTools (iPhone SE
    375px / iPhone 14 Pro 393px / iPhone Pro Max 430px).
- Style commit messages : `<type>(<scope>): <message court>` (cf. git log
  récent). Co-author Claude est OK si la session est solo, mais privilégier
  les courts messages descriptifs.

---

## 10. Choses à NE PAS toucher (sans coordination)

- `PRD-ADMIN.md` à la racine : c'est la spec du back-office (modèles Django,
  endpoints DRF, workflow admin). Lecture utile, modifications coordonnées
  avec le porteur du back.
- `src/types/index.ts` : contrat avec le back. Évolutions = breaking changes
  potentiels. Toute extension doit être discutée.
- `src/styles/tokens.css` : changer un token a un effet en cascade sur tout
  le visuel. Préférer ajouter un nouveau token plutôt que muter un existant.
- Les watch pages (`CultesWatch.tsx`, `CantiquesWatch.tsx`) : très iterees
  et fragiles. Comprends `useScrollDirection`, `useSubnavOnDark`, le pattern
  `position:fixed + 100dvh + safe-area`, le PiP draggable, l'auto-sync
  paroles, etc. avant de modifier.
- Le pattern `margin-top: -120px + padding: 180px` sur les heros : c'est ce
  qui fait que la sticky subnav reste sombre généreusement. Si tu réduis,
  la subnav repasse en light prématurément (cf. §6.1).

---

## 11. Historique récent (highlights, voir `git log` pour le détail)

- **Phase Cantiques** : data model étendu (familles + occurrences), library
  3 vues, watch shell dédié 3 modes (browse/cantique/session), HymnaireBrowser
  extrait en composant partagé, route `famille` renommée `hymnaire`.
- **Phase Mobile-first** : audit complet (25 pages), 7 couches de polish
  (chrome, atoms, watch pages, libraries, hub, genèse, landing). Ajout
  FilterSheet, lyrics sheet pour cantique/session mobile, grilles 2-col,
  100dvh, safe-area, anti-zoom iOS, etc.
- **Phase Subnav dynamique** : remplacement du `scrollY < 420` par
  `useSubnavOnDark` + `data-page-hero`. Pattern Cultes étendu à toutes
  les pages Église/Genèse.
- **Phase Néhémie polish** : hero quote box mobile mini en haut à droite,
  bande participation avec image restaurée + layout vertical 3 blocs +
  séparateurs dorés. Galerie sanctuaire enrichie de 3 images (estrade +
  vue arrière/avant et inverse).

---

## 12. Où trouver quoi — cheat sheet

```bash
# Toutes les routes et leur composant
grep -n "Route path" src/App.tsx

# Tous les heros marqués pour la détection subnav
grep -rn "data-page-hero" src/routes/

# Tout ce qui consomme un fichier de data (à remplacer par API)
grep -rn "from '../../data/" src/routes/
grep -rn "from '../../../data/" src/components/

# Les tokens utilisés à un endroit
grep -n "var(--rst-" src/routes/Eglise/Cultes.module.css

# Les patterns critiques (par exemple le watch shell pattern)
grep -rn "position: fixed" src/routes/Eglise/

# Le contrat types
cat src/types/index.ts
```

---

## 13. Pour le prochain agent (mission API)

Ta mission : brancher cette vitrine sur le back-office interne via API.

1. Lis ce document en entier + `PRD-ADMIN.md` (spec backend).
2. Crée une branche depuis `main` (ex. `feat/api-wiring`).
3. Concentre-toi sur la couche `src/data/*.ts` : remplace chaque export
   statique par un fetcher API + hook React. Conserve les types
   (`src/types/index.ts`).
4. Ajoute les loading / error states (skeletons glass).
5. Vérifie que toutes les pages consommatrices (cf. tableau §4) continuent
   de fonctionner sans régression visuelle.
6. Préserve le pattern mobile (data-page-hero, 16px inputs, etc.).
7. `pnpm typecheck && pnpm build` doit toujours passer.
8. **Ne fusionne pas sur main** sans validation explicite — le manager
   regarde le site live en permanence.

Si tu hésites sur un comportement existant : commence par lire le code
puis ce document, puis demande à l'utilisateur. Ne devine pas une intention
sans la valider.

Bon courage 🛠️
