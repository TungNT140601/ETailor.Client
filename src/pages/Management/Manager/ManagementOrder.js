import React, { useEffect, useState } from "react";
import { Breadcrumb } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Typography, Table, Checkbox } from "antd";
import "./index.css";

import { Input } from "antd";
import { Button } from "antd";
import { Image } from "antd";
import { Avatar, Col, Row, Card, Modal, Divider, Carousel } from "antd";
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
  const [dataOrder, setDataOrder] = useState([]);
  const [loading, setLoading] = useState([]);
  const getUrl = "https://etailorapi.azurewebsites.net/api/order";

  const handleDataMaterial = async () => {
    setLoading(true);
    try {
      const response = await fetch(getUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.json();
        setLoading(false);
        setDataOrder(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  useEffect(() => {
    handleDataMaterial();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "STT",
      width: 70,
      dataIndex: "stt",
      key: "index",
      fixed: "left",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "1",
      width: 160,
      fixed: "left",
      render: () => (
        <>
          <Text
            style={{
              backgroundColor: "rgba(255, 191, 0, 0.2)",
              padding: "5px 10px",
              color: "rgb(235, 177, 7)",
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
      title: "Tổng sản phẩm",
      width: 150,
      dataIndex: "totalProduct",
      key: "2",
    },
    {
      title: "Tổng giá tiền",
      dataIndex: "totalPrice",
      key: "3",
      width: 150,
    },
    {
      title: "Số tiền giảm",
      dataIndex: "discountPrice",
      key: "4",
      width: 150,
    },
    {
      title: "Mã giảm",
      dataIndex: "discountCode",
      key: "5",
      width: 150,
    },
    {
      title: "Số tiền sau khi giảm",
      dataIndex: "afterDiscountPrice",
      key: "6",
      width: 200,
    },
    {
      title: "Tiền đặt cọc đã trả",
      dataIndex: "payDeposit",
      key: "7",
      width: 200,
    },
    {
      title: "Tiền trả trước",
      dataIndex: "deposit",
      key: "8",
      width: 150,
    },
    {
      title: "Tiền đã trả",
      dataIndex: "paidMoney",
      key: "9",
      width: 150,
    },
    {
      title: "Tiền còn lại",
      dataIndex: "unPaidMoney",
      key: "10",
      width: 150,
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "11",
      width: 100,
      fixed: "right",
      render: () => (
        <>
          <Row justify="start">
            <Col span={4}>
              <EyeOutlined
                title="Xem chi tiết"
                style={{
                  backgroundColor: "rgb(140, 173, 245)",
                  color: "white",
                  padding: 6,
                  borderRadius: "5px",
                  fontSize: 15,
                  cursor: "pointer",
                }}
                onClick={showModal}
              />
            </Col>
          </Row>
        </>
      ),
    },
  ];

  const getApi = dataOrder?.map((item, index) => ({
    stt: index + 1,
    status: item.name,
    totalProduct: item.totalProduct,
    totalPrice: item.totalPrice,
    discountPrice: item.discountPrice,
    discountCode: item.discountCode,
    afterDiscountPrice: item.afterDiscountPrice,
    payDeposit: item.payDeposit,
    deposit: item.deposit,
    paidMoney: item.paidMoney,
    unPaidMoney: item.unPaidMoney,
  }));

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

  //---------------------------------------------------------------------------------------------------------------------------------------------------------

  const data1 = [
    {
      key: "1",
      index: "1",
      name: "Bản mâu 1",
      productName: "Sản phẩm 1",
      address: "Loại vải 1",
    },
    {
      key: "2",
      index: "2",
      name: "Bản mẫu 2",
      productName: "Sản phẩm 1",
      address: "Loại vải 1",
    },
    {
      key: "3",
      index: "3",
      name: "Bản mẫu 3",
      productName: "Sản phẩm 1",
      address: "Loại vải 1",
    },
    {
      key: "4",
      index: "4",
      name: "Bản mẫu 4",
      productName: "Sản phẩm 1",
      address: "Loại vải 1",
    },
    {
      key: "5",
      index: "5",
      name: "Bản mẫu 5",
      productName: "Sản phẩm 1",
      address: "Loại vải 1",
    },
  ];

  const columns1 = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 60,
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Bản mẫu",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Loại vải",
      dataIndex: "address",
      key: "address",
      render: (text) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image
            width={35}
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          />
          &nbsp; &nbsp;
          <Title level={5}>{text}</Title>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "1",
      width: 160,
      fixed: "left",
      render: () => (
        <>
          <Text
            style={{
              backgroundColor: "rgba(255, 191, 0, 0.2)",
              padding: "5px 10px",
              color: "rgb(235, 177, 7)",
              fontWeight: "600",
              borderRadius: "10px",
            }}
          >
            Chưa bắt đầu
          </Text>
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Row justify="start">
            <Col span={4}>
              <EyeOutlined
                title="Xem chi tiết"
                style={{
                  backgroundColor: "rgb(140, 173, 245)",
                  color: "white",
                  padding: 6,
                  borderRadius: "5px",
                  fontSize: 15,
                  cursor: "pointer",
                }}
                onClick={showModal}
              />
            </Col>
          </Row>
        </>
      ),
    },
  ];

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
        <Row justify="start">
          <Col span={4}>
            <Button>Tổng cộng ({getApi?.length})</Button>
          </Col>
        </Row>
      </div>
      {loading ? (
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
          dataSource={getApi}
          pagination={{
            position: ["bottomCenter"],
          }}
          style={{
            marginTop: 24,
          }}
          scroll={{ x: 1500, y: 416 }}
        />
      )}

      <Modal
        title="Chi tiết đơn hàng"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={900}
        style={{ top: 20 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 24,
          }}
        >
          <div>
            <Divider orientation="left">Thông tin đơn hàng</Divider>
            <div
              style={{
                border: "1px solid #9F78FF",
                width: 850,
                height: 150,
                padding: "0px 10px",
                borderRadius: "5px",
                overflowY: "scroll",
                scrollbarWidth: "none",
                WebkitScrollbar: "none",
              }}
            >
              <Row gutter={[16, 12]} style={{ padding: "12px 12px" }}>
                <Col className="gutter-row" span={8}>
                  <Text level={5}>
                    <b>Tổng sản phẩm:</b> 4
                  </Text>
                </Col>
                <Col className="gutter-row" span={8}>
                  <Text level={5}>
                    <b>Tổng giá tiền:</b> 120.000đ
                  </Text>
                </Col>
                <Col className="gutter-row" span={8}>
                  <Text level={5}>
                    <b>Số tiền giảm:</b> 20.000đ
                  </Text>
                </Col>
                <Col className="gutter-row" span={8}>
                  <Text level={5}>
                    <b>Mã giảm:</b> MungXuan2024
                  </Text>
                </Col>
                <Col className="gutter-row" span={8}>
                  <Text level={5}>
                    <b>Số tiền sau khi giảm:</b> 20.000đ
                  </Text>
                </Col>
                <Col className="gutter-row" span={8}>
                  <Text level={5}>
                    <b>Tiền đặt cọc đã trả:</b> 20.000đ
                  </Text>
                </Col>
                <Col className="gutter-row" span={8}>
                  <Text level={5}>
                    <b>Tiền trả trước:</b> 20.000đ
                  </Text>
                </Col>
                <Col className="gutter-row" span={8}>
                  <Text level={5}>
                    <b>Tiền đã trả:</b> 20.000đ
                  </Text>
                </Col>
                <Col className="gutter-row" span={8}>
                  <Text level={5}>
                    <b>Tiền còn lại:</b> 20.000đ
                  </Text>
                </Col>
              </Row>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 24,
          }}
        >
          <Divider orientation="left">Chi tiết đơn hàng</Divider>
          <div
            style={{
              border: "1px solid #9F78FF",
              width: 850,
              height: 260,
              padding: "0px 10px",
              borderRadius: "5px",
            }}
          >
            <Table
              columns={columns1}
              dataSource={data1}
              pagination={false}
              scroll={{
                y: 200,
              }}
            />
          </div>
        </div>
      </Modal>
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
