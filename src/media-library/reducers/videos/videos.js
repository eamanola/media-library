import { videos as fetchVideos } from '../../services/videos';
import addDisplayIds from './add-display-ids';
import addMediaInfo from './add-media-info';
import { createTree } from './tree';

const initialState = [];

const reducer = (state, action) => {
  let newState;
  const { payload, type } = action;

  switch (type) {
    case 'MEDIA_LIBS_INIT':
      newState = [...payload];
      break;

    default:
      newState = state || initialState;
  }

  return newState;
};

const USE_MOCK = false;

const getMock = async () => {
  const { default: testNames } = await import('./test-names.json');

  return [{
    mediaLib: 'mocks',
    videos: testNames.map(({ filename }, index) => ({ id: index, path: filename }))
      .filter(({ path }) => /(?:mkv|mp4)$/u.test(path)),
  }];
};

const formatMediaLibs = ({ mediaLib, videos }) => videos
  .map((video) => ({ mediaLib, ...video }));

const getVideos = () => async (dispatch) => {
  const videos = (USE_MOCK ? await getMock() : await fetchVideos())
    .map(formatMediaLibs).flat()
    .map(addMediaInfo)
    .map(addDisplayIds)
    .map(({ id, ...rest }) => ({ ...rest, videoId: id }));

  const mediaLibrary = createTree(videos);

  // console.log(videos);

  await dispatch({ payload: mediaLibrary, type: 'MEDIA_LIBS_INIT' });
};

export { getVideos };

export default reducer;
