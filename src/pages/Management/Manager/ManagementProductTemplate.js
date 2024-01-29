import React, { useState } from "react";
import { Breadcrumb } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  PushpinOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { Typography, Carousel } from "antd";
import "./index.css";

import { Input } from "antd";
import { Button, Flex, Divider } from "antd";
import { Image } from "antd";
import {
  Avatar,
  Card,
  Col,
  Row,
  message,
  Steps,
  theme,
  Form,
  Space,
  Select,
} from "antd";

import CheckroomIcon from "@mui/icons-material/Checkroom";
import Paragraph from "antd/es/skeleton/Paragraph";
import { Link } from "react-router-dom";

const { Search } = Input;
const { Title, Text } = Typography;
const { Meta } = Card;

const manager = JSON.parse(localStorage.getItem("manager"));
console.log("manager", manager);

const ManagementProductTemplateHeader = () => {
  const onSearch = (value, _e, info) => console.log(info?.source, value);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <Breadcrumb
          items={[
            {
              href: "#",
              title: <HomeOutlined />,
            },
            {
              href: "/manager",
              title: (
                <>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <CheckroomIcon fontSize="small" />
                    &nbsp;
                    <span>Quản lý bản mẫu</span>
                  </div>
                </>
              ),
            },
            {
              href: "/manager",
              title: (
                <>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <CheckroomIcon fontSize="small" />
                    &nbsp;
                    <span>Bản mẫu</span>
                  </div>
                </>
              ),
            },
          ]}
        />
        <Title level={4}>Bản mẫu</Title>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div>
          <Search
            placeholder="Tìm kiếm"
            onSearch={onSearch}
            style={{
              width: 250,
            }}
          />
        </div>
        &nbsp; &nbsp; &nbsp;
        <div>
          <UserOutlined
            style={{
              fontSize: "24px",
            }}
          />
          &nbsp; &nbsp;
          <Text>{manager.name}</Text>
        </div>
      </div>
    </div>
  );
};

export const ManagementCreateProductTemplate = ({ close }) => {
  const steps = [
    {
      title: "Khởi tạo bản mẫu",
      content: (
        <div style={{ width: 300 }}>
          <span>Tên bản mẫu</span>{" "}
          <Input placeholder="Nhập tên bản mẫu" required />
        </div>
      ),
    },
    {
      title: "Thông tin cơ bản",
      content: "Second-content",
    },
    {
      title: "Số đo cần thiết",
      content: "Last-content",
    },
    {
      title: "Quy trình",
      content: "Last-content",
    },
  ];

  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  const contentStyle1 = {
    textAlign: "center",
    marginTop: 16,
  };

  return (
    <div>
      <Button icon={<RollbackOutlined />} onClick={close}>
        Thoát
      </Button>
      <Divider orientation="left">
        <Title level={3}>Tạo mới bản mẫu</Title>
      </Divider>
      <div>
        <Steps current={current} items={items} />
        <div style={contentStyle1}>{steps[current].content}</div>
        <div
          style={{
            marginTop: 24,
          }}
        >
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => message.success("Processing complete!")}
            >
              Done
            </Button>
          )}
          {current > 0 && (
            <Button
              style={{
                margin: "0 8px",
              }}
              onClick={() => prev()}
            >
              Previous
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const ManagementProductTemplateContent = () => {
  const data = [
    {
      stt: 1,
      name: "Áo sơ mi",
      image: [
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
      ],
    },
    {
      stt: 1,
      name: "Áo sơ mi",
      image: [
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
      ],
    },
    {
      stt: 1,
      name: "Áo sơ mi",
      image: [
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
      ],
    },
    {
      stt: 1,
      name: "Áo sơ mi",
      image: [
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
      ],
    },
    {
      stt: 1,
      name: "Áo sơ mi",
      image: [
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
      ],
    },
    {
      stt: 1,
      name: "Áo sơ mi",
      image: [
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
      ],
    },
    {
      stt: 1,
      name: "Áo sơ mi",
      image: [
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
      ],
    },
    {
      stt: 1,
      name: "Áo sơ mi",
      image: [
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
      ],
    },
    {
      stt: 1,
      name: "Áo sơ mi",
      image: [
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
      ],
    },
    {
      stt: 1,
      name: "Áo sơ mi",
      image: [
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
      ],
    },
    {
      stt: 1,
      name: "Áo sơ mi",
      image: [
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
      ],
    },
    {
      stt: 1,
      name: "Áo sơ mi",
      image: [
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
      ],
    },
    {
      stt: 1,
      name: "Áo sơ mi",
      image: [
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
      ],
    },
  ];
  const contentStyle = {
    height: "160px",
    lineHeight: "160px",
  };

  const [create, setCreate] = useState(false);

  const handleOpen = () => {
    setCreate(!create);
  };

  const hanleClose = () => {
    setCreate(!create);
  };

  return (
    <div>
      {create ? (
        <ManagementCreateProductTemplate close={hanleClose} />
      ) : (
        <div>
          <div>
            <Flex wrap="wrap" gap="small">
              <Button icon={<PushpinOutlined />}>Tổng cộng (2)</Button>
              <Link to="/manager/create/product-template" onClick={handleOpen}>
                <Button icon={<PlusCircleOutlined />}>Thêm mới</Button>
              </Link>
            </Flex>
          </div>
          <div>
            <Divider plain icon={<PushpinOutlined />}>
              Bản mẫu sản phẩm hiện có
            </Divider>
            <div>
              <br />
              <Row gutter={[16, 24]}>
                {data.map((item) => {
                  return (
                    <Col
                      className="gutter-row"
                      span={6}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Card
                        style={{
                          width: 200,
                        }}
                        cover={
                          <Carousel autoplay>
                            {item?.image?.map((img) => {
                              return (
                                <div>
                                  <h3 style={contentStyle}>
                                    <img src={img.iname} alt="#" />
                                  </h3>
                                </div>
                              );
                            })}
                          </Carousel>
                        }
                        actions={[
                          <EditOutlined key="edit" />,
                          <DeleteOutlined key="delete" />,
                        ]}
                      >
                        <Meta
                          title="Card title"
                          description="This is the description"
                        />
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function ManagementProductTemplate() {
  return (
    <div>
      <div
        style={{
          padding: "20px 20px",
          backgroundColor: "#FFFFFF",
        }}
        className="manager-header"
      >
        <ManagementProductTemplateHeader />
      </div>
      <div
        className="manager-content"
        style={{ height: 635, overflowY: "scroll" }}
      >
        <ManagementProductTemplateContent />
      </div>
    </div>
  );
}

export default ManagementProductTemplate;
