import styles from './Footer.module.css';

const MAPS_URL =
  'https://maps.google.com/?q=64+avenue+du+Groupe+Manouchian+94400+Vitry-sur-Seine';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>

        {/* Colonne 1 — Identité */}
        <div className={styles.col}>
          <img
            src="/logo-rst.png"
            alt="Roc Séculaire Tabernacle"
            className={styles.logoImg}
            width={120}
            height={75}
          />
          <p className={styles.phrase}>
            Assemblée chrétienne<br/>Roc Séculaire Tabernacle.
          </p>
        </div>

        {/* Colonne 2 — Localisation */}
        <div className={styles.col}>
          <p className={styles.colLabel}>Localisation</p>
          <address className={styles.adresse}>
            <span>Salle 2&nbsp;: Bacchus</span>
            <span>64 av. du Groupe Manouchian</span>
            <span>94400 Vitry-sur-Seine</span>
          </address>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mapLink}
          >
            Voir sur Google Maps →
          </a>
        </div>

        {/* Colonne 3 — Horaires */}
        <div className={styles.col}>
          <p className={styles.colLabel}>Horaires</p>
          <ul className={styles.schedule}>
            <li>
              <span className={styles.schedDay}>Mercredi</span>
              <span className={styles.schedTime}>19H00 — 21H00 · Culte</span>
            </li>
            <li>
              <span className={styles.schedDay}>Dimanche</span>
              <span className={styles.schedTime}>09H00 — 12H30 · Culte</span>
            </li>
            <li>
              <span className={styles.schedDay}>Vendredi</span>
              <span className={styles.schedTime}>dès 19H00 · Réunion de prière</span>
            </li>
          </ul>
        </div>

        {/* Colonne 4 — Secrétariat */}
        <div className={styles.col}>
          <p className={styles.colLabel}>Secrétariat de l'Église</p>
          <div className={styles.contactLinks}>
            <a href="tel:+33000000000" className={styles.contactLink}>
              +33 0 00 00 00 00
            </a>
            <a href="mailto:secretariat@rocseculaire.fr" className={styles.contactLink}>
              secretariat@rocseculaire.fr
            </a>
            <a
              href="https://www.youtube.com/@kollonell"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ytLink}
            >
              Chaîne YouTube →
            </a>
          </div>
        </div>

      </div>

      <div className={styles.legal}>
        <p>© {new Date().getFullYear()} Roc Séculaire Tabernacle · Vitry-sur-Seine</p>
      </div>
    </footer>
  );
}
