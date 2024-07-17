import { play as startPlay } from '../../services/playback';

const play = ({ id, path }) => (/* dispatch */) => startPlay({ id, path });

export { play };

export default null;
