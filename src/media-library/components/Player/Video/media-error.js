let retryAttempts = 0;
const MAX_RETRIES = 5;
let retryTimeout = 0;
const onNetworkError = (target) => {
  if (retryAttempts >= MAX_RETRIES) {
    console.log('too many retries', retryAttempts);
    return;
  }

  if (retryAttempts !== 0) {
    console.log('busy', retryTimeout);
    return;
  }

  const { currentTime } = target;

  // TODO: better way to do this?
  retryTimeout = setTimeout(() => {
    // eslint-disable-next-line no-param-reassign
    target.currentTime = Math.max(currentTime - 5, 0);
    target.play();
    retryTimeout = 0;
  }, Math.min(1000 * retryAttempts, 3000));

  target.load();

  retryAttempts += 1;
  console.log('reloading', 'attempts:', retryAttempts);
};

const onMediaError = (mediaEl) => {
  let transcode;

  // https://developer.mozilla.org/en-US/docs/Web/API/MediaError/code
  const MEDIA_ERR_NETWORK = 2;
  const MEDIA_ERR_SRC_NOT_SUPPORTED = 4;

  const { code } = mediaEl.error || {};
  switch (code) {
    case MEDIA_ERR_NETWORK:
      transcode = false;

      onNetworkError(mediaEl);
      break;

    case MEDIA_ERR_SRC_NOT_SUPPORTED:
      transcode = true;

      break;

    default:
      transcode = false;

      console.error(mediaEl.error);
      break;
  }

  return { transcode };
};

export default onMediaError;
