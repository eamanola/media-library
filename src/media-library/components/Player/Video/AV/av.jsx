import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Controls, { chaptersPropType } from './Controls';
import './av.css';

const AV = ({
  videoSrc,
  audioSrc = null,
  chapters = null,
  duration = 0,
  nativeControls = false,
  onReady = null,
  onAudioError = null,
  onFullscreen = null,
  onVideoError = null,
  onTimeUpdate = null,
  onVideoElChanged = null,
  onEnded = null,
}) => {
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const [canPlay, setCanPlay] = useState([]);

  // for controls
  // any integer, to fake an active timeout
  const [showControlsTimeout, setShowControlsTimeout] = useState(1);
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

  useEffect(() => {
    onVideoElChanged(videoRef?.current);

    return () => onVideoElChanged(null);
  }, [videoRef, onVideoElChanged]);

  const onCanPlay = ({ target }) => {
    setCanPlay((state) => [...state.filter((el) => el !== target.tagName), target.tagName]);

    if (hasAudio()) {
      syncAV();
    }
  };

  const onPlay = () => {
    if (hasAudio()) {
      audioRef.current.play();
    }
  };

  const onPause = () => {
    if (hasAudio()) {
      audioRef.current.pause();
    }
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

    if (onTimeUpdate) {
      onTimeUpdate(e);
    }
  };

  // for controls
  const showControls = () => {
    if (showControlsTimeout) {
      clearTimeout(showControlsTimeout);
    }

    const timeout = setTimeout(() => {
      setShowControlsTimeout(0);
    }, 4000);

    setShowControlsTimeout(timeout);
  };
  // for controls

  const DEBUG = false;

  return (
    <div className="av" onMouseMove={showControls}>
      <video
        controls={nativeControls || DEBUG}
        onCanPlay={onCanPlay}
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

      {(nativeControls === false) && (
        <Controls
          chapters={chapters}
          duration={duration}
          hide={showControlsTimeout === 0}
          onFullscreen={onFullscreen}
          // eslint-disable-next-line react-hooks/refs
          videoEl={videoRef?.current}
        />
      )}
    </div>
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
  onVideoElChanged: PropTypes.func,
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
  onVideoElChanged: null,
  onVideoError: null,
};

export { chaptersPropType };

export default AV;
