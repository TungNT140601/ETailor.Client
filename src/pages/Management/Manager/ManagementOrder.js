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

import {
  Avatar,
  Col,
  Row,
  Card,
  Modal,
  Divider,
  Carousel,
  Tag,
  Image,
  Button,
  Input,
} from "antd";
import CircularProgress from "@mui/material/CircularProgress";

import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useQuery } from "react-query";

const { Search } = Input;
const { Title, Text } = Typography;

function formatCurrency(amount) {
  if (amount) {
    const strAmount = amount.toString();
    const parts = [];
    for (let i = strAmount.length - 1, j = 0; i >= 0; i--, j++) {
      if (j > 0 && j % 3 === 0) {
        parts.unshift(".");
      }
      parts.unshift(strAmount[i]);
    }
    return parts.join("") + "đ";
  }
  return null;
}

const ManagementOrderHeader = () => {
  const manager = JSON.parse(localStorage.getItem("manager"));
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
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [dataOrder, setDataOrder] = useState([]);
  const [loading, setLoading] = useState([]);
  const getUrl = "https://e-tailorapi.azurewebsites.net/api/order";

  console.log("Data Order", dataOrder);

  const handleDataOrder = async () => {
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
    handleDataOrder();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [saveIdOrder, setSaveIdOrder] = useState(null);
  const showModal = async (id) => {
    await setSaveIdOrder(id);
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
      title: "Mã đơn",
      width: 150,
      dataIndex: "id",
      key: "1",
      fixed: "left",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "2",
      width: 160,
      fixed: "left",
      render: (_, record) => {
        console.log(record.status);
        switch (record.status) {
          case 1:
            return <Tag color="purple">Chờ xác nhận</Tag>;
          case 2:
            return <Tag color="lime">Đã xác nhận</Tag>;
          case 3:
            return <Tag color="gold">Chưa bắt đầu</Tag>;
          case 4:
            return <Tag color="blue">Trong quá trình</Tag>;
          case 5:
            return <Tag color="green">Hoàn thành</Tag>;
          case 6:
            return <Tag color="cyan">Kiểm tra</Tag>;
          case 7:
            return <Tag color="green">Đã giao</Tag>;
          default:
            return <Tag color="red">Hủy đơn</Tag>;
        }
      },
    },
    {
      title: "Tổng sản phẩm",
      width: 150,
      dataIndex: "totalProduct",
      key: "3",
    },
    {
      title: "Tổng giá tiền",
      dataIndex: "totalPrice",
      key: "4",
      width: 150,
      render: (_, record) => (
        <Text>
          {`${record.totalPrice}đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </Text>
      ),
    },
    {
      title: "Số tiền giảm",
      dataIndex: "discountPrice",
      key: "5",
      width: 150,
      render: (_, record) => (
        <Text>
          {`${record.discountPrice}đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </Text>
      ),
    },
    {
      title: "Mã giảm",
      dataIndex: "discountCode",
      key: "6",
      width: 150,
    },
    {
      title: "Số tiền sau khi giảm",
      dataIndex: "afterDiscountPrice",
      key: "7",
      width: 200,
      render: (_, record) => (
        <Text>
          {`${record.afterDiscountPrice}đ`.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ","
          )}
        </Text>
      ),
    },
    {
      title: "Tiền đặt cọc đã trả",
      dataIndex: "payDeposit",
      key: "8",
      width: 200,
      render: (_, record) =>
        record.payDeposit ? (
          <Text>
            {`${record.payDeposit}đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </Text>
        ) : (
          <Text>{`0đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
        ),
    },
    {
      title: "Tiền trả trước",
      dataIndex: "deposit",
      key: "9",
      width: 150,
      render: (_, record) =>
        record.deposit === null ? (
          <Text>{`0đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
        ) : (
          <Text>
            {`${record.deposit}đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </Text>
        ),
    },
    {
      title: "Tiền đã trả",
      dataIndex: "paidMoney",
      key: "10",
      width: 150,
      render: (_, record) =>
        record.paidMoney ? (
          <Text>
            {`${record.paidMoney}đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </Text>
        ) : (
          <Text>{`0đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
        ),
    },
    {
      title: "Tiền còn lại",
      dataIndex: "unPaidMoney",
      key: "11",
      width: 150,
      render: (_, record) => (
        <Text>
          {`${record.unPaidMoney}đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </Text>
      ),
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "12",
      width: 100,
      fixed: "right",
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
                onClick={() => showModal(record.id)}
              />
            </Col>
          </Row>
        </>
      ),
    },
  ];

  const getApi = dataOrder?.map((item, index) => ({
    stt: index + 1,
    id: item.id,
    status: item.status,
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

      <ViewDetailOrder
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        saveIdOrder={saveIdOrder}
        setSaveIdOrder={setSaveIdOrder}
      />
    </div>
  );
};

const ViewDetailOrder = ({
  isModalOpen,
  handleCancel,
  handleOk,
  saveIdOrder,
}) => {
  const manager = JSON.parse(localStorage.getItem("manager"));

  const getUrl = "https://e-tailorapi.azurewebsites.net/api/order";
  const [loading, setLoading] = useState(false);
  const [dataOrderDetail, setDataOrderDetail] = useState(null);

  const handleDataOrder = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${getUrl}/${saveIdOrder}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.json();
        setLoading(false);
        setDataOrderDetail(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  useEffect(() => {
    handleDataOrder();
  }, [saveIdOrder]);

  const columns1 = [
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "1",
      width: 160,
      fixed: "left",
      render: (_, record) => {
        switch (record.status) {
          case 1:
            return <Tag color="default">Chưa bắt đầu</Tag>;
          case 2:
            return <Tag color="blue">Trong quá trình</Tag>;
          case 3:
            return <Tag color="gold">Tạm dừng</Tag>;
          case 4:
            return <Tag color="green">Hoàn thành</Tag>;
          default:
            return <Tag color="red">Hủy bỏ</Tag>;
        }
      },
    },
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 60,
      render: (_, record, index) => <span>{index}</span>,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Bản mẫu",
      dataIndex: "templateName",
      key: "templateName",
    },
    {
      title: "Hình ảnh bản mẫu",
      dataIndex: "templateThumnailImage",
      key: "templateThumnailImage",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image width={35} src={record.templateThumnailImage} />
        </div>
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
              />
            </Col>
          </Row>
        </>
      ),
    },
  ];

  console.log("Order detail: ", dataOrderDetail);

  return (
    <div>
      <Modal
        title="Chi tiết đơn hàng"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
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
            <Button key="back" onClick={handleCancel}>
              Hủy bỏ
            </Button>
            ,
            <Button key="submit" type="primary" onClick={handleOk}>
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
          <Row>
            <Col span={18}>
              <div
                style={{
                  border: "1px solid #9F78FF",
                  width: 850,
                  height: 590,
                  padding: "0px 10px",
                  borderRadius: "5px",
                }}
              >
                <Divider style={{ marginTop: 12 }}>Thông tin sản phẩm</Divider>
                <Table
                  columns={columns1}
                  dataSource={dataOrderDetail && dataOrderDetail.products}
                  pagination={false}
                  scroll={{
                    y: 450,
                    x: 1000,
                  }}
                />
              </div>
            </Col>

            <Col span={6}>
              <Row>
                <Col span={24}>
                  <div
                    style={{
                      border: "1px solid #9F78FF",
                      borderRadius: "5px",
                      padding: 10,
                    }}
                  >
                    <Divider style={{ marginTop: 0 }}>
                      Thông tin khách hàng
                    </Divider>
                    <div
                      style={{
                        margin: "10px 0",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Avatar
                        size={"large"}
                        src={
                          dataOrderDetail?.customer?.avatar
                            ? dataOrderDetail?.customer?.avatar
                            : "https://api.dicebear.com/7.x/miniavs/svg?seed=1"
                        }
                      />
                    </div>
                    <div style={{ margin: "10px 0" }}>
                      <Text
                        level={5}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <b>Họ và tên:</b> {dataOrderDetail?.customer?.fullname}
                      </Text>
                    </div>
                    <div style={{ margin: "10px 0" }}>
                      <Text
                        level={5}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <b>Số điện thoại:</b>{" "}
                        {dataOrderDetail?.customer?.phone
                          ? dataOrderDetail?.customer?.phone
                          : "Chưa có!"}
                      </Text>
                    </div>
                    <div
                      style={{
                        margin: "10px 0",
                        maxWidth: "100%",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Text
                        level={5}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <b>Địa chỉ: </b>
                        &nbsp;
                        <span
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {dataOrderDetail?.customer?.address
                            ? dataOrderDetail?.customer?.address
                            : "Chưa có!"}
                        </span>
                      </Text>
                    </div>
                    <div
                      style={{
                        margin: "10px 0",
                        maxWidth: "100%",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Text
                        level={5}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <b>Email: </b>
                        &nbsp;
                        <span
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {dataOrderDetail?.customer?.email
                            ? dataOrderDetail?.customer?.email
                            : "Chưa có!"}
                        </span>
                      </Text>
                    </div>
                  </div>
                </Col>
              </Row>
              <div
                style={{
                  border: "1px solid #9F78FF",
                  borderRadius: "5px",
                  height: 340,
                  padding: 10,
                  marginTop: 10,
                }}
              >
                <Divider style={{ marginTop: 0 }}>Thông tin đơn hàng</Divider>
                <div style={{ margin: "10px 0" }}>
                  <Text
                    level={5}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <b>Tổng sản phẩm:</b> {dataOrderDetail?.totalProduct}
                  </Text>
                </div>
                <div style={{ margin: "10px 0" }}>
                  <Text
                    level={5}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <b>Tổng giá tiền:</b>{" "}
                    {formatCurrency(dataOrderDetail?.totalPrice)}
                  </Text>
                </div>
                <div style={{ margin: "10px 0" }}>
                  <Text
                    level={5}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <b>Số tiền giảm:</b>{" "}
                    {formatCurrency(dataOrderDetail?.discountPrice)}
                  </Text>
                </div>
                {dataOrderDetail?.discountCode && (
                  <div style={{ margin: "10px 0" }}>
                    <Text
                      level={5}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <b>Chương trình giảm giá:</b>{" "}
                      {dataOrderDetail?.discountCode}
                    </Text>
                  </div>
                )}
                <div style={{ margin: "10px 0" }}>
                  <Text
                    level={5}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <b>Số tiền sau khi giảm:</b>{" "}
                    {formatCurrency(dataOrderDetail?.afterDiscountPrice)}
                  </Text>
                </div>
                <div style={{ margin: "10px 0" }}>
                  <Text
                    level={5}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <b>Tiền đặt cọc:</b>{" "}
                    {formatCurrency(dataOrderDetail?.deposit)}
                  </Text>
                </div>
                <div style={{ margin: "10px 0" }}>
                  <Text
                    level={5}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <b>Tiền đã trả:</b>{" "}
                    {formatCurrency(dataOrderDetail?.paidMoney)}
                  </Text>
                </div>
                <div style={{ margin: "10px 0" }}>
                  <Text
                    level={5}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <b>Tiền còn lại:</b>{" "}
                    {formatCurrency(dataOrderDetail?.unPaidMoney)}
                  </Text>
                </div>
              </div>
            </Col>
          </Row>
        )}
      </Modal>
    </div>
  );
};

function ManagementOrder() {
  const manager = JSON.parse(localStorage.getItem("manager"));
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
