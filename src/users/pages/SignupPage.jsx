import React from 'react';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import userService from '../services/users';

import { login as loginAction } from '../reducers/user';
import { notification as notificationAction } from '../../reducers/notification';

import EmailPasswordForm from '../components/EmailPasswordForm';

import { DEV_USER_EMAIL, DEV_USER_PASSWORD } from '../../config';

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = ({ email, password }) => dispatch(loginAction({ email, password }));

  const signup = async ({ email, password, confirmPassword }) => {
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
      email: emailInput,
      password: passwordInput,
      confirmPassword: confirmPasswordInput,
    } = e.target.elements;

    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    signup({ email, password, confirmPassword });
  };

  return (
    <EmailPasswordForm onSubmit={onSubmit}>
      <input
        type="password"
        placeholder="confirm password"
        required
        name="confirmPassword"
      />

      <button type="submit">signup</button>

      {
        DEV_USER_EMAIL && (
          <button
            type="button"
            onClick={() => signup({
              email: DEV_USER_EMAIL,
              password: DEV_USER_PASSWORD,
              confirmPassword: DEV_USER_PASSWORD,
            })}
          >
            dev user
          </button>
        )
      }
    </EmailPasswordForm>
  );
};

export default SignupPage;
