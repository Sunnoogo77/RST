import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
import Accueil from './routes/Accueil';
import Nehemie from './routes/Nehemie';
import Histoire from './routes/Histoire';
import EgliseLayout from './routes/Eglise/EgliseLayout';
import CetteSemaine from './routes/Eglise/CetteSemaine';
import Cultes from './routes/Eglise/Cultes';
import Cantiques from './routes/Eglise/Cantiques';
import Annonces from './routes/Eglise/Annonces';
import Temoignages from './routes/Eglise/Temoignages';
import NotFound from './routes/NotFound';
import DesignSystem from './routes/DesignSystem';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/nehemie" element={<Nehemie />} />
        <Route path="/histoire" element={<Histoire />} />
        <Route path="/eglise" element={<EgliseLayout />}>
          <Route index element={<CetteSemaine />} />
          <Route path="cultes" element={<Cultes />} />
          <Route path="cantiques" element={<Cantiques />} />
          <Route path="annonces" element={<Annonces />} />
          <Route path="temoignages" element={<Temoignages />} />
        </Route>
        <Route path="/design-system" element={<DesignSystem />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
