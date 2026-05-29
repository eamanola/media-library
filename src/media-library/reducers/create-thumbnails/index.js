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
          ({ id }) => !payload.find(({ id: payloadId }) => payloadId === id),
        ),
        ...payload,
      ];
      break;

    default:
      newState = state || [];
  }

  return newState;
};

const actionCreateThumbnails = (videos) => async (dispatch) => {
  const list = videos.map(({ id, path }) => ({ cacheId: id, path }));

  await createThumbnails(list);

  await dispatch({
    payload: videos.map(({ id }) => ({
      id,
      thumbnail: `${BACKEND_URL}/thumbnails/${id}.jpg`,
    })),
    type: 'SET_THUMBNAILS',
  });
};

export { actionCreateThumbnails as createThumbnails };

export default reducer;
