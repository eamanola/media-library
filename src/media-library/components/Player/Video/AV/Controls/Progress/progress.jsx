import React from 'react';
import PropTypes from 'prop-types';

import './progress.css';

const secToWidth = (sec, max) => `${Math.round((sec / max) * 100)}%`;

const Progress = ({
  buffered = null,
  currentTime = 0,
  duration = 0,
  onSeekTo = null,
}) => {
  const onClick = (e) => {
    const { nativeEvent } = e;

    const { offsetX: x } = nativeEvent;

    const progressBar = document.querySelector('.progress > .available');
    const maxWidth = progressBar.offsetWidth;

    onSeekTo((x / maxWidth) * duration);
  };

  const buffers = [];
  if (buffered?.length > 0) {
    for (let i = 0; i < buffered.length; i += 1) {
      buffers.push({
        left: secToWidth(buffered.start(i), duration),
        width: secToWidth(buffered.end(i) - buffered.start(i), duration),
      });
    }
  }

  return (
    <div className="progress" onClick={onSeekTo ? onClick : null}>
      <div className="available" />

      {
        buffers.map(({ left, width }) => (
          <div className="buffered" key={`key-${left}-${width}`} style={{ left, width }} />
        ))
      }

      <div className="played" style={{ width: secToWidth(currentTime, duration) }} />
    </div>
  );
};

const timeRangeArrayPropType = PropTypes.arrayOf(PropTypes.shape({
  end: PropTypes.func.isRequired,
  start: PropTypes.func.isRequired,
}));

Progress.propTypes = {
  buffered: timeRangeArrayPropType,
  currentTime: PropTypes.number,
  duration: PropTypes.number,
  onSeekTo: PropTypes.func,
};

Progress.defaultProps = {
  buffered: null,
  currentTime: 0,
  duration: 0,
  onSeekTo: null,
};

export { timeRangeArrayPropType };

export default Progress;
