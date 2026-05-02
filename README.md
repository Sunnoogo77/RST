# Roc Séculaire Tabernacle — site vitrine

Site officiel de l'assemblée chrétienne **Roc Séculaire Tabernacle** (Vitry-sur-Seine).
Vitrine statique React + Vite + TypeScript, déployée sur GitHub Pages.

---

## Développement local

Prérequis : **Node.js ≥ 20**, **pnpm ≥ 9**.

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm typecheck    # tsc --noEmit
pnpm build        # produit dist/ (déployable sur tout hébergement statique)
pnpm preview      # sert dist/ localement pour tester le build prod
```

---

## Déploiement — GitHub Pages

### 1. Configuration côté GitHub (à faire une seule fois)

1. Aller sur le dépôt → **Settings** → **Pages**.
2. Sous **Build and deployment** → **Source** : sélectionner **GitHub Actions** (et NON « Deploy from a branch »).
3. C'est tout — pas besoin de sélectionner une branche ni un dossier.

### 2. Workflow automatique

À chaque `git push` sur la branche `main`, le workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) :

1. **Build** : `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm build`
2. **Upload** : artefact `dist/` envoyé à GitHub Pages
3. **Deploy** : publication sur `https://<owner>.github.io/<repo>/`

Pour le repo `Sunnoogo77/RST`, l'URL de déploiement sera :
**https://sunnoogo77.github.io/RST/**

Déclenchement manuel : onglet **Actions** → **Deploy to GitHub Pages** → **Run workflow**.

### 3. Comment ça marche techniquement

- **Base path dynamique** : [`vite.config.ts`](vite.config.ts) lit `process.env.GITHUB_REPOSITORY` (exposé par Actions) pour fixer `base = '/<repo>/'`. En local sans cette variable, le base reste `/`.
- **Routing SPA + GitHub Pages** : GH Pages ne sait pas servir les routes profondes (`/genese/branham`) car ce sont des routes côté client React Router, pas des fichiers statiques. La parade :
  - [`public/404.html`](public/404.html) capture toute URL inconnue et redirige vers `index.html` avec le chemin encodé en query string.
  - [`index.html`](index.html) contient un script qui décode la query et restaure l'URL via `history.replaceState` avant que React Router ne lise `window.location`.
  - Adaptation MIT de [rafgraph/spa-github-pages](https://github.com/rafgraph/spa-github-pages).
- **Désactivation Jekyll** : un fichier vide `public/.nojekyll` empêche GitHub Pages de traiter le contenu via Jekyll (qui ignore les fichiers/dossiers commençant par `_`).
- **Helper `asset()`** : [`src/utils/asset.ts`](src/utils/asset.ts) préfixe les chemins `/images/...` ou `/genese/...` avec `import.meta.env.BASE_URL`. Vite ne réécrit pas automatiquement les chaînes `src=` en JSX, contrairement aux imports JS — ce helper compense.
- **`BrowserRouter basename`** : [`src/App.tsx`](src/App.tsx) utilise `basename={import.meta.env.BASE_URL.replace(/\/$/, '')}`, ce qui aligne React Router avec le base path Vite.

---

## Override manuel du base path

Pour tester un autre base (custom domain ou déploiement à la racine) :

```bash
VITE_BASE=/ pnpm build         # déploiement à la racine
VITE_BASE=/autre-repo/ pnpm build
```

Pour un **custom domain** ajouté dans Settings → Pages :

1. Mettre `VITE_BASE=/` dans le job de build (ou supprimer la variable env du workflow).
2. Créer un fichier `public/CNAME` contenant le domaine (`monsite.example.com`).
3. Configurer les DNS du domaine pour pointer sur `<owner>.github.io`.

---

## Organisation du contenu

- **Images statiques** servies depuis [`public/`](public/) :
  - `public/images/` — Hero accueil, sanctuaire, portraits, affiches d'annonces (sous `/annonces/<slug>/`)
  - `public/genese/` — 15 images des archives Genèse (Présentation, Naissance, Branham, Offices, Services, etc.)
  - `public/logo-rst.png`, `public/favicon.svg`
- **Galerie « Notre futur lieu de culte »** ([`src/assets/nehemie/`](src/assets/nehemie/)) : auto-discovery via `import.meta.glob`. Toute image déposée dans ce dossier est incluse au prochain build.
- **Données éditoriales** (sermons, cantiques, annonces, témoignages, archives Genèse) dans [`src/data/`](src/data/).
- **i18n FR/EN** dans [`src/i18n/`](src/i18n/).

---

## Structure de routes

```
/                            Accueil (Mot du pasteur en partie basse)
/nehemie                     Projet Néhémie + galerie sanctuaire
/genese                      Sommaire de la genèse de l'assemblée
  /presentation
  /naissance                 + 7e anniversaire en coda
  /mission
  /branham                   William Marrion Branham + résumé
  /actes-du-saint-esprit     Citations + 39 exploits historiques
  /offices                   Pasteur, huissiers, musique, école du dimanche
  /services                  Réunions, baptême, Sainte Cène
  /marseille                 Événement marquant
  /reunion-jeunes-2005       Événement marquant
/histoire                    → redirection vers /genese
/eglise                      Cette semaine (vue par défaut)
  /cultes
  /cantiques
  /annonces
  /annonces/:id
  /temoignages
/design-system               Référence du design system
```

---

## Roadmap

Cf. [ROADMAP.md](ROADMAP.md) (à créer si absent) pour les évolutions backend, admin, paiement Stripe, etc.

---

## Stack

- **React 18** + **Vite 5** + **TypeScript 5** (strict)
- **React Router 6** en `BrowserRouter` avec `basename`
- **react-i18next** pour FR/EN
- **CSS Modules** + variables CSS (tokens dans [`src/styles/tokens.css`](src/styles/tokens.css))
- **@fontsource** pour Cormorant Garamond, Cinzel, Bodoni Moda, Inter
- **GitHub Actions** + **GitHub Pages** pour le déploiement
