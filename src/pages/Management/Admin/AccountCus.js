import React, { useState } from "react";
import "./index.css";
import { Breadcrumb } from "antd";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Typography } from "antd";

import { Input } from "antd";
import { Table, Checkbox, Button, Row, Col } from "antd";
import { Image } from "antd";
import { Link } from "react-router-dom";

const { Search } = Input;
const { Title, Text } = Typography;

const AccountCusHeader = () => {
  const admin = JSON.parse(localStorage.getItem("admin"));
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
              href: "/admin",
              title: <HomeOutlined />,
            },
            {
              href: "/admin",
              title: (
                <>
                  <Link to="/admin">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "#9F78FF",
                      }}
                    >
                      <UserOutlined />
                      &nbsp;
                      <span>Khách hàng</span>
                    </div>
                  </Link>
                </>
              ),
            },
          ]}
        />
        <Title level={4}>Khách hàng</Title>
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
          <Text>{admin.role}</Text>
        </div>
      </div>
    </div>
  );
};

const AccountCusContent = ({ itemsPerPage }) => {
  const columns = [
    {
      title: "STT",
      width: 50,
      dataIndex: "index",
      key: "index",
      fixed: "left",
    },
    {
      title: "Hình đại diện",
      width: 150,
      dataIndex: "avatar",
      key: "avatar",
      render: () => (
        <Image
          width={100}
          height={90}
          style={{ objectFit: "contain" }}
          src="https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2Fadmin.jpg?alt=media&token=db12c20e-d638-40e3-b538-61f4cb9706a9"
        />
      ),
    },
    {
      title: "Tên người dùng",
      dataIndex: "username",
      key: "1",
      width: 150,
    },
    {
      title: "Họ và tên",
      dataIndex: "fullname",
      key: "2",
      width: 150,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "3",
      width: 150,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "4",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "5",
      width: 150,
    },
  ];
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      index: i,
      username: `Tú ${i}`,
      fullname: `Đào Anh Tú ${i}`,
      phone: `0937550256`,
      email: `tudase151149@fpt.edu.vn ${i}`,
      avatar: "https://bulma.io/images/placeholders/256x256.png",
      address: `Hcm ${i}`,
    });
  }
  const defaultCheckedList = columns.map((item) => item.key);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const options = columns.map(({ key, title }) => ({
    label: title,
    value: key,
  }));
  const newColumns = columns.map((item) => ({
    ...item,
    hidden: !checkedList.includes(item.key),
  }));
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Checkbox.Group
            value={checkedList}
            options={options}
            onChange={(value) => {
              setCheckedList(value);
            }}
            style={{ backgroundColor: "" }}
          />
        </div>
        <Row justify="start">
          <Col span={4}>
            <Button>Tổng cộng ()</Button>
          </Col>
        </Row>
      </div>

      <Table
        columns={newColumns}
        dataSource={data}
        pagination={{
          position: ["bottomCenter"],
        }}
        style={{
          marginTop: 24,
        }}
        scroll={{
          y: 435,
        }}
      />
    </>
  );
};

export const AccountCus = () => {
  return (
    <>
      <div
        style={{
          padding: "20px 20px",
          backgroundColor: "#FFFFFF",
          border: "1px solid #9F78FF",
        }}
        className="admin-cus-header"
      >
        <AccountCusHeader />
      </div>
      <div
        className="admin-cus-content"
        style={{
          height: "83vh",
          overflowY: "scroll",
          border: "1px solid #9F78FF",
        }}
      >
        <AccountCusContent />
      </div>
    </>
  );
};
