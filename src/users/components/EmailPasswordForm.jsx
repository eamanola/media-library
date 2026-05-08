import React from 'react';
import PropTypes from 'prop-types';

const EmailPasswordForm = ({ onSubmit, children }) => (
  <form onSubmit={onSubmit}>
    <input
      name="email"
      placeholder="email"
      required
      type="email"
    />

    <input
      name="password"
      placeholder="password"
      required
      type="password"
    />

    {children}
  </form>
);

EmailPasswordForm.propTypes = {
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default EmailPasswordForm;
