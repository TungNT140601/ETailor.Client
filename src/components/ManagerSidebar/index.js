// import React, { useState, useEffect } from "react";
// import logo from "../../assets/logo.png";
// import "./index.css";
// import Typography from "@mui/material/Typography";
// import List from "@mui/material/List";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemText from "@mui/material/ListItemText";
// import Collapse from "@mui/material/Collapse";
// import InboxIcon from "@mui/icons-material/MoveToInbox";
// import ExpandLess from "@mui/icons-material/ExpandLess";
// import ExpandMore from "@mui/icons-material/ExpandMore";
// import SettingsIcon from "@mui/icons-material/Settings";
// import Button from "@mui/material/Button";
// import LogoutIcon from "@mui/icons-material/Logout";
// import { useNavigate } from "react-router-dom";
// import CircularProgress from "@mui/material/CircularProgress";
// import HomeIcon from "@mui/icons-material/Home";
// import StraightenIcon from "@mui/icons-material/Straighten";
// import ArtTrackIcon from "@mui/icons-material/ArtTrack";

// const ManagerSidebar = () => {
//   const [openAccount, setOpenAccount] = React.useState(true);
//   const navigate = useNavigate();
//   const [isActive, setIsActive] = useState(1);
//   const [isActiveSupAccount, setIsActiveSupAccount] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const manager = JSON.parse(localStorage.getItem("manager"));

//   const logoutManagerUrl =
//     "https://etailorapi.azurewebsites.net/api/auth/staff/logout";

//   const handleClick = (value) => {
//     if (value === isActive) {
//       if (value === 1) {
//         setOpenAccount(false);
//         setIsActive(null);
//       } else {
//         setIsActive(value);
//       }
//     } else {
//       if (value === 1) {
//         setOpenAccount(true);
//         setIsActive(value);
//       } else if (value === 3) {
//         navigate("/admin/system-configuration");
//         setIsActiveSupAccount(null);
//         setOpenAccount(false);
//         setIsActive(value);
//       }
//     }
//   };
//   const handleNavigate = (value) => {
//     if (value === isActiveSupAccount) {
//       setIsActiveSupAccount(value);
//     } else {
//       setIsActiveSupAccount(value);
//       if (value === 1) {
//         navigate("/admin");
//       } else if (value === 2) {
//         navigate("/admin/account/staff");
//       }
//     }
//   };
//   const handleLogout = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(logoutManagerUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${manager?.token}`,
//         },
//       });
//       setLoading(false);
//       if (response.ok) {
//         localStorage.removeItem("manager");
//         navigate("/management/login");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     const path = window.location.pathname;
//     if (path === "/admin/account/staff") {
//       setIsActiveSupAccount(2);
//     } else if (path === "/admin/system-configuration") {
//       setIsActiveSupAccount(null);
//       setOpenAccount(false);
//       setIsActive(3);
//     }
//   }, []);
//   return (
//     <div>
//       <div className="logo-content">
//         <img src={logo} alt="#logo" className="sidebar-logo" />
//       </div>
//       <div className="manager-sidebar-title">
//         <Typography
//           variant="h6"
//           component="h2"
//           sx={{ fontWeight: 700, marginBottom: "30px" }}
//         >
//           Xin chào, Manager
//         </Typography>
//       </div>
//       <div className="manager-vertical-menu">
//         <ListItemButton
//           onClick={() => handleClick(1)}
//           sx={{
//             "&:hover": {
//               backgroundColor: "#172039",
//               color: "#FFFFFF",
//             },
//             backgroundColor: isActive === 1 ? "#172039" : "#FFFFFF",
//             color: isActive === 1 ? "#FFFFFF" : "#000000",
//           }}
//         >
//           <HomeIcon />
//           &nbsp; &nbsp; &nbsp; &nbsp;
//           <ListItemText primary="Trang chủ" />
//         </ListItemButton>

//         <ListItemButton
//           onClick={() => handleClick(2)}
//           sx={{
//             "&:hover": {
//               backgroundColor: "#172039",
//               color: "#FFFFFF",
//             },
//             backgroundColor: isActive === 2 ? "#172039" : "#FFFFFF",
//             color: isActive === 2 ? "#FFFFFF" : "#000000",
//           }}
//         >
//           <StraightenIcon />
//           &nbsp; &nbsp; &nbsp; &nbsp;
//           <ListItemText primary="" />
//         </ListItemButton>

//         <ListItemButton
//           onClick={() => handleClick(3)}
//           sx={{
//             "&:hover": {
//               backgroundColor: "#172039",
//               color: "#FFFFFF",
//             },
//             backgroundColor: isActive === 3 ? "#172039" : "#FFFFFF",
//             color: isActive === 3 ? "#FFFFFF" : "#000000",
//           }}
//         >
//           <ArtTrackIcon />
//           &nbsp; &nbsp; &nbsp; &nbsp;
//           <ListItemText primary="Quản lý bản mẫu" />
//           {openAccount ? <ExpandLess /> : <ExpandMore />}
//         </ListItemButton>
//         <Collapse in={openAccount}>
//           <List component="div" disablePadding>
//             <ListItemButton
//               sx={{
//                 pl: 9,
//                 pt: 1,
//                 backgroundColor:
//                   isActiveSupAccount === 1 ? "#D9D9D9" : "#FFFFFF",
//                 color: isActiveSupAccount === 1 ? "#000000" : "#000000",
//               }}
//               onClick={() => handleNavigate(1)}
//             >
//               <ListItemText primary="Bản mẫu sản phẩm" />
//             </ListItemButton>
//           </List>
//           <List component="div" disablePadding>
//             <ListItemButton
//               sx={{
//                 pl: 9,
//                 pt: 1,
//                 backgroundColor:
//                   isActiveSupAccount === 2 ? "#D9D9D9" : "#FFFFFF",
//                 color: isActiveSupAccount === 2 ? "#000000" : "#000000",
//               }}
//               onClick={() => handleNavigate(2)}
//             >
//               <ListItemText primary="Phân loại sản phẩm" />
//             </ListItemButton>
//           </List>
//         </Collapse>
//         <ListItemButton
//           onClick={() => handleClick(4)}
//           sx={{
//             "&:hover": {
//               backgroundColor: "#172039",
//               color: "#FFFFFF",
//             },
//             backgroundColor: isActive === 4 ? "#172039" : "#FFFFFF",
//             color: isActive === 4 ? "#FFFFFF" : "#000000",
//           }}
//         >
//           <SettingsIcon />
//           &nbsp; &nbsp; &nbsp; &nbsp;
//           <ListItemText primary="Nguyên liệu" />
//         </ListItemButton>
//         <ListItemButton
//           onClick={() => handleClick(5)}
//           sx={{
//             "&:hover": {
//               backgroundColor: "#172039",
//               color: "#FFFFFF",
//             },
//             backgroundColor: isActive === 5 ? "#172039" : "#FFFFFF",
//             color: isActive === 5 ? "#FFFFFF" : "#000000",
//           }}
//         >
//           <SettingsIcon />
//           &nbsp; &nbsp; &nbsp; &nbsp;
//           <ListItemText primary="Đơn hàng" />
//         </ListItemButton>
//         <ListItemButton
//           onClick={() => handleClick(6)}
//           sx={{
//             "&:hover": {
//               backgroundColor: "#172039",
//               color: "#FFFFFF",
//             },
//             backgroundColor: isActive === 6 ? "#172039" : "#FFFFFF",
//             color: isActive === 6 ? "#FFFFFF" : "#000000",
//           }}
//         >
//           <SettingsIcon />
//           &nbsp; &nbsp; &nbsp; &nbsp;
//           <ListItemText primary="Giảm giá" />
//         </ListItemButton>
//         <ListItemButton
//           onClick={() => handleClick(7)}
//           sx={{
//             "&:hover": {
//               backgroundColor: "#172039",
//               color: "#FFFFFF",
//             },
//             backgroundColor: isActive === 7 ? "#172039" : "#FFFFFF",
//             color: isActive === 7 ? "#FFFFFF" : "#000000",
//           }}
//         >
//           <SettingsIcon />
//           &nbsp; &nbsp; &nbsp; &nbsp;
//           <ListItemText primary="Bài viết" />
//         </ListItemButton>
//         <ListItemButton
//           onClick={() => handleClick(8)}
//           sx={{
//             "&:hover": {
//               backgroundColor: "#172039",
//               color: "#FFFFFF",
//             },
//             backgroundColor: isActive === 8 ? "#172039" : "#FFFFFF",
//             color: isActive === 8 ? "#FFFFFF" : "#000000",
//           }}
//         >
//           <SettingsIcon />
//           &nbsp; &nbsp; &nbsp; &nbsp;
//           <ListItemText primary="So do co the" />
//         </ListItemButton>
//       </div>
//       <div className="manager-logout">
//         {loading ? (
//           <Button
//             variant="contained"
//             sx={{ width: "270px", backgroundColor: "#172039" }}
//             onClick={handleLogout}
//           >
//             <LogoutIcon /> &nbsp; &nbsp; Đăng xuất &nbsp; &nbsp;{" "}
//             <CircularProgress size={20} sx={{ color: "#FFFFFF" }} />
//           </Button>
//         ) : (
//           <Button
//             variant="contained"
//             sx={{ width: "270px", backgroundColor: "#172039" }}
//             onClick={handleLogout}
//           >
//             <LogoutIcon /> &nbsp; &nbsp; Đăng xuất
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManagerSidebar;

import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  FileOutlined,
  UserOutlined,
  HomeOutlined,
  LogoutOutlined,
  AppstoreAddOutlined,
  FileTextOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";
import { Layout, Menu, ConfigProvider, Image, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import StraightenIcon from "@mui/icons-material/Straighten";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import CategoryIcon from "@mui/icons-material/Category";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import DiscountIcon from "@mui/icons-material/Discount";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import logo from "../../assets/logo.png";
import "./index.css";

const { Title, Text } = Typography;

const { Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

export const ManagerSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const manager = JSON.parse(localStorage.getItem("manager"));
  const location = useLocation();
  // const active = useRef(localStorage.getItem("activeKey") || "/manager");
  const [active, setActive] = useState(
    localStorage.getItem("activeKey") || "/manager"
  );
  console.log("active", active);
  const logoutAdminUrl =
    "https://etailorapi.azurewebsites.net/api/auth/staff/logout";

  const items = [
    {
      key: "/manager",
      label: <Link to="/manager">Dashboard</Link>,
      icon: <HomeOutlined />,
    },
    {
      key: "/management/login",
      label: <Link to="/management/login">Đăng xuất</Link>,
      icon: <LogoutOutlined />,
    },
    { type: "divider" },
    {
      type: "group",
      label: (
        <Title level={5} style={{ margin: 0 }}>
          Khách hàng
        </Title>
      ),
      children: [
        {
          key: "/manager/account/customer",
          label: <Link to="/manager/account/customer">Khách hàng</Link>,
          icon: <UserOutlined />,
        },
        {
          key: "/manager/orders",
          label: <Link to="/manager/orders">Đơn hàng</Link>,
          icon: <ShoppingCartIcon />,
        },
      ],
    },
    { type: "divider" },
    {
      type: "group",
      label: (
        <Title level={5} style={{ margin: 0 }}>
          Quản lý
        </Title>
      ),
      children: [
        {
          key: "/manager/account/staffs",
          label: <Link to="/manager/account/staffs">Nhân viên</Link>,
          icon: <UserOutlined />,
        },
        {
          key: "/manager/body-size",
          label: <Link to="/manager/body-size">Số đo cơ thể</Link>,
          icon: <StraightenIcon />,
        },

        {
          key: "/manager/product-template",
          label: "Quản lý bản mẫu",
          icon: <CheckroomIcon />,
          children: [
            {
              key: "/manager/product-template",
              label: <Link to="/manager/product-template">Bản mẫu</Link>,
              icon: <CheckroomIcon />,
            },
            {
              key: "/manager/product-template/category",
              label: (
                <Link to="/manager/product-template/category">
                  Loại bản mẫu
                </Link>
              ),
              icon: <CategoryIcon />,
            },
          ],
        },
        {
          label: "Nguyên liệu",
          icon: <FactCheckIcon />,
          children: [
            {
              key: "/manager/material",
              label: <Link to="/manager/product-template">Thông tin</Link>,
              icon: <FileTextOutlined />,
            },
            {
              key: "/manager/material-category",
              label: <Link to="/manager/product-template">Danh mục</Link>,
              icon: <AppstoreAddOutlined />,
            },
            {
              key: "/manager/material-type",
              label: <Link to="/manager/product-category">Các loại</Link>,
              icon: <OrderedListOutlined />,
            },
          ],
        },
        {
          key: "/manager/discount",
          label: <Link to="/manager/discount">Mã giảm giá</Link>,
          icon: <DiscountIcon />,
        },
        {
          key: "/manager/blog",
          label: <Link to="/manager/blog">Bài viết</Link>,
          icon: <MenuBookIcon />,
        },
      ],
    },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch(logoutAdminUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("manager");
        localStorage.removeItem("activeKey");
        navigate("/management/login");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleNavigate = ({ key }) => {
    if (key) {
      if (key === "/management/login") {
        handleLogout();
      } else {
        navigate(key);
        setActive(key);
        localStorage.setItem("activeKey", key);
      }
    }
  };

  useEffect(() => {
    if (location.pathname !== active) {
      setActive(location.pathname);
      localStorage.setItem("activeKey", location.pathname);
    }
  }, [location.pathname]);

  // useEffect(() => {
  //   const path = window.location.pathname;
  //   if (path !== active) {
  //     setActive(path);
  //     localStorage.setItem("activeKey", path);
  //   }
  // });

  return (
    <Sider
      // collapsible
      // collapsed={collapsed}
      // onCollapse={(value) => setCollapsed(value)}
      style={{
        minHeight: "100vh",
        borderRight: "1px solid #9F78FF",
      }}
      theme="light"
    >
      <div className="menu-content">
        <div className="demo-logo-vertical" />
        <div
          style={{
            width: 120,
            marginLeft: "35px",
          }}
        >
          <img src={logo} alt="logo" />
        </div>

        <Menu
          theme="light"
          selectedKeys={[active]}
          mode="inline"
          items={items}
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            height: "100%",
          }}
          onSelect={handleNavigate}
        />
      </div>
    </Sider>
  );
};
