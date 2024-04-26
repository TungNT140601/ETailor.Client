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

function Refund({
  open,
  onCancel,
  saveIdOrder,
  handleCancelOrder,
  dataOrderDetail,
  formatCurrency,
}) {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [loading, setLoading] = useState(false);
  console.log("dataOrderDetail", dataOrderDetail);
  const items = [
    {
      key: "1",
      label: "Họ và tên",
      children: dataOrderDetail && dataOrderDetail?.customer.fullname,
    },
    {
      key: "2",
      label: " Địa chỉ Email",
      children: dataOrderDetail && dataOrderDetail?.customer.email,
    },
    {
      key: "3",
      label: "Số điện thoại",
      children: dataOrderDetail && dataOrderDetail?.customer.phone,
    },
    {
      key: "4",
      label: "Số tiền đã thanh toán",
      children: dataOrderDetail && (
        <b>{formatCurrency(dataOrderDetail?.paidMoney)}</b>
      ),
    },
    {
      key: "5",
      label: "Tiền đặt cọc",
      children: dataOrderDetail && (
        <b>
          {dataOrderDetail?.deposit
            ? formatCurrency(dataOrderDetail?.deposit)
            : "0đ"}
        </b>
      ),
    },
    {
      key: "6",
      label: "Tổng sản phẩm",
      children: dataOrderDetail && dataOrderDetail?.totalProduct + " sản phẩm",
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
        title="Xác nhận hoàn trả cho khách"
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
            <Descriptions
              title="Thông tin hoàn trả"
              items={items}
              style={{ marginTop: 10 }}
            />
            <br />
            <Title level={5}>Danh sách sản phẩm</Title>
            <div
              style={{
                height: 400,
                overflowY: "scroll",
                scrollbarWidth: "none",
                WebkitScrollbar: "none",
                border: "1px solid #9F78FF",
                padding: "0px 15px",
              }}
            >
              <List
                pagination={false}
                dataSource={dataOrderDetail && dataOrderDetail?.products}
                renderItem={(item, index) => (
                  <List.Item key={item.id}>
                    <List.Item.Meta
                      avatar={
                        <Image width={70} src={item.templateThumnailImage} />
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
                              <b>Giá sản phẩm:</b> {formatCurrency(item.price)}
                            </Text>
                          </div>
                        </>
                      }
                    />
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <b>Trạng thái:</b>
                        <Tag color={getColorForStatus(item.status)}>
                          {(() => {
                            switch (item.status) {
                              case 1:
                                return "Chưa bắt đầu";
                              case 2:
                                return "Trong quá trình";
                              case 3:
                                return "Tạm dừng";
                              case 4:
                                return "Trả hàng";
                              default:
                                return "Không xác định";
                            }
                          })()}
                        </Tag>
                      </div>
                      <div>
                        <b>Vải sử dụng:</b> Vải khách hàng
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </>
        )}
      </Modal>
    </>
  );
}

export default Refund;
