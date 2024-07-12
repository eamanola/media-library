import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import './styles.css';

const Folder = ({
  label,
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
    <Link
      className="media-folder"
      data-id={label}
      onClick={onClick}
      onFocus={onFocus}
      ref={linkRef}
      to={path}
    >
      {label}
    </Link>
  );
};

Folder.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
};

export default Folder;
