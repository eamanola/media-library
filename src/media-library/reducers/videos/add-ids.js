const getEpisodeStr = (episode, extra, version) => (
  `${extra || 'E'}${episode}${version ? `v${version}` : ''}`
);

const addIds = ({
  episode, extra, season, title, version, year, ...video
}) => ({
  ...video,
  episode,
  extra,
  id: [
    season ? `S${season}` : '',
    title.replace(/\s/ug, '_'),
    year ? `(${year})` : '',
    (typeof episode === 'number') ? getEpisodeStr(episode, extra, version) : '',
  ]
    .filter((element) => element !== '')
    .join('.')
    .replace(/\s/ug, '.'),
  season,
  title,
  version,
  year,
});

export default addIds;
