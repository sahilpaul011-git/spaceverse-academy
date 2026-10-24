import { DATA_META } from '../data/planets';

const resources = [
  {
    title: 'NASA Solar System Exploration',
    description: 'Learn about the Sun, planets, moons, and other Solar System objects.',
    url: 'https://science.nasa.gov/solar-system/',
  },
  {
    title: 'NASA Planetary Fact Sheets',
    description: 'Reference data for planetary sizes, distances, rotations, and orbits.',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/',
  },
  {
    title: 'NASA Images and Video Library',
    description: 'Search for space images and open individual source pages for credits and usage information.',
    url: 'https://images.nasa.gov/',
  },
  {
    title: 'International Astronomical Union — Pluto',
    description: 'Learn about Pluto and the classification of dwarf planets.',
    url: 'https://www.iau.org/public/themes/pluto/',
  },
];

export default function Credits() {
  return (
    <div className="space-y-5">
      <header>
        <p className="font-bold uppercase tracking-widest text-cyan-300">
          Explore responsibly
        </p>

        <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">
          Sources & Credits
        </h1>

        <p className="mt-3 max-w-2xl text-slate-300">
          SpaceVerse Academy is designed to make space science fun and
          understandable for young learners. These resources help families
          explore the science behind the lessons.
        </p>
      </header>

      <section className="card">
        <h2 className="mb-3 text-xl font-extrabold">
          Our science references
        </h2>

        <ul className="space-y-4">
          {resources.map((resource) => (
            <li
              key={resource.url}
              className="border-b border-white/10 pb-4 last:border-0 last:pb-0"
            >
              <h3 className="font-bold">{resource.title}</h3>

              <p className="my-1 text-sm text-slate-300">
                {resource.description}
              </p>

              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="break-words text-sm text-cyan-300 underline"
              >
                Visit source ↗
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2 className="mb-2 text-xl font-extrabold">
          About our planet data
        </h2>

        <p className="text-slate-300">
          Our current planet facts are compiled by hand from reference
          materials. They are educational summaries, not a live scientific
          database, and should be independently checked before public launch.
        </p>

        <p className="mt-3 text-sm text-slate-300">
          Data compilation date: {DATA_META.compiledOn}
        </p>

        <p className="mt-2 text-sm text-slate-300">
          Moon counts and scientific measurements may change as new
          observations become available.
        </p>
      </section>

      <section className="card">
        <h2 className="mb-2 text-xl font-extrabold">
          Image credits and usage
        </h2>

        <p className="text-slate-300">
          Images retrieved from NASA's public image library may have
          different credits, rights, or usage conditions. Please check each
          image's original source page before reusing it, especially for
          commercial purposes. Do not assume every image is automatically
          free of restrictions.
        </p>

        <a
          href="https://images.nasa.gov/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-cyan-300 underline"
        >
          Explore NASA's image library ↗
        </a>
      </section>

      <p className="text-xs text-slate-400">
        SpaceVerse Academy is an independent educational project and is not
        affiliated with or endorsed by NASA or the International
        Astronomical Union.
      </p>
    </div>
  );
        }
