# CLAUDE.md — Conventions du projet RST

Ce fichier est lu en premier par Claude Code à chaque session. Il contient les conventions de travail, l'architecture cible et les surcharges qui priment sur le PRD.

**Hiérarchie d'autorité (du plus fort au plus faible) :**

1. Ce fichier (`CLAUDE.md`)
2. `PRD.md` (cahier des charges design/contenu rédigé par Claude Design)
3. Le wireframe HTML attaché (source structurelle)

En cas de contradiction, le document supérieur l'emporte.

---

## 1. Contexte du projet

Site officiel de **Roc Séculaire Tabernacle (RST)**, assemblée chrétienne francophone à Vitry-sur-Seine, attachée au Message de William M. Branham. Le site a deux objectifs métier :

- **Vitrine de l'assemblée** : présenter l'église, son histoire, ses cultes, ses prédications, ses cantiques, ses témoignages, ses annonces.
- **Outil de levée de fonds** : porter le Projet Néhémie (acquisition + rénovation d'un sanctuaire permanent).

Le PRD détaille les 8 pages publiques. Tu suis le PRD à la lettre pour le **design, le copywriting, la palette, la typographie et la sémantique des couleurs**.

---

## 2. SCOPE DE CETTE ITÉRATION — Vitrine statique uniquement

**Cette itération livre une vitrine HTML/CSS/JS frontend pure. Zéro backend. Zéro base de données. Zéro admin. Zéro authentification.**

Une présentation au conseil de l'assemblée a lieu demain. Selon les retours, des changements structurels peuvent être demandés sur les pages, le contenu ou la navigation. Coder un backend maintenant serait du travail à jeter. **L'admin et le backend feront l'objet d'une itération ultérieure**, une fois le visuel et le contenu validés.

### 2.1 — Ce que tu livres dans cette itération

Une application **frontend statique** qui implémente fidèlement les 8 pages du PRD :

1. `/` — Accueil
2. `/nehemie` — Projet Néhémie
3. `/histoire` — Histoire de l'Église
4. `/eglise` — Cette semaine (vue par défaut)
5. `/eglise/cultes`
6. `/eglise/cantiques`
7. `/eglise/annonces`
8. `/eglise/temoignages`

Avec :
- Le design system du PRD appliqué fidèlement (palette, typographie, sémantique des couleurs).
- Les comportements interactifs décrits §5 du PRD : rotation portrait hero (aléatoire au chargement), pulsation LIVE, sticky header avec backdrop-blur au scroll, toggle d'onglets, filtres chips, sous-navigation contextuelle de la page 04.
- L'i18n FR/EN avec toggle fonctionnel sur tout le site.
- Responsive desktop (1280px) + mobile (375px) au minimum, breakpoints aux 820px et 1280px du PRD.
- Tous les contenus du wireframe en dur dans le code, organisés proprement (voir §4 ci-dessous).

### 2.2 — Ce que tu NE livres PAS dans cette itération

- ❌ Pas de Django, pas de DRF, pas de PostgreSQL, pas de SQLite, pas de modèles, pas de migrations, pas de fixtures, pas de seed.
- ❌ Pas d'API REST.
- ❌ Pas de django-admin.
- ❌ Pas d'auth, pas d'utilisateurs, pas de sessions.
- ❌ Pas de stockage média serveur.
- ❌ Pas de paiement Stripe ni autre.
- ❌ Pas de docker-compose.

### 2.3 — Ce qui figurera dans `ROADMAP.md` (à créer en fin d'itération)

La `ROADMAP.md` listera, sans les implémenter, les évolutions qui suivront cette première vitrine, après validation du conseil :

- Backend Django + DRF, modèles métier (Sermon, Cantique, Annonce, Témoignage, ProjetNehemie, PageContent, etc.), API REST, fixtures, migrations.
- Back-office d'administration accessible à `/admin` pour le pasteur et le conseil (auth, dashboard, upload média, CRUD complet, éditeur riche).
- Intégration paiement pour les dons Néhémie : Stripe en priorité, virement bancaire affiché, chèque par voie postale. CinetPay et Wave en backlog phase 2 pour la diaspora africaine.
- Streaming YouTube embed avec détection automatique du statut « en direct ».
- Recherche full-text sur les sermons et cantiques.
- Sitemap, SEO avancé, schema.org Church/Event.
- Déploiement sur VPS classique (Hetzner ou OVH) derrière un reverse proxy Caddy ou Nginx avec Let's Encrypt.

---

## 3. Stack technique — Frontend uniquement

- **Framework** : React 18 + Vite + TypeScript (strict mode).
- **Routing** : React Router DOM v6, URLs propres (`/`, `/nehemie`, `/histoire`, `/eglise`, `/eglise/cultes`, etc.). **Pas de hash-based routing.**
- **État serveur** : pas nécessaire à ce stade (tout est statique). Pas de TanStack Query.
- **i18n** : `react-i18next`, fichiers `fr.json` et `en.json` à la racine de `src/i18n/`. FR par défaut.
- **CSS** : CSS Modules (`.module.css` co-localisés avec chaque composant), avec les **variables CSS des tokens du PRD** définies dans `src/styles/tokens.css`. **Pas de Tailwind. Pas de styled-components.** Les variables CSS natives sont la source unique des couleurs, espacements et polices.
- **Lint/Format** : ESLint + Prettier configurés, TypeScript strict.
- **Build** : Vite produit un build statique (`dist/`) déployable sur n'importe quel hébergement static (Netlify, Vercel, Cloudflare Pages, ou simple Nginx).

---

## 4. Organisation du contenu — sans backend

Puisqu'il n'y a pas de base de données dans cette itération, **tous les contenus du wireframe sont stockés en TypeScript** dans des fichiers de données dédiés. Cette organisation prépare la migration future vers une API REST sans réécriture des composants.

### Structure proposée

```
src/data/
├── sermons.ts          ← liste des sermons du wireframe, typés
├── cantiques.ts        ← liste des cantiques, 3 familles (recueil/message/composés)
├── annonces.ts         ← liste des annonces, statuts à venir/aujourd'hui/passée
├── temoignages.ts      ← liste des témoignages, 3 types (citation/illustré/texte)
├── nehemie.ts          ← ProjetNehemie (objectif, collecté) + bâtisseurs
├── histoire.ts         ← 4 sections de la page Histoire (placeholders courts)
├── equipe.ts           ← pasteur + piliers liturgiques
├── images-semaine.ts   ← galerie de la semaine
├── messages-hero.ts    ← pool de portraits hero pour rotation aléatoire
└── rendez-vous.ts      ← horaires de cultes (mercredi/dimanche/vendredi)
```

### Règles

- Chaque fichier exporte un tableau ou objet typé fortement (interface TypeScript).
- Les types sont définis dans `src/types/index.ts` et restent stables — c'est le contrat qui sera demain la source des serializers Django.
- Les composants importent les données depuis ces fichiers, **pas depuis un fetch**. Aucune logique async sur cette itération.
- Pour la page Histoire, les 4 sections sont en placeholders éditoriaux courts (§4.4 du PRD) : titres + lede court + paragraphe générique + un placeholder de citation pull. Le pasteur remplira plus tard via l'admin.

---

## 5. Architecture du dépôt

```
rst-website/
├── CLAUDE.md                  ← ce fichier
├── PRD.md                     ← cahier des charges Claude Design
├── README.md                  ← installation, dev, build, déploiement statique
├── ROADMAP.md                 ← évolutions futures (backend, admin, paiement, etc.)
├── .gitignore
├── .env.example               ← uniquement variables Vite si nécessaires
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .eslintrc.cjs
├── .prettierrc
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx
│   ├── App.tsx                ← BrowserRouter + routes
│   ├── routes/
│   │   ├── Accueil.tsx
│   │   ├── Nehemie.tsx
│   │   ├── Histoire.tsx
│   │   ├── Eglise/
│   │   │   ├── index.tsx
│   │   │   ├── Cultes.tsx
│   │   │   ├── Cantiques.tsx
│   │   │   ├── Annonces.tsx
│   │   │   └── Temoignages.tsx
│   │   └── NotFound.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── sections/          ← composants de section réutilisables
│   │   └── ui/                ← Button, Eyebrow, Citation, LivePill, etc.
│   ├── styles/
│   │   ├── tokens.css         ← --ink, --paper, --accent, --note, --f-serif, etc.
│   │   └── global.css
│   ├── data/                  ← cf. §4 ci-dessus
│   ├── i18n/
│   │   ├── fr.json
│   │   └── en.json
│   └── types/
│       └── index.ts
└── assets-source/             ← images brutes fournies par l'utilisateur
    ├── pastor-ndaye.jpeg
    ├── wmb-portrait.jpeg
    └── ...
```

---

## 6. Conventions de code

### TypeScript
- Mode strict (`"strict": true`).
- Pas de `any` non justifié.
- Composants fonctionnels uniquement, hooks. Pas de classes.
- Une interface ou un type par entité métier dans `src/types/index.ts`.

### CSS
- Variables CSS pour tous les tokens du PRD §3.1 et §3.2 (palette, polices, lignes, ombres soft).
- Co-localisation des `.module.css` avec leur composant.
- Pas de styles inline sauf cas justifié (background-image dynamique pour la rotation hero).
- Pas de classes utilitaires globales, sauf pour les helpers de typographie de base dans `global.css`.

### Git
- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `style:`).
- Branches : `main` protégée, `feat/<sujet>` pour le travail en cours.
- Un commit par incrément cohérent.

---

## 7. Respect du PRD : ce qui est non-négociable

Le PRD a été itéré soigneusement. Les éléments suivants sont **figés** :

- La **palette** (`--ink`, `--paper`, `--accent`, `--note`, etc.) — codes hex exacts.
- La **sémantique des couleurs** : 🔴 rouge = vidéo/live/YouTube uniquement, 🔵 bleu = action/identité/don, ⚫ noir = neutre par défaut.
- Les **polices** : Cormorant Garamond, Cinzel, Bodoni Moda, Inter. Aucune substitution.
- Les **copies textuelles** du wireframe (titres, citations, eyebrow). Si le wireframe écrit « Roc Séculaire Tabernacle », n'écris pas « R.S.T. ».
- L'**ordre et l'arborescence** des 8 pages.
- Les **comportements interactifs** décrits §5 du PRD.
- Les éléments interdits du PRD §10 (gradients à la mode, scroll-jacking, emoji, megachurch, lorem ipsum, carrousels infinis, etc.).

---

## 8. Méthode de travail attendue

1. **Lecture** : tu lis ce fichier, puis le `PRD.md`, puis le wireframe HTML, dans cet ordre.
2. **Plan** : tu produis un plan en 3 livrables : (a) arborescence de projet finale, (b) liste ordonnée de tâches en incréments commitables, (c) questions de clarification groupées si tu en as.
3. **Validation** : tu attends la validation explicite de l'utilisateur avant d'écrire du code.
4. **Implémentation incrémentale** : à chaque incrément, l'app se lance, le front rend quelque chose, le `tsc --noEmit` passe sans erreur.
5. **Points de contrôle obligatoires** :
   - **Stop après le design system** (tokens.css, global.css, composants UI de base, Header, Footer). Tu produis une page de démonstration qui teste les composants en contexte, et tu attends la validation avant d'attaquer les pages.
   - **Stop après les 4 pages principales** (Accueil, Néhémie, Histoire, Église index) avant d'attaquer les 4 sous-pages de l'Église.
6. **Communication** : tu signales explicitement quand tu prends une décision technique non triviale. Tu ne caches pas tes hypothèses. Tu ne combles pas les trous de contenu en inventant — tu utilises les copies du wireframe et du PRD, et tu signales les manques.

---

## 9. Anti-régression visuelle

Pour chaque page publique livrée, tu compares mentalement au wireframe HTML. Si un écart visuel non-trivial existe (composant manquant, hiérarchie typographique fausse, sémantique de couleur incorrecte), tu le signales explicitement dans le commit et tu proposes un correctif. Pas de « ça va, c'est proche ». **La fidélité visuelle au PRD est non-négociable.**

---

## 10. Pour cette itération, livre :

- Une **app React/Vite/TypeScript** opérationnelle : `pnpm install && pnpm dev` lance le frontend en local sur `http://localhost:5173`.
- Les **8 pages publiques** du PRD codées, navigables, responsive, alimentées par les fichiers `src/data/`.
- Le **système de design** isolé dans `src/styles/tokens.css`.
- L'**i18n FR/EN** fonctionnel.
- Un build de production (`pnpm build`) qui produit un `dist/` déployable sur un hébergement statique.
- Un **README.md** : installation, lancement dev, build, déploiement sur hébergement statique (Netlify, Vercel, Cloudflare Pages, ou Nginx simple).
- Un **ROADMAP.md** : ce qui n'est pas livré et qui le sera dans les itérations suivantes (cf. §2.3).

---

*Dernière mise à jour : recadrage du scope sur la vitrine statique pure, sans backend.*