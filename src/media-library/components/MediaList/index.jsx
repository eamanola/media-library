import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { actions } from '../../reducers';

import { createTree } from './tree';

import countUnplayeds from '../Folder/count-unplayeds';

import Folder from '../Folder';
import MediaItem from '../MediaItem';

import { nextSelected } from './keyboard';
import './styles.css';
// import { pathById } from './video-path';

const { togglePlayed, play } = actions;

const join = (current, subdir) => {
  if (current === '/') return `./${subdir}`;
  return `${current}/${subdir}`;
};

const MediaList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mediaLibrary = useSelector((state) => state.mediaLibrary);

  const [tree, setTree] = useState(null);
  const [folder, setFolder] = useState([]);
  const [selected, setSelected] = useState(null);

  const { pathname } = useLocation();

  const onPlay = (video) => () => {
    dispatch(play(video));
  };

  const onPlayExp = ({ id }) => () => {
    navigate(`/player/${id}`);
    // console.log(navigate, video);
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

  const formatFolder = (aFolder) => countUnplayeds(aFolder);

  useEffect(() => {
    if (tree) {
      const path = pathname
        .split('/')
        .filter((subdir) => subdir !== '')
        // .filter((subdir) => subdir !== PATH_PREFIX) // media
        .map((val) => decodeURIComponent(val));

      console.log(path);
      const firstLib = Object.keys(tree)[0];
      const target = path.reduce((acc, val) => acc[val], tree[firstLib]);

      setFolder(formatFolder(target));
    }
  }, [tree, pathname]);

  useEffect(() => {
    if (mediaLibrary.length) {
      // could be optimimzed and create tree on load only
      setTree(createTree(mediaLibrary));
    }
    console.log('mediaLibrary', mediaLibrary);
  }, [mediaLibrary]);

  // useEffect(() => {
  //   console.log(folder);
  // }, [folder]);

  // useEffect(() => {
  //   if (tree) {
  //     console.log(pathById(tree, 'NieR_Automata_Ver1_1a.S1.E1'));
  //   }
  //   console.log(tree);
  // }, [tree]);

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
                folder={folder[key]}
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
                onPlayExp={onPlayExp(folder[key])}
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
