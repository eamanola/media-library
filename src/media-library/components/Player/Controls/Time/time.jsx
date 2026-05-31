import React from 'react';

import formatTime from './format-time';

const Time = ({
  currentTime = 0,
  duration = 0,
  videoDuration = 0,
}) => (
  <span>
    {formatTime(currentTime, videoDuration, duration)}
  </span>
);

export default Time;
