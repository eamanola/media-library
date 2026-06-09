import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';

import { actions } from '../../reducers';
import SubFolder from '../SubFolder';
import MediaItem from '../MediaItem';
import { jumpList, nextSelected } from './keyboard';
import { PATH_PLAYER } from '../../config';
import './styles.css';

const ENABLE_REMOTE = true;

const {
  togglePlayed,
  play,
} = actions;

const MediaList = ({ list = null, title }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // TODO:
  const [selected, setSelected] = useState(null);
  const mediaList = useRef(null);

  useEffect(() => {
    if (selected) {
      const current = mediaList.current.querySelector(`[data-selected-id="${selected}"]`);
      current.scrollIntoView(
        { behavior: 'smooth', block: 'center', inline: 'nearest' },
      );
    }
  }, [selected]);

  if (list === null) return null;

  const onPlay = (video) => () => {
    dispatch(play(video));
  };

  const onPlayExp = ({ displayId }) => () => {
    const folderPath = pathname === '/' ? `/${title}` : pathname;
    navigate(`/${PATH_PLAYER}${folderPath}/${displayId}`);
  };

  const onTogglePlayed = (video) => () => {
    dispatch(togglePlayed(video));
  };

  const onKeyDown = (e) => {
    const { key } = e;
    const params = {
      key,
      target: mediaList.current.querySelector(`[data-selected-id="${selected}"]`),
    };

    let next;

    try {
      next = nextSelected(params);
    } catch ({ message, suggestion }) {
      console.log(message);
      next = jumpList(params) || suggestion;
    }

    if (next) {
      e.preventDefault();
      e.stopPropagation();

      next.focus();
    }
  };

  const onFocus = ({ target }) => {
    // to mix tab and arrow key navigations
    // when [data-selected-id] not present
    // traverse from target to parent with [data-selected-id] (max at .media-list)
    // and set selected
    const selectedId = target.getAttribute('data-selected-id');
    if (selectedId) {
      // label.played fires after .media-list
      setTimeout(() => setSelected(selectedId), 100);
    }
  };

  return (
    <>
      <h4>
        {title}
      </h4>

      <div
        className="media-list"
        ref={mediaList}
        role="presentation"
      >
        {
          list.map((item) => (item.isSubFolder
            ? (
              <SubFolder
                key={item.title}
                onFocus={ENABLE_REMOTE ? onFocus : null}
                onKeyDown={ENABLE_REMOTE ? onKeyDown : null}
                path={item.path}
                selectedId={item.title}
                title={item.title}
                unPlayed={item.unPlayed}
              />
            )
            : (
              <MediaItem
                duration={item.duration}
                hasProbe={item.hasProbe}
                isPlayed={item.isPlayed}
                key={item.video.videoId}
                onFocus={ENABLE_REMOTE ? onFocus : null}
                onKeyDown={ENABLE_REMOTE ? onKeyDown : null}
                onPlay={onPlay(item.video)}
                onPlayExp={onPlayExp(item.video)}
                onTogglePlayed={onTogglePlayed(item.video)}
                selectedId={item.video.videoId}
                thumbnail={item.thumbnail}
                video={item.video}
              />
            )
          ))
        }
      </div>
    </>
  );
};

export default MediaList;
