
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Nav from './components/Nav';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Planet from './pages/Planet';
import Gallery from './pages/Gallery';
import Credits from './pages/Credits';
import Quiz from './pages/Quiz';
import MissionControl from './pages/MissionControl';
import CosmicLab from './pages/CosmicLab';
export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      <Nav />

      <main>
        <Routes>
<Route path="/missions" element={<MissionControl />} />
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/planet/:id" element={<Planet />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route
            path="*"
            element={
              <div className="mx-auto max-w-4xl px-4 py-20 text-center">
                <h1 className="text-3xl font-bold">Page not found</h1>
                <Link
                  to="/"
                  className="mt-4 inline-block text-blue-600 underline"
                >
                  Return home
                </Link>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
