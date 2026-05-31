import React from 'react';

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

export default EmailPasswordForm;
