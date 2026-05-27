import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

import './progress.css';

const secToWidth = (sec, max) => `${Math.round((sec / max) * 100)}%`;

const Progress = ({ onSeekTo = null }) => {
  const { videoId } = useParams();

  const video = useSelector(
    ({ mediaLibrary }) => (mediaLibrary || []).find(({ id }) => id === videoId),
  );

  const videoEl = document.querySelector('video');

  const { duration } = video.probe;
  const { currentTime } = videoEl;
  const { buffered } = videoEl;

  const buffers = [];
  if (buffered?.length > 0) {
    for (let i = 0; i < buffered.length; i += 1) {
      const start = buffered.start(i);
      const end = buffered.end(i);
      if (end > start) {
        buffers.push({
          left: secToWidth(start, duration),
          width: secToWidth(end - start, duration),
        });
      }
    }
  }

  const onClick = (e) => {
    const { nativeEvent } = e;

    const { offsetX: x } = nativeEvent;

    const progressBar = document.querySelector('.progress > .available');
    const maxWidth = progressBar.offsetWidth;

    onSeekTo((x / maxWidth) * duration);
  };

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
  onSeekTo: PropTypes.func,
};

Progress.defaultProps = {
  onSeekTo: null,
};

export { timeRangeArrayPropType };

export default Progress;
