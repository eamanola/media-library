import config from '../../../../config';

const mediaSrc = (type, id, streamIndex, transcode) => [
  config.BACKEND_STREAM_URL,
  transcode ? '/transcode' : '',
  `/${id}`,
  `/${type}`,
  `/${streamIndex}`,
]
  .filter((element) => element !== '')
  .join('');

const fontSrc = (id, filename) => (
  `${config.BACKEND_STREAM_URL}/${id}/fonts/${filename}`
);

export { fontSrc };

export default mediaSrc;
