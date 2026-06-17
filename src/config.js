const {
  NODE_ENV,
} = import.meta.env;

const isDev = NODE_ENV === 'development';
const DEV_USER_EMAIL = isDev ? 'foo@example.com' : undefined;
const DEV_USER_PASSWORD = isDev ? 'supersecure' : undefined;

const config = {
  // vite proxy, see vite config,
  BACKEND_STREAM_URL: '/stream',
  BACKEND_URL: '/api',
};

export {
  DEV_USER_EMAIL,
  DEV_USER_PASSWORD,
};

export default config;
