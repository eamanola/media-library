import { createThumbnails as doCreateThumbnails } from './services';

const createThumbnails = (withMediaInfo) => {
  const list = withMediaInfo
    .map(({ videos }) => videos.map(({ path, id }) => ({ path, cacheId: id }))).flat();

  doCreateThumbnails(list);
};

export default createThumbnails;
