import React, { useState, useEffect } from "react";
import OrderUpdate from "../OrderUpdate.js";
import { InputNumber } from "antd";
import {
  FileSearchOutlined,
  SearchOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  EditOutlined,
  LeftOutlined,
  RightOutlined,
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
  Input,
  Select,
  Image,
  Table,
  Space,
  Upload,
  Carousel,
  Radio,
  Slider,
} from "antd";
import "../index.css";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useQuery } from "react-query";
import ChooseTemplate from "../ChooseTemplate.js";
import toast, { Toaster } from "react-hot-toast";

const { Title, Paragraph } = Typography;
const { Meta } = Card;
const { Option } = Select;

function StepThree({
  chooseProductTemplate,
  setChooseProductTemplate,
  setProductComponent,
  openUpdate,
  form,
  initialComponentValues,
  setGetDetailDataProfileCustomer,
  getDetailDataProfileCustomer,
  formProfileBody,
  fetchDataProfileBody,
  saveCustomer,
  dataBodySize,
  productComponent,
  profileCustomer,
  saveOrderId,
  saveIdProduct,
  formUpdate,
  getProfileUpdateCustomer,
  setGetProfileUpdateCustomer,
  getAllBodySize,
  inputValue,
  setInputValue,
  onChange,
}) {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [formUpdateProfile] = Form.useForm();
  const navigate = useNavigate();
  const [openChooseProductTemplate, setOpenChooseProductTemplate] =
    useState(false);
  const [loadingUpdateBodyProfile, setLoadingUpdateBodyProfile] =
    useState(false);
  const [loadingCreateBodyProfile, setLoadingCreateBodyProfile] =
    useState(false);

  const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} slick-next`}
        style={{
          ...style,
          right: "-30px",
          borderRadius: "50%",
        }}
        onClick={onClick}
      >
        <RightOutlined style={{ color: "black", fontSize: "20px" }} />
      </div>
    );
  };
  const SamplePrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} slick-prev`}
        style={{
          ...style,
          left: "-30px",
          borderRadius: "50%",
        }}
        onClick={onClick}
      >
        <LeftOutlined style={{ color: "black", fontSize: "20px" }} />
      </div>
    );
  };
  const settings = {
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const [
    getDetailDataProfileCustomerLoading,
    setGetDetailDataProfileCustomerLoading,
  ] = useState(false);
  const urlGetAllMaterial = `https://e-tailorapi.azurewebsites.net/api/material/order/${saveOrderId}/fabric`;
  const { data: materialId } = useQuery("get-material", () =>
    fetch(urlGetAllMaterial, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${manager?.token}`,
      },
    }).then((response) => response.json())
  );
  const getDetailProfileCustomer = async (id) => {
    if (id) {
      setGetDetailDataProfileCustomerLoading(true);
      const urlProfile = `https://e-tailorapi.azurewebsites.net/api/profile-body/${id}`;
      try {
        const response = await fetch(`${urlProfile}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${manager?.token}`,
          },
        });
        if (response.ok && response.status === 200) {
          const responseData = await response.json();
          setGetDetailDataProfileCustomer(responseData);
        } else if (response.status === 401) {
          localStorage.removeItem("manager");
          navigate("/management/login");
        }
      } catch (error) {
        console.error("Error calling API:", error);
      } finally {
        setGetDetailDataProfileCustomerLoading(false);
      }
    }
  };
  const handleUpdateProfileBody = async () => {
    if (getDetailDataProfileCustomer) {
      const getProfileBody = formProfileBody.getFieldsValue();
      const dataBackEnd = {
        id: getDetailDataProfileCustomer.id,
        name: getProfileBody.nameProfile,
        customerId: getDetailDataProfileCustomer.customerId,
        valueBodyAttribute: Object.keys(getProfileBody)
          .map((fieldName) => {
            if (fieldName.startsWith("bodySizes_")) {
              const productComponent = getProfileBody[fieldName];
              const keyProduct = fieldName.replace("bodySizes_", "");
              return { id: keyProduct, value: productComponent };
            }
            return null;
          })
          .filter(Boolean),
      };
      setLoadingUpdateBodyProfile(true);
      const url = `https://e-tailorapi.azurewebsites.net/api/profile-body/customer/${getDetailDataProfileCustomer.id}`;
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
          await fetchDataProfileBody(saveCustomer.id);
          await getDetailProfileCustomer(getDetailDataProfileCustomer.id);
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
        setLoadingUpdateBodyProfile(false);
      }
    }
  };
  const renderFormItems = (bodyIndex, name) => {
    return (
      getDetailDataProfileCustomer &&
      getDetailDataProfileCustomer.bodyAttributes.map((item) => {
        if (item.bodySize.bodyIndex === bodyIndex) {
          return (
            <Form.Item
              key={item.id}
              label={item.bodySize.name}
              name={`bodySizes_${item.bodySize.id}`}
              rules={[
                {
                  type: "number",
                  min: item?.bodySize?.minValidValue,
                  max: item?.bodySize?.maxValidValue,
                  message: `${item.bodySize.name} nằm trong khoảng từ ${item?.bodySize.minValidValue} - ${item?.bodySize.maxValidValue} cm`,
                },
              ]}
              step={0.01}
            >
              <InputNumber
                placeholder={`${item?.bodySize.minValidValue} - ${item?.bodySize.maxValidValue} cm`}
                style={{ width: "100%" }}
                step={0.01}
              />
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
            <Form.Item
              key={item.id}
              label={item.name}
              name={`bodySizes_${item.id}`}
              rules={[
                {
                  type: "number",
                  min: item?.minValidValue,
                  max: item?.maxValidValue,
                  message: `${item.name} nằm trong khoảng từ ${item.minValidValue} - ${item.maxValidValue} cm`,
                },
              ]}
              step={0.01}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder={`${item?.minValidValue} - ${item?.maxValidValue} cm`}
                step={0.01}
              />
            </Form.Item>
          );
        }
        return null;
      })
    );
  };
  const handleCreateProfileBody = () => {
    formProfileBody.validateFields().then(async () => {
      const getProfileBody = formProfileBody.getFieldsValue();
      const dataBackEnd = {
        name: getProfileBody.nameProfile,
        customerId: saveCustomer.id,
        valueBodyAttribute: Object.keys(getProfileBody)
          .map((fieldName) => {
            if (fieldName.startsWith("bodySizes_")) {
              const productComponent = getProfileBody[fieldName];
              const keyProduct = fieldName.replace("bodySizes_", "");
              return { id: keyProduct, value: productComponent };
            }
            return null;
          })
          .filter(Boolean),
      };
      setLoadingCreateBodyProfile(true);
      const url = `https://e-tailorapi.azurewebsites.net/api/profile-body`;
      try {
        const response = await fetch(`${url}`, {
          method: "POST",
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
          await fetchDataProfileBody(saveCustomer.id);
          formProfileBody.resetFields();
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
        setLoadingCreateBodyProfile(false);
      }
    });
  };
  const filterOptionForMaterial = (input, option) =>
    (option?.title ?? "")
      .toString()
      .trim()
      .toLowerCase()
      .includes(input.toLowerCase());
  const handleChooseTemplate = async (id, data) => {
    setChooseProductTemplate(data);
    if (id) {
      const url = `https://e-tailorapi.azurewebsites.net/api/template/${id}/component-types`;
      try {
        const response = await fetch(`${url}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${manager?.token}`,
          },
        });
        if (response.ok) {
          const responseData = await response.json();
          setProductComponent(responseData);
          return 1;
        }
      } catch (error) {
        console.error("Error calling API:", error);
      }
    }
  };

  return (
    <>
      {!openUpdate ? (
        <>
          <Row>
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
              {chooseProductTemplate ? (
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
                          Tạo mới sản phẩm{" "}
                          <EditOutlined style={{ color: "#9F78FF" }} />
                        </Title>
                      </div>
                      <div style={{ paddingLeft: 20, paddingTop: 20 }}>
                        <Title level={4}>Bản mẫu đã chọn</Title>
                      </div>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
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
                                src={chooseProductTemplate?.thumbnailImage}
                              />
                            }
                            title={chooseProductTemplate?.name}
                            description={
                              <div style={{ position: "relative" }}>
                                <Paragraph
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {chooseProductTemplate?.description}
                                </Paragraph>
                                <Button
                                  style={{ float: "right" }}
                                  onClick={() =>
                                    setOpenChooseProductTemplate(true)
                                  }
                                >
                                  Chọn lại
                                </Button>
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
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <div
                          style={{
                            backgroundColor: "white",
                            padding: 24,
                            borderRadius: 10,
                            marginBottom: 20,
                          }}
                        >
                          <Form
                            form={form}
                            layout="vertical"
                            name="form_in_modal"
                            initialValues={{
                              modifier: "public",
                              ...initialComponentValues,
                            }}
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
                                  message: "Loại vải không được để trống!",
                                },
                              ]}
                            >
                              <Select
                                style={{ height: 45 }}
                                showSearch
                                placeholder="Chọn loại vải"
                                optionFilterProp="children"
                                filterOption={filterOptionForMaterial}
                                options={[
                                  {
                                    label: (
                                      <Title level={5}>
                                        Vải trong đơn hàng
                                      </Title>
                                    ),
                                    title: "Vải trong đơn hàng",
                                    options: materialId?.orderMaterials?.map(
                                      (material) => ({
                                        label: (
                                          <div
                                            key={material.id}
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            <Image
                                              width={35}
                                              src={material.image}
                                              height={35}
                                            />
                                            &nbsp; &nbsp;
                                            <Title
                                              level={5}
                                              style={{ marginTop: 6 }}
                                            >
                                              {material.name}
                                            </Title>
                                          </div>
                                        ),
                                        value: material.id,
                                      })
                                    ),
                                  },
                                  {
                                    label: (
                                      <Title level={5}>
                                        Vải trong cửa hàng
                                      </Title>
                                    ),
                                    title: "Vải trong cửa hàng",
                                    options: materialId?.materials?.map(
                                      (material) => ({
                                        label: (
                                          <div
                                            key={material.id}
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            <Image
                                              width={35}
                                              src={material.image}
                                              height={35}
                                            />
                                            &nbsp; &nbsp;
                                            <Title
                                              level={5}
                                              style={{ marginTop: 6 }}
                                            >
                                              {material.name}
                                            </Title>
                                          </div>
                                        ),
                                        value: material.id,
                                      })
                                    ),
                                  },
                                ]}
                              ></Select>
                            </Form.Item>
                            <Form.Item
                              label="Số lượng"
                              hasFeedback
                              name="quantity"
                              rules={[
                                {
                                  required: true,
                                  message: "Số lượng không được để trống!",
                                },
                              ]}
                              initialValue={inputValue}
                            >
                              <Row>
                                <Col span={19}>
                                  <Slider
                                    min={1}
                                    max={20}
                                    onChange={onChange}
                                    value={
                                      typeof inputValue === "number"
                                        ? inputValue
                                        : 0
                                    }
                                  />
                                </Col>
                                <Col span={4}>
                                  <InputNumber
                                    min={1}
                                    max={20}
                                    style={{
                                      margin: "0 16px",
                                    }}
                                    value={inputValue}
                                    onChange={onChange}
                                  />
                                </Col>
                              </Row>
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
                                                    // rules={[
                                                    //   {
                                                    //     required: true,
                                                    //     message:
                                                    //       "Ảnh của kiểu không được để trống!",
                                                    //   },
                                                    // ]}
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
                                                            whiteSpace:
                                                              "nowrap",
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
              ) : (
                <div
                  style={{
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <Typography.Title
                    level={4}
                    style={{
                      margin: 0,
                    }}
                  >
                    Chọn{" "}
                    <span
                      style={{
                        color: "#9F78FF",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                      onClick={() => setOpenChooseProductTemplate(true)}
                    >
                      bản mẫu
                    </span>{" "}
                    phù hợp cho sản phẩm
                  </Typography.Title>
                </div>
              )}
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
                        form={formProfileBody}
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
                            placeholder="Nhập tên hồ sơ"
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
                              onClick={() => {
                                setGetDetailDataProfileCustomer(null);
                                formProfileBody.resetFields();
                              }}
                            >
                              Bỏ chọn
                            </Button>
                            &nbsp; &nbsp; &nbsp;
                            <Button
                              type="primary"
                              htmlType="submit"
                              onClick={() => handleUpdateProfileBody()}
                              loading={loadingUpdateBodyProfile}
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
                              <Button
                                type="primary"
                                htmlType="submit"
                                onClick={() => handleCreateProfileBody()}
                                loading={loadingCreateBodyProfile}
                              >
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
          </Row>
          <ChooseTemplate
            open={openChooseProductTemplate}
            onCancel={() => setOpenChooseProductTemplate(false)}
            handleChooseTemplate={handleChooseTemplate}
          />
        </>
      ) : (
        <OrderUpdate
          saveOrderId={saveOrderId}
          saveIdProduct={saveIdProduct}
          filterOptionForMaterial={filterOptionForMaterial}
          materialId={materialId}
          productComponent={productComponent}
          settings={settings}
          profileCustomer={profileCustomer}
          getDetailDataProfileCustomerLoading={
            getDetailDataProfileCustomerLoading
          }
          getDetailProfileCustomer={getDetailProfileCustomer}
          dataBodySize={dataBodySize}
          formUpdate={formUpdate}
          formUpdateProfile={formUpdateProfile}
          getDetailDataProfileCustomer={getProfileUpdateCustomer}
          setGetDetailDataProfileCustomer={setGetProfileUpdateCustomer}
          saveCustomer={saveCustomer}
          getAllBodySize={getAllBodySize}
          fetchDataProfileBody={fetchDataProfileBody}
        />
      )}
    </>
  );
}

export default StepThree;
