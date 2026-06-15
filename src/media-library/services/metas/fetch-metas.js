import fetchAnilist from './anilist';
import fetchJikan from './jikan';
import storage from './storage';
import logger from '../../../logger';

const DISABLE = false;

const fetchMetas = async (queries) => Promise.all(queries.map(async (query) => {
  let meta = await storage.get(query) || null;

  if (!DISABLE) {
    if (meta === null) {
      logger.log('fetch anilist', query);
      meta = await fetchAnilist(query).catch(() => null);
    }

    if (meta === null) {
      logger.log('fallback to jikan', query);
      meta = await fetchJikan(query).catch(() => null);
    }

    if (meta !== null) {
      await storage.set(query, meta);
    }
  }

  return { meta, query };
}));

export default fetchMetas;
