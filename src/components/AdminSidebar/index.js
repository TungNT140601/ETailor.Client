import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import "./index.css";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StraightenIcon from "@mui/icons-material/Straighten";
import SettingsIcon from "@mui/icons-material/Settings";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

export const AdminSidebar = () => {
  const [openAccount, setOpenAccount] = React.useState(true);
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(1);
  const [isActiveSupAccount, setIsActiveSupAccount] = useState(1);
  const [loading, setLoading] = useState(false);
  const admin = JSON.parse(localStorage.getItem("admin"));

  const logoutAdminUrl =
    "https://etailorapi.azurewebsites.net/api/auth/staff/logout";

  const handleClick = (value) => {
    if (value === isActive) {
      if (value === 1) {
        setOpenAccount(false);
        setIsActive(null);
      } else {
        setIsActive(value);
      }
    } else {
      if (value === 1) {
        setOpenAccount(true);
        setIsActive(value);
      } else if (value === 3) {
        navigate("/admin/system-configuration");
        setIsActiveSupAccount(null);
        setOpenAccount(false);
        setIsActive(value);
      }
    }
  };
  const handleNavigate = (value) => {
    if (value === isActiveSupAccount) {
      setIsActiveSupAccount(value);
    } else {
      setIsActiveSupAccount(value);
      if (value === 1) {
        navigate("/admin");
      } else if (value === 2) {
        navigate("/admin/account/staff");
      } else if (value === 3) {
        navigate("/admin/account/manager");
      }
    }
  };
  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await fetch(logoutAdminUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin?.token}`,
        },
      });
      setLoading(false);
      if (response.ok) {
        localStorage.removeItem("admin");
        navigate("/management/login");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/admin/account/staff") {
      setIsActiveSupAccount(2);
    } else if (path === "/admin/account/manager") {
      setIsActiveSupAccount(3);
    } else if (path === "/admin/system-configuration") {
      setIsActiveSupAccount(null);
      setOpenAccount(false);
      setIsActive(3);
    }
  }, []);
  return (
    <div>
      <div className="logo-content">
        <img src={logo} alt="#logo" className="sidebar-logo" />
      </div>
      <div className="admin-sidebar-title">
        <Typography
          variant="h6"
          component="h2"
          sx={{ fontWeight: 700, marginBottom: "30px" }}
        >
          Xin chào, Admin
        </Typography>
      </div>
      <div className="admin-vertical-menu">
        <ListItemButton
          onClick={() => handleClick(1)}
          sx={{
            "&:hover": {
              backgroundColor: "#172039",
              color: "#FFFFFF",
            },
            backgroundColor: isActive === 1 ? "#172039" : "#FFFFFF",
            color: isActive === 1 ? "#FFFFFF" : "#000000",
          }}
        >
          <InboxIcon />
          &nbsp; &nbsp; &nbsp; &nbsp;
          <ListItemText primary="Tài khoản" />
          {openAccount ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openAccount}>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{
                pl: 9,
                pt: 1,
                backgroundColor:
                  isActiveSupAccount === 1 ? "#D9D9D9" : "#FFFFFF",
                color: isActiveSupAccount === 1 ? "#000000" : "#000000",
              }}
              onClick={() => handleNavigate(1)}
            >
              <ListItemText primary="Khách hàng" />
            </ListItemButton>
          </List>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{
                pl: 9,
                pt: 1,
                backgroundColor:
                  isActiveSupAccount === 2 ? "#D9D9D9" : "#FFFFFF",
                color: isActiveSupAccount === 2 ? "#000000" : "#000000",
              }}
              onClick={() => handleNavigate(2)}
            >
              <ListItemText primary="Nhân viên" />
            </ListItemButton>
          </List>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{
                pl: 9,
                pt: 1,
                backgroundColor:
                  isActiveSupAccount === 3 ? "#D9D9D9" : "#FFFFFF",
                color: isActiveSupAccount === 3 ? "#000000" : "#000000",
              }}
              onClick={() => handleNavigate(3)}
            >
              <ListItemText primary="Quản lý" />
            </ListItemButton>
          </List>
        </Collapse>
        <ListItemButton
          onClick={() => handleClick(3)}
          sx={{
            "&:hover": {
              backgroundColor: "#172039",
              color: "#FFFFFF",
            },
            backgroundColor: isActive === 3 ? "#172039" : "#FFFFFF",
            color: isActive === 3 ? "#FFFFFF" : "#000000",
          }}
        >
          <SettingsIcon />
          &nbsp; &nbsp; &nbsp; &nbsp;
          <ListItemText primary="Quản lý hệ thống" />
        </ListItemButton>
      </div>
      <div className="admin-logout">
        {loading ? (
          <CircularProgress size={30} sx={{ color: "#172039" }} />
        ) : (
          <Button
            variant="contained"
            sx={{ width: "270px", backgroundColor: "#172039" }}
            onClick={handleLogout}
          >
            <LogoutIcon /> &nbsp; &nbsp; Đăng xuất
          </Button>
        )}
      </div>
    </div>
  );
};
