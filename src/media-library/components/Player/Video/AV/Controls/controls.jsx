import React from 'react';
import PropTypes from 'prop-types';

import Chapters, { chaptersPropType } from './Chapters';
import formatTime from './format-time';
import Progress from './Progress';
import './controls.css';

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
  <div className="controls">
    <div className="controls-container">
      {typeof onTogglePlay === 'function' && (
        <button onClick={onTogglePlay} type="button">
          {isPaused ? 'play' : 'pause'}
        </button>
      )}

      <Chapters
        chapters={chapters}
        currentTime={currentTime}
        onChapterSelected={onChapterSelected}
      />

      <Progress
        availableDuration={availableDuration}
        currentTime={currentTime}
      />

      {typeof onFullscreen === 'function' && (
        <button onClick={onFullscreen} type="button">
          FS
        </button>
      )}

      <span>
        {formatTime(currentTime, availableDuration, duration)}
      </span>
    </div>
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
