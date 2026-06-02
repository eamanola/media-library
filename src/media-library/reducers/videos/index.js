import { videos as fetchVideos } from '../../services/videos';
import testName from './test-names.json';
import addIds from './add-ids';
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

const getMock = () => [
  {
    mediaLib: 'mocks',
    videos: testName.map(({ filename }) => filename)
      .filter((filename) => /(?:mkv|mp4)$/u.test(filename)),
  },
];

const formatMediaLibs = ({ mediaLib, videos }) => videos
  .map((video) => ({ mediaLib, ...video }));

const getVideos = () => async (dispatch) => {
  const videos = (USE_MOCK ? getMock() : await fetchVideos())
    .map(formatMediaLibs).flat()
    .map(addIds);

  const mediaLibrary = createTree(videos);

  await dispatch({ payload: mediaLibrary, type: 'MEDIA_LIBS_INIT' });
};

export { getVideos };

export default reducer;
