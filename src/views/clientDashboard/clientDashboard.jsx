import React from 'react';

const ClientDashboard = ({ user }) => {
  return (
    <div>
      {user ? (
        <h2>Welcome back, {user.name}!</h2>
      ) : (
        <h2>Welcome!</h2>
      )}
    </div>
  );
};

export default ClientDashboard;
