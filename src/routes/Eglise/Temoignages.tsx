import { useTranslation } from 'react-i18next';
import { temoignages } from '../../data/temoignages';
import { asset } from '../../utils/asset';
import styles from './Temoignages.module.css';

export default function Temoignages() {
  const { t } = useTranslation();
  const detail = temoignages.find((tem) => tem.detail)?.detail;

  return (
    <div>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>{t('eglise.temoignages.eyebrow')}</div>
          <h1 className={styles.heroTitle}>
            {t('eglise.temoignages.titreLine1')}<br /><em>{t('eglise.temoignages.titreLine2')}</em>
          </h1>
          <p className={styles.heroLede}>{t('eglise.temoignages.lede')}</p>
        </div>
      </section>

      {/* ── ACTIONS ────────────────────────────────────────────── */}
      <section className={styles.actions}>
        <a href="#" className={`${styles.btnLine} ${styles.temShare}`}>
          + Partager mon témoignage
        </a>
        <span className={styles.temCounter}>94 témoignages · depuis 1999</span>
      </section>

      {/* ── MOSAÏQUE ───────────────────────────────────────────── */}
      <section className={styles.mosaic}>

        {/* q1 — 2 col */}
        {(() => {
          const t = temoignages[0];
          return (
            <article className={`${styles.tem} ${styles.temQuote} ${styles.temQ1}`}>
              <div className={styles.temGlyph} aria-hidden="true">{'“'}</div>
              <q>{t.quoteText}</q>
              <cite>{t.cite}</cite>
            </article>
          );
        })()}

        {/* i1 — 4 col × 2 lignes */}
        {(() => {
          const t = temoignages[1];
          return (
            <article className={`${styles.tem} ${styles.temIllu} ${styles.temI1}`}>
              <div className={styles.temImg}>
                {t.image && <img src={asset(t.image)} alt="" />}
              </div>
              <div className={styles.temContent}>
                <div className={styles.temEyebrow}>{t.eyebrow}</div>
                <h3>{t.titre}</h3>
                <p>{t.corps}</p>
                {t.hasDetail && (
                  <a href="#tem-detail" className={styles.moreLine}>
                    Lire le récit complet →
                  </a>
                )}
                <cite>{t.cite}</cite>
              </div>
            </article>
          );
        })()}

        {/* q2 — 2 col, accent rouge */}
        {(() => {
          const t = temoignages[2];
          return (
            <article className={`${styles.tem} ${styles.temQuote} ${styles.temQ2} ${styles.accentBlue}`}>
              <div className={styles.temGlyph} aria-hidden="true">{'“'}</div>
              <q>{t.quoteText}</q>
              <cite>{t.cite}</cite>
            </article>
          );
        })()}

        {/* s1 — 3 col */}
        {(() => {
          const t = temoignages[3];
          return (
            <article className={`${styles.tem} ${styles.temStory} ${styles.temS1}`}>
              <div className={styles.temEyebrow}>{t.eyebrow}</div>
              <h3>{t.titre}</h3>
              <p>{t.corps}</p>
              <cite>{t.cite}</cite>
            </article>
          );
        })()}

        {/* q3 — 3 col */}
        {(() => {
          const t = temoignages[4];
          return (
            <article className={`${styles.tem} ${styles.temQuote} ${styles.temQ3}`}>
              <div className={styles.temGlyph} aria-hidden="true">{'“'}</div>
              <q>{t.quoteText}</q>
              <cite>{t.cite}</cite>
            </article>
          );
        })()}

        {/* i2 — 4 col × 2 lignes */}
        {(() => {
          const t = temoignages[5];
          return (
            <article className={`${styles.tem} ${styles.temIllu} ${styles.temI2}`}>
              <div className={styles.temImg}>
                {t.image && <img src={asset(t.image)} alt="" />}
              </div>
              <div className={styles.temContent}>
                <div className={styles.temEyebrow}>{t.eyebrow}</div>
                <h3>{t.titre}</h3>
                <p>{t.corps}</p>
                {t.hasDetail && (
                  <a href="#" className={styles.moreLine}>Lire le récit complet →</a>
                )}
                <cite>{t.cite}</cite>
              </div>
            </article>
          );
        })()}

        {/* s2 — 2 col */}
        {(() => {
          const t = temoignages[6];
          return (
            <article className={`${styles.tem} ${styles.temStory} ${styles.temS2}`}>
              <div className={styles.temEyebrow}>{t.eyebrow}</div>
              <h3>{t.titre}</h3>
              <p>{t.corps}</p>
              <cite>{t.cite}</cite>
            </article>
          );
        })()}

        {/* q4 — 2 col */}
        {(() => {
          const t = temoignages[7];
          return (
            <article className={`${styles.tem} ${styles.temQuote} ${styles.temQ4}`}>
              <div className={styles.temGlyph} aria-hidden="true">{'“'}</div>
              <q>{t.quoteText}</q>
              <cite>{t.cite}</cite>
            </article>
          );
        })()}

      </section>

      {/* ── DETAIL ─────────────────────────────────────────────── */}
      {detail && (
        <section id="tem-detail" className={styles.detail}>

          <div className={styles.detailMeta}>
            <a href="#" className={styles.backLink}>← Retour aux témoignages</a>
            <span className={styles.detailTag}>{detail.tag}</span>
          </div>

          <h2 className={styles.detailTitle}>
            Lorem ipsum<br /><em>dolor sit amet.</em>
          </h2>

          <div className={styles.detailBy}>{detail.byline}</div>

          <article className={styles.detailBody}>
            {detail.paragraphs.map((para, i) => {
              if (para.kind === 'lede') {
                return <p key={i} className={styles.temLede}>{para.text}</p>;
              }
              if (para.kind === 'pull') {
                return <blockquote key={i} className={styles.temQPull}>{para.text}</blockquote>;
              }
              return <p key={i}>{para.text}</p>;
            })}

            <div className={styles.detailFoot}>
              <span className={styles.footLbl}>Verset cité dans ce récit</span>
              <span className={styles.footRef}>
                {detail.versetRef} — {detail.versetText}
              </span>
            </div>
          </article>

        </section>
      )}

    </div>
  );
}
