import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SubtitlesOctopus from 'libass-wasm';

import AV from './AV';

import mediaSrc, { fontSrc } from './media-src';

import './libass-wasm-overrides.css';

const Video = ({
  video,
  videoTrack,
  audioTrack = null,
  subtitleTrack = null,
  onReady = null,
}) => {
  const [transcodeAudio, setTranscodeAudio] = useState(false);
  const [transcodeVideo, setTranscodeVideo] = useState(false);

  const videoSrc = () => mediaSrc('video', video.path, videoTrack.index, transcodeVideo);
  const audioSrc = () => mediaSrc('audio', video.path, audioTrack.index, transcodeAudio);

  useEffect(() => {
    if (video && subtitleTrack) {
      const { codec, index } = subtitleTrack;
      const { path, probe } = video;

      const subUrl = mediaSrc('subtitle', path, index, codec !== 'ass');

      if (codec === 'ass') {
        console.log('create', subtitleTrack);

        const octopus = new SubtitlesOctopus({
          video: document.querySelector('video'),
          workerUrl: '/libass-wasm/js/subtitles-octopus-worker.js',
          legacyWorkerUrl: '/libass-wasm/js/libassjs-worker-legacy.js',
          subUrl,
          fonts: probe.fonts.map(({ filename }) => fontSrc(path, filename)),
          onError: console.error,
        });

        return () => {
          console.log('dispose', subtitleTrack);
          octopus.dispose();
        };
      }

      console.log('todo sub', codec);
    }

    return () => null;
  }, [subtitleTrack, video]);

  useEffect(() => {
    setTranscodeAudio(false);
  }, [audioTrack]);

  // only 1 video track, cant change
  // useEffect(() => {
  //   setTranscodeVideo(false);
  // }, [videoTrack]);

  const onAudioError = () => {
    if (transcodeAudio === false) {
      setTranscodeAudio(true);
    }
  };

  const onVideoError = () => {
    if (transcodeVideo === false) {
      setTranscodeVideo(true);
    }
  };

  return (
    <AV
      audioSrc={audioTrack ? audioSrc() : null}
      videoSrc={videoSrc()}
      onAudioError={audioTrack ? onAudioError : null}
      onVideoError={onVideoError}
      onReady={onReady}
    />
  );
};

Video.propTypes = {
  video: PropTypes.shape({
    path: PropTypes.string.isRequired,
    probe: PropTypes.shape({
      fonts: PropTypes.arrayOf(PropTypes.shape({
        filename: PropTypes.string.isRequired,
      })).isRequired,
    }).isRequired,
  }).isRequired,
  audioTrack: PropTypes.shape({ index: PropTypes.number.isRequired }),
  videoTrack: PropTypes.shape({ index: PropTypes.number.isRequired }).isRequired,
  subtitleTrack: PropTypes.shape({
    codec: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
  }),
  onReady: PropTypes.func,
};

export default Video;
