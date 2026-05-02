import styles from './Nehemie.module.css';
import { projetNehemie } from '../data/nehemie';

function fmt(n: number) {
  return n.toLocaleString('fr-FR');
}

export default function Nehemie() {
  const pct = Math.round((projetNehemie.collecte / projetNehemie.objectif) * 100);
  const restant = projetNehemie.objectif - projetNehemie.collecte;

  return (
    <main id="main-content">

      {/* ══════════════════════════════════════════════════════════
          §1 — HERO  20 % bleu naval | 80 % image paysage
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.hero} aria-label="Projet Néhémie — présentation">

        {/* Panneau sombre gauche — texte */}
        <div className={styles.heroDark}>
          <span className={styles.heroEyebrow}>Roc Séculaire Tabernacle</span>
          <h1 className={styles.heroTitle}>
            Un lieu pour<br />
            <em>Adorer, Édifier, Impacter.</em>
          </h1>
          <p className={styles.heroSub}>
            Ensemble, acquérons un lieu de culte permanent
            pour la gloire de Dieu et le service
            des générations futures.
          </p>
          <a href="#avancement" className={styles.heroCta}>
            Découvrir le projet →
          </a>
        </div>

        {/* Zone image droite */}
        <div className={styles.heroImg}>
          <img
            src="/images/sanctuary.jpg"
            alt="Intérieur du sanctuaire RST"
            className={styles.heroImgEl}
            loading="eager"
          />

          {/* Verset — encadré sombre sur l'image */}
          <blockquote className={styles.heroQuoteBox}>
            <span className={styles.heroQuoteGlyph} aria-hidden="true">"</span>
            <p>Le peuple se montra courageux dans le travail.</p>
            <cite>Néhémie 4 . 6</cite>
          </blockquote>
        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════
          §2 — AVANCEMENT · PARTICIPEZ · IMAGE
          ══════════════════════════════════════════════════════════ */}
      <section id="avancement" className={styles.content} aria-label="Avancement et participation">
        <div className={styles.contentGrid}>

          {/* Col 1 — Avancement */}
          <div className={styles.colAvancement}>
            <p className={styles.colEyebrow}>Avancement du projet</p>

            {/* Stats horizontaux */}
            <div className={styles.stats}>
              <div className={styles.stat}>
                <p className={styles.statLabel}>Objectif</p>
                <p className={styles.statNum}>{fmt(projetNehemie.objectif)}&thinsp;€</p>
              </div>
              <div className={`${styles.stat} ${styles.statHighlight}`}>
                <p className={styles.statLabel}>Collecté</p>
                <p className={styles.statNum}>{fmt(projetNehemie.collecte)}&thinsp;€</p>
                <p className={styles.statPct}>({pct}&thinsp;%)</p>
              </div>
              <div className={styles.stat}>
                <p className={styles.statLabel}>Restant</p>
                <p className={styles.statNum}>{fmt(restant)}&thinsp;€</p>
              </div>
            </div>

            {/* Barre de progression */}
            <div
              className={styles.progressBar}
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${pct} % de l'objectif atteint`}
            >
              <div className={styles.progressFill} style={{ width: `${pct}%` }}>
                <span className={styles.progressLabel}>{pct}&thinsp;%</span>
              </div>
            </div>

            <a href="mailto:tresorier@rst-vitry.fr" className={styles.colCta}>
              Voir le tableau de bord
            </a>
          </div>

          {/* Col 2 — Participez */}
          <div className={styles.colParticiper}>
            <p className={styles.participerEyebrow}>Participez à cette œuvre</p>
            <div className={styles.participerItems}>
              <div className={styles.participerItem}>
                <p className={styles.participerLabel}>Priez</p>
                <p className={styles.participerDesc}>Soutenez le projet dans la prière.</p>
              </div>
              <div className={styles.participerItem}>
                <p className={styles.participerLabel}>Partagez</p>
                <p className={styles.participerDesc}>Parlez-en autour de vous.</p>
              </div>
              <div className={styles.participerItem}>
                <p className={styles.participerLabel}>Donnez</p>
                <p className={styles.participerDesc}>Contribuez selon vos moyens.</p>
              </div>
            </div>
            <a href="mailto:tresorier@rst-vitry.fr" className={styles.donBtn}>
              ♥ Faire un don
            </a>
          </div>

          {/* Col 3 — Image portrait */}
          <div className={styles.colImage}>
            <p className={styles.colEyebrow}>Notre futur lieu de culte</p>
            <div className={styles.futureImg}>
              <img
                src="/images/sanctuary.jpg"
                alt="Intérieur du sanctuaire RST"
                className={styles.futureImgEl}
                loading="lazy"
              />
            </div>
            <p className={styles.futureCaption}>
              Un espace dédié à la présence de Dieu
              et à la transformation des vies.
            </p>
          </div>

        </div>
      </section>

    </main>
  );
}
