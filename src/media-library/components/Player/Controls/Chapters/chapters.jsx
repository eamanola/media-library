import React from 'react';

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

export default Chapters;
