import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Nehemie.module.css';
import { projetNehemie } from '../data/nehemie';
import { Lightbox, type LightboxImage } from '../components/ui/Lightbox/Lightbox';
import { asset } from '../utils/asset';

/* ────────────────────────────────────────────────────────────────────
   AUTO-DISCOVERY DES IMAGES — galerie « Notre futur lieu de culte »
   Toute image (.png, .jpg, .jpeg, .webp) déposée dans
   src/assets/nehemie/ est automatiquement incluse dans la galerie.
   Pour ajouter une image : copiez-la dans le dossier — c'est tout.
   ──────────────────────────────────────────────────────────────────── */
const galerieModules = import.meta.glob<{ default: string }>(
  '../assets/nehemie/*.{png,jpg,jpeg,webp}',
  { eager: true },
);

function humaniseSlug(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const galerieImages: LightboxImage[] = Object.entries(galerieModules)
  .map(([path, mod]) => {
    const filename = path.split('/').pop() ?? '';
    return {
      src: mod.default,
      alt: humaniseSlug(filename),
      caption: humaniseSlug(filename),
    };
  })
  .sort((a, b) => (a.caption ?? '').localeCompare(b.caption ?? ''));

export default function Nehemie() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'en' ? 'en-US' : 'fr-FR';
  const fmt = (n: number) => n.toLocaleString(locale);

  const pct = Math.round((projetNehemie.collecte / projetNehemie.objectif) * 100);
  const restant = projetNehemie.objectif - projetNehemie.collecte;

  // Lightbox state
  const [lbIndex, setLbIndex] = useState<number | null>(null);
  const openLightbox = (i: number) => setLbIndex(i);
  const closeLightbox = () => setLbIndex(null);

  return (
    <main id="main-content">

      {/* ══════════════════════════════════════════════════════════
          §1 — HERO  20 % bleu naval | 80 % image paysage
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.hero} aria-label={t('nav.nehemie')}>

        {/* Couche 0 — fond : panel sombre étroit + image large côte à côte */}
        <div className={styles.heroDark} aria-hidden="true" />
        <div className={styles.heroImg}>
          <img
            src={asset('/images/sanctuary.jpg')}
            alt="Roc Séculaire Tabernacle"
            className={styles.heroImgEl}
            loading="eager"
          />
          <blockquote className={styles.heroQuoteBox}>
            <span className={styles.heroQuoteGlyph} aria-hidden="true">"</span>
            <p>{t('nehemie.heroQuote')}</p>
            <cite>{t('nehemie.heroQuoteRef')}</cite>
          </blockquote>
        </div>

        {/* Couche 1 — texte qui chevauche le panel et l'image */}
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>{t('nehemie.heroEyebrow')}</span>
          <h1 className={styles.heroTitle}>
            {t('nehemie.heroTitleLine1')}<br />
            <em>{t('nehemie.heroTitleLine2')}<br />{t('nehemie.heroTitleLine3')}</em>
          </h1>
          <p className={styles.heroSub}>{t('nehemie.heroSub')}</p>
          <a href="#avancement" className={styles.heroCta}>
            {t('actions.decouvrirProjet')}
          </a>
        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════
          §2 — AVANCEMENT · PARTICIPEZ · IMAGE
          ══════════════════════════════════════════════════════════ */}
      <section id="avancement" className={styles.content} aria-label={t('nehemie.contentEyebrow')}>
        <div className={styles.contentInner}>
          <div className={styles.contentIntro}>
            <p className={styles.colEyebrow}>{t('nehemie.contentEyebrow')}</p>
            <h2 className={styles.contentTitle}>{t('nehemie.contentTitle')}</h2>
          </div>

          <div className={styles.actionGrid}>
            <div className={styles.colAvancement}>
              <p className={styles.colEyebrow}>{t('nehemie.avancementEyebrow')}</p>

              <div className={styles.stats}>
                <div className={styles.stat}>
                  <p className={styles.statLabel}>{t('nehemie.objectif')}</p>
                  <p className={styles.statNum}>{fmt(projetNehemie.objectif)}&thinsp;€</p>
                </div>
                <div className={`${styles.stat} ${styles.statHighlight}`}>
                  <p className={styles.statLabel}>{t('nehemie.collecte')}</p>
                  <p className={styles.statNum}>{fmt(projetNehemie.collecte)}&thinsp;€</p>
                  <p className={styles.statPct}>({pct}&thinsp;%)</p>
                </div>
                <div className={styles.stat}>
                  <p className={styles.statLabel}>{t('nehemie.restant')}</p>
                  <p className={styles.statNum}>{fmt(restant)}&thinsp;€</p>
                </div>
              </div>

              <div
                className={styles.progressBar}
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${pct} % ${t('nehemie.objectifAtteint')}`}
              >
                <div className={styles.progressFill} style={{ width: `${pct}%` }}>
                  <span className={styles.progressLabel}>{pct}&thinsp;%</span>
                </div>
              </div>

              <a href="mailto:tresorier@rst-vitry.fr" className={styles.colCta}>
                {t('actions.voirTableau')}
              </a>
            </div>

            <div className={styles.colParticiper}>
              <p className={styles.participerEyebrow}>{t('nehemie.participerEyebrow')}</p>
              <div className={styles.participerItems}>
                <div className={styles.participerItem}>
                  <p className={styles.participerLabel}>{t('nehemie.participer.priezLabel')}</p>
                  <p className={styles.participerDesc}>{t('nehemie.participer.priezDesc')}</p>
                </div>
                <div className={styles.participerItem}>
                  <p className={styles.participerLabel}>{t('nehemie.participer.partagezLabel')}</p>
                  <p className={styles.participerDesc}>{t('nehemie.participer.partagezDesc')}</p>
                </div>
                <div className={styles.participerItem}>
                  <p className={styles.participerLabel}>{t('nehemie.participer.donnezLabel')}</p>
                  <p className={styles.participerDesc}>{t('nehemie.participer.donnezDesc')}</p>
                </div>
              </div>
              <a href="mailto:tresorier@rst-vitry.fr" className={styles.donBtn}>
                {t('nehemie.donCta')}
              </a>
            </div>
          </div>

          <div className={styles.futurePanel}>
            <div className={styles.futureCopy}>
              <p className={styles.colEyebrow}>{t('nehemie.futurEyebrow')}</p>
              <h3 className={styles.futureTitle}>{t('nehemie.futurTitre')}</h3>
              <p className={styles.futureCaption}>{t('nehemie.futurCaption')}</p>
            </div>

            {/* Galerie : 3 vignettes visibles maximum (1 grande + 2 verticales).
                Si plus d'images existent, la 3e affiche un voile « +N » qui ouvre
                le lightbox — toutes les images sont accessibles à la navigation. */}
            <div className={styles.gallery}>
              {galerieImages.slice(0, 3).map((img, i) => {
                const isLastVisible = i === 2;
                const hasMore = galerieImages.length > 3;
                const remaining = galerieImages.length - 3;
                return (
                  <figure
                    key={img.src}
                    className={i === 0 ? styles.galleryMain : styles.gallerySide}
                  >
                    <button
                      type="button"
                      className={styles.galleryBtn}
                      onClick={() => openLightbox(i)}
                      aria-label={
                        isLastVisible && hasMore
                          ? `Voir toutes les images (${galerieImages.length} au total)`
                          : `Agrandir l'image ${i + 1} sur ${galerieImages.length}`
                      }
                    >
                      <img
                        src={img.src}
                        alt={img.alt ?? t('nehemie.futurEyebrow')}
                        className={styles.galleryImg}
                        loading={i === 0 ? 'eager' : 'lazy'}
                      />
                      {isLastVisible && hasMore && (
                        <span
                          className={styles.galleryMore}
                          aria-hidden="true"
                        >
                          <span className={styles.galleryMoreNum}>
                            +{remaining}
                          </span>
                          <span className={styles.galleryMoreLbl}>
                            voir tout
                          </span>
                        </span>
                      )}
                    </button>
                  </figure>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {lbIndex !== null && (
        <Lightbox
          images={galerieImages}
          index={lbIndex}
          onClose={closeLightbox}
          onNavigate={openLightbox}
        />
      )}
    </main>
  );
}
