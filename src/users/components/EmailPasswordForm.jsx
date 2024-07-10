import React from 'react';
import PropTypes from 'prop-types';

const EmailPasswordForm = ({ onSubmit, children }) => (
  <form onSubmit={onSubmit}>
    <input
      placeholder="email"
      type="email"
      required
      name="email"
    />

    <input
      placeholder="password"
      type="password"
      required
      name="password"
    />

    {children}
  </form>
);

EmailPasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default EmailPasswordForm;
