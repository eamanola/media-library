import videos, { getVideos } from './videos';
import { play } from './playback';
import { togglePlayed } from './played';
import thumbnails, { createThumbnails } from './create-thumbnails';
import probes, { getProbes } from './probes';

const actions = {
  createThumbnails,
  getProbes,
  getVideos,
  play,
  togglePlayed,
};

const reducers = { mediaLibrary: videos, probes, thumbnails };

export {
  actions,
};

export default reducers;
