// import GenericError from '../services/generic-error';
import appConfig from '../../config';

const { BACKEND_URL } = appConfig;

const played = async (/* list */) => {
  try {
    const response = await fetch(`${BACKEND_URL}/played`);
    return response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

const createPlayed = async (mediaId, isPlayed) => {
  try {
    const response = await fetch(`${BACKEND_URL}/played`, {
      body: JSON.stringify({ isPlayed, mediaId }),
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

const updatePlayed = async (playedObj) => {
  try {
    const response = await fetch(`${BACKEND_URL}/played/${playedObj.id}`, {
      body: JSON.stringify(playedObj),
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

export {
  createPlayed,
  played,
  updatePlayed,
};

export default null;
