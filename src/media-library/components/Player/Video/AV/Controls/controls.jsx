import React from 'react';
import PropTypes from 'prop-types';

import Chapters, { chaptersPropType } from './Chapters';
import formatTime from './format-time';

const Controls = ({
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
      {`${formatTime(currentTime)}${duration ? ` / ${formatTime(duration)}` : ''}`}
    </span>
  </div>
);

Controls.propTypes = {
  chapters: chaptersPropType,
  currentTime: PropTypes.number,
  duration: PropTypes.number,
  onChapterSelected: PropTypes.func,
  onFullscreen: PropTypes.func,
};

Controls.defaultProps = {
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
