import React from "react";
import { AdminSidebar } from "../AdminSidebar";
import "./index.css";

export const DefaultLayoutAdmin = ({ children }) => {
  return (
    <div className="default-layout-admin">
      <div className="admin-sidebar">
        <AdminSidebar />
      </div>
      <div className="admin-children">{children}</div>
    </div>
  );
};
