// import GenericError from '../services/generic-error';
import appConfig from '../../config';

const { BACKEND_URL } = appConfig;

const play = async ({ displayId, videoId }) => {
  try {
    const response = await fetch(`${BACKEND_URL}/play/${displayId}`, {
      body: JSON.stringify({ id: videoId }),
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
