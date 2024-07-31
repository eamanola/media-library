import { videos as fetchVideos } from '../../services/videos';
import parseMediaInfo from './parse-media-info';
import { getPlayed } from '../played';
import getProbes from '../probes/get-probes';

import testName from './test-names.json';
import addIds from './add-ids';

const initialState = [];

const reducer = (state, action) => {
  let newState;
  const { type, payload } = action;

  switch (type) {
    case 'MEDIA_LIBS_INIT':
      newState = [...payload];
      break;

    case 'MEDIA_LIBS_SET_PLAYED':
      newState = state.map(({ id, played, ...video }) => ({
        id,
        ...video,
        played: payload.find(({ mediaId }) => id === mediaId) || played,
      }));
      break;

    case 'MEDIA_LIBS_SET_PROBES':
      newState = state.map(({ path, probe, ...video }) => ({
        path,
        ...video,
        probe: (payload.find(({ path: dPath }) => path === dPath).probe || null),
      }));
      break;

    case 'MEDIA_LIBS_SET_THUMBNAILS':
      newState = state.map(({ id, thumbnail, ...rest }) => ({
        id,
        ...rest,
        thumbnail: payload.some((videoId) => id === videoId) || thumbnail,
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
      type: 'MEDIA_LIBS_INIT',
      payload: (getMock().map(formatMediaLibs).flat())
        .map(parseMediaInfo)
        .map(addIds),
    });
    return;
  }

  const videos = (await fetchVideos())
    .map(formatMediaLibs).flat()
    .map(parseMediaInfo)
    .map(addIds);

  await dispatch({ type: 'MEDIA_LIBS_INIT', payload: videos });

  dispatch(getPlayed(videos));

  dispatch(getProbes(videos));
};

export { getVideos };

export default reducer;
