import { videos as fetchVideos } from '../../services/videos';
import parseMediaInfo from './parse-media-info';
import { getPlayed } from '../played';
import testName from './test-names.json';
import addIds from './add-ids';

const initialState = [];

const reducer = (state, action) => {
  let newState;
  const { payload, type } = action;

  switch (type) {
    case 'MEDIA_LIBS_INIT':
      newState = [...payload];
      break;

    case 'MEDIA_LIBS_SET_PLAYED':
      newState = state.map(({ id, played, ...rest }) => ({
        id,
        ...rest,
        played: payload.find(({ mediaId }) => id === mediaId) || played,
      }));
      break;

    case 'MEDIA_LIBS_SET_PROBES':
      newState = state.map(({ path, probe, ...rest }) => ({
        path,
        ...rest,
        probe: (payload.find(({ path: dPath }) => path === dPath)?.probe || probe),
      }));
      break;

    case 'MEDIA_LIBS_SET_THUMBNAILS':
      newState = state.map(({ id, thumbnail, ...rest }) => ({
        id,
        ...rest,
        thumbnail: payload.find(({ id: aId }) => id === aId)?.thumbnail || thumbnail || null,
      }));
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
  .map((path) => ({ mediaLib, path }));

const getVideos = () => async (dispatch) => {
  if (USE_MOCK) {
    dispatch({
      payload: (getMock().map(formatMediaLibs).flat())
        .map(parseMediaInfo)
        .map(addIds),
      type: 'MEDIA_LIBS_INIT',
    });
    return;
  }

  const videos = (await fetchVideos())
    .map(formatMediaLibs).flat()
    .map(parseMediaInfo)
    .map(addIds);

  await dispatch({ payload: videos, type: 'MEDIA_LIBS_INIT' });

  dispatch(getPlayed(videos));
};

export { getVideos };

export default reducer;
