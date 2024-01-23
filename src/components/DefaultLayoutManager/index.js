import React from "react";
import ManagerSidebar from "../ManagerSidebar";
import "./index.css";

function DefaultLayoutManager({ children }) {
  return (
    <div className="default-layout-manager">
      <div className="manager-sidebar">
        <ManagerSidebar />
      </div>
      <div className="manager-children">{children}</div>
    </div>
  );
}

export default DefaultLayoutManager;
