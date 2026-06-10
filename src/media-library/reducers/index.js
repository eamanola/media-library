import videos, { actions as videoActions, helpers as videoHelpers } from './videos';
import { play } from './playback';
import played, { getPlayed, togglePlayed } from './played';
import thumbnails, { createThumbnails } from './create-thumbnails';
import probes, { getProbes } from './probes';

const actions = {
  createThumbnails,
  getPlayed,
  getProbes,
  play,
  togglePlayed,
  ...videoActions,
};

const helpers = {
  ...videoHelpers,
};

const reducers = {
  mediaLibrary: videos,
  played,
  probes,
  thumbnails,
};

export {
  actions,
  helpers,
};

export default reducers;
