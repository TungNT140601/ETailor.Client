import React from "react";
import { ManagerSidebar } from "../ManagerSidebar";
import "./index.css";

import { Layout, theme } from "antd";
const { Content } = Layout;
const DefaultLayoutManager = ({ children }) => {
  return (
    <Layout
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
        background: "rgba(217, 217,217, 0.7)",
      }}
    >
      <ManagerSidebar />
      <Layout
        style={{
          background: "rgba(217, 217,217, 0.7)",
        }}
      >
        <Content>
          <div
            style={{
              padding: 10,
              maxHeight: "100vh",
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
