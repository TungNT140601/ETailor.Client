import React, { useState } from "react";
import { Breadcrumb } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Typography, Table, Checkbox } from "antd";
import "./index.css";

import { Input } from "antd";
import { Button } from "antd";
import { Image } from "antd";
import { Avatar, Col, Row } from "antd";
import CircularProgress from "@mui/material/CircularProgress";

import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useQuery } from "react-query";

const { Search } = Input;
const { Title, Text } = Typography;

const manager = JSON.parse(localStorage.getItem("manager"));

const ManagementOrderHeader = () => {
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
              title: (
                <Link to="/manager">
                  <div>
                    <HomeOutlined />
                  </div>
                </Link>
              ),
            },
            {
              href: "/manager/orders",
              title: (
                <>
                  <Link to="/manager/orders">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "#9F78FF",
                      }}
                    >
                      <UserOutlined fontSize="small" />
                      &nbsp;
                      <span>Đơn hàng</span>
                    </div>
                  </Link>
                </>
              ),
            },
          ]}
        />
        <Title level={4}>Đơn hàng</Title>
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
          {manager?.avatar ? (
            <Avatar src={manager?.avatar} />
          ) : (
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
          )}
          &nbsp; &nbsp;
          <Text>{manager?.name}</Text>
        </div>
      </div>
    </div>
  );
};

const ManagementOrderContent = () => {
  // const getUrl = "https://etailorapi.azurewebsites.net/api/body-size";

  // const { data: bodySize, isLoading: loading } = useQuery("get-body-size", () =>
  //   fetch(getUrl, {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${manager?.token}`,
  //     },
  //   }).then((response) => response.json())
  // );

  const columns = [
    {
      title: "STT",
      width: 70,
      dataIndex: "stt",
      key: "index",
      fixed: "left",
    },
    {
      title: "Tổng sản phẩm",
      width: 150,
      dataIndex: "totalProduct",
      key: "1",
      fixed: "left",
    },
    {
      title: "Tổng giá tiền",
      dataIndex: "totalPrice",
      key: "2",
      width: 150,
    },
    {
      title: "Số tiền giảm",
      dataIndex: "discountPrice",
      key: "3",
      width: 150,
    },
    {
      title: "Mã giảm",
      dataIndex: "discountCode",
      key: "4",
      width: 150,
    },
    {
      title: "Số tiền sau khi giảm",
      dataIndex: "afterDiscountPrice",
      key: "5",
      width: 200,
    },
    {
      title: "Tiền đặt cọc phải trả",
      dataIndex: "payDeposit",
      key: "6",
      width: 200,
    },
    {
      title: "Tiền trả trước",
      dataIndex: "deposit",
      key: "7",
      width: 150,
    },
    {
      title: "Tiền đã gửi",
      dataIndex: "paidMoney",
      key: "8",
      width: 150,
    },
    {
      title: "Tiền chưa gửi",
      dataIndex: "unPaidMoney",
      key: "9",
      width: 150,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "10",
      width: 200,
      render: () => (
        <>
          <Text
            style={{
              backgroundColor: "#FFBF00",
              padding: "5px 10px",
              color: "white",
              fontWeight: "600",
              borderRadius: "10px",
            }}
          >
            Chờ xác nhận
          </Text>
        </>
      ),
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "11",
      width: 100,
      fixed: "right",
      render: () => (
        <Row justify="start">
          <Col span={4}>
            <CloseOutlined
              style={{
                backgroundColor: "red",
                color: "white",
                padding: 6,
                borderRadius: "5px",
                fontSize: 15,
                cursor: "pointer",
              }}
            />
          </Col>
          <Col span={4} offset={10}>
            <CheckOutlined
              style={{
                backgroundColor: "#50C878",
                color: "white",
                padding: 6,
                borderRadius: "5px",
                fontSize: 15,
                cursor: "pointer",
              }}
            />
          </Col>
        </Row>
      ),
    },
  ];

  // const getApi = bodySize?.map((item, index) => ({
  //   stt: index + 1,
  //   name: item.name,
  //   BodyPart: item.bodyPart,
  //   GuideVideoLink: item.guideVideoLink,
  //   MinValidValue: item.minValidValue,
  //   MaxValidValue: item.maxValidValue,
  // }));

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
        <div style={{ maxWidth: "900px" }}>
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
            <Button>Tổng cộng ({data?.length})</Button>
          </Col>
          <Col span={4} offset={10}>
            <Button>
              Thêm mới <PlusOutlined />
            </Button>
          </Col>
        </Row>
      </div>
      {/* {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "550px",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <Table
          columns={newColumns}
          dataSource={data}
          pagination={{
            position: ["bottomCenter"],
          }}
          style={{
            marginTop: 24,
          }}
        />
      )} */}
      <Table
        columns={newColumns}
        dataSource={data}
        pagination={{
          position: ["bottomCenter"],
        }}
        style={{
          marginTop: 24,
        }}
        scroll={{ x: 1500, y: 445 }}
      />
    </div>
  );
};

function ManagementOrder() {
  return (
    <div>
      <div
        style={{
          padding: "20px 20px",
          backgroundColor: "#FFFFFF",
          border: "1px solid #9F78FF",
        }}
        className="manager-header"
      >
        <ManagementOrderHeader />
      </div>
      <div
        className="manager-content"
        style={{
          height: "83vh",
          overflowY: "scroll",
          border: "1px solid #9F78FF",
        }}
      >
        <ManagementOrderContent />
      </div>
    </div>
  );
}

export default ManagementOrder;
