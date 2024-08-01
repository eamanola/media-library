import config from '../../../../config';

const mediaSrc = (type, filepath, streamIndex, transcode) => [
  config.BACKEND_URL,
  `/${type}`,
  `/${encodeURIComponent(filepath)}`,
  `/${streamIndex}`,
  transcode ? '/transcode' : '',
]
  .filter((element) => element !== '')
  .join('');

const fontSrc = (path, filename) => (
  `${config.BACKEND_URL}/fonts/${encodeURIComponent(path)}/${filename}`
);

export { fontSrc };

export default mediaSrc;
