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

const formatTime = (currentTime, availableDuration, duration) => {
  let timeStr = secsToTime(currentTime);

  if (Number.isFinite(availableDuration)) {
    if (availableDuration) {
      timeStr = `${timeStr} / ${secsToTime(availableDuration)}`;
    }

    const fAvailableDuration = Math.floor(availableDuration);
    const fDuration = Math.floor(duration);
    if (fDuration > 0 && fAvailableDuration !== fDuration) {
      const available = Math.round((fAvailableDuration / fDuration) * 100);
      timeStr = `${timeStr} (${available}% / ${secsToTime(duration)})`;
    }
  } else if (duration > 0) {
    timeStr = `${timeStr} / ${secsToTime(duration)}`;
  }

  return timeStr;
};

export default formatTime;
