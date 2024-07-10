import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { verifyByCode } from '../reducers/email-verification';
import { notification } from '../../reducers/notification';

const VerifyByCode = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { value: code } = e.target.elements.code;

    try {
      await dispatch(verifyByCode(user, code));
    } catch (err) {
      dispatch(notification(err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="code" type="text" />
      <button type="submit">verify</button>
    </form>
  );
};

export default VerifyByCode;
