import { useMemo, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { cantiques, cantiqueCounts } from '../../data/cantiques';
import { sessionsAdoration } from '../../data/sessions-adoration';
import type { Cantique } from '../../types';
import { youtubeThumbnail } from '../../utils/youtube';
import styles from './Cantiques.module.css';

/* ============================================================
   CANTIQUES — Bibliothèque (3 vues distinctes)
   ------------------------------------------------------------
   - Recueil   : grille éditoriale Cormorant, dense, par numéro
   - Spéciaux  : grille YouTube-like avec capsules vidéo
   - Adoration : sessions chronologiques avec liste cantiques
   Au clic d'un item : navigate vers /eglise/cantiques/watch/:slug
   (route à créer en Phase 3).
   ============================================================ */

type FamilyTab = 'recueil' | 'special' | 'adoration';

interface TabMeta {
  id: FamilyTab;
  label: string;
  count: number;
  description: string;
}

/* ── Helpers ────────────────────────────────────────────── */

function formatMinutes(minutes?: number): string {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${String(m).padStart(2, '0')}`;
}

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

function formatShortDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  const raw = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  return raw;
}

/* Liste à plat des interprètes uniques (pour le filtre). */
function listInterpretes(): string[] {
  const set = new Set<string>();
  for (const c of cantiques) {
    if (c.solisteOuChoeur) set.add(c.solisteOuChoeur.split('·')[0].trim());
    for (const occ of c.occurrences ?? []) {
      for (const i of occ.interpretes) set.add(i);
    }
  }
  for (const s of sessionsAdoration) {
    for (const i of s.interpretes) set.add(i);
  }
  return [...set].sort();
}

function cantiqueMatchesQuery(c: Cantique, q: string): boolean {
  if (!q) return true;
  const haystack = [
    c.titre,
    c.numero,
    c.solisteOuChoeur,
    c.detailBy ?? '',
    ...(c.occurrences ?? []).flatMap((o) => [...o.interpretes, o.contexte ?? '']),
  ].join(' ').toLowerCase();
  return haystack.includes(q);
}

function cantiqueMatchesInterprete(c: Cantique, interpretes: Set<string>): boolean {
  if (interpretes.size === 0) return true;
  const ints = new Set<string>([
    c.solisteOuChoeur?.split('·')[0].trim() ?? '',
    ...(c.occurrences ?? []).flatMap((o) => o.interpretes),
  ]);
  for (const i of interpretes) {
    if (ints.has(i)) return true;
  }
  return false;
}

/* ══════════════════════════════════════════════════════════
   COMPOSANT
   ══════════════════════════════════════════════════════════ */

export default function Cantiques() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<FamilyTab>('recueil');
  const [query, setQuery] = useState('');
  const [selectedInterpretes, setSelectedInterpretes] = useState<Set<string>>(new Set());
  const [recueilSort, setRecueilSort] = useState<'numero' | 'titre'>('numero');
  const [adorationSort, setAdorationSort] = useState<'recent' | 'ancien'>('recent');

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

  const tabs: TabMeta[] = useMemo(() => [
    {
      id: 'recueil',
      label: 'Du recueil',
      count: cantiqueCounts.recueil,
      description: 'Le livre traditionnel de l\'assemblée — recherche par numéro ou par nom.',
    },
    {
      id: 'special',
      label: 'Cantiques spéciaux',
      count: cantiqueCounts.special,
      description: 'Compositions, solos et chants particuliers enregistrés en studio ou au culte.',
    },
    {
      id: 'adoration',
      label: 'Adoration & Louange',
      count: sessionsAdoration.length,
      description: 'Sessions complètes de louange — plusieurs cantiques en une vidéo, navigables au timestamp.',
    },
  ], []);

  const interpretes = useMemo(() => listInterpretes(), []);

  /* Filtres communs */
  const q = query.trim().toLowerCase();

  /* Données filtrées par onglet */
  const recueilItems = useMemo(() => {
    return cantiques
      .filter((c) => c.famille === 'recueil')
      .filter((c) => cantiqueMatchesQuery(c, q))
      .filter((c) => cantiqueMatchesInterprete(c, selectedInterpretes))
      .sort((a, b) => {
        if (recueilSort === 'numero') {
          return (a.numeroRecueil ?? 999999) - (b.numeroRecueil ?? 999999);
        }
        return a.titre.localeCompare(b.titre);
      });
  }, [q, selectedInterpretes, recueilSort]);

  const specialItems = useMemo(() => {
    return cantiques
      .filter((c) => c.famille === 'special')
      .filter((c) => cantiqueMatchesQuery(c, q))
      .filter((c) => cantiqueMatchesInterprete(c, selectedInterpretes));
  }, [q, selectedInterpretes]);

  const adorationItems = useMemo(() => {
    return sessionsAdoration
      .filter((s) => {
        if (!q) return true;
        const haystack = [
          s.titre,
          s.evenement ?? '',
          ...s.interpretes,
          ...(s.cantiquesContenus ?? []).map((cc) => cc.titre),
        ].join(' ').toLowerCase();
        return haystack.includes(q);
      })
      .filter((s) => {
        if (selectedInterpretes.size === 0) return true;
        for (const i of selectedInterpretes) {
          if (s.interpretes.includes(i)) return true;
        }
        return false;
      })
      .sort((a, b) => {
        return adorationSort === 'recent'
          ? b.date.localeCompare(a.date)
          : a.date.localeCompare(b.date);
      });
  }, [q, selectedInterpretes, adorationSort]);

  /* Compteurs dynamiques pour les onglets en mode filtré */
  const dynamicCounts: Record<FamilyTab, number> = {
    recueil: recueilItems.length,
    special: specialItems.length,
    adoration: adorationItems.length,
  };

  const hasActiveFilters = q.length > 0 || selectedInterpretes.size > 0;

  const resetAll = useCallback(() => {
    setQuery('');
    setSelectedInterpretes(new Set());
  }, []);

  const toggleInterprete = (name: string) => {
    setSelectedInterpretes((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  };

  const openCantique = useCallback((c: Cantique) => {
    navigate(`/eglise/cantiques/watch/${c.slug ?? c.id}`);
  }, [navigate]);

  const openSession = useCallback((slug: string) => {
    /* Phase 3 : route /eglise/cantiques/session/:slug ;
       en attendant, on ouvre la première URL YouTube directement. */
    const session = sessionsAdoration.find((s) => s.slug === slug);
    if (session) {
      navigate(`/eglise/cantiques/watch/session-${session.slug}`);
    }
  }, [navigate]);

  const activeTabMeta = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  return (
    <main id="main-content" className={styles.page}>

      {/* ══════════════════════════════════════════════════════════
          HERO glass dark
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.hero} aria-label={t('eglise.cantiques.eyebrow')}>
        <div className={styles.heroInner}>
          <div className={styles.heroEyebrow}>{t('eglise.cantiques.eyebrow')}</div>
          <h1 className={styles.heroTitle}>
            {t('eglise.cantiques.titreLine1')}<br />
            <em>{t('eglise.cantiques.titreLine2')}</em>
          </h1>
          <div className={styles.heroRef}>{t('eglise.cantiques.ref')}</div>
          <p className={styles.heroLede}>{t('eglise.cantiques.lede')}</p>
        </div>

        <button
          type="button"
          className={[
            styles.scrollHint,
            hasScrolled ? styles.scrollHintHidden : '',
          ].join(' ')}
          onClick={() => {
            window.scrollTo({ top: window.innerHeight * 0.85, behavior: 'smooth' });
          }}
          aria-label="Découvrir l'hymnaire"
        >
          <span className={styles.scrollHintLabel}>Découvrir l'hymnaire</span>
          <span className={styles.scrollHintArrow} aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </button>
      </section>

      {/* ══════════════════════════════════════════════════════════
          ONGLETS FAMILLES + RECHERCHE
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.tabsBand} aria-label="Choisir une famille de cantiques">
        <div className={styles.tabsBandInner}>
          <div className={styles.tabs} role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                className={[
                  styles.tab,
                  activeTab === tab.id ? styles.tabActive : '',
                ].join(' ')}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className={styles.tabLabel}>{tab.label}</span>
                <span className={styles.tabCount}>
                  {hasActiveFilters ? dynamicCounts[tab.id] : tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className={styles.searchBar} role="search">
            <span className={styles.searchIcon} aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.5" y2="16.5" />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Rechercher un cantique, un interprète…"
              aria-label="Rechercher dans les cantiques"
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

        <p className={styles.tabsDescription}>{activeTabMeta.description}</p>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TOOLBAR — filtres contextuels (interprètes + tri)
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.toolbar} aria-label="Filtres et tri">
        <div className={styles.toolbarInner}>

          {/* Interprètes : chips horizontaux */}
          {interpretes.length > 0 && (
            <div className={styles.toolbarGroup}>
              <span className={styles.toolbarLbl}>Interprète</span>
              <div className={styles.chips}>
                {interpretes.map((name) => {
                  const active = selectedInterpretes.has(name);
                  return (
                    <button
                      key={name}
                      type="button"
                      className={[styles.chip, active ? styles.chipActive : ''].join(' ')}
                      onClick={() => toggleInterprete(name)}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tri spécifique à l'onglet */}
          {activeTab === 'recueil' && (
            <div className={styles.toolbarGroup}>
              <span className={styles.toolbarLbl}>Tri</span>
              <div className={styles.chips}>
                <button
                  type="button"
                  className={[styles.chip, recueilSort === 'numero' ? styles.chipActive : ''].join(' ')}
                  onClick={() => setRecueilSort('numero')}
                >
                  Par numéro
                </button>
                <button
                  type="button"
                  className={[styles.chip, recueilSort === 'titre' ? styles.chipActive : ''].join(' ')}
                  onClick={() => setRecueilSort('titre')}
                >
                  Par titre (A → Z)
                </button>
              </div>
            </div>
          )}

          {activeTab === 'adoration' && (
            <div className={styles.toolbarGroup}>
              <span className={styles.toolbarLbl}>Tri</span>
              <div className={styles.chips}>
                <button
                  type="button"
                  className={[styles.chip, adorationSort === 'recent' ? styles.chipActive : ''].join(' ')}
                  onClick={() => setAdorationSort('recent')}
                >
                  Plus récent
                </button>
                <button
                  type="button"
                  className={[styles.chip, adorationSort === 'ancien' ? styles.chipActive : ''].join(' ')}
                  onClick={() => setAdorationSort('ancien')}
                >
                  Plus ancien
                </button>
              </div>
            </div>
          )}

          {hasActiveFilters && (
            <button
              type="button"
              className={styles.toolbarReset}
              onClick={resetAll}
            >
              Réinitialiser
            </button>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          VUE PRINCIPALE — change selon l'onglet
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.viewport} aria-label={activeTabMeta.label}>
        {activeTab === 'recueil' && (
          <RecueilView items={recueilItems} onOpen={openCantique} onReset={resetAll} hasFilters={hasActiveFilters} />
        )}
        {activeTab === 'special' && (
          <SpecialView items={specialItems} onOpen={openCantique} onReset={resetAll} hasFilters={hasActiveFilters} />
        )}
        {activeTab === 'adoration' && (
          <AdorationView items={adorationItems} onOpen={openSession} onReset={resetAll} hasFilters={hasActiveFilters} />
        )}
      </section>
    </main>
  );
}

/* ══════════════════════════════════════════════════════════
   VUE RECUEIL — grille éditoriale dense (typographie Cormorant)
   ══════════════════════════════════════════════════════════ */

interface RecueilViewProps {
  items: Cantique[];
  onOpen: (c: Cantique) => void;
  onReset: () => void;
  hasFilters: boolean;
}

function RecueilView({ items, onOpen, onReset, hasFilters }: RecueilViewProps) {
  if (items.length === 0) {
    return <EmptyState onReset={onReset} hasFilters={hasFilters} message="Aucun cantique du recueil ne correspond." />;
  }
  return (
    <div className={styles.recueil}>
      <header className={styles.recueilHeader}>
        <h2 className={styles.recueilTitle}>
          Recueil de l'assemblée
          <span className={styles.recueilCount}>· {items.length} cantique{items.length > 1 ? 's' : ''}</span>
        </h2>
        <p className={styles.recueilLede}>
          Index alphabétique du recueil — cliquez sur un cantique pour ouvrir sa fiche
          (paroles + vidéos disponibles dans l'assemblée).
        </p>
      </header>

      <ol className={styles.recueilList}>
        {items.map((c) => {
          const hasVideo = (c.occurrences ?? []).length > 0 || !!c.videoUrl;
          return (
            <li key={c.id} className={styles.recueilItem}>
              <button
                type="button"
                className={styles.recueilLink}
                onClick={() => onOpen(c)}
                aria-label={`Ouvrir le cantique n°${c.numero} : ${c.titre}`}
              >
                <span className={styles.recueilNum}>
                  {c.numeroRecueil ? String(c.numeroRecueil).padStart(3, '0') : c.numero}
                </span>
                <span className={styles.recueilTitleLink}>{c.titre}</span>
                <span className={styles.recueilHints}>
                  {hasVideo && (
                    <span className={styles.recueilHasVideo} title="Vidéo disponible">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      vidéo
                    </span>
                  )}
                  {(c.lyrics?.length ?? 0) > 0 && (
                    <span className={styles.recueilHasLyrics}>paroles</span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   VUE CANTIQUES SPÉCIAUX — grille YouTube-like
   ══════════════════════════════════════════════════════════ */

interface SpecialViewProps {
  items: Cantique[];
  onOpen: (c: Cantique) => void;
  onReset: () => void;
  hasFilters: boolean;
}

function SpecialView({ items, onOpen, onReset, hasFilters }: SpecialViewProps) {
  if (items.length === 0) {
    return <EmptyState onReset={onReset} hasFilters={hasFilters} message="Aucun cantique spécial ne correspond." />;
  }
  return (
    <div className={styles.special}>
      <div className={styles.specialGrid}>
        {items.map((c) => (
          <SpecialCard key={c.id} cantique={c} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

function SpecialCard({ cantique, onOpen }: { cantique: Cantique; onOpen: (c: Cantique) => void }) {
  const firstOcc = cantique.occurrences?.[0];
  const videoUrl = firstOcc?.videoUrl ?? cantique.videoUrl;
  const thumb = youtubeThumbnail(videoUrl);
  const titleClean = cantique.titre.replace(/\.$/, '');
  const interpreteLabel = firstOcc?.interpretes.join(' · ') ?? cantique.solisteOuChoeur;

  return (
    <article
      className={[styles.card, cantique.estVedette ? styles.cardFeatured : ''].join(' ')}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(cantique)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(cantique);
        }
      }}
      aria-label={`Ouvrir le cantique : ${cantique.titre}`}
    >
      <div className={styles.cardThumb}>
        {thumb && <img src={thumb} alt="" className={styles.cardThumbImg} loading="lazy" />}
        <div className={styles.cardThumbOverlay} aria-hidden="true" />
        {cantique.duration && (
          <span className={styles.cardDuration}>{cantique.duration}</span>
        )}
        <button
          type="button"
          className={styles.cardPlay}
          tabIndex={-1}
          aria-hidden="true"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
        {cantique.recordingType && (
          <span className={styles.cardBadge}>
            {cantique.recordingType === 'studio' ? 'Studio'
              : cantique.recordingType === 'live'   ? 'Live au culte'
              : 'Culte'}
          </span>
        )}
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{titleClean}</h3>
        <p className={styles.cardMeta}>{interpreteLabel}</p>
        {firstOcc?.dateEvenement && (
          <p className={styles.cardDate}>{formatShortDate(firstOcc.dateEvenement)}</p>
        )}
      </div>
    </article>
  );
}

/* ══════════════════════════════════════════════════════════
   VUE ADORATION & LOUANGE — sessions chronologiques
   ══════════════════════════════════════════════════════════ */

interface AdorationViewProps {
  items: typeof sessionsAdoration;
  onOpen: (slug: string) => void;
  onReset: () => void;
  hasFilters: boolean;
}

function AdorationView({ items, onOpen, onReset, hasFilters }: AdorationViewProps) {
  if (items.length === 0) {
    return <EmptyState onReset={onReset} hasFilters={hasFilters} message="Aucune session d'adoration ne correspond." />;
  }
  /* On utilise EXACTEMENT la même grille .specialGrid + le système de
     .card que SpecialView. Cohérence visuelle : que tu sois dans
     "Spéciaux" ou "Service de chant", l'affichage des cartes vidéo est
     identique (16:9, badge, play overlay, body 3 lignes). */
  return (
    <div className={styles.special}>
      <div className={styles.specialGrid}>
        {items.map((session) => (
          <AdorationCard key={session.id} session={session} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

function AdorationCard({
  session,
  onOpen,
}: {
  session: typeof sessionsAdoration[number];
  onOpen: (slug: string) => void;
}) {
  const thumb = youtubeThumbnail(session.videoUrl);
  const cantiquesCount = session.cantiquesContenus?.length ?? 0;
  return (
    <article
      className={styles.card}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(session.slug)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(session.slug);
        }
      }}
      aria-label={`Ouvrir la session : ${session.titre}`}
    >
      <div className={styles.cardThumb}>
        {thumb && <img src={thumb} alt="" className={styles.cardThumbImg} loading="lazy" />}
        <div className={styles.cardThumbOverlay} aria-hidden="true" />
        {session.dureeMinutes && (
          <span className={styles.cardDuration}>{formatMinutes(session.dureeMinutes)}</span>
        )}
        <button
          type="button"
          className={styles.cardPlay}
          tabIndex={-1}
          aria-hidden="true"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
        {cantiquesCount > 0 && (
          <span className={styles.cardBadge}>
            {cantiquesCount} cantique{cantiquesCount > 1 ? 's' : ''}
          </span>
        )}
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{session.titre}</h3>
        <p className={styles.cardMeta}>{session.interpretes.join(' · ')}</p>
        <p className={styles.cardDate}>
          {formatLongDate(session.date)}
          {session.evenement && ` · ${session.evenement}`}
        </p>
      </div>
    </article>
  );
}

/* ══════════════════════════════════════════════════════════
   EMPTY STATE
   ══════════════════════════════════════════════════════════ */

function EmptyState({ message, onReset, hasFilters }: { message: string; onReset: () => void; hasFilters: boolean }) {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon} aria-hidden="true">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.5" y2="16.5" />
        </svg>
      </div>
      <h3 className={styles.emptyTitle}>{message}</h3>
      <p className={styles.emptyDesc}>Ajustez la recherche ou les filtres pour élargir les résultats.</p>
      {hasFilters && (
        <button type="button" className={styles.emptyBtn} onClick={onReset}>
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );
}
