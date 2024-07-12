import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { ScrollRestoration, Outlet } from 'react-router-dom';

import { actions as usersActions } from './users';

import Dashboard from './components/Dashboard';
import Notification from './components/Notification';

import { actions } from './media-library';

const { getVideos } = actions;

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(usersActions.fromLocalStorage());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getVideos());
  }, [dispatch]);

  return (
    <React.StrictMode>
      <Dashboard />

      <Notification />

      <Outlet />

      <ScrollRestoration />
    </React.StrictMode>
  );
};

export default App;
