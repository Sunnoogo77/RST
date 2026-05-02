import { useState } from 'react';
import { sermons } from '../../data/sermons';
import type { Sermon } from '../../types';
import styles from './Cultes.module.css';

/* ── Helpers ─────────────────────────────────────────────── */

interface ArchiveMonth {
  key: string;
  label: string;
  items: Sermon[];
}

function groupByMonth(ss: Sermon[]): ArchiveMonth[] {
  const map = new Map<string, ArchiveMonth>();
  for (const s of ss) {
    const d = new Date(s.date + 'T12:00:00');
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!map.has(key)) {
      const raw = d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      map.set(key, { key, label: raw.charAt(0).toUpperCase() + raw.slice(1), items: [] });
    }
    map.get(key)!.items.push(s);
  }
  return [...map.values()];
}

function formatWhen(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const wd = d.toLocaleDateString('fr-FR', { weekday: 'short' }); // "dim."
  const wAbr = wd.charAt(0).toUpperCase() + wd.slice(1);          // "Dim."
  const day = d.getDate();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${wAbr} ${day} . ${month}`;
}

function formatWhenTag(dateStr: string, heure: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const wd = d.toLocaleDateString('fr-FR', { weekday: 'long' }); // "dimanche"
  const wCap = wd.charAt(0).toUpperCase() + wd.slice(1);
  const day = d.getDate();
  const month = d.toLocaleDateString('fr-FR', { month: 'long' });
  const year = d.getFullYear();
  return `${wCap} ${day} ${month} ${year} · ${heure}`;
}

function archiveSeriesLabel(s: Sermon): string {
  if (!s.numeroSerie) return s.serie;
  return `${s.serie} #${String(s.numeroSerie).padStart(2, '0')}`;
}

function metaSeriesTag(s: Sermon): string {
  if (!s.numeroSerie) return s.serie;
  return `${s.serie} · #${String(s.numeroSerie).padStart(2, '0')}`;
}

/* ── Component ───────────────────────────────────────────── */

type TabId = 'passages' | 'branham' | 'plan';
const TAB_LABELS: Record<TabId, string> = {
  passages: 'Passages',
  branham: 'Citations Branham',
  plan: 'Plan',
};

export default function Cultes() {
  const [selectedId, setSelectedId] = useState(sermons[0].id);
  const [activeTab, setActiveTab] = useState<TabId>('passages');
  const [sortFilter, setSortFilter] = useState('date');
  const [periodFilter, setPeriodFilter] = useState('');

  const activeSermon = sermons.find((s) => s.id === selectedId) ?? sermons[0];
  const archive = groupByMonth(sermons);

  const titlePrefix = activeSermon.titleEm
    ? activeSermon.titre.slice(0, activeSermon.titre.length - activeSermon.titleEm.length).trim()
    : activeSermon.titre;

  return (
    <main id="main-content">

      {/* ══════════════════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.hero} aria-label="Les prédications de l'assemblée">
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>Les prédications de l'assemblée</div>
          <h1 className={styles.heroTitle}>
            « La foi vient de ce qu'on entend,<br/>
            <em>et ce qu'on entend vient de la Parole. »</em>
          </h1>
          <div className={styles.heroRef}>Romains 10 . 17</div>
          <p className={styles.heroLede}>
            Chaque culte est conservé ici comme un objet d'étude — vidéo, passages bibliques cités,
            citations du prophète et plan structurel rassemblés dans une seule fiche, pour la lecture,
            la méditation et le partage.
          </p>
          <blockquote className={styles.heroBran}>
            « La Parole prêchée est la semence ; elle ne tombe pas par terre, elle reste, elle germe à son temps. »
            <cite className={styles.heroBranCite}>
              — W. M. Branham · THE SPOKEN WORD IS THE ORIGINAL SEED · 62-0318M
            </cite>
          </blockquote>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FILTRES
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.filters} aria-label="Filtres">
        <div className={styles.filtersInner}>

          <div className={styles.filterGroup}>
            <span className={styles.lbl}>Classer par</span>
            {(['date', 'Série', 'Livre biblique'] as const).map((item) => {
              const id = item === 'date' ? 'date' : item === 'Série' ? 'serie' : 'livre';
              return (
                <button
                  key={id}
                  className={`${styles.chip} ${sortFilter === id ? styles.chipActive : ''}`}
                  onClick={() => setSortFilter(id)}
                >
                  {item === 'date' ? 'Date' : item}
                </button>
              );
            })}
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.lbl}>Période</span>
            {(['2026', '2025', '2024'] as const).map((yr) => (
              <button
                key={yr}
                className={`${styles.chip} ${periodFilter === yr ? styles.chipActive : ''}`}
                onClick={() => setPeriodFilter(yr)}
              >
                {yr}
              </button>
            ))}
            <button className={`${styles.chip} ${styles.chipMuted}`} disabled>Archives ↓</button>
          </div>

          <div className={styles.filterSearch}>
            <span className={styles.searchIcon} aria-hidden="true">⌕</span>
            <input
              type="text"
              placeholder="Rechercher · titre, verset, mot-clé"
              aria-label="Rechercher un sermon"
            />
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          BOARD — archive gauche · fiche sermon droite
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.board}>

        {/* ── Colonne archive ────────────────────────────────── */}
        <aside className={styles.archiveCol} aria-label="Archive des cultes">
          {archive.map((month) => (
            <div key={month.key} className={styles.monthBlock}>
              <div className={styles.monthLbl}>{month.label}</div>
              <ul className={styles.archiveList}>
                {month.items.map((s) => (
                  <li
                    key={s.id}
                    className={`${styles.archiveItem} ${selectedId === s.id ? styles.archiveItemActive : ''}`}
                    onClick={() => { setSelectedId(s.id); setActiveTab('passages'); }}
                    aria-current={selectedId === s.id ? 'true' : undefined}
                  >
                    <span className={styles.when}>{formatWhen(s.date)}</span>
                    <span className={styles.itemTitle}>{s.titre.replace(/\.$/, '')}</span>
                    <span className={styles.itemSeries}>{archiveSeriesLabel(s)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button className={styles.archiveMore}>Voir plus de cultes ↓</button>
        </aside>

        {/* ── Fiche sermon actif ─────────────────────────────── */}
        <article className={styles.sermonCol} aria-label={activeSermon.titre}>

          <div className={styles.sermonMeta}>
            <span className={styles.seriesTag}>{metaSeriesTag(activeSermon)}</span>
            <span className={styles.whenTag}>{formatWhenTag(activeSermon.date, activeSermon.heure)}</span>
          </div>

          <h2 className={styles.sermonTitle}>
            {activeSermon.titleEm ? (
              <>{titlePrefix}<br/><em>{activeSermon.titleEm}</em></>
            ) : (
              activeSermon.titre
            )}
          </h2>

          <div className={styles.sermonBy}>{activeSermon.predicateur}</div>

          <div className={styles.sermonVideo}>
            <div className={styles.videoPoster} aria-label="Vidéo du sermon">
              <button className={styles.playBtn} aria-label="Lire le sermon">▶</button>
            </div>
            <div className={styles.videoRuntime}>
              {[activeSermon.duree, 'audio + vidéo', 'disponible en téléchargement']
                .filter(Boolean)
                .join(' · ')}
            </div>
          </div>

          {/* Onglets internes */}
          <div className={styles.sermonTabs} role="tablist">
            {(['passages', 'branham', 'plan'] as TabId[]).map((id) => (
              <button
                key={id}
                role="tab"
                aria-selected={activeTab === id}
                className={`${styles.stab} ${activeTab === id ? styles.stabActive : ''}`}
                onClick={() => setActiveTab(id)}
              >
                {TAB_LABELS[id]}
              </button>
            ))}
          </div>

          {/* Panneau Passages */}
          <div
            className={`${styles.stabPanel} ${activeTab === 'passages' ? styles.stabPanelActive : ''}`}
            role="tabpanel"
            aria-label="Passages bibliques"
          >
            {activeSermon.passages.map((p) => (
              <div key={p.reference} className={styles.passageBlock}>
                <div className={styles.refLine}>{p.reference}</div>
                <blockquote className={styles.bibl}>{p.texte}</blockquote>
              </div>
            ))}
            {activeSermon.passages.length === 0 && (
              <p className={styles.vide}>Passages à renseigner.</p>
            )}
          </div>

          {/* Panneau Citations Branham */}
          <div
            className={`${styles.stabPanel} ${activeTab === 'branham' ? styles.stabPanelActive : ''}`}
            role="tabpanel"
            aria-label="Citations Branham"
          >
            {activeSermon.citationsBranham.map((c, i) => (
              <div key={i} className={styles.branBlock}>
                <div className={styles.branSource}>{c.source}</div>
                <blockquote className={styles.bran}>{c.texte}</blockquote>
              </div>
            ))}
            {activeSermon.citationsBranham.length === 0 && (
              <p className={styles.vide}>Citations à renseigner.</p>
            )}
          </div>

          {/* Panneau Plan */}
          <div
            className={`${styles.stabPanel} ${activeTab === 'plan' ? styles.stabPanelActive : ''}`}
            role="tabpanel"
            aria-label="Plan du message"
          >
            <ol className={styles.planList}>
              {activeSermon.plan.map((item) => (
                <li key={item.numero} className={styles.planItem}>
                  <span className={styles.planNum}>{item.numero}</span>
                  <div>
                    <h4 className={styles.planBodyH4}>{item.titre}</h4>
                    <p className={styles.planBodyP}>{item.description}</p>
                  </div>
                </li>
              ))}
            </ol>
            {activeSermon.plan.length === 0 && (
              <p className={styles.vide}>Plan à renseigner.</p>
            )}
          </div>

          {/* Actions */}
          <div className={styles.sermonActions}>
            <a href={activeSermon.audioUrl ?? '#'} className={styles.btnLine}>↓ Audio MP3</a>
            <a href={activeSermon.videoUrl ?? '#'} className={styles.btnLine}>↓ Vidéo MP4</a>
            <a href="#" className={styles.btnLine}>↓ Plan en PDF</a>
            <a href="#" className={styles.btnLine}>Partager</a>
          </div>

        </article>

      </section>

    </main>
  );
}
