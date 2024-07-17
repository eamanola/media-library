// import GenericError from '../services/generic-error';
import appConfig from '../../config';

const { BACKEND_URL } = appConfig;

const play = async ({ id, path }) => {
  try {
    const response = await fetch(`${BACKEND_URL}/play/${id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path }),
    });

    return response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

export { play };

export default null;
