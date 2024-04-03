import React, { useState, useEffect } from "react";
import {
  CloseCircleOutlined,
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  Typography,
  Button,
  Steps,
  Divider,
  Card,
  Row,
  Col,
  Form,
  Modal,
  Avatar,
  Input,
  Select,
  Image,
  Table,
  Space,
  Upload,
  Carousel,
  Radio,
} from "antd";
import "./index.css";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useQuery } from "react-query";
import chooseTemplate from "../../../assets/dress.png";

const { Search } = Input;
const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;
const { Option } = Select;

function OrderUpdate({
  saveIdProduct,
  saveOrderId,
  filterOptionForMaterial,
  materialId,
  productComponent,
  settings,
  profileCustomer,
  getDetailDataProfileCustomerLoading,
  getDetailProfileCustomer,
  getDetailDataProfileCustomer,
  dataBodySize,
  handleChooseTemplate,
  setGetDetailDataProfileCustomer,
}) {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [formUpdate] = Form.useForm();
  const [formUpdateProfile] = Form.useForm();
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [dataDetailForUpdate, setDataDetailForUpdate] = useState(null);
  const componentInitialValues = {};

  const renderFormItems = (bodyIndex, name) => {
    return (
      getDetailDataProfileCustomer &&
      getDetailDataProfileCustomer.bodyAttributes.map((item) => {
        if (item.bodySize.bodyIndex === bodyIndex) {
          return (
            <Form.Item key={item.id} label={item.bodySize.name} name={item.id}>
              <Input />
            </Form.Item>
          );
        }
        return null;
      })
    );
  };
  const renderCreateFormItems = (bodyIndex, name) => {
    return (
      dataBodySize &&
      dataBodySize.map((item) => {
        if (item.bodyIndex === bodyIndex) {
          return (
            <Form.Item key={item.id} label={item.name} name={item.id}>
              <Input />
            </Form.Item>
          );
        }
        return null;
      })
    );
  };

  useEffect(() => {
    const handleGetDetail = async () => {
      const urlProductDetail = `https://e-tailorapi.azurewebsites.net/api/product/order/${saveOrderId}/${saveIdProduct}`;
      setLoadingUpdate(true);
      try {
        const response = await fetch(`${urlProductDetail}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${manager?.token}`,
          },
        });

        if (response.ok && response.status === 200) {
          const responseData = await response.json();
          setLoadingUpdate(false);
          console.log("response: ", responseData);
          setDataDetailForUpdate(responseData);
        }
      } catch (error) {
        console.error("Error calling API:", error);
      }
    };
    handleGetDetail();
  }, [saveIdProduct]);

  useEffect(() => {
    dataDetailForUpdate?.componentTypeOrders?.forEach((component) => {
      componentInitialValues[`${component.component_Id}`] =
        component.selected_Component_Id;
    });
    formUpdate.setFieldsValue({
      modifier: "public",
      name: dataDetailForUpdate?.name,
      note: dataDetailForUpdate?.note,
      materialId: dataDetailForUpdate?.materialId,
      ...componentInitialValues,
    });

    handleChooseTemplate(dataDetailForUpdate?.productTemplateId);
    getDetailProfileCustomer(dataDetailForUpdate?.profileId);
  }, [dataDetailForUpdate]);
  useEffect(() => {
    formUpdateProfile.setFieldsValue({
      modifier: "ProfileId",
      ...(getDetailDataProfileCustomer
        ? {
            nameProfile:
              getDetailDataProfileCustomer !== undefined ||
              getDetailDataProfileCustomer !== null
                ? getDetailDataProfileCustomer.name
                : "",
            ...getDetailDataProfileCustomer.bodyAttributes.reduce(
              (acc, item) => {
                acc[item.id] = item.value;
                return acc;
              },
              {}
            ),
          }
        : {
            nameProfile: "",
          }),
    });
  }, [getDetailDataProfileCustomer]);

  return (
    <>
      <Row>
        {!loadingUpdate ? (
          <>
            <Col
              flex="1 1 100px"
              style={{
                height: 560,
                marginTop: 15,
                backgroundColor: "rgba(213,197,255,0.2)",
                borderRadius: 10,
                border: "2px solid #9F78FF",
              }}
            >
              <>
                <div
                  style={{
                    height: "100%",
                    overflowY: "scroll",
                    scrollbarWidth: "none",
                    WebkitScrollbar: "none",
                  }}
                >
                  <div>
                    <div
                      style={{
                        paddingLeft: 20,
                        paddingTop: 20,
                        textAlign: "center",
                      }}
                    >
                      <Title level={4}>
                        Cập nhật sản phẩm{" "}
                        <EditOutlined style={{ color: "#9F78FF" }} />
                      </Title>
                    </div>
                    <div style={{ paddingLeft: 20, paddingTop: 20 }}>
                      <Title level={4}>Bản mẫu đã chọn</Title>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Card
                        style={{
                          width: 500,
                          marginTop: 16,
                        }}
                      >
                        <Meta
                          avatar={
                            <Image
                              style={{
                                width: 100,
                                height: 100,
                                objectFit: "cover",
                              }}
                              src={dataDetailForUpdate?.productTemplateImage}
                            />
                          }
                          title={dataDetailForUpdate?.productTemplateName}
                          description={
                            <div style={{ position: "relative" }}>
                              <Paragraph>
                                {dataDetailForUpdate?.description
                                  ? dataDetailForUpdate?.description
                                  : ""}
                              </Paragraph>
                            </div>
                          }
                        />
                      </Card>
                    </div>
                  </div>
                  <div>
                    <div style={{ paddingLeft: 20, paddingTop: 20 }}>
                      <Title level={4}>Thông tin sản phẩm</Title>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <div
                        style={{
                          backgroundColor: "white",
                          padding: 24,
                          borderRadius: 10,
                          marginBottom: 20,
                        }}
                      >
                        <Form
                          form={formUpdate}
                          layout="vertical"
                          name="form_in_modal"
                          style={{ width: 500 }}
                        >
                          <Form.Item
                            label="Tên sản phẩm"
                            hasFeedback
                            name="name"
                            rules={[
                              {
                                required: true,
                                message: "Tên sản phẩm không được để trống!",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                          <Form.Item
                            label="Chọn loại vải"
                            hasFeedback
                            name="materialId"
                            rules={[
                              {
                                required: true,
                                message: "Tên sản phẩm không được để trống!",
                              },
                            ]}
                          >
                            <Select
                              style={{ height: 45 }}
                              showSearch
                              placeholder="Chọn loại vải"
                              optionFilterProp="children"
                              filterOption={filterOptionForMaterial}
                            >
                              {materialId?.map((material) => (
                                <Select.Option
                                  key={material.id}
                                  value={material.id}
                                  title={material.name}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Image width={35} src={material.image} />
                                    &nbsp; &nbsp;
                                    <Title level={5} style={{ marginTop: 6 }}>
                                      {material.name}
                                    </Title>
                                  </div>
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                          <Form.Item label="Ghi chú" name="note" hasFeedback>
                            <Input.TextArea />
                          </Form.Item>
                          {productComponent &&
                            productComponent?.map((product) => {
                              return (
                                <>
                                  <Form.Item
                                    hasFeedback
                                    label={`Chọn ${product.name}`}
                                    name={`component_${product.id}`}
                                    rules={[
                                      product && {
                                        required: true,
                                        message:
                                          "Chọn bản mẫu không được để trống!",
                                      },
                                    ]}
                                  >
                                    <Select style={{ height: 45 }}>
                                      {product?.components?.map((item) => {
                                        return (
                                          <>
                                            <Option value={item.id}>
                                              <div
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                <Image
                                                  width={35}
                                                  src={item.image}
                                                  height={35}
                                                />
                                                &nbsp; &nbsp;
                                                <Title
                                                  level={5}
                                                  style={{ marginTop: 6 }}
                                                >
                                                  {item.name}
                                                </Title>
                                              </div>
                                            </Option>
                                          </>
                                        );
                                      })}
                                    </Select>
                                  </Form.Item>
                                  <Form.List
                                    name={`productComponent_${product.id}`}
                                  >
                                    {(fields, { add, remove }) => (
                                      <>
                                        {fields?.map(
                                          ({ key, name, ...restField }) => (
                                            <Space
                                              key={key}
                                              style={{
                                                display: "flex",
                                                marginBottom: 8,
                                                position: "relative",
                                              }}
                                              align="baseline"
                                            >
                                              <div>
                                                <Form.Item
                                                  {...restField}
                                                  name={[name, "image"]}
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message:
                                                        "Ảnh của kiểu không được để trống!",
                                                    },
                                                  ]}
                                                >
                                                  <Upload
                                                    multiple
                                                    listType="picture"
                                                    accept=".png,.jpeg,.jpg"
                                                    beforeUpload={(file) => {
                                                      return false;
                                                    }}
                                                    itemRender={(
                                                      originNode,
                                                      file,
                                                      fileList
                                                    ) => (
                                                      <div
                                                        style={{
                                                          width: "500px", // Adjust the width as needed
                                                          overflow: "hidden",
                                                          whiteSpace: "nowrap",
                                                          textOverflow:
                                                            "ellipsis",
                                                        }}
                                                        title={file.name}
                                                      >
                                                        {originNode}
                                                      </div>
                                                    )}
                                                  >
                                                    <button
                                                      style={{
                                                        width: 100,
                                                        height: 40,
                                                        borderRadius: 10,
                                                        color: "white",
                                                        fontWeight: "bold",
                                                        backgroundColor:
                                                          "#9F78FF",
                                                        border:
                                                          "1px solid #9F78FF",
                                                        display: "flex",
                                                        justifyContent:
                                                          "center",
                                                        alignItems: "center",
                                                        cursor: "pointer",
                                                      }}
                                                      type="button"
                                                    >
                                                      <div>Thêm ảnh</div>
                                                    </button>
                                                  </Upload>
                                                </Form.Item>
                                                <Form.Item
                                                  style={{ width: 500 }}
                                                  {...restField}
                                                  name={[name, "note"]}
                                                >
                                                  <Input.TextArea placeholder="Ghi chú" />
                                                </Form.Item>
                                              </div>
                                              <CloseCircleOutlined
                                                style={{
                                                  fontSize: 18,
                                                  position: "absolute",
                                                  top: 10,
                                                  right: 10,
                                                }}
                                                onClick={() => remove(name)}
                                              />
                                            </Space>
                                          )
                                        )}
                                        {fields?.length >= 1 ? (
                                          ""
                                        ) : (
                                          <Form.Item>
                                            <Button
                                              type="dashed"
                                              onClick={() => add()}
                                              block
                                              icon={<PlusOutlined />}
                                            >
                                              Lựa chọn khác
                                            </Button>
                                          </Form.Item>
                                        )}
                                      </>
                                    )}
                                  </Form.List>
                                </>
                              );
                            })}
                        </Form>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            </Col>
            <Col
              flex="0 1 500px"
              style={{
                height: 560,
                marginTop: 15,
                backgroundColor: "rgba(213,197,255,0.2)",
                borderRadius: 10,
                marginLeft: 10,
                overflowY: "scroll",
                scrollbarWidth: "none",
                WebkitScrollbar: "none",
                border: "2px solid #9F78FF",
                boxShadow: "0 -5px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div>
                <div
                  style={{
                    paddingLeft: 20,
                    paddingTop: 20,
                    textAlign: "center",
                  }}
                >
                  <Title level={4}>Số đo khách hàng</Title>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Carousel
                      style={{ width: "400px" }}
                      arrows
                      dots={false}
                      {...settings}
                    >
                      {profileCustomer &&
                        profileCustomer.map((profile) => {
                          return (
                            <Card
                              hoverable
                              title={profile.name}
                              bordered={false}
                              style={{
                                width: 300,
                                borderRadius: "20px",
                              }}
                              onClick={() =>
                                getDetailProfileCustomer(profile.id)
                              }
                            >
                              Ngày tạo:{" "}
                              {new Date(
                                profile.createdTime
                              ).toLocaleDateString()}
                            </Card>
                          );
                        })}
                    </Carousel>
                  </div>
                  {getDetailDataProfileCustomerLoading ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "350px",
                      }}
                    >
                      <CircularProgress />
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 24,
                      }}
                    >
                      <Form
                        form={formUpdateProfile}
                        name="ProfileId"
                        layout="vertical"
                        style={{ width: "400px" }}
                        initialValues={{
                          remember: true,
                        }}
                        autoComplete="off"
                      >
                        <Form.Item
                          label={<Title level={4}>Tên hồ sơ</Title>}
                          name="nameProfile"
                          rules={[
                            {
                              required: true,
                              message: "Tên hồ sơ không được để trống!",
                            },
                          ]}
                        >
                          <Input
                            disabled={
                              getDetailDataProfileCustomer ? true : false
                            }
                          />
                        </Form.Item>
                        <Title level={4}>Phần đầu</Title>
                        {getDetailDataProfileCustomer
                          ? renderFormItems(1)
                          : renderCreateFormItems(1)}
                        <Title level={4}>Phần thân</Title>
                        {getDetailDataProfileCustomer
                          ? renderFormItems(2)
                          : renderCreateFormItems(2)}
                        <Title level={4}>Phần chân</Title>
                        {getDetailDataProfileCustomer
                          ? renderFormItems(3)
                          : renderCreateFormItems(3)}
                        {getDetailDataProfileCustomer ? (
                          <Form.Item
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Button
                              onClick={() =>
                                setGetDetailDataProfileCustomer(null)
                              }
                            >
                              Bỏ chọn
                            </Button>
                            &nbsp; &nbsp; &nbsp;
                            <Button
                              type="primary"
                              htmlType="submit"
                              onClick={() => {
                                const getAllForm =
                                  formUpdateProfile.getFieldsValue();
                                console.log("getAllForm", getAllForm);
                              }}
                            >
                              Cập nhật
                            </Button>
                          </Form.Item>
                        ) : (
                          <>
                            <Form.Item
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <Button type="primary" htmlType="submit">
                                Tạo mới
                              </Button>
                            </Form.Item>
                          </>
                        )}
                      </Form>
                    </div>
                  )}
                </div>
              </div>
            </Col>
          </>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "550px",
            }}
          >
            <CircularProgress />
          </div>
        )}
      </Row>
    </>
  );
}

export default OrderUpdate;
