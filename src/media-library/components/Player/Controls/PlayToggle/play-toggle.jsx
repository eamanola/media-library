import React from 'react';
import PropTypes from 'prop-types';

const PlayToggle = ({ isPaused = true, onPause = null, onPlay = null }) => (
  <button onClick={isPaused ? onPlay : onPause} type="button">
    {/* {isPaused ? '\u23F5' : '\u23F8'} */}
    {isPaused ? 'play' : 'pause'}
  </button>
);

PlayToggle.propTypes = {
  isPaused: PropTypes.bool,
  onPause: PropTypes.func.isRequired,
  onPlay: PropTypes.func.isRequired,
};

PlayToggle.defaultProps = {
  isPaused: false,
};

export default PlayToggle;
