import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { sermons } from '../../data/sermons';
import type { Sermon, TypeCulte } from '../../types';
import { youtubeThumbnail } from '../../utils/youtube';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import YouTubePlayer, {
  type YouTubePlayerHandle,
} from '../../components/ui/YouTubePlayer/YouTubePlayer';
import styles from './Cultes.module.css';

/* ============================================================
   CULTES — Bibliothèque + lecture INLINE · branche main (Glass)
   Itération P1b :
     - Custom YouTubePlayer (IFrame API + overlay controls)
     - Filtres actifs : Année, Prédicateur, Type, Série, Tri
     - Recherche full-text (titre + prédicateur + série + desc + passages)
     - Bouton Réinitialiser actif quand au moins un filtre est posé
     - Mini-player PiP (depuis P1a''') : conserve la lecture, l'iframe
       n'est jamais démontée car YT.Player vit dans le même DOM node
   ============================================================ */

/* ── Constantes ──────────────────────────────────────────── */

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

type SortOrder = 'desc' | 'asc';

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

function groupByMonth(items: Sermon[], order: SortOrder): MonthGroup[] {
  const map = new Map<string, MonthGroup>();
  for (const s of items) {
    const key = monthKey(s.date);
    if (!map.has(key)) {
      map.set(key, { key, label: formatMonthLabel(s.date), items: [] });
    }
    map.get(key)!.items.push(s);
  }
  const groups = [...map.values()].sort((a, b) =>
    order === 'desc' ? b.key.localeCompare(a.key) : a.key.localeCompare(b.key),
  );
  // Trie aussi à l'intérieur de chaque groupe.
  for (const g of groups) {
    g.items.sort((a, b) =>
      order === 'desc' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date),
    );
  }
  return groups;
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

function toggleInSet<T>(set: Set<T>, item: T): Set<T> {
  const next = new Set(set);
  if (next.has(item)) next.delete(item); else next.add(item);
  return next;
}

/* ── Icônes ──────────────────────────────────────────────── */

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

  /* ── État UI ────────────────────────────────────────────── */
  const [query, setQuery] = useState('');
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>('full');
  const [activePlayer, setActivePlayer] = useState<Sermon | null>(null);
  const [suggestionsOpen, setSuggestionsOpen] = useState(true);

  /* ── État filtres ───────────────────────────────────────── */
  const [selectedYears, setSelectedYears] = useState<Set<string>>(new Set());
  const [selectedPredicateurs, setSelectedPredicateurs] = useState<Set<string>>(new Set());
  const [selectedTypes, setSelectedTypes] = useState<Set<TypeCulte>>(new Set());
  const [selectedSeries, setSelectedSeries] = useState<Set<string>>(new Set());
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const watchAnchorRef = useRef<HTMLDivElement>(null);

  /* ── Indices comptés sur le dataset complet ─────────────── */
  const yearsCount = useMemo(
    () => countBy(sermons, (s) => s.date.slice(0, 4)),
    [],
  );
  const predicateursCount = useMemo(
    () => countBy(sermons, (s) => s.predicateur),
    [],
  );
  const typesCount = useMemo(
    () => countBy(sermons, (s) => s.typeCulte),
    [],
  );
  const seriesCount = useMemo(
    () => countBy(sermons, (s) => s.serie),
    [],
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

  /* ── Pipeline filtres + recherche + tri ─────────────────── */
  const filteredSermons = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sermons.filter((s) => {
      if (selectedYears.size > 0 && !selectedYears.has(s.date.slice(0, 4))) return false;
      if (selectedPredicateurs.size > 0 && !selectedPredicateurs.has(s.predicateur)) return false;
      if (selectedTypes.size > 0 && (!s.typeCulte || !selectedTypes.has(s.typeCulte))) return false;
      if (selectedSeries.size > 0 && !selectedSeries.has(s.serie)) return false;
      if (q.length > 0) {
        const haystack = [
          s.titre,
          s.serie,
          s.predicateur,
          s.description ?? '',
          ...s.passages.map((p) => `${p.reference} ${p.texte}`),
          ...s.citationsBranham.map((c) => `${c.source} ${c.texte}`),
        ].join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [query, selectedYears, selectedPredicateurs, selectedTypes, selectedSeries]);

  const groups = useMemo(
    () => groupByMonth(filteredSermons, sortOrder),
    [filteredSermons, sortOrder],
  );

  const hasActiveFilters =
    query.length > 0 ||
    selectedYears.size > 0 ||
    selectedPredicateurs.size > 0 ||
    selectedTypes.size > 0 ||
    selectedSeries.size > 0 ||
    sortOrder !== 'desc';

  const resetAll = useCallback(() => {
    setQuery('');
    setSelectedYears(new Set());
    setSelectedPredicateurs(new Set());
    setSelectedTypes(new Set());
    setSelectedSeries(new Set());
    setSortOrder('desc');
  }, []);

  /* ── Suggestions du lecteur ─────────────────────────────── */
  const relatedSermons = useMemo(() => {
    if (!activePlayer) return [];
    return [...sermons]
      .sort((a, b) => b.date.localeCompare(a.date))
      .filter((s) => s.id !== activePlayer.id);
  }, [activePlayer]);

  const openPlayer = useCallback((sermon: Sermon) => {
    setActivePlayer(sermon);
    setSuggestionsOpen(true);
  }, []);
  const closePlayer = useCallback(() => {
    setActivePlayer(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /* Au lancement d'une vidéo (ou changement), on remonte tout en haut
     pour mettre la vidéo en focus immédiatement. Comme le hero et la
     barre de recherche sont masqués en .pageWatching, le board commence
     juste sous la subnav et la vidéo est plein cadre. */
  useEffect(() => {
    if (!activePlayer) return;
    const id = window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 60);
    return () => window.clearTimeout(id);
  }, [activePlayer]);

  useEffect(() => {
    if (!activePlayer) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePlayer();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [activePlayer, closePlayer]);

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

  /* Détection des topbars (header + subnav) pour adapter la hauteur
     des sidebars : quand on scrolle vers le bas et qu'ils se masquent,
     les sidebars s'étendent vers le haut pour récupérer l'espace.
     Quand on remonte et qu'ils réapparaissent, les sidebars se
     poussent doucement vers le bas — effet « courant ».
     On s'aligne sur la même logique que Header/EgliseLayout pour
     éviter tout désalignement visuel. */
  const { direction, scrollY } = useScrollDirection(80);
  const topbarsHidden = direction === 'down' && scrollY > 80;
  const topbarOffset = topbarsHidden ? '0px' : '120px';

  /* Autoplay « À regarder ensuite » : quand la vidéo finit, on passe
     automatiquement au premier sermon des suggestions. */
  const onVideoEnded = useCallback(() => {
    if (relatedSermons.length > 0) {
      setActivePlayer(relatedSermons[0]);
      setSuggestionsOpen(true);
    }
  }, [relatedSermons]);

  const onRailIconClick = useCallback(() => setSidebarMode('full'), []);

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
    <main
      id="main-content"
      className={pageClass}
      style={{ ['--rst-topbar-offset' as never]: topbarOffset }}
    >

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
            {filteredSermons.length === sermons.length
              ? `${sermons.length} prédications · depuis ${
                  [...sermons].sort((a, b) => a.date.localeCompare(b.date))[0]?.date.slice(0, 4) ?? '2021'
                }`
              : `${filteredSermons.length} sur ${sermons.length} prédications`}
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
                  <FilterGroup title="Année" icon={<IconCalendar />} defaultOpen>
                    {years.map((yr) => (
                      <FilterRow
                        key={yr}
                        label={yr}
                        count={yearsCount.get(yr) ?? 0}
                        checked={selectedYears.has(yr)}
                        onToggle={() => setSelectedYears((prev) => toggleInSet(prev, yr))}
                      />
                    ))}
                  </FilterGroup>

                  <FilterGroup title="Prédicateur" icon={<IconUser />}>
                    {predicateurs.map((p) => (
                      <FilterRow
                        key={p}
                        label={p}
                        count={predicateursCount.get(p) ?? 0}
                        checked={selectedPredicateurs.has(p)}
                        onToggle={() => setSelectedPredicateurs((prev) => toggleInSet(prev, p))}
                      />
                    ))}
                  </FilterGroup>

                  <FilterGroup title="Type" icon={<IconTag />}>
                    {TYPE_LIST.filter((tp) => typesCount.has(tp)).map((tp) => (
                      <FilterRow
                        key={tp}
                        label={TYPE_LABELS[tp]}
                        count={typesCount.get(tp) ?? 0}
                        checked={selectedTypes.has(tp)}
                        onToggle={() => setSelectedTypes((prev) => toggleInSet(prev, tp))}
                      />
                    ))}
                  </FilterGroup>

                  <FilterGroup title="Série" icon={<IconLayers />}>
                    {series.map((s) => (
                      <FilterRow
                        key={s}
                        label={s}
                        count={seriesCount.get(s) ?? 0}
                        checked={selectedSeries.has(s)}
                        onToggle={() => setSelectedSeries((prev) => toggleInSet(prev, s))}
                      />
                    ))}
                  </FilterGroup>

                  <FilterGroup title="Tri" icon={<IconSort />} defaultOpen>
                    <FilterRow
                      label="Plus récent au plus ancien"
                      count={null}
                      checked={sortOrder === 'desc'}
                      onToggle={() => setSortOrder('desc')}
                      radio
                    />
                    <FilterRow
                      label="Plus ancien au plus récent"
                      count={null}
                      checked={sortOrder === 'asc'}
                      onToggle={() => setSortOrder('asc')}
                      radio
                    />
                  </FilterGroup>
                </div>

                <div className={styles.sidebarFoot}>
                  <button
                    type="button"
                    className={styles.sidebarReset}
                    disabled={!hasActiveFilters}
                    onClick={resetAll}
                  >
                    Réinitialiser les filtres
                  </button>
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
              onEnded={onVideoEnded}
            />
          ) : (
            <div className={styles.content}>
              {groups.length === 0 ? (
                <EmptyResults onReset={resetAll} active={hasActiveFilters} />
              ) : (
                groups.map((group) => (
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
                ))
              )}
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
  defaultOpen?: boolean;
}

function FilterGroup({ title, icon, children, defaultOpen = false }: FilterGroupProps) {
  return (
    <details className={styles.filterGroup} open={defaultOpen}>
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
  checked: boolean;
  onToggle: () => void;
  radio?: boolean;
}

function FilterRow({ label, count, checked, onToggle, radio = false }: FilterRowProps) {
  return (
    <label className={styles.filterRow}>
      <input
        type={radio ? 'radio' : 'checkbox'}
        className={styles.filterCheckbox}
        checked={checked}
        onChange={onToggle}
        name={radio ? 'sort-order' : undefined}
      />
      <span className={styles.filterRowLabel}>{label}</span>
      {count !== null && <span className={styles.filterRowCount}>{count}</span>}
    </label>
  );
}

/* ══════════════════════════════════════════════════════════
   EMPTY STATE — quand les filtres ne renvoient rien
   ══════════════════════════════════════════════════════════ */

function EmptyResults({ active, onReset }: { active: boolean; onReset: () => void }) {
  return (
    <div className={styles.emptyResults}>
      <div className={styles.emptyResultsIcon} aria-hidden="true">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.5" y2="16.5" />
        </svg>
      </div>
      <h3 className={styles.emptyResultsTitle}>Aucune prédication ne correspond.</h3>
      <p className={styles.emptyResultsDesc}>
        Ajustez vos filtres ou la recherche pour élargir les résultats.
      </p>
      {active && (
        <button type="button" className={styles.emptyResultsBtn} onClick={onReset}>
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   WATCH INLINE — slot + wrap PiP + custom YouTubePlayer
   ══════════════════════════════════════════════════════════ */

interface WatchInlineProps {
  sermon: Sermon;
  moreVideos: Sermon[];
  onSwitchSermon: (s: Sermon) => void;
  onClose: () => void;
  onEnded?: () => void;
}

function WatchInline({ sermon, moreVideos, onSwitchSermon, onClose, onEnded }: WatchInlineProps) {
  const titleClean = sermon.titre.replace(/\.$/, '');

  /* PiP : IntersectionObserver sur le slot, l'iframe (créée par YT.Player
     dans iframeHost) reste dans le même DOM node → lecture ininterrompue. */
  const slotRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayerHandle>(null);
  const [isPip, setIsPip] = useState(false);
  const [pipPlaying, setPipPlaying] = useState(false);

  useEffect(() => {
    if (!slotRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPip(!entry.isIntersecting || entry.intersectionRatio < 0.3);
      },
      {
        threshold: [0, 0.3, 1],
        rootMargin: '-120px 0px 0px 0px',
      },
    );
    observer.observe(slotRef.current);
    return () => observer.disconnect();
  }, [sermon.id]);

  const expandFromPip = () => {
    slotRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const togglePipPlay = () => {
    playerRef.current?.toggle();
  };

  return (
    <div className={styles.watchInline}>
      <div ref={slotRef} className={styles.watchPlayerSlot}>
        <div className={[
          styles.watchPlayerWrap,
          isPip ? styles.watchPlayerWrapMini : '',
        ].join(' ')}>
          <YouTubePlayer
            ref={playerRef}
            videoUrl={sermon.videoUrl}
            videoKey={sermon.id}
            autoplay
            onPlayingChange={setPipPlaying}
            onEnded={onEnded}
          />

          {isPip && (
            <div className={styles.miniBar}>
              <span className={styles.miniTitle}>{titleClean}</span>
              <button
                type="button"
                className={styles.miniBtn}
                onClick={togglePipPlay}
                aria-label={pipPlaying ? 'Pause' : 'Lire'}
                title={pipPlaying ? 'Pause' : 'Lire'}
              >
                {pipPlaying ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="5" width="4" height="14" rx="1" />
                    <rect x="14" y="5" width="4" height="14" rx="1" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
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
