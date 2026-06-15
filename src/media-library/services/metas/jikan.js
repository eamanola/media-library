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

export default fetchJikan;
