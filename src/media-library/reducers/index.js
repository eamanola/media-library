import videos, { getVideos } from './videos';
import { play } from './playback';
import { togglePlayed } from './played';
import thumbnails, { createThumbnails } from './create-thumbnails';
import getProbes from './probes';

const actions = {
  createThumbnails,
  getProbes,
  getVideos,
  play,
  togglePlayed,
};

const reducers = { mediaLibrary: videos, thumbnails };

export {
  actions,
};

export default reducers;
