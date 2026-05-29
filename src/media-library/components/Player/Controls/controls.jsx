import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Chapters, { chaptersPropType } from './Chapters';
import Progress from './Progress';
import Time from './Time';
import './controls.css';
import PlayToggle from './PlayToggle';
import logger from '../../../../logger';

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

const Controls = ({
  hide = false,
  onFullscreen = null,
  probe,
}) => {
  // tigger render every sec for sub components
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const videoElement = document.querySelector('video');
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

  useEffect(() => {
    logger.log('redraw Controls');
  }, []);

  const videoEl = document.querySelector('video');
  if (!videoEl) return null;

  const className = ['controls'];
  if (hide) className.push('hide');

  return (
    <div className={className.join(' ')}>
      <div className="controls-container">
        <PlayToggle
          isPaused={videoEl.paused}
          onPause={onPause}
          onPlay={onPlay}
        />

        <Chapters
          chapters={probe?.chapters}
          currentTime={currentTime}
          onChapterSelected={toChapter}
        />

        <Progress
          buffered={videoEl.buffered}
          currentTime={currentTime}
          duration={probe?.duration}
          onSeekTo={onSeekTo}
        />

        <Time
          currentTime={currentTime}
          duration={probe?.duration}
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
  probe: PropTypes.shape({
    chapters: chaptersPropType,
    duration: PropTypes.number,
  }).isRequired,
};

Controls.defaultProps = {
  hide: false,
  onFullscreen: null,
};

export default Controls;
