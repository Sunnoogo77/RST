import type { MessageHero } from '../types';
import wmbRaised from '../../assets-source/88818a8e-d349-45b5-bcfe-774c86115b23.jpg';
import wmbBible from '../../assets-source/9ba9c02a-2088-4f9b-a1f0-6bd151abfb96.jpg';
import wmbFormal from '../../assets-source/dbfb91fa-a264-41a1-aa08-17f26b7fed92.jpg';
import wmbProfile from '../../assets-source/0b19a1ba-c978-415f-9745-dafd507cb27e.jpg';
import jesusPortrait from '../../assets-source/c94b616a-7583-4c65-95b1-29f76e70b627.jpg';

export const messagesHero: MessageHero[] = [
  {
    id: 'pastor-ndaye',
    src: '/images/pastor-ndaye.jpeg',
    alt: 'Rev. Robert Ndaye M., pasteur de Roc Séculaire Tabernacle, tenant la Parole ouverte',
    credit: 'Rev. Robert Ndaye M.',
    objectPosition: 'center top',
  },
  {
    id: 'wmb-pulpit',
    src: '/images/wmb-portrait.jpeg',
    alt: 'William M. Branham (1909–1965) en prédication',
    credit: 'William M. Branham — 1909–1965',
    objectPosition: 'right top',
  },
  {
    id: 'wmb-raised',
    src: wmbRaised,
    alt: 'William M. Branham pointant vers le ciel',
    credit: 'William M. Branham',
    objectPosition: 'center top',
  },
  {
    id: 'wmb-bible',
    src: wmbBible,
    alt: 'William M. Branham tenant la Bible',
    credit: 'William M. Branham',
    objectPosition: 'center top',
  },
  {
    id: 'wmb-formal',
    src: wmbFormal,
    alt: 'William M. Branham — portrait officiel',
    credit: 'William M. Branham',
    objectPosition: 'center top',
  },
  {
    id: 'wmb-profile',
    src: wmbProfile,
    alt: 'William M. Branham en profil',
    credit: 'William M. Branham',
    objectPosition: '40% top',
  },
  {
    id: 'jesus',
    src: jesusPortrait,
    alt: 'Portrait du Christ — tableau classique',
    credit: '',
    objectPosition: 'center 15%',
  },
];
