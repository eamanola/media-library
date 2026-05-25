import React from 'react';
import PropTypes from 'prop-types';

import Chapters, { chaptersPropType } from './Chapters';
import formatTime from './format-time';

const Controls = ({
  availableDuration = 0,
  chapters = null,
  currentTime = 0,
  duration = 0,
  onChapterSelected = null,
  onFullscreen = null,
}) => (
  <div>
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
  onChapterSelected: PropTypes.func,
  onFullscreen: PropTypes.func,
};

Controls.defaultProps = {
  availableDuration: 0,
  chapters: null,
  currentTime: 0,
  duration: 0,
  onChapterSelected: null,
  onFullscreen: null,
};

export {
  chaptersPropType,
};

export default Controls;
