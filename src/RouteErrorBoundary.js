import React from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import ErrorBoundary from './ErrorBoundary';

const RouteErrorBoundary = ({ children }) => {
  const location = useLocation();
  return <ErrorBoundary resetKey={location.pathname}>{children}</ErrorBoundary>;
};

RouteErrorBoundary.propTypes = {
  children: PropTypes.node
};

export default RouteErrorBoundary;
