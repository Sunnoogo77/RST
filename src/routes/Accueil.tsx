import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LivePill } from '../components/ui/LivePill/LivePill';
import { Button } from '../components/ui/Button/Button';
import { rendezVous } from '../data/rendez-vous';
import { sermons } from '../data/sermons';
import { projetNehemie } from '../data/nehemie';
import { motDuPasteur } from '../data/genese/mot-du-pasteur';
import { youtubeEmbedUrl, youtubeThumbnail } from '../utils/youtube';
import { asset } from '../utils/asset';
import type { RendezVous, JourCulte } from '../types';
import styles from './Accueil.module.css';

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
  const { t, i18n } = useTranslation();

  const locale = i18n.language === 'en' ? 'en-US' : 'fr-FR';

  const schedTime = (rv: RendezVous): string => {
    if (rv.jour === 'vendredi') return t('accueil.scheduleTime.des', { heure: rv.heureDebut });
    if (rv.jour === 'dimanche') return t('accueil.scheduleTime.dimanche', { debut: rv.heureDebut });
    return t('accueil.scheduleTime.interval', { debut: rv.heureDebut, fin: rv.heureFin });
  };

  const schedMain = (jour: JourCulte): string => {
    if (jour === 'mercredi') return t('accueil.scheduleLabels.mercrediMain');
    if (jour === 'dimanche') return t('accueil.scheduleLabels.dimancheMain');
    return t('accueil.scheduleLabels.vendrediMain');
  };

  const schedAddr = (jour: JourCulte): string =>
    jour === 'vendredi'
      ? t('accueil.scheduleLabels.addrVendredi')
      : t('accueil.scheduleLabels.addrBacchus');

  const formatMontant = (n: number): string => n.toLocaleString(locale);

  const dernierSermon = sermons[0];
  const dernierEmbed = youtubeEmbedUrl(dernierSermon.videoUrl, { autoplay: true });
  const dernierThumb = youtubeThumbnail(dernierSermon.videoUrl);
  const [msgPlaying, setMsgPlaying] = useState(false);

  const pct = Math.round((projetNehemie.collecte / projetNehemie.objectif) * 100);
  const dateSermon = new Date(dernierSermon.date).toLocaleDateString(locale, {
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
              <p className={styles.heroAssemblee}>{t('accueil.heroAssemblee')}</p>
              <h1 className={styles.heroTitle}>
                {t('accueil.heroTitleLine1')}<br/>{t('accueil.heroTitleLine2')}
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
              src={asset('/images/jesus.jpg')}
              alt={t('accessibility.portraitAlt')}
              className={styles.heroJesusImg}
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* ── PROCHAINES RÉUNIONS ─────────────────────────────────── */}
      <section className={styles.schedule} aria-label={t('accueil.scheduleEyebrow')}>
        <div className={styles.schedInner}>
          <div className={styles.eyebrow}>{t('accueil.scheduleEyebrow')}</div>
          <h2 className={styles.hSerif}>
            {t('accueil.scheduleTitleLine1')}<br/><em>{t('accueil.scheduleTitleLine2')}</em>
          </h2>

          <div className={styles.schedGrid}>
            {rendezVous.map((rv) => (
              <div key={rv.id} className={styles.schedItem}>
                <div className={styles.schedDay}>
                  {t(`accueil.scheduleDays.${rv.jour}`)}
                  {rv.jour === 'vendredi' && (
                    <span className={styles.schedStar}> *</span>
                  )}
                </div>
                <div className={styles.schedTime}>{schedTime(rv)}</div>
                <div className={styles.schedLabel}>
                  {schedMain(rv.jour)}
                  <br/>
                  {rv.jour === 'vendredi'
                    ? <em>{schedAddr(rv.jour)}</em>
                    : schedAddr(rv.jour)
                  }
                </div>
              </div>
            ))}
          </div>

          <div className={styles.schedFoot}>
            <span className={styles.schedPin}>
              <span aria-hidden="true">📍</span>
              {' '}<strong>{t('accueil.scheduleFootPin')}</strong>{' '}
              {t('accueil.scheduleFootAddr')}
            </span>
            <span className={styles.schedMapLink}>{t('accueil.scheduleFootMap')}</span>
          </div>
        </div>
      </section>

      {/* ── DERNIER MESSAGE ─────────────────────────────────────── */}
      <section className={styles.lastMsg} aria-label={t('accueil.lastMsgEyebrow')}>
        <div className={`${styles.lastMsgInner} ${msgPlaying ? styles.lastMsgInnerExpanded : ''}`}>
          <div className={styles.eyebrow}>{t('accueil.lastMsgEyebrow')}</div>
          <div className={`${styles.lastMsgGrid} ${msgPlaying ? styles.lastMsgGridExpanded : ''}`}>

            {/* Lecteur vidéo : miniature + play, ou iframe quand on clique */}
            <div
              className={`${styles.lastMsgVideo} ${msgPlaying ? styles.lastMsgVideoExpanded : ''}`}
              role={msgPlaying ? undefined : 'img'}
              aria-label={`Replay — ${dernierSermon.titre}`}
            >
              {msgPlaying && dernierEmbed ? (
                <iframe
                  className={styles.lastMsgIframe}
                  src={dernierEmbed}
                  title={`Replay — ${dernierSermon.titre}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  {dernierThumb && (
                    <img
                      src={dernierThumb}
                      alt={`Aperçu — ${dernierSermon.titre}`}
                      className={styles.lastMsgThumb}
                      loading="lazy"
                    />
                  )}
                  <div className={styles.lastMsgPlay}>
                    <button
                      className={styles.lastMsgPlayBtn}
                      onClick={() => dernierEmbed && setMsgPlaying(true)}
                      aria-label={t('accueil.lastMsgPlay')}
                      disabled={!dernierEmbed}
                    >
                      <span className={styles.lastMsgPlayTriangle} aria-hidden="true" />
                    </button>
                  </div>

                  <div className={styles.lastMsgMeta}>
                    <span className={styles.lastMsgMetaLine}>
                      <span className={styles.lastMsgDot} aria-hidden="true" />
                      {t('accueil.lastMsgYouTube')}
                    </span>
                    {dernierSermon.duree && (
                      <span className={styles.lastMsgDuration}>{dernierSermon.duree}</span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Texte — visible avant ET pendant la lecture, mais restylé */}
            <div className={`${styles.lastMsgCopy} ${msgPlaying ? styles.lastMsgCopyExpanded : ''}`}>
              <div className={styles.lastMsgRef}>
                {dateLabel} · {t('accueil.lastMsgCulteSuffix')}
              </div>

              <h3 className={styles.lastMsgTitle}>
                {msgPlaying
                  ? dernierSermon.titre.replace(/\.$/, '')
                  : `« ${dernierSermon.titre.replace(/\.$/, '')} »`}
              </h3>

              {msgPlaying ? (
                <p className={styles.lastMsgPredicateur}>{dernierSermon.predicateur}</p>
              ) : (
                <>
                  <p className={styles.lastMsgSerie}>
                    {dernierSermon.serie}
                    {dernierSermon.numeroSerie ? ` #${dernierSermon.numeroSerie}` : ''}
                    {' · '}
                    {dernierSermon.titre.replace(/\.$/, '').toUpperCase()}
                  </p>

                  {dernierSermon.description && (
                    <p className={styles.lastMsgDesc}>{dernierSermon.description}</p>
                  )}
                </>
              )}

              <div className={styles.lastMsgActions}>
                <Button variant="blue" as="a" href="/eglise/cultes">
                  {t('actions.ecouterMessage')}
                </Button>
                <Button variant="secondary" as="a" href="/eglise/cultes">
                  {t('actions.tousMessages')}
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
              src={asset('/pastor-ndaye.jpeg')}
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
      <section className={styles.nehemieBanner} aria-label={t('accueil.nehemieBanner.eyebrow')}>

        {/* Image promesse — sanctuaire */}
        <div className={styles.nehemieBannerImg}>
          <img
            src={asset('/images/sanctuaire.jpeg')}
            alt={t('accueil.nehemieBanner.imgAlt')}
            className={styles.nehemieBannerImgEl}
            loading="eager"
          />
        </div>

        {/* Contenu */}
        <div className={styles.nehemieBannerCopy}>
          <div className={`${styles.eyebrow} ${styles.eyebrowNote}`}>
            {t('accueil.nehemieBanner.eyebrow')}
          </div>
          <h3 className={styles.nehemieBannerTitre}>
            {t('accueil.nehemieBanner.titreLine1')}<br/>{t('accueil.nehemieBanner.titreLine2')}
          </h3>
          <p className={styles.nehemieBannerDesc}>
            {t('accueil.nehemieBanner.desc')}
          </p>

          {/* Jauge de collecte */}
          <div className={styles.progress}>
            <div className={styles.progressNums}>
              <span className={styles.progressRaised}>
                <b>{formatMontant(projetNehemie.collecte)} {projetNehemie.devise}</b>
                {' '}{t('accueil.nehemieBanner.raisedSuffix')}
              </span>
              <span className={styles.progressGoal}>
                {t('accueil.nehemieBanner.goalPrefix')} {formatMontant(projetNehemie.objectif)} {projetNehemie.devise}
              </span>
            </div>
            <div
              className={styles.progressBar}
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${pct} % ${t('nehemie.objectifAtteint')}`}
            >
              <div className={styles.progressBarFill} style={{ width: `${pct}%` }} />
            </div>
            <div className={styles.progressPct}>
              <strong>{pct} %</strong>
              <span> {t('accueil.nehemieBanner.percentSuffix')}</span>
            </div>
          </div>

          <div className={styles.nehemieBannerCtas}>
            <Button variant="blue" as="a" href="/nehemie">
              {t('actions.contribuer')}
            </Button>
            <Button variant="secondary" as="a" href="/nehemie">
              {t('actions.enSavoirPlus')}
            </Button>
          </div>
        </div>
      </section>

    </main>
  );
}
