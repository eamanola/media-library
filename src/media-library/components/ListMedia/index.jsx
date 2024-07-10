import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { play as playAction, togglePlayed as togglePlayedAction } from '../../reducer';
import { createTree } from '../../tree';
import config from '../../../config';

import './styles.css';

const { BACKEND_URL } = config;

const ListMedia = () => {
  const dispatch = useDispatch();
  const mediaLibrary = useSelector((state) => state.mediaLibrary);
  const [tree, setTree] = useState(null);
  const [folder, setFolder] = useState([]);

  const { pathname } = useLocation();

  const printMediaInfo = ({ title, season, episode }) => [
    title,
    season ? `S${season}` : '',
    episode ? `${episode.extra ? episode.extra : 'E'}${episode.episode}` : '',
  ].join(' ');

  const play = (video) => {
    dispatch(playAction(video));
  };

  const togglePlayed = (video) => {
    dispatch(togglePlayedAction(video));
  };

  useEffect(() => {
    if (tree) {
      const path = pathname.split('/').slice(2).map((val) => decodeURIComponent(val));

      const firstLib = Object.keys(tree)[1];
      const target = path.reduce((acc, val) => {
        if (val) {
          return acc[val];
        }

        return acc;
      }, tree[firstLib]);

      setFolder(target);
    }
  }, [tree, pathname]);

  useEffect(() => {
    if (mediaLibrary.length) {
      setTree(createTree(mediaLibrary));
    }
    console.log('mediaLibrary', mediaLibrary);
  }, [mediaLibrary]);

  // useEffect(() => {
  //   console.log('folder', folder);
  // }, [folder]);

  // eslint-disable-next-line no-restricted-globals
  // useEffect(() => () => console.log(history.scrollRestoration));

  return (
    <div className="media-list">
      {
        Object.keys(folder).map((key) => {
          const isFolder = !folder[key].mediaInfo;

          return isFolder
            ? (
              <div key={key}>
                <Link to={`${pathname}/${key}`}>{key}</Link>
              </div>
            )
            : (
              <button type="button" key={key} className="media-item">
                <div>
                  <img src={`${BACKEND_URL}/thumbnails/${folder[key].id}.jpg`} alt={folder[key].id} />
                </div>
                <div style={{ fontSize: 12 }}>
                  {printMediaInfo(folder[key].mediaInfo)}
                </div>
                <div>
                  <button className="play-button" type="button" onClick={() => play(folder[key])}>Play</button>
                  <input
                    type="checkbox"
                    checked={folder[key].played?.isPlayed === true}
                    onChange={() => togglePlayed(folder[key])}
                  />
                </div>
              </button>
            );
        })
      }
    </div>
  );
};

export default ListMedia;
