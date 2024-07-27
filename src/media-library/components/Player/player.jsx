import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import SubtitlesOctopus from 'libass-wasm';

import config from '../../../config';

// import subContent from './test.ass';

import './libass-wasm-overrides.css';

const Player = () => {
  const mediaLibrary = useSelector((state) => state.mediaLibrary);
  const { videoId } = useParams();
  const [transcodeVideo, setTranscodeVideo] = useState(false);
  const [transcodeAudio, setTranscodeAudio] = useState(false);
  const [videoStream, setVideoStream] = useState(-1);
  const [audioStream, setAudioStream] = useState(-1);
  const [subtitle, setSubtitle] = useState(null);
  const [canStart, setCanStart] = useState([]);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const octopus = useRef(null);

  const { probe, path } = (mediaLibrary || []).find(({ id }) => id === videoId) || {};

  const mediaSrc = (type, filepath, streamIndex, transcode) => [
    config.BACKEND_URL,
    `/${type}`,
    `/${encodeURIComponent(filepath)}`,
    `/${streamIndex}`,
    transcode ? '/transcode' : '',
  ]
    .filter((element) => element !== '')
    .join('');

  const videoSrc = () => mediaSrc('video', path, videoStream, transcodeVideo);

  const audioSrc = () => mediaSrc('audio', path, audioStream, transcodeAudio);

  useEffect(() => {
    console.log(canStart);
    if (canStart.length === 2) {
      console.log('Can start');
    }
  }, [canStart]);

  useEffect(() => {
    // console.log(probe);
    if (probe) {
      const { video: vidStream, audios } = probe;
      if (vidStream) {
        setVideoStream(vidStream.index);
      }
      if (audios.length) {
        setAudioStream(audios[0].index);
      }
    }
  }, [probe]);

  useEffect(() => {
    if (subtitle) {
      const { index, codec } = subtitle;

      const subUrl = mediaSrc('subtitle', path, index, codec !== 'ass');

      if (codec === 'ass') {
        if (!octopus.current) {
          console.log('create');

          const fonts = probe.fonts.map(({ filename }) => (
            `${config.BACKEND_URL}/fonts/${encodeURIComponent(path)}/${filename}`
          ));

          octopus.current = new SubtitlesOctopus({
            video: document.querySelector('video'),
            workerUrl: '/libass-wasm/js/subtitles-octopus-worker.js',
            legacyWorkerUrl: '/libass-wasm/js/libassjs-worker-legacy.js',
            subUrl,
            fonts,
            onError: console.log,
          });
        }
      } else {
        console.log('todo sub', codec);
      }
    }

    return () => {
      console.log('dispose');
      try {
        octopus.current?.dispose();
      } catch (err) {
        console.log(err);
      } finally {
        [...document.querySelectorAll('.libassjs-canvas-parent')].forEach((el) => el.remove());
      }

      octopus.current = null;
    };
  }, [subtitle, path, probe]);

  useEffect(() => {
    videoRef.current?.load();
  }, [videoStream, transcodeVideo]);

  useEffect(() => {
    audioRef.current?.load();
  }, [audioStream, transcodeAudio]);

  if (!mediaLibrary.length) return null;

  if (!probe || !path) return null;
  // const video = mediaLibrary[1];

  const onLanguageChange = ({ target }) => {
    audioRef.current?.pause();

    setTranscodeAudio(false);

    setAudioStream(Number(target.value));
  };

  const onSubtitleChange = ({ target }) => {
    setSubtitle(probe.subtitles.find(({ index }) => index === Number(target.value)));
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

  const onPlay = () => { audioRef.current.play(); };
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
      {
        probe.subtitles.length > 1
          ? (
            <select onChange={onSubtitleChange} defaultValue={subtitle?.index}>
              <option value={-1}>subs</option>
              {
                probe.subtitles.map(({ index, language, title }) => (
                  <option key={index} value={index}>{`${title} (${language})`}</option>
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
