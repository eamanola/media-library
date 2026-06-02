// import GenericError from '../services/generic-error';
import appConfig from '../../config';

const { BACKEND_URL } = appConfig;

const play = async ({ id, realId }) => {
  try {
    const response = await fetch(`${BACKEND_URL}/play/${id}`, {
      body: JSON.stringify({ id: realId }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    });

    return response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

export { play };

export default null;
