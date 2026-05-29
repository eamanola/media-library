import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router';

// import subContent from './test.ass';
import { actions } from '../../reducers';
import Video from './Video';
import './styles.css';
import Controls from './Controls';

const { getProbes, togglePlayed } = actions;

const PREF_LANG = 'jpn';
const PREF_SUBS = 'eng';
const SUBS_UNSET = undefined;
const SUBS_REMOV = null;

const CUSTOM_CONTROLS = true;
let hideUITimeout = 0;

const toggleFullscreen = () => {
  const wrapper = document.querySelector('.video-container');

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
  const videoEl = document.querySelector('.video-container video');
  if (videoEl.paused) {
    videoEl.play();
  } else {
    videoEl.pause();
  }
};

const onClick = (e) => {
  const videoEl = document.querySelector('.video-container video');
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
  const mediaLibrary = useSelector(({ mediaLibrary: state }) => state);
  const played = useSelector(({ played: state }) => state);
  const dispatch = useDispatch();

  const { videoId } = useParams();
  const [videoStream, setVideoStream] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [subtitleStream, setSubtitleStream] = useState(SUBS_UNSET);
  const [loading, setLoading] = useState(true);
  const [showNext, setShowNext] = useState(false);
  const [hideUI, setHideUI] = useState(false);

  const video = (mediaLibrary || []).find(({ id }) => id === videoId);
  const { probe } = useSelector(
    (({ probes }) => probes.find(({ path }) => path === video.path)),
  ) || {};

  if (probe) {
    const { audios, video: vidStream } = probe;
    if (audioStream === null && audios.length) {
      const prefAudio = audios.find(({ language }) => language === PREF_LANG);

      setAudioStream(prefAudio || audios[0]);
    }

    if (videoStream === null && vidStream) {
      setVideoStream(vidStream);
    }
  }

  useEffect(() => {
    if (video && !probe) {
      dispatch(getProbes([video]));
    }
  }, [
    dispatch,
    probe,
    video,
  ]);

  // useEffect(() => {
  //   console.log('set media lib', mediaLibrary);
  // }, [mediaLibrary]);

  // useEffect(() => {
  //   console.log('set played', played);
  // }, [played]);

  // useEffect(() => {
  //   console.log('set probe', probe);
  // }, [probe]);

  // useEffect(() => {
  //   console.log('set videoId', videoId);
  // }, [videoId]);

  // useEffect(() => {
  //   console.log('set videoStream', videoStream);
  // }, [videoStream]);

  // useEffect(() => {
  //   console.log('set audioStream', audioStream);
  // }, [audioStream]);

  // useEffect(() => {
  //   console.log('set subtitleStream', subtitleStream);
  // }, [subtitleStream]);

  // useEffect(() => {
  //   console.log('set loading', loading);
  // }, [loading]);

  // useEffect(() => {
  //   console.log('set showNext', showNext);
  // }, [showNext]);

  // useEffect(() => {
  //   console.log('set hideUI', hideUI);
  // }, [hideUI]);

  if (!videoStream) {
    return null;
  }

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
      const current = played.find(({ mediaId }) => video.id === mediaId);

      if (current?.isPlayed !== true) {
        dispatch(togglePlayed(video));
        console.log('played');
      }

      setShowNext(true);
    } else {
      setShowNext(false);
    }
  };

  const previous = mediaLibrary[mediaLibrary.indexOf(video) - 1];
  const next = mediaLibrary[mediaLibrary.indexOf(video) + 1];

  let titleString = video.title;
  titleString = `${titleString}${video.season ? ` S${video.season}` : ''}`;
  titleString = `${titleString}${video.episode ? ` E${video.episode}` : ''}`;

  const showUI = () => {
    if (hideUITimeout) {
      clearTimeout(hideUITimeout);
    }

    hideUITimeout = setTimeout(() => {
      setHideUI(true);
      hideUITimeout = 0;
    }, 4000);

    if (hideUI) {
      setHideUI(false);
    }
  };

  const classNames = ['video-container'];
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
        {!!loading && (
          <div className="loading-screen">
            <span>
              Loading...
            </span>
          </div>
        )}

        <div
          className="video"
          style={{ visibility: loading ? 'hidden' : 'visible' }}
        >
          {/* eslint-disable-next-line react/jsx-max-depth */}
          <Video
            audioTrack={audioStream}
            controls={!CUSTOM_CONTROLS}
            onEnded={onEnded}
            onReady={onReady}
            onTimeUpdate={onTimeUpdate}
            path={video.path}
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
              <Link reloadDocument to={`/player/${next.id}`}>
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
          <select onChange={onLanguageChange} value={audioStream.index}>

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
          <Link reloadDocument to={`/player/${previous.id}`}>
            previous
          </Link>
        )}

        {!!next && (
          <Link reloadDocument to={`/player/${next.id}`}>
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
