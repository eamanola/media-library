import {
  createPlayed,
  played as fetchPlayed,
  updatePlayed,
} from '../../services/played';

const reducer = (state, action) => {
  let newState;
  const { payload, type } = action;

  switch (type) {
    case 'INIT_PLAYED':
      newState = [...payload];
      console.log(action);
      break;

    case 'SET_PLAYED':
      newState = [...state.filter(({ mediaId }) => mediaId !== payload.mediaId), { ...payload }];
      console.log(action);
      break;

    default:
      newState = state || [];
  }

  return newState;
};

const togglePlayed = ({ id: mediaId }, current) => async (dispatch) => {
  // TODO: get rid or current param, kinda uglt & error prone
  const { played } = await (current
    ? updatePlayed({ ...current, isPlayed: !current.isPlayed })
    : createPlayed(mediaId, true)
  );

  dispatch({ payload: played, type: 'SET_PLAYED' });
};

const getPlayed = (/* videos */) => async (dispatch) => {
  const { playedList } = await fetchPlayed();

  dispatch({ payload: playedList, type: 'INIT_PLAYED' });
};

export { getPlayed, togglePlayed };

export default reducer;
