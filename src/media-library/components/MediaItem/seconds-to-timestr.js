const secondsToTimeStr = (seconds) => {
  const date = new Date(0);

  date.setSeconds(seconds);

  const timeStr = date
    .toISOString()
    .substring(11, 19)
    .replace(/^00:/u, '')
    .replace(/^0/u, '');

  return timeStr;
};

export default secondsToTimeStr;
