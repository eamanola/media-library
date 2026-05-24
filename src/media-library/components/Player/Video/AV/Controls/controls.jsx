import React from 'react';
import PropTypes from 'prop-types';

import Chapters, { chaptersPropType } from './Chapters';

const Controls = ({
  chapters = null,
  currentTime = 0,
  onChapterSelected = null,
}) => {
  console.log(1);
  return (
    <Chapters chapters={chapters} currentTime={currentTime} onChapterSelected={onChapterSelected} />
  );
};

Controls.propTypes = {
  chapters: chaptersPropType,
  currentTime: PropTypes.number,
  onChapterSelected: PropTypes.func,
};

Controls.defaultProps = {
  chapters: null,
  currentTime: 0,
  onChapterSelected: null,
};

export {
  chaptersPropType,
};

export default Controls;
