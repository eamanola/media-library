import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SubtitlesOctopus from 'libass-wasm';

import Av from './AV';
import mediaSrc, { fontSrc } from './media-src';
import './libass-wasm-overrides.css';

const Video = ({
  path,
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

  const videoSrc = () => mediaSrc('video', path, videoTrack.index, transcodeVideo);
  const audioSrc = () => mediaSrc('audio', path, audioTrack.index, transcodeAudio);

  useEffect(() => {
    if (subtitleTrack) {
      console.log('onSubChanged', subtitleTrack);
      const { codec, index } = subtitleTrack;

      const subUrl = mediaSrc('subtitle', path, index, codec !== 'ass');

      if (codec === 'ass') {
        console.log('create', subtitleTrack);

        const octopus = new SubtitlesOctopus({
          fallbackFont: '/fonts/default.woff2',
          fonts: probe.fonts.map(({ filename }) => fontSrc(path, filename)),
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
          console.log('dispose', subtitleTrack);
          octopus.dispose();
        };
      }

      if (codec === 'webvtt') {
        console.log('TODO wtt', subtitleTrack);
        const { language } = subtitleTrack;
        const track = document.createElement('track');
        track.setAttribute('label', language);
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
          latestTract.mode = 'disabled';
          track.remove();
        };
      }

      console.warn('todo sub', codec);
    }

    return () => null;
  }, [
    subtitleTrack,
    path,
    probe,
  ]);

  // onAudioChanged
  if (currentAudio !== audioTrack) {
    console.log('onAudioChanged', audioTrack);
    setCurrentAudio(audioTrack);
    setTranscodeAudio(false);
  }

  // video cannot change, only 1 video track

  const onAudioError = (err) => {
    if (transcodeAudio === false) {
      setTranscodeAudio(true);
    }
    console.log('audio', err);
  };

  const onVideoError = (err) => {
    if (transcodeVideo === false) {
      setTranscodeVideo(true);
    }
    console.log('video', err);
  };

  const onVideoEnded = (e) => {
    setTranscodeAudio(false);
    setTranscodeVideo(false);

    if (onEnded) {
      onEnded(e);
    }
  };

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

Video.propTypes = {
  audioTrack: PropTypes.shape({ index: PropTypes.number.isRequired }),
  onEnded: PropTypes.func,
  onReady: PropTypes.func,
  onTimeUpdate: PropTypes.func,
  path: PropTypes.string.isRequired,
  probe: PropTypes.shape({
    fonts: PropTypes.arrayOf(PropTypes.shape({
      filename: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  subtitleTrack: PropTypes.shape({
    codec: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
  }),
  videoTrack: PropTypes.shape({ index: PropTypes.number.isRequired }).isRequired,
};

Video.defaultProps = {
  audioTrack: null,
  onEnded: null,
  onReady: null,
  onTimeUpdate: null,
  subtitleTrack: null,
};

export default Video;
