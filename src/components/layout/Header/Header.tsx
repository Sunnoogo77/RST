import { useNavigate, useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LivePill } from '../../ui/LivePill/LivePill';
import { useScrollDirection } from '../../../hooks/useScrollDirection';
import { asset } from '../../../utils/asset';
import styles from './Header.module.css';

export default function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { direction, scrollY, pastHero } = useScrollDirection(80);

  const hidden = direction === 'down' && scrollY > 80;
  // Fond sombre sur l'Accueil et Néhémie dont le hero est bleu naval
  const onDark = (pathname === '/' || pathname === '/nehemie') && !pastHero;

  const toggleLang = () => {
    void i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr');
  };

  return (
    <>
      <a href="#main-content" className={styles.skipLink}>
        {t('accessibility.skipToContent')}
      </a>
      <header
        className={[
          styles.header,
          hidden ? styles.hidden : '',
          onDark ? styles.onDark : styles.onLight,
          scrollY > 12 && !onDark ? styles.scrolled : '',
        ]
          .filter(Boolean)
          .join(' ')}
        role="banner"
      >
        <div className={styles.inner}>
          {/* Logo officiel */}
          <NavLink to="/" className={styles.logo} aria-label={t('accessibility.logoAlt')}>
            <img
              src={asset('/logo-rst.png')}
              alt="Roc Séculaire Tabernacle"
              className={styles.logoImg}
              width={72}
              height={46}
            />
            <span className={styles.logoName}>Roc Séculaire Tabernacle</span>
          </NavLink>

          {/* Navigation principale */}
          <nav className={styles.nav} aria-label="Navigation principale">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              {t('nav.accueil')}
            </NavLink>
            <NavLink
              to="/nehemie"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              {t('nav.nehemie')}
            </NavLink>
            <NavLink
              to="/genese"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              {t('nav.genese')}
            </NavLink>
            <NavLink
              to="/eglise"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              {t('nav.eglise')}
            </NavLink>
          </nav>

          {/* Utilitaires droite */}
          <div className={styles.utility}>
            <LivePill onClick={() => navigate('/eglise')} />
            <div className={styles.langToggle} role="group" aria-label="Langue">
              <button
                className={`${styles.lang} ${i18n.language === 'fr' ? styles.langActive : ''}`}
                onClick={toggleLang}
                aria-label={t('accessibility.langFr')}
                aria-pressed={i18n.language === 'fr'}
              >
                FR
              </button>
              <span className={styles.langSep} aria-hidden="true">|</span>
              <button
                className={`${styles.lang} ${i18n.language === 'en' ? styles.langActive : ''}`}
                onClick={toggleLang}
                aria-label={t('accessibility.langEn')}
                aria-pressed={i18n.language === 'en'}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
