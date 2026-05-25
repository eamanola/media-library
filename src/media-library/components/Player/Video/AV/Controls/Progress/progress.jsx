import React from 'react';
import PropTypes from 'prop-types';

import './progress.css';

const Progress = ({
  availableDuration = 0,
  currentTime = 0,
}) => {
  console.log(currentTime, availableDuration);
  return (
    <div className="progress">
      <div className="available" />

      <div className="played" style={{ width: `${(currentTime / availableDuration) * 100}%` }} />
    </div>
  );
};

Progress.propTypes = {
  availableDuration: PropTypes.number,
  currentTime: PropTypes.number,
};

Progress.defaultProps = {
  availableDuration: 0,
  currentTime: 0,
};

export default Progress;
