/* eslint-disable react/button-has-type */
import React from 'react';

import './styles.css';

const ImageButton = ({
  alt = '',
  classNames = null,
  onClick = null,
  src = null,
  type = 'button',
}) => {
  let classes = ['image-button'];
  if (classNames) {
    if (Array.isArray(classNames)) {
      classes = [...classes, ...classNames];
    } else {
      classes = [...classes, classNames];
    }
  }

  return (
    <button
      className={classes.join(' ')}
      onClick={onClick}
      type={type}
    >
      <img alt={alt} src={src} />
    </button>
  );
};

export default ImageButton;
