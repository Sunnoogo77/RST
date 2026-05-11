import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { cantiques } from '../../data/cantiques';
import { sessionsAdoration } from '../../data/sessions-adoration';
import type { Cantique, CantiqueOccurrence, SessionAdoration } from '../../types';
import { youtubeThumbnail } from '../../utils/youtube';
import YouTubePlayer from '../../components/ui/YouTubePlayer/YouTubePlayer';
import { asset } from '../../utils/asset';
import styles from './CantiquesWatch.module.css';

/* ============================================================
   CANTIQUES WATCH — page dédiée à la lecture
   ------------------------------------------------------------
   Route : /eglise/cantiques/watch/:slug
     - slug = id/slug d'un Cantique  → mode CANTIQUE
       Vidéo (occurrence sélectionnée) à gauche, paroles à droite,
       sélecteur d'occurrence si plusieurs vidéos disponibles.
     - slug = "session-{slug}"        → mode SESSION
       Vidéo de la session à gauche, sidebar des cantiques contenus
       à droite (chaque entrée navigue au timestamp).
   Pas de Header global ni Footer (voir Shell dans App.tsx).
   ============================================================ */

const SESSION_PREFIX = 'session-';

type LyricSize = 'sm' | 'md' | 'lg';

const LYRIC_SIZE_CLASSES: Record<LyricSize, string> = {
  sm: styles.lyricSm,
  md: styles.lyricMd,
  lg: styles.lyricLg,
};

function formatLongDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  const raw = d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function formatTimecode(sec: number): string {
  const total = Math.floor(sec);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/* ══════════════════════════════════════════════════════════
   ROUTER
   ══════════════════════════════════════════════════════════ */

export default function CantiquesWatch() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const onBack = useCallback(() => navigate('/eglise/cantiques'), [navigate]);

  if (!slug) return <Navigate to="/eglise/cantiques" replace />;

  /* Mode SESSION : slug commence par "session-". */
  if (slug.startsWith(SESSION_PREFIX)) {
    const sessionSlug = slug.slice(SESSION_PREFIX.length);
    const session = sessionsAdoration.find((s) => s.slug === sessionSlug);
    if (!session) return <Navigate to="/eglise/cantiques" replace />;
    return <SessionView session={session} onBack={onBack} />;
  }

  /* Mode CANTIQUE : on cherche par slug puis par id. */
  const cantique =
    cantiques.find((c) => c.slug === slug) ??
    cantiques.find((c) => c.id === slug);
  if (!cantique) return <Navigate to="/eglise/cantiques" replace />;
  return <CantiqueView cantique={cantique} onBack={onBack} />;
}

/* ══════════════════════════════════════════════════════════
   TOPBAR — partagée entre les deux modes
   ══════════════════════════════════════════════════════════ */

function Topbar({ onBack, eyebrow }: { onBack: () => void; eyebrow: string }) {
  return (
    <header className={styles.topbar} role="banner">
      <button
        type="button"
        className={styles.backBtn}
        onClick={onBack}
        aria-label="Retour à l'hymnaire"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        <span>Retour à l'hymnaire</span>
      </button>

      <div className={styles.topbarBrand}>
        <img
          src={asset('/logo-rst.png')}
          alt="Roc Séculaire Tabernacle"
          className={styles.topbarLogo}
          width={36}
          height={23}
        />
        <span className={styles.topbarBrandLbl}>{eyebrow}</span>
      </div>

      <div />
    </header>
  );
}

/* ══════════════════════════════════════════════════════════
   MODE CANTIQUE — vidéo (occurrence) + paroles
   ══════════════════════════════════════════════════════════ */

interface CantiqueViewProps {
  cantique: Cantique;
  onBack: () => void;
}

function CantiqueView({ cantique, onBack }: CantiqueViewProps) {
  const occurrences = cantique.occurrences ?? [];
  const [selectedOccId, setSelectedOccId] = useState<string | null>(
    occurrences[0]?.id ?? null,
  );
  const [lyricSize, setLyricSize] = useState<LyricSize>('md');

  const currentOcc: CantiqueOccurrence | undefined = useMemo(
    () => occurrences.find((o) => o.id === selectedOccId) ?? occurrences[0],
    [occurrences, selectedOccId],
  );

  const titleClean = cantique.titre.replace(/\.$/, '');

  const otherCantiques = useMemo(() => {
    return cantiques
      .filter((c) => c.id !== cantique.id && c.famille === cantique.famille)
      .slice(0, 6);
  }, [cantique.id, cantique.famille]);

  return (
    <div className={styles.watchPage}>
      <Topbar onBack={onBack} eyebrow="Hymnaire de l'assemblée" />

      <div className={styles.body}>

        {/* ── Colonne vidéo + occurrences + autres cantiques ─── */}
        <section className={styles.videoColumn}>
          <div className={styles.playerSlot}>
            {currentOcc ? (
              <YouTubePlayer
                videoUrl={currentOcc.videoUrl}
                videoKey={`${cantique.id}-${currentOcc.id}`}
                autoplay
                startSec={currentOcc.startSec}
                endSec={currentOcc.endSec}
              />
            ) : (
              <div className={styles.noVideo}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                </svg>
                <p>Aucune vidéo n'a encore été enregistrée pour ce cantique.</p>
                <p className={styles.noVideoHint}>
                  Le recueil reste consultable côté paroles, à droite.
                </p>
              </div>
            )}
          </div>

          {/* Métadonnées sous la vidéo */}
          <div className={styles.videoMeta}>
            <p className={styles.videoFamille}>
              {cantique.famille === 'recueil' ? 'Recueil' :
               cantique.famille === 'special' ? 'Cantique spécial' :
               'Adoration & Louange'}
              {cantique.numeroRecueil && ` · n° ${String(cantique.numeroRecueil).padStart(3, '0')}`}
            </p>
            <h1 className={styles.videoTitle}>{titleClean}</h1>
            {currentOcc && (
              <p className={styles.videoSubtitle}>
                {currentOcc.interpretes.join(' · ')}
                {currentOcc.contexte && (
                  <>
                    <span className={styles.dot} aria-hidden="true">·</span>
                    <span>{currentOcc.contexte}</span>
                  </>
                )}
              </p>
            )}
          </div>

          {/* Sélecteur d'occurrences si plus d'une */}
          {occurrences.length > 1 && (
            <section className={styles.occurrences} aria-label="Vu dans ces vidéos">
              <h2 className={styles.sectionTitle}>Vu aussi dans</h2>
              <ul className={styles.occList}>
                {occurrences.map((occ) => {
                  const active = occ.id === currentOcc?.id;
                  const thumb = youtubeThumbnail(occ.videoUrl);
                  return (
                    <li key={occ.id}>
                      <button
                        type="button"
                        className={[styles.occBtn, active ? styles.occBtnActive : ''].join(' ')}
                        onClick={() => setSelectedOccId(occ.id)}
                        aria-pressed={active}
                      >
                        <div className={styles.occThumb}>
                          {thumb && <img src={thumb} alt="" loading="lazy" />}
                          {typeof occ.startSec === 'number' && (
                            <span className={styles.occTimecode}>
                              {formatTimecode(occ.startSec)}
                            </span>
                          )}
                        </div>
                        <div className={styles.occBody}>
                          <p className={styles.occContexte}>
                            {occ.contexte ?? 'Vidéo'}
                          </p>
                          <p className={styles.occInterpretes}>
                            {occ.interpretes.join(' · ')}
                          </p>
                          {occ.dateEvenement && (
                            <p className={styles.occDate}>
                              {formatLongDate(occ.dateEvenement)}
                            </p>
                          )}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* Autres cantiques de la même famille */}
          {otherCantiques.length > 0 && (
            <section className={styles.related} aria-label="Autres cantiques">
              <h2 className={styles.sectionTitle}>
                {cantique.famille === 'recueil' ? 'Autres cantiques du recueil' :
                 cantique.famille === 'special' ? 'Autres cantiques spéciaux' :
                 'Autres cantiques'}
              </h2>
              <div className={styles.relatedGrid}>
                {otherCantiques.map((c) => {
                  const occ = c.occurrences?.[0];
                  const t = youtubeThumbnail(occ?.videoUrl ?? c.videoUrl);
                  return (
                    <a
                      key={c.id}
                      href={`/eglise/cantiques/watch/${c.slug ?? c.id}`}
                      className={styles.relatedCard}
                    >
                      <div className={styles.relatedThumb}>
                        {t ? (
                          <img src={t} alt="" loading="lazy" />
                        ) : (
                          <div className={styles.relatedThumbEmpty}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9 18V5l12-2v13" />
                              <circle cx="6" cy="18" r="3" />
                              <circle cx="18" cy="16" r="3" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className={styles.relatedBody}>
                        <p className={styles.relatedTitle}>{c.titre.replace(/\.$/, '')}</p>
                        <p className={styles.relatedMeta}>
                          {c.numeroRecueil ? `n° ${String(c.numeroRecueil).padStart(3, '0')}` :
                           c.solisteOuChoeur}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </section>
          )}
        </section>

        {/* ── Sidebar droite : paroles ─────────────────────── */}
        <aside className={styles.lyricsSidebar} aria-label="Paroles">
          <div className={styles.lyricsToolbar}>
            <span className={styles.lyricsLbl}>Paroles</span>
            <div className={styles.lyricsTools}>
              {(['sm', 'md', 'lg'] as LyricSize[]).map((size, i) => (
                <button
                  key={size}
                  type="button"
                  className={[
                    styles.lyricsTool,
                    lyricSize === size ? styles.lyricsToolActive : '',
                  ].join(' ')}
                  onClick={() => setLyricSize(size)}
                  aria-label={`Taille ${['petite', 'normale', 'grande'][i]}`}
                >
                  {['A−', 'A', 'A+'][i]}
                </button>
              ))}
              {cantique.pdfUrl && (
                <>
                  <span className={styles.lyricsDivider} aria-hidden="true" />
                  <a
                    href={cantique.pdfUrl}
                    className={styles.lyricsTool}
                    download
                  >
                    ↓ PDF
                  </a>
                </>
              )}
            </div>
          </div>

          <div className={[styles.lyricsBody, LYRIC_SIZE_CLASSES[lyricSize]].join(' ')}>
            {cantique.lyrics && cantique.lyrics.length > 0 ? (
              cantique.lyrics.map((block, i) => (
                <div
                  key={i}
                  className={[
                    styles.verseBlock,
                    block.type === 'refrain' ? styles.verseBlockRefrain : '',
                    block.type === 'pont' ? styles.verseBlockPont : '',
                  ].join(' ')}
                >
                  <span
                    className={[
                      styles.verseLabel,
                      block.type === 'refrain' ? styles.verseLabelRefrain : '',
                    ].join(' ')}
                  >
                    {block.label}
                  </span>
                  <p>
                    {block.lines.map((line, j) => (
                      <span key={j}>
                        {line}
                        {j < block.lines.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              ))
            ) : (
              <div className={styles.lyricsEmpty}>
                <p>Les paroles de ce cantique seront ajoutées prochainement par l'équipe musicale.</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MODE SESSION — vidéo + index des cantiques contenus
   ══════════════════════════════════════════════════════════ */

interface SessionViewProps {
  session: SessionAdoration;
  onBack: () => void;
}

function SessionView({ session, onBack }: SessionViewProps) {
  /* Cantique courant dans la session : on commence sans saut. Quand
     l'utilisateur clique un cantique de l'index, on charge un nouveau
     videoKey qui inclut le startSec → re-init du player avec start. */
  const [currentStartSec, setCurrentStartSec] = useState<number | undefined>(undefined);
  const [currentEndSec, setCurrentEndSec] = useState<number | undefined>(undefined);
  const [highlightedCantiqueId, setHighlightedCantiqueId] = useState<string | null>(null);

  const playerKey = `${session.id}-${currentStartSec ?? 'start'}`;

  const jumpTo = (cantiqueId: string, startSec: number, endSec?: number) => {
    setCurrentStartSec(startSec);
    setCurrentEndSec(endSec);
    setHighlightedCantiqueId(cantiqueId);
  };

  return (
    <div className={styles.watchPage}>
      <Topbar onBack={onBack} eyebrow="Adoration & Louange" />

      <div className={styles.body}>

        <section className={styles.videoColumn}>
          <div className={styles.playerSlot}>
            <YouTubePlayer
              videoUrl={session.videoUrl}
              videoKey={playerKey}
              autoplay
              startSec={currentStartSec}
              endSec={currentEndSec}
            />
          </div>

          <div className={styles.videoMeta}>
            <p className={styles.videoFamille}>
              Adoration & Louange
              {session.evenement && ` · ${session.evenement}`}
            </p>
            <h1 className={styles.videoTitle}>{session.titre}</h1>
            <p className={styles.videoSubtitle}>
              {session.interpretes.join(' · ')}
              <span className={styles.dot} aria-hidden="true">·</span>
              <span>{formatLongDate(session.date)}</span>
            </p>
          </div>
        </section>

        {/* Sidebar droite : index des cantiques contenus */}
        <aside className={styles.indexSidebar} aria-label="Cantiques de la session">
          <div className={styles.indexHead}>
            <span className={styles.indexLbl}>Cantiques de la session</span>
            <span className={styles.indexCount}>
              {session.cantiquesContenus?.length ?? 0}
            </span>
          </div>

          {session.cantiquesContenus && session.cantiquesContenus.length > 0 ? (
            <ol className={styles.indexList}>
              {session.cantiquesContenus.map((cc, idx) => {
                const active = cc.cantiqueId === highlightedCantiqueId;
                return (
                  <li key={`${cc.cantiqueId}-${idx}`}>
                    <button
                      type="button"
                      className={[styles.indexBtn, active ? styles.indexBtnActive : ''].join(' ')}
                      onClick={() => jumpTo(cc.cantiqueId, cc.startSec, cc.endSec)}
                    >
                      <span className={styles.indexNum}>{String(idx + 1).padStart(2, '0')}</span>
                      <span className={styles.indexBody}>
                        <span className={styles.indexTitle}>{cc.titre}</span>
                        <span className={styles.indexTime}>
                          {formatTimecode(cc.startSec)}
                          {cc.endSec && ` → ${formatTimecode(cc.endSec)}`}
                        </span>
                      </span>
                      <span className={styles.indexPlay} aria-hidden="true">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className={styles.indexEmpty}>
              L'index des cantiques sera ajouté prochainement par l'équipe musicale.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
