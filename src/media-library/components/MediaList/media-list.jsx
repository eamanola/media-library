import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import { actions } from '../../reducers';
import { createTree } from './tree';
import Folder, { unPlayedCount } from '../Folder';
import MediaItem from '../MediaItem';
import { nextSelected } from './keyboard';
import './styles.css';
// import { pathById } from './video-path';

const {
  createThumbnails,
  getProbes,
  togglePlayed,
  play,
} = actions;

const join = (current, subdir) => {
  if (current === '/') return `./${subdir}`;
  return `${current}/${subdir}`;
};

const MediaList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mediaLibrary = useSelector((state) => state.mediaLibrary);
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

  const formatFolder = (aFolder) => unPlayedCount(aFolder);

  const tree = useMemo(() => {
    if (mediaLibrary.length) {
      console.log('create tree');

      return createTree(mediaLibrary);
    }
    return null;
  }, [mediaLibrary]);

  const folder = useMemo(() => {
    if (tree) {
      console.log('set folder');

      const path = pathname
        .split('/')
        .filter((subdir) => subdir !== '')
        // .filter((subdir) => subdir !== PATH_PREFIX) // media
        .map((val) => decodeURIComponent(val));

      // console.log(path);
      const firstLib = Object.keys(tree)[0];
      const target = path.reduce((acc, val) => acc[val], tree[firstLib]);

      return formatFolder(target);
    }
    return [];
  }, [tree, pathname]);

  console.log('render');

  useEffect(() => {
    // console.log(folder);
    if (folder) {
      const videos = Object.values(folder)
        .filter(({ id }) => !!id);

      const withoutThumbnail = videos
        .filter(({ thumbnail }) => !thumbnail);

      const withoutProbe = videos
        .filter(({ probe }) => !probe);

      // affect the same reducer, do after each other
      if (withoutThumbnail.length) {
        dispatch(createThumbnails(withoutThumbnail));
      } else if (withoutProbe.length) {
        dispatch(getProbes(withoutProbe));
      }
    }
  }, [folder, dispatch]);

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

  // const sortByKeys = (aFolder) => Object.keys(aFolder)
  //   .sort()
  //   .reduce((acc, val) => ({ ...acc, [val]: aFolder[val] }), {});

  return (
    <div
      className="media-list"
      onKeyDown={onKeyDown}
      role="presentation"
    >
      {
        Object.keys(folder).map((key) => {
          const isSubFolder = !folder[key].id;

          return isSubFolder
            ? (
              <Folder
                folder={folder[key]}
                key={key}
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
