import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

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

const toggleFullscreen = () => {
  const wrapper = document.querySelector('.video-container');

  if (document.fullscreenElement === wrapper) {
    document.exitFullscreen();
  } else {
    wrapper.requestFullscreen();
  }
};

const Controls = ({ hide = false }) => {
  // tigger render every sec for sub components
  const [currentTime, setCurrentTime] = useState(0);

  const { videoId } = useParams();

  const video = useSelector(
    ({ mediaLibrary }) => (mediaLibrary || []).find(({ id }) => id === videoId),
  );

  useEffect(() => {
    const videoElement = document.querySelector('video');
    console.log('video changed', videoElement);
    if (videoElement) {
      // console.log('setup', videoEl);
      const onClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        togglePlay(e.target);
      };

      const onDoubleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFullscreen();
      };

      const onTimeUpdate = ({ target }) => {
        setCurrentTime(target.currentTime);
      };

      const onKeyup = (e) => {
        if (e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          togglePlay(e.target);
        }
      };

      // keep click and dblclick in controls
      // they will only fire, when video.controls is disabled
      videoElement.addEventListener('click', onClick, false);
      videoElement.addEventListener('dblclick', onDoubleClick, false);
      videoElement.addEventListener('timeupdate', onTimeUpdate, false);
      videoElement.addEventListener('keyup', onKeyup, false);

      return () => {
        // console.log('destroy', videoEl);
        videoElement.removeEventListener('click', onClick, false);
        videoElement.removeEventListener('dblclick', onDoubleClick, false);
        videoElement.removeEventListener('timeupdate', onTimeUpdate, false);
        videoElement.removeEventListener('keyup', onKeyup, false);
      };
    }

    return () => null;
  }, []);

  const videoEl = document.querySelector('video');
  if (!videoEl) return null;

  return (
    <div className={`controls ${hide ? ' hide' : ''}`}>
      <div className="controls-container">
        <PlayToggle
          isPaused={videoEl.paused}
          onPause={onPause}
          onPlay={onPlay}
        />

        <Chapters
          chapters={video.probe?.chapters}
          currentTime={currentTime}
          onChapterSelected={toChapter}
        />

        <Progress
          buffered={videoEl.buffered}
          currentTime={currentTime}
          duration={video.probe?.duration}
          onSeekTo={onSeekTo}
        />

        <Time
          currentTime={currentTime}
          duration={video.probe?.duration}
          videoDuration={videoEl.duration}
        />

        <button onClick={toggleFullscreen} type="button">
          FS
        </button>
      </div>
    </div>
  );
};

Controls.propTypes = {
  hide: PropTypes.bool,
};

Controls.defaultProps = {
  hide: false,
};

export default Controls;
