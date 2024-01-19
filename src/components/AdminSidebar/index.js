import React, { useState } from "react";
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

export const AdminSidebar = () => {
  const [openAccount, setOpenAccount] = React.useState(true);
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(1);
  const [isActiveSupAccount, setIsActiveSupAccount] = useState(1);

  const handleClick = (value) => {
    if (value === isActive) {
      if (value === 1) {
        setOpenAccount(false);
        setIsActive(null);
      } else {
        setIsActive(null);
      }
    } else {
      if (value === 1) {
        setOpenAccount(true);
        setIsActive(value);
      } else if (value === 2) {
        navigate("/admin/measurement");
        setIsActiveSupAccount(null);
        setOpenAccount(false);
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
      setIsActiveSupAccount(null);
    } else {
      setIsActiveSupAccount(value);
      if (value === 1) {
        navigate("/admin");
      } else if (value === 2) {
        navigate("/admin/account/staff");
      }
    }
  };
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
            <ListItemButton sx={{ pl: 9, pt: 1 }}>
              <ListItemText primary="Quản lý" />
            </ListItemButton>
          </List>
        </Collapse>
        <ListItemButton
          onClick={() => handleClick(2)}
          sx={{
            "&:hover": {
              backgroundColor: "#172039",
              color: "#FFFFFF",
            },
            backgroundColor: isActive === 2 ? "#172039" : "#FFFFFF",
            color: isActive === 2 ? "#FFFFFF" : "#000000",
          }}
        >
          <StraightenIcon />
          &nbsp; &nbsp; &nbsp; &nbsp;
          <ListItemText primary="Quản lý số đo" />
        </ListItemButton>
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
        <Button
          variant="contained"
          sx={{ width: "270px", backgroundColor: "#172039" }}
        >
          <LogoutIcon />
          &nbsp; &nbsp; Đăng xuất
        </Button>
      </div>
    </div>
  );
};
