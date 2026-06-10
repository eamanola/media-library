import React, { useState, useEffect } from 'react';

import Av from './AV';
import subtitle from './subtitles';
import mediaSrc from './media-src';
import onMediaError from './media-error';
import './libass-wasm-overrides.css';
import logger from '../../../../logger';
import { SELECTOR_AUDIO, SELECTOR_VIDEO } from '../../../config';

const Video = ({
  audioTrack = null,
  controls,
  fonts = null,
  onEnded = null,
  onReady = null,
  onTimeUpdate = null,
  subtitleTrack = null,
  videoId,
  videoTrack,

}) => {
  const [transcodeAudio, setTranscodeAudio] = useState(false);
  const [transcodeVideo, setTranscodeVideo] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(audioTrack);

  useEffect(() => {
    if (subtitleTrack) {
      logger.log('onSubChanged', subtitleTrack);
      const dispose = subtitle(videoId, subtitleTrack, fonts);

      return dispose;
    }

    return () => null;
  }, [
    subtitleTrack,
    videoId,
    fonts,
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
    const audioEl = document.querySelector(SELECTOR_AUDIO);

    console.log('audio error:', audioTrack, 'transode:', transcodeAudio);
    console.log(audioEl.error);
    console.log(err);

    const { transcode } = onMediaError(audioEl);

    if (transcode && transcodeAudio === false) {
      setTranscodeAudio(true);
      console.log('transcoding audio');
    }
  };

  const onVideoError = (err) => {
    const videoEl = document.querySelector(SELECTOR_VIDEO);

    console.log('video error:', videoTrack, 'transode:', transcodeVideo);
    console.log(videoEl.error);
    console.log(err);

    const { transcode } = onMediaError(videoEl);

    if (transcode && transcodeVideo === false) {
      setTranscodeVideo(true);
      console.log('transcoding video');
    }
  };

  const onVideoEnded = (e) => {
    setTranscodeAudio(false);
    setTranscodeVideo(false);

    if (onEnded) {
      onEnded(e);
    }
  };

  const videoSrc = mediaSrc('video', videoId, videoTrack.index, transcodeVideo);
  const audioSrc = mediaSrc('audio', videoId, audioTrack.index, transcodeAudio);

  return (
    <Av
      audioSrc={audioTrack ? audioSrc : null}
      controls={controls}
      onAudioError={audioTrack ? onAudioError : null}
      onEnded={onVideoEnded}
      onReady={onReady}
      onTimeUpdate={onTimeUpdate}
      onVideoError={onVideoError}
      videoSrc={videoSrc}
    />
  );
};

export default Video;
