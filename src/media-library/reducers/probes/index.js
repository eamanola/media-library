import { probes as fetchProbes } from '../../services/probes';

const getProbes = (videos) => async (dispatch) => {
  const probes = await fetchProbes(videos.map(({ path }) => path));

  dispatch({
    payload: probes,
    type: 'MEDIA_LIBS_SET_PROBES',
  });
};

export default getProbes;
