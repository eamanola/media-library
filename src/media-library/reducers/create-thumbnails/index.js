import { createThumbnails } from '../../services/create-thumbnail';

export default async (videos) => {
  const list = videos.map(({ path, id }) => ({ path, cacheId: id }));

  return createThumbnails(list);
};
