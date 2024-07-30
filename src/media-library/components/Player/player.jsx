import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import SubtitlesOctopus from 'libass-wasm';

import config from '../../../config';

// import subContent from './test.ass';

import AV from './AV';
import mediaSrc from './media-src';
import './libass-wasm-overrides.css';
import './styles.css';

const Player = () => {
  const mediaLibrary = useSelector((state) => state.mediaLibrary);
  const { videoId } = useParams();
  const [videoStream, setVideoStream] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [subtitle, setSubtitle] = useState(null);

  const octopus = useRef(null);
  const containerRef = useRef(null);

  const { probe, path } = (mediaLibrary || []).find(({ id }) => id === videoId) || {};

  useEffect(() => {
    // console.log(probe);
    if (probe) {
      const { video: vidStream, audios } = probe;
      if (vidStream) {
        setVideoStream(vidStream);
      }
      if (audios.length) {
        setAudioStream(audios[0]);
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

  if (!mediaLibrary.length) return null;

  if (!probe || !path) return null;
  // const video = mediaLibrary[1];

  if (!videoStream || !audioStream) {
    return null;
  }

  const onLanguageChange = ({ target }) => {
    setAudioStream(probe.audios.find(({ index }) => index === Number(target.value)));
  };

  const onSubtitleChange = ({ target }) => {
    setSubtitle(probe.subtitles.find(({ index }) => index === Number(target.value)));
  };

  const toFullscreen = () => containerRef.current?.requestFullscreen();

  return (
    <>
      <div
        ref={containerRef}
        className="content"
      >
        <AV
          path={path}
          videoStream={videoStream}
          audioStream={audioStream}
        />
      </div>
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
      <button type="button" onClick={toFullscreen}>FS</button>
    </>
  );
};

export default Player;
