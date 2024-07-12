const groupBy = (videos, key) => videos.reduce((acc, video) => {
  const group = acc.find((aGroup) => aGroup.some((item) => item[key] === video[key]));
  if (group) {
    group.push(video);
  } else {
    acc.push([video]);
  }

  return acc;
}, []);

const group = (videos) => groupBy(videos, 'mediaLib')
  .map(
    (aMediaLib) => groupBy(aMediaLib, 'title').map(
      (aTitle) => groupBy(aTitle, 'season'),
    ),
  );

const getValue = (item, key) => {
  if (Array.isArray(item)) {
    return getValue(item[0], key);
  }

  return item[key];
};

const seasonTree = (groupedBySeason) => groupedBySeason.reduce((tree, video) => {
  const { episode, extra } = video;

  if (extra) {
    return { ...tree, extras: { ...(tree.extras || {}), [`${extra}${episode || ''}`]: video } };
  }

  if (episode) {
    return { ...tree, [`E${episode}`]: video };
  }

  // should be a movie
  if (groupedBySeason.length === 1) {
    return video;
  }

  console.warn('shouldn reach', video);
  return tree;
}, {});

const titleTree = (groupedByTitle) => {
  if (groupedByTitle.length === 1) {
    // one item season folder, skip
    const [season] = groupedByTitle;
    return seasonTree(season);
  }

  return groupedByTitle.reduce((tree, season) => {
    const seasonKey = getValue(season, 'season');
    const seasonValue = seasonTree(season);

    if (seasonKey) {
      return { ...tree, [`Season ${seasonKey}`]: seasonValue };
    }
    // items with no season info
    // Sayonara Zetsubou Sensei Extra
    return { ...tree, ...seasonValue };
  }, {});
};

const mediaLibTree = (groupedByMediaLib) => groupedByMediaLib.reduce((tree, title) => ({
  ...tree, [getValue(title, 'title')]: titleTree(title),
}), {});

const toTree = (grouped) => grouped.reduce((tree, mediaLib) => ({
  ...tree, [getValue(mediaLib, 'mediaLib')]: mediaLibTree(mediaLib),
}), {});

const createTree = (videos) => toTree(group(videos));

export { createTree };
export default null;
