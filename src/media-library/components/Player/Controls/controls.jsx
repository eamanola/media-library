import React, { useEffect, useState } from 'react';

import Chapters from './Chapters';
import Progress from './Progress';
import Time from './Time';
import './controls.css';
import PlayToggle from './PlayToggle';
import { SELECTOR_AUDIO, SELECTOR_VIDEO } from '../../../config';
import logger from '../../../../logger';

const onPlay = () => {
  const videoEl = document.querySelector(SELECTOR_VIDEO);
  videoEl.play();
};

const onPause = () => {
  const videoEl = document.querySelector(SELECTOR_VIDEO);
  videoEl.pause();
};

const seekTo = (secs) => {
  const videoEl = document.querySelector(SELECTOR_VIDEO);
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
    const videoElement = document.querySelector(SELECTOR_VIDEO);
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

  const videoEl = document.querySelector(SELECTOR_VIDEO);
  if (!videoEl) return null;

  const audioEl = document.querySelector(SELECTOR_AUDIO);

  const audioDuration = audioEl?.duration || 0;
  const videoDuration = videoEl.duration;
  const probeDuration = probe?.duration || 0;
  // console.log(audioDuration, videoDuration, probeDuration);

  // eg vp9-opus.webm
  // audio & video & probe have different durations, but close
  // prefer browser/actual
  const maxDuration = Math.abs(probeDuration - videoDuration) < 1
    ? videoDuration
    : probeDuration;

  const showAudioProgress = audioDuration
    && (audioDuration < videoDuration)
    && Math.abs(audioDuration - maxDuration) > 1;
  const availableDuration = showAudioProgress ? audioDuration : videoDuration;
  const audioBuffered = showAudioProgress ? audioEl.buffered : null;

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

        {
          probe?.chapters && probe?.chapters.length > 0
            ? (
              <Chapters
                chapters={probe?.chapters}
                currentTime={currentTime}
                onChapterSelected={toChapter}
              />
            )
            : (
              <button
                onClick={() => seekTo(0)}
                type="button"
              >
                &lt;
              </button>
            )
        }

        <Progress
          abuffered={audioBuffered}
          buffered={videoEl.buffered}
          currentTime={currentTime}
          duration={maxDuration}
          onSeekTo={onSeekTo}
        />

        <Time
          availableDuration={availableDuration}
          currentTime={currentTime}
          duration={maxDuration}
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

export default Controls;
