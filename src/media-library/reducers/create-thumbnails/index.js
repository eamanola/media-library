import appConfig from '../../../config';

import { createThumbnails } from '../../services/create-thumbnail';

const { BACKEND_URL } = appConfig;

export default (videos) => async (dispatch) => {
  const list = videos.map(({ path, id }) => ({ path, cacheId: id }));

  await createThumbnails(list);

  dispatch({
    type: 'MEDIA_LIBS_SET_THUMBNAILS',
    payload: videos.map(({ id }) => ({
      id,
      thumbnail: `${BACKEND_URL}/thumbnails/${id}.jpg`,
    })),
  });
};
