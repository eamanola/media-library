import React from 'react';
import { Link } from 'react-router';

import './styles.css';

const SubFolder = ({
  onKeyDown,
  onFocus,
  onTogglePlayed,
  path,
  selectedId,
  title,
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

  return (
    <div
      className="sub-folder"
      data-selected-id={selectedId}
      onFocus={onFocusLocal}
      onKeyDown={onKeyDown}
      tabIndex={-1}
    >
      <Link to={path}>
        {`${title}${unPlayed > 0 ? ` (${unPlayed})` : ''}`}
      </Link>

      <label
        className="sub-folder-played-label"
        htmlFor={`played-${title}`}
      >
        <input
          checked={unPlayed === 0}
          id={`played-${title}`}
          onChange={onTogglePlayed}
          type="checkbox"
        />

        {' '}

        Played

      </label>
    </div>
  );
};

export default SubFolder;
