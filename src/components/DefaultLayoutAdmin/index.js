import React from "react";
import { AdminSidebar } from "../AdminSidebar";
import "./index.css";

import { Layout } from "antd";
const { Content } = Layout;
export const DefaultLayoutAdmin = ({ children }) => {
  return (
    <Layout
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
        background: "rgba(217, 217,217, 0.2)",
      }}
    >
      <AdminSidebar />
      <Layout
        style={{
          background: "rgba(217, 217,217, 0.2)",
        }}
      >
        <Content>
          <div
            style={{
              padding: 10,
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
