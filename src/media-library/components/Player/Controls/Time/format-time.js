const secsToTime = (secs) => {
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

const playerHasDuration = (availableDuration) => Number.isFinite(availableDuration);
const stillLoading = (availableDuration, duration) => duration > 0 && availableDuration < duration;
const lessThanRoundingError = (available) => available < 100;

const formatTime = (currentTime, availableDuration, duration) => {
  let timeStr = secsToTime(currentTime);

  if (playerHasDuration(availableDuration)) {
    if (availableDuration) {
      timeStr = `${timeStr} / ${secsToTime(availableDuration)}`;
    }

    if (stillLoading(availableDuration, duration)) {
      const available = Math.round((availableDuration / duration) * 100);

      if (lessThanRoundingError(available)) {
        timeStr = `${timeStr} (${available}% / ${secsToTime(duration)})`;
      }
    }
  } else if (duration > 0) {
    timeStr = `${timeStr} / ${secsToTime(duration)}`;
  }

  return timeStr;
};

export default formatTime;
