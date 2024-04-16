import React, { useState, useEffect } from "react";
import { InputNumber } from "antd";
import {
  FileSearchOutlined,
  DeleteOutlined,
  DollarOutlined,
  EditOutlined,
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
} from "antd";
import "../index.css";
import CircularProgress from "@mui/material/CircularProgress";
import paymenVnpay from "../../../../assets/payment-method-vnpay.png";
import paymenCash from "../../../../assets/money.png";
import paymenDeposit from "../../../../assets/deposit.png";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

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
}) {
  const [changePrice, setChangePrice] = useState(false);
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [inputValue, setInputValue] = useState(null);
  const navigate = useNavigate();
  const [loadingDiscount, setLoadingDiscount] = useState(false);
  const [active, setActive] = useState(0);
  const [formMaterial] = Form.useForm();

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
          await Swal.fire({
            position: "top-center",
            icon: "success",
            title: responseData,
            showConfirmButton: false,
            timer: 1500,
            zIndex: 1000,
          });
          await handleDataOrderDetail();
          return 1;
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
          await Swal.fire({
            position: "top-center",
            icon: "success",
            title: responseData,
            showConfirmButton: false,
            timer: 1500,
            zIndex: 1000,
          });
          await handleDataOrderDetail();
          setChangePrice(false);
          return 1;
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
  const handleCheckDiscount = async (value) => {
    const urlOrderDetail = `https://e-tailorapi.azurewebsites.net/api/discount/order/${saveOrderId}/discount/${value}`;
    setLoadingDiscount(true);
    try {
      const response = await fetch(`${urlOrderDetail}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      const responseData = await response.text();
      if (response.ok && response.status === 200) {
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: responseData,
          showConfirmButton: false,
          timer: 1500,
          zIndex: 1000,
        });
        setLoadingDiscount(false);
        handleDataOrderDetail();
      } else if (response.status === 400 || response.status === 500) {
        Swal.fire({
          position: "top-center",
          icon: "error",
          title: responseData,
          showConfirmButton: false,
          timer: 1500,
          zIndex: 1000,
        });
        setLoadingDiscount(false);
      } else if (response.status === 401) {
        localStorage.removeItem("manager");
        navigate("/management/login");
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };
  const handleCreatePayCash = async (amount, payType, platform) => {
    const getFieldMaterial = formMaterial.getFieldsValue(["itemsMaterial"]);
    console.log("getFieldMaterial", getFieldMaterial);

    const urlCreateNew = `https://e-tailorapi.azurewebsites.net/api/payment/${saveOrderId}?amount=${amount}&payType=${payType}&platform=${platform}`;
    try {
      const response = await fetch(`${urlCreateNew}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok && response.status === 200) {
        console.log("platform", platform);
        if (platform === "VN Pay") {
          const responseData = await response.json();
          window.open(responseData.link);
        } else {
          console.log("NHAY");
          await handleDataOrderDetail();
        }
        setActive(0);
      } else if (response.status === 400 || response.status === 500) {
        const responseData = await response.text();
        Swal.fire({
          position: "top-center",
          icon: "error",
          title: responseData,
          showConfirmButton: false,
          timer: 3500,
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
      dataIndex: "index",
      key: "index",
      width: 60,
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tên bản mẫu",
      dataIndex: "templateName",
      key: "templateName",
    },
    {
      title: "Hình ảnh bản mẫu",
      dataIndex: "templateThumnailImage",
      key: "templateThumnailImage",
      render: (text) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image width={40} src={text} />
        </div>
      ),
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      key: "price",
      render: (_, record) =>
        changePrice ? (
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
          />
        ) : (
          <>
            <Text>{formatCurrency(record.price)}</Text>
          </>
        ),
    },
    {
      title: "Thay đổi giá tiền",
      dataIndex: "ChangePrice",
      key: "ChangePrice",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <>
          <Row justify="start">
            <Col span={4}>
              <DollarOutlined
                style={{
                  backgroundColor: "#80ed99",
                  color: "white",
                  padding: 6,
                  borderRadius: "5px",
                  fontSize: 17,
                  cursor: "pointer",
                }}
                onClick={() =>
                  orderPaymentDetail?.paidMoney > 0
                    ? ""
                    : setChangePrice((prev) => {
                        if (prev) {
                          return false;
                        } else {
                          return true;
                        }
                      })
                }
              />
            </Col>
          </Row>
        </>
      ),
    },
    {
      title: "Tùy chỉnh",
      dataIndex: "Action",
      key: "Action",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <>
          <Row justify="start">
            <Col span={4}>
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
            <Col span={4} offset={7}>
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
          </Row>
        </>
      ),
    },
  ];
  const dataForProduct = orderPaymentDetail?.products?.map((item, index) => ({
    index: index,
    name: item.name,
    templateName: item.templateName,
    templateThumnailImage: item.templateThumnailImage,
    price: item.price,
    id: item.id,
  }));
  const dataOrderMaterials = orderPaymentDetail?.orderMaterials?.map(
    (item, index) => ({
      id: item.materialId,
      index: index,
      name: item.material.name,
      image: item.material.image,
    })
  );
  return (
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
                  x: 1000,
                }}
              />
            </div>
            <div style={{ height: 250, marginTop: 50 }}>
              <Form
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                form={formMaterial}
                name="dynamic_form_complex"
                style={{ maxWidth: "100%" }}
                autoComplete="off"
                initialValues={{ items: [{}] }}
              >
                <Form.List name="itemsMaterial">
                  {(fields, { add, remove }) => (
                    <>
                      <Table
                        dataSource={dataOrderMaterials}
                        pagination={false}
                        scroll={{ y: 250 }}
                        rowKey={(record) => record.id}
                        columns={[
                          {
                            title: "STT",
                            dataIndex: "index",
                            key: "index",
                            width: 60,
                            render: (text) => <a>{text}</a>,
                          },
                          {
                            title: "Nguyên phụ liệu",
                            dataIndex: "name",
                            key: "name",
                          },
                          {
                            title: "Hình ảnh",
                            dataIndex: "image",
                            key: "image",
                            render: (text) => (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Image width={40} src={text} />
                              </div>
                            ),
                          },
                          {
                            title: "Xác nhận vải",
                            dataIndex: "materialConfirm",
                            key: "materialConfirm",
                            render: (text, record, index) => (
                              <>
                                <Form.Item
                                  name={[index, "materialConfirm"]}
                                  key={`${record.id}-materialConfirm`}
                                  noStyle
                                >
                                  <Radio.Group
                                    disabled={orderPaymentDetail?.paidMoney > 0}
                                  >
                                    <Radio value={true}>Vải khách</Radio>
                                    <Radio value={false}>Vải cửa hàng</Radio>
                                  </Radio.Group>
                                </Form.Item>
                                <Form.Item
                                  name={[index, "materialId"]}
                                  initialValue={record.id}
                                  noStyle
                                >
                                  <Input type="hidden" />
                                </Form.Item>
                              </>
                            ),
                          },
                          {
                            title: "Số met vải yêu cầu",
                            dataIndex: "value",
                            key: "value",
                            render: (text, record, index) => (
                              <>
                                {" "}
                                <Form.Item
                                  name={[index, "value"]}
                                  key={`${record.id}-value`}
                                  noStyle
                                >
                                  <InputNumber
                                    disabled={orderPaymentDetail?.paidMoney > 0}
                                    formatter={(value) =>
                                      `${value}m`.replace(
                                        /\B(?=(\d{3})+(?!\d))/g,
                                        ","
                                      )
                                    }
                                    parser={(value) =>
                                      value.replace(/m\s?|(,*)/g, "")
                                    }
                                    style={{ width: "100%" }}
                                    step={0.01}
                                  />
                                </Form.Item>
                                <Form.Item
                                  // Trường ẩn để lưu trữ materialId
                                  name={[index, "materialId"]}
                                  initialValue={record.id}
                                  noStyle
                                >
                                  <Input type="hidden" />
                                </Form.Item>
                              </>
                            ),
                          },
                        ]}
                      />
                      <Form.Item
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          disabled={orderPaymentDetail?.paidMoney > 0}
                          type="dashed"
                          onClick={() => onConfirmMaterial()}
                          block
                          style={{ width: 200, marginTop: 10 }}
                        >
                          Lưu thay đổi
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Form>
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
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <b>Họ và tên:</b>
                    &nbsp; {orderPaymentDetail?.customer?.fullname}
                  </Text>
                </div>
                <div style={{ marginTop: 5 }}>
                  {orderPaymentDetail?.customer?.phone !== null ? (
                    <Text
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <b>Số điện thoại:</b>
                      &nbsp; {orderPaymentDetail?.customer?.phone}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <b>Email:</b>
                      &nbsp; {orderPaymentDetail?.customer?.email}
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
              <div style={{ position: "relative" }}>
                <Divider />
                <div>
                  <Title level={5}>III/ Chương trình giảm giá</Title>
                  <div style={{ marginTop: 10 }}>
                    <Search
                      placeholder="Chương trình giảm giá"
                      allowClear
                      enterButton="Tìm kiếm"
                      onSearch={(value) => handleCheckDiscount(value)}
                      loading={loadingDiscount}
                    />
                  </div>
                </div>
                <div>
                  {orderPaymentDetail?.unPaidMoney !== 0 && (
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
                                timer: 1500,
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
                          }).then(async (result) => {
                            if (result.isConfirmed) {
                              await handleCreatePayCash(
                                orderPaymentDetail?.unPaidMoney,
                                0,
                                "Offline"
                              );
                              Swal.fire("Thanh toán thành công", "", "success");
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
                              title: `Xác nhận trả tiền cọc ${formatCurrency(
                                orderPaymentDetail?.unPaidMoney
                              )} ?`,
                              showCancelButton: true,
                              confirmButtonText: "Xác nhận",
                              cancelButtonText: `Hủy`,
                            }).then(async (result) => {
                              if (result.isConfirmed) {
                                await handleCreatePayCash(
                                  orderPaymentDetail?.unPaidMoney,
                                  1,
                                  "Offline"
                                );
                                Swal.fire(
                                  "Thanh toán trả tiền cọc thành công",
                                  "",
                                  "success"
                                );
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
                        {formatCurrency(orderPaymentDetail?.afterDiscountPrice)}
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
                <div style={{ height: "100%" }}>
                  {orderPaymentDetail?.discountCode !== "" ? (
                    <>
                      <div style={{ marginTop: 5 }}>
                        <Text>
                          Mã áp dụng: &nbsp;{" "}
                          <b>{orderPaymentDetail?.discountCode}</b>
                        </Text>
                      </div>
                      <div style={{ marginTop: 5 }}>
                        <Text>
                          Số tiền giảm: &nbsp;
                          <b>
                            -{formatCurrency(orderPaymentDetail?.discountPrice)}
                          </b>
                        </Text>
                      </div>
                      <div style={{ marginTop: 5 }}>
                        <Text level={4}>
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
                          }}
                        >
                          <b>Tổng cộng: &nbsp;</b>
                          &nbsp;{" "}
                          <p>
                            {formatCurrency(orderPaymentDetail?.totalPrice)}
                          </p>
                        </Text>
                      </div>
                    </>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: 368,
                        height: 50,
                        position: "fixed",
                        bottom: 119,
                        right: 50,
                        zIndex: 1000,
                        backgroundColor: "white",
                        border: "1px solid #9F78FF",
                        borderLeft: "none",
                        borderRight: "none",
                      }}
                    >
                      {" "}
                      <Title
                        level={4}
                        style={{
                          width: 250,
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        Tổng cộng: &nbsp;
                        <b>{formatCurrency(orderPaymentDetail?.totalPrice)}</b>
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
  );
}

export default StepTwo;
