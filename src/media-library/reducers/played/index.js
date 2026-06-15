import {
  createPlayed,
  fetchPlayed,
  updateOnePlayed,
  updatePlayed,
} from '../../services/played';

const reducer = (state, action) => {
  let newState;
  const { payload, type } = action;

  switch (type) {
    case 'INIT_PLAYED':
      newState = [...payload];
      break;

    case 'SET_PLAYED':
      newState = [
        ...state.filter(
          ({ mediaId }) => !payload.some(({ mediaId: payloadId }) => mediaId === payloadId),
        ),
        ...payload,
      ];
      break;

    default:
      newState = state || [];
  }

  return newState;
};

const togglePlayed = (videos) => async (dispatch, getState) => {
  const { played } = getState();

  let payload = [];

  // have state
  const updates = played.filter(({ mediaId }) => videos
    .some(({ displayId }) => displayId === mediaId));

  if (updates.length === 1) {
    const { played: response } = await updateOnePlayed({
      ...updates[0],
      isPlayed: !updates[0].isPlayed,
    });

    payload = [...payload, response];
  } else if (updates.length > 1) {
    const { playedList: response } = await updatePlayed(updates.map((update) => ({
      ...update,
      // make all toggle to same state
      isPlayed: !updates[0].isPlayed,
    })));

    payload = [...payload, ...response];
  }

  // new items
  const creates = videos
    .filter(({ displayId }) => !played.some(({ mediaId }) => mediaId === displayId));
  const responses = (await Promise.all(
    creates.map(({ displayId }) => createPlayed(displayId, true)),
  )).map(({ played: response }) => response);
  payload = [...payload, ...responses];

  dispatch({ payload, type: 'SET_PLAYED' });
};

const getPlayed = (/* videos */) => async (dispatch) => {
  const { playedList } = await fetchPlayed();

  dispatch({ payload: playedList, type: 'INIT_PLAYED' });
};

export { getPlayed, togglePlayed };

export default reducer;
