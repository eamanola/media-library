import { probes as fetchProbes } from '../../services/probes';

const getProbes = (videos) => async (dispatch) => {
  const probes = await fetchProbes(videos.map(({ path }) => path));

  dispatch({ type: 'MEDIA_LIBS_SET_PROBES', payload: probes });
};

export default getProbes;
