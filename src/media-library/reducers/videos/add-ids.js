const getEpisodeStr = (episode, extra, version) => (
  `${extra || 'E'}${episode}${version ? `v${version}` : ''}`
);

const addIds = ({
  title, year, season, episode, extra, version, ...video
}) => ({
  ...video,
  title,
  year,
  season,
  episode,
  extra,
  version,
  id: [
    title.replace(/\s/ug, '_'),
    year ? `(${year})` : '',
    season ? `S${season}` : '',
    (typeof episode === 'number') ? getEpisodeStr(episode, extra, version) : '',
  ]
    .filter((element) => element !== '')
    .join('.')
    .replace(/\s/ug, '.'),
});

export default addIds;
