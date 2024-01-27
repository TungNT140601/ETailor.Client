import React from "react";
import { ManagerSidebar } from "../ManagerSidebar";
import "./index.css";

import { Layout, theme } from "antd";
const { Content } = Layout;
const DefaultLayoutManager = ({ children }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout
      style={{
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <ManagerSidebar />
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
export default DefaultLayoutManager;
