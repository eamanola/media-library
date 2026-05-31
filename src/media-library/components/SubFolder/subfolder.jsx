import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router';

import './styles.css';

const SubFolder = ({
  // onClick,
  // onFocus,
  path,
  selected,
  selectedId,
  title,
  unPlayed = 0,
}) => {
  const linkRef = useRef(null);

  useEffect(() => {
    if (selected) {
      linkRef.current.focus();
    }
  }, [selected]);

  return (
    <div className="sub-folder" data-selected-id={selectedId}>
      <Link
        // onClick={onClick}
        // onFocus={onFocus}
        ref={linkRef}
        to={path}
      >
        {`${title}${unPlayed > 0 ? ` (${unPlayed})` : ''}`}
      </Link>
    </div>
  );
};

export default SubFolder;
