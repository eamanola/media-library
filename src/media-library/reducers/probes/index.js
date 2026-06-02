import { probes as fetchProbes } from '../../services/probes';
import logger from '../../../logger';

const reducer = (state, action) => {
  let newState;
  const { payload, type } = action;

  switch (type) {
    case 'SET_PROBES':
      newState = [
        ...state.filter(
          ({ probeId }) => !payload.some(({ probeId: payloadId }) => payloadId === probeId),
        ),
        ...payload,
      ];
      break;

    default:
      newState = state || [];
  }

  return newState;
};

let lock = false;
const queue = [];
const getProbes = (videos) => async (dispatch, getState) => {
  logger.log('getProbes: want', videos);

  if (lock) {
    const notInQueue = videos.filter(
      ({ realId: toAddId }) => !queue.some(({ realId }) => realId === toAddId),
    );
    if (notInQueue.length) {
      queue.push(...notInQueue);
    }
    logger.log('getProbes: queue', notInQueue.length || 'no-op', 'in queue:', queue);
    return;
  }

  lock = true;
  logger.log('getProbes: fetching', videos);
  const probes = await fetchProbes(videos.map(({ realId }) => realId));
  logger.log('getProbes: fetched', videos);

  dispatch({
    payload: probes.map(({ id, ...rest }) => ({
      ...rest,
      probeId: id,
    })),
    type: 'SET_PROBES',
  });
  lock = false;

  if (queue.length) {
    const { probes: state } = getState();
    const notInState = queue.filter(
      ({ realId }) => !state.some(({ probeId }) => probeId === realId),
    );
    logger.log('getProbes: dequeue', notInState.length);
    if (notInState.length) {
      dispatch(getProbes(notInState));
    }
    queue.length = 0;
  }
};

export { getProbes };

export default reducer;
