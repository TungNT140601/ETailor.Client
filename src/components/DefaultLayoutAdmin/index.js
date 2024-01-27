import React from "react";
import { AdminSidebar } from "../AdminSidebar";
import "./index.css";

import { Layout, theme } from "antd";
const { Content } = Layout;
export const DefaultLayoutAdmin = ({ children }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout
      style={{
        minHeight: "100vh",
        position: "relative",
      }}
      className="default-admin-layout"
    >
      <AdminSidebar />
      <Layout>
        <Content>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
