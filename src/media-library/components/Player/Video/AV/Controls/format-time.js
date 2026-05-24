const formatTime = (secs) => {
  let time = Math.floor(secs);

  const hours = Math.floor(time / 60 / 60);
  time -= hours * 60 * 60;

  const minutes = Math.floor(time / 60);
  time -= minutes * 60;

  const seconds = time;

  let timeStr = '';
  if (hours > 0) {
    if (hours < 10) timeStr = `${timeStr}0`;
    timeStr = `${timeStr}${hours}:`;
  }

  if (minutes > 0 && minutes < 10) {
    timeStr = `${timeStr}0`;
  }
  timeStr = `${timeStr}${minutes}:`;

  if (seconds < 10) {
    timeStr = `${timeStr}0`;
  }
  timeStr = `${timeStr}${seconds}`;

  return timeStr;
};

export default formatTime;
