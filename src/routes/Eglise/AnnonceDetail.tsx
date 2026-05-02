import { Link, useParams, Navigate } from 'react-router-dom';
import { annonces } from '../../data/annonces';
import type { AnnonceType } from '../../types';
import styles from './AnnonceDetail.module.css';

const TYPE_DISPLAY: Record<AnnonceType, string> = {
  reunion:        'Réunion',
  voyage:         'Voyage',
  sortie:         'Sortie',
  exceptionnelle: 'Exceptionnelle',
};

function formatLongDate(dateStr: string): string {
  const d = new Date(dateStr);
  const raw = d.toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export default function AnnonceDetail() {
  const { id } = useParams<{ id: string }>();
  const annonce = annonces.find((a) => a.id === id);

  if (!annonce) {
    return <Navigate to="/eglise/annonces" replace />;
  }

  const dateLabel =
    annonce.dateDisplay ??
    (annonce.dateFin
      ? `Du ${formatLongDate(annonce.date)} au ${formatLongDate(annonce.dateFin)}`
      : formatLongDate(annonce.date));

  const typeLabel =
    annonce.sousTypeLabel ??
    `${TYPE_DISPLAY[annonce.type]}${annonce.sousType ? ` · ${annonce.sousType}` : ''}`;

  const statutLabel =
    annonce.statut === 'aujourd-hui' ? "Aujourd'hui" :
    annonce.statut === 'passee'      ? 'Passée'      : 'À venir';

  const statutFlagCls =
    annonce.statut === 'aujourd-hui' ? styles.flagToday :
    annonce.statut === 'passee'      ? styles.flagPast  :
    styles.flagSoon;

  const isPast = annonce.statut === 'passee';
  const hasReport = isPast && annonce.contentBlocks && annonce.contentBlocks.length > 0;

  return (
    <article className={styles.detail}>

      {/* ── Bandeau supérieur ──────────────────────────────────── */}
      <header className={styles.head}>
        <Link to="/eglise/annonces" className={styles.backLink}>
          ← Retour aux annonces
        </Link>

        <div className={styles.headInner}>
          <span className={`${styles.statusFlag} ${statutFlagCls}`}>{statutLabel}</span>
          <span className={styles.headType}>{typeLabel}</span>

          <h1 className={styles.title}>
            {annonce.titre}
            {annonce.titreEm && <><br /><em>{annonce.titreEm}</em></>}
          </h1>

          <p className={styles.lede}>{annonce.description}</p>

          <dl className={styles.meta}>
            <div>
              <dt>Quand</dt>
              <dd>{dateLabel}</dd>
            </div>
            <div>
              <dt>Où</dt>
              <dd>{annonce.lieu}</dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd>{typeLabel}</dd>
            </div>
          </dl>
        </div>
      </header>

      {/* ── Affiche officielle (toutes annonces) ───────────────── */}
      {annonce.affiche && (
        <section className={styles.posterSection} aria-label="Affiche officielle">
          <div className={styles.posterFrame}>
            <img src={annonce.affiche} alt={`Affiche — ${annonce.titre}`} />
          </div>

          <div className={styles.posterActions}>
            <a
              href={annonce.affiche}
              download
              className={styles.btnPrimary}
            >
              ↓ Télécharger l'affiche
            </a>
            <a
              href={annonce.affiche}
              target="_blank"
              rel="noreferrer"
              className={styles.btnLine}
            >
              Ouvrir en grand
            </a>
          </div>
        </section>
      )}

      {/* ── Compte-rendu (annonces passées uniquement) ────────── */}
      {hasReport && (
        <section className={styles.report} aria-label="Compte-rendu">
          <div className={styles.reportHead}>
            <span className={styles.reportEyebrow}>Compte-rendu</span>
            <h2 className={styles.reportTitle}>Ce qui s'est passé</h2>
          </div>

          <div className={styles.reportBody}>
            {annonce.contentBlocks!.map((block, i) => {
              if (block.kind === 'paragraph') {
                return <p key={i} className={styles.reportPara}>{block.text}</p>;
              }
              const sizeCls =
                block.size === 'small'  ? styles.imgSmall  :
                block.size === 'wide'   ? styles.imgWide   :
                                          styles.imgMedium;
              return (
                <figure key={i} className={`${styles.reportFig} ${sizeCls}`}>
                  <img src={block.src} alt={block.alt ?? ''} loading="lazy" />
                </figure>
              );
            })}
          </div>
        </section>
      )}

      {/* ── À venir et pas de compte-rendu : message d'attente ── */}
      {!isPast && !annonce.affiche && (
        <section className={styles.waiting}>
          <p>L'affiche et le programme détaillé seront publiés prochainement.</p>
        </section>
      )}

    </article>
  );
}
