import reducer, { getVideos } from './videos';
import { folderByDisplayId } from './videos-helpers';

const actions = {
  getVideos,
};

const helpers = {
  folderByDisplayId,
};

export {
  actions,
  helpers,
};

export default reducer;
