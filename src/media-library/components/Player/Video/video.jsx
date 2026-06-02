import React, { useState, useEffect } from 'react';
import SubtitlesOctopus from 'libass-wasm';

import Av from './AV';
import mediaSrc, { fontSrc } from './media-src';
import './libass-wasm-overrides.css';
import logger from '../../../../logger';

const Video = ({
  id,
  probe,
  videoTrack,
  audioTrack = null,
  subtitleTrack = null,
  onReady = null,
  onTimeUpdate = null,
  onEnded = null,
}) => {
  const [transcodeAudio, setTranscodeAudio] = useState(false);
  const [transcodeVideo, setTranscodeVideo] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(audioTrack);

  useEffect(() => {
    if (subtitleTrack) {
      logger.log('onSubChanged', subtitleTrack);
      const { codec, index } = subtitleTrack;

      const supported = ['ass', 'webvtt'].includes(codec);
      if (!supported) { console.warn('todo sub', codec); }

      const transcode = !supported;
      const subUrl = mediaSrc('subtitle', id, index, transcode);

      if (codec === 'ass') {
        logger.log('create', subtitleTrack);

        const octopus = new SubtitlesOctopus({
          fallbackFont: '/fonts/default.woff2',
          fonts: probe.fonts.map(({ filename }) => fontSrc(id, filename)),
          lazyFileLoading: true,
          legacyWorkerUrl: '/libass-wasm/js/libassjs-worker-legacy.js',
          // lossyRender: 'js-blend',
          lossyRender: 'wasm-blend',
          onError: console.error,
          subUrl,
          video: document.querySelector('video'),
          workerUrl: '/libass-wasm/js/subtitles-octopus-worker.js',
        });

        return () => {
          logger.log('dispose', subtitleTrack);
          octopus.dispose();
        };
      }

      // transcode defaults to webvtt
      // playlist-manager-server formats for more info
      if (codec === 'webvtt' || transcode) {
        logger.log('webvtt');
        const { language, title } = subtitleTrack;
        const track = document.createElement('track');
        track.setAttribute('label', title || language);
        track.setAttribute('kind', 'subtitles');
        track.setAttribute('srclang', language);
        track.setAttribute('src', subUrl);
        // track.setAttribute('default', true);

        const videoEl = document.querySelector('video');
        videoEl.appendChild(track);

        const { textTracks } = videoEl;
        const latestTract = textTracks[textTracks.length - 1];
        latestTract.mode = 'showing';

        return () => {
          logger.log('webvtt remove');
          latestTract.mode = 'disabled';
          track.remove();
        };
      }
    }

    return () => null;
  }, [
    subtitleTrack,
    id,
    probe,
  ]);

  useEffect(() => {
    logger.log('redraw Video');
  }, []);

  // onAudioChanged
  if (currentAudio !== audioTrack) {
    logger.log('onAudioChanged', audioTrack);
    setCurrentAudio(audioTrack);
    setTranscodeAudio(false);
  }

  // video cannot change, only 1 video track

  const onAudioError = (err) => {
    if (transcodeAudio === false) {
      setTranscodeAudio(true);
      console.log('transcoding audio', 'was:', audioTrack);
    } else {
      console.error('audio', err);
    }
  };

  const onVideoError = (err) => {
    if (transcodeVideo === false) {
      setTranscodeVideo(true);
      console.log('transcoding video', 'was:', videoTrack);
    } else {
      console.error('video', err);
    }
  };

  const onVideoEnded = (e) => {
    setTranscodeAudio(false);
    setTranscodeVideo(false);

    if (onEnded) {
      onEnded(e);
    }
  };

  const videoSrc = () => mediaSrc('video', id, videoTrack.index, transcodeVideo);
  const audioSrc = () => mediaSrc('audio', id, audioTrack.index, transcodeAudio);

  return (
    <Av
      audioSrc={audioTrack ? audioSrc() : null}
      onAudioError={audioTrack ? onAudioError : null}
      onEnded={onVideoEnded}
      onReady={onReady}
      onTimeUpdate={onTimeUpdate}
      onVideoError={onVideoError}
      videoSrc={videoSrc()}
    />
  );
};

export default Video;
