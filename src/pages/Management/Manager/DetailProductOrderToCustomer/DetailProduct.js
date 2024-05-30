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
} from "antd";
import CircularProgress from "@mui/material/CircularProgress";
import toast, { Toaster } from "react-hot-toast";

import { Link } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

function DetailProduct({
  open,
  onCancel,
  saveOrderId,
  saveIdDetailProduct,
  setSaveIdDetailProduct,
}) {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [loading, setLoading] = useState(false);
  const [dataDetailProduct, setDataDetailProduct] = useState(null);
  const [dataProfileBodyDetail, setDataProfileBodyDetail] = useState(null);
  const [dataMaterialDetail, setDataMaterialDetail] = useState(null);
  const handleDetailProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://e-tailorapi.azurewebsites.net/api/product/order/${saveOrderId}/${saveIdDetailProduct}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${manager?.token}`,
          },
        }
      );
      if (response.ok && response.status === 200) {
        const responseData = await response.json();
        if (responseData.materialId) {
          handleGetDetailMaterial(responseData.materialId);
        }
        setDataDetailProduct(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleGetDetailProfileBody = async () => {
    const detailUrl = `https://e-tailorapi.azurewebsites.net/api/product/${saveIdDetailProduct}/order/${saveOrderId}/bodySize`;
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
  useEffect(() => {
    handleDetailProduct();
    handleGetDetailProfileBody();
  }, [saveIdDetailProduct]);
  return (
    <>
      <Modal
        title="Chi tiết sản phẩm"
        open={open}
        onCancel={() => {
          onCancel();
          setDataDetailProduct(null);
          setSaveIdDetailProduct(null);
        }}
        width={900}
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
                setSaveIdDetailProduct(null);
                setDataDetailProduct(null);
              }}
            >
              Đóng
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
            <div
              style={{
                width: "100%",
                height: 590,
                padding: "0px 10px",
                borderRadius: "5px",
                position: "relative",
              }}
            >
              {dataDetailProduct && (
                <div
                  style={{
                    height: "100%",
                    overflowY: "scroll",
                    scrollbarWidth: "none",
                    WebkitScrollbar: "none",
                  }}
                >
                  <div style={{ marginTop: 20 }}>
                    <Row>
                      <Col span={10}>
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
                              width: 400,
                              height: 400,
                              objectFit: "cover",
                              border: "1px solid #9F78FF",
                            }}
                            src={dataDetailProduct?.productTemplateImage}
                          />
                        </div>
                      </Col>
                      <Col span={12} push={2}>
                        <div>
                          <Title level={2}>{dataDetailProduct?.name}</Title>
                          <div>
                            <Title level={4}>Bản mẫu:</Title>
                            <Text>
                              {dataDetailProduct?.productTemplateName}
                            </Text>
                          </div>
                          <div style={{ marginTop: 10 }}>
                            <Title level={4}>Nguyên phụ liệu sử dụng:</Title>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Image
                                width={50}
                                src={dataMaterialDetail?.image}
                                style={{
                                  height: "50px",
                                  borderRadius: "50%",
                                  border: "1px solid #9F78FF",
                                }}
                              />
                              <Text style={{ marginLeft: 10 }}>
                                {dataMaterialDetail?.name}
                              </Text>
                            </div>
                          </div>
                          <div
                            style={{
                              marginTop: 10,
                            }}
                          >
                            <Title level={4}>Ghi chú:</Title>
                            <div
                              style={{
                                height: "200px",
                                overflowY: "scroll",
                                scrollbarWidth: "none",
                              }}
                            >
                              <Text>
                                {dataDetailProduct?.note
                                  ? dataDetailProduct?.note
                                  : "Chưa có ghi chú cho sản phẩm này."}
                              </Text>
                            </div>
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
                          }}
                        >
                          <Row gutter={[16, 24]} style={{ width: "100%" }}>
                            {dataProfileBodyDetail &&
                              dataProfileBodyDetail?.map((bodyAttribute) => {
                                return (
                                  <Col span={8}>
                                    <Text>
                                      <b>{bodyAttribute?.bodySize?.name} : </b>
                                      {bodyAttribute?.value} cm
                                    </Text>
                                  </Col>
                                );
                              })}
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
                            borderRadius: 10,
                            padding: 15,
                            width: "100%",
                          }}
                        >
                          <Row gutter={[16, 24]} style={{ width: "100%" }}>
                            {dataDetailProduct &&
                              dataDetailProduct?.componentTypeOrders?.map(
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
                                              src={selected?.image}
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
                                                  {selected?.name}
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
                                                          <Title level={5}>
                                                            Hình ảnh:
                                                          </Title>
                                                          <div
                                                            style={{
                                                              width: "400px",
                                                              height: "auto",
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
                                                              gutter={[16, 24]}
                                                              justify={"center"}
                                                            >
                                                              {componentTypeOrder
                                                                .noteObject
                                                                .noteImage ? (
                                                                JSON.parse(
                                                                  componentTypeOrder
                                                                    .noteObject
                                                                    .noteImage
                                                                ).map(
                                                                  (image) => (
                                                                    <Col
                                                                      span={10}
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
                                                                    Không có
                                                                    hình ảnh!
                                                                  </Text>
                                                                </div>
                                                              )}
                                                            </Row>
                                                          </div>

                                                          <br></br>
                                                          <Text>Ghi chú:</Text>
                                                          <div
                                                            style={{
                                                              width: "400px",
                                                              height: "auto",
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
                                                                  margin: "0px",
                                                                  width: "100%",
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
                                                                  width: "100%",
                                                                  textAlign:
                                                                    "center",
                                                                  margin: "0px",
                                                                }}
                                                              >
                                                                Không có ghi
                                                                chú!
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
                      </div>
                    </Row>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </Modal>
    </>
  );
}

export default DetailProduct;
