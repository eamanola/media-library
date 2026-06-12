import videos, { actions as videoActions, helpers as videoHelpers } from './videos';
import { play } from './playback';
import played, { getPlayed, togglePlayed } from './played';
import thumbnails, { createThumbnails } from './create-thumbnails';
import probes, { getProbes } from './probes';
import metas, { getMetas } from './metas/metas';

const actions = {
  createThumbnails,
  getMetas,
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
  metas,
  played,
  probes,
  thumbnails,
};

export {
  actions,
  helpers,
};

export default reducers;
