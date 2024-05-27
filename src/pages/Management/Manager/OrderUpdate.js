import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
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
  InputNumber,
} from "antd";
import "./index.css";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const { Search } = Input;
const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;
const { Option } = Select;

function OrderUpdate({
  saveIdProduct,
  saveOrderId,
  filterOptionForMaterial,
  materialId,
  settings,
  profileCustomer,
  dataBodySize,
  formUpdate,
  formUpdateProfile,
  getDetailDataProfileCustomer,
  setGetDetailDataProfileCustomer,
  saveCustomer,
  fetchDataProfileBody,
}) {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const navigate = useNavigate();

  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [dataDetailForUpdate, setDataDetailForUpdate] = useState(null);
  const initialProfileBodyValues = {};
  const [loadingUpdateProfile, setLoadingUpdateProfile] = useState(false);

  const [
    getDetailDataProfileCustomerLoading,
    setGetDetailDataProfileCustomerLoading,
  ] = useState(false);
  const componentInitialValues = {};
  const productComponenetInitialValues = {};

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
          setGetDetailDataProfileCustomerLoading(false);
        } else if (response.status === 401) {
          localStorage.removeItem("manager");
          navigate("/management/login");
        }
      } catch (error) {
        console.error("Error calling API:", error);
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
        component?.selected_Component_Id;
    });
    dataDetailForUpdate?.componentTypeOrders?.forEach((component) => {
      productComponenetInitialValues[`${component.note_Id}`] =
        component.noteObject !== null && component.noteObject !== undefined
          ? [
              {
                note: component?.noteObject?.note,
                image: component?.noteObject?.noteImage
                  ? JSON.parse(component?.noteObject?.noteImage).map(
                      (item, index) => ({
                        uid: `${new Date().getMilliseconds() + index}`,
                        name: `Hình ảnh ${index}`,
                        thumbUrl: null,
                        type: null,
                        originFileObj: null,
                        url: item,
                      })
                    )
                  : null,
              },
            ]
          : null;
    });

    formUpdate.setFieldsValue({
      modifier: "public",
      productTemplateId: dataDetailForUpdate?.productTemplateId,
      name: dataDetailForUpdate?.name,
      note: dataDetailForUpdate?.note,
      materialId: dataDetailForUpdate?.materialId,
      ...componentInitialValues,
      ...productComponenetInitialValues,
    });
    getDetailProfileCustomer(dataDetailForUpdate?.profileId);
  }, [dataDetailForUpdate]);
  useEffect(() => {
    getDetailDataProfileCustomer?.bodyAttributes?.forEach((component) => {
      initialProfileBodyValues[`bodySizes_${component.bodySize.id}`] =
        component.value;
    });

    formUpdateProfile.setFieldsValue({
      nameProfile: getDetailDataProfileCustomer?.name,
      ...initialProfileBodyValues,
    });
  }, [getDetailDataProfileCustomer]);

  const handleUpdateProfileBody = async () => {
    if (getDetailDataProfileCustomer) {
      const getProfileBody = formUpdateProfile.getFieldsValue();

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

      setLoadingUpdateProfile(true);
      // const url = `https://e-tailorapi.azurewebsites.net/api/profile-body/customer/${getDetailDataProfileCustomer.id}`;
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
        setLoadingUpdateProfile(false);
      }
    }
  };
  const handleCreateProfileBody = () => {
    formUpdateProfile.validateFields().then(async () => {
      const getProfileBody = formUpdateProfile.getFieldsValue();
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
      setLoadingUpdateProfile(true);
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
          formUpdateProfile.resetFields();
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
        setLoadingUpdateProfile(false);
      }
    });
  };

  return (
    <>
      <Toaster />
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
                      <Form form={formUpdate}>
                        <Form.Item name="productTemplateId">
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
                                  src={
                                    dataDetailForUpdate?.productTemplateImage
                                  }
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
                        </Form.Item>
                      </Form>
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
                              options={[
                                {
                                  label: (
                                    <Title level={5}>Vải trong đơn hàng</Title>
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
                                    <Title level={5}>Vải trong cửa hàng</Title>
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
                          <Form.Item label="Ghi chú" name="note" hasFeedback>
                            <Input.TextArea />
                          </Form.Item>
                          {dataDetailForUpdate &&
                            dataDetailForUpdate?.componentTypeOrders?.map(
                              (product) => {
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
                                                      defaultFileList={
                                                        formUpdate.getFieldValue(
                                                          `productComponent_${product.id}`
                                                        ) &&
                                                        formUpdate.getFieldValue(
                                                          `productComponent_${product.id}`
                                                        )[0]?.image
                                                      }
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
                              }
                            )}
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
                              onClick={() => {
                                setGetDetailDataProfileCustomer(null);
                                formUpdateProfile.resetFields();
                              }}
                            >
                              Bỏ chọn
                            </Button>
                            &nbsp; &nbsp; &nbsp;
                            <Button
                              type="primary"
                              htmlType="submit"
                              onClick={() => handleUpdateProfileBody()}
                              loading={loadingUpdateProfile}
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
                                loading={loadingUpdateProfile}
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
          </>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "600px",
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
