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
        maxWidth: "100%",
        background: "rgba(217, 217,217, 0.2)",
      }}
    >
      <ManagerSidebar />
      <Layout
        style={{
          background: "rgba(217, 217,217, 0.2)",
        }}
      >
        <Content>
          <div
            style={{
              padding: 10,
              paddingRight: 0,
              maxHeight: "100vh",
              background: "rgba(217, 217,217, 0.2)",
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
