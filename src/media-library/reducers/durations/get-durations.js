import { durations as fetchDurations } from '../../services/durations';

const getDurations = (/* videos */) => async (dispatch) => {
  const durations = await fetchDurations();

  dispatch({ type: 'MEDIA_LIBS_SET_DURATIONS', payload: durations });
};

export default getDurations;
