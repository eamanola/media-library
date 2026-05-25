import React from 'react';
import PropTypes from 'prop-types';

import './progress.css';

const Progress = ({
  availableDuration = 0,
  currentTime = 0,
  onSeekTo = null,
}) => {
  const onClick = (e) => {
    const { nativeEvent } = e;

    const { offsetX: x } = nativeEvent;

    const progressBar = document.querySelector('.progress');
    const maxWidth = progressBar.offsetWidth;

    onSeekTo((x / maxWidth) * availableDuration);
  };

  return (
    <div className="progress" onClick={onSeekTo ? onClick : null}>
      <div className="available" />

      <div className="played" style={{ width: `${(currentTime / availableDuration) * 100}%` }} />
    </div>
  );
};

Progress.propTypes = {
  availableDuration: PropTypes.number,
  currentTime: PropTypes.number,
  onSeekTo: PropTypes.func,
};

Progress.defaultProps = {
  availableDuration: 0,
  currentTime: 0,
  onSeekTo: null,
};

export default Progress;
