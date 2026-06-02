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
      ({ realId: toAddId }) => !queue.some(({ realId }) => toAddId === realId),
    );
    if (notInQueue.length) {
      queue.push(...notInQueue);
    }
    return;
  }

  lock = true;
  await createThumbnails(videos.map(({ realId }) => realId));

  await dispatch({
    payload: videos.map(({ realId }) => ({
      id: realId,
      thumbnail: `${BACKEND_URL}/thumbnails/${realId}.jpg`,
    })),
    type: 'SET_THUMBNAILS',
  });
  lock = false;

  if (queue.length) {
    const { thumbnails: state } = getState();
    const notInState = queue.filter(({ realId }) => !state.some(({ id }) => id === realId));
    if (notInState.length) {
      dispatch(actionCreateThumbnails(notInState));
    }
    queue.length = 0;
  }
};

export { actionCreateThumbnails as createThumbnails };

export default reducer;
