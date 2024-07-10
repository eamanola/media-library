import { durations as fetchDurations } from './services';

const getDurations = async (mediaLibs) => {
  const durations = await fetchDurations();
  return mediaLibs.map(({ videos, ...mediaLib }) => ({
    ...mediaLib,
    videos: videos.map(({ path, ...video }) => ({
      ...video,
      path,
      duration: durations.find(({ path: dPath }) => path === dPath).duration || 0,
    })),
  }));
};

export default getDurations;
