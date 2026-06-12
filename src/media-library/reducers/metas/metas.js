import { metas as fetchMetas } from '../../services/metas';
import logger from '../../../logger';

const reducer = (state, action) => {
  let newState;
  const { payload, type } = action;

  switch (type) {
    case 'SET_METAS':
      newState = [
        ...state.filter(
          ({ query }) => !payload.some(({ query: payloadId }) => payloadId === query),
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
const getMetas = (folders) => async (dispatch, getState) => {
  logger.log('getMetas: want', folders);

  if (lock) {
    const notInQueue = folders.filter(
      ({ title }) => !queue.some(({ title: aTitle }) => aTitle === title),
    );
    if (notInQueue.length) {
      queue.push(...notInQueue);
    }
    logger.log('getMetas: queue', notInQueue.length || 'no-op', 'in queue:', queue);
    return;
  }

  lock = true;
  logger.log('getMetas: fetching', folders);
  const metas = await fetchMetas(folders.map(({ title }) => title));
  logger.log('getMetas: fetched', folders);

  dispatch({
    payload: metas.map(({ q, ...rest }) => ({
      ...rest,
      query: q,
    })),
    type: 'SET_METAS',
  });
  lock = false;

  if (queue.length) {
    const { metas: state } = getState();
    const notInState = queue.filter(
      ({ title }) => !state.some(({ query }) => query === title),
    );
    logger.log('getMetas: dequeue', notInState.length);
    if (notInState.length) {
      dispatch(getMetas(notInState));
    }
    queue.length = 0;
  }
};

export { getMetas };

export default reducer;
