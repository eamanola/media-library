import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import './av.css';

const AV = ({
  videoSrc,
  audioSrc = null,
  onReady = null,
  onAudioError = null,
  onVideoError = null,
}) => {
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const [canPlay, setCanPlay] = useState([]);

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
  }, [canPlay, audioSrc, onReady]);

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
  const onTimeUpdate = ({ target }) => {
    if (hasAudio()) {
      if (Math.abs(audioRef.current.currentTime - target.currentTime) > 1) {
        audioRef.current.currentTime = target.currentTime;
      }
    }
  };

  return (
    <>
      <video
        ref={videoRef}
        controls
        onCanPlay={onCanPlay}
        onError={onVideoError}
        onPlay={onPlay}
        onPause={onPause}
        onSeeked={onSeeked}
        onTimeUpdate={onTimeUpdate}
      >
        <track kind="captions" label="foo" />
        <source src={videoSrc} />
      </video>
      {
        hasAudio() && (
          <audio ref={audioRef} onCanPlay={onCanPlay} onError={onAudioError}>
            <track kind="captions" label="foo" />
            <source src={audioSrc} />
          </audio>
        )
      }
    </>
  );
};

AV.propTypes = {
  audioSrc: PropTypes.string,
  onAudioError: PropTypes.func,
  videoSrc: PropTypes.string.isRequired,
  onVideoError: PropTypes.func,
  onReady: PropTypes.func,
};

export default AV;
