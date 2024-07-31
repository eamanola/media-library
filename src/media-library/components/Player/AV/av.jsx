import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import mediaSrc from '../media-src';

import './av.css';

const AV = ({
  path,
  videoStream,
  audioStream,
}) => {
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const [canStart, setCanStart] = useState([]);
  const [transcodeAudio, setTranscodeAudio] = useState(false);
  const [transcodeVideo, setTranscodeVideo] = useState(false);

  const ready = () => canStart.length === 2;
  const videoSrc = () => mediaSrc('video', path, videoStream.index, transcodeVideo);
  const audioSrc = () => mediaSrc('audio', path, audioStream.index, transcodeAudio);
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
    console.log(canStart);
    if (canStart.length === 2) {
      console.log('Can start');
    }
  }, [canStart]);

  useEffect(() => {
    videoRef.current?.load();
  }, [videoStream, transcodeVideo]);

  useEffect(() => {
    audioRef.current?.load();
  }, [audioStream, transcodeAudio]);

  useEffect(() => {
    audioRef.current?.pause();

    setTranscodeAudio(false);
  }, [audioStream]);

  const onCanPlay = ({ target }) => {
    setCanStart((state) => [...state.filter((el) => el !== target.tagName), target.tagName]);

    syncAV();
  };
  const onPlay = () => { audioRef.current.play(); };
  const onPause = () => { audioRef.current.pause(); };
  const onSeeked = ({ target }) => { audioRef.current.currentTime = target.currentTime; };
  const onTimeUpdate = ({ target }) => {
    if (Math.abs(audioRef.current.currentTime - target.currentTime) > 1) {
      audioRef.current.currentTime = target.currentTime;
    }
  };
  const onVideoError = () => {
    if (transcodeVideo === false) {
      setTranscodeVideo(true);
    }
  };
  const onAudioError = () => {
    if (transcodeAudio === false) {
      setTranscodeAudio(true);
    }
  };

  return (
    <>
      { !ready() && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        >
          <span>Loading...</span>
        </div>
      )}
      <video
        style={{ visibility: ready() ? 'visible' : 'hidden' }}
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
        <source src={videoSrc()} />
      </video>
      <audio ref={audioRef} onCanPlay={onCanPlay} onError={onAudioError}>
        <track kind="captions" label="foo" />
        <source src={audioSrc()} />
      </audio>
    </>
  );
};

// const refProp = PropTypes.oneOfType([
//   PropTypes.func,
//   PropTypes.shape({ current: PropTypes.element })
// ]);

AV.propTypes = {
  // ref: refProp,
  path: PropTypes.string.isRequired,
  audioStream: PropTypes.shape({ index: PropTypes.number.isRequired }).isRequired,
  videoStream: PropTypes.shape({ index: PropTypes.number.isRequired }).isRequired,
};

export default AV;
