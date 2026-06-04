import React from 'react';
import { Link } from 'react-router';

import './styles.css';

const SubFolder = ({
  onKeyDown,
  onFocus,
  path,
  selectedId,
  title,
  unPlayed = 0,
}) => {
  const onFocusLocal = (e) => {
    e.target.children[0].focus();

    // let child call onFocus()
    // if (onFocus) {
    //   onFocus(e);
    // }
  };

  return (
    <div
      className="sub-folder"
      data-selected-id={selectedId}
      onFocus={onFocusLocal}
      onKeyDown={onKeyDown}
      tabIndex={-1}
    >
      <Link
        onFocus={onFocus}
        to={path}
      >
        {`${title}${unPlayed > 0 ? ` (${unPlayed})` : ''}`}
      </Link>
    </div>
  );
};

export default SubFolder;
