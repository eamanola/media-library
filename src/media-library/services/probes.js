// import GenericError from '../services/generic-error';
import appConfig from '../../config';

const { BACKEND_URL } = appConfig;

const probes = async (paths) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/probes`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paths),
      },
    );

    return response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

export {
  probes,
};

export default null;
