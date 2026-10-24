
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchImages } from '../lib/nasa';

const SUGGESTIONS = [
  'Solar System planets',
  'Milky Way galaxy',
  'James Webb Space Telescope',
  'Mars rover',
  'Astronauts in space',
  'Apollo Moon landing',
];

export default function Gallery() {
  const [params, setParams] = useSearchParams();
  const initialQuery = params.get('q') || 'Solar System planets';

  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);
  const [retry, setRetry] = useState(0);
  const [result, setResult] = useState({
    status: 'loading',
    items: [],
    total: 0,
  });

  useEffect(() => {
    const controller = new AbortController();

    setResult({ status: 'loading', items: [], total: 0 });

    searchImages(query.trim(), {
      page,
      pageSize: 12,
      signal: controller.signal,
    })
      .then((data) => {
        setResult({ status: 'success', ...data });
      })
      .catch((error) => {
        if (error.code !== 'cancelled') {
          setResult({
            status: 'error',
            items: [],
            total: 0,
            message: error.message,
          });
        }
      });

    return () => controller.abort();
  }, [query, page, retry]);

  function submitSearch(event) {
    event.preventDefault();

    const cleaned = query.trim();
    if (!cleaned) return;

    setQuery(cleaned);
    setPage(1);
    setParams({ q: cleaned });
  }

  function chooseSuggestion(value) {
    setQuery(value);
    setPage(1);
    setParams({ q: value });
  }

  const pageCount = Math.max(1, Math.ceil(result.total / 12));

  return (
    <div className="space-y-5">
      <header>
        <p className="font-bold uppercase tracking-widest text-cyan-300">
          Real images from space
        </p>
        <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">
          Space Photo Gallery
        </h1>
        <p className="mt-2 text-slate-300">
          Discover planets, distant galaxies, astronauts, and incredible
          space missions through NASA's image collection.
        </p>
      </header>

      <form onSubmit={submitSearch} className="card">
        <label htmlFor="gallery-search" className="mb-2 block font-bold">
          What do you want to discover?
        </label>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="gallery-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try Mars, Saturn, or galaxies..."
            className="min-w-0 flex-1 rounded-xl border border-cyan-400/40 bg-space-900 px-4 py-3 text-white"
            maxLength={120}
            required
          />

          <button type="submit" className="btn-primary">
            🔎 Search
          </button>
        </div>

        <p className="mb-2 mt-4 text-sm font-bold">Try a discovery:</p>

        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => chooseSuggestion(suggestion)}
              className="rounded-full border border-cyan-400/40 px-3 py-2 text-sm text-cyan-200 hover:bg-cyan-400/10"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </form>

      <section aria-live="polite">
        {result.status === 'loading' && (
          <div className="card" role="status">
            <p className="animate-pulse">
              🚀 Searching NASA's image library...
            </p>
          </div>
        )}

        {result.status === 'error' && (
          <div className="card">
            <h2 className="text-xl font-bold">
              We couldn't load the pictures
            </h2>
            <p className="mt-2 text-slate-300">{result.message}</p>
            <button
              type="button"
              className="btn-primary mt-3"
              onClick={() => setRetry((current) => current + 1)}
            >
              Try again
            </button>
            <p className="mt-2 text-xs text-slate-400">
              Check your internet connection and try again.
            </p>
          </div>
        )}

        {result.status === 'success' && (
          <>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl font-extrabold">Search results</h2>
              <p className="text-sm text-slate-300">
                {result.total.toLocaleString()} results found
              </p>
            </div>

            {result.items.length === 0 ? (
              <div className="card">
                No images found. Try a different search term.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {result.items.map((item) => (
                  <article className="card overflow-hidden" key={item.id}>
                    <a
                      href={item.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${item.title} in NASA's image library`}
                    >
                      <img
                        src={item.thumb}
                        alt={item.title}
                        loading="lazy"
                        className="aspect-video w-full rounded-xl object-cover"
                      />
                    </a>

                    <h3 className="mt-3 font-bold">{item.title}</h3>

                    {item.date && (
                      <p className="mt-1 text-xs text-cyan-300">
                        Created: {item.date}
                      </p>
                    )}

                    <p className="mt-2 text-sm text-slate-300">
                      {item.description || 'No description available.'}
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      Credit: {item.credit}
                    </p>

                    <a
                      href={item.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-sm text-cyan-300 underline"
                    >
                      View source
                    </a>
                  </article>
                ))}
              </div>
            )}

            {result.total > 12 && (
              <div className="mt-5 flex items-center justify-center gap-4">
                <button
                  type="button"
                  className="btn-ghost"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                >
                  ← Previous
                </button>

                <span className="text-sm">
                  Page {page} of {pageCount}
                </span>

                <button
                  type="button"
                  className="btn-ghost"
                  disabled={page >= pageCount}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <p className="text-xs text-slate-400">
        Images and descriptions are supplied by NASA's public image library.
        Check the source page for individual image credits and usage details.
      </p>
    </div>
  );
}
