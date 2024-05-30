import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  FileOutlined,
  UserOutlined,
  HomeOutlined,
  ControlOutlined,
  CommentOutlined,
  LogoutOutlined,
  AppstoreAddOutlined,
  FileTextOutlined,
  OrderedListOutlined,
  ShoppingCartOutlined,
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
    "https://e-tailorapi.azurewebsites.net/api/auth/staff/logout";

  const items = [
    {
      key: "/manager",
      label: <Link to="/manager">Quản lý chung</Link>,
      icon: <HomeOutlined />,
    },
    {
      key: "/manager/order-for-customer",
      label: <Link to="/manager/order-for-customer">Lên đơn hàng</Link>,
      icon: <ShoppingCartOutlined />,
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
          key: "/manager/task-management-group",
          label: "Quản lý công việc",
          icon: <ControlOutlined />,
          children: [
            {
              key: "/manager/tasks-management-by-order",
              label: (
                <Link to="/manager/tasks-management-by-order">Quản lý</Link>
              ),
              icon: <ControlOutlined />,
            },
            {
              key: "/manager/tasks-management",
              label: <Link to="/manager/tasks-management">Phân công</Link>,
              icon: <ControlOutlined />,
            },
          ],
        },
        {
          key: "/manager/body-size",
          label: <Link to="/manager/body-size">Số đo cơ thể</Link>,
          icon: <StraightenIcon />,
        },

        {
          key: "/manager/product-template-group",
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
          label: "Phụ liệu may mặc",
          icon: <FactCheckIcon />,
          children: [
            {
              key: "/manager/material",
              label: <Link to="/manager/material">Thông tin</Link>,
              icon: <FileTextOutlined />,
            },
            {
              key: "/manager/material-category",
              label: <Link to="/manager/material-category">Danh mục</Link>,
              icon: <AppstoreAddOutlined />,
            },
            // {
            //   key: "/manager/material-type",
            //   label: <Link to="/manager/material-type">Các loại</Link>,
            //   icon: <OrderedListOutlined />,
            // },
          ],
        },
        {
          key: "/manager/discount",
          label: <Link to="/manager/discount">Chương trình giảm giá</Link>,
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
