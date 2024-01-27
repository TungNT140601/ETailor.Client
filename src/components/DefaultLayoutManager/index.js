import React from "react";
import { ManagerSidebar } from "../ManagerSidebar";
import "./index.css";

import { Layout, theme } from "antd";
const { Content } = Layout;
const DefaultLayoutManager = ({ children }) => {
  const {
    token: { colorBgContainer = "#D4D4D4" },
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
              padding: 10,
              height: "100vh",
              background: "rgba(217, 217,217, 0.7)",
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
