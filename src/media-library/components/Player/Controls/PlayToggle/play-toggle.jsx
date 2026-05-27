import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const PlayToggle = ({ onPause, onPlay }) => {
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    const videoEl = document.querySelector('video');

    if (videoEl) {
      const onPausedChanged = ({ target }) => {
        setIsPaused(target.paused);
      };

      videoEl.addEventListener('play', onPausedChanged, false);
      videoEl.addEventListener('pause', onPausedChanged, false);

      return () => {
        videoEl.removeEventListener('play', onPausedChanged, false);
        videoEl.removeEventListener('pause', onPausedChanged, false);
      };
    }

    return () => null;
  }, []);

  return (
    <button onClick={isPaused ? onPlay : onPause} type="button">
      {/* {isPaused ? '\u23F5' : '\u23F8'} */}
      {isPaused ? 'play' : 'pause'}
    </button>
  );
};

PlayToggle.propTypes = {
  onPause: PropTypes.func.isRequired,
  onPlay: PropTypes.func.isRequired,
};

export default PlayToggle;
