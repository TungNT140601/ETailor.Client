import React, { useState } from "react";
import "./index.css";
import { Breadcrumb } from "antd";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Typography } from "antd";

import { Input } from "antd";
import { Divider } from "antd";
import { Table, Checkbox } from "antd";
import { Image } from "antd";

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
                  <UserOutlined />
                  <span>Khách hàng</span>
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
      <Checkbox.Group
        value={checkedList}
        options={options}
        onChange={(value) => {
          setCheckedList(value);
        }}
      />
      <Table
        columns={newColumns}
        dataSource={data}
        style={{
          marginTop: 24,
        }}
        scroll={{
          x: 1500,
          y: "84vh",
        }}
      />
    </>
  );
};

export const AccountCus = () => {
  return (
    <>
      <div>
        <AccountCusHeader />
        <Divider />
        <AccountCusContent />
      </div>
    </>
  );
};
