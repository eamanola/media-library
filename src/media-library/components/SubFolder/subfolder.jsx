import React from 'react';
import { Link } from 'react-router';

import './styles.css';

const SubFolder = ({
  coverImage,
  folder,
  onFocus,
  onKeyDown,
  onTogglePlayed,
  path,
  selectedId,
  unPlayed = 0,
}) => {
  const onFocusLocal = (e) => {
    if (e.target.className === 'sub-folder') {
      e.target.children[0].focus();
    }

    if (onFocus) {
      onFocus(e);
    }
  };

  let unPlayedStr = null;
  if (unPlayed > 0) {
    if (unPlayed === folder.children.length) {
      unPlayedStr = ` (${folder.children.length})`;
    } else {
      unPlayedStr = ` (${folder.children.length - unPlayed}/${folder.children.length})`;
    }
  }

  return (
    <div
      className="media-item subfolder"
      data-selected-id={selectedId}
      onFocus={onFocusLocal}
      onKeyDown={onKeyDown}
      tabIndex={-1}
    >
      {/* eslint-disable-next-line react/forbid-component-props */}
      <Link className="subfolder-open" to={path}>
        <img alt={folder.title} src={coverImage} />
      </Link>

      <div>
        {folder.title}
      </div>

      <label
        className="media-item-played-label"
        htmlFor={`played-${folder.title}`}
      >
        <input
          checked={unPlayed === 0}
          id={`played-${folder.title}`}
          onChange={onTogglePlayed}
          type="checkbox"
        />

        {' '}

        Played

        { unPlayedStr }

      </label>
    </div>
  );
};

export default SubFolder;
