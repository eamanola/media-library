const compareEpisode = (episode1, episode2) => {
  if (!episode1 && !episode2) return true;
  if (episode1 && !episode2) return false;
  if (!episode1 && episode2) return false;

  const {
    episode: e1,
    isWildGuess: w1,
    extra: ex1,
    version: v1,
  } = episode1;

  const {
    episode: e2,
    isWildGuess: w2,
    extra: ex2,
    version: v2,
  } = episode2;

  return e1 === e2 && w1 === w2 && ex1 === ex2 && v1 === v2;
};

const compareMediaInfo = (mediaInfo1, mediaInfo2) => {
  if (!mediaInfo1 && !mediaInfo2) return true;
  if (mediaInfo1 && !mediaInfo2) return false;
  if (!mediaInfo1 && mediaInfo2) return false;

  const {
    title: t1,
    season: s1,
    year: y1,
    episode: e1,
  } = mediaInfo1;

  const {
    title: t2,
    season: s2,
    year: y2,
    episode: e2,
  } = mediaInfo2;

  return t1 === t2 && s1 === s2 && y1 === y2 && compareEpisode(e1, e2);
};

export { compareMediaInfo };

export default null;
