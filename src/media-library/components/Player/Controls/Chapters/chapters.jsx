import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

const Chapters = ({ onChapterSelected = null }) => {
  const { videoId } = useParams();
  const video = useSelector(
    ({ mediaLibrary }) => (mediaLibrary || []).find(({ id }) => id === videoId),
  );

  const videoEl = document.querySelector('video');

  const { chapters } = video.probe;
  const { currentTime } = videoEl;

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
          type='button'
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
          type='button'
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
  onChapterSelected: PropTypes.func,
};

Chapters.defaultProps = {
  onChapterSelected: null,
};

export { chaptersPropType };

export default Chapters;
