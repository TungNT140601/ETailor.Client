/* eslint-disable react/prop-types */
import React from "react";
// import PropTypes from 'prop-types'
import { Navigate, Outlet } from "react-router";

const ManagerRouter = (role) => {
  let isAuthenticated = JSON.parse(localStorage.getItem("manager"));
  return isAuthenticated?.role === "Manager" ? (
    <Outlet />
  ) : (
    <Navigate to="/error" />
  );
};

export default ManagerRouter;
