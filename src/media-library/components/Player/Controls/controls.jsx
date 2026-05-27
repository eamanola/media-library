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

const Controls = ({ hide = false, onFullscreen = null }) => {
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

      const onTimeUpdate = ({ target }) => {
        setCurrentTime(target.currentTime);
      };

      videoElement.addEventListener('timeupdate', onTimeUpdate, false);

      return () => {
        // console.log('destroy', videoEl);
        videoElement.removeEventListener('timeupdate', onTimeUpdate, false);
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
