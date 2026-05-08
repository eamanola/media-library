import axios from 'axios';

import GenericError from '../../services/generic-error';
import config from '../../config';

const { BACKEND_URL } = config;

const create = async ({ email, password }) => {
  try {
    await axios.post(
      `${BACKEND_URL}/signup`,
      { email, password },
    );
  } catch (err) {
    const { message } = err?.response?.data || GenericError;
    throw new Error(message, { cause: err });
  }
};

const login = async ({ email, password }) => {
  try {
    const { token, emailVerified } = (
      await axios.post(
        `${BACKEND_URL}/login`,
        { email, password },
      )
    ).data;

    return { emailVerified, token };
  } catch (err) {
    const { message } = err?.response?.data || GenericError;
    throw new Error(message, { cause: err });
  }
};

const userService = {
  create,
  login,
};

export default userService;
