import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';

import { actions } from '../../reducers';
import SubFolder from '../SubFolder';
import MediaItem from '../MediaItem';
import { nextSelected } from './keyboard';
import './styles.css';

const {
  togglePlayed,
  play,
} = actions;

const MediaList = ({ list = null, title }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    navigate(`/player/${displayId}`);
  };

  const onTogglePlayed = (video) => () => {
    dispatch(togglePlayed(video));
  };

  const onKeyDown = (e) => {
    const params = {
      key: e.key,
      target: mediaList.current.querySelector(`[data-selected-id="${selected}"]`),
    };

    const next = nextSelected(params);

    if (next) {
      e.preventDefault();
      e.stopPropagation();

      next.focus();
    }
  };

  const onClick = (e) => {
    const { target } = e;
    const isSelectable = target.hasAttribute('data-selected-id');
    if (isSelectable) {
      e.preventDefault();
      e.stopPropagation();

      target.focus();
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
                onFocus={() => setSelected(item.title)}
                onKeyDown={onKeyDown}
                path={item.path}
                selected={selected === item.title}
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
                onClick={onClick}
                onFocus={() => setSelected(item.video.videoId)}
                onKeyDown={onKeyDown}
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
