import React from 'react';
import PropTypes from 'prop-types';

import Chapters, { chaptersPropType } from './Chapters';
import formatTime from './format-time';
import Progress, { timeRangeArrayPropType } from './Progress';
import './controls.css';

const Controls = ({
  availableDuration = 0,
  buffered = null,
  chapters = null,
  currentTime = 0,
  duration = 0,
  isPaused = true,
  onChapterSelected = null,
  onFullscreen = null,
  onSeekTo = null,
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
        buffered={buffered}
        currentTime={currentTime}
        duration={duration}
        onSeekTo={onSeekTo}
      />

      <span>
        {formatTime(currentTime, availableDuration, duration)}
      </span>

      {typeof onFullscreen === 'function' && (
        <button onClick={onFullscreen} type="button">
          FS
        </button>
      )}
    </div>
  </div>
);

Controls.propTypes = {
  availableDuration: PropTypes.number,
  buffered: timeRangeArrayPropType,
  chapters: chaptersPropType,
  currentTime: PropTypes.number,
  duration: PropTypes.number,
  isPaused: PropTypes.bool,
  onChapterSelected: PropTypes.func,
  onFullscreen: PropTypes.func,
  onSeekTo: PropTypes.func,
  onTogglePlay: PropTypes.func,
};

Controls.defaultProps = {
  availableDuration: 0,
  buffered: null,
  chapters: null,
  currentTime: 0,
  duration: 0,
  isPaused: true,
  onChapterSelected: null,
  onFullscreen: null,
  onSeekTo: null,
  onTogglePlay: null,
};

export {
  chaptersPropType,
};

export default Controls;
