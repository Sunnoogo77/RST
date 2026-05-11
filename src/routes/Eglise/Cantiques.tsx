import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { cantiques, cantiqueCounts } from '../../data/cantiques';
import type { CantiqueFamille } from '../../types';
import { youtubeEmbedUrl, youtubeThumbnail } from '../../utils/youtube';
import styles from './Cantiques.module.css';

/* ── Constants ───────────────────────────────────────────── */

type FamilyFilter = 'tous' | CantiqueFamille;
type LyricSize = 'sm' | 'md' | 'lg';

const FAMILY_TABS: { id: FamilyFilter; label: string }[] = [
  { id: 'tous',      label: `Tous · ${cantiqueCounts.tous}` },
  { id: 'recueil',   label: `Du recueil · ${cantiqueCounts.recueil}` },
  { id: 'special',   label: `Cantiques spéciaux · ${cantiqueCounts.special}` },
  { id: 'adoration', label: `Adoration & Louange · ${cantiqueCounts.adoration}` },
];

const FAMILLE_OVERLAY: Record<CantiqueFamille, string> = {
  recueil:   'Du recueil',
  special:   'Cantique spécial',
  adoration: 'Adoration & Louange',
};

const LYRIC_SIZE_CLASSES: Record<LyricSize, string> = {
  sm: styles.lyricSm,
  md: styles.lyricMd,
  lg: styles.lyricLg,
};

/* ── Component ───────────────────────────────────────────── */

export default function Cantiques() {
  const { t } = useTranslation();
  const featuredId = cantiques.find((c) => c.estVedette)?.id ?? cantiques[0].id;

  const [activeFamily, setActiveFamily] = useState<FamilyFilter>('tous');
  const [selectedId, setSelectedId] = useState(featuredId);
  const [lyricSize, setLyricSize] = useState<LyricSize>('md');
  // Démarrage de la vidéo en autoplay uniquement après un clic utilisateur :
  // au chargement initial le cantique vedette n'est pas lancé sans demande.
  const [autoplay, setAutoplay] = useState(false);

  const detailRef = useRef<HTMLElement>(null);

  const filtered =
    activeFamily === 'tous'
      ? cantiques
      : cantiques.filter((c) => c.famille === activeFamily);

  const selected = cantiques.find((c) => c.id === selectedId) ?? cantiques[0];

  const handleCardClick = (id: string) => {
    setSelectedId(id);
    setLyricSize('md');
    setAutoplay(true);
    setTimeout(
      () => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      50
    );
  };

  const detailTitlePrefix = selected.titleEm
    ? selected.titre.slice(0, selected.titre.length - selected.titleEm.length).trim()
    : selected.titre;

  const detailBy =
    selected.detailBy ??
    [selected.solisteOuChoeur, selected.recordedAt ? `enregistré le ${selected.recordedAt}` : null]
      .filter(Boolean)
      .join(' · ');

  const videoMetaParts = [
    selected.duration,
    selected.recordingType === 'studio'
      ? 'enregistrement studio'
      : selected.recordingType === 'live'
      ? 'enregistrement live'
      : selected.recordingType === 'culte'
      ? 'enregistrement culte'
      : null,
  ].filter(Boolean);

  return (
    <main id="main-content">

      {/* ══════════════════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.hero} aria-label={t('eglise.cantiques.eyebrow')}>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>{t('eglise.cantiques.eyebrow')}</div>
          <h1 className={styles.heroTitle}>
            {t('eglise.cantiques.titreLine1')}<br/><em>{t('eglise.cantiques.titreLine2')}</em>
          </h1>
          <div className={styles.heroRef}>{t('eglise.cantiques.ref')}</div>
          <p className={styles.heroLede}>{t('eglise.cantiques.lede')}</p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          ONGLETS FAMILLES + RECHERCHE
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.families} aria-label="Filtrer les cantiques">
        <div className={styles.famTabs} role="tablist">
          {FAMILY_TABS.map(({ id, label }) => (
            <button
              key={id}
              role="tab"
              aria-selected={activeFamily === id}
              className={`${styles.fam} ${activeFamily === id ? styles.famActive : ''}`}
              onClick={() => setActiveFamily(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className={styles.famSearch}>
          <span className={styles.searchIcon} aria-hidden="true">⌕</span>
          <input
            type="text"
            placeholder="Rechercher un cantique"
            aria-label="Rechercher un cantique"
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          GRILLE 4 COLONNES
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.grid} aria-label="Hymnaire">
        {filtered.map((c) => {
          const thumb = youtubeThumbnail(c.videoUrl);
          return (
          <article
            key={c.id}
            className={`${styles.card} ${c.estVedette ? styles.cardFeatured : ''}`}
            onClick={() => handleCardClick(c.id)}
            aria-label={c.titre}
            aria-pressed={selectedId === c.id}
          >
            <div className={`${styles.thumb} ${thumb ? '' : styles.thumbFallback}`}>
              {thumb && (
                <img
                  src={thumb}
                  alt=""
                  className={styles.thumbImg}
                  loading="lazy"
                />
              )}
              <button
                className={`${styles.thumbPlay} ${c.estVedette ? styles.thumbPlayFeatured : ''}`}
                aria-label={`Lire ${c.titre}`}
                tabIndex={-1}
              >
                ▶
              </button>
            </div>
            <div className={styles.cardBody}>
              <h3 className={c.estVedette ? styles.cardTitleFeatured : styles.cardTitle}>
                {c.titre}
              </h3>
              <div className={styles.cardMeta}>{c.solisteOuChoeur}</div>
              <div className={styles.cardFoot}>
                <span className={styles.cantNum}>№ {c.numero}</span>
                {c.recordedAt && c.estVedette && (
                  <span className={styles.cantDate}>Enregistré · {c.recordedAt}</span>
                )}
              </div>
            </div>
          </article>
          );
        })}
      </section>

      {/* ══════════════════════════════════════════════════════════
          FICHE DÉTAIL
          ══════════════════════════════════════════════════════════ */}
      <section
        ref={detailRef}
        className={styles.detail}
        aria-label={`Fiche : ${selected.titre}`}
      >
        <div className={styles.detailMeta}>
          <button
            className={styles.backLink}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            ← Retour à l'hymnaire
          </button>
          <span className={styles.detailTag}>
            {FAMILLE_OVERLAY[selected.famille]} · № {selected.numero}
          </span>
        </div>

        <h2 className={styles.detailTitle}>
          {selected.titleEm ? (
            <>{detailTitlePrefix}<br/><em>{selected.titleEm}</em></>
          ) : (
            selected.titre
          )}
        </h2>

        <div className={styles.detailBy}>{detailBy}</div>

        <div className={styles.detailGrid}>

          {/* Vidéo */}
          <div className={styles.detailVideo}>
            {(() => {
              const embed = youtubeEmbedUrl(selected.videoUrl, { autoplay });
              return embed ? (
                <iframe
                  key={selected.id}
                  className={styles.videoIframe}
                  src={embed}
                  title={`Lecteur YouTube — ${selected.titre}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              ) : (
                <div className={styles.videoPoster} aria-label="Vidéo du cantique">
                  <button className={styles.detailPlayBtn} aria-label="Lire le cantique">▶</button>
                </div>
              );
            })()}
            <div className={styles.videoMeta}>
              {videoMetaParts.length > 0 ? videoMetaParts.join(' · ') : 'vidéo disponible'}
            </div>
          </div>

          {/* Paroles */}
          <div className={styles.detailLyrics}>
            <div className={styles.lyricToolbar}>
              <span className={styles.lyrLbl}>Paroles</span>
              <div className={styles.lyrTools}>
                {(['sm', 'md', 'lg'] as LyricSize[]).map((size, i) => (
                  <button
                    key={size}
                    className={`${styles.lyrTool} ${lyricSize === size ? styles.lyrToolActive : ''}`}
                    onClick={() => setLyricSize(size)}
                  >
                    {['A−', 'A', 'A+'][i]}
                  </button>
                ))}
                <span className={styles.lyrDivider} aria-hidden="true" />
                <a href={selected.pdfUrl ?? '#'} className={styles.lyrTool}>↓ PDF</a>
              </div>
            </div>

            <div className={`${styles.lyricBody} ${LYRIC_SIZE_CLASSES[lyricSize]}`}>
              {selected.lyrics && selected.lyrics.length > 0 ? (
                selected.lyrics.map((block, i) => (
                  <div
                    key={i}
                    className={`${styles.verseBlock} ${block.type === 'refrain' ? styles.verseBlockRefrain : ''}`}
                  >
                    <span
                      className={`${styles.verseNum} ${block.type === 'refrain' ? styles.verseNumRefrain : ''}`}
                    >
                      {block.label}
                    </span>
                    <p>
                      {block.lines.map((line, j) => (
                        <span key={j}>
                          {line}
                          {j < block.lines.length - 1 && <br/>}
                        </span>
                      ))}
                    </p>
                  </div>
                ))
              ) : (
                <p className={styles.lyricEmpty}>
                  Paroles à renseigner par l'équipe musicale.
                </p>
              )}
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}
