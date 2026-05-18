import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { cantiques } from '../../data/cantiques';
import { sessionsAdoration } from '../../data/sessions-adoration';
import type { Cantique, CantiqueOccurrence, CantiqueFamille, SessionAdoration } from '../../types';
import { youtubeThumbnail } from '../../utils/youtube';
import YouTubePlayer from '../../components/ui/YouTubePlayer/YouTubePlayer';
import { asset } from '../../utils/asset';
import styles from './CantiquesWatch.module.css';

/* ============================================================
   CANTIQUES WATCH — univers immersif "YouTube des cantiques"
   ------------------------------------------------------------
   Trois modes pris en charge par le même Shell (topbar dark
   + corps blanc + sidebar droite bleutée continue) :

     1) BROWSE   /eglise/cantiques/watch/famille/:famille
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
              onClick={() => navigate(`/eglise/cantiques/watch/famille/${p.key}`)}
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
   Plein la zone centrale (sidebar paroles masquée). Search +
   grille de cartes ; clic → ouvre le watch correspondant.
   ══════════════════════════════════════════════════════════ */

interface FamilleBrowseViewProps {
  famille: FamillePill;
  onClose: () => void;
}

interface BrowseItem {
  key: string;
  slug: string;
  title: string;
  meta: string;
  subMeta?: string;
  thumb: string | null;
  year?: string;   // pour les chips de filtrage "par année"
  numero?: number; // pour la liste-recueil (badge n°)
  isSession: boolean;
}

function FamilleBrowseView({ famille, onClose }: FamilleBrowseViewProps) {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  // Reset les filtres quand on change de famille (URL change).
  useEffect(() => {
    setQ('');
    setSelectedYear(null);
  }, [famille]);

  const items: BrowseItem[] = useMemo(() => {
    if (famille === 'adoration') {
      return [...sessionsAdoration]
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((s) => ({
          key: s.id,
          slug: s.slug,
          title: s.titre,
          meta: s.interpretes.join(' · '),
          subMeta: `${formatLongDate(s.date)}${s.evenement ? ` · ${s.evenement}` : ''}`,
          thumb: youtubeThumbnail(s.videoUrl),
          year: s.date.slice(0, 4),
          isSession: true,
        }));
    }
    const list = cantiques.filter((c) => c.famille === famille);
    if (famille === 'recueil') {
      list.sort((a, b) => (a.numeroRecueil ?? 0) - (b.numeroRecueil ?? 0));
      return list.map((c) => {
        const occ = c.occurrences?.[0];
        return {
          key: c.id,
          slug: c.slug ?? c.id,
          title: c.titre.replace(/\.$/, ''),
          meta: c.numeroRecueil
            ? `n° ${String(c.numeroRecueil).padStart(3, '0')}`
            : c.solisteOuChoeur,
          subMeta: c.numeroRecueil ? c.solisteOuChoeur : undefined,
          thumb: youtubeThumbnail(occ?.videoUrl ?? c.videoUrl),
          numero: c.numeroRecueil ?? undefined,
          isSession: false,
        };
      });
    }
    // special — tri par date d'événement la plus récente
    list.sort((a, b) => {
      const dateA = a.occurrences?.[0]?.dateEvenement ?? '';
      const dateB = b.occurrences?.[0]?.dateEvenement ?? '';
      return dateB.localeCompare(dateA);
    });
    return list.map((c) => {
      const occ = c.occurrences?.[0];
      return {
        key: c.id,
        slug: c.slug ?? c.id,
        title: c.titre.replace(/\.$/, ''),
        meta: occ?.interpretes.join(' · ') ?? c.solisteOuChoeur,
        subMeta: occ?.dateEvenement ? formatLongDate(occ.dateEvenement) : occ?.contexte,
        thumb: youtubeThumbnail(occ?.videoUrl ?? c.videoUrl),
        year: occ?.dateEvenement?.slice(0, 4),
        isSession: false,
      };
    });
  }, [famille]);

  /* Années disponibles dans le set courant — décroissant. Affiché en
     chips au-dessus de la grille pour les familles datées (pas recueil). */
  const availableYears = useMemo(() => {
    if (famille === 'recueil') return [];
    const set = new Set<string>();
    items.forEach((it) => { if (it.year) set.add(it.year); });
    return [...set].sort((a, b) => b.localeCompare(a));
  }, [items, famille]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((it) => {
      if (selectedYear && it.year !== selectedYear) return false;
      if (!needle) return true;
      const hay = `${it.title} ${it.meta} ${it.subMeta ?? ''}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [items, q, selectedYear]);

  const goTo = (it: BrowseItem) => {
    navigate(
      it.isSession
        ? `/eglise/cantiques/watch/session-${it.slug}`
        : `/eglise/cantiques/watch/${it.slug}`,
    );
  };

  const eyebrow =
    famille === 'recueil' ? 'Recueil' :
    famille === 'special' ? 'Cantiques spéciaux' :
                            'Service de chant';
  const title =
    famille === 'recueil' ? 'Le recueil de l\'assemblée' :
    famille === 'special' ? 'Cantiques spéciaux' :
                            'Services de chant';
  const hint =
    famille === 'recueil'
      ? 'Tous les cantiques du recueil. Choisis-en un pour découvrir les vidéos dans lesquelles il a été interprété.'
      : famille === 'special'
      ? 'Solos, duos et interprétations spéciales captés au sanctuaire ou en studio.'
      : 'Sessions complètes d\'adoration & louange — vidéo intégrale et index des cantiques contenus.';
  const placeholder =
    famille === 'recueil'  ? 'Rechercher par numéro, titre, soliste…' :
    famille === 'special'  ? 'Rechercher par titre, interprète, contexte…' :
                             'Rechercher une session par titre, événement, date…';

  return (
    <div className={[styles.watchPage, styles.watchPageBrowse].join(' ')}>
      <Topbar activeFamille={famille} onClose={onClose} />

      <div className={[styles.body, styles.bodyBrowse].join(' ')}>
        <section className={[styles.videoColumn, styles.videoColumnBrowse].join(' ')}>
          <div className={styles.browseInner}>
            <header className={styles.browseHead}>
              <p className={styles.browseEyebrow}>{eyebrow}</p>
              <h1 className={styles.browseTitle}>{title}</h1>
              <p className={styles.browseHint}>{hint}</p>
            </header>

            <div className={styles.browseSearchBar}>
              <svg
                className={styles.browseSearchIcon}
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={placeholder}
                className={styles.browseSearchInput}
                aria-label="Rechercher"
              />
              {q && (
                <button
                  type="button"
                  className={styles.browseSearchClear}
                  onClick={() => setQ('')}
                  aria-label="Effacer la recherche"
                >
                  ×
                </button>
              )}
            </div>

            {availableYears.length > 0 && (
              <div className={styles.browseFilters} role="group" aria-label="Filtrer par année">
                <span className={styles.browseFiltersLbl}>Année</span>
                <div className={styles.browseChips}>
                  <button
                    type="button"
                    className={[
                      styles.browseChip,
                      !selectedYear ? styles.browseChipActive : '',
                    ].join(' ')}
                    onClick={() => setSelectedYear(null)}
                    aria-pressed={!selectedYear}
                  >
                    Toutes
                  </button>
                  {availableYears.map((y) => (
                    <button
                      key={y}
                      type="button"
                      className={[
                        styles.browseChip,
                        selectedYear === y ? styles.browseChipActive : '',
                      ].join(' ')}
                      onClick={() => setSelectedYear(y === selectedYear ? null : y)}
                      aria-pressed={selectedYear === y}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className={styles.browseCount}>
              {filtered.length} {filtered.length > 1 ? 'résultats' : 'résultat'}
              {q && ` pour « ${q} »`}
              {selectedYear && ` · ${selectedYear}`}
            </p>

            {filtered.length > 0 ? (
              famille === 'recueil' ? (
                <RecueilLayout items={filtered} onSelect={goTo} />
              ) : (
                <div className={styles.browseGrid}>
                  {filtered.map((it) => (
                    <button
                      key={it.key}
                      type="button"
                      className={styles.browseCard}
                      onClick={() => goTo(it)}
                    >
                      <div className={styles.browseThumb}>
                        {it.thumb ? (
                          <img src={it.thumb} alt="" loading="lazy" />
                        ) : (
                          <div className={styles.browseThumbEmpty}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9 18V5l12-2v13" />
                              <circle cx="6" cy="18" r="3" />
                              <circle cx="18" cy="16" r="3" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className={styles.browseCardBody}>
                        <p className={styles.browseCardTitle}>{it.title}</p>
                        <p className={styles.browseCardMeta}>{it.meta}</p>
                        {it.subMeta && (
                          <p className={styles.browseCardSubMeta}>{it.subMeta}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )
            ) : (
              <div className={styles.browseEmpty}>
                <p>Aucun résultat ne correspond à ta recherche.</p>
                {(q || selectedYear) && (
                  <button
                    type="button"
                    className={styles.browseEmptyReset}
                    onClick={() => { setQ(''); setSelectedYear(null); }}
                  >
                    Effacer les filtres
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   RECUEIL LAYOUT — vraie table des matières hymnaire
   Pensée pour scaler à 500+ entrées :
     1) Sélection (haut)  → cantiques qui ont une vidéo dispo
                             (proxy "les plus consultés" en attendant
                             les analytics).
     2) Toolbar tri       → Numéro (défaut) / Alphabétique.
     3) Jumper alpha      → A B C … Z cliquables (mode A→Z uniquement).
     4) Grille 2 colonnes → rows compactes sur 2 cols dès ≥ 768px,
                             1 col en dessous.
   ══════════════════════════════════════════════════════════ */

type RecueilSort = 'numero' | 'alpha';

function RecueilLayout({ items, onSelect }: {
  items: BrowseItem[];
  onSelect: (it: BrowseItem) => void;
}) {
  const [sort, setSort] = useState<RecueilSort>('numero');

  const featured = useMemo(
    () => items.filter((it) => it.thumb).slice(0, 6),
    [items],
  );

  const sorted = useMemo(() => {
    if (sort === 'alpha') {
      return [...items].sort((a, b) =>
        a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' }),
      );
    }
    return items; // déjà trié par numéro à l'amont
  }, [items, sort]);

  /* Mode alpha : groupes par première lettre. */
  const alphaGroups = useMemo(() => {
    if (sort !== 'alpha') return null;
    const map = new Map<string, BrowseItem[]>();
    sorted.forEach((it) => {
      const letter = (it.title.charAt(0) || '?').toUpperCase();
      if (!map.has(letter)) map.set(letter, []);
      map.get(letter)!.push(it);
    });
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b, 'fr'));
  }, [sorted, sort]);

  return (
    <div className={styles.recueilLayout}>
      {/* ── Sélection : cards horizontales (cantiques avec vidéo) ── */}
      {featured.length > 0 && (
        <section className={styles.recueilFeatured} aria-label="Cantiques avec vidéo">
          <h2 className={styles.recueilSectionLbl}>Avec vidéo disponible</h2>
          <div className={styles.recueilFeaturedGrid}>
            {featured.map((it) => (
              <button
                key={it.key}
                type="button"
                className={styles.recueilFeaturedCard}
                onClick={() => onSelect(it)}
              >
                <div className={styles.recueilFeaturedThumb}>
                  <img src={it.thumb!} alt="" loading="lazy" />
                  {it.numero && (
                    <span className={styles.recueilFeaturedNum}>
                      n° {String(it.numero).padStart(3, '0')}
                    </span>
                  )}
                </div>
                <p className={styles.recueilFeaturedTitle}>{it.title}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── Toolbar tri + jumper alpha ── */}
      <div className={styles.recueilToolbar}>
        <div className={styles.recueilSortGroup} role="group" aria-label="Trier le recueil">
          <span className={styles.recueilSortLbl}>Tri</span>
          <div className={styles.recueilSortBtns}>
            <button
              type="button"
              className={[
                styles.recueilSortBtn,
                sort === 'numero' ? styles.recueilSortBtnActive : '',
              ].join(' ')}
              onClick={() => setSort('numero')}
              aria-pressed={sort === 'numero'}
            >
              Numéro
            </button>
            <button
              type="button"
              className={[
                styles.recueilSortBtn,
                sort === 'alpha' ? styles.recueilSortBtnActive : '',
              ].join(' ')}
              onClick={() => setSort('alpha')}
              aria-pressed={sort === 'alpha'}
            >
              A → Z
            </button>
          </div>
        </div>

        {sort === 'alpha' && alphaGroups && alphaGroups.length > 0 && (
          <nav className={styles.recueilLetters} aria-label="Aller à une lettre">
            {alphaGroups.map(([letter]) => (
              <a
                key={letter}
                href={`#recueil-letter-${letter}`}
                className={styles.recueilLetter}
              >
                {letter}
              </a>
            ))}
          </nav>
        )}
      </div>

      {/* ── Liste principale ── */}
      {sort === 'numero' ? (
        <ol className={styles.recueilGrid} aria-label="Cantiques par numéro">
          {sorted.map((it) => (
            <RecueilRow key={it.key} item={it} onClick={() => onSelect(it)} />
          ))}
        </ol>
      ) : (
        <div className={styles.recueilAlphaGroups}>
          {alphaGroups!.map(([letter, group]) => (
            <section
              key={letter}
              id={`recueil-letter-${letter}`}
              className={styles.recueilAlphaSection}
            >
              <h3 className={styles.recueilAlphaHead}>{letter}</h3>
              <ol className={styles.recueilGrid}>
                {group.map((it) => (
                  <RecueilRow key={it.key} item={it} onClick={() => onSelect(it)} />
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function RecueilRow({ item, onClick }: { item: BrowseItem; onClick: () => void }) {
  return (
    <li>
      <button type="button" className={styles.recueilRow} onClick={onClick}>
        <span className={styles.recueilNum}>
          {item.numero ? String(item.numero).padStart(3, '0') : '—'}
        </span>
        <span className={styles.recueilBody}>
          <span className={styles.recueilTitle}>{item.title}</span>
          {item.subMeta && (
            <span className={styles.recueilSoliste}>{item.subMeta}</span>
          )}
        </span>
        {item.thumb && (
          <span
            className={styles.recueilVideoBadge}
            title="Vidéo disponible"
            aria-label="Vidéo disponible"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        )}
        <svg
          className={styles.recueilArrow}
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </li>
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

  const playerKey = `${session.id}-${currentStartSec ?? 'start'}`;

  /* Cantique référencé par l'entrée actuellement cliquée dans l'index :
     permet d'afficher ses paroles dans la zone blanche, sous la vidéo. */
  const highlightedCantique: Cantique | undefined = useMemo(() => {
    if (!highlightedCantiqueId) return undefined;
    return cantiques.find((c) => c.id === highlightedCantiqueId);
  }, [highlightedCantiqueId]);

  const jumpTo = (cantiqueId: string, startSec: number, endSec?: number) => {
    setCurrentStartSec(startSec);
    setCurrentEndSec(endSec);
    setHighlightedCantiqueId(cantiqueId);
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

        {/* ── Sidebar droite : INDEX + PAROLES empilés ─────────── */}
        <aside className={styles.sessionSidebar} aria-label="Cantiques de la session">

          {/* Bloc 1 : index des cantiques */}
          <div className={styles.indexBlock} aria-label="Cantiques de la session">
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
          </div>

          {/* Bloc 2 : paroles du cantique sélectionné, ou hint si aucun */}
          <div className={styles.lyricsBlock}>
            {highlightedCantique ? (
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
                <p>Cliquez un cantique dans la liste ci-dessus pour démarrer la vidéo au bon moment et afficher ses paroles ici.</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
