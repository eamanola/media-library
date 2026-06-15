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

export default fetchAnilist;
