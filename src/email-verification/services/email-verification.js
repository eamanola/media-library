import axios from 'axios';

import GenericError from '../../services/generic-error';
import config from '../../config';

const { BACKEND_URL } = config;

const request = async (email) => {
  try {
    const { status } = await axios.post(
      `${BACKEND_URL}/email-verification`,
      {
        byCode: `${window.location.origin}/email-verification/by-code`,
        byLink: {
          onFail: `${window.location.origin}/email/verify/by-link/fail`,
          onSuccess: `${window.location.origin}/email/verify/by-link/success`,
        },
        email,
      },
    );

    return status === 200;
  } catch (e) {
    const { message } = e?.response?.data || GenericError;
    throw new Error(message);
  }
};

const verifyByCode = async ({ token }, code) => {
  try {
    const { status } = await axios.patch(
      `${BACKEND_URL}/email-verification`,
      { code },
      { headers: { authorization: `bearer ${token}` } },
    );

    return status === 200;
  } catch (e) {
    const { message } = e?.response?.data || GenericError;
    throw new Error(message);
  }
};

// const fetchToken = async ({ email, password }) => {
//   try {
//     const { token } = (
//       await axios.post(
//         `${BACKEND_URL}/login`,
//         { email, password },
//       )
//     ).data;

//     return token;
//   } catch (e) {
//     const { message } = e?.response?.data || GenericError;
//     throw new Error(message);
//   }
// };

const emailVerificationServices = {
  request,
  verifyByCode,
};

export default emailVerificationServices;
