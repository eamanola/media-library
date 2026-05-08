const isFolder = (item) => !item.id;

const isPlayed = (video) => video.played?.isPlayed === true;

const countUnplayed = (subFolder) => Object.keys(subFolder).reduce(
  (unplayed, key) => {
    if (!isFolder(subFolder[key])) {
      return unplayed + (isPlayed(subFolder[key]) ? 0 : 1);
    }

    return unplayed + countUnplayed(subFolder[key]);
  },
  0,
);

const unPlayedCount = (folder) => Object.keys(folder).reduce(
  (items, key) => {
    if (isFolder(folder[key])) {
      const unplayed = countUnplayed(folder[key]);
      return { ...items, [key]: { title: key, unplayed } };
    }

    return { ...items, [key]: folder[key] };
  },
  {},
);

export default unPlayedCount;
