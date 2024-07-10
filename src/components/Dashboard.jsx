import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { actions as usersActions } from '../users';
import { actions as emailVerificationActions, REQUEST_STATES } from '../email-verification';
import { notification as notificationAction } from '../reducers/notification';

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await dispatch(usersActions.logout());
    } catch ({ message }) {
      dispatch(notificationAction(message));
    }
  };

  const requestVerification = async () => {
    try {
      const requestState = await dispatch(emailVerificationActions.request(user.email));

      if (requestState === REQUEST_STATES.REQUESTED) {
        dispatch(notificationAction('you should receive an email shortly'));
        navigate('/email/verify/by-code');
      } else if (requestState === REQUEST_STATES.ALREADY_VERIFIED) {
        dispatch(notificationAction('Already verified'));
      }
    } catch ({ message }) {
      dispatch(notificationAction(message));
    }
  };

  return (
    <div>
      { user && (
        <span>
          Hello&nbsp;
          {user.email}
        </span>
      )}

      { user && <button type="button" onClick={logout}>logout</button> }

      { (user && !user?.emailVerified) && <button type="button" onClick={requestVerification}>verify</button> }

      { (!user && pathname !== '/login') && <Link to="/login">Login</Link> }

      { (!user && pathname !== '/signup') && <Link to="/signup">Signup</Link> }
    </div>
  );
};

export default Dashboard;
