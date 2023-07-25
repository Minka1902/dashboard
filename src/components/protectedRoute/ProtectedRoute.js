import React from 'react';
import { Route, Redirect } from "react-router-dom";

export default function ProtectedRoute({ children = null, loggedIn = false, ...props }) {
  return (
    <Route {...props}>
      {loggedIn ? children : <Redirect to="/" />}
    </Route>
  );
};
