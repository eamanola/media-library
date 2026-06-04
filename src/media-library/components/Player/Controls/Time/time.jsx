import React from 'react';

import formatTime from './format-time';

const Time = ({
  availableDuration = 0,
  currentTime = 0,
  duration = 0,
}) => (
  <span>
    {formatTime(currentTime, availableDuration, duration)}
  </span>
);

export default Time;
