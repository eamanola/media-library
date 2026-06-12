import appConfig from '../../config';

const { BACKEND_URL } = appConfig;

const metas = async (qs) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/metas?${qs.map((q) => `q=${encodeURIComponent(q)}`).join('&')}`,
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
  metas,
};

export default null;
