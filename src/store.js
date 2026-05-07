import { createStore, combineReducers, applyMiddleware } from 'redux';
import { withExtraArgument } from 'redux-thunk';

import { reducer as userReducer } from './users';
import notificationReducer from './reducers/notification';
import { reducers as mediaLibraryReducers } from './media-library';

const reducers = combineReducers({
  mediaLibrary: mediaLibraryReducers,
  notification: notificationReducer,
  user: userReducer,
});

const store = createStore(
  reducers,
  undefined, /* INITIAL_STATE */
  applyMiddleware(withExtraArgument()),
);

export default store;
