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
    const notInQueue = videos.filter(
      ({ videoId: toAddId }) => !queue.some(({ videoId }) => toAddId === videoId),
    );
    if (notInQueue.length) {
      queue.push(...notInQueue);
    }
    return;
  }

  lock = true;
  await createThumbnails(videos.map(({ videoId }) => videoId));

  await dispatch({
    payload: videos.map(({ id, videoId }) => ({
      id,
      thumbnail: `${BACKEND_URL}/thumbnails/${videoId}.jpg`,
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
