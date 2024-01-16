/* eslint-disable react/prop-types */
import React from "react";
// import PropTypes from 'prop-types'
import { Navigate, Outlet } from "react-router";

const AdminRouter = (role) => {
  let isAuthenticated = JSON.parse(localStorage.getItem("admin"));
  return isAuthenticated?.role === "Admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/error" />
  );
};

export default AdminRouter;
