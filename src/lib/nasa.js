
const BASE = 'https://images-api.nasa.gov';
const cache = new Map();

export class NasaError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

const stripTags = (s = '') =>
  s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

function normalize(item) {
  const d = item?.data?.[0];
  const thumb = item?.links?.find((l) => l.render === 'image')?.href;

  if (!d || !thumb || !d.nasa_id) return null;

  return {
    id: d.nasa_id,
    title: d.title || 'Untitled',
    description: stripTags(d.description).slice(0, 280),
    date: d.date_created ? d.date_created.slice(0, 10) : null,
    credit:
      [d.photographer, d.secondary_creator, d.center]
        .filter(Boolean)
        .join(' / ') || 'NASA',
    thumb: thumb.replace(/^http:/, 'https:'),
    source: `https://images.nasa.gov/details/${encodeURIComponent(d.nasa_id)}`,
  };
}

export async function searchImages(
  q,
  { page = 1, pageSize = 12, signal } = {}
) {
  const key = `${q}|${page}|${pageSize}`;

  if (cache.has(key)) return cache.get(key);

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    throw new NasaError('offline', 'You appear to be offline.');
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort('timeout'), 10000);

  signal?.addEventListener(
    'abort',
    () => ctrl.abort('cancelled'),
    { once: true }
  );

  try {
    const params = new URLSearchParams({
      q,
      media_type: 'image',
      page: String(page),
      page_size: String(pageSize),
    });

    const res = await fetch(`${BASE}/search?${params}`, {
      signal: ctrl.signal,
    });

    if (res.status === 429) {
      throw new NasaError(
        'rate',
        'NASA is getting too many requests. Try again in a minute.'
      );
    }

    if (!res.ok) {
      throw new NasaError('http', `NASA returned an error (${res.status}).`);
    }

    const json = await res.json();
    const items = (json.collection?.items ?? [])
      .map(normalize)
      .filter(Boolean);

    const total = json.collection?.metadata?.total_hits ?? items.length;
    const result = { items, total, page, pageSize };

    cache.set(key, result);
    return result;
  } catch (e) {
    if (e instanceof NasaError) throw e;

    if (ctrl.signal.reason === 'cancelled') {
      throw new NasaError('cancelled', 'Cancelled');
    }

    if (ctrl.signal.reason === 'timeout') {
      throw new NasaError('timeout', 'NASA took too long to answer.');
    }

    throw new NasaError(
      'network',
      'Could not reach NASA. Check your connection.'
    );
  } finally {
    clearTimeout(timer);
  }
        }
