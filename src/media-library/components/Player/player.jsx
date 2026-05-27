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
  const mediaLibrary = useSelector((state) => state.mediaLibrary);
  const dispatch = useDispatch();

  const { videoId } = useParams();
  const [videoStream, setVideoStream] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [subtitleStream, setSubtitleStream] = useState(SUBS_UNSET);
  const [loading, setLoading] = useState(true);
  const [showNext, setShowNext] = useState(false);
  const [hideUI, setHideUI] = useState(false);

  const video = (mediaLibrary || []).find(({ id }) => id === videoId);

  if (video?.probe) {
    const { audios, video: vidStream } = video.probe;
    if (audioStream === null && audios.length) {
      const prefAudio = audios.find(({ language }) => language === PREF_LANG);

      console.log('set audio');
      setAudioStream(prefAudio || audios[0]);
    }

    if (videoStream === null && vidStream) {
      setVideoStream(vidStream);
    }
  }

  useEffect(() => {
    if (video && !video.probe) {
      console.log('probe');
      dispatch(getProbes([video]));
    }
  }, [video, dispatch]);

  useEffect(() => {
    console.log('set video');
  }, [videoStream]);

  useEffect(() => {
    console.log('set audio');
  }, [audioStream]);

  if (!videoStream) {
    return null;
  }

  const onLanguageChange = ({ target }) => {
    const { probe } = video;
    setAudioStream(probe.audios.find(({ index }) => index === Number(target.value)));
  };

  const onSubtitleChange = ({ target }) => {
    const { probe } = video;
    setSubtitleStream(
      probe.subtitles.find(({ index }) => index === Number(target.value)) || SUBS_REMOV,
    );
  };

  const onReady = (isReady) => {
    setLoading(!isReady);

    if (isReady && subtitleStream === SUBS_UNSET) {
      const { subtitles } = video.probe;
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
    const { probe } = video;
    const { duration } = probe;

    if (currentTime >= duration * 0.90) {
      const { played } = video;

      if (played?.isPlayed !== true) {
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
            subtitleTrack={subtitleStream}
            video={video}
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
            <Controls hide={hideUI} onFullscreen={toggleFullscreen} />
          )}
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          textAlign: 'center',
        }}
      >
        {video.probe?.audios.length > 1 && (
          <select onChange={onLanguageChange} value={audioStream.index}>

            {
              video.probe.audios.map(({ index, language }) => (
                <option key={index} value={index}>
                  {language}
                </option>
              ))
            }

          </select>
        )}

        {video.probe?.subtitles.length > 1 && (
          <select onChange={onSubtitleChange} value={subtitleStream?.index}>
            <option value={-1}>
              no subs
            </option>

            {
              video.probe.subtitles.map(({ index, language, title }) => (
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
