const DISABLE = false;

// https://studio.apollographql.com/sandbox/explorer?endpoint=https://graphql.anilist.co
// https://developers.cloudflare.com/analytics/graphql-api/getting-started/execute-graphql-query/
const anilistQuery = `
query Query($search: String) {
  Media (search: $search) {
    coverImage {
      large
    }
    title {
      english
    }
    idMal
  }
}`.trim();

const fetchAnilist = async (query) => {
  const response = await fetch(
    'https://graphql.anilist.co',
    {
      body: JSON.stringify({
        query: anilistQuery,
        variables: { search: query },
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    },
  );

  const json = await response.json();
  const { errors, data } = json;

  if (errors) {
    throw errors[0];
  }

  const { coverImage, idMal: malId, title } = data.Media;
  return {
    image: coverImage.large,
    malId,
    title,
  };
};

// https://docs.api.jikan.moe/#/anime/getanimesearch
const fetchJikan = async (query) => {
  const response = await fetch(
    `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`,
  );

  const json = await response.json();

  const { mal_id: malId, images, title } = json.data[0];
  // console.log('jikan', query, malId, images.webp.image_url, title);

  return {
    image: images.webp.image_url,
    malId,
    title,
  };
};

const fetchMetas = async (queries) => Promise.all(queries.map(async (query) => {
  let meta = null;

  if (!DISABLE) {
    meta = await fetchAnilist(query).catch(() => null);

    if (meta === null) {
      console.info('fallback to jikan', query);
      meta = await fetchJikan(query).catch(() => null);
    }
  }

  return { meta, query };
}));

export {
  fetchMetas,
};

export default null;
