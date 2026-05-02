import type { Temoignage } from '../types';
import sanctuaryImg from '../../assets-source/de882da8-ee8f-485c-9773-4a9274eea5fb.jpg';

export const temoignages: Temoignage[] = [

  /* ── q1 — Citation courte (2 col) ─────────────────────────────── */
  {
    id: 'tem-q1',
    type: 'citation',
    auteur: '— une sœur · Île-de-France',
    cite: '— une sœur · Île-de-France',
    quoteText:
      "Je suis venue un dimanche par hasard, j'avais besoin d'entendre quelque chose de stable. Trois mois plus tard, c'est devenu mon assemblée — et ma maison tient debout.",
    date: '2026',
  },

  /* ── i1 — Récit illustré (4 col × 2 lignes) ───────────────────── */
  {
    id: 'tem-i1',
    type: 'illustre',
    auteur: '— frère R. · 41 ans · baptisé le 28 . 09 . 2025',
    cite: '— frère R. · 41 ans · baptisé le 28 . 09 . 2025',
    eyebrow: 'Récit · 14 . 03 . 2026',
    titre: "« J'ai retrouvé mon père dans le Père. »",
    corps:
      "J'avais quitté la foi adolescente comme on quitte une maison trop étroite. Vingt ans plus tard, à un mariage, un frère m'a parlé du Message simplement, sans pression. Je suis revenu à RST le dimanche d'après. Je n'étais pas venu chercher Dieu. C'est Lui qui m'attendait.",
    image: sanctuaryImg,
    hasDetail: true,
    date: '2026-03-14',
    detail: {
      tag: 'Récit · 14 . 03 . 2026 · 7 min de lecture',
      byline: 'Frère R. · 41 ans · baptisé le 28 . 09 . 2025 · publié avec son accord',
      readingMinutes: 7,
      paragraphs: [
        {
          kind: 'lede',
          text: "J'avais quitté la foi adolescente comme on quitte une maison trop étroite. Pendant vingt ans, j'ai cru que la liberté c'était de partir. Je l'ai compris à un mariage, en mars dernier, quand un homme que je ne connaissais pas m'a parlé de Christ comme on parle d'un ami sûr.",
        },
        {
          kind: 'p',
          text: "Mon père est mort quand j'avais douze ans. Je ne le savais pas, mais une grande partie de mon refus de Dieu venait de là. Comment faire confiance à un Père céleste quand le père terrestre s'absente sans préavis ? J'ai construit ma vie autour de ce silence, en faisant comme si l'absence était une réponse.",
        },
        {
          kind: 'pull',
          text: "Je n'étais pas venu chercher Dieu. C'est Lui qui m'attendait.",
        },
        {
          kind: 'p',
          text: "Le frère, à ce mariage, n'a pas cherché à me convaincre. Il m'a juste dit : « Viens dimanche écouter, sans engagement. » Je suis venu — et le pasteur a prêché sur Matthieu 7. Pas un mot sur la performance, pas un mot sur ce qu'il fallait faire. Juste : « Sur quoi ta vie est-elle bâtie ? »",
        },
        {
          kind: 'p',
          text: "Je suis rentré chez moi. J'ai pleuré comme un enfant. J'ai compris ce soir-là que le Père que j'avais cherché en mon père absent, je l'avais sous les yeux depuis toujours dans la Parole.",
        },
        {
          kind: 'p',
          text: "J'ai été baptisé six mois plus tard. La paix n'est pas spectaculaire — elle est solide. Comme le Roc.",
        },
      ],
      versetRef: 'Matthieu 7 . 24',
      versetText:
        '« Quiconque entend ces paroles que je dis et les met en pratique. »',
    },
  },

  /* ── q2 — Citation courte avec accent rouge (2 col) ───────────── */
  {
    id: 'tem-q2',
    type: 'citation',
    auteur: '— une mère · 33 ans',
    cite: '— une mère · 33 ans',
    accentRouge: true,
    quoteText:
      "Mon enfant a été guéri — pas comme dans un livre. Comme dans la Bible.",
    date: '2025',
  },

  /* ── s1 — Récit moyen (3 col) ─────────────────────────────────── */
  {
    id: 'tem-s1',
    type: 'recit',
    auteur: '— frère J.K. · 37 ans · membre depuis 2018',
    cite: '— frère J.K. · 37 ans · membre depuis 2018',
    eyebrow: 'Récit · 09 . 02 . 2026',
    titre: "Le travail revenu après la prière de l'autel",
    corps:
      "Trois mois sans contrat. La saison de prière commune nous a portés — mon épouse et moi. Le mardi qui a suivi le jeûne, j'ai reçu un appel d'une entreprise que je n'avais jamais sollicitée. Aujourd'hui je suis en CDI depuis un an. Je n'aurais jamais cru qu'une prière ordinaire puisse répondre aussi clairement.",
    date: '2026-02-09',
  },

  /* ── q3 — Citation courte (3 col) ─────────────────────────────── */
  {
    id: 'tem-q3',
    type: 'citation',
    auteur: '— jeune adulte · 23 ans',
    cite: '— jeune adulte · 23 ans',
    quoteText: "Ici, on m'a appris à lire la Bible — pas à la commenter.",
    date: '2025',
  },

  /* ── i2 — Récit illustré (4 col × 2 lignes) ───────────────────── */
  {
    id: 'tem-i2',
    type: 'illustre',
    auteur: '— frère M. · 52 ans · baptisé le 24 . 01 . 2024',
    cite: '— frère M. · 52 ans · baptisé le 24 . 01 . 2024',
    eyebrow: 'Récit · 21 . 01 . 2026',
    titre: "« Le Message ne m'a pas séduit. Il m'a tenu. »",
    corps:
      "Je suis arrivé sceptique. Pendant un an, j'ai écouté sans m'engager. Puis une nuit d'épreuve réelle — un deuil — la Parole prêchée a tenu là où mon mental s'est effondré. Ce qui ne sert qu'à plaire ne tient pas dans le deuil. Le Roc, oui.",
    image: '/images/wmb-portrait.jpeg',
    hasDetail: false,
    date: '2026-01-21',
  },

  /* ── s2 — Récit moyen (2 col) ─────────────────────────────────── */
  {
    id: 'tem-s2',
    type: 'recit',
    auteur: '— un couple · 16 ans de mariage',
    cite: '— un couple · 16 ans de mariage',
    eyebrow: 'Récit · 15 . 12 . 2025',
    titre: 'Restauration du foyer',
    corps:
      "Mon mariage tenait par les murs. Aucune trahison spectaculaire — juste un silence qui s'épaississait. Une sœur âgée nous a invités à venir au culte du dimanche, sans question. Six mois plus tard, on prie ensemble. Un an après, on rit ensemble. Dieu a réparé ce qu'aucun conseil n'avait su réparer.",
    date: '2025-12-15',
  },

  /* ── q4 — Citation courte (2 col) ─────────────────────────────── */
  {
    id: 'tem-q4',
    type: 'citation',
    auteur: '— une sœur · venue de R.D. Congo en 2022',
    cite: '— une sœur · venue de R.D. Congo en 2022',
    quoteText: "Je n'ai pas trouvé une église. J'ai trouvé une maison.",
    date: '2024',
  },

];

export const totalTemoignages = 94;
export const premiereTemoignageAnnee = 1999;
