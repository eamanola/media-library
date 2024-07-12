import { play as startPlay } from '../../services/playback';

const play = ({ path }) => (/* dispatch */) => startPlay(path);

export { play };

export default null;
