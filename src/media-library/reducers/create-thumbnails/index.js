import appConfig from '../../../config';
import { createThumbnails } from '../../services/create-thumbnail';

const { BACKEND_URL } = appConfig;

const reducer = (state, action) => {
  let newState;

  const { payload, type } = action;

  switch (type) {
    case 'SET_THUMBNAILS':
      newState = [
        ...state.filter(
          ({ id }) => !payload.some(({ id: payloadId }) => payloadId === id),
        ),
        ...payload,
      ];
      break;

    default:
      newState = state || [];
  }

  return newState;
};

let lock = false;
const queue = [];
const actionCreateThumbnails = (videos) => async (dispatch, getState) => {
  if (lock) {
    const notInQueue = videos.filter(({ id: videoId }) => !queue.some(({ id }) => id === videoId));
    if (notInQueue.length) {
      queue.push(...notInQueue);
    }
    return;
  }

  lock = true;
  await createThumbnails(videos.map(({ id, path }) => ({ cacheId: id, path })));

  await dispatch({
    payload: videos.map(({ id }) => ({
      id,
      thumbnail: `${BACKEND_URL}/thumbnails/${id}.jpg`,
    })),
    type: 'SET_THUMBNAILS',
  });
  lock = false;

  if (queue.length) {
    const { thumbnails: state } = getState();
    const notInState = queue.filter(({ id: videoId }) => !state.some(({ id }) => id === videoId));
    if (notInState.length) {
      dispatch(actionCreateThumbnails(notInState));
    }
    queue.length = 0;
  }
};

export { actionCreateThumbnails as createThumbnails };

export default reducer;
