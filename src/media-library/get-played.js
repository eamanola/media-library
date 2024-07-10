import { played as fetchPlayed } from './services';

const getPlayed = async (mediaLibs) => {
  const { playedList } = await fetchPlayed();

  return mediaLibs.map(({ videos, ...mediaLib }) => ({
    ...mediaLib,
    videos: videos.map(({ id, ...video }) => ({
      id,
      ...video,
      played: playedList.find(({ mediaId }) => id === mediaId),
    })),
  }));
};

export default getPlayed;
