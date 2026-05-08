import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SubtitlesOctopus from 'libass-wasm';

import Av from './AV';
import mediaSrc, { fontSrc } from './media-src';
import './libass-wasm-overrides.css';

const Video = ({
  video,
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

  const videoSrc = () => mediaSrc('video', video.path, videoTrack.index, transcodeVideo);
  const audioSrc = () => mediaSrc('audio', video.path, audioTrack.index, transcodeAudio);

  useEffect(() => {
    if (subtitleTrack) {
      console.log('onSubChanged', subtitleTrack);
      const { codec, index } = subtitleTrack;
      // const { path, probe } = video;

      const subUrl = mediaSrc('subtitle', video.path, index, codec !== 'ass');

      if (codec === 'ass') {
        console.log('create', subtitleTrack);

        const octopus = new SubtitlesOctopus({
          fallbackFont: '/fonts/default.woff2',
          fonts: video.probe.fonts.map(({ filename }) => fontSrc(video.path, filename)),
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

      console.log('todo sub', codec);
    }

    return () => null;
  }, [
    subtitleTrack,
    video.path,
    video.probe,
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
  subtitleTrack: PropTypes.shape({
    codec: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
  }),
  video: PropTypes.shape({
    path: PropTypes.string.isRequired,
    probe: PropTypes.shape({
      fonts: PropTypes.arrayOf(PropTypes.shape({
        filename: PropTypes.string.isRequired,
      })).isRequired,
    }).isRequired,
  }).isRequired,
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
