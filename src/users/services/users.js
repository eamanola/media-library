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
  } catch (e) {
    const { message } = e?.response?.data || GenericError;
    throw new Error(message);
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

    return { token, emailVerified };
  } catch (e) {
    const { message } = e?.response?.data || GenericError;
    throw new Error(message);
  }
};

const userService = {
  create,
  login,
};

export default userService;
