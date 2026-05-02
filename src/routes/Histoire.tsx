import { Link } from 'react-router-dom';
import { Eyebrow } from '../components/ui/Eyebrow/Eyebrow';
import { HairlineDivider } from '../components/ui/HairlineDivider/HairlineDivider';
import styles from './Histoire.module.css';

const VERSETS = [
  'MALACHIE 4·5-6',
  'ZACHARIE 14·7',
  'ACTES 3·17-21',
  'APOCALYPSE 10·7',
  'JEAN 3·16',
  'LUC 17·26-30',
] as const;

const PILIERS = [
  { label: 'UNE LOI', valeur: "L'Amour" },
  { label: 'UN SEUL LIVRE', valeur: 'La Bible' },
  { label: 'UN SEUL CREDO', valeur: 'Jésus-Christ' },
] as const;

export default function Histoire() {
  return (
    <main id="main-content">

      {/* ══════════════════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════════════════ */}
      <header className={styles.hero} aria-label="Histoire de l'Église">
        <div className={styles.heroInner}>
          <Eyebrow>Mémoire</Eyebrow>
          <h1 className={styles.heroTitre}>
            Histoire de <em>l'Église.</em>
          </h1>
          <p className={styles.heroSubtitre}>
            Roc Séculaire Tabernacle — depuis le 24 janvier 1999.
          </p>
          <p className={styles.heroMeta}>
            ÎLE DE FRANCE &nbsp;·&nbsp; FONDÉE LE 24.01.1999 &nbsp;·&nbsp; RÉCIT DE FONDATION
          </p>
        </div>
      </header>

      <HairlineDivider weight="major" />

      {/* ══════════════════════════════════════════════════════════
          §I — LE PASTEUR FONDATEUR
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.section} aria-labelledby="s1-titre">
        <div className={styles.sectionInner}>
          <p className={styles.sectionNum}>§ I &nbsp;·&nbsp; LE PASTEUR FONDATEUR</p>
          <h2 id="s1-titre" className={styles.sectionTitre}>
            Un homme, un appel, un sentier.
          </h2>

          <div className={styles.sI}>
            {/* Colonne texte */}
            <div className={styles.sITexte}>
              <p className={`${styles.corps} ${styles.dropCap}`}>
                Robert Ndaye M. est né le 4 juin 1964 à Kananga, en République Démocratique
                du Congo — alors le Zaïre. Ses parents sont enseignants. Très tôt,
                l'instruction et la rigueur entrent dans sa vie comme une discipline familiale.
              </p>
              <p className={styles.corps}>
                Il rencontre le Seigneur en 1982. Cette rencontre ne fait pas de lui un homme
                d'Église immédiatement : avant le ministère, il occupe le poste de trésorier
                général du groupe SOTRAIB à Kinshasa. Il est marié à sœur Esther : ils ont
                deux enfants.
              </p>
              <p className={styles.corps}>
                Au moment de quitter Kinshasa pour la région parisienne, il reçoit un ordre
                de mission lié à une œuvre missionnaire qu'il ne connaît encore que dans ses
                grandes lignes. Il ne sait pas encore. Il part avec une personne — pas un plan.
              </p>
            </div>

            {/* Portrait */}
            <figure className={styles.sIPortrait}>
              <img
                src="/pastor-ndaye.jpeg"
                alt="Rev. Robert Ndaye M., pasteur fondateur"
                className={styles.sIPortraitImg}
                loading="lazy"
              />
              <figcaption className={styles.sICaption}>
                REV. ROBERT NDAYE M. &nbsp;·&nbsp; PASTEUR FONDATEUR
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <HairlineDivider weight="soft" />

      {/* ══════════════════════════════════════════════════════════
          §II — LA NAISSANCE
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.section} aria-labelledby="s2-titre">
        <div className={styles.sectionInner}>
          <p className={styles.sectionNum}>§ II &nbsp;·&nbsp; LA NAISSANCE</p>
          <h2 id="s2-titre" className={styles.sectionTitre}>
            La nuit du 23 au 24 janvier 1999.
          </h2>

          <p className={`${styles.corps} ${styles.dropCap}`}>
            Les premières années en France sont précaires. Ni logement, ni revenu stables.
            Le pasteur se voit offrir un poste de pasteur associé dans une église parisienne —
            la sécurité matérielle, le confort d'une charge déjà installée. Il refuse.
            La prophétie reçue à Kinshasa exige autre chose : fonder l'œuvre pour laquelle
            il a quitté son pays.
          </p>

          <p className={styles.corps}>
            Quand un petit appartement se libère enfin à Épinay-sur-Seine, il fait cette
            promesse :
          </p>

          <blockquote className={styles.priere}>
            <p>
              « Si Tu me donnes Seigneur Jésus un appartement pour Ton assemblée, je m'engage
              à Te servir jusqu'à la fin de ma vie. »
            </p>
          </blockquote>

          <p className={styles.corps}>
            La nuit du 23 au 24 janvier 1999. Il prie toute la nuit avec son épouse Esther.
            Aucune réponse audible ne leur est donnée. La réponse, elle, vient du lendemain :
            un frère des États-Unis a reçu un songe, qu'il transmet au pasteur. Avec sa femme,
            seul, il en comprend le sens.
          </p>

          <p className={styles.corps}>
            L'après-midi du même jour, dans une pièce de douze mètres carré, la première
            réunion se tient. Le premier auditoire est composé de son épouse et de leurs deux
            enfants. En plein milieu de la prédication, sœur Samantha et sa fille rejoignent
            l'assemblée. C'est cette réunion-là — dans douze mètres carré, devant cinq
            personnes — qui marque la naissance de Roc Séculaire Tabernacle.
          </p>

          <blockquote className={styles.priere}>
            <p>
              « Quand l'Éternel envoie un homme, la première personne qu'il rencontre,
              c'est le diable. »
            </p>
          </blockquote>
          <p className={styles.brSource}>— WILLIAM BRANHAM, CITÉ PAR LE PASTEUR NDAYE</p>
        </div>
      </section>

      <HairlineDivider weight="soft" />

      {/* ══════════════════════════════════════════════════════════
          §III — L'APPEL ET LA MISSION
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.section} aria-labelledby="s3-titre">
        <div className={styles.sectionInner}>
          <p className={styles.sectionNum}>§ III &nbsp;·&nbsp; L'APPEL ET LA MISSION</p>
          <h2 id="s3-titre" className={styles.sectionTitre}>
            Un plan de rétablissement à triple dessein.
          </h2>

          <p className={`${styles.corps} ${styles.dropCap}`}>
            L'œuvre s'inscrit dans une ligne prophétique précise. Roc Séculaire Tabernacle
            est une église fondamentaliste et du Plein Évangile, qui porte le Message tel
            qu'il a été prêché par William Marion Branham — le prophète identifié à l'Ange
            de Malachie 4·5.
          </p>

          <p className={styles.corps}>
            La mission est claire : un plan de rétablissement à triple dessein. Au moyen de
            la Parole, Dieu veut s'identifier à l'homme, prendre la prééminence dans sa vie,
            et le ramener à la position initiale.
          </p>

          {/* Puces versets */}
          <div className={styles.versets} role="list" aria-label="Textes de référence">
            {VERSETS.map((v) => (
              <span key={v} className={styles.verset} role="listitem">
                {v}
              </span>
            ))}
          </div>

          {/* Trois piliers */}
          <div className={styles.piliers} aria-label="Les trois piliers">
            {PILIERS.map((p) => (
              <div key={p.label} className={styles.pilier}>
                <p className={styles.pilierLabel}>{p.label}</p>
                <p className={styles.pilierValeur}>{p.valeur}</p>
              </div>
            ))}
          </div>

          <p className={`${styles.corps} ${styles.dropCapR}`}>
            Roc Séculaire — le nom dit tout. Le Roc : l'assise doctrinale, la Parole sans
            compromis. Séculaire : la profondeur, la durée, la fidélité dans le temps.
            Tabernacle : le lieu de rencontre entre le ciel et la terre, entre Dieu et Son
            peuple. Ce nom n'a pas été choisi au hasard.
          </p>
        </div>
      </section>

      <HairlineDivider weight="soft" />

      {/* ══════════════════════════════════════════════════════════
          §IV — LA CROISSANCE ET L'ŒUVRE
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.section} aria-labelledby="s4-titre">
        <div className={styles.sectionInner}>
          <p className={styles.sectionNum}>§ IV &nbsp;·&nbsp; LA CROISSANCE ET L'ŒUVRE</p>
          <h2 id="s4-titre" className={styles.sectionTitre}>
            Sept ans après, une assemblée debout.
          </h2>

          <p className={`${styles.corps} ${styles.dropCap}`}>
            À la fin janvier 2006, l'église fêtait son septième anniversaire — son jubilé.
            En sept ans, l'audience de cinq personnes dans douze mètres carré s'est étoffée
            d'une diaspora large : des frères et sœurs venus d'Angola, du Cameroun, du Congo,
            de Côte d'Ivoire, de France métropolitaine, de Guadeloupe, de Guyane française,
            d'Haïti, de Martinique, de R.D. Congo et des Seychelles.
          </p>

          <p className={styles.corps}>
            L'œuvre s'est étendue par des voyages missionnaires — Marseille notamment, avec
            une semaine de publication et de baptêmes. Des offices structurés ont été établis :
            le pasteur, les diacres, l'office de musique avec frère Jules Kayumba à la conduite
            des chants depuis juillet 2010, et l'école du dimanche assurée par sœur Esther Ndaye.
          </p>

          <p className={styles.corps}>
            Onze nations, une seule assemblée. C'est cela, aujourd'hui, Roc Séculaire Tabernacle.
          </p>

          <div className={styles.citFinale}>
            <blockquote className={styles.citFinaleTexte}>
              <p>
                « Sept ans d'épreuves que le Seigneur nous a aidé à convertir en pierres
                pour fortifier l'église. »
              </p>
            </blockquote>
            <p className={styles.citFinaleSource}>
              PASTEUR ROBERT NDAYE &nbsp;·&nbsp; 7ÈME ANNIVERSAIRE DE L'ÉGLISE
            </p>
          </div>
        </div>
      </section>

      <HairlineDivider weight="soft" />

      {/* ══════════════════════════════════════════════════════════
          LIEN SORTIE
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.sortie} aria-label="Continuer la découverte">
        <div className={styles.sortieInner}>
          <Link to="/eglise" className={styles.sortieLink}>
            Découvrez l'Église →
          </Link>
        </div>
      </section>

    </main>
  );
}
