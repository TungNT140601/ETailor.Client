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
import SettingsIcon from "@mui/icons-material/Settings";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import HomeIcon from "@mui/icons-material/Home";
import StraightenIcon from "@mui/icons-material/Straighten";
import ArtTrackIcon from "@mui/icons-material/ArtTrack";

const ManagerSidebar = () => {
  const [openAccount, setOpenAccount] = React.useState(true);
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(1);
  const [isActiveSupAccount, setIsActiveSupAccount] = useState(1);
  const [loading, setLoading] = useState(false);
  const manager = JSON.parse(localStorage.getItem("manager"));

  const logoutManagerUrl =
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
      }
    }
  };
  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await fetch(logoutManagerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      setLoading(false);
      if (response.ok) {
        localStorage.removeItem("manager");
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
      <div className="manager-sidebar-title">
        <Typography
          variant="h6"
          component="h2"
          sx={{ fontWeight: 700, marginBottom: "30px" }}
        >
          Xin chào, Manager
        </Typography>
      </div>
      <div className="manager-vertical-menu">
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
          <HomeIcon />
          &nbsp; &nbsp; &nbsp; &nbsp;
          <ListItemText primary="Trang chủ" />
        </ListItemButton>

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
          <ListItemText primary="Số đo cơ thể" />
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
          <ArtTrackIcon />
          &nbsp; &nbsp; &nbsp; &nbsp;
          <ListItemText primary="Quản lý bản mẫu" />
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
              <ListItemText primary="Bản mẫu sản phẩm" />
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
              <ListItemText primary="Phân loại sản phẩm" />
            </ListItemButton>
          </List>
        </Collapse>
        <ListItemButton
          onClick={() => handleClick(4)}
          sx={{
            "&:hover": {
              backgroundColor: "#172039",
              color: "#FFFFFF",
            },
            backgroundColor: isActive === 4 ? "#172039" : "#FFFFFF",
            color: isActive === 4 ? "#FFFFFF" : "#000000",
          }}
        >
          <SettingsIcon />
          &nbsp; &nbsp; &nbsp; &nbsp;
          <ListItemText primary="Nguyên liệu" />
        </ListItemButton>
        <ListItemButton
          onClick={() => handleClick(5)}
          sx={{
            "&:hover": {
              backgroundColor: "#172039",
              color: "#FFFFFF",
            },
            backgroundColor: isActive === 5 ? "#172039" : "#FFFFFF",
            color: isActive === 5 ? "#FFFFFF" : "#000000",
          }}
        >
          <SettingsIcon />
          &nbsp; &nbsp; &nbsp; &nbsp;
          <ListItemText primary="Đơn hàng" />
        </ListItemButton>
        <ListItemButton
          onClick={() => handleClick(6)}
          sx={{
            "&:hover": {
              backgroundColor: "#172039",
              color: "#FFFFFF",
            },
            backgroundColor: isActive === 6 ? "#172039" : "#FFFFFF",
            color: isActive === 6 ? "#FFFFFF" : "#000000",
          }}
        >
          <SettingsIcon />
          &nbsp; &nbsp; &nbsp; &nbsp;
          <ListItemText primary="Giảm giá" />
        </ListItemButton>
        <ListItemButton
          onClick={() => handleClick(7)}
          sx={{
            "&:hover": {
              backgroundColor: "#172039",
              color: "#FFFFFF",
            },
            backgroundColor: isActive === 7 ? "#172039" : "#FFFFFF",
            color: isActive === 7 ? "#FFFFFF" : "#000000",
          }}
        >
          <SettingsIcon />
          &nbsp; &nbsp; &nbsp; &nbsp;
          <ListItemText primary="Bài viết" />
        </ListItemButton>
      </div>
      <div className="manager-logout">
        {loading ? (
          <Button
            variant="contained"
            sx={{ width: "270px", backgroundColor: "#172039" }}
            onClick={handleLogout}
          >
            <LogoutIcon /> &nbsp; &nbsp; Đăng xuất &nbsp; &nbsp;{" "}
            <CircularProgress size={20} sx={{ color: "#FFFFFF" }} />
          </Button>
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

export default ManagerSidebar;
