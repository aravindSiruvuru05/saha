// components_1/ProtectedRoute.tsx
import React, { JSXElementConstructor, ReactElement } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

const ProtectedRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('AccessToken'); // Check if token exists in localStorage
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          React.cloneElement(
            children as ReactElement<any, string | JSXElementConstructor<any>>,
            props,
          )
        ) : (
          <Redirect to="/signin" />
        )
      }
    />
  );
};

export default ProtectedRoute;
