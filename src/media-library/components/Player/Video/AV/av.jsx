import React, { useEffect, useRef, useState } from 'react';

import './av.css';

const AV = ({
  videoSrc,
  audioSrc = null,
  controls = false,
  onReady = null,
  onAudioError = null,
  onVideoError = null,
  onTimeUpdate = null,
  onEnded = null,
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

  const DEBUG = false;

  return (
    <>
      <video
        controls={controls || DEBUG}
        onCanPlay={onCanPlay}
        onEnded={onEnded}
        onError={onVideoError}
        onPause={onPause}
        onPlay={onPlay}
        onSeeked={onSeeked}
        onTimeUpdate={onVideoTimeUpdate}
        ref={videoRef}
      >
        <source src={videoSrc} />
      </video>

      {
        hasAudio() && (
          <audio onCanPlay={onCanPlay} onError={onAudioError} ref={audioRef}>
            <source src={audioSrc} />
          </audio>
        )
      }
    </>
  );
};

export default AV;
