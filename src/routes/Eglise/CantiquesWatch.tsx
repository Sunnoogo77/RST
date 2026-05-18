import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { cantiques } from '../../data/cantiques';
import { sessionsAdoration } from '../../data/sessions-adoration';
import type { Cantique, CantiqueOccurrence, CantiqueFamille, SessionAdoration } from '../../types';
import { youtubeThumbnail } from '../../utils/youtube';
import YouTubePlayer from '../../components/ui/YouTubePlayer/YouTubePlayer';
import HymnaireBrowser from '../../components/ui/HymnaireBrowser/HymnaireBrowser';
import { asset } from '../../utils/asset';
import styles from './CantiquesWatch.module.css';

/* ============================================================
   CANTIQUES WATCH — univers immersif "YouTube des cantiques"
   ------------------------------------------------------------
   Trois modes pris en charge par le même Shell (topbar dark
   + corps blanc + sidebar droite bleutée continue) :

     1) BROWSE   /eglise/cantiques/watch/hymnaire/:famille
        Mini-bibliothèque scopée à une famille (recueil, spéciaux
        ou service de chant). Search + grille. Sidebar masquée.
        Clic carte → ouvre le watch correspondant.

     2) CANTIQUE /eglise/cantiques/watch/:slug
        Vidéo + occurrences + autres ; paroles dans sidebar droite.

     3) SESSION  /eglise/cantiques/watch/session-:slug
        Vidéo + meta dans le centre ; index + paroles empilés
        dans la sidebar droite.

   La topbar partagée porte 3 pills (Recueil / Spéciaux / Service
   de chant) qui sont des onglets de navigation vers le mode
   BROWSE de la famille correspondante — pas de dropdown.

   Pas de Header global ni Footer (voir Shell dans App.tsx).
   ============================================================ */

const SESSION_PREFIX = 'session-';
const VALID_FAMILLES = ['recueil', 'special', 'adoration'] as const;

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
  const { slug, famille } = useParams<{ slug?: string; famille?: string }>();
  const navigate = useNavigate();

  const onClose = useCallback(() => navigate('/eglise/cantiques'), [navigate]);

  /* BROWSE — mini-bibliothèque famille */
  if (famille) {
    if (!(VALID_FAMILLES as readonly string[]).includes(famille)) {
      return <Navigate to="/eglise/cantiques" replace />;
    }
    return <FamilleBrowseView famille={famille as FamillePill} onClose={onClose} />;
  }

  if (!slug) return <Navigate to="/eglise/cantiques" replace />;

  /* SESSION */
  if (slug.startsWith(SESSION_PREFIX)) {
    const sessionSlug = slug.slice(SESSION_PREFIX.length);
    const session = sessionsAdoration.find((s) => s.slug === sessionSlug);
    if (!session) return <Navigate to="/eglise/cantiques" replace />;
    return <SessionView session={session} onBack={onClose} />;
  }

  /* CANTIQUE */
  const cantique =
    cantiques.find((c) => c.slug === slug) ??
    cantiques.find((c) => c.id === slug);
  if (!cantique) return <Navigate to="/eglise/cantiques" replace />;
  return <CantiqueView cantique={cantique} onBack={onClose} />;
}

/* ══════════════════════════════════════════════════════════
   TOPBAR — partagée
   - Pills famille à gauche (Recueil/Spéciaux/Adoration), un clic
     ouvre un dropdown avec les cantiques/sessions de cette famille.
   - Brand logo au centre (label discret).
   - Précédent / Suivant + Fermer (X) à droite. Précédent/Suivant
     navigue DANS la famille courante (slug suivant ou précédent
     dans une liste triée). Désactivés aux bornes.
   ══════════════════════════════════════════════════════════ */

type FamillePill = CantiqueFamille; // 'recueil' | 'special' | 'adoration'

const FAMILLE_PILLS: { key: FamillePill; label: string }[] = [
  { key: 'recueil',   label: 'Recueil'          },
  { key: 'special',   label: 'Spéciaux'         },
  { key: 'adoration', label: 'Service de chant' },
];

interface TopbarProps {
  activeFamille: FamillePill;
  onPrev?: () => void;
  onNext?: () => void;
  onClose: () => void;
}

function Topbar({ activeFamille, onPrev, onNext, onClose }: TopbarProps) {
  const navigate = useNavigate();

  return (
    <header className={styles.topbar} role="banner">
      {/* ── Pills famille (gauche) — onglets de navigation ── */}
      <nav className={styles.familyPills} aria-label="Familles de cantiques">
        {FAMILLE_PILLS.map((p) => {
          const isActive = activeFamille === p.key;
          return (
            <button
              key={p.key}
              type="button"
              className={[
                styles.familyPill,
                isActive ? styles.familyPillActive : '',
              ].join(' ')}
              onClick={() => navigate(`/eglise/cantiques/watch/hymnaire/${p.key}`)}
              aria-current={isActive ? 'page' : undefined}
            >
              {p.label}
            </button>
          );
        })}
      </nav>

      {/* ── Brand (centre) ── */}
      <div className={styles.topbarBrand}>
        <img
          src={asset('/logo-rst.png')}
          alt="Roc Séculaire Tabernacle"
          className={styles.topbarLogo}
          width={36}
          height={23}
        />
        <span className={styles.topbarBrandLbl}>Hymnaire</span>
      </div>

      {/* ── Contrôles (droite) ── */}
      <div className={styles.topbarControls}>
        <button
          type="button"
          className={styles.controlBtn}
          onClick={onPrev}
          disabled={!onPrev}
          aria-label="Précédent dans la même famille"
          title="Précédent (même famille)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          type="button"
          className={styles.controlBtn}
          onClick={onNext}
          disabled={!onNext}
          aria-label="Suivant dans la même famille"
          title="Suivant (même famille)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        <span className={styles.controlDivider} aria-hidden="true" />
        <button
          type="button"
          className={[styles.controlBtn, styles.controlClose].join(' ')}
          onClick={onClose}
          aria-label="Fermer le lecteur"
          title="Fermer (retour à l'hymnaire)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </header>
  );
}

/* ══════════════════════════════════════════════════════════
   MODE BROWSE — mini-bibliothèque scopée à une famille
   Wrapper du watch shell autour de <HymnaireBrowser/>. Toute la
   logique de browsing (search + filtres + grid/list) vit dans le
   composant partagé HymnaireBrowser, lui-même réutilisé en mode
   embarqué dans /eglise/cantiques.
   ══════════════════════════════════════════════════════════ */

interface FamilleBrowseViewProps {
  famille: FamillePill;
  onClose: () => void;
}

function FamilleBrowseView({ famille, onClose }: FamilleBrowseViewProps) {
  return (
    <div className={[styles.watchPage, styles.watchPageBrowse].join(' ')}>
      <Topbar activeFamille={famille} onClose={onClose} />

      <div className={[styles.body, styles.bodyBrowse].join(' ')}>
        <section className={[styles.videoColumn, styles.videoColumnBrowse].join(' ')}>
          <HymnaireBrowser famille={famille} />
        </section>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   LYRICS CARD — bloc paroles avec contrôles A−/A/A+ + PDF
   Réutilisé par CantiqueView ET SessionView (même UI).
   ══════════════════════════════════════════════════════════ */

interface LyricsCardProps {
  cantique: Cantique;
  size: LyricSize;
  onSizeChange: (s: LyricSize) => void;
  /* Inline (recueil) : la carte vit dans le centre blanc et a besoin
     de son propre fond glass + border. Sidebar (autres familles) :
     le fond est porté par la sidebar elle-même. */
  inline?: boolean;
}

function LyricsCard({ cantique, size, onSizeChange, inline }: LyricsCardProps) {
  const hasPdf = !!cantique.pdfUrl;
  return (
    <section
      className={[styles.lyricsCard, inline ? styles.lyricsCardInline : ''].join(' ')}
      aria-label={`Paroles : ${cantique.titre}`}
    >
      <div className={styles.lyricsToolbar}>
        <span className={styles.lyricsLbl}>Paroles · {cantique.titre.replace(/\.$/, '')}</span>
        <div className={styles.lyricsTools}>
          {(['sm', 'md', 'lg'] as LyricSize[]).map((s, i) => (
            <button
              key={s}
              type="button"
              className={[
                styles.lyricsTool,
                size === s ? styles.lyricsToolActive : '',
              ].join(' ')}
              onClick={() => onSizeChange(s)}
              aria-label={`Taille ${['petite', 'normale', 'grande'][i]}`}
            >
              {['A−', 'A', 'A+'][i]}
            </button>
          ))}
          <span className={styles.lyricsDivider} aria-hidden="true" />
          {hasPdf ? (
            <a
              href={cantique.pdfUrl!}
              className={styles.lyricsTool}
              download
              title="Télécharger les paroles en PDF"
            >
              ↓ PDF
            </a>
          ) : (
            <button
              type="button"
              className={styles.lyricsTool}
              disabled
              title="PDF à venir — sera disponible quand l'équipe musicale aura mis en ligne le document"
            >
              ↓ PDF
            </button>
          )}
        </div>
      </div>

      <div className={[styles.lyricsBody, LYRIC_SIZE_CLASSES[size]].join(' ')}>
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
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   MODE CANTIQUE — vidéo + paroles + occurrences + autres
   Layout 1 col : tout dans la zone centrale blanche.
   ══════════════════════════════════════════════════════════ */

interface CantiqueViewProps {
  cantique: Cantique;
  onBack: () => void;
}

function CantiqueView({ cantique, onBack }: CantiqueViewProps) {
  const navigate = useNavigate();
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

  /* Liste triée des cantiques de la même famille — sert pour
     prev/next ET pour la grille "Autres cantiques" en bas. */
  const familySorted = useMemo(() => {
    const list = cantiques.filter((c) => c.famille === cantique.famille);
    if (cantique.famille === 'recueil') {
      list.sort((a, b) => (a.numeroRecueil ?? 0) - (b.numeroRecueil ?? 0));
    } else {
      list.sort((a, b) => a.titre.localeCompare(b.titre));
    }
    return list;
  }, [cantique.famille]);

  const currentIdx = familySorted.findIndex((c) => c.id === cantique.id);
  const prev = currentIdx > 0 ? familySorted[currentIdx - 1] : null;
  const next = currentIdx >= 0 && currentIdx < familySorted.length - 1
    ? familySorted[currentIdx + 1] : null;

  const goPrev = prev
    ? () => navigate(`/eglise/cantiques/watch/${prev.slug ?? prev.id}`)
    : undefined;
  const goNext = next
    ? () => navigate(`/eglise/cantiques/watch/${next.slug ?? next.id}`)
    : undefined;

  const otherCantiques = useMemo(
    () => familySorted.filter((c) => c.id !== cantique.id).slice(0, 6),
    [familySorted, cantique.id],
  );

  /* Mode recueil : paroles dominantes au centre, vidéo en carte
     compacte au-dessus, pas de sidebar droite. Pour spéciaux/sessions :
     vidéo plein centre, paroles dans la sidebar (layout d'origine). */
  const isRecueil = cantique.famille === 'recueil';

  return (
    <div className={styles.watchPage}>
      <Topbar
        activeFamille={cantique.famille}
        onPrev={goPrev}
        onNext={goNext}
        onClose={onBack}
      />

      <div className={[styles.body, isRecueil ? styles.bodyRecueilCantique : ''].join(' ')}>
        <section className={[
          styles.videoColumn,
          isRecueil ? styles.videoColumnRecueilCantique : '',
        ].join(' ')}>
          <div className={styles.videoColumnInner}>

            <div className={[
              styles.playerSlot,
              isRecueil ? styles.playerSlotCompact : '',
            ].join(' ')}>
              {currentOcc ? (
                <YouTubePlayer
                  videoUrl={currentOcc.videoUrl}
                  videoKey={`${cantique.id}-${currentOcc.id}`}
                  autoplay={!isRecueil}
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
                    Le recueil reste consultable côté paroles.
                  </p>
                </div>
              )}
            </div>

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

            {/* Mode recueil : paroles en place du centre, juste après meta. */}
            {isRecueil && (
              <LyricsCard
                cantique={cantique}
                size={lyricSize}
                onSizeChange={setLyricSize}
                inline
              />
            )}

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
          </div>
        </section>

        {/* ── Sidebar droite : PAROLES (carte flottante claire) ──
              Masquée en mode recueil (paroles déjà dans le centre). */}
        {!isRecueil && (
          <aside className={styles.lyricsSidebar} aria-label={`Paroles : ${titleClean}`}>
            <LyricsCard
              cantique={cantique}
              size={lyricSize}
              onSizeChange={setLyricSize}
            />
          </aside>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MODE SESSION — vidéo + paroles du cantique courant
                 + index des cantiques (sidebar droite)
   ══════════════════════════════════════════════════════════ */

interface SessionViewProps {
  session: SessionAdoration;
  onBack: () => void;
}

function SessionView({ session, onBack }: SessionViewProps) {
  const navigate = useNavigate();
  const [currentStartSec, setCurrentStartSec] = useState<number | undefined>(undefined);
  const [currentEndSec, setCurrentEndSec] = useState<number | undefined>(undefined);
  const [highlightedCantiqueId, setHighlightedCantiqueId] = useState<string | null>(null);
  const [lyricSize, setLyricSize] = useState<LyricSize>('md');

  /* Toggle "Cantiques" (index) vs "Paroles" (du cantique courant).
     Par défaut on montre l'index ; un clic sur un cantique bascule
     automatiquement vers les paroles de ce cantique. Le toggle reste
     manipulable manuellement. */
  type SessionSidebarView = 'index' | 'lyrics';
  const [sessionView, setSessionView] = useState<SessionSidebarView>('index');

  const playerKey = `${session.id}-${currentStartSec ?? 'start'}`;

  /* Sync auto sur le timecode : à chaque tick du player, on regarde
     dans cantiquesContenus quel cantique correspond au temps courant.
     Si différent de l'actuel, on met à jour highlightedCantiqueId pour
     que la vue "Paroles" affiche automatiquement les bonnes paroles
     quand la vidéo passe d'un cantique à un autre. */
  const handleTimeUpdate = useCallback(
    (currentSec: number) => {
      const list = session.cantiquesContenus;
      if (!list || list.length === 0) return;
      const match = list.find((cc) =>
        currentSec >= cc.startSec &&
        (cc.endSec === undefined || currentSec < cc.endSec),
      );
      if (match && match.cantiqueId !== highlightedCantiqueId) {
        setHighlightedCantiqueId(match.cantiqueId);
      }
    },
    [session.cantiquesContenus, highlightedCantiqueId],
  );

  /* Cantique référencé par le timecode courant (ou clic manuel).
     Détermine quelles paroles afficher dans la vue "Paroles". */
  const highlightedCantique: Cantique | undefined = useMemo(() => {
    if (!highlightedCantiqueId) return undefined;
    return cantiques.find((c) => c.id === highlightedCantiqueId);
  }, [highlightedCantiqueId]);

  const jumpTo = (cantiqueId: string, startSec: number, endSec?: number) => {
    setCurrentStartSec(startSec);
    setCurrentEndSec(endSec);
    setHighlightedCantiqueId(cantiqueId);
    /* Bascule automatique vers la vue paroles : si l'user a cliqué un
       cantique de l'index, il veut vraisemblablement voir ses paroles. */
    setSessionView('lyrics');
  };

  /* Prev/next sessions — triées par date décroissante (plus récente
     en premier) pour cohérence avec la library /eglise/cantiques. */
  const sessionsSorted = useMemo(
    () => [...sessionsAdoration].sort((a, b) => b.date.localeCompare(a.date)),
    [],
  );
  const currentIdx = sessionsSorted.findIndex((s) => s.id === session.id);
  const prev = currentIdx > 0 ? sessionsSorted[currentIdx - 1] : null;
  const next = currentIdx >= 0 && currentIdx < sessionsSorted.length - 1
    ? sessionsSorted[currentIdx + 1] : null;

  const goPrev = prev
    ? () => navigate(`/eglise/cantiques/watch/session-${prev.slug}`)
    : undefined;
  const goNext = next
    ? () => navigate(`/eglise/cantiques/watch/session-${next.slug}`)
    : undefined;

  return (
    <div className={styles.watchPage}>
      <Topbar
        activeFamille="adoration"
        onPrev={goPrev}
        onNext={goNext}
        onClose={onBack}
      />

      <div className={styles.body}>
        <section className={styles.videoColumn}>
          <div className={styles.videoColumnInner}>

            <div className={styles.playerSlot}>
              <YouTubePlayer
                videoUrl={session.videoUrl}
                videoKey={playerKey}
                autoplay
                startSec={currentStartSec}
                endSec={currentEndSec}
                onTimeUpdate={handleTimeUpdate}
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

          </div>
        </section>

        {/* ── Sidebar droite : toggle Cantiques / Paroles ───────
              Un seul panneau visible à la fois (pas d'empilement
              horizontal qui mange l'écran sur mobile). Le toggle bascule
              entre l'index complet et les paroles du cantique en cours
              (auto-syncé sur le timecode du player). */}
        <aside className={styles.sessionSidebar} aria-label="Cantiques de la session">
          {/* Segmented control */}
          <div className={styles.sessionToggle} role="tablist" aria-label="Vue de la sidebar">
            <button
              type="button"
              role="tab"
              aria-selected={sessionView === 'index'}
              className={[
                styles.sessionToggleBtn,
                sessionView === 'index' ? styles.sessionToggleBtnActive : '',
              ].join(' ')}
              onClick={() => setSessionView('index')}
            >
              Cantiques
              <span className={styles.sessionToggleCount}>
                {session.cantiquesContenus?.length ?? 0}
              </span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={sessionView === 'lyrics'}
              className={[
                styles.sessionToggleBtn,
                sessionView === 'lyrics' ? styles.sessionToggleBtnActive : '',
              ].join(' ')}
              onClick={() => setSessionView('lyrics')}
            >
              Paroles
              {highlightedCantique && (
                <span className={styles.sessionToggleNow} aria-hidden="true">●</span>
              )}
            </button>
          </div>

          {/* Panneau actif : index OU paroles */}
          {sessionView === 'index' ? (
            session.cantiquesContenus && session.cantiquesContenus.length > 0 ? (
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
            )
          ) : highlightedCantique ? (
            <LyricsCard
              cantique={highlightedCantique}
              size={lyricSize}
              onSizeChange={setLyricSize}
            />
          ) : (
            <div className={styles.lyricsHint}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
              <p>
                Laisse la vidéo défiler : les paroles s'afficheront automatiquement quand
                la session entrera dans un cantique répertorié. Ou bascule vers
                <button
                  type="button"
                  className={styles.sessionHintLink}
                  onClick={() => setSessionView('index')}
                >
                  l'onglet Cantiques
                </button>
                pour en choisir un.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
