import services from '../services/email-verification';
import { setEmailVerified } from '../../users/reducers/user';

const reducer = () => null;

const REQUEST_STATES = {
  REQUESTED: 'REQUESTED',
  ALREADY_VERIFIED: 'ALREADY_VERIFIED',
};

const request = (email) => async (dispatch) => {
  try {
    await services.request(email);
    return REQUEST_STATES.REQUESTED;
  } catch (err) {
    if (err.message === 'User email is verified') {
      dispatch(setEmailVerified());
      return REQUEST_STATES.ALREADY_VERIFIED;
    }

    throw err;
  }
};

const verifyByCode = (user, code) => async (dispatch) => {
  const success = await services.verifyByCode(user, code);
  if (success) {
    dispatch(setEmailVerified());
  }
};

export {
  request,
  verifyByCode,
  REQUEST_STATES,
};

export default reducer;
