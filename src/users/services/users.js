import { users } from 'automata-api';

import GenericError from '../../services/generic-error';
import config from '../../config';

const { BACKEND_URL: BASE_URL } = config;

// TODO: dry run
const create = async ({ email, password }) => {
  try {
    const { status, body } = await users.signup(email, password, { BASE_URL });

    const success = status === 201;
    if (!success) {
      const { message } = body;
      throw new Error(message);
    }
  } catch (err) {
    const { message } = err || GenericError;
    throw new Error(message, { cause: err });
  }
};

// TODO: dry run
const login = async ({ email, password }) => {
  try {
    const { status, body } = await users.login(email, password, { BASE_URL });
    const { message, emailVerified, token } = body;

    const success = status === 200;
    if (!success) {
      throw new Error(message);
    }

    return { emailVerified, token };
  } catch (err) {
    const { message } = err || GenericError;
    throw new Error(message, { cause: err });
  }
};

const userService = {
  create,
  login,
};

export default userService;
