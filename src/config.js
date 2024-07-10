const {
  NODE_ENV,
  REACT_APP_BACKEND_URL = 'http://localhost:3001',
} = process.env;

const isDev = NODE_ENV === 'development';
const DEV_USER_EMAIL = isDev ? 'foo@example.com' : undefined;
const DEV_USER_PASSWORD = isDev ? 'supersecure' : undefined;

const config = {
  BACKEND_URL: REACT_APP_BACKEND_URL,
};

export {
  DEV_USER_EMAIL,
  DEV_USER_PASSWORD,
};

export default config;
