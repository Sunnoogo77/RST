import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LivePill } from '../components/ui/LivePill/LivePill';
import { Button } from '../components/ui/Button/Button';
import { rendezVous } from '../data/rendez-vous';
import { sermons } from '../data/sermons';
import { projetNehemie } from '../data/nehemie';
import { motDuPasteur } from '../data/genese/mot-du-pasteur';
import type { RendezVous } from '../types';
import styles from './Accueil.module.css';

const SCHED_LABEL: Record<string, { main: string; addr: string }> = {
  mercredi: { main: 'Étude biblique',                    addr: 'Salle Bacchus, Vitry-sur-Seine' },
  dimanche: { main: "Culte d'adoration et prédication",  addr: 'Salle Bacchus, Vitry-sur-Seine' },
  vendredi: { main: 'Réunion de prière',                 addr: '* lieu différent — nous contacter' },
};

function schedTime(rv: RendezVous): string {
  if (rv.jour === 'vendredi') return `dès ${rv.heureDebut}`;
  if (rv.jour === 'dimanche') return `${rv.heureDebut} — 12H30`;
  return `${rv.heureDebut} — ${rv.heureFin}`;
}

function formatMontant(n: number): string {
  return n.toLocaleString('fr-FR');
}

const BIBLE_REF_PATTERN =
  /(Zacharie 14:7|Malachie 4:5-6|Luc 17:26-30|Actes 3:17-21|Apocalypse 10:7)/g;
const BIBLE_REF_MATCH =
  /^(Zacharie 14:7|Malachie 4:5-6|Luc 17:26-30|Actes 3:17-21|Apocalypse 10:7)$/;

function renderPastorParagraph(text: string) {
  return text.split(BIBLE_REF_PATTERN).map((part, idx) =>
    BIBLE_REF_MATCH.test(part) ? (
      <span key={`${part}-${idx}`} className={styles.bibleRef}>
        {part}
      </span>
    ) : (
      part
    )
  );
}

export default function Accueil() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const dernierSermon = sermons[0];
  const pct = Math.round((projetNehemie.collecte / projetNehemie.objectif) * 100);
  const dateSermon = new Date(dernierSermon.date).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const dateLabel = dateSermon.charAt(0).toUpperCase() + dateSermon.slice(1);

  return (
    <main id="main-content">

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className={styles.hero} aria-label="Présentation de l'assemblée">

        <div className={styles.heroBackdrop} aria-hidden="true" />

        <div className={styles.heroInner}>
          {/* Colonne texte — bloc positionné à gauche, contenu centré */}
          <div className={styles.heroText}>
            <div className={styles.heroTextGroup}>
              <p className={styles.heroAssemblee}>Assemblée Chrétienne</p>
              <h1 className={styles.heroTitle}>
                Roc Séculaire<br/>Tabernacle
              </h1>
              <div className={styles.heroCtas}>
                <LivePill onClick={() => navigate('/eglise')} />
                <button className={styles.heroGhostBtn} onClick={() => navigate('/eglise')}>
                  {t('actions.decouvrir')}
                </button>
              </div>
            </div>
          </div>

          {/* Image du Christ — fixe, à droite */}
          <div className={styles.heroJesus} aria-hidden="true">
            <img
              src="/images/jesus.jpg"
              alt="Portrait du Christ"
              className={styles.heroJesusImg}
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* ── PROCHAINES RÉUNIONS ─────────────────────────────────── */}
      <section className={styles.schedule} aria-label="Prochaines réunions">
        <div className={styles.schedInner}>
          <div className={styles.eyebrow}>Prochaines réunions</div>
          <h2 className={styles.hSerif}>
            Nous nous rassemblons<br/><em>trois fois par semaine.</em>
          </h2>

          <div className={styles.schedGrid}>
            {rendezVous.map((rv) => (
              <div key={rv.id} className={styles.schedItem}>
                <div className={styles.schedDay}>
                  {rv.jour.toUpperCase()}
                  {rv.jour === 'vendredi' && (
                    <span className={styles.schedStar}> *</span>
                  )}
                </div>
                <div className={styles.schedTime}>{schedTime(rv)}</div>
                <div className={styles.schedLabel}>
                  {SCHED_LABEL[rv.jour].main}
                  <br/>
                  {rv.jour === 'vendredi'
                    ? <em>{SCHED_LABEL[rv.jour].addr}</em>
                    : SCHED_LABEL[rv.jour].addr
                  }
                </div>
              </div>
            ))}
          </div>

          <div className={styles.schedFoot}>
            <span className={styles.schedPin}>
              <span aria-hidden="true">📍</span>
              {' '}<strong>Salle 2 : Bacchus</strong>{' '}
              — 64 av. du Groupe Manouchian, 94400 Vitry sur Seine
            </span>
            <span className={styles.schedMapLink}>Voir sur la carte →</span>
          </div>
        </div>
      </section>

      {/* ── DERNIER MESSAGE ─────────────────────────────────────── */}
      <section className={styles.lastMsg} aria-label="Dernier message">
        <div className={styles.lastMsgInner}>
          <div className={styles.eyebrow}>Dernier message</div>
          <div className={styles.lastMsgGrid}>

            {/* Lecteur vidéo placeholder 16:9 */}
            <div
              className={styles.lastMsgVideo}
              role="img"
              aria-label={`Replay — ${dernierSermon.titre}`}
            >
              {/* Bouton play centré */}
              <div className={styles.lastMsgPlay}>
                <button className={styles.lastMsgPlayBtn} aria-label="Lire la vidéo">
                  <span className={styles.lastMsgPlayTriangle} aria-hidden="true" />
                </button>
              </div>

              {/* Méta bas de frame */}
              <div className={styles.lastMsgMeta}>
                <span className={styles.lastMsgMetaLine}>
                  <span className={styles.lastMsgDot} aria-hidden="true" />
                  YOUTUBE · LIVE REPLAY
                </span>
                {dernierSermon.duree && (
                  <span className={styles.lastMsgDuration}>{dernierSermon.duree}</span>
                )}
              </div>
            </div>

            {/* Texte */}
            <div className={styles.lastMsgCopy}>
              <div className={styles.lastMsgRef}>
                {dateLabel} · Culte
              </div>

              <h3 className={styles.lastMsgTitle}>
                {`« ${dernierSermon.titre.replace(/\.$/, '')} »`}
              </h3>

              <p className={styles.lastMsgSerie}>
                {dernierSermon.serie}
                {dernierSermon.numeroSerie ? ` #${dernierSermon.numeroSerie}` : ''}
                {' · '}
                {dernierSermon.titre.replace(/\.$/, '').toUpperCase()}
              </p>

              {dernierSermon.description && (
                <p className={styles.lastMsgDesc}>{dernierSermon.description}</p>
              )}

              <div className={styles.lastMsgActions}>
                <Button variant="blue" as="a" href="/eglise/cultes">
                  {t('actions.ecouterMessage')}
                </Button>
                <Button variant="secondary" as="a" href="/eglise/cultes">
                  Tous les messages
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LE MOT DU PASTEUR ───────────────────────────────────── */}
      <section className={styles.histoire} aria-label="Le mot du pasteur">
        <div className={styles.histoireInner}>

          {/* Portrait du pasteur */}
          <div className={styles.histoireImg}>
            <img
              src="/pastor-ndaye.jpeg"
              alt="Rev. Robert Ndaye M., pasteur de Roc Séculaire Tabernacle"
              className={styles.histoireImgEl}
              loading="lazy"
            />
          </div>

          {/* Mot du pasteur — retranscription intégrale (RST_archives/Le-mot-du-pasteur.txt) */}
          <div className={styles.histoireCopy}>
            <div className={styles.eyebrow}>{t('accueil.motDuPasteur.eyebrow')}</div>
            <h2 className={styles.histoireTitre}>
              {t('accueil.motDuPasteur.titre')}
            </h2>
            {motDuPasteur.paragraphes.map((p, idx) => (
              <p
                key={idx}
                className={
                  idx === 0
                    ? `${styles.histoireP} ${styles.histoirePFirst}`
                    : styles.histoireP
                }
              >
                {renderPastorParagraph(p)}
              </p>
            ))}
            <p className={styles.histoireBenediction}>{motDuPasteur.benediction}</p>
            <p className={styles.histoireSignature}>— {motDuPasteur.signature}</p>
            <Link to="/genese" className={styles.histoireLink}>
              {t('accueil.motDuPasteur.cta')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── NÉHÉMIE BANNER ──────────────────────────────────────── */}
      <section className={styles.nehemieBanner} aria-label="Projet Néhémie — collecte">

        {/* Image promesse — sanctuaire */}
        <div className={styles.nehemieBannerImg}>
          <img
            src="/images/sanctuaire.jpeg"
            alt="Vue du sanctuaire du projet Néhémie"
            className={styles.nehemieBannerImgEl}
            loading="eager"
          />
        </div>

        {/* Contenu */}
        <div className={styles.nehemieBannerCopy}>
          <div className={`${styles.eyebrow} ${styles.eyebrowNote}`}>Projet Néhémie</div>
          <h3 className={styles.nehemieBannerTitre}>
            Bâtissons<br/>ensemble.
          </h3>
          <p className={styles.nehemieBannerDesc}>
            Acquisition et rénovation d'une salle permanente pour la prière,
            l'enseignement et le rayonnement de l'assemblée. Chaque don nous rapproche.
          </p>

          {/* Jauge de collecte */}
          <div className={styles.progress}>
            <div className={styles.progressNums}>
              <span className={styles.progressRaised}>
                <b>{formatMontant(projetNehemie.collecte)} {projetNehemie.devise}</b>
                {' '}collectés
              </span>
              <span className={styles.progressGoal}>
                Objectif {formatMontant(projetNehemie.objectif)} {projetNehemie.devise}
              </span>
            </div>
            <div
              className={styles.progressBar}
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${pct} % de l'objectif atteint`}
            >
              <div className={styles.progressBarFill} style={{ width: `${pct}%` }} />
            </div>
            <div className={styles.progressPct}>
              <strong>{pct} %</strong>
              <span> du chemin parcouru</span>
            </div>
          </div>

          <div className={styles.nehemieBannerCtas}>
            <Button variant="blue" as="a" href="/nehemie">
              {t('actions.contribuer')}
            </Button>
            <Button variant="secondary" as="a" href="/nehemie">
              En savoir plus
            </Button>
          </div>
        </div>
      </section>

    </main>
  );
}
