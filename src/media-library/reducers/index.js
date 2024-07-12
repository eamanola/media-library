import videos, { getVideos } from './videos';
import { play } from './playback';
import { togglePlayed } from './played';

const actions = { getVideos, play, togglePlayed };
const reducers = videos;

export {
  actions,
};

export default reducers;
