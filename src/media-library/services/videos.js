// import GenericError from '../services/generic-error';
import appConfig from '../../config';

const { BACKEND_URL } = appConfig;

const videos = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/videos`);

    return response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

export { videos };

export default null;
