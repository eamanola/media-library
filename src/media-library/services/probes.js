// import GenericError from '../services/generic-error';
import appConfig from '../../config';

const { BACKEND_URL } = appConfig;

const fetchProbes = async (ids) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/probes?${ids.map((id) => `id=${id}`).join('&')}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    return response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

export {
  fetchProbes,
};

export default null;
