import reducer, {
  fromLocalStorage,
  login,
  logout,
  setEmailVerified,
} from './reducers/user';
import router from './router.jsx';

const actions = {
  fromLocalStorage,
  login,
  logout,
  setEmailVerified,
};

export {
  actions,
  reducer,
  router,
};

export default null;
