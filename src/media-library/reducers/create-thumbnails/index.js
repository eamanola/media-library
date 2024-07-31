import { createThumbnails } from '../../services/create-thumbnail';

export default (videos) => async (dispatch) => {
  const list = videos.map(({ path, id }) => ({ path, cacheId: id }));

  await createThumbnails(list);

  dispatch({ type: 'MEDIA_LIBS_SET_THUMBNAILS', payload: videos.map(({ id }) => id) });
};
