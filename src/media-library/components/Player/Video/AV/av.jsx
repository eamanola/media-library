import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Controls, { chaptersPropType } from './Controls';
import './av.css';

const AV = ({
  videoSrc,
  audioSrc = null,
  chapters = null,
  duration = 0,
  nativeControls = true,
  onReady = null,
  onAudioError = null,
  onFullscreen = null,
  onVideoError = null,
  onTimeUpdate = null,
  onEnded = null,
}) => {
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const [canPlay, setCanPlay] = useState([]);

  // for controls
  const [availableDuration, setAvailableDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  // for controls

  const hasAudio = () => audioSrc !== null;

  const syncAV = () => {
    if (audioRef.current && videoRef.current) {
      if (videoRef.current.paused) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  useEffect(() => {
    videoRef.current?.load();
  }, [videoSrc]);

  useEffect(() => {
    audioRef.current?.pause();

    audioRef.current?.load();
  }, [audioSrc]);

  useEffect(() => {
    if (onReady) {
      onReady(canPlay.length === (audioSrc !== null ? 2 : 1));
    }
  }, [
    canPlay,
    audioSrc,
    onReady,
  ]);

  const onCanPlay = ({ target }) => {
    setCanPlay((state) => [...state.filter((el) => el !== target.tagName), target.tagName]);

    if (hasAudio()) {
      syncAV();
    }

    // for controls
    setAvailableDuration(target.duration);
    setCurrentTime(target.currentTime);
    setIsPaused(target.paused);
    // for controls
  };

  const onPlay = () => {
    if (hasAudio()) {
      audioRef.current.play();
    }

    // for controls
    setIsPaused(false);
    // for controls
  };

  const onPause = () => {
    if (hasAudio()) {
      audioRef.current.pause();
    }

    // for controls
    setIsPaused(true);
    // for controls
  };

  const onSeeked = ({ target }) => {
    if (hasAudio()) {
      audioRef.current.currentTime = target.currentTime;
    }
  };

  const onVideoTimeUpdate = (e) => {
    if (hasAudio()) {
      const { target } = e;
      if (Math.abs(audioRef.current.currentTime - target.currentTime) > 0.5) {
        audioRef.current.currentTime = target.currentTime;
      }
    }

    // for controls
    setAvailableDuration(e.target.duration);
    setCurrentTime(e.target.currentTime);
    // for controls

    if (onTimeUpdate) {
      onTimeUpdate(e);
    }
  };

  // for controls
  const seekTo = (secs) => {
    videoRef.current.currentTime = secs;
  };

  const toChapter = (chapter) => {
    seekTo(chapter.start);
  };

  const togglePlay = (videoEl) => {
    if (videoEl.paused) {
      videoEl.play();
    } else {
      videoEl.pause();
    }
  };

  // TODO: remove <video controls>
  const onDoubleClick = (e) => {
    if (onFullscreen) {
      e.preventDefault();
      e.stopPropagation();
      onFullscreen();
    }
  };

  // TODO: remove <video controls>
  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    togglePlay(e.target);
  };

  const onTogglePlay = () => {
    togglePlay(videoRef.current);
  };

  const onSeekTo = (secs) => {
    seekTo(secs);
  };
  // for controls

  const DEBUG = true;

  return (
    <>
      <video
        controls={nativeControls}
        onCanPlay={onCanPlay}
        onClick={nativeControls === false ? onClick : null}
        onDoubleClick={nativeControls === false ? onDoubleClick : null}
        onEnded={onEnded}
        onError={onVideoError}
        onPause={onPause}
        onPlay={onPlay}
        onSeeked={onSeeked}
        onTimeUpdate={onVideoTimeUpdate}
        ref={videoRef}
      >
        <track kind="captions" label="foo" />

        <source src={videoSrc} />
      </video>

      {
        hasAudio() && (
          <audio onCanPlay={onCanPlay} onError={onAudioError} ref={audioRef}>
            <track kind="captions" label="foo" />

            <source src={audioSrc} />
          </audio>
        )
      }

      {(!nativeControls || DEBUG === true) && (
        <Controls
          availableDuration={availableDuration}
          chapters={chapters}
          currentTime={currentTime}
          duration={duration}
          isPaused={isPaused}
          onChapterSelected={toChapter}
          onFullscreen={onFullscreen}
          onSeekTo={onSeekTo}
          onTogglePlay={onTogglePlay}
        />
      )}
    </>
  );
};

AV.propTypes = {
  audioSrc: PropTypes.string,
  chapters: chaptersPropType,
  duration: PropTypes.number,
  nativeControls: PropTypes.bool,
  onAudioError: PropTypes.func,
  onEnded: PropTypes.func,
  onFullscreen: PropTypes.func,
  onReady: PropTypes.func,
  onTimeUpdate: PropTypes.func,
  onVideoError: PropTypes.func,
  videoSrc: PropTypes.string.isRequired,
};

AV.defaultProps = {
  audioSrc: null,
  chapters: null,
  duration: PropTypes.number,
  nativeControls: false,
  onAudioError: null,
  onEnded: null,
  onFullscreen: null,
  onReady: null,
  onTimeUpdate: null,
  onVideoError: null,
};

export { chaptersPropType };

export default AV;
