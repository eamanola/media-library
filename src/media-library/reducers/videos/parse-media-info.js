import {
  episode as getEpisode,
  season as getSeason,
  title as getTitle,
  year as getYear,
} from 'media-filename-parser';

const parseMediaInfo = ({ mediaLib, path }) => ({
  mediaLib,
  path,
  season: getSeason(path.replace(`${mediaLib}/`, '')),
  title: getTitle(path.replace(`${mediaLib}/`, '')),
  year: getYear(path.replace(`${mediaLib}/`, '')),
  ...getEpisode(path.replace(`${mediaLib}/`, '')),
});

export default parseMediaInfo;
