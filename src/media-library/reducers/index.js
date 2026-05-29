import videos, { getVideos } from './videos';
import { play } from './playback';
import played, { getPlayed, togglePlayed } from './played';
import thumbnails, { createThumbnails } from './create-thumbnails';
import probes, { getProbes } from './probes';

const actions = {
  createThumbnails,
  getPlayed,
  getProbes,
  getVideos,
  play,
  togglePlayed,
};

const reducers = {
  mediaLibrary: videos,
  played,
  probes,
  thumbnails,
};

export {
  actions,
};

export default reducers;
