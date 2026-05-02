import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
import Accueil from './routes/Accueil';
import Nehemie from './routes/Nehemie';
import GeneseLayout from './routes/Genese/GeneseLayout';
import Sommaire from './routes/Genese/Sommaire';
import Presentation from './routes/Genese/Presentation';
import Naissance from './routes/Genese/Naissance';
import Mission from './routes/Genese/Mission';
import Branham from './routes/Genese/Branham';
import Actes from './routes/Genese/Actes';
import Offices from './routes/Genese/Offices';
import Services from './routes/Genese/Services';
import Marseille from './routes/Genese/Marseille';
import ReunionJeunes2005 from './routes/Genese/ReunionJeunes2005';
import EgliseLayout from './routes/Eglise/EgliseLayout';
import CetteSemaine from './routes/Eglise/CetteSemaine';
import Cultes from './routes/Eglise/Cultes';
import Cantiques from './routes/Eglise/Cantiques';
import Annonces from './routes/Eglise/Annonces';
import AnnonceDetail from './routes/Eglise/AnnonceDetail';
import Temoignages from './routes/Eglise/Temoignages';
import NotFound from './routes/NotFound';
import DesignSystem from './routes/DesignSystem';

/**
 * basename : Vite expose le base path via import.meta.env.BASE_URL
 * (toujours terminé par '/'). React Router attend un basename SANS
 * trailing slash, sauf '/'. On gère les deux cas.
 */
const ROUTER_BASENAME = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

export default function App() {
  return (
    <BrowserRouter basename={ROUTER_BASENAME}>
      <Header />
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/nehemie" element={<Nehemie />} />

        {/* Genèse — sommaire + 7 piliers + 2 événements marquants */}
        <Route path="/genese" element={<GeneseLayout />}>
          <Route index element={<Sommaire />} />
          <Route path="presentation" element={<Presentation />} />
          <Route path="naissance" element={<Naissance />} />
          <Route path="mission" element={<Mission />} />
          <Route path="branham" element={<Branham />} />
          <Route path="actes-du-saint-esprit" element={<Actes />} />
          <Route path="offices" element={<Offices />} />
          <Route path="services" element={<Services />} />
          <Route path="marseille" element={<Marseille />} />
          <Route path="reunion-jeunes-2005" element={<ReunionJeunes2005 />} />
        </Route>

        {/* Redirection legacy : /histoire → /genese */}
        <Route path="/histoire" element={<Navigate to="/genese" replace />} />

        <Route path="/eglise" element={<EgliseLayout />}>
          <Route index element={<CetteSemaine />} />
          <Route path="cultes" element={<Cultes />} />
          <Route path="cantiques" element={<Cantiques />} />
          <Route path="annonces" element={<Annonces />} />
          <Route path="annonces/:id" element={<AnnonceDetail />} />
          <Route path="temoignages" element={<Temoignages />} />
        </Route>
        <Route path="/design-system" element={<DesignSystem />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
