import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import config from '../config';

const Player = () => {
  const mediaLibrary = useSelector((state) => state.mediaLibrary);
  const { videoId } = useParams();
  const [transcodeVideo, setTranscodeVideo] = useState(false);
  const [transcodeAudio, setTranscodeAudio] = useState(false);
  const [videoStream, setVideoStream] = useState(-1);
  const [audioStream, setAudioStream] = useState(-1);
  const [canStart, setCanStart] = useState([]);
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  const { probe, path } = (mediaLibrary || []).find(({ id }) => id === videoId) || {};

  useEffect(() => {
    console.log(canStart);
    if (canStart.length === 2) {
      console.log('Can start');
    }
  }, [canStart]);

  useEffect(() => {
    if (probe) {
      const { video: vidStream, audios } = probe;
      if (vidStream) {
        setVideoStream(vidStream.index);
      }
      if (audios.length) {
        setAudioStream(audios[0].index);
      }
      console.log('11');
    }
  }, [probe]);

  useEffect(() => {
    videoRef.current?.load();
  }, [videoStream, transcodeVideo]);

  useEffect(() => {
    audioRef.current?.load();

    console.log(audioStream, transcodeAudio);
  }, [audioStream, transcodeAudio]);

  if (!mediaLibrary.length) return null;

  if (!probe || !path) return null;
  // const video = mediaLibrary[1];

  const mediaSrc = (type, streamIndex, transcode, filepath) => [
    config.BACKEND_URL,
    `/${type}`,
    `/${streamIndex}`,
    `/${encodeURIComponent(filepath)}`,
    transcode ? '/transcode' : '',
  ]
    .filter((element) => element !== '')
    .join('');

  const videoSrc = () => mediaSrc('video', videoStream, transcodeVideo, path);

  const audioSrc = () => mediaSrc('audio', audioStream, transcodeAudio, path);

  const onLanguageChange = ({ target }) => {
    audioRef.current?.pause();

    setTranscodeAudio(false);

    setAudioStream(target.value);
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

  const syncAV = () => {
    if (audioRef.current && videoRef.current) {
      if (Math.abs(audioRef.current.currentTime - videoRef.current.currentTime) > 1) {
        audioRef.current.currentTime = videoRef.current.currentTime;
      }

      if (!videoRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  const onCanPlay = ({ target }) => {
    setCanStart((state) => [...state.filter((el) => el !== target.tagName), target.tagName]);

    syncAV();
  };

  const onPlay = () => audioRef.current.play();
  const onPause = () => audioRef.current.pause();
  const onSeeked = ({ target }) => { audioRef.current.currentTime = target.currentTime; };

  const ready = () => canStart.length === 2;

  return (
    <>
      { !ready() && (<div>Loading...</div>) }
      <video
        ref={videoRef}
        style={{
          visibility: ready() ? 'visible' : 'hidden',
          maxHeight: '80vh',
          maxWidth: '100vw',
          margin: '0 auto',
          display: 'block',
        }}
        controls
        onCanPlay={onCanPlay}
        onError={onVideoError}
        onPlay={onPlay}
        onPause={onPause}
        onSeeked={onSeeked}
      >
        <track kind="captions" label="foo" />
        <source src={videoSrc()} />
      </video>
      <audio ref={audioRef} onCanPlay={onCanPlay} onError={onAudioError}>
        <track kind="captions" label="foo" />
        <source src={audioSrc()} />
      </audio>
      {
        probe.audios.length > 1
          ? (
            <select onChange={onLanguageChange} defaultValue={audioStream}>
              {
                probe.audios.map(({ index, language }) => (
                  <option key={index} value={index}>{language}</option>
                ))
              }
            </select>
          )
          : null
      }
    </>
  );
};

export default Player;
