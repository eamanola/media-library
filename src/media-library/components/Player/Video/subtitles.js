import SubtitlesOctopus from 'libass-wasm';

import mediaSrc, { fontSrc } from './media-src';
import logger from '../../../../logger';
import { SELECTOR_VIDEO } from '../../../config';

const ass = ({ fonts, src, videoId }) => {
  logger.log('subtitles: ass');

  const octopus = new SubtitlesOctopus({
    fallbackFont: '/fonts/default.woff2',
    fonts: fonts.map(({ filename }) => fontSrc(videoId, filename)),
    lazyFileLoading: true,
    legacyWorkerUrl: '/libass-wasm/js/libassjs-worker-legacy.js',
    // lossyRender: 'js-blend',
    lossyRender: 'wasm-blend',
    onError: console.error,
    subUrl: src,
    video: document.querySelector(SELECTOR_VIDEO),
    workerUrl: '/libass-wasm/js/subtitles-octopus-worker.js',
  });

  return () => {
    logger.log('subtitles: dispose ass');

    octopus.dispose();
  };
};

const webvtt = ({ language, src, title }) => {
  logger.log('subtitles: webvtt');

  const track = document.createElement('track');
  track.setAttribute('label', title || language);
  track.setAttribute('kind', 'subtitles');
  track.setAttribute('srclang', language);
  track.setAttribute('src', src);
  // track.setAttribute('default', true);

  const videoEl = document.querySelector(SELECTOR_VIDEO);
  videoEl.appendChild(track);

  const { textTracks } = videoEl;
  const latestTract = textTracks[textTracks.length - 1];
  latestTract.mode = 'showing';

  return () => {
    logger.log('subtitles: remove webvtt');

    latestTract.mode = 'disabled';
    track.remove();
  };
};

const subtitle = (videoId, subtitleTrack, fonts) => {
  const { codec, index } = subtitleTrack;

  const transcode = !['ass', 'webvtt'].includes(codec);
  if (transcode) { console.warn('todo sub', codec); }

  const src = mediaSrc('subtitle', videoId, index, transcode);

  if (codec === 'ass') {
    const dispose = ass({ fonts, src, videoId });

    return dispose;
  }

  // transcode will defaults to webvtt - save round trip
  // playlist-manager-server formats for more info
  if (codec === 'webvtt' || transcode) {
    const { language, title } = subtitleTrack;
    const dispose = webvtt({ language, src, title });

    return dispose;
  }

  return () => null;
};

export {
  ass,
  webvtt,
};

export default subtitle;
