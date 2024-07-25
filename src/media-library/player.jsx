import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import config from '../config';

const Player = () => {
  const mediaLibrary = useSelector((state) => state.mediaLibrary);
  const { videoId } = useParams();
  const [transcodeVideo, setTranscodeVideo] = useState(false);
  const [transcodeAudio, setTranscodeAudio] = useState(false);
  const audioRef = useRef(null);

  if (!mediaLibrary.length) return null;

  if (!videoId) return null;

  const video = mediaLibrary.find(({ id }) => id === videoId);
  // const video = mediaLibrary[1];

  const { path } = video;

  const videoSrc = () => [
    config.BACKEND_URL,
    '/video',
    '/0',
    `/${encodeURIComponent(path)}`,
    transcodeVideo ? '/transcode' : '',
  ]
    .filter((element) => element !== '')
    .join('');

  const audioSrc = () => [
    config.BACKEND_URL,
    '/audio',
    '/1',
    `/${encodeURIComponent(path)}`,
    transcodeAudio ? '/transcode' : '',
  ]
    .filter((element) => element !== '')
    .join('');

  const onError = ({ target }) => {
    const isVideoError = /video/iu.test(target.parentNode.tagName);

    if (isVideoError) {
      if (transcodeVideo === false) {
        setTranscodeVideo(true);
        setTimeout(() => target.parentNode.load(), 0);
      }
    }

    const isAudioError = /audio/iu.test(target.parentNode.tagName);

    if (isAudioError) {
      if (transcodeAudio === false) {
        setTranscodeAudio(true);
        setTimeout(() => target.parentNode.load(), 0);
      }
    }
  };

  const onPlay = () => audioRef.current.play();
  const onPause = () => audioRef.current.pause();
  const onSeeked = ({ target }) => { audioRef.current.currentTime = target.currentTime; };

  return (
    <>
      <video
        controls
        onError={onError}
        onPlay={onPlay}
        onPause={onPause}
        onSeeked={onSeeked}
      >
        <track kind="captions" label="foo" />
        <source src={videoSrc()} type="video/mp4" />
      </video>
      <audio ref={audioRef}>
        <track kind="captions" label="foo" />
        <source src={audioSrc()} type="video/mp4" />
      </audio>
    </>
  );
};

export default Player;
