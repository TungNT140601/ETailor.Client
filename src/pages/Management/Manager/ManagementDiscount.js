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
} from "@ant-design/icons";
import { Typography, Carousel, Table, Checkbox } from "antd";
import "./index.css";
import DiscountIcon from "@mui/icons-material/Discount";

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

const ManagementDiscountHeader = () => {
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
              href: "/manager/discount",
              title: (
                <>
                  <Link to="/manager/discount">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <DiscountIcon fontSize="small" style={{ fontSize: 15 }} />
                      &nbsp;
                      <span>Mã giảm giá</span>
                    </div>
                  </Link>
                </>
              ),
            },
          ]}
        />
        <Title level={4}>Mã giảm giá</Title>
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

const ManagementDiscountContent = () => {
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
      title: "Tên mã",
      dataIndex: "name",
      key: "1",
      width: 150,
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "2",
      width: 150,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startdate",
      key: "3",
      width: 150,
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "enđate",
      key: "4",
      width: 150,
    },
    {
      title: "Giám giá theo %",
      dataIndex: "discountpercent",
      key: "5",
      width: 150,
    },
    {
      title: "Số tiền giảm",
      dataIndex: "discountprice",
      key: "6",
      width: 150,
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "7",
      width: 100,
      fixed: "right",
      render: () => (
        <Row justify="center">
          <Col>
            <Button
              type="primary"
              icon={<DeleteOutlined />}
              size="default"
              danger
            />
          </Col>
          <Col offset={2}>
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
      name: `Tudeptrai${i}`,
      code: `21050${i}`,
      startdate: `29/1/2024`,
      enđate: `30/1/2024`,
      discountpercent: `100`,
      discountprice: `2.000.000`,
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
          y: 435,
        }}
      />
    </div>
  );
};

function ManagementDiscount() {
  return (
    <div>
      <div
        style={{
          padding: "20px 20px",
          backgroundColor: "#FFFFFF",
        }}
        className="manager-header"
      >
        <ManagementDiscountHeader />
      </div>
      <div
        className="manager-content"
        style={{ height: "84vh", overflowY: "scroll" }}
      >
        <ManagementDiscountContent />
      </div>
    </div>
  );
}

export default ManagementDiscount;
