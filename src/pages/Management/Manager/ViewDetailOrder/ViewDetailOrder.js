import React, { useEffect, useState } from "react";

import {
  EyeOutlined,
  ArrowLeftOutlined,
  LoadingOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Typography, Table } from "antd";

import {
  Avatar,
  Col,
  Row,
  Modal,
  Divider,
  Tag,
  Image,
  Button,
  Badge,
  Flex,
  Card,
  Popover,
  Collapse,
  message,
  Segmented,
} from "antd";
import CircularProgress from "@mui/material/CircularProgress";
import { ChatRealTimeManager } from "../ChatRealTimeManager.js";
import toast from "react-hot-toast";
import { VnPay } from "../../../../components/RealTime/index.js";

import Swal from "sweetalert2";
import ManageChat from "../ManageChat";
import Refund from "../RefundOrder/Refund.js";
import { ConfirmCancelOrder } from "../ConfirmCancelOrder/ConfirmCancelOrder.js";
import { OrderMaterial } from "../OrderMaterial/OrderMaterial.js";

const { Title, Text, Paragraph } = Typography;

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

export const ViewDetailOrder = ({
  isModalOpen,
  handleCancel,
  handleApproveOrder,
  saveIdOrder,
  setSaveIdOrder,
  checkStatus,
  handleCancelOrder,
  cancelOrderLoading,
  approveOrderLoading,
  handleDataOrderContent,
  openRefund,
  setOpenRefund,
}) => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const getUrl = "https://e-tailorapi.azurewebsites.net/api/order";
  const [loading, setLoading] = useState(false);
  const [dataOrderDetail, setDataOrderDetail] = useState(null);
  const [viewDetailProduct, setViewDetailProduct] = useState(false);
  const [detailProductData, setDetailProductData] = useState(null);
  const [chatWithCustomer, setChatWithCustomer] = useState(false);
  const [badgeChatCount, setBadgeChatCount] = useState(0);
  const [loadingDetailProduct, setLoadingDetailProduct] = useState(false);
  const [loadingDefect, setLoadingDefect] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Sản phẩm");
  const vnpayNotification = VnPay();
  const { resetMessage, message: messageNotification } = vnpayNotification;

  const chatNotification = ChatRealTimeManager();
  const { messageReturn, resetMessageReturn } = chatNotification;
  console.log("detailProductData", detailProductData);
  useEffect(() => {
    if (messageReturn) {
      fetchChat();
      resetMessageReturn();
      setBadgeChatCount((prev) => prev + 1);
    }
  }, [messageReturn, resetMessageReturn]);
  useEffect(() => {
    if (
      messageNotification !== null &&
      messageNotification !== undefined &&
      messageNotification !== ""
    ) {
      if (messageNotification === "False") {
        Swal.fire({
          position: "top-center",
          icon: "error",
          title: "Thanh toán VnPay thất bại!",
          showConfirmButton: false,
        });
        resetMessage();
      } else if (messageNotification === "True") {
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Thanh toán VnPay thành công!",
          showConfirmButton: false,
        });
        handleDataOrderContent();
        handleDataOrder();
      }
    }
  }, [messageNotification]);
  const [indexDetail, setIndexDetail] = useState(null);
  const handleViewProductDetail = async (id, index) => {
    setLoadingDetailProduct(true);
    setIndexDetail(index);
    const detailUrl = `https://e-tailorapi.azurewebsites.net/api/task/${id}`;
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
        setDetailProductData(responseData);
      } else if (response.status === 400 || response.status === 500) {
        const responseData = await response.text();
        message.error(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      setLoadingDetailProduct(false);
      setIndexDetail(null);
    }
  };

  const [getAllChat, setGetAllChat] = useState([]);
  const fetchChat = async () => {
    const GET_CHAT_API = `https://e-tailorapi.azurewebsites.net/api/chat/order/${saveIdOrder}`;
    try {
      const response = await fetch(GET_CHAT_API, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      const chatData = await response.json();
      setGetAllChat(chatData?.chatLists);
    } catch (error) {
      console.error("Error fetching order details:", error);
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
    if (saveIdOrder) {
      handleDataOrder();
      fetchChat();
    }
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
            return <Tag color="orange">Sản phẩm lỗi</Tag>;
          case 5:
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
      render: (_, record, index) => <span>{index + 1}</span>,
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
      title: "Tùy chỉnh",
      key: "action",
      render: (_, record, index) => (
        <>
          <Row justify="start">
            <Col span={4}>
              {loadingDetailProduct && index === indexDetail ? (
                <LoadingOutlined style={{ fontSize: 24 }} />
              ) : (
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
                  onClick={() => {
                    handleViewProductDetail(record.id, index);
                  }}
                />
              )}
            </Col>
          </Row>
        </>
      ),
    },
  ];

  const columns2 = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 60,
      render: (_, record, index) => <span>{index + 1}</span>,
    },
    {
      title: "Tên vải",
      dataIndex: "name",
      key: "name",
      render: (_, record) => <Text>{record?.material?.name}</Text>,
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image width={35} src={record?.material?.image} height={35} />
        </div>
      ),
    },
    {
      title: "Số mét vải nhận",
      dataIndex: "value",
      key: "value",
      render: (_, record) => <Text>{record.value} mét</Text>,
    },
    {
      title: "Vải đã sử dụng",
      dataIndex: "valueUsed",
      key: "valueUsed",
      render: (_, record) => <Text>{record.valueUsed} mét</Text>,
    },
    {
      title: "Xác nhận vải",
      dataIndex: "isCusMaterial",
      key: "isCusMaterial",
      render: (_, record) => (
        <Text>{record.isCusMaterial ? "Vải khách hàng" : "Vải cửa hàng"}</Text>
      ),
    },
  ];

  const [paymentLoading, setPaymentLoading] = useState(false);

  const handleCreatePayCash = async (amount, payType, platform) => {
    setPaymentLoading(true);
    const urlCreateNew = `https://e-tailorapi.azurewebsites.net/api/payment/${saveIdOrder}?amount=${amount}&payType=${payType}&platform=${platform}`;
    try {
      const response = await fetch(`${urlCreateNew}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok && response.status === 200) {
        if (platform === "VN Pay") {
          const responseData = await response.json();
          window.open(responseData.link);
        } else {
          await handleDataOrder();
          await handleDataOrderContent();
          return 1;
        }
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

  //-------------------------------------------------------------------------------------------------------------------------------
  const [openConfirmCancel, setOpenConfirmCancel] = useState(false);

  const handleConfirmCancel = (paidMoney) => {
    if (paidMoney > 0) {
      setOpenConfirmCancel(true);
    }
  };

  const handleCheckStatus = (status) => {
    switch (status) {
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
  };

  const [openOrderMaterial, setOpenOrderMaterial] = useState(false);
  const [modalOpenStage, setModalOpenStage] = useState(null);
  const handleOpenOrderMaterial = (value) => {
    setOpenOrderMaterial(true);
    setModalOpenStage(value);
  };

  const items =
    detailProductData &&
    detailProductData?.productStages?.map((productStage) => ({
      key: productStage.id,
      label: `Bước ${productStage.stageNum}: ` + productStage.stageName,
      children: (
        <>
          <div>
            <Title level={4}>Tiến độ hoàn thành:</Title>
            <div
              style={{
                width: "100%",
                border: "1px solid #9F78FF",
                padding: 15,
              }}
            >
              <Title level={5}>Thông tin:</Title>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text>
                    <b>Thời hạn:</b>{" "}
                    {productStage.deadline ? productStage.deadline : "Chưa có!"}
                  </Text>
                </Col>
                <Col span={12}>
                  <Text>
                    <b>Ngày bắt đầu:</b>{" "}
                    {productStage.startTime
                      ? new Date(productStage.startTime).toLocaleString()
                      : "Chưa có!"}
                  </Text>
                </Col>
                <Col span={12}>
                  <Text>
                    <b>Ngày kết thúc:</b>{" "}
                    {productStage.finishTime
                      ? new Date(productStage.finishTime).toLocaleString()
                      : "Chưa có!"}
                  </Text>
                </Col>
                <Col span={12}>
                  <Text>
                    <b>Trạng thái:</b>{" "}
                    {productStage.status
                      ? handleCheckStatus(productStage.status)
                      : "Chưa có!"}
                  </Text>
                </Col>
              </Row>
              <br />
              <Title level={5}>Hình ảnh hoàn thiện:</Title>
              <Row gutter={[16, 16]}>
                {productStage.evidenceImage &&
                  JSON.parse(productStage.evidenceImage)
                    .map((evidence) => JSON.parse(evidence))
                    .map((item) => {
                      return (
                        <Col span={12}>
                          <Image
                            width={150}
                            src={item.ObjectUrl}
                            height={150}
                            style={{ objectFit: "cover" }}
                          />
                        </Col>
                      );
                    })}
              </Row>
            </div>
          </div>
          <div style={{ marginTop: 15 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Title level={4}>
                Vải được xử lý trong quy trình {`${productStage.stageNum}`}:
              </Title>
              {productStage.productStageMaterials.length > 0 && (
                <Button
                  onClick={() => handleOpenOrderMaterial(productStage.stageNum)}
                >
                  Cập nhật
                </Button>
              )}
            </div>

            {!productStage.productStageMaterials ? (
              <Text>Quy trình này không yêu cầu sử dụng vải.</Text>
            ) : (
              <div>
                {productStage.productStageMaterials.length === 0 ? (
                  <div style={{ textAlign: "center" }}>
                    <Text>
                      Chưa có vải được sử dụng trong bước này.{" "}
                      <Text
                        underline
                        style={{
                          color: "#9F78FF",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                        onClick={() =>
                          handleOpenOrderMaterial(productStage.stageNum)
                        }
                      >
                        Hãy thêm vào!
                      </Text>
                    </Text>
                  </div>
                ) : (
                  <div>
                    <Row gutter={[16, 24]} style={{ width: "100%" }}>
                      {productStage?.productStageMaterials?.map((material) => {
                        return (
                          <>
                            <Col span={12}>
                              <Card
                                hoverable
                                style={{ width: 350 }}
                                styles={{
                                  body: {
                                    height: 200,
                                    padding: 0,
                                    overflow: "auto",
                                  },
                                }}
                              >
                                <Flex style={{ height: "100%" }}>
                                  <img
                                    alt="avatar"
                                    src={
                                      material?.material?.image &&
                                      material?.material?.image
                                    }
                                    style={{
                                      display: "block",
                                      width: 100,
                                      height: 100,
                                    }}
                                  />
                                  <Flex
                                    direction="column"
                                    align="flex-start"
                                    justify="center"
                                    style={{
                                      padding: "0 32px",
                                      height: "100%",
                                      overflowY: "scroll",
                                      scrollbarWidth: "none",
                                      WebkitScrollbar: "none",
                                    }}
                                  >
                                    <div>
                                      <Typography.Title
                                        level={5}
                                        style={{ margin: 0 }}
                                      >
                                        {material?.material?.name
                                          ? material?.material?.name
                                          : "Lỗi"}
                                      </Typography.Title>
                                      <div style={{ marginTop: 10 }}>
                                        <Text>
                                          Số mét vải: {material?.quantity} mét
                                        </Text>
                                      </div>
                                    </div>
                                  </Flex>
                                </Flex>
                              </Card>
                            </Col>
                          </>
                        );
                      })}
                    </Row>
                  </div>
                )}
              </div>
            )}
            {modalOpenStage === productStage.stageNum && (
              <OrderMaterial
                open={openOrderMaterial}
                saveIdOrder={saveIdOrder}
                onCancel={() => setOpenOrderMaterial(false)}
                stageId={productStage.id}
                taskId={productStage.productId}
                handleViewProductDetail={handleViewProductDetail}
                handleDataOrder={handleDataOrder}
                materialId={
                  detailProductData && detailProductData.fabricMaterialId
                }
                detailProductData={detailProductData}
              />
            )}
          </div>
          <br />
          <div>
            <Title level={4}>
              Bộ phận xử lý trong quy trình {`${productStage.stageNum}:`}
            </Title>
            <Row gutter={[16, 24]} style={{ width: "100%" }}>
              {productStage?.productComponents?.map((component) => {
                return (
                  <>
                    <Col span={12}>
                      <Card
                        hoverable
                        style={{ width: 350 }}
                        styles={{
                          body: {
                            height: 200,
                            padding: 0,
                            overflow: "auto",
                          },
                        }}
                      >
                        <Flex style={{ height: "100%" }}>
                          <img
                            alt="avatar"
                            src={
                              component?.component?.image
                                ? component?.component?.image
                                : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                            }
                            style={{
                              display: "block",
                              width: 100,
                              height: 100,
                            }}
                          />
                          <Flex
                            direction="column"
                            align="flex-start"
                            justify="center"
                            style={{
                              padding: "0 32px",
                              height: "100%",
                              overflowY: "scroll",
                              scrollbarWidth: "none",
                              WebkitScrollbar: "none",
                            }}
                          >
                            <div>
                              <Typography.Title level={4} style={{ margin: 0 }}>
                                {component?.component?.name
                                  ? component?.component?.name
                                  : "Lỗi"}
                              </Typography.Title>
                              {(component?.note || component?.noteImage) && (
                                <>
                                  <br />
                                  <Popover
                                    trigger={"click"}
                                    title={"Lời dặn của khách"}
                                    content={
                                      <>
                                        <Title level={5}>Hình ảnh:</Title>
                                        <div
                                          style={{
                                            width: "400px",
                                            height: "auto",
                                            padding: "10px 0px",
                                            border: "1px solid #9F78FF",
                                            borderRadius: 5,
                                            textAlign: "center",
                                          }}
                                        >
                                          <Row
                                            gutter={[16, 24]}
                                            justify={"center"}
                                          >
                                            {component?.noteImage ? (
                                              JSON.parse(
                                                component?.noteImage
                                              ).map((image) => (
                                                <Col
                                                  span={10}
                                                  style={{
                                                    margin: "0px 10px",
                                                  }}
                                                >
                                                  <Image
                                                    width={100}
                                                    src={image}
                                                    style={{
                                                      objectFit: "cover",
                                                    }}
                                                  />
                                                </Col>
                                              ))
                                            ) : (
                                              <div
                                                style={{
                                                  textAlign: "center",
                                                }}
                                              >
                                                <Text>Không có hình ảnh!</Text>
                                              </div>
                                            )}
                                          </Row>
                                        </div>

                                        <br></br>
                                        <Title level={5}>Ghi chú:</Title>
                                        <div
                                          style={{
                                            width: "400px",
                                            height: "auto",
                                            padding: "10px 0px",
                                            border: "1px solid #9F78FF",
                                            borderRadius: 5,
                                          }}
                                        >
                                          {" "}
                                          {component?.note ? (
                                            <Paragraph
                                              style={{
                                                margin: "0px",
                                                width: "100%",
                                                padding: "0px 10px",
                                              }}
                                            >
                                              {component?.note}
                                            </Paragraph>
                                          ) : (
                                            <Paragraph
                                              style={{
                                                width: "100%",
                                                textAlign: "center",
                                                margin: "0px",
                                              }}
                                            >
                                              Không có ghi chú!
                                            </Paragraph>
                                          )}
                                        </div>
                                      </>
                                    }
                                  >
                                    <Button>Lời nhắn từ khách</Button>
                                  </Popover>
                                </>
                              )}
                            </div>
                          </Flex>
                        </Flex>
                      </Card>
                    </Col>
                  </>
                );
              })}
            </Row>
          </div>
        </>
      ),
    }));

  const handleDefectsOrder = async (id) => {
    setLoadingDefect(true);
    const url = `https://e-tailorapi.azurewebsites.net/api/product/${saveIdOrder}/${id}/defects`;
    try {
      const response = await fetch(`${url}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      const responseData = await response.text();
      if (response.ok && response.status === 200) {
        message.success(responseData);
        await handleViewProductDetail(id);
        await handleDataOrder();
        await handleDataOrderContent();
      } else if (response.status === 400 || response.status === 500) {
        message.error(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      setLoadingDefect(false);
    }
  };
  const [checking, setChecking] = useState(false);
  const handleCheckOrder = async (id) => {
    setChecking(true);
    const url = `https://e-tailorapi.azurewebsites.net/api/order/finish-check/${id}`;
    try {
      const response = await fetch(`${url}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      const responseData = await response.text();
      if (response.ok && response.status === 200) {
        message.success(responseData);
        await handleDataOrder();
        await handleDataOrderContent();
      } else if (response.status === 400 || response.status === 500) {
        message.error(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      setChecking(false);
    }
  };
  const [done, setDone] = useState(false);
  const handleDoneOrder = async (id) => {
    setDone(true);
    const url = `https://e-tailorapi.azurewebsites.net/api/order/done/${id}`;
    try {
      const response = await fetch(`${url}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      const responseData = await response.text();
      if (response.ok && response.status === 200) {
        message.success(responseData);
        await handleDataOrder();
        await handleDataOrderContent();
      } else if (response.status === 400 || response.status === 500) {
        message.error(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      setDone(false);
    }
  };

  return (
    <>
      <div>
        {openConfirmCancel && saveIdOrder && dataOrderDetail && (
          <ConfirmCancelOrder
            open={openConfirmCancel}
            onCancel={() => setOpenConfirmCancel(false)}
            dataOrderDetail={dataOrderDetail}
            formatCurrency={formatCurrency}
            handleCancelOrder={handleCancelOrder}
            saveIdOrder={saveIdOrder}
            handleDataOrder={handleDataOrderContent}
            handleCancel={handleCancel}
          />
        )}
        {openRefund && saveIdOrder && dataOrderDetail && (
          <Refund
            open={openRefund}
            saveIdOrder={saveIdOrder}
            onCancel={() => setOpenRefund(false)}
            dataOrderDetail={dataOrderDetail}
            formatCurrency={formatCurrency}
          />
        )}
        <Modal
          title={
            <>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Title level={5} style={{ margin: 0 }}>
                  Chi tiết đơn hàng
                </Title>

                <Button
                  onClick={() => handleDataOrder()}
                  style={{
                    width: 50,
                    marginLeft: 20,
                    height: 25,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ReloadOutlined />
                </Button>
              </div>
            </>
          }
          open={isModalOpen}
          onOk={handleApproveOrder}
          onCancel={() => {
            handleCancel();
            setChatWithCustomer(false);
            setSaveIdOrder(null);
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
              {/* {dataOrderDetail &&
                dataOrderDetail.status >= 1 &&
                dataOrderDetail.status <= 4 && (
                  <Button
                    key="cancel"
                    type="primary"
                    onClick={() => {
                      handleCancelOrder(saveIdOrder);
                    }}
                    danger
                    style={{ marginLeft: 15 }}
                    loading={cancelOrderLoading}
                  >
                    Hủy đơn hàng
                  </Button>
                )} */}

              {dataOrderDetail && dataOrderDetail.status === 5 && (
                <button
                  onClick={() => {
                    handleCheckOrder(saveIdOrder);
                  }}
                  style={{
                    marginLeft: 15,
                    color: "white",
                    fontWeight: "bold",
                    width: "auto",
                    height: 32,
                    cursor: "pointer",
                    borderRadius: "5px",
                    backgroundColor: "#edb300",
                    border: "1px solid #edb300",
                    transition:
                      "background-color 0.3s, border-color 0.3s, color 0.3s",
                  }}
                >
                  {checking && <LoadingOutlined style={{ color: "white" }} />}
                  &nbsp; Kiểm tra đơn hàng
                </button>
              )}
              {dataOrderDetail && dataOrderDetail.status === 6 && (
                <button
                  onClick={() => {
                    handleDoneOrder(saveIdOrder);
                  }}
                  style={{
                    marginLeft: 15,
                    width: "auto",
                    fontWeight: "bold",
                    height: 32,
                    cursor: "pointer",
                    color: "white",
                    backgroundColor: "#1F883D",
                    borderRadius: "5px",
                    border: "1px solid #1F883D",
                    "&:hover": {
                      backgroundColor: "#3eb489",
                      borderColor: "1px solid #3eb489",
                      color: "white",
                    },
                  }}
                >
                  {done && <LoadingOutlined style={{ color: "white" }} />}
                  &nbsp; Hoàn thành
                </button>
              )}

              {dataOrderDetail &&
                dataOrderDetail.status >= 1 &&
                dataOrderDetail.status <= 4 && (
                  <Button
                    key="cancel"
                    type="primary"
                    onClick={() => {
                      handleConfirmCancel(dataOrderDetail?.paidMoney);
                    }}
                    style={{
                      marginLeft: 15,
                    }}
                    loading={cancelOrderLoading}
                  >
                    Hoàn trả đơn
                  </Button>
                )}
              {dataOrderDetail && dataOrderDetail.status === 1 && (
                <>
                  <Button
                    key="approve"
                    type="primary"
                    onClick={() => handleApproveOrder(saveIdOrder)}
                    style={{ marginLeft: 15 }}
                    loading={approveOrderLoading}
                  >
                    Xác nhận đơn hàng
                  </Button>
                </>
              )}
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
                    height: 631,
                    padding: chatWithCustomer ? "" : "0px 10px",
                    borderRadius: "5px",
                    position: "relative",
                  }}
                >
                  {viewDetailProduct &&
                  detailProductData &&
                  chatWithCustomer === false ? (
                    <div
                      style={{
                        height: "100%",
                        overflowY: "scroll",
                        scrollbarWidth: "none",
                        WebkitScrollbar: "none",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          marginTop: 20,
                        }}
                      >
                        <Button
                          type="primary"
                          icon={<ArrowLeftOutlined />}
                          onClick={() => {
                            setViewDetailProduct(false);
                            setDetailProductData(null);
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
                                src={
                                  detailProductData?.productTemplate
                                    ?.thumbnailImage
                                }
                              />
                            </div>
                          </Col>
                          <Col span={12}>
                            <Title level={4}>{detailProductData?.name}</Title>
                            <div>
                              <Title level={5}>Bản mẫu:</Title>
                              <Text>
                                {detailProductData?.productTemplate?.name}
                              </Text>
                            </div>
                            <div style={{ marginTop: 10 }}>
                              <Title level={5}>Nguyên phụ liệu sử dụng:</Title>
                              <Text>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Image
                                    width={50}
                                    src={
                                      detailProductData?.fabricMaterial?.image
                                    }
                                    style={{ height: "50px" }}
                                  />
                                  <Text style={{ marginLeft: 10 }}>
                                    {detailProductData?.fabricMaterial?.name}
                                  </Text>
                                </div>
                              </Text>
                            </div>
                            <div
                              style={{
                                marginTop: 10,
                              }}
                            >
                              <Title level={4}>Ghi chú:</Title>
                              <div
                                style={{
                                  height: "100px",
                                  overflowY: "scroll",
                                  scrollbarWidth: "none",
                                }}
                              >
                                <Text>
                                  {viewDetailProduct?.note
                                    ? viewDetailProduct?.note
                                    : "Chưa có ghi chú cho sản phẩm này."}
                                </Text>
                              </div>
                            </div>
                          </Col>

                          <div style={{ marginTop: 20, width: "100%" }}>
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
                                width: "100%",
                              }}
                            >
                              <Row gutter={[16, 24]} style={{ width: "100%" }}>
                                {detailProductData?.productBodySizes?.map(
                                  (bodyAttribute) => {
                                    return (
                                      <Col span={8}>
                                        <Text>
                                          <b>
                                            {bodyAttribute?.bodySize?.name} :{" "}
                                          </b>
                                          {bodyAttribute?.value} cm
                                        </Text>
                                      </Col>
                                    );
                                  }
                                )}
                              </Row>
                            </div>
                          </div>
                          {detailProductData &&
                          detailProductData?.productStages?.length > 0 ? (
                            <div
                              style={{
                                marginTop: 20,
                                marginBottom: 20,
                                width: "100%",
                              }}
                            >
                              <Title level={3} style={{ marginLeft: 40 }}>
                                Các bước hoàn thiện sản phẩm:
                              </Title>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  borderRadius: 10,
                                  padding: 15,
                                  width: "100%",
                                }}
                              >
                                <Collapse
                                  items={items}
                                  style={{ width: "100%" }}
                                />
                              </div>
                            </div>
                          ) : (
                            <>
                              <Title
                                level={3}
                                style={{ marginLeft: 40, marginTop: 15 }}
                              >
                                Kiểu sản phẩm:
                              </Title>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  borderRadius: 10,
                                  padding: 15,
                                  width: "100%",
                                }}
                              >
                                <Row
                                  gutter={[16, 24]}
                                  style={{ width: "100%" }}
                                >
                                  {detailProductData &&
                                    detailProductData?.componentTypeOrders?.map(
                                      (componentTypeOrder) => {
                                        const selected =
                                          componentTypeOrder?.components?.find(
                                            (item) =>
                                              item.id ===
                                              componentTypeOrder?.selected_Component_Id
                                          );
                                        return (
                                          <>
                                            <Col span={12}>
                                              <Card
                                                hoverable
                                                style={{ width: 350 }}
                                                styles={{
                                                  body: {
                                                    height: 200,
                                                    padding: 0,
                                                    overflow: "auto",
                                                  },
                                                }}
                                              >
                                                <Flex
                                                  style={{ height: "100%" }}
                                                >
                                                  <img
                                                    alt="avatar"
                                                    src={
                                                      selected?.image &&
                                                      selected?.image
                                                    }
                                                    style={{
                                                      display: "block",
                                                      width: 100,
                                                      height: 100,
                                                    }}
                                                  />
                                                  <Flex
                                                    direction="column"
                                                    align="flex-start"
                                                    justify="center"
                                                    style={{
                                                      padding: "0 32px",
                                                      height: "100%",
                                                      overflowY: "scroll",
                                                      scrollbarWidth: "none",
                                                      WebkitScrollbar: "none",
                                                    }}
                                                  >
                                                    <div>
                                                      <Typography.Title
                                                        level={4}
                                                        style={{ margin: 0 }}
                                                      >
                                                        {selected?.name
                                                          ? selected?.name
                                                          : "Lỗi"}
                                                      </Typography.Title>
                                                      {componentTypeOrder.noteObject && (
                                                        <>
                                                          <br />
                                                          <Popover
                                                            trigger={"click"}
                                                            title={
                                                              "Lời dặn của khách"
                                                            }
                                                            content={
                                                              <>
                                                                <Title
                                                                  level={5}
                                                                >
                                                                  Hình ảnh:
                                                                </Title>
                                                                <div
                                                                  style={{
                                                                    width:
                                                                      "400px",
                                                                    height:
                                                                      "auto",
                                                                    padding:
                                                                      "10px 0px",
                                                                    border:
                                                                      "1px solid #9F78FF",
                                                                    borderRadius: 5,
                                                                    textAlign:
                                                                      "center",
                                                                  }}
                                                                >
                                                                  <Row
                                                                    gutter={[
                                                                      16, 24,
                                                                    ]}
                                                                    justify={
                                                                      "center"
                                                                    }
                                                                  >
                                                                    {componentTypeOrder
                                                                      .noteObject
                                                                      .noteImage ? (
                                                                      JSON.parse(
                                                                        componentTypeOrder
                                                                          .noteObject
                                                                          .noteImage
                                                                      ).map(
                                                                        (
                                                                          image
                                                                        ) => (
                                                                          <Col
                                                                            span={
                                                                              10
                                                                            }
                                                                            style={{
                                                                              margin:
                                                                                "0px 10px",
                                                                            }}
                                                                          >
                                                                            <Image
                                                                              width={
                                                                                100
                                                                              }
                                                                              src={
                                                                                image
                                                                              }
                                                                              style={{
                                                                                objectFit:
                                                                                  "cover",
                                                                              }}
                                                                            />
                                                                          </Col>
                                                                        )
                                                                      )
                                                                    ) : (
                                                                      <div
                                                                        style={{
                                                                          textAlign:
                                                                            "center",
                                                                        }}
                                                                      >
                                                                        <Text>
                                                                          Không
                                                                          có
                                                                          hình
                                                                          ảnh!
                                                                        </Text>
                                                                      </div>
                                                                    )}
                                                                  </Row>
                                                                </div>

                                                                <br></br>
                                                                <Title
                                                                  level={5}
                                                                >
                                                                  Ghi chú:
                                                                </Title>
                                                                <div
                                                                  style={{
                                                                    width:
                                                                      "400px",
                                                                    height:
                                                                      "auto",
                                                                    padding:
                                                                      "10px 0px",
                                                                    border:
                                                                      "1px solid #9F78FF",
                                                                    borderRadius: 5,
                                                                  }}
                                                                >
                                                                  {" "}
                                                                  {componentTypeOrder
                                                                    .noteObject
                                                                    .note ? (
                                                                    <Paragraph
                                                                      style={{
                                                                        margin:
                                                                          "0px",
                                                                        width:
                                                                          "100%",
                                                                        padding:
                                                                          "0px 10px",
                                                                      }}
                                                                    >
                                                                      {
                                                                        componentTypeOrder
                                                                          .noteObject
                                                                          .note
                                                                      }
                                                                    </Paragraph>
                                                                  ) : (
                                                                    <Paragraph
                                                                      style={{
                                                                        width:
                                                                          "100%",
                                                                        textAlign:
                                                                          "center",
                                                                        margin:
                                                                          "0px",
                                                                      }}
                                                                    >
                                                                      Không có
                                                                      ghi chú!
                                                                    </Paragraph>
                                                                  )}
                                                                </div>
                                                              </>
                                                            }
                                                          >
                                                            <Button>
                                                              Lời nhắn từ khách
                                                            </Button>
                                                          </Popover>
                                                        </>
                                                      )}
                                                    </div>
                                                  </Flex>
                                                </Flex>
                                              </Card>
                                            </Col>
                                          </>
                                        );
                                      }
                                    )}
                                </Row>
                              </div>
                            </>
                          )}
                        </Row>
                      </div>
                      {detailProductData &&
                        dataOrderDetail &&
                        detailProductData.status === 5 &&
                        dataOrderDetail.status !== 8 && (
                          <div
                            style={{
                              marginBottom: 15,
                              width: "100%",
                              textAlign: "center",
                            }}
                          >
                            <button
                              style={{
                                width: 250,
                                height: 30,
                                color: "white",
                                backgroundColor: "rgba(252, 96, 118, 0.8)",
                                border: "1px solid #e75516",
                                borderRadius: 10,
                                cursor: "pointer",
                                fontSize: "bold",
                              }}
                              onClick={() =>
                                handleDefectsOrder(detailProductData.id)
                              }
                            >
                              {loadingDefect ? <LoadingOutlined /> : ""} Sản
                              phẩm chưa hoàn thiện
                            </button>
                          </div>
                        )}
                    </div>
                  ) : chatWithCustomer ? (
                    <>
                      <ManageChat
                        orderId={saveIdOrder}
                        chatDetail={getAllChat}
                        fetchChat={fetchChat}
                        dataOrderDetail={dataOrderDetail}
                        setChatWithCustomer={setChatWithCustomer}
                        setBadgeChatCount={setBadgeChatCount}
                      />
                    </>
                  ) : (
                    <>
                      <Divider style={{ marginTop: 12 }}>
                        Thông tin sản phẩm
                      </Divider>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginBottom: 10,
                        }}
                      >
                        <Segmented
                          options={["Sản phẩm", "Vải trong đơn hàng"]}
                          defaultValue="Sản phẩm"
                          onChange={(value) => {
                            setSelectedOption(value);
                          }}
                        />
                      </div>

                      {selectedOption === "Sản phẩm" ? (
                        <Table
                          columns={columns1}
                          dataSource={
                            dataOrderDetail && dataOrderDetail.products
                          }
                          pagination={false}
                          scroll={{
                            y: 450,
                            x: 1000,
                          }}
                        />
                      ) : (
                        <Table
                          key={
                            dataOrderDetail &&
                            dataOrderDetail?.orderMaterials?.map(
                              (item) => item.id
                            )
                          }
                          columns={columns2}
                          dataSource={
                            dataOrderDetail && dataOrderDetail.orderMaterials
                          }
                          pagination={false}
                          scroll={{
                            y: 450,
                          }}
                        />
                      )}
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
                        <Badge size="default" count={badgeChatCount}>
                          <Avatar
                            size={"large"}
                            src={
                              dataOrderDetail?.customer?.avatar
                                ? dataOrderDetail?.customer?.avatar
                                : "https://api.dicebear.com/7.x/miniavs/svg?seed=1"
                            }
                          />
                        </Badge>
                      </div>
                      <div style={{ margin: "10px 0" }}>
                        <Text
                          level={5}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <b>Họ và tên:</b> {dataOrderDetail?.cusName}
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
                          {dataOrderDetail?.cusPhone
                            ? dataOrderDetail?.cusPhone
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
                            {dataOrderDetail?.cusAddress
                              ? dataOrderDetail?.cusAddress
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
                            {dataOrderDetail?.cusEmail
                              ? dataOrderDetail?.cusEmail
                              : "Chưa có!"}
                          </span>
                        </Text>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: 10,
                          }}
                        >
                          {checkStatus && (
                            <Button
                              key="chat"
                              type="primary"
                              onClick={() => setChatWithCustomer(true)}
                            >
                              Trò chuyện với khách hàng
                            </Button>
                          )}
                        </div>
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
                    overflowY: "scroll",
                    scrollbarWidth: "none",
                    WebkitScrollbar: "none",
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
                      <b>Ngày dự kiến:</b>{" "}
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "bold",
                          color: "#9F78FF",
                        }}
                      >
                        {new Date(
                          dataOrderDetail?.plannedTime
                        ).toLocaleDateString()}
                      </Text>
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
                      {dataOrderDetail?.discountPrice
                        ? formatCurrency(dataOrderDetail?.discountPrice)
                        : "0đ"}
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
                      {dataOrderDetail?.afterDiscountPrice
                        ? formatCurrency(dataOrderDetail?.afterDiscountPrice)
                        : "0đ"}
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
                      {dataOrderDetail?.deposit
                        ? formatCurrency(dataOrderDetail?.deposit)
                        : "0đ"}
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
                      {dataOrderDetail?.paidMoney
                        ? formatCurrency(dataOrderDetail?.paidMoney)
                        : "0đ"}
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
                      {dataOrderDetail?.unPaidMoney
                        ? formatCurrency(dataOrderDetail?.unPaidMoney)
                        : "0đ"}
                    </Text>
                  </div>
                  {dataOrderDetail?.unPaidMoney > 0 && (
                    <div
                      style={{
                        width: "100%",
                        textAlign: "center",
                        marginTop: 20,
                      }}
                    >
                      <Button
                        loading={paymentLoading}
                        key="payment"
                        type="primary"
                        onClick={() => {
                          Swal.fire({
                            title: `Xác nhận trả tiền cọc ${formatCurrency(
                              dataOrderDetail?.unPaidMoney
                            )} ?`,
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
                                dataOrderDetail?.unPaidMoney,
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
                            } else if (result.isDenied) {
                              await handleCreatePayCash(
                                dataOrderDetail?.unPaidMoney,
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
                              Swal.fire("Hủy chọn", "", "info");
                            }
                          });
                        }}
                      >
                        Thanh toán phần còn lại
                      </Button>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          )}
        </Modal>
      </div>
    </>
  );
};
