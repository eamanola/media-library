// import GenericError from '../services/generic-error';
import config from '../config';

const { BACKEND_URL } = config;

const videos = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/videos`);

    return response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

const durations = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/durations`);

    return response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

const createThumbnails = async (list) => {
  try {
    const response = await fetch(`${BACKEND_URL}/create-thumbnails`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(list),
    });

    return response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

const play = async (path) => {
  try {
    const response = await fetch(`${BACKEND_URL}/play`, {
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

const played = async () => {
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
  createThumbnails,
  durations,
  play,
  played,
  updatePlayed,
  videos,
};
