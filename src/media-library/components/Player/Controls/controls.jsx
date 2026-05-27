import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Chapters from './Chapters';
import Progress from './Progress';
import Time from './Time';
import './controls.css';
import PlayToggle from './PlayToggle';

const onPlay = () => {
  const videoEl = document.querySelector('video');
  videoEl.play();
};

const onPause = () => {
  const videoEl = document.querySelector('video');
  videoEl.pause();
};

const togglePlay = () => {
  const videoEl = document.querySelector('video');
  if (videoEl.paused) {
    videoEl.play();
  } else {
    videoEl.pause();
  }
};

const seekTo = (secs) => {
  const videoEl = document.querySelector('video');
  videoEl.currentTime = secs;
};
const onSeekTo = (secs) => {
  seekTo(secs);
};
const toChapter = (chapter) => {
  seekTo(chapter.start);
};

const Controls = ({
  hide = false,
  onFullscreen = null,
}) => {
  // tigger render every sec for sub components
  // eslint-disable-next-line react/hook-use-state
  const [, setCurrentTime] = useState(0);

  useEffect(() => {
    const videoEl = document.querySelector('video');
    console.log('video changed', videoEl);
    if (videoEl) {
      // console.log('setup', videoEl);
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

      const onTimeUpdate = ({ target }) => {
        setCurrentTime(target.currentTime);
      };

      // keep click and dblclick in controls
      // they will only fire, when video.controls is disabled
      videoEl.addEventListener('click', onClick, false);
      videoEl.addEventListener('dblclick', onDoubleClick, false);
      videoEl.addEventListener('timeupdate', onTimeUpdate, false);

      return () => {
        // console.log('destroy', videoEl);
        videoEl.removeEventListener('click', onClick, false);
        videoEl.removeEventListener('dblclick', onDoubleClick, false);
        videoEl.removeEventListener('timeupdate', onTimeUpdate, false);
      };
    }

    return () => null;
  }, [onFullscreen]);

  if (!document.querySelector('video')) return null;

  return (
    <div className={`controls ${hide ? ' hide' : ''}`}>
      <div className="controls-container">
        <PlayToggle onPause={onPause} onPlay={onPlay} />

        <Chapters onChapterSelected={toChapter} />

        <Progress onSeekTo={onSeekTo} />

        <Time />

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
  hide: PropTypes.bool,
  onFullscreen: PropTypes.func,
};

Controls.defaultProps = {
  hide: false,
  onFullscreen: null,
};

export default Controls;
