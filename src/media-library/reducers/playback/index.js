import { play as startPlay } from '../../services/playback';

const play = ({ id, realId }) => (/* dispatch */) => startPlay({ id, realId });

export { play };

export default null;
