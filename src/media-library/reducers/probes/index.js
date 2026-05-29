import { probes as fetchProbes } from '../../services/probes';

const reducer = (state, action) => {
  let newState;
  const { payload, type } = action;

  switch (type) {
    case 'SET_PROBES':
      newState = [
        ...state.filter(
          ({ path }) => !payload.find(({ path: payloadPath }) => payloadPath === path),
        ),
        ...payload,
      ];
      break;

    default:
      newState = state || [];
  }

  return newState;
};

const getProbes = (videos) => async (dispatch) => {
  const probes = await fetchProbes(videos.map(({ path }) => path));

  dispatch({
    payload: probes,
    type: 'SET_PROBES',
  });
};

export { getProbes };

export default reducer;
