
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Nav from './components/Nav';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Planet from './pages/Planet';
import Gallery from './pages/Gallery';
import Credits from './pages/Credits';

function ScrollTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollTop />
      <Nav />

      <main id="main" className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/planet/:id" element={<Planet />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/credits" element={<Credits />} />

          <Route
            path="*"
            element={
              <div className="card text-center">
                <h1 className="text-2xl font-extrabold">
                  Lost in space!
                </h1>
                <p className="my-3">
                  We could not find that page.
                </p>
                <Link to="/" className="btn-primary">
                  Back to base
                </Link>
              </div>
            }
          />
        </Routes>
      </main>

      <footer className="border-t border-white/10 px-4 py-6 text-center text-xs text-slate-300">
        SpaceVerse Academy is an independent project and is not
        affiliated with or endorsed by NASA. Images come from the
        NASA Images and Video Library.{' '}
        <Link className="underline" to="/credits">
          Credits
        </Link>
      </footer>
    </>
  );
                                     }
