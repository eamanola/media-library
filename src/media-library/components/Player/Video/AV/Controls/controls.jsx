import React from 'react';
import PropTypes from 'prop-types';

import Chapters, { chaptersPropType } from './Chapters';

const Controls = ({
  chapters = null,
  currentTime = 0,
  onChapterSelected = null,
  onFullscreen = null,
}) => (
  <>
    <Chapters chapters={chapters} currentTime={currentTime} onChapterSelected={onChapterSelected} />

    {typeof onFullscreen === 'function' && (
      <button onClick={onFullscreen} type="button">
        FS
      </button>
    )}
  </>
);

Controls.propTypes = {
  chapters: chaptersPropType,
  currentTime: PropTypes.number,
  onChapterSelected: PropTypes.func,
  onFullscreen: PropTypes.func,
};

Controls.defaultProps = {
  chapters: null,
  currentTime: 0,
  onChapterSelected: null,
  onFullscreen: null,
};

export {
  chaptersPropType,
};

export default Controls;
