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

const seasonTree = (groupedBySeason) => groupedBySeason
  .sort(({ episode: episode1 }, { episode: episode2 }) => (episode1 || 0) - (episode2 || 0))
  .reduce((tree, video) => {
    const { episode, extra } = video;

    if (extra) {
      const EXTRAS_TITLE = 'extras';

      const extras = tree.find(({ title }) => title === EXTRAS_TITLE)
        || { children: [], title: EXTRAS_TITLE };

      return [
        ...tree.filter(({ title }) => title !== EXTRAS_TITLE),
        {
          ...extras,
          children: [
            ...extras.children,
            {
              title: `${extra}${(typeof episode === 'number') ? episode : ''}`,
              video,
            },
          ],
        },
      ];
    }

    if (typeof episode === 'number') {
      return [...tree, { title: `E${episode}`, video }];
    }

    // should be a movie
    if (groupedBySeason.length === 1) {
      return [{ title: video.title, video }];
    }

    // console.warn('experimental: seasonTree. just a folder without season info? ', video);
    return [
      ...tree,
      {
        title: video.path.split('/').pop(),
        video: { ...video, title: video.path.split('/').pop() },
      },
    ];
  }, []);

const titleTree = (groupedByTitle) => groupedByTitle
  .sort((a, b) => (getValue(a, 'season') || 0) - (getValue(b, 'season') || 0))
  .reduce((tree, season) => {
    const seasonKey = getValue(season, 'season');
    const seasonValue = seasonTree(season);

    if (seasonKey) {
      const children = seasonValue;
      const title = `Season ${seasonKey}`;
      return [
        ...tree,
        children.length === 1
          ? { ...children[0], title: `${title} - ${children[0].title}` }
          : { children, title },
      ];
    }

    // console.warn('experimental: titleTree, no season info found', seasonValue);
    return [...tree, ...seasonValue];
  }, []);

const mediaLibTree = (groupedByMediaLib) => groupedByMediaLib
  .sort((a, b) => getValue(a, 'title').localeCompare(getValue(b, 'title')))
  .reduce((tree, title) => {
    const children = titleTree(title);
    const aTitle = getValue(title, 'title');

    return [
      ...tree,
      children.length === 1
        ? {
          ...children[0],
          title: `${aTitle !== children[0].title ? `${aTitle} - ` : ''}${children[0].title}`,
        }
        : { children, title: aTitle },
    ];
  }, []);

const toTree = (grouped) => grouped.reduce((tree, mediaLib) => {
  const children = mediaLibTree(mediaLib);
  const title = getValue(mediaLib, 'mediaLib');

  // always return medialibs as folder
  // return [...tree, children.length === 1 ? children[0] : { children, title }];
  return [...tree, { children, title }];
}, []);

const createTree = (videos) => toTree(group(videos));

export { createTree };

export default null;
