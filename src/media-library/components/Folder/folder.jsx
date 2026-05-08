import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import './styles.css';

const Folder = ({
  folder,
  onClick,
  onFocus,
  path,
  selected,
}) => {
  const linkRef = useRef(null);

  useEffect(() => {
    if (selected) {
      linkRef.current.focus();
    }
  }, [selected]);

  return (
    <div className="media-folder">
      <Link
        data-id={folder.title}
        onClick={onClick}
        onFocus={onFocus}
        ref={linkRef}
        to={path}
      >
        {`${folder.title}${folder.unplayed ? ` (${folder.unplayed})` : ''}`}
      </Link>
    </div>
  );
};

Folder.propTypes = {
  folder: PropTypes.shape({
    title: PropTypes.string.isRequired,
    unplayed: PropTypes.number,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
};

export default Folder;
