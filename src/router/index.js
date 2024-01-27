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
import { SystemConfig } from "../pages/Management/Admin/SystemConfig";
import CustomerProfile from "../pages/Customer/Profile";
import CustomerSidebar from "../components/CustomerSidebar/CustomerSidebar";
import UserProfileLayout from "../components/UserProfileLayout";
import DefaultLayoutManager from "../components/DefaultLayoutManager";
import ManagementStaff from "../pages/Management/Manager/ManagementStaff";
import ManagerRouter from "./ManagerRouter";
import Catalogue from "../pages/Customer/Catalogue";
import ManagementProductTemplate, {
  ManagementCreateProductTemplate,
} from "../pages/Management/Manager/ManagementProductTemplate";
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
    path: "/profile",
    name: "customer-profile",
    component: CustomerProfile,
    layout: UserProfileLayout,
  },
  {
    path: "/management/login",
    name: "admin-login",
    component: LoginManagerAndAdmin,
    layout: null,
  },
  {
    path: "/catalogue",
    name: "home-catalogue",
    component: Catalogue,
    layout: DefaultLayout,
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

export const adminRouters = [
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
    path: "/admin/system-configuration",
    name: "system-configuration",
    component: SystemConfig,
    layout: DefaultLayoutAdmin,
  },
];
export const managerRouters = [
  {
    path: "/manager",
    name: "manager",
    component: ManagementProductTemplate,
    layout: DefaultLayoutManager,
  },
  {
    path: "/manager/create/product-template",
    name: "manager",
    component: ManagementCreateProductTemplate,
    layout: null,
  },
];

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
          <Route exact path="/" element={<ManagerRouter />}>
            {managerRouters.map((route, index) => {
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
