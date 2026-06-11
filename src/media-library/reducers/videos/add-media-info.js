import {
  episode, season, title, year,
} from 'media-filename-parser';

const addMediaInfo = ({ path, ...rest }) => {
  const subpath = path.replace(/^\//u, '');

  return {
    ...rest,
    path,
    season: season(subpath),
    title: title(subpath),
    year: year(subpath),
    ...episode(subpath),
  };
};

export default addMediaInfo;
