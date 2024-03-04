import React, { useState, useEffect, useRef } from "react";
import { Breadcrumb } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  CloseOutlined,
  SearchOutlined,
  FileSearchOutlined,
  IdcardOutlined,
  PhoneOutlined,
  GlobalOutlined,
  CheckSquareOutlined,
  CloseSquareOutlined,
  UploadOutlined,
  PayCircleOutlined,
  ArrowDownOutlined,
  DollarOutlined,
  InfoCircleOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import {
  Typography,
  Button,
  message,
  Steps,
  Divider,
  Flex,
  Card,
  Row,
  Col,
  InputNumber,
  Form,
  Space,
  Modal,
  Avatar,
  Input,
  List,
  Select,
  Image,
  Upload,
  Statistic,
  Table,
  Radio,
  Popover,
} from "antd";
import "./index.css";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import CircularProgress from "@mui/material/CircularProgress";
import paymenVnpay from "../../../assets/payment-method-vnpay.png";
import paymenMomo from "../../../assets/payment-method-momo.png";
import paymenCash from "../../../assets/money.png";
import paymenDeposit from "../../../assets/deposit.png";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useQuery } from "react-query";

const { Search } = Input;
const { Title, Text } = Typography;
const { Meta } = Card;

const manager = JSON.parse(localStorage.getItem("manager"));

const OrderToCustomerHeader = () => {
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
    const urlTemplateType = `https://etailorapi.azurewebsites.net/api/template/${value}/component-types`;
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
            console.log("backendData", backendData);
            const checkResult = await onCreateNewProduct(backendData);

            if (checkResult === 1) {
              console.log("Chay vo day roi ne`");
              form.resetFields();
              setProductComponent(null);
            }
            console.log("Chay toi day roi ne`:", open);

            console.log("Chay toi day roi ne` 1");
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
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
                    <Image width={35} src={productTemplate.thumbnailImage} />
                    &nbsp; &nbsp;
                    <Title level={5}>{productTemplate.name}</Title>
                  </div>
                </Select.Option>
              ))
            )}
          </Select>
        </Form.Item>
        {productComponent &&
          productComponent.map((component) => {
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
    </Modal>
  );
};

const OrderToCustomerContent = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  //-----------------------------------------Thử làm cách mới--------------------------------------------------

  const [active, setActive] = useState(0);

  //-------------------------------------------------Modal thêm mới khách hàng--------------------------------------------------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const onCreate = async (values) => {
    const urlCreateNew = `https://etailorapi.azurewebsites.net/api/customer-management`;
    try {
      const response = await fetch(`${urlCreateNew}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Tạo mới thành công",
          showConfirmButton: false,
          timer: 1500,
        });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };
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
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <Radio.Group
    //         onChange={(e) => handleCheckMaterial(e, record)}
    //         value={record.radioValue}
    //       >
    //         <Radio value={1}>Đã có vải</Radio>
    //         <Radio value={2} className="mt-2">
    //           Chưa có vải
    //         </Radio>
    //       </Radio.Group>
    //     </Space>
    //   ),
    // },
  ];

  //---------------------------------------------------Lưu orderId-----------------------------------------------------------------
  const [saveCustomer, setSaveCustomer] = useState(null);
  useEffect(() => {
    const handleSaveOrder = () => {
      const urlCreateNew = `https://etailorapi.azurewebsites.net/api/order`;
      try {
        fetch(`${urlCreateNew}`, {
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
          }
        });
      } catch (error) {
        console.error("Error calling API:", error);
      }
    };
    if (saveCustomer) {
      handleSaveOrder();
    }
  }, [saveCustomer]);
  //---------------------------------------------------Xử lý logic bước 1----------------------------------------------------------
  const [searchInfo, setSearchInfo] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchInfoCustomer = async (value) => {
    setSearchInfo(value);
  };

  useEffect(() => {
    let timer;

    const fetchData = async () => {
      const urlSearchIfo = `https://etailorapi.azurewebsites.net/api/customer-management`;
      try {
        setIsLoading(true);
        const response = await fetch(`${urlSearchIfo}?search=${searchInfo}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${manager?.token}`,
          },
        });

        if (response.ok) {
          const responseData = await response.json();
          setSaveCustomer(null);
          setSearchResult(responseData);
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
  const [componentTypes, setComponentTypes] = useState([]);
  const [material, setMaterial] = useState([]);
  const [open, setOpen] = useState(false);
  // const saveOrderId = useRef(null);
  const [saveOrderId, setSaveOrderId] = useState(null);
  const urlProductTemplate =
    "https://etailorapi.azurewebsites.net/api/template-management/get-all-template";
  const urlGetAllMaterial = "https://etailorapi.azurewebsites.net/api/material";
  const urlOrderDetail = saveOrderId
    ? `https://etailorapi.azurewebsites.net/api/product/order/${saveOrderId}`
    : "";

  const { data: orderForProduct, refetch: OrderForProduct } = useQuery(
    "get-order-for-customer",
    () =>
      fetch(urlOrderDetail, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      }).then((response) => response.json())
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
  const onCreateNewProduct = async (values) => {
    const urlCreateNew = `https://etailorapi.azurewebsites.net/api/product/${saveOrderId}`;
    try {
      const response = await fetch(`${urlCreateNew}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
        body: JSON.stringify(values),
      });

      if (response.ok && response.status === 200) {
        const responseData = await response.text();
        console.log("Tao moi san pham: ", responseData);
        await Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Tạo mới thành công",
          showConfirmButton: false,
          timer: 1500,
          zIndex: 1000,
        });
        OrderForProduct();
        setOpen(false);
        return 1;
      } else if (response.status === 400 || response.status === 500) {
        const responseData = await response.text();
        Swal.fire({
          position: "top-center",
          icon: "error",
          title: responseData,
          showConfirmButton: false,
          timer: 1500,
          zIndex: 1000,
        });
        return 0;
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  const handleCreatePayCash = async (amount, payType, platform) => {
    const urlCreateNew = `https://etailorapi.azurewebsites.net/api/payment/${saveOrderId}?amount=${amount}&payType=${payType}&platform=${platform}`;
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
        handleDataOrderDetail();
        console.log("Thanh toan thanh cong");
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
      const urlProfile = `https://etailorapi.azurewebsites.net/api/profile-body/staff/customer/${saveCustomer.id}`;
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
          console.log("response", responseData);
          setProfileCustomer(responseData);
        }
      } catch (error) {
        console.error("Error calling API:", error);
      }
    };
    if (saveCustomer) {
      fetchData();
    }
  }, [saveCustomer]);

  //------------------------------------------------------------Api xử lý bước 3--------------------------------------------
  const [orderDetail, setOrderDetail] = useState(null);
  const [orderPaymentDetail, setOrderPaymentDetail] = useState(null);

  useEffect(() => {
    console.log("orderDetail nay co khong?", orderDetail);
    const fetchData = async () => {
      const urlOrderDetail = `https://etailorapi.azurewebsites.net/api/product/order/${saveOrderId}/${saveCustomer.id}`;
      try {
        const response = await fetch(`${urlOrderDetail}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${manager?.token}`,
          },
        });

        if (response.ok) {
          const responseData = await response.json();
          setOrderDetail(responseData);
        }
      } catch (error) {
        console.error("Error calling API:", error);
      }
    };

    if (saveOrderId !== null && saveCustomer) {
      fetchData();
    }
  }, [saveOrderId]);
  const handleDataOrderDetail = async () => {
    const urlOrderDetail = `https://etailorapi.azurewebsites.net/api/order/${saveOrderId}`;
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
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };
  const handleCheckDiscount = async (value) => {
    const urlOrderDetail = `https://etailorapi.azurewebsites.net/api/discount/order/${saveOrderId}/discount/${value}`;
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
            }}
          >
            <div
              style={{
                width: 500,
                marginTop: 24,
                height: 460,
                padding: 30,
                borderRadius: "10px",
              }}
            >
              <Title level={4}>
                <FileSearchOutlined /> Tìm kiếm thông tin khách hàng
              </Title>
              <Text>Nhập email để tìm kiếm thông tin khách hàng</Text>
              <Search
                placeholder="Nhập số email"
                size="large"
                style={{ marginTop: 15 }}
                value={searchInfo}
                onChange={(e) => handleSearchInfoCustomer(e.target.value)}
              />
              {isLoading ? (
                <div
                  style={{
                    marginTop: 24,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "300px",
                    border: "1px solid #D4D4D4",
                    borderRadius: 5,
                  }}
                >
                  <CircularProgress />
                </div>
              ) : (
                <div
                  style={{
                    marginTop: 24,
                    height: 300,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "1px solid #D4D4D4",
                    borderRadius: 5,
                  }}
                >
                  {searchResult?.length !== 0 ? (
                    <>
                      <div
                        style={{
                          height: 250,
                          overflowY:
                            searchResult?.length > 1 && saveCustomer === null
                              ? "scroll"
                              : "hidden",
                        }}
                      >
                        {saveCustomer ? (
                          <Card
                            style={{
                              width: 300,
                              marginTop: 70,
                              border: "1px solid #9F78FF",
                              cursor: "pointer",
                            }}
                          >
                            <Meta
                              avatar={
                                saveCustomer?.avatar !== "" ? (
                                  <div>
                                    <Avatar
                                      src={saveCustomer?.avatar}
                                      size={"large"}
                                    />
                                  </div>
                                ) : (
                                  <div>
                                    <Avatar
                                      src="https://api.dicebear.com/7.x/miniavs/svg?seed=3"
                                      size={"large"}
                                    />
                                  </div>
                                )
                              }
                              title={
                                saveCustomer?.fullname === null
                                  ? saveCustomer?.email
                                  : saveCustomer?.fullname
                              }
                              description={
                                <Popover
                                  content={
                                    <>
                                      <div className="mt-2">
                                        <Text>
                                          <b>
                                            <IdcardOutlined /> Họ và tên:
                                          </b>
                                          &nbsp; {saveCustomer?.fullname}
                                        </Text>
                                      </div>
                                      <div className="mt-2">
                                        <Text>
                                          <b>
                                            <UserOutlined /> Tên người dùng:
                                          </b>
                                          &nbsp; {saveCustomer?.username}
                                        </Text>
                                      </div>
                                      <div className="mt-2">
                                        <Text>
                                          <b>
                                            <PhoneOutlined /> Email:
                                          </b>
                                          &nbsp; {saveCustomer?.email}
                                        </Text>
                                      </div>
                                      <div className="mt-2">
                                        <Text>
                                          <b>
                                            <GlobalOutlined /> Địa chỉ:
                                          </b>
                                          &nbsp; {saveCustomer?.address}
                                        </Text>
                                      </div>
                                    </>
                                  }
                                  title="Thông tin chi tiết"
                                  trigger="hover"
                                >
                                  <Button>Xem thêm</Button>
                                </Popover>
                              }
                            />
                          </Card>
                        ) : (
                          searchResult?.map((item) => {
                            return (
                              <Card
                                key={item.email}
                                style={{
                                  width: 300,
                                  marginTop:
                                    searchResult?.length === 1 ? 70 : 16,
                                  border: "1px solid #9F78FF",
                                  cursor: "pointer",
                                }}
                                onClick={async () => {
                                  const urlGetDetail = `https://etailorapi.azurewebsites.net/api/customer-management/info/${item.id}`;
                                  try {
                                    const response = await fetch(
                                      `${urlGetDetail}`,
                                      {
                                        method: "GET",
                                        headers: {
                                          "Content-Type": "application/json",
                                          Authorization: `Bearer ${manager?.token}`,
                                        },
                                      }
                                    );

                                    if (
                                      response.ok &&
                                      response.status === 200
                                    ) {
                                      const responseData =
                                        await response.json();
                                      setSaveCustomer(responseData);
                                      await Swal.fire({
                                        position: "top-center",
                                        icon: "success",
                                        title: "Lưu thành công",
                                        showConfirmButton: false,
                                        timer: 1500,
                                      });
                                      setCurrent(current + 1);
                                    }
                                  } catch (error) {
                                    console.error("Error calling API:", error);
                                  }
                                }}
                              >
                                <Meta
                                  avatar={
                                    item?.avatar !== "" ? (
                                      <div>
                                        <Avatar
                                          src={item?.avatar}
                                          size={"large"}
                                        />
                                      </div>
                                    ) : (
                                      <div>
                                        <Avatar
                                          src="https://api.dicebear.com/7.x/miniavs/svg?seed=3"
                                          size={"large"}
                                        />
                                      </div>
                                    )
                                  }
                                  title={
                                    item?.fullname === null
                                      ? item?.email
                                      : item?.fullname
                                  }
                                  description={
                                    <Popover
                                      content={
                                        <>
                                          <div className="mt-2">
                                            <Text>
                                              <b>
                                                <IdcardOutlined /> Họ và tên:
                                              </b>
                                              &nbsp; {item?.fullname}
                                            </Text>
                                          </div>
                                          <div className="mt-2">
                                            <Text>
                                              <b>
                                                <UserOutlined /> Tên người dùng:
                                              </b>
                                              &nbsp; {item?.username}
                                            </Text>
                                          </div>
                                          <div className="mt-2">
                                            <Text>
                                              <b>
                                                <PhoneOutlined /> Email:
                                              </b>
                                              &nbsp; {item?.email}
                                            </Text>
                                          </div>
                                          <div className="mt-2">
                                            <Text>
                                              <b>
                                                <GlobalOutlined /> Địa chỉ:
                                              </b>
                                              &nbsp; {item?.address}
                                            </Text>
                                          </div>
                                        </>
                                      }
                                      title="Thông tin chi tiết"
                                      trigger="hover"
                                    >
                                      <Button>
                                        <InfoCircleOutlined /> Xem thêm
                                      </Button>
                                    </Popover>
                                  }
                                />
                              </Card>
                            );
                          })
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <Text strong>
                        Không tìm thấy khách hàng! &nbsp;
                        <b
                          level={4}
                          onClick={showModal}
                          style={{
                            fontSize: "18px",
                            color: "#9F78FF",
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                        >
                          Tạo mới
                        </b>
                      </Text>
                      <Modal
                        open={isModalOpen}
                        style={{ top: 75 }}
                        title="Thêm mới khách hàng"
                        okText="Tạo mới"
                        cancelText="Hủy bỏ"
                        onCancel={() => {
                          form.resetFields();
                          setCheckValid(0);
                          setIsModalOpen(false);
                        }}
                        onOk={() => {
                          form
                            .validateFields()
                            .then((values) => {
                              form.resetFields();
                              onCreate(values);
                            })
                            .catch((info) => {
                              console.log("Validate Failed:", info);
                            });
                        }}
                      >
                        <Form
                          style={{
                            height: 400,
                            overflowY: "scroll",
                            scrollbarWidth: "none",
                            WebkitScrollbar: "none",
                            marginTop: 24,
                          }}
                          form={form}
                          layout="vertical"
                          name="form_in_modal"
                          initialValues={{
                            modifier: "public",
                          }}
                        >
                          <Form.Item
                            name="fullname"
                            label="Họ và tên"
                            hasFeedback
                            rules={[
                              {
                                required: true,
                                message: "Họ và tên không được để trống",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                          <Form.Item
                            hasFeedback
                            name="username"
                            label="Tên người dùng"
                            rules={[
                              {
                                required: true,
                                message: "Tên người dùng không được để trống",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>

                          {checkValid === 2 ? (
                            <Form.Item className="mt-2" label="Email">
                              <Input disabled />
                            </Form.Item>
                          ) : (
                            <Form.Item
                              className="mt-2"
                              hasFeedback
                              name="email"
                              label="Email"
                              rules={[
                                {
                                  required: true,
                                  message: "Email không được để trống",
                                },
                              ]}
                            >
                              <Input
                                onChange={(e) => {
                                  const check = e.target.value;
                                  if (check !== "") {
                                    setCheckValid(1);
                                  } else {
                                    setCheckValid(0);
                                  }
                                }}
                              />
                            </Form.Item>
                          )}

                          {checkValid === 1 ? (
                            <Form.Item label="Số điện thoại">
                              <Input disabled />
                            </Form.Item>
                          ) : (
                            <Form.Item
                              name="phone"
                              label="Số điện thoại"
                              hasFeedback
                              rules={[
                                {
                                  required: true,
                                  message: "Số điện thoại không được để trống",
                                },
                                {
                                  pattern: /^[0-9]{10}$/,
                                  message: "Số điện thoại phải là 10 số",
                                },
                              ]}
                            >
                              <Input
                                onChange={(e) => {
                                  const check = e.target.value;
                                  if (check !== "") {
                                    setCheckValid(2);
                                  } else {
                                    setCheckValid(0);
                                  }
                                }}
                              />
                            </Form.Item>
                          )}
                        </Form>
                      </Modal>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Chọn kiểu bản mẫu",
      content: (
        <>
          <div>
            <Divider orientation="left">
              <Title level={3}>Sản phẩm đã tạo</Title>
            </Divider>
            <div
              style={{
                width: 1270,
                height: 435,
                backgroundColor: "#f5f5f5",
                padding: 10,
                overflowY: "scroll",
              }}
            >
              {orderForProduct?.length > 0 ? (
                <>
                  <div style={{ textAlign: "center" }}>
                    <Button
                      type="primary"
                      onClick={() => {
                        setOpen(true);
                      }}
                      style={{ textAlign: "center" }}
                    >
                      Thêm sản phẩm
                    </Button>
                  </div>

                  <Row gutter={[16, 24]} style={{ marginTop: 10 }}>
                    {orderForProduct.map((item) => {
                      return (
                        <Col className="gutter-row" span={6}>
                          <Card
                            hoverable
                            style={{
                              width: 240,
                            }}
                            cover={
                              <img
                                alt="thumbnail product"
                                src={item.templateThumnailImage}
                              />
                            }
                          >
                            <Meta title={item.name} />
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>
                </>
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Text style={{ fontSize: "24px" }}>
                    Chưa có sản phẩm đã tạo nào! &nbsp;
                    <Button
                      type="primary"
                      onClick={() => {
                        setOpen(true);
                      }}
                    >
                      Tạo mới sản phẩm
                    </Button>
                  </Text>
                </div>
              )}
            </div>
            <CreateNewProductModal
              open={open}
              onCreateNewProduct={onCreateNewProduct}
              productTemplateId={productTemplateId}
              onCancel={() => {
                setOpen(false);
              }}
              profileCustomer={profileCustomer}
              saveOrderId={saveOrderId}
              materialId={materialId}
            />
          </div>
        </>
      ),
    },
    {
      title: "Thanh toán",
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
                        onClick={() => setActive(active === 1 ? null : 1)}
                      >
                        <img
                          src={paymenVnpay}
                          style={{ width: 50, height: 50 }}
                        />
                        <Title level={5}>Thanh toán vnpay</Title>
                      </Card>
                    </Col>
                    {/* <Col span={6}>
                  <Card
                    style={{
                      border: active === 2 ? "1px solid #9F78FF" : "",
                      cursor: "pointer",
                      color: active === 2 ? "white" : "",
                      textAlign: "center",
                      width: 200,
                    }}
                    bodyStyle={{ padding: 0, marginTop: 10 }}
                    onClick={() => setActive(active === 2 ? null : 2)}
                  >
                    <img src={paymenMomo} style={{ width: 50, height: 50 }} />
                    <Title level={5}>Thanh toán Momo</Title>
                  </Card>
                </Col> */}
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

              <Title level={4}>Thông tin sản phẩm</Title>
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
                        <b>Tổng sản phẩm</b>
                        &nbsp; {orderPaymentDetail?.totalProduct}
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
  ];

  const [current, setCurrent] = useState(0);
  const next = async () => {
    if (current === 1) {
      handleDataOrderDetail();
    } else if (current === 2) {
      const urlCreateNew = `https://etailorapi.azurewebsites.net/api/order/finish/${saveOrderId}`;
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
    }
    setCurrent(current + 1);
  };
  const prev = () => {
    console.log("prev", current);
    if (current === 1) {
      setSaveCustomer(null);
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
        {current < steps.length - 1 && current > 0 && (
          <Button type="primary" onClick={() => next()}>
            Tiếp theo
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
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
