import React from 'react';
import { Link } from 'react-router';

const Navigation = ({ path = '/' }) => {
  const folders = path.split('/').filter((folder) => folder !== '');

  return (
    <>
      <Link to="/">
        Home
      </Link>

      {
        folders.map((folder, index) => (
          <Link key={`navigation-${folder}`} to={`/${folders.slice(0, index + 1).join('/')}`}>
            {folder}
          </Link>
        ))
      }
    </>
  );
};

export default Navigation;
