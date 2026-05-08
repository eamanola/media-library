import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import userService from '../services/users';
import { login as loginAction } from '../reducers/user';
import { notification as notificationAction } from '../../reducers/notification';
import { EmailPasswordForm } from '../components';
import { DEV_USER_EMAIL, DEV_USER_PASSWORD } from '../../config';

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = ({ email, password }) => dispatch(loginAction({ email, password }));

  const signup = async ({ confirmPassword, email, password }) => {
    try {
      if (confirmPassword !== password) {
        throw new Error('passwords dont match');
      }

      await userService.create({ email, password });

      await login({ email, password });

      navigate('/');
    } catch ({ message }) {
      dispatch(notificationAction(message));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const {
      confirmPassword: confirmPasswordInput,
      email: emailInput,
      password: passwordInput,
    } = e.target.elements;

    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    signup({ confirmPassword, email, password });
  };

  return (
    <EmailPasswordForm onSubmit={onSubmit}>
      <input
        name="confirmPassword"
        placeholder="confirm password"
        required
        type="password"
      />

      <button type="submit">
        signup
      </button>

      {
        !!DEV_USER_EMAIL && (
          <button
            onClick={() => signup({
              confirmPassword: DEV_USER_PASSWORD,
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

export default SignupPage;
