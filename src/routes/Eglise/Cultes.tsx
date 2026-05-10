import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { sermons } from '../../data/sermons';
import type { Sermon, TypeCulte } from '../../types';
import { youtubeEmbedUrl, youtubeThumbnail } from '../../utils/youtube';
import styles from './Cultes.module.css';

/* ============================================================
   CULTES — Bibliothèque + lecture INLINE · branche main (Glass)
   Itération P1a''' :
     - Sidebar tri-state : full | rail (icônes seulement)
     - Mode lecture IMMERSIF : hero + barre de recherche masqués,
       on revient via "Retour aux prédications" uniquement
     - Layout élargi (1640px max), capsules plus grandes
   ============================================================ */

/* ── Helpers données ─────────────────────────────────────── */

const TYPE_LABELS: Record<TypeCulte, string> = {
  'culte-dimanche':    'Culte dominical',
  'culte-mercredi':    'Culte du mercredi',
  'reunion-priere':    'Réunion de prière',
  'etude-doctrinale':  'Étude doctrinale',
  'convention':        'Convention',
  'evenement-special': 'Événement spécial',
  'bapteme':           'Baptême',
  'sainte-cene':       'Sainte Cène',
  'q-et-r':            'Questions & Réponses',
};

const TYPE_LIST: TypeCulte[] = [
  'culte-dimanche',
  'culte-mercredi',
  'convention',
  'evenement-special',
  'bapteme',
  'sainte-cene',
  'q-et-r',
  'reunion-priere',
];

interface MonthGroup {
  key: string;
  label: string;
  items: Sermon[];
}

function formatMonthLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const raw = d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function monthKey(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const wd = d.toLocaleDateString('fr-FR', { weekday: 'short' });
  const wdCap = wd.charAt(0).toUpperCase() + wd.slice(1).replace('.', '');
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${wdCap} ${dd}.${mm}`;
}

function groupByMonth(items: Sermon[]): MonthGroup[] {
  const map = new Map<string, MonthGroup>();
  for (const s of items) {
    const key = monthKey(s.date);
    if (!map.has(key)) {
      map.set(key, { key, label: formatMonthLabel(s.date), items: [] });
    }
    map.get(key)!.items.push(s);
  }
  return [...map.values()].sort((a, b) => b.key.localeCompare(a.key));
}

function countBy<K extends string>(items: Sermon[], pick: (s: Sermon) => K | undefined): Map<K, number> {
  const out = new Map<K, number>();
  for (const s of items) {
    const v = pick(s);
    if (v === undefined) continue;
    out.set(v, (out.get(v) ?? 0) + 1);
  }
  return out;
}

/* ── Icônes des sections de filtres pour le mode rail ────── */

interface IconProps { size?: number }

const IconCalendar = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconUser = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconTag = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const IconLayers = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const IconSort = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="21" y1="10" x2="3" y2="10" />
    <line x1="21" y1="6"  x2="3" y2="6" />
    <line x1="21" y1="14" x2="9" y2="14" />
    <line x1="21" y1="18" x2="13" y2="18" />
  </svg>
);

interface FilterSectionMeta {
  key: string;
  title: string;
  icon: React.ReactNode;
}

const FILTER_SECTIONS: FilterSectionMeta[] = [
  { key: 'annee',       title: 'Année',       icon: <IconCalendar /> },
  { key: 'predicateur', title: 'Prédicateur', icon: <IconUser /> },
  { key: 'type',        title: 'Type',        icon: <IconTag /> },
  { key: 'serie',       title: 'Série',       icon: <IconLayers /> },
  { key: 'tri',         title: 'Tri',         icon: <IconSort /> },
];

/* ══════════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
   ══════════════════════════════════════════════════════════ */

type SidebarMode = 'full' | 'rail';

export default function Cultes() {
  const { t } = useTranslation();

  const [query, setQuery] = useState('');
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>('full');
  const [activePlayer, setActivePlayer] = useState<Sermon | null>(null);
  const [suggestionsOpen, setSuggestionsOpen] = useState(true);

  const watchAnchorRef = useRef<HTMLDivElement>(null);

  const sortedSermons = useMemo(
    () => [...sermons].sort((a, b) => b.date.localeCompare(a.date)),
    [],
  );
  const groups = useMemo(() => groupByMonth(sortedSermons), [sortedSermons]);

  const yearsCount = useMemo(
    () => countBy(sortedSermons, (s) => s.date.slice(0, 4)),
    [sortedSermons],
  );
  const predicateursCount = useMemo(
    () => countBy(sortedSermons, (s) => s.predicateur),
    [sortedSermons],
  );
  const typesCount = useMemo(
    () => countBy(sortedSermons, (s) => s.typeCulte),
    [sortedSermons],
  );
  const seriesCount = useMemo(
    () => countBy(sortedSermons, (s) => s.serie),
    [sortedSermons],
  );

  const years = useMemo(
    () => [...yearsCount.keys()].sort((a, b) => b.localeCompare(a)),
    [yearsCount],
  );
  const predicateurs = useMemo(
    () => [...predicateursCount.keys()].sort(),
    [predicateursCount],
  );
  const series = useMemo(
    () => [...seriesCount.keys()].sort(),
    [seriesCount],
  );

  const relatedSermons = useMemo(() => {
    if (!activePlayer) return [];
    return sortedSermons.filter((s) => s.id !== activePlayer.id);
  }, [activePlayer, sortedSermons]);

  const openPlayer = useCallback((sermon: Sermon) => {
    setActivePlayer(sermon);
    setSuggestionsOpen(true);
  }, []);
  const closePlayer = useCallback(() => {
    setActivePlayer(null);
    /* On revient en haut quand on quitte le mode lecture. */
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /* Scroll vers la zone watch quand on entre en mode lecture, ou
     quand on change de vidéo. Pas trop bas pour laisser voir le
     player sans être recouvert par la subnav. */
  useEffect(() => {
    if (!activePlayer) return;
    const id = window.setTimeout(() => {
      watchAnchorRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 60);
    return () => window.clearTimeout(id);
  }, [activePlayer]);

  /* Escape ferme la lecture. */
  useEffect(() => {
    if (!activePlayer) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePlayer();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [activePlayer, closePlayer]);

  /* Indicateur scroll : disparait au premier scroll utilisateur. */
  const [hasScrolled, setHasScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 80) {
        setHasScrolled(true);
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Au clic sur une icône en mode rail, on bascule en full. */
  const onRailIconClick = useCallback(() => {
    setSidebarMode('full');
  }, []);

  const isWatching = activePlayer !== null;
  const sidebarIsRail = sidebarMode === 'rail';

  const pageClass = [
    styles.page,
    isWatching ? styles.pageWatching : '',
  ].filter(Boolean).join(' ');

  const boardClass = [
    styles.board,
    sidebarIsRail ? styles.boardSidebarRail : '',
    isWatching ? styles.boardWatching : '',
    isWatching && !suggestionsOpen ? styles.boardWatchingFull : '',
  ].filter(Boolean).join(' ');

  return (
    <main id="main-content" className={pageClass}>

      {/* ══════════════════════════════════════════════════════════
          HERO + BARRE DE RECHERCHE — masqués en mode lecture
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.hero} aria-label={t('eglise.cultes.eyebrow')}>
        <div className={styles.heroInner}>
          <div className={styles.heroEyebrow}>{t('eglise.cultes.eyebrow')}</div>
          <h1 className={styles.heroTitle}>
            {t('eglise.cultes.titreLine1')}<br />
            <em>{t('eglise.cultes.titreLine2')}</em>
          </h1>
          <div className={styles.heroRef}>{t('eglise.cultes.ref')}</div>
          <p className={styles.heroLede}>{t('eglise.cultes.lede')}</p>
          <blockquote className={styles.heroBran}>
            {t('eglise.cultes.branText')}
            <cite className={styles.heroBranCite}>{t('eglise.cultes.branCite')}</cite>
          </blockquote>
        </div>

        <button
          type="button"
          className={[
            styles.scrollHint,
            hasScrolled ? styles.scrollHintHidden : '',
          ].join(' ')}
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight * 0.85,
              behavior: 'smooth',
            });
          }}
          aria-label="Découvrir les prédications"
        >
          <span className={styles.scrollHintLabel}>Découvrir la bibliothèque</span>
          <span className={styles.scrollHintArrow} aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </button>
      </section>

      <section className={styles.searchBand} aria-label="Rechercher dans la bibliothèque">
        <div className={styles.searchBandInner}>
          <p className={styles.searchCount}>
            {sortedSermons.length} prédications · depuis {sortedSermons[sortedSermons.length - 1]?.date.slice(0, 4) ?? '2021'}
          </p>
          <div className={styles.searchBar} role="search">
            <span className={styles.searchIcon} aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.5" y2="16.5" />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Rechercher un titre, prédicateur, verset…"
              aria-label="Rechercher une prédication"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                type="button"
                className={styles.searchClear}
                onClick={() => setQuery('')}
                aria-label="Effacer la recherche"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          BOARD
          ══════════════════════════════════════════════════════════ */}
      <section className={boardClass}>

        <div ref={watchAnchorRef} className={styles.boardAnchor} aria-hidden="true" />

        {/* ── Sidebar (full ou rail) ────────────────────────────── */}
        <aside
          className={[styles.sidebar, sidebarIsRail ? styles.sidebarRail : ''].join(' ')}
          aria-label="Filtres"
        >
          <div className={styles.sidebarInner}>

            {/* Bouton retour : visible uniquement en mode lecture */}
            {isWatching && !sidebarIsRail && (
              <button
                type="button"
                className={styles.sidebarBack}
                onClick={closePlayer}
                aria-label="Revenir à la liste des prédications"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Retour aux prédications</span>
              </button>
            )}

            {isWatching && sidebarIsRail && (
              <button
                type="button"
                className={styles.sidebarBackRail}
                onClick={closePlayer}
                aria-label="Revenir à la liste des prédications"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
            )}

            <div className={styles.sidebarHead}>
              {!sidebarIsRail && <span className={styles.sidebarLbl}>Filtres</span>}
              <button
                type="button"
                className={styles.sidebarToggle}
                onClick={() => setSidebarMode((m) => (m === 'full' ? 'rail' : 'full'))}
                aria-label={sidebarIsRail ? 'Déplier les filtres' : 'Réduire les filtres'}
              >
                {sidebarIsRail ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="13 17 18 12 13 7" />
                    <polyline points="6 17 11 12 6 7" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="11 17 6 12 11 7" />
                    <polyline points="18 17 13 12 18 7" />
                  </svg>
                )}
              </button>
            </div>

            {sidebarIsRail ? (
              /* Rail : icônes verticales, clic → repasse en full */
              <div className={styles.sidebarRailIcons}>
                {FILTER_SECTIONS.map((section) => (
                  <button
                    key={section.key}
                    type="button"
                    className={styles.railIcon}
                    onClick={onRailIconClick}
                    aria-label={section.title}
                    title={section.title}
                  >
                    {section.icon}
                  </button>
                ))}
              </div>
            ) : (
              <>
                <div className={styles.sidebarScroll}>
                  <FilterGroup title="Année" icon={<IconCalendar />}>
                    {years.map((yr) => (
                      <FilterRow key={yr} label={yr} count={yearsCount.get(yr) ?? 0} />
                    ))}
                  </FilterGroup>

                  <FilterGroup title="Prédicateur" icon={<IconUser />}>
                    {predicateurs.map((p) => (
                      <FilterRow key={p} label={p} count={predicateursCount.get(p) ?? 0} />
                    ))}
                  </FilterGroup>

                  <FilterGroup title="Type" icon={<IconTag />}>
                    {TYPE_LIST.filter((tp) => typesCount.has(tp)).map((tp) => (
                      <FilterRow
                        key={tp}
                        label={TYPE_LABELS[tp]}
                        count={typesCount.get(tp) ?? 0}
                      />
                    ))}
                  </FilterGroup>

                  <FilterGroup title="Série" icon={<IconLayers />}>
                    {series.map((s) => (
                      <FilterRow key={s} label={s} count={seriesCount.get(s) ?? 0} />
                    ))}
                  </FilterGroup>

                  <FilterGroup title="Tri" icon={<IconSort />}>
                    <FilterRow label="Plus récent au plus ancien" count={null} checked />
                    <FilterRow label="Plus ancien au plus récent" count={null} />
                  </FilterGroup>
                </div>

                <div className={styles.sidebarFoot}>
                  <button type="button" className={styles.sidebarReset} disabled>
                    Réinitialiser
                  </button>
                  <p className={styles.sidebarHint}>
                    Filtres actifs dans la prochaine itération.
                  </p>
                </div>
              </>
            )}
          </div>
        </aside>

        {/* ── Zone centrale ─────────────────────────────────────── */}
        <div className={styles.center}>
          {isWatching && activePlayer ? (
            <WatchInline
              sermon={activePlayer}
              moreVideos={relatedSermons.slice(0, 9)}
              onSwitchSermon={openPlayer}
              onClose={closePlayer}
            />
          ) : (
            <div className={styles.content}>
              {groups.map((group) => (
                <section key={group.key} className={styles.monthBlock} aria-label={group.label}>
                  <header className={styles.monthHeader}>
                    <h2 className={styles.monthTitle}>{group.label}</h2>
                    <span className={styles.monthCount}>
                      {group.items.length} prédication{group.items.length > 1 ? 's' : ''}
                    </span>
                    <span className={styles.monthRule} aria-hidden="true" />
                  </header>
                  <div className={styles.grid}>
                    {group.items.map((s) => (
                      <Capsule key={s.id} sermon={s} onOpen={openPlayer} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        {/* ── Suggestions ───────────────────────────────────────── */}
        {isWatching && suggestionsOpen && (
          <aside className={styles.suggestions} aria-label="À regarder ensuite">
            <div className={styles.suggestionsInner}>
              <div className={styles.suggestionsHead}>
                <span className={styles.suggestionsLbl}>À regarder ensuite</span>
                <button
                  type="button"
                  className={styles.suggestionsToggle}
                  onClick={() => setSuggestionsOpen(false)}
                  aria-label="Ranger les suggestions"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="13 17 18 12 13 7" />
                    <polyline points="6 17 11 12 6 7" />
                  </svg>
                </button>
              </div>
              <div className={styles.suggestionsList}>
                {relatedSermons.slice(0, 8).map((s) => (
                  <SuggestionRow key={s.id} sermon={s} onClick={openPlayer} />
                ))}
              </div>
            </div>
          </aside>
        )}

        {isWatching && !suggestionsOpen && (
          <button
            type="button"
            className={styles.suggestionsReopen}
            onClick={() => setSuggestionsOpen(true)}
            aria-label="Afficher les suggestions"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="11 17 6 12 11 7" />
              <polyline points="18 17 13 12 18 7" />
            </svg>
            <span>Suggestions</span>
          </button>
        )}
      </section>
    </main>
  );
}

/* ══════════════════════════════════════════════════════════
   CAPSULE VIDÉO
   ══════════════════════════════════════════════════════════ */

interface CapsuleProps {
  sermon: Sermon;
  onOpen: (s: Sermon) => void;
}

function Capsule({ sermon, onOpen }: CapsuleProps) {
  const thumb = sermon.thumbnail ?? youtubeThumbnail(sermon.videoUrl);
  const typeLabel = sermon.typeCulte ? TYPE_LABELS[sermon.typeCulte] : null;
  const titleClean = sermon.titre.replace(/\.$/, '');

  const onActivate = () => onOpen(sermon);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onActivate();
    }
  };

  return (
    <article
      className={styles.capsule}
      role="button"
      tabIndex={0}
      onClick={onActivate}
      onKeyDown={onKey}
      aria-label={`Lire la prédication : ${sermon.titre}`}
    >
      <div className={styles.thumb}>
        {thumb && <img src={thumb} alt="" className={styles.thumbImg} loading="lazy" />}
        <div className={styles.thumbOverlay} aria-hidden="true" />
        {sermon.duree && (
          <span className={styles.duration} aria-hidden="true">{sermon.duree}</span>
        )}
        <button
          type="button"
          className={styles.playBtn}
          tabIndex={-1}
          aria-hidden="true"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
        {typeLabel && (
          <span className={styles.typeBadge}>{typeLabel}</span>
        )}
      </div>

      <div className={styles.capsuleBody}>
        <h3 className={styles.capsuleTitle}>{titleClean}</h3>
        <p className={styles.capsuleMeta}>
          <span className={styles.capsulePredicateur}>{sermon.predicateur}</span>
          <span className={styles.capsuleDot} aria-hidden="true">·</span>
          <span className={styles.capsuleDate}>{formatShortDate(sermon.date)}</span>
        </p>
        {sermon.serie && (
          <p className={styles.capsuleSerie}>
            {sermon.serie}
            {sermon.numeroSerie ? ` · n°${String(sermon.numeroSerie).padStart(2, '0')}` : ''}
          </p>
        )}
      </div>
    </article>
  );
}

/* ══════════════════════════════════════════════════════════
   FILTRE — composants sidebar
   ══════════════════════════════════════════════════════════ */

interface FilterGroupProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

function FilterGroup({ title, icon, children }: FilterGroupProps) {
  return (
    <details className={styles.filterGroup}>
      <summary className={styles.filterGroupTitle}>
        <span className={styles.filterGroupTitleLeft}>
          {icon && <span className={styles.filterGroupIcon}>{icon}</span>}
          <span>{title}</span>
        </span>
        <span className={styles.filterChevron} aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </summary>
      <div className={styles.filterRows}>{children}</div>
    </details>
  );
}

interface FilterRowProps {
  label: string;
  count: number | null;
  checked?: boolean;
}

function FilterRow({ label, count, checked = false }: FilterRowProps) {
  return (
    <label className={styles.filterRow}>
      <input
        type="checkbox"
        className={styles.filterCheckbox}
        defaultChecked={checked}
        disabled
      />
      <span className={styles.filterRowLabel}>{label}</span>
      {count !== null && <span className={styles.filterRowCount}>{count}</span>}
    </label>
  );
}

/* ══════════════════════════════════════════════════════════
   WATCH INLINE
   ══════════════════════════════════════════════════════════ */

interface WatchInlineProps {
  sermon: Sermon;
  moreVideos: Sermon[];
  onSwitchSermon: (s: Sermon) => void;
  onClose: () => void;
}

function WatchInline({ sermon, moreVideos, onSwitchSermon, onClose }: WatchInlineProps) {
  const embed = youtubeEmbedUrl(sermon.videoUrl, { autoplay: true });
  const titleClean = sermon.titre.replace(/\.$/, '');

  /* Picture-in-Picture : quand le slot du player sort du viewport (scroll
     vers le bas pour explorer infos / passages / autres vidéos), l'iframe
     passe en position:fixed dans le coin. L'iframe N'est PAS démontée :
     même instance dans le DOM → la vidéo continue de jouer sans interruption.
     Le slot reste dans le flow et garde l'espace ; un placeholder informe. */
  const slotRef = useRef<HTMLDivElement>(null);
  const [isPip, setIsPip] = useState(false);

  useEffect(() => {
    if (!slotRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        /* On déclenche le PiP dès que moins de 30 % du slot est visible. */
        setIsPip(!entry.isIntersecting || entry.intersectionRatio < 0.3);
      },
      {
        threshold: [0, 0.3, 1],
        /* Marge du haut négative pour tenir compte du header sticky : on
           considère le slot "sorti" un peu avant qu'il soit recouvert. */
        rootMargin: '-120px 0px 0px 0px',
      },
    );
    observer.observe(slotRef.current);
    return () => observer.disconnect();
  }, [sermon.id]);

  /* Si on change de sermon pendant qu'on est en PiP, on revient en haut
     pour que le user voie le nouveau titre/infos. */
  useEffect(() => {
    if (isPip) return;
  }, [isPip]);

  const expandFromPip = () => {
    slotRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={styles.watchInline}>
      <div ref={slotRef} className={styles.watchPlayerSlot}>
        <div className={[
          styles.watchPlayerWrap,
          isPip ? styles.watchPlayerWrapMini : '',
        ].join(' ')}>
          {embed ? (
            <iframe
              key={sermon.id}
              className={styles.watchIframe}
              src={embed}
              title={`Replay — ${sermon.titre}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className={styles.watchEmpty}>Vidéo indisponible.</div>
          )}

          {/* Barre du mini-player : titre + agrandir + fermer */}
          {isPip && (
            <div className={styles.miniBar}>
              <span className={styles.miniTitle}>{titleClean}</span>
              <button
                type="button"
                className={styles.miniBtn}
                onClick={expandFromPip}
                aria-label="Agrandir le lecteur"
                title="Agrandir"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              </button>
              <button
                type="button"
                className={styles.miniBtn}
                onClick={onClose}
                aria-label="Fermer le lecteur"
                title="Fermer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Placeholder discret quand le player est passé en PiP : occupe
            l'espace du slot et invite à réafficher. */}
        {isPip && (
          <button
            type="button"
            className={styles.watchPlaceholder}
            onClick={expandFromPip}
            aria-label="Réafficher le lecteur ici"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>Lecture en mini-fenêtre · cliquez pour réafficher</span>
          </button>
        )}
      </div>

      <div className={styles.watchInfo}>
        <p className={styles.watchSerie}>
          {sermon.serie}
          {sermon.numeroSerie ? ` · n°${String(sermon.numeroSerie).padStart(2, '0')}` : ''}
        </p>
        <h2 className={styles.watchTitle}>{titleClean}</h2>
        <p className={styles.watchPredicateur}>
          {sermon.predicateur} · {formatShortDate(sermon.date)}
          {sermon.duree ? ` · ${sermon.duree}` : ''}
        </p>
        {sermon.description && (
          <p className={styles.watchDesc}>{sermon.description}</p>
        )}
      </div>

      {sermon.passages.length > 0 && (
        <section className={styles.watchPassages} aria-label="Passages bibliques">
          <h3 className={styles.watchSectionTitle}>Passages bibliques</h3>
          {sermon.passages.map((p, i) => (
            <div key={i} className={styles.watchPassage}>
              <div className={styles.watchPassageRef}>{p.reference}</div>
              <blockquote className={styles.watchPassageText}>{p.texte}</blockquote>
            </div>
          ))}
        </section>
      )}

      {sermon.citationsBranham.length > 0 && (
        <section className={styles.watchCitations} aria-label="Citations Branham">
          <h3 className={styles.watchSectionTitle}>Citations Branham</h3>
          {sermon.citationsBranham.map((c, i) => (
            <div key={i} className={styles.watchCitation}>
              <div className={styles.watchCitationSource}>{c.source}</div>
              <blockquote className={styles.watchCitationText}>{c.texte}</blockquote>
            </div>
          ))}
        </section>
      )}

      {moreVideos.length > 0 && (
        <section className={styles.watchMore} aria-label="Plus de prédications">
          <h3 className={styles.watchSectionTitle}>Plus de prédications</h3>
          <div className={styles.watchMoreGrid}>
            {moreVideos.map((s) => (
              <Capsule key={s.id} sermon={s} onOpen={onSwitchSermon} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SUGGESTION ROW
   ══════════════════════════════════════════════════════════ */

interface SuggestionRowProps {
  sermon: Sermon;
  onClick: (s: Sermon) => void;
}

function SuggestionRow({ sermon, onClick }: SuggestionRowProps) {
  const thumb = sermon.thumbnail ?? youtubeThumbnail(sermon.videoUrl);
  const titleClean = sermon.titre.replace(/\.$/, '');
  return (
    <button
      type="button"
      className={styles.suggRow}
      onClick={() => onClick(sermon)}
      aria-label={`Regarder : ${sermon.titre}`}
    >
      <div className={styles.suggThumb}>
        {thumb && <img src={thumb} alt="" loading="lazy" />}
        {sermon.duree && (
          <span className={styles.suggDuration}>{sermon.duree}</span>
        )}
      </div>
      <div className={styles.suggBody}>
        <h4 className={styles.suggTitle}>{titleClean}</h4>
        <p className={styles.suggMeta}>
          {sermon.predicateur} · {formatShortDate(sermon.date)}
        </p>
      </div>
    </button>
  );
}
