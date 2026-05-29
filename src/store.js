import { createStore, combineReducers, applyMiddleware } from 'redux';
import { withExtraArgument } from 'redux-thunk';

import logger from './logger';
import { reducer as userReducer } from './users';
import notificationReducer from './reducers/notification';
import { reducers as mediaLibraryReducers } from './media-library';

const reducers = combineReducers({
  logger: (state, action) => {
    logger.log(action);
    return null;
  },
  notification: notificationReducer,
  user: userReducer,
  ...mediaLibraryReducers,
});

const store = createStore(
  reducers,
  undefined, /* INITIAL_STATE */
  applyMiddleware(withExtraArgument()),
);

export default store;
