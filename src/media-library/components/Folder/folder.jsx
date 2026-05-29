import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import './styles.css';

const Folder = ({
  onClick,
  onFocus,
  path,
  selected,
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
    <div className="media-folder">
      <Link
        data-id={title}
        onClick={onClick}
        onFocus={onFocus}
        ref={linkRef}
        to={path}
      >
        {`${title}${unPlayed > 0 ? ` (${unPlayed})` : ''}`}
      </Link>
    </div>
  );
};

Folder.propTypes = {
  onClick: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  unPlayed: PropTypes.number,
};

Folder.defaultProps = {
  unPlayed: 0,
};

export default Folder;
