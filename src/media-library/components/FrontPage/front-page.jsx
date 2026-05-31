import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import logger from '../../../logger';
import FileBrowser from '../FileBrowser';
import MediaList from '../MediaList';

const FrontPage = () => {
  const mediaLibrary = useSelector(({ mediaLibrary: state }) => state);
  const played = useSelector(({ played: state }) => state);
  const [nextsList, setNextsList] = useState(null);

  useEffect(() => {
    if (mediaLibrary.length && played.length) {
      const findNexts = async () => {
        const playNext = (aFolder, alreadyPlayed) => {
          const nexts = [];

          const videos = aFolder.children.filter(({ video }) => typeof video === 'object');

          // has started
          const firstWatch = videos.find(({ video }) => alreadyPlayed.find(
            ({ mediaId, isPlayed }) => mediaId === video.id && isPlayed === true,
          ));

          // not finished
          const firstUnwatched = videos.find(({ video }) => !alreadyPlayed.find(
            ({ mediaId, isPlayed }) => mediaId === video.id && isPlayed === true,
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

        const nexts = playNext(mediaLibrary[0], played);
        logger.log('FileBrowser: set play next', nexts);
        setNextsList(nexts);
      };

      findNexts();
    }
  }, [mediaLibrary, played]);

  return (
    <>
      {
        nextsList?.length > 0
          ? (
            <>
              <MediaList folder={{ children: nextsList, title: 'play next' }} />

              <hr />
            </>
          )
          : null
      }

      <FileBrowser />
    </>
  );
};

export default FrontPage;
