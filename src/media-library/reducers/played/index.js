import { createPlayed, played as fetchPlayed, updatePlayed } from '../../services/played';

const togglePlayed = ({ id, played: current }) => async (dispatch) => {
  const { played } = await (
    current
      ? updatePlayed({ ...current, isPlayed: !current.isPlayed })
      : createPlayed(id, true)
  );

  dispatch({
    payload: [played],
    type: 'MEDIA_LIBS_SET_PLAYED',
  });
};

const getPlayed = (/* videos */) => async (dispatch) => {
  const { playedList } = await fetchPlayed();

  dispatch({
    payload: playedList,
    type: 'MEDIA_LIBS_SET_PLAYED',
  });
};

export { getPlayed, togglePlayed };

export default null;
