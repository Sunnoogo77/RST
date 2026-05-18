import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/* ============================================================
   useSubnavOnDark
   ------------------------------------------------------------
   Détecte si la sticky subnav (Église / Genèse) est actuellement
   superposée à un hero sombre OU si elle est passée au-dessus
   du contenu clair (canvas).

   Au lieu d'un seuil de scrollY arbitraire (qui ne fonctionne que
   pour les pages dont le hero fait pile cette hauteur), on observe
   l'élément marqué `[data-page-hero]` et on regarde où se trouve
   son bord inférieur par rapport au bord inférieur de la subnav.

   Pages = ajouter `data-page-hero` sur la section hero.
   Pages sans hero = par défaut la subnav passe en `light`.
   ============================================================ */

/** Hauteur effective (header + subnav) sous laquelle on considère
 *  que la subnav touche le hero. Calculé à la volée. */
function getStickyOffset(): number {
  // Header fixe ≈ 74-118px (avec safe-top notch), subnav ≈ 48-56px.
  // On utilise la position réelle de la subnav (la première nav après
  // header). Fallback raisonnable si introuvable.
  const nav = document.querySelector('[data-sticky-subnav]') as HTMLElement | null;
  if (!nav) return 124;
  const rect = nav.getBoundingClientRect();
  return rect.top + rect.height;
}

export function useSubnavOnDark(): boolean {
  const { pathname } = useLocation();
  const [onDark, setOnDark] = useState(true);

  useEffect(() => {
    let raf: number | null = null;

    const update = () => {
      raf = null;
      const hero = document.querySelector<HTMLElement>('[data-page-hero]');
      if (!hero) {
        // Pas de hero détecté → subnav au-dessus du contenu, donc light.
        setOnDark(false);
        return;
      }
      const heroBottom = hero.getBoundingClientRect().bottom;
      const subnavBottom = getStickyOffset();
      // Hero encore en partie sous la subnav = on est sur du dark.
      setOnDark(heroBottom > subnavBottom);
    };

    const onScroll = () => {
      if (raf !== null) return;
      raf = requestAnimationFrame(update);
    };

    // Premier calcul après le rendu de la page (le hero doit être monté).
    const init = requestAnimationFrame(update);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(init);
      if (raf !== null) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname]);

  return onDark;
}
