import React from 'react';
import PropTypes from 'prop-types';

import Chapters, { chaptersPropType } from './Chapters';
import formatTime from './format-time';

const Controls = ({
  availableDuration = 0,
  chapters = null,
  currentTime = 0,
  duration = 0,
  isPaused = true,
  onChapterSelected = null,
  onFullscreen = null,
  onTogglePlay = null,
}) => (
  <div>
    {typeof onTogglePlay === 'function' && (
      <button onClick={onTogglePlay} type="button">
        {isPaused ? 'play' : 'pause'}
      </button>
    )}

    <Chapters chapters={chapters} currentTime={currentTime} onChapterSelected={onChapterSelected} />

    {typeof onFullscreen === 'function' && (
      <button onClick={onFullscreen} type="button">
        FS
      </button>
    )}

    <span>
      {formatTime(currentTime, availableDuration, duration)}
    </span>
  </div>
);

Controls.propTypes = {
  availableDuration: PropTypes.number,
  chapters: chaptersPropType,
  currentTime: PropTypes.number,
  duration: PropTypes.number,
  isPaused: PropTypes.bool,
  onChapterSelected: PropTypes.func,
  onFullscreen: PropTypes.func,
  onTogglePlay: PropTypes.func,
};

Controls.defaultProps = {
  availableDuration: 0,
  chapters: null,
  currentTime: 0,
  duration: 0,
  isPaused: true,
  onChapterSelected: null,
  onFullscreen: null,
  onTogglePlay: null,
};

export {
  chaptersPropType,
};

export default Controls;
