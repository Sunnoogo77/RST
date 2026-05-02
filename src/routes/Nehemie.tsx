import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Nehemie.module.css';
import { projetNehemie } from '../data/nehemie';
import { Lightbox, type LightboxImage } from '../components/ui/Lightbox/Lightbox';
import { asset } from '../utils/asset';

/* ────────────────────────────────────────────────────────────────────
   ICÔNES — quatre piliers du projet Néhémie
   Inline SVG pour rester indépendant de toute dépendance externe.
   ──────────────────────────────────────────────────────────────────── */
const IconUsers = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconBricks = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <rect x="1.5"  y="4"  width="6.5" height="4" rx=".4" />
    <rect x="8.75" y="4"  width="6.5" height="4" rx=".4" />
    <rect x="16"   y="4"  width="6.5" height="4" rx=".4" />
    <rect x="5"    y="10" width="6.5" height="4" rx=".4" />
    <rect x="12.5" y="10" width="6.5" height="4" rx=".4" />
    <rect x="1.5"  y="16" width="6.5" height="4" rx=".4" />
    <rect x="8.75" y="16" width="6.5" height="4" rx=".4" />
    <rect x="16"   y="16" width="6.5" height="4" rx=".4" />
  </svg>
);

const IconHandHeart = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16" />
    <path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
    <path d="m2 15 6 6" />
    <path d="M19.5 8.5c.7-.7 1.5-1.6 1.5-2.7A2.7 2.7 0 0 0 18.3 3c-.9 0-1.5.4-2.3 1.2-.8-.8-1.4-1.2-2.3-1.2A2.7 2.7 0 0 0 11 5.8c0 1.1.8 2 1.5 2.7L16 12l3.5-3.5z" />
  </svg>
);

const IconTrumpet = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {/* Pavillon (cône large) */}
    <path d="M22 6 13 8v8l9 2V6Z" fill="currentColor" />
    {/* Tube */}
    <path d="M13 10H6c-1.7 0-3 .9-3 2s1.3 2 3 2h7" />
    {/* Embouchure */}
    <circle cx="3" cy="12" r="1.6" fill="currentColor" />
    {/* Pistons */}
    <line x1="9"  y1="11" x2="9"  y2="14" />
    <line x1="11" y1="11" x2="11" y2="14" />
  </svg>
);

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
  const whyItems = t('nehemie.whyItems', { returnObjects: true }) as string[];
  const buildItems = t('nehemie.buildItems', { returnObjects: true }) as string[];
  const participationItems = t('nehemie.participationItems', { returnObjects: true }) as string[];

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

          <div className={styles.projectBoard}>
            <div className={styles.objectivePanel}>
              <p className={styles.boardEyebrow}>{t('nehemie.avancementEyebrow')}</p>
              <h3 className={styles.objectiveTitle}>{t('nehemie.objectiveTitle')}</h3>
            </div>

            <div className={styles.progressPanel}>
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

              <p className={styles.progressNote}>{t('nehemie.progressNote')}</p>
            </div>
          </div>

          <div className={styles.projectInfoGrid}>
            <article className={styles.infoCard}>
              <span className={styles.infoIcon} aria-hidden="true">{IconUsers}</span>
              <h3>{t('nehemie.whyTitle')}</h3>
              <ul>
                {whyItems.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
            <article className={styles.infoCard}>
              <span className={styles.infoIcon} aria-hidden="true">{IconBricks}</span>
              <h3>{t('nehemie.buildTitle')}</h3>
              <ul>
                {buildItems.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
            <article className={styles.infoCard}>
              <span className={styles.infoIcon} aria-hidden="true">{IconHandHeart}</span>
              <h3>{t('nehemie.participationTitle')}</h3>
              <ul>
                {participationItems.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
            <article className={`${styles.infoCard} ${styles.infoCardCall}`}>
              <span className={styles.infoIcon} aria-hidden="true">{IconTrumpet}</span>
              <h3>{t('nehemie.appealTitle')}</h3>
              <p>{t('nehemie.appealText')}</p>
              <strong>{t('nehemie.appealVerse')}</strong>
              <small>{t('nehemie.appealRef')}</small>
            </article>
          </div>

          <div className={styles.participationBand}>
            <div className={styles.bandBlock}>
              <h3>{t('nehemie.goFurtherTitle')}</h3>
              <p>{t('nehemie.goFurtherText')}</p>
              <strong>{t('nehemie.goFurtherVerse')}</strong>
            </div>
            <div className={styles.bandBlock}>
              <h3>{t('nehemie.followTitle')}</h3>
              <p>{t('nehemie.followText')}</p>
            </div>
            <div className={styles.bandBlock}>
              <h3>{t('nehemie.waysTitle')}</h3>
              <p>{t('nehemie.waysText')}</p>
              <a href={`mailto:${t('nehemie.contactEmail')}`} className={styles.donBtn}>
                {t('nehemie.donCta')}
              </a>
            </div>
          </div>

          <div className={styles.futurePanel}>
            <div className={styles.futureCopy}>
              <p className={styles.colEyebrow}>{t('nehemie.futurEyebrow')}</p>
              <h3 className={styles.futureTitle}>{t('nehemie.futurTitre')}</h3>
            <p className={styles.futureCaption}>{t('nehemie.futurCaption')}</p>
              <div className={styles.futureContact}>
                <a href={`mailto:${t('nehemie.contactEmail')}`}>{t('nehemie.contactEmail')}</a>
                <a href={`tel:${String(t('nehemie.contactPhone')).replace(/\s/g, '')}`}>
                  {t('nehemie.contactPhone')}
                </a>
              </div>
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
