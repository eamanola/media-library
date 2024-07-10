import {
  episode as getEpisode,
  season as getSeason,
  title as getTitle,
  year as getYear,
} from 'media-filename-parser';

const getEpisodeStr = ({ episode, extra, version }) => (
  `${extra || 'E'}${episode}${version ? `v${version}` : ''}`
);

const getMediaInfo = (mediaLibs) => mediaLibs.map(({ mediaLib, videos }) => ({
  mediaLib,
  videos: videos.map((path) => ({
    path,
    mediaInfo: {
      episode: getEpisode(path.replace(`${mediaLib}/`, '')),
      season: getSeason(path.replace(`${mediaLib}/`, '')),
      title: getTitle(path.replace(`${mediaLib}/`, '')),
      year: getYear(path.replace(`${mediaLib}/`, '')),
    },
  }))
    .map(({ mediaInfo, ...video }) => ({
      ...video,
      mediaInfo,
      id: [
        mediaInfo.title.replace(/\s/ug, '_'),
        mediaInfo.year ? `(${mediaInfo.year})` : '',
        mediaInfo.season ? `S${mediaInfo.season}` : '',
        mediaInfo.episode ? getEpisodeStr(mediaInfo.episode) : '',
      ]
        .filter((element) => element !== '')
        .join('.')
        .replace(/\s/ug, '.'),
    })),
}));

export default getMediaInfo;
