const groupByTitle = (videos) => videos.reduce(
  (acc, { mediaInfo, ...rest }) => {
    const { title } = mediaInfo;
    if (acc[title]) {
      acc[title] = [...acc[title], { mediaInfo, ...rest }];
    } else {
      acc[title] = [{ mediaInfo, ...rest }];
    }
    return acc;
  },
  {},
);

const groupBySeason = (videosByTitle) => {
  const groupedBySeason = {};

  Object.keys(videosByTitle).forEach((title) => {
    groupedBySeason[title] = videosByTitle[title].reduce(
      (acc, { mediaInfo, ...rest }) => {
        const { season } = mediaInfo;

        const key = season ? `Season ${season}` : 'no-season';

        if (acc[key]) {
          acc[key] = [...acc[key], { mediaInfo, ...rest }];
        } else {
          acc[key] = [{ mediaInfo, ...rest }];
        }

        return acc;
      },
      {},
    );
  });

  return groupedBySeason;
};

const groupByExtra = (videosBySeason) => {
  const groupedByExtra = {};

  Object.keys(videosBySeason).forEach((title) => {
    Object.keys(videosBySeason[title]).forEach((season) => {
      if (!groupedByExtra[title]) groupedByExtra[title] = {};

      groupedByExtra[title][season] = {
        ...videosBySeason[title][season].filter(
          ({ mediaInfo }) => !(mediaInfo?.episode || {}).extra,
        ).reduce((acc, { mediaInfo, ...rest }) => {
          const key = mediaInfo.episode ? `Episode ${mediaInfo.episode.episode}` : 'no-episode';

          return { ...acc, [key]: { mediaInfo, ...rest } };
        }, {}),
        [`${season !== 'no-season' ? `${season} ` : ''}extras`]: videosBySeason[title][season].filter(
          ({ mediaInfo }) => !!(mediaInfo?.episode || {}).extra,
        ).reduce((acc, { mediaInfo, ...rest }) => {
          const key = `${mediaInfo.episode.extra} ${mediaInfo.episode.episode}`;
          if (!acc[key]) acc[key] = {};

          return { ...acc, [key]: { mediaInfo, ...rest } };
        }, {}),
      };
    });
  });

  return groupedByExtra;
};

const removeEmptyFolders = (tree) => {
  const temp = { ...tree };

  Object.keys(temp).forEach((key) => {
    if (temp[key].mediaInfo) {
      return;
    }

    if (Object.keys(temp[key]).length === 0) {
      delete temp[key];
    } else {
      temp[key] = { ...removeEmptyFolders(temp[key]) };
      if (Object.keys(temp[key]).length === 0) {
        delete temp[key];
      }
    }
  });

  return temp;
};

const removeNoSeasons = (tree) => {
  let temp = { ...tree };

  Object.keys(temp).forEach((key) => {
    if (key === 'no-season') {
      temp = { ...temp, ...temp[key] };
      delete temp[key];
    } else {
      if (temp[key].mediaInfo) {
        return;
      }

      temp = { ...temp, [key]: removeNoSeasons(temp[key]) };
    }
  });

  return temp;
};

const doRemoveSingleFolders = (title) => {
  const temp = { ...title };

  if (temp.mediaInfo) {
    return temp;
  }

  if (Object.keys(temp).length === 1) {
    return doRemoveSingleFolders(temp[Object.keys(temp)[0]]);
  }

  return temp;
};

const removeOneChoiceClicks = (tree) => {
  const temp = { ...tree };
  Object.keys(temp).forEach((mediaLib) => {
    Object.keys(temp[mediaLib]).forEach((title) => {
      temp[mediaLib][title] = doRemoveSingleFolders(temp[mediaLib][title]);
    });
  });

  return temp;
};

const createTree = (mediaLibs) => {
  const tree = mediaLibs
    .map(({ mediaLib, videos }) => ({
      mediaLib,
      videos: groupByTitle(videos),
    }))
    .map(({ mediaLib, videos }) => ({
      mediaLib,
      videos: groupBySeason(videos),
    }))
    .map(({ mediaLib, videos }) => ({
      mediaLib,
      videos: groupByExtra(videos),
    }))
    .reduce((acc, { mediaLib, videos }) => ({ ...acc, [mediaLib]: videos }), {});

  const noSeasonsRemoved = removeNoSeasons(tree);
  const emptyFoldersRemoved = removeEmptyFolders(noSeasonsRemoved);
  const oneChoiceClicksRemoved = removeOneChoiceClicks(emptyFoldersRemoved);
  return oneChoiceClicksRemoved;
};

export {
  createTree,
};
export default null;
