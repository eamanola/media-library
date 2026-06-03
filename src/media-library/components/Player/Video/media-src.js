import config from '../../../../config';

const mediaSrc = (type, id, streamIndex, transcode) => [
  config.BACKEND_URL,
  `/${type}`,
  `/${id}`,
  `/${streamIndex}`,
  transcode ? '/transcode' : '',
]
  .filter((element) => element !== '')
  .join('');

const fontSrc = (id, filename) => (
  `${config.BACKEND_URL}/stream/${id}/fonts/${filename}`
);

export { fontSrc };

export default mediaSrc;
