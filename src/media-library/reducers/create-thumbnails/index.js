import appConfig from '../../../config';
import { createThumbnails } from '../../services/create-thumbnail';

const { BACKEND_URL } = appConfig;

export default (videos) => async (dispatch) => {
  const list = videos.map(({ id, path }) => ({ cacheId: id, path }));

  await createThumbnails(list);

  dispatch({
    payload: videos.map(({ id }) => ({
      id,
      thumbnail: `${BACKEND_URL}/thumbnails/${id}.jpg`,
    })),
    type: 'MEDIA_LIBS_SET_THUMBNAILS',
  });
};
