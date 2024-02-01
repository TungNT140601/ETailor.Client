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
  PlusOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Typography, Carousel, Table, Checkbox } from "antd";
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
  Upload,
  Radio,
} from "antd";

import Paragraph from "antd/es/skeleton/Paragraph";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useQuery } from "react-query";

const { Search, TextArea } = Input;
const { Title, Text } = Typography;
const { Meta } = Card;
const { Option } = Select;

const manager = JSON.parse(localStorage.getItem("manager"));
console.log("manager", manager);

const ManagementBodySizeHeader = () => {
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
              href: "/manager/account/staffs",
              title: (
                <>
                  <Link to="/manager/account/staffs">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <UserOutlined fontSize="small" />
                      &nbsp;
                      <span>Nhân viên</span>
                    </div>
                  </Link>
                </>
              ),
            },
          ]}
        />
        <Title level={4}>Nhân viên</Title>
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
          <Text>{manager?.name}</Text>
        </div>
      </div>
    </div>
  );
};

const ManagementBodySizeContent = () => {
  //   const getStaffUrl = "https://etailorapi.azurewebsites.net/api/staff";
  //   const manager = JSON.parse(localStorage.getItem("manager"));
  //   const { data: staffs, isLoading: loading } = useQuery("getStaffs", () =>
  //     fetch(getStaffUrl, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${manager?.token}`,
  //       },
  //     }).then((response) => response.json())
  //   );

  const columns = [
    {
      title: "STT",
      width: 50,
      dataIndex: "stt",
      key: "index",
      fixed: "left",
    },
    {
      title: "Hình ảnh",
      width: 150,
      dataIndex: "image",
      key: "image",
      render: () => (
        <Image
          width={150}
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
      ),
      //   render: (_, record) => (
      //     <Image
      //       width={100}
      //       height={90}
      //       style={{ objectFit: "contain" }}
      //       src={record.avatar}
      //     />
      //   ),
    },
    {
      title: "Số đo từng bộ phận",
      dataIndex: "BodyPart",
      key: "1",
      width: 150,
    },
    {
      title: "Tên cơ thể",
      dataIndex: "name",
      key: "2",
      width: 150,
    },
    {
      title: "Clip hướng dẫn",
      dataIndex: "GuideVideoLink",
      key: "3",
      width: 150,
      render: () => (
        <Button type="link">
          <a href="#">Nhấn vào để xem</a>
        </Button>
      ),
    },
    {
      title: "Giá trị tối thiểu",
      dataIndex: "MinValidValue",
      key: "4",
      width: 150,
    },
    {
      title: "Giá trị tối đa",
      dataIndex: "MaxValidValue",
      key: "5",
      width: 150,
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "6",
      width: 100,
      fixed: "right",
      render: () => (
        <Row justify="center">
          <Col span={4}>
            <Button
              type="primary"
              icon={<DeleteOutlined />}
              size="default"
              danger
            />
          </Col>
          <Col span={4} offset={5}>
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="default"
              warning
            />
          </Col>
        </Row>
      ),
    },
  ];

  //   const getApi = staffs?.data?.map((item) => ({
  //     stt: item.stt,
  //     avatar: item.avatar,
  //     username: item.username,
  //     fullname: item.fullname,
  //     address: item.address,
  //     phone: item.phone,
  //   }));

  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      stt: i,
      name: `Edward ${i}`,
      BodyPart: `${i}`,
      address: `London Park no. ${i}`,
      MinValidValue: `${i}`,
      MaxValidValue: `${i}`,
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
    <div>
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
          />
        </div>
        <Row justify="start" style={{ paddingRight: "24px" }}>
          <Col span={4}>
            <Button>Tổng cộng ({manager?.totalData})</Button>
          </Col>
          <Col span={4} offset={12}>
            <Button type="primary">Thêm mới</Button>
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
          x: 1500,
          y: 435,
        }}
      />
    </div>
  );
};

function ManagementBodySize() {
  return (
    <div>
      <div
        style={{
          padding: "20px 20px",
          backgroundColor: "#FFFFFF",
        }}
        className="manager-header"
      >
        <ManagementBodySizeHeader />
      </div>
      <div
        className="manager-content"
        style={{ height: "84vh", overflowY: "scroll" }}
      >
        <ManagementBodySizeContent />
      </div>
    </div>
  );
}

export default ManagementBodySize;
