import React, { useEffect, useState } from "react";
import { message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Typography } from "antd";

import {
  Col,
  Row,
  Modal,
  Tag,
  Image,
  Button,
  Descriptions,
  List,
  InputNumber,
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
  saveIdOrder,
  handleDataOrder,
  handleCancel,
}) => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [loading, setLoading] = useState(false);
  console.log("dataOrderDetail", dataOrderDetail);
  const [refundPercent, setRefundPercent] = useState(100);
  const [caculatePaidMoney, setCalculatePaidMoney] = useState(null);

  const handleRefund = async (id, amount) => {
    const urlCreateNew = `https://e-tailorapi.azurewebsites.net/api/payment/refund/${id}?amount=${amount}`;
    try {
      const response = await fetch(`${urlCreateNew}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.text();
        message.success(responseData);
        await handleDataOrder();
        onCancel();
        handleCancel();
      } else if (response.status === 400 || response.status === 500) {
        const responseData = await response.text();
        toast.error(responseData, {
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };
  const handleCaculatePercentPaidMoney = (value, paidMoney) => {
    if (value > 0 && value <= 100) {
      setRefundPercent(value);
      const caculatePaidMoney = Math.round(
        ((value / 100 / 1000) * paidMoney).toFixed(3) * 1000
      );
      // Math.round() * 1000;
      return setCalculatePaidMoney(caculatePaidMoney);
    } else {
      setCalculatePaidMoney(null);
      return message.error("Phần trăm hoàn trả từ 0 - 100%");
    }
  };
  const handleCheckStatus = (status) => {
    switch (status) {
      case 1:
        return <Tag color="purple">Chờ xác nhận</Tag>;
      case 2:
        return <Tag color="lime">Đã xác nhận</Tag>;
      case 3:
        return <Tag color="default">Chưa bắt đầu</Tag>;
      case 4:
        return <Tag color="blue">Trong quá trình</Tag>;
      case 5:
        return <Tag color="green">Hoàn thành</Tag>;
      case 6:
        return <Tag color="gold">Kiểm tra</Tag>;
      case 7:
        return <Tag color="volcano">Trả hàng</Tag>;
      case 8:
        return <Tag color="green">Đã giao</Tag>;
      default:
        return (
          <Tag color="red" style={{ display: "none" }}>
            Hủy đơn
          </Tag>
        );
    }
  };
  const itemsRefund = [
    {
      key: "1",
      label: "Họ và tên",
      children: dataOrderDetail && dataOrderDetail?.cusName,
    },
    {
      key: "2",
      label: dataOrderDetail?.cusPhone ? "Số điện thoại" : "Địa chỉ Email",
      children: dataOrderDetail?.cusPhone
        ? dataOrderDetail?.cusPhone
        : dataOrderDetail?.cusEmail,
    },

    {
      key: "4",
      label: "Tổng số tiền",
      children: dataOrderDetail && (
        <b>{formatCurrency(dataOrderDetail?.totalPrice)}</b>
      ),
    },
    {
      key: "5",
      label: "Giảm giá",
      children: dataOrderDetail?.discountPrice ? (
        <b>{formatCurrency(dataOrderDetail?.discountPrice)}</b>
      ) : (
        "Chưa áp mã"
      ),
    },
    {
      key: "6",
      label: "Số tiền còn lại sau khi giảm",
      children: dataOrderDetail?.afterDiscountPrice ? (
        <b>{formatCurrency(dataOrderDetail?.afterDiscountPrice)}</b>
      ) : (
        <b>{formatCurrency(dataOrderDetail?.totalPrice)}</b>
      ),
    },
    {
      key: "3",
      label: "Số phần trăm hoàn trả",
      children: dataOrderDetail && (
        <InputNumber
          min={0.1}
          max={100}
          addonAfter={"%"}
          defaultValue={refundPercent}
          onChange={(value) =>
            handleCaculatePercentPaidMoney(value, dataOrderDetail?.paidMoney)
          }
        />
      ),
    },
    {
      key: "7",
      label: "Tổng tiền phải hoàn trả",
      children: dataOrderDetail && (
        <b>
          {caculatePaidMoney
            ? formatCurrency(caculatePaidMoney)
            : formatCurrency(dataOrderDetail?.paidMoney)}
        </b>
      ),
    },
    {
      key: "8",
      label: "Tổng số vải khách đã đưa",
      children:
        dataOrderDetail &&
        dataOrderDetail?.orderMaterials?.filter(
          (material) => material.isCusMaterial
        ) ? (
          <span>
            {dataOrderDetail?.orderMaterials
              ?.filter((material) => material.isCusMaterial)
              .reduce(function (acc, obj) {
                if (obj.isCusMaterial) {
                  return acc + 1;
                }
              }, 0)}
          </span>
        ) : (
          <span>0</span>
        ),
    },
    {
      key: "9",
      label: "Tổng mét vải khách đã đưa",
      children:
        dataOrderDetail &&
        dataOrderDetail?.orderMaterials?.filter(
          (material) => material.isCusMaterial
        ) ? (
          <span>
            {dataOrderDetail?.orderMaterials
              ?.filter((material) => material.isCusMaterial)
              .reduce(function (acc, obj) {
                return acc + obj.value;
              }, 0) + " mét"}
          </span>
        ) : (
          <span>0 mét</span>
        ),
    },
    {
      key: "10",
      label: "Số mét vải hoàn trả",
      children:
        dataOrderDetail &&
        dataOrderDetail?.orderMaterials?.filter(
          (material) => material.isCusMaterial
        ) ? (
          <span>
            {dataOrderDetail?.orderMaterials
              ?.filter((material) => material.isCusMaterial)
              .reduce(function (acc, obj) {
                return acc + obj.value;
              }, 0) + " mét"}
          </span>
        ) : (
          <span>0 mét</span>
        ),
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
        style={{ top: 20, height: 100 }}
        bodyStyle={{ height: "630px" }}
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
                if (dataOrderDetail?.paidMoney) {
                  const check = await handleRefund(
                    saveIdOrder,
                    caculatePaidMoney
                      ? caculatePaidMoney
                      : dataOrderDetail?.paidMoney
                  );
                  if (check === 1) {
                    onCancel();
                  }
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
                    height: "560px",
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
              <Col span={11} style={{}}>
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
