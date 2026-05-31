import React from 'react';

const PlayToggle = ({ isPaused = true, onPause = null, onPlay = null }) => (
  <button onClick={isPaused ? onPlay : onPause} type="button">
    {/* {isPaused ? '\u23F5' : '\u23F8'} */}
    {isPaused ? 'play' : 'pause'}
  </button>
);

export default PlayToggle;
