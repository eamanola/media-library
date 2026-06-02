import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router';

// import subContent from './test.ass';
import { actions } from '../../reducers';
import Video from './Video';
import './styles.css';
import Controls from './Controls';
import logger from '../../../logger';

const { getProbes, togglePlayed } = actions;

const PREF_LANG = 'jpn';
const PREF_SUBS = 'eng';
const SUBS_UNSET = undefined;
const SUBS_REMOV = null;

const CUSTOM_CONTROLS = true;
let hideUITimeout = 0;
const HIDE_UI_TIMEOUT = 5000;

const toggleFullscreen = () => {
  const wrapper = document.querySelector('.player');

  if (document.fullscreenElement === wrapper) {
    document.exitFullscreen();
  } else {
    wrapper.requestFullscreen();
  }
};

const onDoubleClick = (e) => {
  e.preventDefault();
  e.stopPropagation();
  toggleFullscreen();
};

const togglePlay = () => {
  const videoEl = document.querySelector('.player video');
  if (videoEl.paused) {
    videoEl.play();
  } else {
    videoEl.pause();
  }
};

const onClick = (e) => {
  const videoEl = document.querySelector('.player video');
  // let controls events through
  if (e.target === videoEl) {
    e.preventDefault();
    e.stopPropagation();
    togglePlay(e.target);
  }
};

const onKeyUp = (e) => {
  if (e.key === ' ') {
    e.preventDefault();
    e.stopPropagation();
    togglePlay(e.target);
  }
};

const onEnded = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
};

const Player = () => {
  const dispatch = useDispatch();
  const mediaLibrary = useSelector(({ mediaLibrary: state }) => state);
  const played = useSelector(({ played: state }) => state);
  const { videoId } = useParams();

  const [videoStream, setVideoStream] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [subtitleStream, setSubtitleStream] = useState(SUBS_UNSET);
  const [loading, setLoading] = useState(true);
  const [showNext, setShowNext] = useState(false);
  const [hideUI, setHideUI] = useState(false);

  const findVideo = (aFolder) => {
    const videos = aFolder.children.filter(({ video }) => !!video);
    const found = videos.find(({ video }) => video.displayId === videoId);
    if (found) {
      const index = videos.indexOf(found);
      const nextOne = index >= 0 && index < videos.length ? videos[index + 1] : null;
      return {
        current: found,
        next: nextOne,
      };
    }

    const subFolders = aFolder.children.filter(({ children }) => Array.isArray(children));
    for (let i = 0; i < subFolders.length; i += 1) {
      const respone = findVideo(subFolders[i]);
      if (respone !== null) return respone;
    }

    return null;
  };

  const previous = null;
  const { current, next } = mediaLibrary.length > 0 ? findVideo(mediaLibrary[0]) : {};

  const { probe } = useSelector(
    (({ probes }) => probes.find(({ probeId }) => probeId === current?.video.realId)),
  ) || {};

  if (probe) {
    const { audios, video } = probe;
    if (audioStream === null && audios.length) {
      const prefAudio = audios.find(({ language }) => language === PREF_LANG);

      setAudioStream(prefAudio || audios[0]);
    }

    if (videoStream === null && video) {
      setVideoStream(video);
    }
  }

  useEffect(() => {
    if (dispatch && current && !probe) {
      dispatch(getProbes([current.video]));
    }
  }, [
    dispatch,
    probe,
    current,
  ]);

  useEffect(() => {
    logger.log('redraw Player');
  }, []);

  useEffect(() => {
    logger.log('set media lib', mediaLibrary);
  }, [mediaLibrary]);

  useEffect(() => {
    logger.log('set played', played);
  }, [played]);

  useEffect(() => {
    logger.log('set probe', probe);
  }, [probe]);

  useEffect(() => {
    logger.log('set videoId', videoId);
  }, [videoId]);

  useEffect(() => {
    logger.log('set videoStream', videoStream);
  }, [videoStream]);

  useEffect(() => {
    logger.log('set audioStream', audioStream);
  }, [audioStream]);

  useEffect(() => {
    logger.log('set subtitleStream', subtitleStream);
  }, [subtitleStream]);

  useEffect(() => {
    logger.log('set loading', loading);
  }, [loading]);

  useEffect(() => {
    logger.log('set showNext', showNext);
  }, [showNext]);

  useEffect(() => {
    logger.log('set hideUI', hideUI);
  }, [hideUI]);

  if (!current || !probe) return null;

  const onLanguageChange = ({ target }) => {
    setAudioStream(probe.audios.find(({ index }) => index === Number(target.value)));
  };

  const onSubtitleChange = ({ target }) => {
    setSubtitleStream(
      probe.subtitles.find(({ index }) => index === Number(target.value)) || SUBS_REMOV,
    );
  };

  const onReady = (isReady) => {
    setLoading(!isReady);

    if (isReady && subtitleStream === SUBS_UNSET) {
      const { subtitles } = probe;
      if (subtitles.length) {
        const prefSubtitle = subtitles.find(({ language, title }) => (
          language === PREF_SUBS && !/forced/ui.test(title)
        ));
        if (prefSubtitle) {
          setSubtitleStream(prefSubtitle);
        }
      }
    }
  };

  const onTimeUpdate = ({ target }) => {
    const { currentTime } = target;
    const { duration } = probe;

    if (currentTime >= duration * 0.90) {
      const playedObj = played.find(({ mediaId }) => current.video.displayId === mediaId);

      if (playedObj?.isPlayed !== true) {
        dispatch(togglePlayed(current.video));
        console.log('played');
      }

      setShowNext(!!next);
    } else {
      setShowNext(false);
    }
  };

  // mediaLibrary[mediaLibrary.indexOf(video) - 1];
  // const next = null;
  // mediaLibrary[mediaLibrary.indexOf(video) + 1];

  let titleString = current.video.title;
  titleString = `${titleString}${current.video.season ? ` S${current.video.season}` : ''}`;
  titleString = `${titleString}${current.video.episode ? ` E${current.video.episode}` : ''}`;

  const showUI = () => {
    if (hideUITimeout) {
      clearTimeout(hideUITimeout);
    }

    hideUITimeout = setTimeout(() => {
      setHideUI(true);
      hideUITimeout = 0;
    }, HIDE_UI_TIMEOUT);

    if (hideUI) {
      setHideUI(false);
    }
  };

  const classNames = ['player'];
  if (loading) classNames.push('loading');
  if (hideUI) classNames.push('hide-ui');

  return (
    <>
      <div
        className={classNames.join(' ')}
        onClick={CUSTOM_CONTROLS === true ? onClick : null}
        onDoubleClick={CUSTOM_CONTROLS === true ? onDoubleClick : null}
        onKeyUp={CUSTOM_CONTROLS === true ? onKeyUp : null}
        onMouseMove={CUSTOM_CONTROLS === true ? showUI : null}
      >

        <div className="loading-screen">
          {/* eslint-disable-next-line react/jsx-max-depth */}
          <span>
            Loading...
          </span>
        </div>

        <div className="video">
          {/* eslint-disable-next-line react/jsx-max-depth */}
          <Video
            audioTrack={audioStream}
            controls={!CUSTOM_CONTROLS}
            id={current.video.realId}
            onEnded={onEnded}
            onReady={onReady}
            onTimeUpdate={onTimeUpdate}
            probe={probe}
            subtitleTrack={subtitleStream}
            videoTrack={videoStream}
          />

          {!!next && (
            <span
              style={{
                background: '#fff7',
                borderRadius: '10%',
                display: showNext ? 'unset' : 'none',
                padding: '0.25em 0.5em',
                position: 'absolute',
                right: '10%',
                top: '50%',
              }}
            >
              <Link reloadDocument to={`/player/${next.video.displayId}`}>
                next
              </Link>
            </span>
          )}

          {(CUSTOM_CONTROLS === true) && (
            <Controls
              hide={hideUI}
              onFullscreen={toggleFullscreen}
              probe={probe}
            />
          )}
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          textAlign: 'center',
        }}
      >
        {probe?.audios.length > 1 && (
          <select onChange={onLanguageChange} value={audioStream?.index}>

            {
              probe.audios.map(({ index, language }) => (
                <option key={index} value={index}>
                  {language}
                </option>
              ))
            }

          </select>
        )}

        {probe?.subtitles.length > 1 && (
          <select onChange={onSubtitleChange} value={subtitleStream?.index}>
            <option value={-1}>
              no subs
            </option>

            {
              probe.subtitles.map(({ index, language, title }) => (
                <option key={index} value={index}>
                  {`${title} (${language})`}
                </option>
              ))
            }

          </select>
        )}

        {!!previous && (
          <Link reloadDocument to={`/player/${previous.displayId}`}>
            previous
          </Link>
        )}

        {!!next && (
          <Link reloadDocument to={`/player/${next.video.displayId}`}>
            next
          </Link>
        )}

        <span>
          {titleString}
        </span>
      </div>
    </>
  );
};

export default Player;
