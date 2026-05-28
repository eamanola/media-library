import React from 'react';
import PropTypes from 'prop-types';

const Chapters = ({
  chapters = null,
  currentTime = 0,
  onChapterSelected = null,
}) => {
  if (!chapters?.length) {
    return null;
  }

  const currentChapter = chapters.find(
    ({ start, end }) => start <= currentTime && end > currentTime,
  );

  const currentChapterIndex = chapters.indexOf(currentChapter);

  return (
    <>
      {typeof onChapterSelected === 'function' && (
        <button
          disabled={currentChapterIndex === 0}
          onClick={() => onChapterSelected({ ...chapters[currentChapterIndex - 1] })}
          type="button"
        >
          &lt;
        </button>
      )}

      <span>
        {currentChapter?.title}
      </span>

      {typeof onChapterSelected === 'function' && (
        <button
          disabled={currentChapterIndex === chapters.length - 1}
          onClick={() => onChapterSelected({ ...chapters[currentChapterIndex + 1] })}
          type="button"
        >
          &gt;
        </button>
      )}
    </>
  );
};

const chaptersPropType = PropTypes.arrayOf(PropTypes.shape({
  end: PropTypes.number.isRequired,
  start: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
}));

Chapters.propTypes = {
  chapters: chaptersPropType,
  currentTime: PropTypes.number,
  onChapterSelected: PropTypes.func,
};

Chapters.defaultProps = {
  chapters: null,
  currentTime: 0,
  onChapterSelected: null,
};

export { chaptersPropType };

export default Chapters;
