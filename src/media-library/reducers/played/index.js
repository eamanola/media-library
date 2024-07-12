import { createPlayed, updatePlayed, played as fetchPlayed } from '../../services/played';

const togglePlayed = ({ played: current, id }) => async (dispatch) => {
  const { played } = await (
    current
      ? updatePlayed({ ...current, isPlayed: !current.isPlayed })
      : createPlayed(id, true)
  );

  dispatch({ type: 'MEDIA_LIBS_SET_PLAYED', payload: [played] });
};

const getPlayed = (/* videos */) => async (dispatch) => {
  const { playedList } = await fetchPlayed();

  dispatch({ type: 'MEDIA_LIBS_SET_PLAYED', payload: playedList });
};

export { getPlayed, togglePlayed };

export default null;
