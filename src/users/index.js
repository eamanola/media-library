import reducer, {
  login,
  logout,
  fromLocalStorage,
  setEmailVerified,
} from './reducers/user';
import router from './router';

const actions = {
  login,
  logout,
  fromLocalStorage,
  setEmailVerified,
};

export {
  actions,
  reducer,
  router,
};

export default null;
