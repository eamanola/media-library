const getEpisodeStr = (episode, extra, version) => (
  `${extra || 'E'}${episode}${version ? `v${version}` : ''}`
);

const filename = (path) => path.split('/').pop();

const addIds = (video) => {
  const id = [];

  const {
    episode, extra, season, title, version, year, path,
  } = video;

  if (title) { id.push(title.replace(/\s/ug, '_')); }
  if (year) { id.push(`(${year})`); }
  if (season) { id.push(`S${season}`); }
  if (typeof episode === 'number') { id.push(getEpisodeStr(episode, extra, version)); }

  if (!season && !episode) {
    // not a recognizeed show
    // case folder, but not a season
    // takes in movies (not show, and not folder), but it is what it is
    id.push(filename(path).replace(/[\s/]/ug, '_'));
  }

  const withId = { ...video, id: id.join('_') };

  // console.log(withId);

  return withId;
};

export default addIds;
