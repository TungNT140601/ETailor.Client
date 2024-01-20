import React, { Fragment, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";

import DefaultLayout from "../components/DefaultLayout";
import Home from "../pages/Customer/Homepage/Home";
import AdminRouters from "./AdminRouter";
import CustomerRouter from "./CustomerRouter";
import NotFound from "../pages/NotFound/NotFound";
import LoginManagerAndAdmin from "../pages/Management/LoginManagerAndAdmin";
import { AccountCus } from "../pages/Management/Admin/AccountCus";
import { DefaultLayoutAdmin } from "../components/DefaultLayoutAdmin";
import { AccountStaff } from "../pages/Management/Admin/AccountStaff";
import { Measurement } from "../pages/Management/Admin/Measurement";
import { SystemConfig } from "../pages/Management/Admin/SystemConfig";
export const customerRouters = [];

export const publicRouters = [
  {
    path: "/",
    name: "home",
    component: Home,
    layout: DefaultLayout,
  },
  {
    path: "/home",
    name: "home",
    component: Home,
    layout: DefaultLayout,
  },
  {
    path: "/error",
    name: "error",
    component: NotFound,
    layout: null,
  },
  {
    path: "/management/login",
    name: "login-admin",
    component: LoginManagerAndAdmin,
    layout: null,
  },
  {
    path: "/admin",
    name: "home-admin",
    component: AccountCus,
    layout: DefaultLayoutAdmin,
  },
  {
    path: "/admin/account/staff",
    name: "home-admin-account-staff",
    component: AccountStaff,
    layout: DefaultLayoutAdmin,
  },
  {
    path: "/admin/measurement",
    name: "measurement",
    component: Measurement,
    layout: DefaultLayoutAdmin,
  },
  {
    path: "/admin/system-configuration",
    name: "system-configuration",
    component: SystemConfig,
    layout: DefaultLayoutAdmin,
  },
];

export const privateRouters = [
  // {
  //     path: '/profile',
  //     name: 'user-profile',
  //     component: Profile,
  //     layout: LayoutWithoutFilter,
  // },
];

export const adminRouters = [];

//Scroll Top when clicked another page
function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

export const RouterComponents = () => {
  return (
    <BrowserRouter>
      <div>
        <ScrollToTop />
        <Routes>
          {publicRouters.map((route, index) => {
            const Page = route.component;
            let Layout = DefaultLayout;
            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
          {/* <Route exact path="/" element={<PrivateRouters />}>
                        {privateRouters.map((route, index) => {
                            const Page = route.component
                            let Layout = DefaultLayout
                            if (route.layout) {
                                Layout = route.layout
                            } else if (route.layout === null) {
                                Layout = Fragment
                            }
                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            )
                        })}
                    </Route> */}
          <Route exact path="/" element={<AdminRouters />}>
            {adminRouters.map((route, index) => {
              const Page = route.component;
              let Layout = DefaultLayout;
              if (route.layout) {
                Layout = route.layout;
              } else if (route.layout === null) {
                Layout = Fragment;
              }
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
          </Route>

          <Route exact path="/" element={<CustomerRouter />}>
            {customerRouters.map((route, index) => {
              const Page = route.component;
              let Layout = DefaultLayout;
              if (route.layout) {
                Layout = route.layout;
              } else if (route.layout === null) {
                Layout = Fragment;
              }
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
};
