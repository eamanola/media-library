import {
  videos as fetchVideos,
  play as startPlay,
  createPlayed,
  updatePlayed,
} from './services';
import getMediaInfo from './get-media-info';
import getPlayed from './get-played';
import getDurations from './get-durations';
import createThumbnails from './create-thumbnails';

import testName from './test-names.json';

const initialState = [];

const reducer = (state, action) => {
  let newState;
  const { type, payload } = action;

  switch (type) {
    case 'MEDIA_LIBS_INIT':
      newState = [...payload];
      break;

    case 'MEDIA_LIBS_SET_PLAYED':
      newState = state.map(({ videos, ...mediaLib }) => ({
        ...mediaLib,
        videos: videos.map(({ id, played, ...video }) => ({
          id,
          ...video,
          played: (id === payload.mediaId) ? { ...payload } : played,
        })),
      }));
      break;

    default:
      newState = state || initialState;
  }

  return newState;
};

const USE_MOCK = false;

const getMock = () => [
  { mediaLib: 'mocks', videos: testName.map(({ filename }) => filename) },
];

const getVideos = () => async (dispatch) => {
  if (USE_MOCK) {
    dispatch({ type: 'MEDIA_LIBS_INIT', payload: getMediaInfo(getMock()) });
    return;
  }

  const mediaLibs = await fetchVideos();
  const withMediaInfo = getMediaInfo(mediaLibs);
  const withDurations = await getDurations(withMediaInfo);
  const withPlayed = await getPlayed(withDurations);

  createThumbnails(withMediaInfo);

  dispatch({ type: 'MEDIA_LIBS_INIT', payload: withPlayed });
};

const play = ({ path }) => () => startPlay(path);

const togglePlayed = ({ played: current, id }) => async (dispatch) => {
  const { played } = await (
    current
      ? updatePlayed({ ...current, isPlayed: !current.isPlayed })
      : createPlayed(id, true)
  );

  dispatch({ type: 'MEDIA_LIBS_SET_PLAYED', payload: played });
};

export { getVideos, play, togglePlayed };

export default reducer;
