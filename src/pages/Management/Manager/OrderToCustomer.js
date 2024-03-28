import React, { useState, useEffect, useRef } from "react";
import { VnPay } from "../../../components/RealTime/index.js";
import { Breadcrumb } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  FileSearchOutlined,
  IdcardOutlined,
  PhoneOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
  CloseOutlined,
  SearchOutlined,
  MinusCircleOutlined,
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
  Modal,
  Avatar,
  Input,
  Select,
  Image,
  Table,
  Popover,
  Tag,
  Spin,
  Space,
  Upload,
  Carousel,
  Badge,
} from "antd";
import "./index.css";
import CircularProgress from "@mui/material/CircularProgress";
import paymenVnpay from "../../../assets/payment-method-vnpay.png";
import paymenMomo from "../../../assets/payment-method-momo.png";
import paymenCash from "../../../assets/money.png";
import paymenDeposit from "../../../assets/deposit.png";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useQuery } from "react-query";
import chooseTemplate from "../../../assets/dress.png";

const { Search } = Input;
const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

const OrderToCustomerHeader = () => {
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
              href: "/manager",
              title: (
                <>
                  <Link to="/manager">
                    <div>
                      <HomeOutlined />
                    </div>
                  </Link>
                </>
              ),
            },
            {
              href: "/manager/order-for-customer",
              title: (
                <>
                  <Link to="/manager/order-for-customer">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "#9F78FF",
                      }}
                    >
                      <UserOutlined fontSize="small" />
                      &nbsp;
                      <span>Lên đơn hàng</span>
                    </div>
                  </Link>
                </>
              ),
            },
          ]}
        />
        <Title level={4}>Lên đơn hàng</Title>
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

const CreateNewProductModal = ({
  open,
  onCreateNewProduct,
  onCancel,
  productTemplateId,
  profileCustomer,
  saveOrderId,
  materialId,
}) => {
  const [form] = Form.useForm();
  const [productComponent, setProductComponent] = useState(null);
  const [loadingApi, setLoadingApi] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const manager = JSON.parse(localStorage.getItem("manager"));

  const filterOptionForProductTemplate = (input, option) =>
    (option?.title ?? "")
      .toString()
      .trim()
      .toLowerCase()
      .includes(input.toLowerCase());
  const filterOptionForProfile = (input, option) =>
    (option?.title ?? "")
      .toString()
      .trim()
      .toLowerCase()
      .includes(input.toLowerCase());
  const filterOptionForMaterial = (input, option) =>
    (option?.title ?? "")
      .toString()
      .trim()
      .toLowerCase()
      .includes(input.toLowerCase());

  const handleSelectProductTemplate = async (value) => {
    setLoadingApi(true);
    const urlTemplateType = `https://e-tailorapi.azurewebsites.net/api/template/${value}/component-types`;
    try {
      const response = await fetch(`${urlTemplateType}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setLoadingApi(false);
        setProductComponent(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  return (
    <Modal
      open={open}
      style={{ top: 40 }}
      title="Thêm mới sản phẩm"
      okText="Tạo mới"
      cancelText="Hủy bỏ"
      onCancel={() => {
        form.resetFields();
        setProductComponent(null);
        onCancel();
      }}
      onOk={() => {
        form
          .validateFields()
          .then(async (values) => {
            setLoadingCreate(true);
            const backendData = {
              orderId: saveOrderId,
              name: values.name,
              productTemplateId: values.productTemplateId,
              materialId: values.materialId,
              productComponents: Object.keys(values)
                .map((fieldName) => {
                  if (fieldName.startsWith("component_")) {
                    const componentId = values[fieldName];
                    return { componentId: componentId };
                  }
                  return null;
                })
                .filter(Boolean),
              profileId: values.profile,
              note: values.note ? values.note : "",
            };
            const checkResult = await onCreateNewProduct(backendData);
            if (checkResult === 1) {
              form.resetFields();

              setProductComponent(null);
            }
            setLoadingCreate(false);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
      okButtonProps={{ loading: loadingCreate }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: "public",
        }}
        style={{
          height: 530,
          overflowY: "scroll",
          scrollbarWidth: "none",
          WebkitScrollbar: "none",
        }}
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
          label="Chọn bản mẫu"
          hasFeedback
          name="productTemplateId"
          rules={[
            {
              required: true,
              message: "Chọn bản mẫu không được để trống!",
            },
          ]}
        >
          <Select
            style={{ height: 45 }}
            showSearch
            placeholder="Chọn bản mẫu"
            optionFilterProp="children"
            onChange={(value) => handleSelectProductTemplate(value)}
            filterOption={filterOptionForProductTemplate}
          >
            {productTemplateId?.map((template) =>
              template?.productTemplates?.map((productTemplate) => (
                <Select.Option
                  key={productTemplate.id}
                  value={productTemplate.id}
                  title={productTemplate.name}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Image width={30} src={productTemplate.thumbnailImage} />
                    &nbsp; &nbsp;
                    <Title level={5} style={{ marginTop: 6 }}>
                      {productTemplate.name}
                    </Title>
                  </div>
                </Select.Option>
              ))
            )}
          </Select>
        </Form.Item>
        {!loadingApi ? (
          productComponent?.map((component) => {
            return (
              <Form.Item
                key={component.id}
                hasFeedback
                label={`Chọn ${component.name}`}
                name={`component_${component.id}`}
                rules={[
                  productComponent && {
                    required: true,
                    message: "Chọn bản mẫu không được để trống!",
                  },
                ]}
              >
                <Select style={{ height: 45 }}>
                  {component?.components?.map((item) => {
                    return (
                      <Select.Option value={item.id} key={item.id}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Image width={35} src={item.image} height={35} />
                          &nbsp; &nbsp;
                          <Title level={5} style={{ marginTop: 6 }}>
                            {item.name}
                          </Title>
                        </div>
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            );
          })
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "150px",
            }}
          >
            <CircularProgress />
          </div>
        )}
        <Form.Item
          name="profile"
          label="Profile khách hàng"
          hasFeedback
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
            allowClear
            placeholder="Chọn profile"
            optionFilterProp="children"
            filterOption={filterOptionForProfile}
          >
            {profileCustomer?.map((profile) => (
              <Select.Option
                key={profile.id}
                value={profile.id}
                title={profile.name}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Title level={5} style={{ marginTop: 6 }}>
                    {profile.name}
                  </Title>
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Chọn loại vải"
          name="materialId"
          hasFeedback
          rules={[
            {
              required: true,
              message: "Chọn loại vải không được để trống!",
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
      </Form>
    </Modal>
  );
};

const UpdateProductModal = ({
  open,
  handleUpdateProduct,
  onCancel,
  productTemplateId,
  profileCustomer,
  saveOrderId,
  materialId,
  productId,
}) => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [form] = Form.useForm();
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [dataDetailForUpdate, setDataDetailForUpdate] = useState(null);
  const componentInitialValues = {};
  useEffect(() => {
    const handleGetDetail = async () => {
      const urlProductDetail = `https://e-tailorapi.azurewebsites.net/api/product/order/${saveOrderId}/${productId}`;
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
          setDataDetailForUpdate(responseData);
        }
      } catch (error) {
        console.error("Error calling API:", error);
      }
    };
    handleGetDetail();
  }, [productId]);
  useEffect(() => {
    dataDetailForUpdate?.componentTypeOrders?.forEach((component) => {
      componentInitialValues[`${component.component_Id}`] =
        component.selected_Component_Id;
    });
    form.setFieldsValue({
      modifier: "public",
      name: dataDetailForUpdate?.name,
      note: dataDetailForUpdate?.note,
      profile: dataDetailForUpdate?.profileId,
      materialId: dataDetailForUpdate?.materialId,
      ...componentInitialValues,
    });
  }, [dataDetailForUpdate]);

  console.log(componentInitialValues);

  const filterOptionForProfile = (input, option) =>
    (option?.title ?? "")
      .toString()
      .trim()
      .toLowerCase()
      .includes(input.toLowerCase());
  const filterOptionForMaterial = (input, option) =>
    (option?.title ?? "")
      .toString()
      .trim()
      .toLowerCase()
      .includes(input.toLowerCase());

  return (
    <Modal
      open={open}
      style={{ top: 40 }}
      title="Cập nhật sản phẩm"
      okText="Cập nhật"
      cancelText="Hủy bỏ"
      onCancel={() => {
        onCancel();
      }}
      onOk={() => {
        form
          .validateFields()
          .then(async (values) => {
            setLoadingUpdate(true);
            const backendData = {
              orderId: saveOrderId,
              name: values.name,
              productTemplateId: dataDetailForUpdate.productTemplateId,
              materialId: values.materialId,
              productComponents: Object.keys(values)
                .map((fieldName) => {
                  if (fieldName.startsWith("component_")) {
                    const componentId = values[fieldName];
                    return { componentId: componentId };
                  }
                  return null;
                })
                .filter(Boolean),
              profileId: values.profile,
              note: values.note ? values.note : "",
            };
            await handleUpdateProduct(backendData);
            setLoadingUpdate(false);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
      okButtonProps={{ loading: loadingUpdate }}
    >
      {loadingUpdate ? (
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
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          style={{
            height: 530,
            overflowY: "scroll",
            scrollbarWidth: "none",
            WebkitScrollbar: "none",
          }}
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
          <Form.Item label="Chọn bản mẫu" hasFeedback name="productTemplateId">
            {dataDetailForUpdate && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Image
                  width={35}
                  src={dataDetailForUpdate.productTemplateImage}
                />
                &nbsp; &nbsp;
                <Title level={5}>
                  {dataDetailForUpdate.productTemplateName}
                </Title>
              </div>
            )}
          </Form.Item>
          {dataDetailForUpdate &&
            dataDetailForUpdate?.componentTypeOrders?.map((component) => {
              return (
                <Form.Item
                  key={component.id}
                  hasFeedback
                  label={`Chọn ${component.name}`}
                  name={component.component_Id}
                  rules={[
                    {
                      required: true,
                      message: "Kiểu mẫu cho từng bộ phận không được để trống",
                    },
                  ]}
                >
                  <Select style={{ height: 45 }}>
                    {component?.components?.map((item) => {
                      return (
                        <Select.Option value={item.id} key={item.id}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Image width={35} src={item.image} height={35} />
                            &nbsp; &nbsp;
                            <Title level={5}>{item.name}</Title>
                          </div>
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              );
            })}
          <Form.Item
            name="profile"
            label="Profile khách hàng"
            hasFeedback
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
              allowClear
              placeholder="Chọn profile"
              optionFilterProp="children"
              filterOption={filterOptionForProfile}
            >
              {profileCustomer?.map((profile) => (
                <Select.Option
                  key={profile.id}
                  value={profile.id}
                  title={profile.name}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Title level={5}>{profile.name}</Title>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Chọn loại vải"
            name="materialId"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Chọn loại vải không được để trống!",
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
                    <Title level={5}>{material.name}</Title>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Ghi chú" name="note" hasFeedback>
            <Input.TextArea />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};
const ChooseTemplate = ({ open, onCancel, handleChooseTemplate }) => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  // list ra category
  const [category, setCategory] = useState(null);
  // chọn category
  const [selected, setSelected] = useState(null);
  // chi tiết product template
  const [detailProduct, setDetailProduct] = useState(null);
  // Chọn bản mẫu
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedLoading, setSelectedLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const handleGetCategory = async () => {
    setLoading(true);
    const url = `https://e-tailorapi.azurewebsites.net/api/category-management`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.json();
        setLoading(false);
        setCategory(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  const handleSelected = async () => {
    setSelectedLoading(true);
    const url = `https://e-tailorapi.azurewebsites.net/api/template-management/category/${selected}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.json();
        setDetailProduct(responseData);
        setSelectedLoading(false);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };
  useEffect(() => {
    handleGetCategory();
  }, []);

  useEffect(() => {
    handleSelected();
  }, [selected]);

  const handleSelectedTemplate = (value, index) => {
    if (activeIndex === index) {
      setSelectedTemplate(null);
    } else {
      setSelectedTemplate(value);
    }
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <Modal
      open={open}
      style={{ top: 80 }}
      title="Chọn bản mẫu phù hợp"
      okText="Xác nhận"
      cancelText="Hủy bỏ"
      onCancel={() => {
        form.resetFields();
        setSelected(null);
        setActiveIndex(null);
        setSelectedTemplate(null);
        onCancel();
      }}
      onOk={() => {
        form
          .validateFields()
          .then(async () => {
            setConfirmLoading(true);
            if (selectedTemplate) {
              const check = await handleChooseTemplate(
                selectedTemplate.id,
                selectedTemplate
              );
              if (check === 1) {
                form.resetFields();
                setSelected(null);
                setActiveIndex(null);
                setSelectedTemplate(null);
                onCancel();
              }
              setConfirmLoading(false);
            } else {
              await Swal.fire({
                position: "top-center",
                icon: "warning",
                title: "Chọn loại bản mẫu thì phải chọn bản mẫu",
                showConfirmButton: false,
                timer: 2500,
                zIndex: 1000,
              });
              setConfirmLoading(false);
            }
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
      okButtonProps={{ loading: confirmLoading }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: "public",
        }}
        style={{
          height: 400,
          overflowY: "scroll",
          scrollbarWidth: "none",
          WebkitScrollbar: "none",
        }}
        onFinish={(values) => {
          console.log("Values cua create", values);
        }}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "400px",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <>
            <Form.Item
              label="Loại bản mẫu"
              hasFeedback
              name="category"
              rules={[
                {
                  required: true,
                  message: "Loại bản mẫu không được để trống!",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Chọn loại bản mẫu"
                optionFilterProp="children"
                onChange={(value) => {
                  setSelected(value);
                }}
                filterOption={(value, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(value.toLowerCase())
                }
                options={
                  category &&
                  category.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))
                }
              />
            </Form.Item>
            {selected ? (
              selectedLoading ? (
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
              ) : detailProduct.productTemplates?.length !== 0 ? (
                detailProduct?.productTemplates?.map((item, index) => {
                  return (
                    <>
                      <Card
                        style={{
                          width: 470,
                          marginTop: 16,
                          border:
                            activeIndex === index ? "1px solid #9F78FF" : "",
                          cursor: "pointer",
                        }}
                        loading={loading}
                        onClick={() => handleSelectedTemplate(item, index)}
                      >
                        <Meta
                          avatar={
                            <Image width={100} src={item.thumbnailImage} />
                          }
                          title={item.name}
                          description={item.description}
                        />
                      </Card>
                    </>
                  );
                })
              ) : (
                <div
                  style={{
                    textAlign: "center",
                  }}
                >
                  <div>
                    <img
                      src={chooseTemplate}
                      style={{ width: 200, height: 200 }}
                      alt=""
                    />
                    <Title level={5}>
                      Chưa có bản mẫu phù hợp nào vui lòng chọn lại loại bản mẫu
                      khác
                    </Title>
                  </div>
                </div>
              )
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div style={{ marginTop: 24 }}>
                  <img
                    src={chooseTemplate}
                    style={{ width: 200, height: 200 }}
                    alt=""
                  />
                  <Title level={5}>
                    Chọn <span style={{ color: "red" }}>loại bản mẫu</span>{" "}
                    trước!
                  </Title>
                </div>
              </div>
            )}
          </>
        )}
      </Form>
    </Modal>
  );
};

const OrderToCustomerContent = () => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const navigate = useNavigate();
  const vnpayNotification = VnPay();
  const [form] = Form.useForm();

  useEffect(() => {
    if (!manager) {
      manager = JSON.parse(localStorage.getItem("manager"));
    }
  }, []);
  useEffect(() => {
    if (
      vnpayNotification !== null &&
      vnpayNotification !== undefined &&
      vnpayNotification !== ""
    ) {
      Swal.fire({
        position: "top-center",
        icon: "error",
        title: vnpayNotification,
        showConfirmButton: false,
      });
    }
  }, [vnpayNotification]);

  //-----------------------------------------Thử làm cách mới--------------------------------------------------

  const [active, setActive] = useState(0);

  //-------------------------------------------------Modal thêm mới khách hàng--------------------------------------------------------
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const showModal = () => {
  //   setIsModalOpen(true);
  // };

  // const onCreate = async (values) => {
  //   const urlCreateNew = `https://e-tailorapi.azurewebsites.net/api/customer-management`;
  //   try {
  //     const response = await fetch(`${urlCreateNew}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${manager?.token}`,
  //       },
  //     });
  //     if (response.ok) {
  //       const responseData = await response.json();
  //       Swal.fire({
  //         position: "top-center",
  //         icon: "success",
  //         title: "Tạo mới thành công",
  //         showConfirmButton: false,
  //         timer: 1500,
  //       });
  //       setIsModalOpen(false);
  //     }
  //   } catch (error) {
  //     console.error("Error calling API:", error);
  //   }
  // };
  //------------------------------------------------Kiểm tra 2 field options---------------------------------------------------------
  const [checkValid, setCheckValid] = useState(0);

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
    },
  ];

  //---------------------------------------------------Lưu orderId-----------------------------------------------------------------
  const [saveCustomer, setSaveCustomer] = useState(null);
  const [saveOrderId, setSaveOrderId] = useState(null);
  const [searchInfo, setSearchInfo] = useState("");
  const [saveFormCustomer, setSaveFormCustomer] = useState(null);
  const [searchResult, setSearchResult] = useState([]);

  const handleSaveOrder = () => {
    const urlCreateNew = `https://e-tailorapi.azurewebsites.net/api/order`;
    try {
      fetch(urlCreateNew, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
        body: JSON.stringify({
          id: saveOrderId,
          customerId: saveCustomer.id,
        }),
      }).then(async (response) => {
        if (response.ok && response.status === 200) {
          const responseData = await response.text();
          setSaveOrderId(responseData);
        } else if (response.status === 401) {
          localStorage.removeItem("manager");
          navigate("/management/login");
        }
      });
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  const handleDelayNext = () => {
    setTimeout(() => {
      setCurrent((prevCurrent) => prevCurrent + 1);
    }, 2000);
  };

  useEffect(() => {
    const fetchData = async () => {
      await handleSaveOrder();
      await OrderForProduct();
    };
    fetchData();
  }, [saveCustomer, saveOrderId]);
  //---------------------------------------------------Xử lý logic bước 1----------------------------------------------------------

  const [isLoading, setIsLoading] = useState(false);

  const handleSearchInfoCustomer = async (value) => {
    if (!value || !searchInfo) {
      setSearchInfo(value);
      setSearchResult([]);
    } else {
      setSearchInfo(value);
    }
  };
  useEffect(() => {
    if (saveCustomer) {
      form.setFieldsValue({
        modifier: "create_customer",
        fullname: saveCustomer.fullname || "",
        email: saveCustomer.email || "",
        phone: saveCustomer.phone || "",
        address: saveCustomer.address || "",
      });
    }
  }, [saveCustomer]);

  useEffect(() => {
    let timer;

    const fetchData = async () => {
      const urlSearchIfo = `https://e-tailorapi.azurewebsites.net/api/customer-management`;
      try {
        setIsLoading(true);
        const response = await fetch(`${urlSearchIfo}?search=${searchInfo}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${manager?.token}`,
          },
        });

        if (response.ok && response.status === 200) {
          const responseData = await response.json();
          setSearchResult(responseData);
        } else if (response.status === 401) {
          localStorage.removeItem("manager");
          navigate("/management/login");
        }
      } catch (error) {
        console.error("Error calling API:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const searchWithDelay = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (searchInfo) {
          fetchData();
        }
      }, 2000);
    };

    if (searchInfo) {
      searchWithDelay();
    }

    return () => clearTimeout(timer);
  }, [searchInfo]);

  //----------------------------------------------------------------Api xử lý bước 2-------------------------------------------------------------
  const [profileCustomer, setProfileCustomer] = useState(null);
  const [open, setOpen] = useState(false);

  const urlProductTemplate =
    "https://e-tailorapi.azurewebsites.net/api/template-management/get-all-template";
  const urlGetAllMaterial =
    "https://e-tailorapi.azurewebsites.net/api/material";

  const { data: orderForProduct, refetch: OrderForProduct } = useQuery(
    "get-order-for-customer",
    () =>
      fetch(
        `https://e-tailorapi.azurewebsites.net/api/product/order/${saveOrderId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${manager?.token}`,
          },
        }
      ).then((response) => response.json())
  );

  const { data: productTemplateId, isLoading: loading } = useQuery(
    "get-product-template",
    () =>
      fetch(urlProductTemplate, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      }).then((response) => response.json())
  );

  const { data: materialId } = useQuery("get-material", () =>
    fetch(urlGetAllMaterial, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${manager?.token}`,
      },
    }).then((response) => response.json())
  );

  const handleUpdateProduct = async (values) => {
    const urlUpdate = `https://e-tailorapi.azurewebsites.net/api/product/${saveOrderId}/${saveIdProduct}`;
    try {
      const response = await fetch(`${urlUpdate}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
        body: JSON.stringify(values),
      });

      if (response.ok && response.status === 200) {
        const responseData = await response.text();
        await Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Cập nhật thành công",
          showConfirmButton: false,
          timer: 1500,
          zIndex: 1000,
        });
        OrderForProduct();
        setOpenUpdate(false);
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
  };

  const handleCreatePayCash = async (amount, payType, platform) => {
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
        const responseData = await response.text();
        if (platform === "VN Pay") {
          window.open(responseData);
          handleDataOrderDetail();
        } else {
          handleDataOrderDetail();
        }
        return 1;
      } else if (response.status === 400 || response.status === 500) {
        const responseData = await response.text();
        return 0;
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const urlProfile = `https://e-tailorapi.azurewebsites.net/api/profile-body/staff/customer/${saveCustomer.id}`;
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
          setProfileCustomer(responseData);
        } else if (response.status === 401) {
          localStorage.removeItem("manager");
          navigate("/management/login");
        }
      } catch (error) {
        console.error("Error calling API:", error);
      }
    };
    if (saveCustomer) {
      fetchData();
    }
  }, [saveCustomer]);

  //------------------------------------------------------------Cập nhật sản phẩm--------------------------------------------
  const [openUpdate, setOpenUpdate] = useState(false);

  const [saveIdProduct, setSaveIdProduct] = useState(null);

  const openUpdateAModal = async (id) => {
    await setSaveIdProduct(id);
    setOpenUpdate(true);
  };

  //------------------------------------------------------------Xóa sản phẩm-------------------------------------------------
  const handleDeleteProduct = (id) => {
    Swal.fire({
      title: "Bạn có muốn xóa sản phẩm này không?",
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const urlDeleteProduct = `https://e-tailorapi.azurewebsites.net/api/product/${id}`;
        try {
          const response = await fetch(`${urlDeleteProduct}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${manager?.token}`,
            },
          });

          if (response.ok && response.status === 200) {
            Swal.fire("Đã xóa sản phẩm!", "", "success");
            OrderForProduct();
          } else if (response.status === 401) {
            localStorage.removeItem("manager");
            navigate("/management/login");
          }
        } catch (error) {
          console.error("Error calling API:", error);
        }
      }
    });
  };

  //------------------------------------------------------------Api xử lý bước 3--------------------------------------------
  const [orderPaymentDetail, setOrderPaymentDetail] = useState(null);
  const [loadingDiscount, setLoadingDiscount] = useState(false);

  const handleDataOrderDetail = async () => {
    const urlOrderDetail = `https://e-tailorapi.azurewebsites.net/api/order/${saveOrderId}`;
    try {
      const response = await fetch(`${urlOrderDetail}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });

      if (response.ok && response.status === 200) {
        const responseData = await response.json();
        setOrderPaymentDetail(responseData);
      } else if (response.status === 401) {
        localStorage.removeItem("manager");
        navigate("/management/login");
      }
    } catch (error) {
      console.error("Error calling API:", error);
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

  const dataForProduct = orderPaymentDetail?.products?.map((item, index) => ({
    index: index,
    name: item.name,
    templateName: item.templateName,
    templateThumnailImage: item.templateThumnailImage,
    price: item.price,
  }));

  //-------------------------------------------------------------------Xử lý bước 2 mới----------------------------------------
  const [openChooseProductTemplate, setOpenChooseProductTemplate] =
    useState(false);
  const [productComponent, setProductComponent] = useState(null);
  const [chooseProductTemplate, setChooseProductTemplate] = useState(null);
  const [dataBodySize, setDataBodySize] = useState([]);

  const handleChooseTemplate = async (id, data) => {
    setChooseProductTemplate(data);
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
        console.log("responseData", responseData);

        setProductComponent(responseData);
        return 1;
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

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
  const [getDetailDataProfileCustomer, setGetDetailDataProfileCustomer] =
    useState(null);

  const [
    getDetailDataProfileCustomerLoading,
    setGetDetailDataProfileCustomerLoading,
  ] = useState(false);
  const getDetailProfileCustomer = async (id) => {
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
  };

  const getAllBodySize = async () => {
    const url = `https://e-tailorapi.azurewebsites.net/api/body-size`;
    try {
      const response = await fetch(`${url}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });

      if (response.ok && response.status === 200) {
        const responseData = await response.json();
        setDataBodySize(responseData);
      } else if (response.status === 401) {
        localStorage.removeItem("manager");
        navigate("/management/login");
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  useEffect(() => {
    getAllBodySize();
  }, []);

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

  const onCreateNewProduct = async (values) => {
    const urlCreateNew = `https://e-tailorapi.azurewebsites.net/api/product/${saveOrderId}`;
    try {
      const response = await fetch(`${urlCreateNew}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${manager?.token}`,
        },
        body: values,
      });

      if (response.ok && response.status === 200) {
        const responseData = await response.text();
        await Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Tạo mới thành công",
          showConfirmButton: false,
          timer: 1500,
          zIndex: 1000,
        });
        setChooseProductTemplate(null);
        setGetDetailDataProfileCustomer(null);
        OrderForProduct();
        setCurrent(1);

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
  };

  const initialComponentValues = {};

  useEffect(() => {
    productComponent?.forEach((component) => {
      initialComponentValues[`component_${component.id}`] =
        component?.components?.find((item1) => item1.default === true)?.id;
    });
    form.setFieldsValue({
      modifier: "public",
      ...initialComponentValues,
    });
  }, [productComponent]);
  useEffect(() => {
    form.setFieldsValue({
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
  const filterOptionForMaterial = (input, option) =>
    (option?.title ?? "")
      .toString()
      .trim()
      .toLowerCase()
      .includes(input.toLowerCase());

  const onFinish = async () => {
    if (getDetailDataProfileCustomer) {
      const allValues = form.getFieldsValue();
      const formData = new FormData();

      const backendData = {
        orderId: saveOrderId,
        name: allValues.name,
        productTemplateId: chooseProductTemplate.id,
        materialId: allValues.materialId,
        productComponents: Object.keys(allValues)
          .map((fieldName) => {
            if (fieldName.startsWith("component_")) {
              const componentId = allValues[fieldName];
              console.log("componentId", componentId);
              return { componentId: componentId };
            }
            return null;
          })
          .filter(Boolean),
        profileId: getDetailDataProfileCustomer.id,
        note: allValues.note ? allValues.note : "",
      };
      // productComponents: Object.keys(allValues)
      //     .map((fieldName) => {
      //       if (fieldName.startsWith("component_")) {
      //         const componentId = allValues[fieldName];
      //         const options = Object.keys(allValues).map((note) => {
      //           if (
      //             note.startsWith("productComponent_") &&
      //             allValues[note] !== null &&
      //             allValues[note] !== undefined
      //           ) {
      //             if (note.includes(componentId)) {
      //               console.log("Da co include");
      //             }
      //             console.log("allValues[note]", note);
      //             return allValues[note];
      //           }
      //         });
      //         const data = {
      //           componentId: componentId,
      //           note: options.note,
      //           noteImageFiles: options.image,
      //         };
      //         console.log("options: ", options);
      //         return data;
      //       }
      //       return null;
      //     })
      //     .filter(Boolean),
      formData.append("ProductTemplateId", backendData.productTemplateId);
      formData.append("OrderId", backendData.orderId);
      formData.append("Name", backendData.name);
      formData.append("MaterialId", backendData.materialId);
      formData.append("ProfileId", backendData.profileId);
      formData.append("Note", backendData.note);
      formData.append(
        "ProductComponents",
        backendData.productComponents.forEach((component, index) => {
          console.log("component form data", component);
          formData.append(`componentId`, component.id);

          formData.append(`note`, component.note);

          component?.noteImageFiles?.forEach((imageFile, imageIndex) => {
            formData.append(
              `productComponents[${index}][noteImageFiles][${imageIndex}]`,
              imageFile
            );
          });
        })
      );
      for (var p of formData.entries()) {
        console.log("formData", p[0] + " - " + p[1]);
      }

      const checkResult = await onCreateNewProduct(formData);
      if (checkResult === 1) {
        form.resetFields();
        setProductComponent(null);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Chọn hồ sơ số đo phù hợp cho sản phẩm",
        showConfirmButton: false,
        timer: 4500,
        zIndex: 1000,
      });
    }
  };

  const steps = [
    {
      title: "Thông tin khách hàng",
      content: (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <div>
              <div
                style={{
                  width: 600,
                  padding: 30,
                  borderRadius: "10px",
                }}
              >
                <div style={{ marginLeft: 100 }}>
                  <Title level={4}>
                    <FileSearchOutlined /> Tìm kiếm thông tin khách hàng
                  </Title>
                  <Text>
                    Nhập email hoặc số điện thoại để tìm kiếm thông tin khách
                    hàng
                  </Text>
                  <div style={{ marginTop: 10 }}>
                    <div style={{ position: "relative" }}>
                      <Select
                        showSearch
                        value={searchInfo}
                        style={{ width: 350 }}
                        defaultActiveFirstOption={false}
                        showArrow={false}
                        filterOption={false}
                        onChange={async (value) => {
                          const urlGetDetail = `https://e-tailorapi.azurewebsites.net/api/customer-management/info/${value}`;
                          try {
                            const response = await fetch(urlGetDetail, {
                              method: "GET",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${manager?.token}`,
                              },
                            });
                            if (response.ok && response.status === 200) {
                              const responseData = await response.json();
                              setSaveCustomer((prev) => {
                                if (prev && prev.id !== responseData.id) {
                                  setSaveOrderId(null);
                                  setGetDetailDataProfileCustomer(null);
                                  setChooseProductTemplate(null);
                                  setProductComponent(null);
                                  return responseData;
                                } else {
                                  return responseData;
                                }
                              });
                              await Swal.fire({
                                position: "top-center",
                                icon: "success",
                                title: "Đã xác nhận khách hàng!",
                                showConfirmButton: false,
                                timer: 1500,
                              });
                              setSearchInfo(responseData.fullname);
                            } else if (response.status === 401) {
                              localStorage.removeItem("manager");
                              navigate("/management/login");
                            }
                          } catch (error) {
                            console.error("Error calling API:", error);
                          }
                        }}
                        onSearch={(value) => handleSearchInfoCustomer(value)}
                        notFoundContent={null}
                        options={(searchResult || []).map((d) => ({
                          value: d.id,
                          label: `${d.fullname} - ${d.phone}`,
                        }))}
                      />
                      <SearchOutlined
                        style={{
                          fontSize: 18,
                          position: "absolute",
                          right: 100,
                          top: 7,
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  border: "1px solid #9F78FF",
                  width: 600,
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <Form
                  layout="vertical"
                  form={form}
                  name="create_customer"
                  initialValues={{ modifier: "create_customer" }}
                >
                  <Form.Item
                    name="fullname"
                    label="Họ và tên"
                    rules={[
                      {
                        required: true,
                        message: "Họ và tên không được để trống",
                      },
                    ]}
                    style={{ width: 525 }}
                  >
                    <Input placeholder={"Nhập họ và tên"} />
                  </Form.Item>
                  <Form.Item
                    name="address"
                    label="Địa chỉ"
                    rules={[
                      {
                        required: true,
                        message: "Địa chỉ không được để trống",
                      },
                    ]}
                    style={{ width: 525 }}
                  >
                    <Input placeholder={"Nhập địa chỉ"} />
                  </Form.Item>
                  <Row>
                    <Col span={11}>
                      <Form.Item
                        name="email"
                        label="Email"
                        style={{ width: 240 }}
                      >
                        <Input placeholder={"Nhập email"} />
                      </Form.Item>
                    </Col>
                    <Col span={11} push={2}>
                      <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[
                          {
                            required: true,
                            message: "Số điện thoại không được để trống",
                          },
                        ]}
                        style={{ width: 240 }}
                      >
                        <Input placeholder={"Nhập số điện thoại"} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item style={{ textAlign: "center" }}>
                    <Button type="primary" htmlType="submit">
                      Tạo mới
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Chi tiết đơn hàng",
      content: (
        <>
          <Row style={{ marginTop: 24 }}>
            <Col
              span={18}
              push={6}
              style={{
                height: 490,
              }}
            >
              {orderPaymentDetail?.unPaidMoney !== 0 && (
                <>
                  <Title level={4}>Phương thức thanh toán</Title>

                  <Row gutter={16} justify="center">
                    <Col span={6}>
                      <Card
                        style={{
                          width: 200,
                          cursor: "pointer",
                          border: active === 1 ? "1px solid #9F78FF" : "",
                          color: active === 1 ? "white" : "",
                          textAlign: "center",
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
                          }).then((result) => {
                            if (result.isConfirmed) {
                              Swal.fire({
                                position: "top-center",
                                icon: "warning",
                                title: "Chờ xác nhận",
                                showConfirmButton: false,
                                timer: 1500,
                              });
                              handleCreatePayCash(
                                orderPaymentDetail?.unPaidMoney,
                                0,
                                "VN Pay"
                              );
                            } else if (result.isDenied) {
                              Swal.fire("Changes are not saved", "", "info");
                            }
                          });
                        }}
                      >
                        <img
                          src={paymenVnpay}
                          style={{ width: 50, height: 50 }}
                        />
                        <Title level={5}>Thanh toán vnpay</Title>
                      </Card>
                    </Col>

                    <Col span={6}>
                      <Card
                        style={{
                          border: active === 2 ? "1px solid #9F78FF" : "",
                          cursor: "pointer",
                          color: active === 2 ? "white" : "",
                          textAlign: "center",
                          width: 200,
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
                          }).then((result) => {
                            if (result.isConfirmed) {
                              Swal.fire("Saved!", "", "success");
                              handleCreatePayCash(
                                orderPaymentDetail?.unPaidMoney,
                                0,
                                "Offline"
                              );
                            } else if (result.isDenied) {
                              Swal.fire("Changes are not saved", "", "info");
                            }
                          });
                        }}
                      >
                        <img
                          src={paymenCash}
                          style={{ width: 50, height: 50 }}
                        />
                        <Title level={5}>Thanh toán tiền mặt</Title>
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card
                        style={{
                          border: active === 3 ? "1px solid #9F78FF" : "",
                          cursor: "pointer",
                          color: active === 3 ? "white" : "",
                          textAlign: "center",
                          width: 200,
                        }}
                        bodyStyle={{ padding: 0, marginTop: 10 }}
                        onClick={() => setActive(active === 3 ? null : 3)}
                      >
                        <img
                          src={paymenDeposit}
                          style={{ width: 50, height: 50 }}
                        />
                        <Title level={5}>Trả tiền cọc</Title>
                      </Card>
                    </Col>
                  </Row>
                  <Divider />
                </>
              )}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Title level={4}>Danh sách sản phẩm</Title>
                <Button onClick={() => setCurrent(2)}>Thêm sản phẩm</Button>
              </div>
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
            </Col>
            <Col
              span={5}
              pull={18}
              style={{
                height: 490,
                border: "1px solid #9F78FF",
                borderRadius: "5px",
                padding: 15,
                overflowY: "scroll",
                scrollbarWidth: "none",
                WebkitScrollbar: "none",
              }}
            >
              {orderPaymentDetail !== null ? (
                <>
                  <div>
                    <Title level={4}>Thông tin khách hàng</Title>
                    <div style={{ marginTop: 24 }}>
                      <Text>
                        <b>Họ và tên:</b>
                        &nbsp; {orderPaymentDetail?.customer?.fullname}
                      </Text>
                    </div>
                    <div style={{ marginTop: 5 }}>
                      {orderPaymentDetail?.customer?.phone !== null ? (
                        <Text>
                          <b>Số điện thoại:</b>
                          &nbsp; {orderPaymentDetail?.customer?.phone}
                        </Text>
                      ) : (
                        <Text>
                          <b>Email:</b>
                          &nbsp; {orderPaymentDetail?.customer?.email}
                        </Text>
                      )}
                    </div>
                  </div>
                  <Divider />
                  <div>
                    <Title level={4}>Thông tin đơn hàng</Title>
                    <div style={{ marginTop: 24 }}>
                      <Text>
                        <b>Mã đơn:</b>
                        &nbsp; {orderPaymentDetail?.id}
                      </Text>
                    </div>
                    <div style={{ marginTop: 5 }}>
                      <Text>
                        <b>Tổng sản phẩm:</b>
                        &nbsp;{" "}
                        {orderPaymentDetail?.totalProduct !== 0
                          ? orderPaymentDetail?.totalProduct
                          : 0}
                      </Text>
                    </div>
                  </div>
                  <Divider />
                  <div>
                    <Title level={4}>Áp dụng mã</Title>
                    <div style={{ marginTop: 10 }}>
                      <Search
                        placeholder="Mã giảm giá"
                        allowClear
                        enterButton="Kiểm tra"
                        onSearch={(value) => handleCheckDiscount(value)}
                        loading={loadingDiscount}
                      />
                    </div>
                  </div>
                  <Divider />
                  <div>
                    {orderPaymentDetail?.discountCode !== "" ? (
                      <>
                        <Text>
                          Tổng cộng: &nbsp;
                          <b>
                            <Text>
                              {formatCurrency(orderPaymentDetail?.totalPrice)}
                            </Text>
                          </b>
                        </Text>
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
                              -
                              {formatCurrency(
                                orderPaymentDetail?.discountPrice
                              )}
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
                      </>
                    ) : (
                      <Title level={4}>
                        Tổng cộng: &nbsp;
                        <b>{formatCurrency(orderPaymentDetail?.totalPrice)}</b>
                      </Title>
                    )}
                  </div>
                  <Divider />
                  <div>
                    {orderPaymentDetail?.payDeposit === false ? (
                      <>
                        <Search
                          placeholder="Số tiền cọc"
                          allowClear
                          enterButton="Thanh toán"
                        />
                      </>
                    ) : (
                      <Title level={4}>
                        Tổng cộng: &nbsp;
                        <b>{formatCurrency(orderPaymentDetail?.totalPrice)}</b>
                      </Title>
                    )}
                  </div>
                  <Divider />
                  <div>
                    <Text level={4}>
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
                    <Text level={4}>
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
                    <Text level={4}>
                      Còn lại:{" "}
                      {orderPaymentDetail?.unPaidMoney !== null &&
                      orderPaymentDetail?.unPaidMoney > 0 ? (
                        <b>{formatCurrency(orderPaymentDetail?.unPaidMoney)}</b>
                      ) : (
                        <b>0đ</b>
                      )}
                    </Text>
                  </div>
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
      ),
    },
    {
      title: "Thông tin sản phẩm",
      content: (
        <>
          <Row>
            <Col
              flex="1 1 100px"
              style={{
                height: 500,
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
                          loading={loading}
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
                                <Paragraph>
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
                                    key={product?.id}
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
                                            <Select.Option
                                              value={item.id}
                                              key={item.id}
                                            >
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
                                            </Select.Option>
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
                                                    listType="picture"
                                                    accept=".png,.jpeg,.jpg"
                                                    beforeUpload={(file) => {
                                                      console.log(
                                                        "file image: ",
                                                        file
                                                      );
                                                      return false;
                                                    }}
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
                                                      <div>Upload</div>
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
                                                style={{ fontSize: 18 }}
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
                          <Form.Item
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Button
                              type="primary"
                              htmlType="submit"
                              onClick={onFinish}
                            >
                              Tạo sản phẩm
                            </Button>
                          </Form.Item>
                        </Form>
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
                    Xác định{" "}
                    <span
                      style={{
                        color: "#9F78FF",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                      onClick={() => setOpenChooseProductTemplate(true)}
                    >
                      loại đồ
                    </span>{" "}
                    mà bạn muốn
                  </Typography.Title>
                </div>
              )}
            </Col>
            <Col
              flex="0 1 500px"
              style={{
                height: 500,
                marginTop: 15,
                backgroundColor: "rgba(213,197,255,0.2)",
                borderRadius: 10,
                marginLeft: 10,
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
                        form={form}
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
                          <Button type="primary" htmlType="submit">
                            Cập nhật
                          </Button>
                        </Form.Item>
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
      ),
    },
  ];

  console.log(dataForProduct);
  const [current, setCurrent] = useState(0);
  const next = async () => {
    if (current === 0) {
      await handleDataOrderDetail();
    } else if (current === 1) {
      handleDelayNext();
      return;
    }
    setCurrent(current + 1);
  };
  const prev = () => {
    if (current === 1) {
      console.log("prev", current);
    }
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  return (
    <>
      <Steps current={current} items={items} />
      <div>{steps[current]?.content}</div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "24px",
        }}
      >
        {current < steps.length - 1 && current === 0 && (
          <Button type="primary" onClick={() => next()}>
            Tiếp theo
          </Button>
        )}
        {current === 1 && (
          <Button
            type="primary"
            onClick={async () => {
              const urlCreateNew = `https://e-tailorapi.azurewebsites.net/api/order/finish/${saveOrderId}`;
              try {
                const response = await fetch(`${urlCreateNew}`, {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${manager?.token}`,
                  },
                });

                if (response.ok && response.status === 200) {
                  const responseData = await response.text();
                  navigate("/manager/orders");
                } else if (response.status === 400 || response.status === 500) {
                  const responseData = await response.text();
                }
              } catch (error) {
                console.error("Error calling API:", error);
              }
              return;
            }}
          >
            Tạo đơn
          </Button>
        )}
        {current > 0 && (
          <Button
            style={{
              margin: "0 8px",
            }}
            onClick={() => prev()}
          >
            Quay lại
          </Button>
        )}
      </div>
    </>
  );
};

function OrderToCustomer() {
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
        <OrderToCustomerHeader />
      </div>
      <div
        className="manager-content"
        style={{
          height: "83vh",
          overflowY: "scroll",
          border: "1px solid #9F78FF",
        }}
      >
        <OrderToCustomerContent />
      </div>
    </div>
  );
}

export default OrderToCustomer;
