import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { actions } from '../../reducers';

import { createTree } from '../../tree';

import Folder from '../Folder';
import MediaItem from '../MediaItem';

import { nextSelected } from './keyboard';
import './styles.css';

const { togglePlayed, play } = actions;

const join = (current, subdir) => {
  if (current === '/') return `./${subdir}`;
  return `${current}/${subdir}`;
};

const MediaList = () => {
  const dispatch = useDispatch();
  const mediaLibrary = useSelector((state) => state.mediaLibrary);

  const [tree, setTree] = useState(null);
  const [folder, setFolder] = useState([]);
  const [selected, setSelected] = useState(null);

  const { pathname } = useLocation();

  const onPlay = (video) => () => {
    dispatch(play(video));
  };

  const onTogglePlayed = (video) => () => {
    dispatch(togglePlayed(video));
  };

  const onKeyDown = (e) => {
    const next = nextSelected(e);
    if (next) {
      e.preventDefault();
      e.stopPropagation();

      setSelected(next.getAttribute('data-id'));
    }
  };

  useEffect(() => {
    if (tree) {
      const path = pathname
        .split('/')
        .filter((subdir) => subdir !== '')
        // .filter((subdir) => subdir !== PATH_PREFIX) // media
        .map((val) => decodeURIComponent(val));

      const firstLib = Object.keys(tree)[0];
      const target = path.reduce((acc, val) => acc[val], tree[firstLib]);
      setFolder(target);
    }
  }, [tree, pathname]);

  useEffect(() => {
    if (mediaLibrary.length) {
      setTree(createTree(mediaLibrary));
    }
    // console.log('mediaLibrary', mediaLibrary);
  }, [mediaLibrary]);

  useEffect(() => {
    if (selected) {
      document.querySelector(`[data-id="${selected}"]`).scrollIntoView(
        { behavior: 'smooth', block: 'center', inline: 'nearest' },
      );
    }

    // console.log(`[data-id="${selected}"]`);
    // console.log('selected', selected);
  }, [selected]);

  return (
    <div
      className="media-list"
      role="presentation"
      onKeyDown={onKeyDown}
    >
      {
        Object.keys(folder).map((key) => {
          const isSubFolder = !folder[key].id;

          return isSubFolder
            ? (
              <Folder
                key={key}
                label={key}
                onClick={() => setSelected(key)}
                onFocus={() => setSelected(key)}
                path={join(pathname, key)}
                selected={selected === key}
              />
            )
            : (
              <MediaItem
                key={key}
                onClick={() => setSelected(folder[key].id)}
                onFocus={() => setSelected(folder[key].id)}
                onPlay={onPlay(folder[key])}
                onTogglePlayed={onTogglePlayed(folder[key])}
                selected={selected === folder[key].id}
                video={folder[key]}
              />
            );
        })
      }
    </div>
  );
};

export default MediaList;
