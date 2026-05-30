import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import MediaList, { createTree } from '../MediaList';
import logger from '../../../logger';

const Browser = () => {
  const mediaLibrary = useSelector(({ mediaLibrary: state }) => state);
  const played = useSelector(({ played: state }) => state);
  const [tree, setTree] = useState(null);

  useEffect(() => {
    if (mediaLibrary?.length) {
      logger.log('Browser: set media lib', mediaLibrary);
      const setupTree = async () => {
        setTree(createTree(mediaLibrary));
      };

      setupTree();
    }
  }, [mediaLibrary]);

  useEffect(() => {
    if (tree && played?.length) {
      const playNext = (aFolder, alreadyPlayed) => {
        const nexts = [];

        const videos = aFolder.children.filter(({ video }) => typeof video === 'object')
          .map(({ video }) => video);

        // has started
        const firstWatch = videos.find(({ id }) => alreadyPlayed.find(
          ({ mediaId, isPlayed }) => mediaId === id && isPlayed === true,
        ));

        // not finished
        const firstUnwatched = videos.find(({ id }) => !alreadyPlayed.find(
          ({ mediaId, isPlayed }) => mediaId === id && isPlayed === true,
        ));

        if (firstWatch && firstUnwatched) {
          nexts.push({ ...firstUnwatched });
        }

        const subFolders = aFolder.children.filter(({ children }) => Array.isArray(children));
        for (let i = 0; i < subFolders.length; i += 1) {
          nexts.push(...playNext(subFolders[i], alreadyPlayed));
        }

        return nexts;
      };

      const nexts = playNext(tree[0], played);
      logger.log('Browser: set play next', nexts);
      console.log('to play', ...nexts.map(({ title }) => title));
    }
  }, [tree, played]);

  return (
    <MediaList />
  );
};

export default Browser;
