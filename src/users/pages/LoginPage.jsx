import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import { login as loginAction } from '../reducers/user';
import { notification as notificationAction } from '../../reducers/notification';
import { EmailPasswordForm } from '../components';
import { DEV_USER_EMAIL, DEV_USER_PASSWORD } from '../../config';

const LoginPage = ({ from = '/' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async ({ email, password }) => {
    try {
      await dispatch(loginAction({ email, password }));

      navigate(from);
    } catch ({ message }) {
      dispatch(notificationAction(message));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const {
      email: emailInput,
      password: passwordInput,
    } = e.target.elements;

    const email = emailInput.value;
    const password = passwordInput.value;

    login({ email, password });
  };

  return (
    <EmailPasswordForm onSubmit={onSubmit}>
      <button type="submit">
        login
      </button>

      {
        !!DEV_USER_EMAIL && (
          <button
            onClick={() => login({
              email: DEV_USER_EMAIL,
              password: DEV_USER_PASSWORD,
            })}
            type="button"
          >
            dev user
          </button>
        )
      }
    </EmailPasswordForm>
  );
};

export default LoginPage;
