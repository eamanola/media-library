import { videos as fetchVideos } from '../../services/videos';
import parseMediaInfo from './parse-media-info';
import { getPlayed } from '../played';
import getDurations from '../durations/get-durations';
import createThumbnails from '../create-thumbnails';

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

    case 'MEDIA_LIBS_SET_DURATIONS':
      newState = state.map(({ path, duration, ...video }) => ({
        path,
        ...video,
        duration: (payload.find(({ path: dPath }) => path === dPath).duration || 0),
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

  dispatch(getDurations(videos));

  createThumbnails(videos);
};

export { getVideos };

export default reducer;
