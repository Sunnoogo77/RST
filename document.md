# Documentation du hero de la page d'accueil

Ce document décrit précisément le rendu actuel du hero de la page d'accueil, en particulier la fusion visuelle entre l'image de Jésus à gauche et le fond sombre/bleu à droite.

L'objectif est de permettre à une future refonte, humaine ou menée par agents IA, de reproduire le même rendu sans détruire le travail de fusion déjà réalisé.

## Fichiers concernés

Le rendu est principalement construit dans ces fichiers :

- `src/routes/Accueil.tsx`
- `src/routes/Accueil.module.css`
- `public/images/jesus.jpg`

L'image utilisée actuellement est :

- chemin : `public/images/jesus.jpg`
- dimensions relevées : `669 x 759 px`
- rôle : portrait déjà préparé/modifié, avec une extension/collage sur la partie droite pour donner plus d'espace de transition.

Important : le rendu final ne dépend pas seulement du CSS. Il dépend aussi de l'image actuelle. Cette image contient déjà une zone allongée/collée sur la droite. Le CSS sert ensuite à masquer cette jonction et à fondre l'image dans le fond sombre.

## Structure HTML à conserver

Dans `Accueil.tsx`, le hero est organisé comme suit :

```tsx
<section className={styles.hero} aria-label="Présentation de l'assemblée">
  <div className={styles.heroBackdrop} aria-hidden="true" />

  <div className={styles.heroInner}>
    <div className={styles.heroJesus} aria-hidden="true">
      <img
        src={asset('/images/jesus.jpg')}
        alt={t('accessibility.portraitAlt')}
        className={styles.heroJesusImg}
        loading="eager"
      />
    </div>

    <div className={styles.heroText}>
      <div className={styles.heroTextGroup}>
        ...
      </div>
    </div>
  </div>
</section>
```

Il faut conserver cette logique en couches :

1. `.hero` : conteneur global sombre.
2. `.heroBackdrop` : fond bleu/noir sous tout le hero.
3. `.heroInner` : grille image + texte.
4. `.heroJesus` : zone image à gauche.
5. `.heroJesusImg` : image réelle, masquée progressivement vers la droite.
6. `.heroJesus::before` : grande ombre de fusion entre l'image et le fond.
7. `.heroJesus::after` : ombre localisée en bas à droite pour cacher le défaut de collage près du bras.
8. `.heroText` et `.heroTextGroup` : contenu texte à droite, au-dessus des effets.

## Architecture générale du hero

Le conteneur principal :

```css
.hero {
  position: relative;
  min-height: 100vh;
  background: #02040f;
  overflow: hidden;
  color: var(--paper);
  padding-top: var(--header-h);
  margin-bottom: -1px;
}
```

Points importants :

- `position: relative` permet aux calques internes de se positionner correctement.
- `min-height: 100vh` donne une vraie première vue plein écran.
- `background: #02040f` est le fond de secours très sombre.
- `overflow: hidden` évite que les effets de fusion débordent visuellement hors du hero.
- `padding-top: var(--header-h)` réserve l'espace du header fixe.
- `margin-bottom: -1px` évite une fine ligne de séparation en bas du hero.

## Fond global derrière l'image et le texte

Le fond est posé par `.heroBackdrop` :

```css
.heroBackdrop {
  position: absolute;
  inset: 0;
  background: #030716;
  pointer-events: none;
  z-index: 0;
}
```

Ce fond est volontairement un bleu-noir très profond. Il ne faut pas utiliser un bleu trop lumineux ici, sinon la transition avec l'image devient visible et artificielle.

Valeur actuelle à préserver :

```css
background: #030716;
```

## Grille image + texte

La grille principale :

```css
.heroInner {
  position: relative;
  z-index: 1;
  width: 100%;
  display: grid;
  grid-template-columns: minmax(540px, 36vw) 1fr;
  min-height: calc(100vh - var(--header-h));
}
```

La colonne gauche est volontairement contrôlée par :

```css
grid-template-columns: minmax(540px, 36vw) 1fr;
```

Cela signifie :

- la zone image ne descend jamais sous `540px` sur desktop ;
- elle suit ensuite environ `36vw` ;
- le reste de la largeur est donné au texte et au fond bleu/noir.

Cette valeur est sensible. Si la colonne image devient trop grande, le texte se décale trop loin. Si elle devient trop petite, l'image est coupée trop tôt et la fusion devient visible.

## Placement de l'image de Jésus

Le conteneur image :

```css
.heroJesus {
  position: relative;
  z-index: 1;
  overflow: visible;
  align-self: stretch;
  height: calc(100vh - var(--header-h));
  background: transparent;
}
```

Règles importantes :

- `height: calc(100vh - var(--header-h))` force l'image à occuper toute la hauteur visible sous le header.
- `overflow: visible` est nécessaire parce que l'ombre de fusion `.heroJesus::before` déborde vers la droite avec `inset: 0 -96% 0 0`.
- Le fond du conteneur reste transparent pour laisser travailler les calques inférieurs.

L'image elle-même :

```css
.heroJesusImg {
  position: absolute;
  inset: 0 auto 0 0;
  z-index: 1;
  width: 100%;
  max-width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
  -webkit-mask-image: linear-gradient(90deg, #000 0%, #000 58%, rgba(0,0,0,.86) 72%, rgba(0,0,0,.42) 86%, transparent 94%, transparent 100%);
  mask-image: linear-gradient(90deg, #000 0%, #000 58%, rgba(0,0,0,.86) 72%, rgba(0,0,0,.42) 86%, transparent 94%, transparent 100%);
}
```

Les points critiques sont :

- `object-fit: cover` permet à l'image de remplir la colonne sans déformation.
- `object-position: center top` garde le visage bien placé verticalement.
- le masque horizontal est indispensable pour faire disparaître l'image progressivement vers la droite.

## Masque de l'image

Le masque actuel est :

```css
linear-gradient(
  90deg,
  #000 0%,
  #000 58%,
  rgba(0,0,0,.86) 72%,
  rgba(0,0,0,.42) 86%,
  transparent 94%,
  transparent 100%
)
```

Interprétation :

- `0% -> 58%` : image entièrement visible.
- `58% -> 72%` : début très doux de la disparition.
- `72% -> 86%` : l'image devient semi-transparente.
- `86% -> 94%` : disparition forte dans le fond.
- `94% -> 100%` : l'image est totalement transparente.

Cette progression est volontairement longue. Elle évite une frontière droite trop nette entre image et fond.

Ne pas remplacer ce masque par un simple `linear-gradient(... transparent 100%)` trop court. Les bandes verticales deviennent immédiatement visibles.

## Ombre principale de fusion

La vraie fusion entre l'image et le fond vient surtout de `.heroJesus::before` :

```css
.heroJesus::before {
  inset: 0 -96% 0 0;
  z-index: 2;
  background:
    radial-gradient(ellipse 28% 86% at 46% 52%, rgba(0,0,0,.68) 0%, rgba(0,0,0,.5) 34%, rgba(0,0,0,.22) 62%, rgba(0,0,0,0) 88%);
}
```

Pourquoi cette couche existe :

- Elle assombrit uniquement la frontière droite de l'image.
- Elle transforme progressivement le bord de l'image vers du noir.
- Ensuite le fond noir/bleu peut reprendre sans rupture visible.

Valeurs importantes :

- `inset: 0 -96% 0 0` : l'ombre dépasse très loin à droite du conteneur image.
- `ellipse 28% 86%` : ellipse étroite horizontalement mais très haute verticalement.
- `at 46% 52%` : centre placé dans la zone de transition, pas sur le visage.
- `rgba(0,0,0,.68)` au centre : noir assez fort pour cacher la jonction.
- fin à `88%` en transparent : fondu long, pas brutal.

Ce calque ne doit pas devenir une bande verticale. Il est radial, haut, et diffus.

## Ombre localisée pour cacher le collage en bas à droite

L'image actuelle a été modifiée : une portion a été ajoutée/collée à droite pour prolonger l'espace. Ce collage peut devenir visible près du bras, en bas à droite de l'image.

Pour le masquer, `.heroJesus::after` ajoute une ombre localisée :

```css
.heroJesus::after {
  inset: 0;
  z-index: 3;
  background:
    radial-gradient(ellipse 42% 34% at 76% 92%, rgba(2,4,15,.58) 0%, rgba(2,4,15,.38) 36%, rgba(2,4,15,.14) 66%, rgba(2,4,15,0) 100%),
    radial-gradient(ellipse 26% 24% at 62% 88%, rgba(2,4,15,.34) 0%, rgba(2,4,15,.16) 52%, rgba(2,4,15,0) 100%);
  opacity: 1;
}
```

Cette ombre est volontairement :

- placée bas-droite (`76% 92%`) ;
- sombre, pas lumineuse ;
- elliptique, pas linéaire ;
- fondue jusqu'à transparent ;
- concentrée sur le défaut du collage près du bras.

Il ne faut pas remettre de halo lumineux dans cette zone. Les essais de lumière ont révélé les bandes verticales et les défauts de collage.

## Pourquoi les halos lumineux ont été retirés

Pendant les ajustements, plusieurs halos chauds/lumineux ont été testés autour du visage et vers la transition droite. Ils ont été retirés pour une raison précise :

- un halo lumineux révèle les différences de texture dans l'image ;
- il fait ressortir les bandes verticales de la zone collée ;
- il donne l'impression qu'une couche brillante a été ajoutée au-dessus de l'image ;
- il touche trop facilement le visage et altère le portrait.

Conclusion importante :

Ne pas ajouter de lumière visible sur l'image pour corriger la transition. Pour ce hero, il faut masquer par l'ombre et par le fondu, pas par l'éclaircissement.

## Zone texte et halo bleu du titre

Le texte de droite est indépendant de l'image. Il est placé par :

```css
.heroText {
  position: relative;
  z-index: 4;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 56px clamp(32px, 4vw, 72px) 80px clamp(48px, 6vw, 120px);
}
```

Le groupe texte :

```css
.heroTextGroup {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;
  margin-top: clamp(164px, 21vh, 218px);
  transform: translateX(clamp(28px, 3.7vw, 76px));
}
```

Ces deux valeurs donnent le placement final du bloc :

```css
margin-top: clamp(164px, 21vh, 218px);
transform: translateX(clamp(28px, 3.7vw, 76px));
```

Cela place le titre :

- légèrement plus bas que le centre vertical ;
- légèrement vers la droite ;
- suffisamment loin de la transition image/fond.

Le halo bleu derrière le titre est ici :

```css
.heroTextGroup::before {
  width: min(980px, 66vw);
  height: min(560px, 56vh);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -46%);
  background:
    radial-gradient(ellipse at center, rgba(22,68,186,.28) 0%, rgba(13,42,139,.2) 32%, rgba(7,22,78,.09) 58%, rgba(7,22,78,0) 82%);
}
```

Ce halo bleu ne touche pas l'image. Il est derrière le texte, sur la partie droite du hero. C'est lui qui donne la profondeur bleutée autour de "ROC SÉCULAIRE TABERNACLE".

À préserver :

- `width: min(980px, 66vw)`
- `height: min(560px, 56vh)`
- `transform: translate(-50%, -46%)`
- gradient avec alpha maximum `.28`

Si ce halo devient trop fort, la page ressemble à une tache bleue. S'il est supprimé, la partie droite devient trop plate/noire.

## Taille et style du titre

Le titre actuel :

```css
.heroTitle {
  font-family: var(--f-engrave);
  font-size: clamp(1.86rem, 2.9vw, 2.78rem);
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: .04em;
  text-transform: uppercase;
  color: var(--paper);
  margin: 0;
  text-shadow: 0 2px 16px rgba(0,0,0,.3);
}
```

La taille a été réduite pour éviter un rendu trop massif. Ne pas revenir à une taille hero trop grande. Le titre doit être noble et lisible, mais il ne doit pas écraser l'image.

Valeur sensible :

```css
font-size: clamp(1.86rem, 2.9vw, 2.78rem);
```

## Couche spéciale sous le header

Le pseudo-élément `.hero::before` sert à gérer la zone sous le header, côté image :

```css
.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: min(46vw, 760px);
  height: var(--header-h);
  background:
    linear-gradient(to left, rgba(2,4,15,0) 0%, rgba(2,4,15,.72) 32%, #01020a 72%, #000 100%);
  pointer-events: none;
  z-index: 2;
}
```

Cette couche évite que la zone supérieure gauche paraisse découpée sous le header. Elle ne doit pas être confondue avec la fusion principale de l'image.

## Responsive mobile

À partir de `820px`, le hero passe en layout vertical :

```css
@media (max-width: 820px) {
  .hero {
    min-height: 100svh;
  }

  .heroInner {
    grid-template-columns: 1fr;
    grid-template-rows: 52vw auto;
    min-height: calc(100svh - var(--header-h));
  }
}
```

L'image devient la première rangée :

```css
.heroJesus {
  order: 1;
  height: 52vw;
  overflow: hidden;
}
```

Le masque passe de horizontal à vertical :

```css
.heroJesusImg {
  position: relative;
  inset: auto;
  width: 100%;
  max-width: 100%;
  height: 100%;
  object-position: center 12%;
  -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 78%, rgba(0,0,0,.5) 91%, transparent 100%);
  mask-image: linear-gradient(180deg, #000 0%, #000 78%, rgba(0,0,0,.5) 91%, transparent 100%);
}
```

L'ombre mobile principale :

```css
.heroJesus::before {
  inset: 0;
  background:
    linear-gradient(180deg, rgba(0,0,0,.16) 0%, rgba(0,0,0,0) 34%, rgba(3,7,24,.64) 100%);
}
```

L'ombre mobile localisée :

```css
.heroJesus::after {
  inset: 0;
  background:
    radial-gradient(ellipse 54% 42% at 72% 94%, rgba(2,4,15,.42) 0%, rgba(2,4,15,.22) 48%, rgba(2,4,15,0) 100%);
  opacity: 1;
}
```

Sur mobile, ne pas utiliser les mêmes valeurs que desktop. Le fondu doit aller vers le bas, car l'image est au-dessus du texte.

## Ordre des z-index

L'ordre actuel est intentionnel :

- `.heroBackdrop` : `z-index: 0`
- `.heroInner` : `z-index: 1`
- `.heroJesusImg` : `z-index: 1` dans son contexte
- `.heroJesus::before` : `z-index: 2`
- `.heroJesus::after` : `z-index: 3`
- `.heroText` : `z-index: 4`
- `.heroTextGroup::before` : `z-index: 0` dans le groupe texte
- `.heroTitle`, `.heroAssemblee`, `.heroCtas` : `z-index: 1` dans le groupe texte

Ne pas placer les ombres au-dessus du texte. Ne pas placer le texte sous les calques de fusion.

## Ce qu'il ne faut pas faire

Ne pas :

- remplacer l'image par une image non préparée sans refaire la transition ;
- supprimer le masque de `.heroJesusImg` ;
- raccourcir brutalement le masque entre `58%` et `94%` ;
- remplacer les gradients radiaux par des rectangles ou des bandes linéaires visibles ;
- ajouter un halo clair sur la zone de jonction ;
- éclaircir la droite de l'image pour cacher les défauts ;
- déplacer le centre de `.heroJesus::before` sur le visage ;
- mettre `overflow: hidden` sur `.heroJesus` en desktop ;
- augmenter fortement la taille du titre ;
- recentrer verticalement le texte trop haut.

## Méthode recommandée si une refonte modifie le hero

Pour conserver le rendu :

1. Garder la structure `hero > heroBackdrop > heroInner > heroJesus + heroText`.
2. Garder l'image dans une colonne gauche proche de `minmax(540px, 36vw)`.
3. Garder l'image en `object-fit: cover` et `object-position: center top`.
4. Appliquer un masque horizontal long sur l'image.
5. Faire passer le bord droit de l'image vers le noir avant de passer vers le bleu.
6. Utiliser une grande ombre radiale noire pour la fusion principale.
7. Utiliser une ombre basse localisée pour cacher le collage près du bras.
8. Garder le halo bleu uniquement derrière le texte, pas sur l'image.
9. Tester en desktop large, desktop moyen, et mobile.

## Critère visuel de validation

Le rendu est correct si :

- on ne voit pas une frontière nette entre l'image et le fond ;
- on ne voit pas de bandes verticales ;
- le visage n'est pas assombri excessivement ;
- le bas droit du vêtement ne révèle pas le collage ;
- le fond derrière le titre garde une profondeur bleue subtile ;
- le titre reste légèrement bas et à droite, sans être trop grand ;
- la page ne donne pas l'impression d'avoir une image collée sur un rectangle bleu.

## Résumé technique court

Le rendu final repose sur trois mécanismes :

1. Un masque CSS sur l'image :

```css
mask-image: linear-gradient(90deg, #000 0%, #000 58%, rgba(0,0,0,.86) 72%, rgba(0,0,0,.42) 86%, transparent 94%, transparent 100%);
```

2. Une grande ombre radiale noire pour fondre le bord droit :

```css
radial-gradient(ellipse 28% 86% at 46% 52%, rgba(0,0,0,.68) 0%, rgba(0,0,0,.5) 34%, rgba(0,0,0,.22) 62%, rgba(0,0,0,0) 88%);
```

3. Une ombre basse localisée pour cacher le collage :

```css
radial-gradient(ellipse 42% 34% at 76% 92%, rgba(2,4,15,.58) 0%, rgba(2,4,15,.38) 36%, rgba(2,4,15,.14) 66%, rgba(2,4,15,0) 100%);
```

Ces trois éléments doivent être conservés ensemble. Si l'un est supprimé, la fusion visuelle risque de se dégrader.
