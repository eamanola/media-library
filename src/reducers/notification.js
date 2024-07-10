const INITIAL_STATE = null;

const reducer = (state, action) => {
  let newState;

  switch (action.type) {
    case 'NOTIFICATION_SET':
      newState = action.message;
      break;

    case 'NOTIFICATION_RM':
      newState = null;
      break;

    default:
      newState = state || INITIAL_STATE;
  }

  return newState;
};

let notificationTimeout = 0;
const clearNotificationTimeout = () => {
  if (notificationTimeout) clearTimeout(notificationTimeout);
  notificationTimeout = 0;
};

const clear = () => (dispatch) => {
  clearNotificationTimeout();

  dispatch({ type: 'NOTIFICATION_RM' });
};

const startNotificationTimeout = (dispatch) => {
  notificationTimeout = setTimeout(() => clear()(dispatch), 5000);
};

const notification = (message) => async (dispatch) => {
  clearNotificationTimeout();

  dispatch({ type: 'NOTIFICATION_SET', message });

  startNotificationTimeout(dispatch);
};

export {
  notification,
};

export default reducer;
