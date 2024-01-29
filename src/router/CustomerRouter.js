/* eslint-disable react/prop-types */
import React from 'react'
// import PropTypes from 'prop-types'
import { Navigate, Outlet } from 'react-router'

const CustomerRouter = (role) => {
    let isAuthenticated = JSON.parse(localStorage.getItem("customer"));
    return isAuthenticated ? <Outlet /> : <Navigate to="/error" />;
}

export default CustomerRouter