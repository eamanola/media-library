import React from 'react';
import PropTypes from 'prop-types';

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

Time.propTypes = {
  currentTime: PropTypes.number,
  duration: PropTypes.number,
  videoDuration: PropTypes.number,
};

Time.defaultProps = {
  currentTime: 0,
  duration: 0,
  videoDuration: 0,
};

export default Time;
