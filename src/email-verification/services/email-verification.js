import { users } from 'automata-api';

import GenericError from '../../services/generic-error';
import config from '../../config';

const { BACKEND_URL: BASE_URL } = config;
const { emailVerification } = users;

const request = async (email) => {
  try {
    const byCode = `${window.location.origin}/email-verification/by-code`;
    const byLink = {
      onFail: `${window.location.origin}/email/verify/by-link/fail`,
      onSuccess: `${window.location.origin}/email/verify/by-link/success`,
    };
    const { status, body } = await emailVerification.request(
      email,
      byCode,
      byLink,
      { BASE_URL },
    );

    const success = status === 200;

    if (!success) {
      const { message } = body;
      throw new Error(message);
    }

    return success;
  } catch (err) {
    const { message } = err || GenericError;
    throw new Error(message, { cause: err });
  }
};

const verifyByCode = async ({ token }, code) => {
  try {
    const { status, body } = await emailVerification.verifyByCode(token, code, { BASE_URL });

    const success = status === 200;

    if (!success) {
      const { message } = body;
      throw new Error(message);
    }

    return success;
  } catch (err) {
    const { message } = err || GenericError;
    throw new Error(message, { cause: err });
  }
};

const emailVerificationServices = {
  request,
  verifyByCode,
};

export default emailVerificationServices;
