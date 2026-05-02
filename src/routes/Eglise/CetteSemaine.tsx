import { useState } from 'react';
import { Link } from 'react-router-dom';
import { vlogSemaine } from '../../data/vlog-semaine';
import { imagesSemaine } from '../../data/images-semaine';
import { annonces } from '../../data/annonces';
import { youtubeEmbedUrl, youtubeThumbnail } from '../../utils/youtube';
import styles from './CetteSemaine.module.css';

/* ── helpers date ───────────────────────────────────────────── */
function getWeekNumber(d: Date): number {
  const date = new Date(d.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  const w1 = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((date.getTime() - w1.getTime()) / 86400000 - 3 + ((w1.getDay() + 6) % 7)) / 7);
}

function formatAnnonceDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  const abbr = d.toLocaleDateString('fr-FR', { weekday: 'short' }).replace(/\./g, '').toUpperCase();
  const mois = d.toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase();
  return `${abbr} ${d.getDate()} ${mois} ${d.getFullYear()}`;
}

export default function CetteSemaine() {
  const [heroPlaying, setHeroPlaying] = useState(false);
  const heroEmbed = youtubeEmbedUrl(vlogSemaine.replayUrl, { autoplay: true });
  const heroThumb = youtubeThumbnail(vlogSemaine.replayUrl);

  const date = new Date(vlogSemaine.date + 'T12:00:00');

  const jourUp   = date.toLocaleDateString('fr-FR', { weekday: 'long' }).toUpperCase();
  const dd       = String(date.getDate()).padStart(2, '0');
  const mm       = String(date.getMonth() + 1).padStart(2, '0');
  const dateCode = `${dd}.${mm}.${date.getFullYear()}`;

  const jourCap  = date.toLocaleDateString('fr-FR', { weekday: 'long' });
  const jourCapF = jourCap.charAt(0).toUpperCase() + jourCap.slice(1);
  const dateSans = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  const semaineNum = getWeekNumber(date);

  return (
    <main id="main-content">

      {/* ══════════════════════════════════════════════════════════
          HERO — vidéo gauche · infos sermon droite
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.hero} aria-label="Culte de cette semaine">
        <div className={`${styles.heroInner} ${heroPlaying ? styles.heroInnerExpanded : ''}`}>

        {/* Gauche : vidéo / vignette */}
        <div className={`${styles.heroMedia} ${heroPlaying ? styles.heroMediaExpanded : ''}`}>
          {heroPlaying && heroEmbed ? (
            <iframe
              className={styles.heroIframe}
              src={heroEmbed}
              title={`Replay — ${vlogSemaine.titreMessage}${vlogSemaine.titreSuffix ? ' ' + vlogSemaine.titreSuffix : ''}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              {heroThumb && (
                <img
                  src={heroThumb}
                  alt={`Aperçu — ${vlogSemaine.titreMessage}`}
                  className={styles.heroThumb}
                  loading="lazy"
                />
              )}
              <button
                className={styles.heroPlay}
                onClick={() => heroEmbed && setHeroPlaying(true)}
                aria-label="Regarder le replay"
                disabled={!heroEmbed}
              >
                <span className={styles.heroPlayIcon} aria-hidden="true">▶</span>
              </button>
              <div className={styles.heroBadgeReplay} aria-label="Replay du dernier culte">
                REPLAY
              </div>
            </>
          )}
        </div>

        {/* Droite : informations sermon */}
        <div className={styles.heroContent}>
          <p className={styles.heroMeta}>
            MIS À JOUR &nbsp;·&nbsp; {jourUp} {dateCode}
          </p>
          <h1 className={styles.heroTitre}>
            {vlogSemaine.titreMessage}
            {vlogSemaine.titreSuffix && <> <em>{vlogSemaine.titreSuffix}</em></>}
          </h1>
          <p className={styles.heroDateHeure}>
            {jourCapF} &nbsp;·&nbsp; {dateSans} &nbsp;·&nbsp; {vlogSemaine.heureCulte}
          </p>
          <p className={styles.heroPredicateur}>{vlogSemaine.predicateur}</p>
          <blockquote className={styles.heroVerset}>
            <p className={styles.heroVersetTexte}>{vlogSemaine.verset.texte}</p>
            <cite className={styles.heroVersetRef}>{vlogSemaine.verset.reference}</cite>
          </blockquote>
        </div>
        </div>{/* fin heroInner */}
      </section>

      {/* ══════════════════════════════════════════════════════════
          FIL DU MESSAGE
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.fil} aria-label="Fil du message">
        <div className={styles.filInner}>
          <p className={styles.filLabel}>LE FIL DU MESSAGE</p>
          <p className={styles.filTexte}>{vlogSemaine.filDuMessage.paragraphe1}</p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          GALERIE — grille asymétrique 6 photos
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.galerie} aria-label="Photos de la semaine">
        <div className={styles.galerieInner}>
          <div className={styles.galerieHeader}>
            <h2 className={styles.galerieTitre}>Images de la semaine</h2>
            <p className={styles.galerieMeta}>
              SEMAINE {semaineNum} &nbsp;·&nbsp; {imagesSemaine.length} PHOTOS
            </p>
          </div>
          <div className={styles.galerieGrid} role="list" aria-label="Galerie photos">
            {imagesSemaine.map((img) => {
              const isPlaceholder = img.src.includes('placeholder');
              return (
                <div key={img.id} className={styles.galerieItem} role="listitem">
                  {isPlaceholder ? (
                    <div className={styles.galeriePlaceholder} aria-label={img.caption}>
                      <span className={styles.galeriePlaceholderLabel} aria-hidden="true">
                        PHOTO · À FOURNIR
                      </span>
                    </div>
                  ) : (
                    <img
                      src={img.src}
                      alt={img.caption}
                      className={styles.galerieImg}
                      loading="lazy"
                    />
                  )}
                </div>
              );
            })}
          </div>
          <p className={styles.galerieNote} aria-hidden="true">
            grille asymétrique · {imagesSemaine.length} placeholders · l'équipe média remplace après chaque culte
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CANTIQUE SPÉCIAL + TÉMOIGNAGE
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.duo} aria-label="Cantique et témoignage de la semaine">
        <div className={styles.duoInner}>

          {/* Cantique */}
          <div className={styles.duoCantique}>
            <p className={styles.duoLabel}>CANTIQUE SPÉCIAL</p>
            <h2 className={styles.duoCantiqueTitre}>{vlogSemaine.cantiqueSemaine.titre}</h2>
            <div className={styles.duoPlayer} aria-label="Lecteur vidéo">
              {(() => {
                const embed = youtubeEmbedUrl(vlogSemaine.cantiqueSemaine.videoUrl);
                return embed ? (
                  <iframe
                    className={styles.duoIframe}
                    src={embed}
                    title={`Cantique — ${vlogSemaine.cantiqueSemaine.titre}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                ) : (
                  <button className={styles.duoPlayerBtn} aria-label="Lire le cantique">
                    <span className={styles.duoPlayerIcon} aria-hidden="true">▶</span>
                  </button>
                );
              })()}
            </div>
            <p className={styles.duoCantiqueSoliste}>{vlogSemaine.cantiqueSemaine.soliste}</p>
          </div>

          {/* Témoignage */}
          <div className={styles.duoTemoignage}>
            <p className={styles.duoLabel}>TÉMOIGNAGE DE LA SEMAINE</p>
            <span className={styles.duoGuillemet} aria-hidden="true">❝</span>
            <p className={styles.duoTemoignageTexte}>{vlogSemaine.temoignageSemaine.texte}</p>
            <p className={styles.duoTemoignageAuteur}>
              — {vlogSemaine.temoignageSemaine.auteur.toUpperCase()}
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          ANNONCES
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.annonces} aria-label="Annonces de l'assemblée">
        <div className={styles.annoncesInner}>
          <div className={styles.annoncesHeader}>
            <div>
              <h2 className={styles.annoncesTitre}>Annonces</h2>
              <p className={styles.annoncesSubtitre}><em>à venir.</em></p>
            </div>
            <Link to="/eglise/annonces" className={styles.annoncesLienAll}>
              VOIR TOUTES LES ANNONCES →
            </Link>
          </div>
          <div className={styles.annoncesRule} aria-hidden="true" />
          <div className={styles.annoncesGrid}>
            {annonces.slice(0, 3).map((a, i) => (
              <article
                key={a.id}
                className={`${styles.annonceCol} ${i < 2 ? styles.annonceColBorder : ''}`}
                aria-label={a.titre}
              >
                <p className={styles.annonceDate}>
                  {a.dateDisplay ?? formatAnnonceDate(a.date)}
                </p>
                <h3 className={styles.annonceTitre}>{a.titre}</h3>
                <p className={styles.annonceDesc}>{a.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
