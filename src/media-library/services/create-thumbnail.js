// import GenericError from '../services/generic-error';
import appConfig from '../../config';

const { BACKEND_URL } = appConfig;

const createThumbnails = async (list) => {
  try {
    const response = await fetch(`${BACKEND_URL}/create-thumbnails`, {
      body: JSON.stringify(list),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    return response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

export { createThumbnails };

export default null;
