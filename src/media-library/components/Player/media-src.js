import config from '../../../config';

const mediaSrc = (type, filepath, streamIndex, transcode) => [
  config.BACKEND_URL,
  `/${type}`,
  `/${encodeURIComponent(filepath)}`,
  `/${streamIndex}`,
  transcode ? '/transcode' : '',
]
  .filter((element) => element !== '')
  .join('');

export default mediaSrc;
