import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Chapters, { chaptersPropType } from './Chapters';
import formatTime from './format-time';
import Progress from './Progress';
import './controls.css';

const togglePlay = (video) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
};

const Controls = ({
  chapters = null,
  duration = 0,
  hide = false,
  onFullscreen = null,
  videoEl = null,
}) => {
  const [isPaused, setIsPaused] = useState(true);
  const [availableDuration, setAvailableDuration] = useState(0);
  const [buffered, setBuffered] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  const onTogglePlay = () => {
    togglePlay(videoEl);
  };

  const seekTo = (secs) => {
    // eslint-disable-next-line react-hooks/immutability, no-param-reassign
    videoEl.currentTime = secs;
  };
  const onSeekTo = (secs) => {
    seekTo(secs);
  };
  const toChapter = (chapter) => {
    seekTo(chapter.start);
  };

  useEffect(() => {
    console.log('video elemnt 2', videoEl);
    if (videoEl) {
      const onClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        togglePlay(e.target);
      };

      const onDoubleClick = (e) => {
        if (onFullscreen) {
          e.preventDefault();
          e.stopPropagation();
          onFullscreen();
        }
      };

      const onPlay = () => {
        setIsPaused(false);
      };

      const onPause = () => {
        setIsPaused(true);
      };

      const onTimeUpdate = (e) => {
        const { target } = e;

        setAvailableDuration(target.duration);
        setBuffered(target.buffered);
        setCurrentTime(target.currentTime);
      };

      // keep click and dblclick in controls
      // they will only fire, when video.controls is disabled
      videoEl.addEventListener('click', onClick, false);
      videoEl.addEventListener('dblclick', onDoubleClick, false);
      videoEl.addEventListener('play', onPlay, false);
      videoEl.addEventListener('pause', onPause, false);
      videoEl.addEventListener('timeupdate', onTimeUpdate, false);

      return () => {
        videoEl.removeEventListener('click', onClick, false);
        videoEl.removeEventListener('dblclick', onDoubleClick, false);
        videoEl.removeEventListener('play', onPlay, false);
        videoEl.removeEventListener('pause', onPause, false);
        videoEl.removeEventListener('timeupdate', onTimeUpdate, false);
      };
    }

    return () => null;
  }, [videoEl, onFullscreen]);

  if (!videoEl) return null;

  return (
    <div className={`controls ${hide ? ' hide' : ''}`}>
      <div className="controls-container">
        <button onClick={onTogglePlay} type="button">
          {/* {isPaused ? '\u23F5' : '\u23F8'} */}
          {isPaused ? 'play' : 'pause'}
        </button>

        <Chapters
          chapters={chapters}
          currentTime={currentTime}
          onChapterSelected={toChapter}
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
};

Controls.propTypes = {
  chapters: chaptersPropType,
  duration: PropTypes.number,
  hide: PropTypes.bool,
  onFullscreen: PropTypes.func,
  videoEl: PropTypes.node,
};

Controls.defaultProps = {
  chapters: null,
  duration: 0,
  hide: false,
  onFullscreen: null,
  videoEl: null,
};

export {
  chaptersPropType,
};

export default Controls;
