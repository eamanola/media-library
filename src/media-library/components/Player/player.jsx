import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';

// import subContent from './test.ass';
import { actions } from '../../reducers';

import Video from './Video';

import './styles.css';

const { getProbes, togglePlayed } = actions;

const PREF_LANG = 'jpn';
const PREF_SUBS = 'eng';
const SUBS_UNSET = undefined;
const SUBS_REMOV = null;

const Player = () => {
  const mediaLibrary = useSelector((state) => state.mediaLibrary);
  const dispatch = useDispatch();

  const { videoId } = useParams();
  const [videoStream, setVideoStream] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [subtitleStream, setSubtitleStream] = useState(SUBS_UNSET);
  const [loading, setLoading] = useState(true);
  const [showNext, setShowNext] = useState(false);

  const containerRef = useRef(null);

  const video = (mediaLibrary || []).find(({ id }) => id === videoId);

  useEffect(() => {
    if (video?.probe) {
      const { audios, video: vidStream } = video.probe;
      if (audioStream === null && audios.length) {
        const prefAudio = audios.find(({ language }) => language === PREF_LANG);

        setAudioStream(prefAudio || audios[0]);
      }

      if (videoStream === null && vidStream) {
        setVideoStream(vidStream);
      }
    }
  }, [video, videoStream, audioStream]);

  useEffect(() => {
    if (video && !video.probe) {
      console.log('probe');
      dispatch(getProbes([video]));
    }
  }, [video, dispatch]);

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

  const toFullscreen = () => containerRef.current?.requestFullscreen();

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

  const onEnded = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const previous = mediaLibrary[mediaLibrary.indexOf(video) - 1];
  const next = mediaLibrary[mediaLibrary.indexOf(video) + 1];

  return (
    <>
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          textAlign: 'center',
        }}
      >
        { loading && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}
          >
            <span>Loading...</span>
          </div>
        )}
        <div
          style={{
            visibility: loading ? 'hidden' : 'visible',
            position: 'relative',
          }}
        >
          <Video
            video={video}
            videoTrack={videoStream}
            audioTrack={audioStream}
            subtitleTrack={subtitleStream}
            onReady={onReady}
            onTimeUpdate={onTimeUpdate}
            onEnded={onEnded}
          />
          {
            next && (
              <Link
                to={`/player/${next.id}`}
                reloadDocument
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '10%',
                  background: '#fffa',
                  borderRadius: '10%',
                  padding: '0.25em 0.5em',
                  display: showNext ? 'unset' : 'none',
                }}
              >
                next
              </Link>
            )
          }
        </div>
      </div>
      {
        video.probe?.audios.length > 1
          ? (
            <select onChange={onLanguageChange} value={audioStream.index}>
              {
                video.probe.audios.map(({ index, language }) => (
                  <option
                    key={index}
                    value={index}
                  >
                    {language}
                  </option>
                ))
              }
            </select>
          )
          : null
      }
      {
        video.probe?.subtitles.length > 1
          ? (
            <select onChange={onSubtitleChange} value={subtitleStream?.index}>
              <option value={-1}>subs</option>
              {
                video.probe.subtitles.map(({ index, language, title }) => (
                  <option key={index} value={index}>{`${title} (${language})`}</option>
                ))
              }
            </select>
          )
          : null
      }
      <button type="button" onClick={toFullscreen}>FS</button>
      {previous && <Link to={`/player/${previous.id}`} reloadDocument>previous</Link>}
      {next && <Link to={`/player/${next.id}`} reloadDocument>next</Link>}
    </>
  );
};

export default Player;
