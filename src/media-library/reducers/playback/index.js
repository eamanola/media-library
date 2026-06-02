import { play as startPlay } from '../../services/playback';

const play = ({ displayId, videoId }) => (/* dispatch */) => startPlay({ displayId, videoId });

export { play };

export default null;
