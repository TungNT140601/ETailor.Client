import React, { useState, useEffect, memo } from "react";
import { InputNumber } from "antd";
import {
  FileSearchOutlined,
  DeleteOutlined,
  DollarOutlined,
  EditOutlined,
  CheckOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  Typography,
  Button,
  Divider,
  Card,
  Row,
  Col,
  Form,
  Input,
  Image,
  Table,
  Radio,
  Select,
  Spin,
  Popover,
} from "antd";
import "../index.css";
import CircularProgress from "@mui/material/CircularProgress";
import paymenVnpay from "../../../../assets/payment-method-vnpay.png";
import paymenCash from "../../../../assets/money.png";
import paymenDeposit from "../../../../assets/deposit.png";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { VnPay } from "../../../../components/RealTime/index.js";
import DetailProduct from "../DetailProductOrderToCustomer/DetailProduct.js";
import {
  ConfirmMaterial,
  MaterialComponent,
} from "./StepTwoComponents/MaterialComponent.js";

const { Search } = Input;
const { Title, Text } = Typography;

function StepTwo({
  setCurrent,
  setOpenUpdate,
  orderPaymentDetail,
  loadingStep2,
  saveOrderId,
  handleDataOrderDetail,
  formatCurrency,
  handleDeleteProduct,
  handleCheckUpdateProduct,
  discountForOrder,
  loadingDiscount,
  saveDiscount,
  handleCheckDiscount,
}) {
  const [productChangePrice, setProductChangePrice] = useState({});
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [inputValue, setInputValue] = useState(null);
  const navigate = useNavigate();

  const [active, setActive] = useState(0);
  const [formMaterial] = Form.useForm();
  const [materialLoading, setMaterialLoading] = useState(false);
  const [openConfirmMaterial, setOpenConfirmMaterial] = useState(false);

  const vnpayNotification = VnPay();
  const { resetMessage, message } = vnpayNotification;

  useEffect(() => {
    if (message !== null && message !== undefined && message !== "") {
      if (message === "False") {
        Swal.fire({
          position: "top-center",
          icon: "error",
          title: "Thanh toán VnPay thất bại!",
          showConfirmButton: false,
        });
        resetMessage();
      } else if (message === "True") {
        console.log("Thanh toan vp pay thanh cong");
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Thanh toán VnPay thành công!",
          showConfirmButton: false,
        });
        handleDataOrderDetail();
      }
    }
  }, [message]);

  const onConfirmMaterial = async () => {
    const getFieldMaterial = formMaterial.getFieldsValue();
    if (saveOrderId) {
      const dataBackEnd = getFieldMaterial?.itemsMaterial?.map((items) => {
        const { materialConfirm, value, materialId } = items;
        return {
          materialId,
          isCusMaterial: materialConfirm,
          value,
          orderId: saveOrderId,
        };
      });
      setMaterialLoading(true);
      const url = `https://e-tailorapi.azurewebsites.net/order/${saveOrderId}`;
      try {
        const response = await fetch(`${url}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${manager?.token}`,
          },
          body: JSON.stringify(dataBackEnd),
        });
        if (response.ok && response.status === 200) {
          const responseData = await response.text();
          toast.success(responseData, {
            duration: 3000,
          });
          await handleDataOrderDetail();
          return 1;
        } else if (response.status === 400 || response.status === 500) {
          const responseData = await response.text();
          toast.error(responseData, {
            duration: 3000,
          });
          return 0;
        } else if (response.status === 401) {
          localStorage.removeItem("manager");
          navigate("/management/login");
        }
      } catch (error) {
        console.error("Error calling API:", error);
      } finally {
        setMaterialLoading(false);
      }
    }
  };
  const handleChangePrice = async (value, productId) => {
    if (saveOrderId && productId && value) {
      const url = `https://e-tailorapi.azurewebsites.net/api/product/${saveOrderId}/${productId}/price?price=${value}`;
      try {
        const response = await fetch(`${url}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${manager?.token}`,
          },
        });
        if (response.ok && response.status === 200) {
          const responseData = await response.text();
          toast.success(responseData, {
            duration: 3000,
          });
          await handleDataOrderDetail();
          setProductChangePrice({});
          return 1;
        } else if (response.status === 400 || response.status === 500) {
          const responseData = await response.text();
          toast.error(responseData, {
            duration: 3000,
          });
          return 0;
        } else if (response.status === 401) {
          localStorage.removeItem("manager");
          navigate("/management/login");
        }
      } catch (error) {
        console.error("Error calling API:", error);
      }
    }
  };
  const [paymentLoading, setPaymentLoading] = useState(false);

  const handleCreatePayCash = async (amount, payType, platform) => {
    setPaymentLoading(true);

    const urlCreateNew = `https://e-tailorapi.azurewebsites.net/api/payment/${saveOrderId}?amount=${amount}&payType=${payType}&platform=${platform}`;
    const urlDeposit = `https://e-tailorapi.azurewebsites.net/api/payment/${saveOrderId}?payType=${payType}&platform=${platform}`;
    try {
      const response = await fetch(
        `${amount === 0 ? urlDeposit : urlCreateNew}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${manager?.token}`,
          },
        }
      );
      if (response.ok && response.status === 200) {
        if (platform === "VN Pay") {
          const responseData = await response.json();
          window.open(responseData.link);
        } else {
          await handleDataOrderDetail();
          return 1;
        }
        setActive(0);
      } else if (response.status === 400 || response.status === 500) {
        const responseData = await response.text();
        toast.error(responseData, {
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      setPaymentLoading(false);
    }
  };
  const handleToggleChangePrice = (productId) => {
    setProductChangePrice((prevProductChangePrice) => {
      if (prevProductChangePrice.hasOwnProperty(productId)) {
        delete prevProductChangePrice[productId];
        return { ...prevProductChangePrice };
      } else {
        return {
          ...prevProductChangePrice,
          [productId]: productId,
        };
      }
    });
  };
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [saveIdDetailProduct, setSaveIdDetailProduct] = useState(null);
  const viewDetailProduct = (id) => {
    setSaveIdDetailProduct(id);
    setOpenViewDetail(true);
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: "10%",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      width: "40%",
      key: "name",
      ellipsis: true,
    },
    {
      title: "Bản mẫu",
      dataIndex: "templateName",
      key: "templateName",
      width: "15%",
      ellipsis: true,
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      key: "price",
      width: "15%",
      render: (_, record) =>
        productChangePrice[record.id] ? (
          <InputNumber
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/đ\s?|(,*)/g, "")}
            onChange={(value) => setInputValue(value)}
            onPressEnter={() => {
              handleChangePrice(inputValue, record.id);
            }}
            autoFocus
            onBlur={() =>
              orderPaymentDetail?.paidMoney > 0
                ? ""
                : handleToggleChangePrice(record.id)
            }
          />
        ) : (
          <>
            <Text
              onClick={() =>
                orderPaymentDetail?.paidMoney > 0
                  ? ""
                  : handleToggleChangePrice(record.id)
              }
              style={{ cursor: "pointer" }}
            >
              {formatCurrency(record.price)}
            </Text>
          </>
        ),
    },

    {
      title: "Tùy chỉnh",
      dataIndex: "Action",
      key: "Action",
      width: "20%",
      fixed: "right",
      render: (_, record) => (
        <>
          <Row justify="start">
            <Col span={8}>
              <DeleteOutlined
                style={{
                  backgroundColor: "red",
                  color: "white",
                  padding: 6,
                  borderRadius: "5px",
                  fontSize: 15,
                  cursor: "pointer",
                }}
                onClick={() =>
                  orderPaymentDetail?.paidMoney > 0
                    ? ""
                    : handleDeleteProduct(record.id)
                }
              />
            </Col>
            <Col span={8}>
              <EditOutlined
                style={{
                  backgroundColor: "blue",
                  color: "white",
                  padding: 6,
                  borderRadius: "5px",
                  fontSize: 15,
                  cursor: "pointer",
                }}
                onClick={() => handleCheckUpdateProduct(record.id)}
              />
            </Col>
            <Col span={8}>
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
                onClick={() => viewDetailProduct(record.id)}
              />
            </Col>
          </Row>
        </>
      ),
    },
  ];
  const dataForProduct = orderPaymentDetail?.products?.map((item, index) => ({
    index: index + 1,
    name: item.name,
    templateName: item.templateName,
    templateThumnailImage: item.templateThumnailImage,
    price: item.price,
    id: item.id,
  }));

  return (
    <>
      {openViewDetail && saveIdDetailProduct && (
        <DetailProduct
          open={openViewDetail}
          onCancel={() => setOpenViewDetail(false)}
          saveOrderId={saveOrderId}
          saveIdDetailProduct={saveIdDetailProduct}
          setSaveIdDetailProduct={setSaveIdDetailProduct}
        />
      )}
      <Spin spinning={paymentLoading} fullscreen />
      <Row style={{ marginTop: 24 }}>
        <Col
          span={16}
          style={{
            width: 950,
            height: 560,
            border: "1px solid #9F78FF",
            overflowY: "scroll",
            padding: 15,
            scrollbarWidth: "none",
            WebkitScrollbar: "none",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Title level={4}>Danh sách sản phẩm</Title>
            <Button
              onClick={() => {
                setCurrent(2);
                setOpenUpdate(false);
              }}
              disabled={orderPaymentDetail?.paidMoney > 0}
            >
              Thêm sản phẩm
            </Button>
          </div>
          {loadingStep2 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "450px",
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <>
              <div
                style={{
                  height: 250,
                }}
              >
                <Table
                  columns={columns}
                  dataSource={dataForProduct}
                  pagination={false}
                  scroll={{
                    y: 200,
                  }}
                />
              </div>
              <br />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 20,
                }}
              >
                <Title level={4}>Nguyên phụ liệu sử dụng</Title>
                <Button onClick={() => setOpenConfirmMaterial(true)}>
                  Xác định vải
                </Button>
              </div>
              <div
                style={{
                  height: 250,
                }}
              >
                <MaterialComponent
                  orderPaymentDetail={orderPaymentDetail}
                  saveOrderId={saveOrderId}
                  handleDataOrderDetail={handleDataOrderDetail}
                />
                {openConfirmMaterial && (
                  <ConfirmMaterial
                    open={openConfirmMaterial}
                    onCancel={() => setOpenConfirmMaterial(false)}
                    handleDataOrderDetail={handleDataOrderDetail}
                    saveOrderId={saveOrderId}
                  />
                )}
              </div>
            </>
          )}
        </Col>
        <Col
          span={7}
          style={{
            height: 560,
            marginLeft: 25,
            border: "1px solid #9F78FF",
            overflowY: "scroll",
            scrollbarWidth: "none",
            WebkitScrollbar: "none",
            padding: 15,
          }}
        >
          {orderPaymentDetail !== null ? (
            <>
              <div>
                <Title
                  level={4}
                  style={{
                    color: "#9F78FF",
                    textDecoration: "underline",
                    textAlign: "center",
                  }}
                >
                  <FileSearchOutlined /> Thông tin đơn hàng
                </Title>
                <div style={{ marginTop: 24 }}>
                  <Title level={5}>I/ Thông tin khách hàng</Title>
                  <div>
                    <Text
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <b>Họ và tên:</b>
                      &nbsp;
                      <span
                        style={{
                          flexGrow: 1,
                          maxWidth: "200px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          textAlign: "right",
                        }}
                      >
                        {orderPaymentDetail?.cusName}
                      </span>
                    </Text>
                  </div>
                  <div style={{ marginTop: 5 }}>
                    {orderPaymentDetail?.cusPhone !== null ? (
                      <Text
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <b>Số điện thoại:</b>
                        &nbsp; {orderPaymentDetail?.cusPhone}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <b>Email:</b>
                        &nbsp; {orderPaymentDetail?.cusEmail}
                      </Text>
                    )}
                  </div>
                </div>
              </div>
              <Divider />
              <div>
                <Title level={5}>II/ Thông tin đơn hàng</Title>
                <div style={{ marginTop: 24 }}>
                  <Text
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <b>Mã đơn:</b>
                    &nbsp; {orderPaymentDetail?.id}
                  </Text>
                </div>
                <div style={{ marginTop: 5 }}>
                  <Text
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <b>Tổng sản phẩm:</b>
                    &nbsp;{" "}
                    {orderPaymentDetail?.totalProduct !== 0
                      ? orderPaymentDetail?.totalProduct
                      : 0}{" "}
                    sản phẩm
                  </Text>
                </div>
                {orderPaymentDetail && orderPaymentDetail?.plannedTime && (
                  <div style={{ marginTop: 5 }}>
                    <Text
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <b>Thời gian dự kiến:</b>
                      &nbsp;{" "}
                      <b>
                        {new Date(
                          orderPaymentDetail?.plannedTime
                        ).toLocaleDateString("vn-VI", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </b>
                    </Text>
                  </div>
                )}
              </div>
              {orderPaymentDetail?.products?.length === 0 ? (
                <div
                  style={{
                    marginTop: 90,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Title level={5}>
                    Vui lòng{" "}
                    <span
                      onClick={() => {
                        setCurrent(2);
                        setOpenUpdate(false);
                      }}
                      style={{
                        cursor: "pointer",
                        color: "#9F78FF",
                        textDecoration: "underline",
                      }}
                    >
                      thêm sản phẩm
                    </span>{" "}
                    để hiện chi tiêt
                  </Title>
                </div>
              ) : (
                <div
                  style={{
                    position: "relative",
                  }}
                >
                  <Divider />
                  <div>
                    <Title level={5}>III/ Chương trình giảm giá</Title>
                    <div style={{ marginTop: 10 }}>
                      <Select
                        disabled={orderPaymentDetail?.paidMoney > 0}
                        key={
                          discountForOrder &&
                          discountForOrder?.map((id) => id.id)
                        }
                        style={{
                          width: "100%",
                        }}
                        defaultValue={() => {
                          if (saveDiscount) {
                            return saveDiscount;
                          }
                        }}
                        placeholder="Chương trình giảm giá"
                        allowClear
                        onSelect={(value) => handleCheckDiscount(value)}
                        loading={loadingDiscount}
                        options={
                          discountForOrder &&
                          discountForOrder?.map((discount) => ({
                            value: discount.id,
                            label: discount.name,
                            desc: {
                              conditionPriceMin: discount.conditionPriceMin,
                              conditionProductMin: discount.conditionProductMin,
                            },
                          }))
                        }
                        optionRender={(option) => (
                          <Popover
                            content={
                              <>
                                <div>
                                  <CheckOutlined
                                    style={{
                                      backgroundColor: "rgb(128, 237, 153)",
                                      color: "white",
                                      borderRadius: "50%",
                                      padding: 2,
                                    }}
                                  />{" "}
                                  {option.data.desc.conditionPriceMin && (
                                    <Text>
                                      Số tiền hóa đơn tối thiểu:{" "}
                                      {formatCurrency(
                                        option.data.desc.conditionPriceMin
                                      )}
                                    </Text>
                                  )}
                                </div>
                                <div>
                                  <CheckOutlined
                                    style={{
                                      backgroundColor: "rgb(128, 237, 153)",
                                      color: "white",
                                      borderRadius: "50%",
                                      padding: 2,
                                    }}
                                  />{" "}
                                  {option.data.desc.conditionProductMin && (
                                    <Text>
                                      Sản phẩm tối thiểu:{" "}
                                      {option.data.desc.conditionProductMin} sản
                                      phẩm
                                    </Text>
                                  )}
                                </div>
                              </>
                            }
                            style={{ marginRight: 100 }}
                            overlayStyle={{ zIndex: 2000000 }}
                          >
                            <Text>
                              {option.label}
                              {console.log("option", option)}
                            </Text>
                          </Popover>
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    {orderPaymentDetail?.paidMoney === 0 && (
                      <>
                        <Divider />
                        <Title level={5}>Phương thức thanh toán</Title>
                        <Card
                          style={{
                            cursor: "pointer",
                            border: active === 1 ? "1px solid #9F78FF" : "",
                            color: active === 1 ? "white" : "",
                            textAlign: "center",
                            marginBottom: 15,
                          }}
                          bodyStyle={{ padding: 0, marginTop: 10 }}
                          onClick={() => {
                            setActive(active === 1 ? null : 1);
                            Swal.fire({
                              title: `Xác nhận thanh toán vnpay với số tiền ${formatCurrency(
                                orderPaymentDetail?.unPaidMoney
                              )} ?`,
                              showCancelButton: true,
                              confirmButtonText: "Xác nhận",
                              cancelButtonText: `Hủy`,
                              cancelButtonColor: "red",
                            }).then(async (result) => {
                              if (result.isConfirmed) {
                                await handleCreatePayCash(
                                  orderPaymentDetail?.unPaidMoney,
                                  0,
                                  "VN Pay"
                                );
                                Swal.fire({
                                  position: "top-center",
                                  icon: "warning",
                                  title: "Chờ xác nhận",
                                  showConfirmButton: false,
                                  timer: 4000,
                                });
                              } else if (result.dismiss) {
                                setActive(0);
                                Swal.fire("Hủy chọn", "", "info");
                              }
                            });
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: 10,
                              marginLeft: 20,
                            }}
                          >
                            <img
                              src={paymenVnpay}
                              style={{ width: 30, height: 30 }}
                            />
                            <Title level={5} style={{ marginLeft: 20 }}>
                              Thanh toán vnpay
                            </Title>
                          </div>
                        </Card>
                        <Card
                          style={{
                            border: active === 2 ? "1px solid #9F78FF" : "",
                            cursor: "pointer",
                            color: active === 2 ? "white" : "",
                            textAlign: "center",
                          }}
                          bodyStyle={{ padding: 0, marginTop: 10 }}
                          onClick={() => {
                            setActive(active === 2 ? null : 2);
                            Swal.fire({
                              title: `Xác nhận nhận đủ số tiền ${formatCurrency(
                                orderPaymentDetail?.unPaidMoney
                              )} ?`,
                              showCancelButton: true,
                              confirmButtonText: "Xác nhận",
                              cancelButtonText: `Hủy`,
                              cancelButtonColor: "red",
                            }).then(async (result) => {
                              if (result.isConfirmed) {
                                const check = await handleCreatePayCash(
                                  orderPaymentDetail?.unPaidMoney,
                                  0,
                                  "Offline"
                                );
                                if (check === 1) {
                                  Swal.fire({
                                    position: "top-center",
                                    icon: "success",
                                    title: "Thanh toán thành công",
                                    showConfirmButton: false,
                                    timer: 4000,
                                  });
                                }
                              } else if (result.dismiss) {
                                setActive(0);
                                Swal.fire("Hủy chọn", "", "info");
                              }
                            });
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: 10,
                              marginLeft: 20,
                            }}
                          >
                            <img
                              src={paymenCash}
                              style={{ width: 30, height: 30 }}
                            />
                            <Title level={5} style={{ marginLeft: 20 }}>
                              Thanh toán bằng tiền mặt
                            </Title>
                          </div>
                        </Card>
                        {orderPaymentDetail?.payDeposit === false && (
                          <Card
                            style={{
                              border: active === 3 ? "1px solid #9F78FF" : "",
                              cursor: "pointer",
                              color: active === 3 ? "white" : "",

                              textAlign: "center",
                              marginTop: 15,
                            }}
                            bodyStyle={{ padding: 0, marginTop: 10 }}
                            onClick={() => {
                              setActive(active === 3 ? null : 3);
                              Swal.fire({
                                title: `Chọn phương thức trả cọc`,
                                showCancelButton: true,
                                confirmButtonText: "Nhập số tiền cọc",
                                showDenyButton: true,
                                denyButtonText: "Trả 30% tiền cọc",
                                cancelButtonText: `Hủy`,
                                denyButtonColor: "#7066e0",
                                cancelButtonColor: "red",
                              }).then(async (result) => {
                                if (result.isConfirmed) {
                                  Swal.fire({
                                    title: `Nhập số tiền cọc`,
                                    html: `<input type="text" id="depositAmount" class="swal2-input" style="width: 350px;">`,
                                    showCancelButton: true,
                                    confirmButtonText: "Thanh toán trực tiếp",
                                    showDenyButton: true,
                                    denyButtonText: "Thanh toán Vn Pay",
                                    cancelButtonText: `Hủy`,
                                    denyButtonColor: "#7066e0",
                                    cancelButtonColor: "red",
                                  }).then(async (result) => {
                                    const depositAmount =
                                      document.getElementById(
                                        "depositAmount"
                                      ).value;
                                    console.log("depositAmount", depositAmount);
                                    if (result.isConfirmed) {
                                      const check = await handleCreatePayCash(
                                        depositAmount,
                                        1,
                                        "Offline"
                                      );
                                      if (check === 1) {
                                        Swal.fire({
                                          position: "top-center",
                                          icon: "success",
                                          title: "Thanh toán thành công",
                                          showConfirmButton: false,
                                          timer: 4000,
                                        });
                                      }
                                    } else if (result.isDenied) {
                                      await handleCreatePayCash(
                                        depositAmount,
                                        1,
                                        "VN Pay"
                                      );
                                      Swal.fire({
                                        position: "top-center",
                                        icon: "warning",
                                        title: "Chờ xác nhận",
                                        showConfirmButton: false,
                                        timer: 4000,
                                      });
                                    } else if (result.dismiss) {
                                      setActive(0);
                                      Swal.fire("Hủy chọn", "", "info");
                                    }
                                  });
                                } else if (result.isDenied) {
                                  Swal.fire({
                                    title: `Xác nhận trả tiền cọc ${formatCurrency(
                                      Math.round(
                                        (
                                          (30 / 100 / 1000) *
                                          orderPaymentDetail?.unPaidMoney
                                        ).toFixed(3) * 1000
                                      )
                                    )}?`,
                                    showCancelButton: true,
                                    confirmButtonText: "Thanh toán trực tiếp",
                                    showDenyButton: true,
                                    denyButtonText: "Thanh toán Vn Pay",
                                    cancelButtonText: `Hủy`,
                                    denyButtonColor: "#7066e0",
                                    cancelButtonColor: "red",
                                  }).then(async (result) => {
                                    if (result.isConfirmed) {
                                      const check = await handleCreatePayCash(
                                        Math.round(
                                          (
                                            (30 / 100 / 1000) *
                                            orderPaymentDetail?.unPaidMoney
                                          ).toFixed(3) * 1000
                                        ),
                                        1,
                                        "Offline"
                                      );
                                      if (check === 1) {
                                        Swal.fire({
                                          position: "top-center",
                                          icon: "success",
                                          title: "Thanh toán thành công",
                                          showConfirmButton: false,
                                          timer: 4000,
                                        });
                                      }
                                    } else if (result.isDenied) {
                                      await handleCreatePayCash(
                                        Math.round(
                                          (
                                            (30 / 100 / 1000) *
                                            orderPaymentDetail?.unPaidMoney
                                          ).toFixed(3) * 1000
                                        ),
                                        1,
                                        "VN Pay"
                                      );
                                      Swal.fire({
                                        position: "top-center",
                                        icon: "warning",
                                        title: "Chờ xác nhận",
                                        showConfirmButton: false,
                                        timer: 4000,
                                      });
                                    } else if (result.dismiss) {
                                      setActive(0);
                                      Swal.fire("Hủy chọn", "", "info");
                                    }
                                  });
                                } else if (result.dismiss) {
                                  setActive(0);
                                  Swal.fire("Hủy chọn", "", "info");
                                }
                              });
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                padding: 10,
                                marginLeft: 20,
                              }}
                            >
                              <img
                                src={paymenDeposit}
                                style={{ width: 30, height: 30 }}
                              />
                              <Title level={5} style={{ marginLeft: 20 }}>
                                Trả tiền cọc
                              </Title>
                            </div>
                          </Card>
                        )}
                      </>
                    )}
                  </div>
                  <Divider />
                  <div>
                    <Text
                      level={4}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      Tổng thanh toán:{" "}
                      {orderPaymentDetail?.afterDiscountPrice !== null &&
                      orderPaymentDetail?.afterDiscountPrice > 0 ? (
                        <b>
                          {formatCurrency(
                            orderPaymentDetail?.afterDiscountPrice
                          )}
                        </b>
                      ) : (
                        <b>{formatCurrency(orderPaymentDetail?.totalPrice)}</b>
                      )}
                    </Text>
                  </div>
                  <div>
                    <Text
                      level={4}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      Đã thanh toán:{" "}
                      {orderPaymentDetail?.paidMoney !== null &&
                      orderPaymentDetail?.paidMoney > 0 ? (
                        <b>{formatCurrency(orderPaymentDetail?.paidMoney)}</b>
                      ) : (
                        <b>0đ</b>
                      )}
                    </Text>
                  </div>
                  <div>
                    <Text
                      level={4}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      Còn lại:{" "}
                      {orderPaymentDetail?.unPaidMoney !== null &&
                      orderPaymentDetail?.unPaidMoney > 0 ? (
                        <b>{formatCurrency(orderPaymentDetail?.unPaidMoney)}</b>
                      ) : (
                        <b>0đ</b>
                      )}
                    </Text>
                  </div>
                  <Divider />
                  <div
                    style={{
                      position: "sticky",
                      bottom: 0,
                      left: 0,
                      backgroundColor: "white",
                      border: "1px solid #9F78FF",
                      padding: 10,
                      borderRadius: 10,
                      width: "100%",
                      zIndex: 1000,
                    }}
                  >
                    {orderPaymentDetail?.discountCode !== "" ? (
                      <>
                        {orderPaymentDetail?.discountPrice !== 0 && (
                          <div style={{ marginTop: 5 }}>
                            <Text
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              Số tiền giảm: &nbsp;
                              <b>
                                -
                                {formatCurrency(
                                  orderPaymentDetail?.discountPrice
                                )}
                              </b>
                            </Text>
                          </div>
                        )}

                        <div style={{ marginTop: 5 }}>
                          <Text
                            level={4}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            Số tiền sau khi giảm: &nbsp;
                            <b>
                              <Text delete>
                                {formatCurrency(orderPaymentDetail?.totalPrice)}
                              </Text>
                            </b>
                            &nbsp; <b style={{ fontSize: 20 }}>&rarr;</b> &nbsp;
                            <b>
                              {formatCurrency(
                                orderPaymentDetail?.afterDiscountPrice
                              )}
                            </b>
                          </Text>
                        </div>
                        <div>
                          <Text
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <b style={{ fontSize: 20 }}>Tổng cộng: &nbsp;</b>
                            &nbsp;{" "}
                            <p style={{ margin: 0, fontSize: 20 }}>
                              {formatCurrency(
                                orderPaymentDetail?.afterDiscountPrice
                              )}
                            </p>
                          </Text>
                        </div>
                      </>
                    ) : (
                      <div>
                        <Title
                          level={4}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            margin: "0px 0px 6px",
                          }}
                        >
                          <b>Tổng cộng:</b> &nbsp;
                          <b>
                            {formatCurrency(orderPaymentDetail?.totalPrice)}
                          </b>
                        </Title>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
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
          )}
        </Col>
      </Row>
    </>
  );
}

export default memo(StepTwo);
