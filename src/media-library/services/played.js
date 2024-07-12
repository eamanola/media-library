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

const createPlayed = async (id, isPlayed) => {
  try {
    const response = await fetch(`${BACKEND_URL}/played`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isPlayed, mediaId: id }),
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
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playedObj),
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
