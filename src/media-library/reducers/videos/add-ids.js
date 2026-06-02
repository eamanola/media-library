const getEpisodeStr = (episode, extra, version) => (
  `${extra || 'E'}${episode}${version ? `v${version}` : ''}`
);

const addIds = (video) => {
  const displayId = [];

  const {
    episode, extra, filename, season, title, version, year,
  } = video;

  if (title) { displayId.push(title.replace(/\s/ug, '_')); }
  if (year) { displayId.push(`(${year})`); }
  if (season) { displayId.push(`S${season}`); }
  if (typeof episode === 'number') { displayId.push(getEpisodeStr(episode, extra, version)); }

  if (!season && !episode) {
    // not a recognizeed show
    // case folder, but not a season
    // takes in movies (not show, and not folder), but it is what it is
    displayId.push(filename.replace(/[\s/]/ug, '_'));
  }

  const { id, ...rest } = video;
  const withId = {
    ...rest,
    displayId: displayId.join('_'),
    realId: id,
  };

  // console.log(withId);

  return withId;
};

export default addIds;
