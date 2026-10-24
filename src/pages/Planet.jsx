import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PlanetArt from '../components/PlanetArt';
import { getBody, fmt, DATA_META } from '../data/planets';
import { searchImages } from '../lib/nasa';

function FactRow({ label, value }) {
  return (
    <>
      <dt className="font-bold text-cyan-300">{label}</dt>
      <dd>{value}</dd>
    </>
  );
}

export default function Planet() {
  const { id } = useParams();
  const body = getBody(id);

  const [image, setImage] = useState({ status: 'loading' });
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    if (!body) return undefined;

    const controller = new AbortController();

    setImage({ status: 'loading' });
    setBroken(false);

    searchImages(body.nasaQuery, {
      pageSize: 5,
      signal: controller.signal,
    })
      .then((result) => {
        setImage(
          result.items[0]
            ? { status: 'ok', item: result.items[0] }
            : { status: 'empty' }
        );
      })
      .catch((error) => {
        if (error.code !== 'cancelled') {
          setImage({ status: 'error', message: error.message });
        }
      });

    return () => controller.abort();
  }, [id]);

  if (!body) {
    return (
      <div className="card">
        <h1 className="text-2xl font-bold">World not found</h1>
        <p className="mt-2">Choose a world from the Solar System explorer.</p>
        <Link to="/explore" className="btn-primary mt-3 inline-block">
          Back to explorer
        </Link>
      </div>
    );
  }

  return (
    <article className="space-y-4">
      <Link to="/explore" className="text-cyan-300 underline">
        ← Back to the explorer
      </Link>

      <header className="flex flex-wrap items-center gap-3">
        <h1 className="text-4xl font-extrabold">{body.name}</h1>
        <span
          className={`rounded-full px-3 py-1 text-sm font-bold ${
            body.dwarf ? 'bg-violet-500' : 'bg-cyan-700'
          }`}
        >
          {body.type}
        </span>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="card">
          <h2 className="mb-3 text-xl font-extrabold">Real space image</h2>

          {image.status === 'loading' && (
            <div
              className="skeleton aspect-video"
              role="status"
              aria-label="Loading NASA image"
            />
          )}

          {image.status === 'ok' && !broken && (
            <figure>
              <img
                src={image.item.thumb}
                alt={image.item.title}
                loading="lazy"
                onError={() => setBroken(true)}
                className="aspect-video w-full rounded-2xl object-cover"
              />

              <figcaption className="mt-2 text-xs text-slate-300">
                {image.item.title}. Credit: {image.item.credit}.{' '}
                <a
                  className="underline"
                  href={image.item.source}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View original on NASA
                </a>
                . This image was selected automatically and may not show the
                entire world.
              </figcaption>
            </figure>
          )}

          {image.status !== 'loading' &&
            !(image.status === 'ok' && !broken) && (
              <div className="text-center">
                <PlanetArt
                  body={body}
                  className="mx-auto h-40 w-40"
                />
                <p className="text-xs text-slate-300">
                  Cartoon illustration, not a photograph.
                  {image.status === 'error'
                    ? ` ${image.message}`
                    : ' A NASA photo could not be loaded right now.'}
                </p>
              </div>
            )}
        </section>

        <section className="card">
          <h2 className="mb-2 text-xl font-extrabold">Meet {body.name}</h2>
          <p className="text-lg">{body.kid}</p>
          <p className="mt-3">
            <strong>Discovery:</strong> {body.discovery}
          </p>
        </section>
      </div>

      <section className="card">
        <h2 className="mb-3 text-xl font-extrabold">Space facts</h2>

        <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-[10rem_1fr]">
          <FactRow label="Diameter" value={`${fmt(body.diameterKm)} km`} />

          <FactRow
            label="Distance from Sun"
            value={
              body.distanceMkm
                ? `${fmt(body.distanceMkm)} million km (average)`
                : body.distance
            }
          />

          <FactRow label="Length of day" value={body.day} />
          <FactRow label="Length of year" value={body.year} />
          <FactRow label="Atmosphere" value={body.atmosphere} />
          <FactRow label="Temperature" value={body.temperature} />
          <FactRow label="Moons" value={body.moons} />
        </dl>

        {body.id !== 'sun' && (
          <p className="mt-3 text-xs text-slate-300">
            Moon counts change as new moons are confirmed.{' '}
            <a
              className="underline"
              href={DATA_META.moonsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Check NASA's latest information
            </a>
          </p>
        )}
      </section>

      <p className="text-xs text-slate-300">
        Facts compiled {DATA_META.compiledOn}. {DATA_META.status}{' '}
        Sources:{' '}
        {DATA_META.sources.map((source, index) => (
          <span key={source.url}>
            {index > 0 && ', '}
            <a
              className="underline"
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {source.label}
            </a>
          </span>
        ))}
        .
      </p>
    </article>
  );
        }
            
