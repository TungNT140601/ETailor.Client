import React, { useEffect, useState } from "react";
import { Breadcrumb } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
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
import { getAvatarGroupUtilityClass } from "@mui/material";

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

  const [checkStatus, setCheckStatus] = useState(null);
  const showModal = async (id, status) => {
    console.log("status", status);
    await setSaveIdOrder(id);
    await setCheckStatus(status);
    setIsModalOpen(true);
  };
  const handleApproveOrder = async (id) => {
    const getUrl = `https://e-tailorapi.azurewebsites.net/api/order/approve/${id}`;
    try {
      const response = await fetch(getUrl, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.text();
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: responseData,
          showConfirmButton: false,
          timer: 4500,
          zIndex: 1000,
        });
        handleDataOrder();
        setIsModalOpen(false);
      } else if (response.status === 400 || response.status === 500) {
        const responseData = await response.text();
        Swal.fire({
          position: "top-center",
          icon: "error",
          title: responseData,
          showConfirmButton: false,
          timer: 4500,
          zIndex: 1000,
        });
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleCancelOrder = async (id) => {
    const getUrl = `https://e-tailorapi.azurewebsites.net/api/order/cancel/${id}`;
    try {
      const response = await fetch(getUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.text();
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: responseData,
          showConfirmButton: false,
          timer: 4500,
          zIndex: 1000,
        });
        handleDataOrder();
        setIsModalOpen(false);
      } else if (response.status === 400 || response.status === 500) {
        const responseData = await response.text();
        Swal.fire({
          position: "top-center",
          icon: "error",
          title: responseData,
          showConfirmButton: false,
          timer: 4500,
          zIndex: 1000,
        });
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
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
        switch (record.status) {
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
                onClick={() => showModal(record.id, record.status)}
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
        handleApproveOrder={handleApproveOrder}
        handleCancel={handleCancel}
        saveIdOrder={saveIdOrder}
        setSaveIdOrder={setSaveIdOrder}
        checkStatus={checkStatus}
        handleCancelOrder={handleCancelOrder}
      />
    </div>
  );
};

const ViewDetailOrder = ({
  isModalOpen,
  handleCancel,
  handleApproveOrder,
  saveIdOrder,
  checkStatus,
  handleCancelOrder,
}) => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  console.log("status modal: ", checkStatus);
  const getUrl = "https://e-tailorapi.azurewebsites.net/api/order";
  const [loading, setLoading] = useState(false);
  const [dataOrderDetail, setDataOrderDetail] = useState(null);
  const [viewDetailProduct, setViewDetailProduct] = useState(false);
  const [detailProductData, setDetailProductData] = useState(null);
  const [dataMaterialDetail, setDataMaterialDetail] = useState(null);
  const [dataProfileBodyDetail, setDataProfileBodyDetail] = useState(null);

  const handleGetDetailMaterial = async (id) => {
    const detailUrl = `https://e-tailorapi.azurewebsites.net/api/material/${id}`;
    try {
      const response = await fetch(`${detailUrl}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.json();
        setDataMaterialDetail(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  const handleGetDetailProfileBody = async (id) => {
    const detailUrl = `https://e-tailorapi.azurewebsites.net/api/profile-body/${id}`;
    try {
      const response = await fetch(`${detailUrl}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.json();
        setDataProfileBodyDetail(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  const handleViewProductDetail = async (id, orderId) => {
    const detailUrl = `https://e-tailorapi.azurewebsites.net/api/product/order/${orderId}/${id}`;
    try {
      const response = await fetch(`${detailUrl}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.json();
        setViewDetailProduct(true);
        handleGetDetailMaterial(responseData.materialId);
        handleGetDetailProfileBody(responseData.profileId);
        setDetailProductData(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

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
                onClick={() =>
                  handleViewProductDetail(record.id, record.orderId)
                }
              />
            </Col>
          </Row>
        </>
      ),
    },
  ];

  return (
    <div>
      <Modal
        title="Chi tiết đơn hàng"
        open={isModalOpen}
        onOk={handleApproveOrder}
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
              Đóng
            </Button>
            {checkStatus === 1 && (
              <>
                <Button
                  key="submit"
                  type="primary"
                  onClick={() => handleCancelOrder(saveIdOrder)}
                  danger
                  style={{ marginLeft: 15 }}
                >
                  Hủy đơn hàng
                </Button>
                <Button
                  key="submit"
                  type="primary"
                  onClick={() => handleApproveOrder(saveIdOrder)}
                  style={{ marginLeft: 15 }}
                >
                  Xác nhận đơn hàng
                </Button>
              </>
            )}

            {}
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
                  position: "relative",
                }}
              >
                {viewDetailProduct && detailProductData ? (
                  <div
                    style={{
                      height: "100%",
                      overflowY: "scroll",
                      scrollbarWidth: "none",
                      WebkitScrollbar: "none",
                    }}
                  >
                    <div
                      style={{ display: "flex", width: "100%", marginTop: 20 }}
                    >
                      <Button
                        type="primary"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => {
                          setViewDetailProduct(false);
                          setDetailProductData(null);
                          setDataMaterialDetail(null);
                          setDataProfileBodyDetail(null);
                        }}
                      >
                        Thoát
                      </Button>
                      <Title
                        level={3}
                        style={{
                          textAlign: "center",
                          marginTop: 0,
                          marginBottom: 0,
                          marginLeft: 280,
                        }}
                      >
                        Chi tiết sản phẩm
                      </Title>
                    </div>

                    <div style={{ marginTop: 20 }}>
                      <Row>
                        <Col span={12}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              height: "100%",
                            }}
                          >
                            <img
                              alt="product-template-detail"
                              style={{
                                width: 300,
                                height: 300,
                                objectFit: "cover",
                                border: "1px solid #9F78FF",
                              }}
                              src={detailProductData?.productTemplateImage}
                            />
                          </div>
                        </Col>
                        <Col span={12}>
                          <Title level={2}>{detailProductData?.name}</Title>
                          <div>
                            <Text style={{ fontSize: 18 }}>
                              Bản mẫu: {detailProductData?.productTemplateName}
                            </Text>
                          </div>
                          <div style={{ marginTop: 10 }}>
                            <Text style={{ fontSize: 18 }}>
                              Nguyên phụ liệu sử dụng:{" "}
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Image
                                  width={50}
                                  src={dataMaterialDetail?.image}
                                  style={{ height: "50px" }}
                                />
                                <Text style={{ marginLeft: 10, fontSize: 18 }}>
                                  {dataMaterialDetail?.name}
                                </Text>
                              </div>
                            </Text>
                          </div>
                          <div style={{ marginTop: 10 }}>
                            <Text style={{ fontSize: 18 }}>
                              Ghi chú: {detailProductData?.note}
                            </Text>
                          </div>
                        </Col>
                        <div style={{ marginTop: 20 }}>
                          <Title level={3} style={{ marginLeft: 40 }}>
                            Số đo cơ thể:
                          </Title>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              border: "1px solid #9F78FF",
                              borderRadius: 10,
                              padding: 15,
                            }}
                          >
                            <Row gutter={[16, 24]} style={{ width: "90%" }}>
                              {dataProfileBodyDetail &&
                                dataProfileBodyDetail?.bodyAttributes?.map(
                                  (bodyAttribute) => {
                                    return (
                                      <Col span={6}>
                                        <Text>
                                          {bodyAttribute?.bodySize?.name} :{" "}
                                          {bodyAttribute?.value} cm
                                        </Text>
                                      </Col>
                                    );
                                  }
                                )}
                            </Row>
                          </div>
                        </div>
                        <div
                          style={{
                            marginTop: 20,
                            marginBottom: 20,
                            width: "100%",
                          }}
                        >
                          <Title level={3} style={{ marginLeft: 40 }}>
                            Kiểu sản phẩm:
                          </Title>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              border: "1px solid #9F78FF",
                              borderRadius: 10,
                              padding: 15,
                            }}
                          >
                            <Row gutter={[16, 24]} style={{ width: "90%" }}>
                              {detailProductData &&
                                detailProductData?.componentTypeOrders?.map(
                                  (componentTypeOrder) => {
                                    const selected =
                                      componentTypeOrder?.components?.find(
                                        (item) =>
                                          item.id ===
                                          componentTypeOrder?.selected_Component_Id
                                      );
                                    console.log("selected", selected);
                                    console.log(
                                      "componentTypeOrder",
                                      componentTypeOrder
                                    );
                                    return (
                                      <Col span={6}>
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <Image
                                            width={50}
                                            src={selected?.image}
                                            style={{ height: "50px" }}
                                          />
                                          <Text
                                            style={{
                                              marginLeft: 10,
                                              fontSize: 18,
                                            }}
                                          >
                                            {selected?.name}
                                          </Text>
                                        </div>
                                      </Col>
                                    );
                                  }
                                )}
                            </Row>
                          </div>
                        </div>
                      </Row>
                    </div>
                  </div>
                ) : (
                  <>
                    <Divider style={{ marginTop: 12 }}>
                      Thông tin sản phẩm
                    </Divider>
                    <Table
                      columns={columns1}
                      dataSource={dataOrderDetail && dataOrderDetail.products}
                      pagination={false}
                      scroll={{
                        y: 450,
                        x: 1000,
                      }}
                    />
                  </>
                )}
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
