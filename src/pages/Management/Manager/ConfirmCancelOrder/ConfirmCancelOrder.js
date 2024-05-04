import React, { useEffect, useState } from "react";
import { Breadcrumb } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Typography, Table, Checkbox } from "antd";

import {
  Avatar,
  Col,
  Row,
  Modal,
  Divider,
  Tag,
  Image,
  Button,
  Input,
  Badge,
  Flex,
  Card,
  Popover,
  Descriptions,
  List,
} from "antd";
import CircularProgress from "@mui/material/CircularProgress";
import toast, { Toaster } from "react-hot-toast";

import { Link } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

export const ConfirmCancelOrder = ({
  open,
  onCancel,
  dataOrderDetail,
  formatCurrency,
  handleCancelOrder,
  saveIdOrder,
}) => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [loading, setLoading] = useState(false);
  console.log("dataOrderDetail", dataOrderDetail);
  // const items = [
  //   {
  //     key: "1",
  //     label: "Họ và tên",
  //     children: dataOrderDetail && dataOrderDetail?.customer.fullname,
  //   },
  //   {
  //     key: "2",
  //     label: " Địa chỉ Email",
  //     children: dataOrderDetail && dataOrderDetail?.customer.email,
  //   },
  //   {
  //     key: "3",
  //     label: "Số điện thoại",
  //     children: dataOrderDetail && dataOrderDetail?.customer.phone,
  //   },
  //   {
  //     key: "4",
  //     label: "Số tiền đã thanh toán",
  //     children: dataOrderDetail && (
  //       <b>{formatCurrency(dataOrderDetail?.paidMoney)}</b>
  //     ),
  //   },
  //   {
  //     key: "5",
  //     label: "Tiền đặt cọc",
  //     children: dataOrderDetail && (
  //       <b>
  //         {dataOrderDetail?.deposit
  //           ? formatCurrency(dataOrderDetail?.deposit)
  //           : "0đ"}
  //       </b>
  //     ),
  //   },
  //   {
  //     key: "6",
  //     label: "Tổng sản phẩm",
  //     children: dataOrderDetail && dataOrderDetail?.totalProduct + " sản phẩm",
  //   },
  // ];

  const itemsRefund = [
    {
      key: "1",
      label: "Họ và tên",
      children: dataOrderDetail && dataOrderDetail?.customer.fullname,
    },
    {
      key: "2",
      label: dataOrderDetail?.customer.phone
        ? "Số điện thoại"
        : "Địa chỉ Email",
      children: dataOrderDetail?.customer.phone
        ? dataOrderDetail?.customer.phone
        : dataOrderDetail?.customer.email,
    },
    {
      key: "3",
      label: "Tổng số tiền",
      children: dataOrderDetail && (
        <b>{formatCurrency(dataOrderDetail?.totalPrice)}</b>
      ),
    },
    {
      key: "4",
      label: "Giảm giá",
      children: dataOrderDetail?.discountPrice ? (
        <b>{formatCurrency(dataOrderDetail?.discountPrice)}</b>
      ) : (
        "Chưa áp mã"
      ),
    },
    {
      key: "5",
      label: "Số tiền còn lại sau khi giảm",
      children: dataOrderDetail?.afterDiscountPrice ? (
        <b>{formatCurrency(dataOrderDetail?.afterDiscountPrice)}</b>
      ) : (
        <b>{formatCurrency(dataOrderDetail?.totalPrice)}</b>
      ),
    },
    {
      key: "6",
      label: "Tổng tiền phải hoàn trả",
      children: dataOrderDetail && (
        <b>{formatCurrency(dataOrderDetail?.paidMoney)}</b>
      ),
    },
    {
      key: "7",
      label: "Vải khách hàng",
      children: dataOrderDetail && <span>Chưa xử lý</span>,
    },
    {
      key: "8",
      label: "Số met vải hoàn trả",
      children: dataOrderDetail && <span>Chưa xử lý</span>,
    },
  ];

  const getColorForStatus = (status) => {
    switch (status) {
      case 1:
        return "purple";
      case 2:
        return "blue";
      case 3:
        return "orange";
      case 4:
        return "red";
      default:
        return "default";
    }
  };

  return (
    <>
      <Modal
        title="Xác nhận hủy đơn hàng"
        open={open}
        onCancel={() => {
          onCancel();
        }}
        width={1200}
        style={{ top: 40, height: 100 }}
        bodyStyle={{ height: "600px" }}
        footer={[
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "0 20px",
            }}
          >
            <Button
              key="chat"
              type="primary"
              style={{ marginLeft: 15 }}
              onClick={() => {
                onCancel();
              }}
            >
              Quay lại
            </Button>
            <Button
              key="chat"
              type="primary"
              style={{ marginLeft: 15 }}
              onClick={async () => {
                const check = await handleCancelOrder(saveIdOrder);
                if (check === 1) {
                  onCancel();
                }
              }}
            >
              Xác nhận
            </Button>
          </div>,
        ]}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "560px",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <>
            {/* <Divider>Thông tin đơn hàng</Divider>
            <Descriptions items={items} style={{ marginTop: 10 }} bordered />
            <br />
            <Divider>Thông tin hoàn trả</Divider>
            <Descriptions
              items={itemsRefund}
              style={{ marginTop: 10 }}
              bordered
            /> */}

            <Row gutter={[24, 16]} style={{ marginTop: 15 }}>
              <Col span={13} style={{}}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Title level={3}>Thông tin sản phẩm</Title>
                  <div></div>
                </div>

                <div
                  style={{
                    height: "550px",
                    overflowY: "scroll",
                    scrollbarWidth: "none",
                    WebkitScrollbar: "none",
                    border: "1px solid #9F78FF",
                    borderRadius: 10,
                    padding: "0px 20px",
                  }}
                >
                  <List
                    pagination={false}
                    dataSource={dataOrderDetail && dataOrderDetail?.products}
                    renderItem={(item, index) => (
                      <List.Item key={item.id}>
                        <List.Item.Meta
                          avatar={
                            <Image
                              width={70}
                              src={item.templateThumnailImage}
                            />
                          }
                          title={<Title level={4}>{item.name}</Title>}
                          description={
                            <>
                              <div>
                                <Text>
                                  <b>Bản mẫu:</b> {item.templateName}
                                </Text>
                              </div>

                              <div style={{ marginTop: 10 }}>
                                <Text>
                                  <b>Giá sản phẩm:</b>{" "}
                                  {formatCurrency(item.price)}
                                </Text>
                              </div>
                            </>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </Col>
              <Col span={10} style={{}}>
                <Title level={3}>Thông tin đơn hàng</Title>
                <Descriptions
                  items={itemsRefund}
                  style={{ marginTop: 10 }}
                  bordered
                  column={1}
                />
              </Col>
            </Row>
          </>
        )}
      </Modal>
    </>
  );
};
