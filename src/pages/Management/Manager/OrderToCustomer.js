import React, { useState, useEffect } from "react";
import OrderUpdate from "./OrderUpdate.js";
import { VnPay } from "../../../components/RealTime/index.js";
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
} from "antd";
import "./index.css";
import CircularProgress from "@mui/material/CircularProgress";
import paymenVnpay from "../../../assets/payment-method-vnpay.png";
import paymenCash from "../../../assets/money.png";
import paymenDeposit from "../../../assets/deposit.png";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useQuery } from "react-query";
import ChooseTemplate from "./ChooseTemplate.js";
import StepOne from "./OrderStepsForCustomer/StepOne.js";
import StepTwo from "./OrderStepsForCustomer/StepTwo.js";

const { Search } = Input;
const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;
const { Option } = Select;

const OrderToCustomerContent = () => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const navigate = useNavigate();
  const vnpayNotification = VnPay();
  const [form] = Form.useForm();
  const [formProfileBody] = Form.useForm();
  const [formInfoCustomer] = Form.useForm();

  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (
      vnpayNotification !== null &&
      vnpayNotification !== undefined &&
      vnpayNotification !== ""
    ) {
      if (vnpayNotification === "False") {
        Swal.fire({
          position: "top-center",
          icon: "error",
          title: "Thanh toán VnPay thất bại!",
          showConfirmButton: false,
        });
      } else if (vnpayNotification === "True") {
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Thanh toán VnPay thành công!",
          showConfirmButton: false,
        });
        handleDataOrderDetail();
      }
    }
  }, [vnpayNotification]);
  //-----------------------------------------Thử làm cách mới--------------------------------------------------

  //---------------------------------------------------Lưu orderId-----------------------------------------------------------------
  const [saveCustomer, setSaveCustomer] = useState(null);
  const [saveOrderId, setSaveOrderId] = useState(null);

  const [createOrderLoading, setCreateOrderLoading] = useState(false);

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
          cusName: saveCustomer.fullname,
          cusPhone: saveCustomer.phone,
          cusEmail: saveCustomer.email,
          cusAddress: saveCustomer.address,
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
    };
    fetchData();
  }, [saveCustomer, saveOrderId]);
  //---------------------------------------------------Xử lý logic bước 1----------------------------------------------------------

  useEffect(() => {
    if (saveCustomer) {
      formInfoCustomer.setFieldsValue({
        modifier: "create_customer",
        fullname: saveCustomer.fullname || "",
        email: saveCustomer.email || "",
        phone: saveCustomer.phone || "",
        address: saveCustomer.address || "",
      });
    }
  }, [saveCustomer]);

  //----------------------------------------------------------------Api xử lý bước 2-------------------------------------------------------------
  const [profileCustomer, setProfileCustomer] = useState(null);
  const urlGetAllMaterial =
    "https://e-tailorapi.azurewebsites.net/api/material";

  const { data: materialId } = useQuery("get-material", () =>
    fetch(urlGetAllMaterial, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${manager?.token}`,
      },
    }).then((response) => response.json())
  );

  const fetchDataProfileBody = async (id) => {
    const urlProfile = `https://e-tailorapi.azurewebsites.net/api/profile-body/staff/customer/${id}`;
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
  useEffect(() => {
    if (saveCustomer) {
      fetchDataProfileBody(saveCustomer.id);
    }
  }, [saveCustomer]);
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
            await handleDataOrderDetail();
            Swal.fire("Đã xóa sản phẩm!", "", "success");
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

  const [loadingStep2, setLoadingStep2] = useState(false);
  const handleDataOrderDetail = async () => {
    setLoadingStep2(true);
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
        return 1;
      } else if (response.status === 401) {
        localStorage.removeItem("manager");
        navigate("/management/login");
      }
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      setLoadingStep2(false);
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

  //-------------------------------------------------------------------Xử lý bước 3 mới----------------------------------------
  const [openChooseProductTemplate, setOpenChooseProductTemplate] =
    useState(false);
  const [productComponent, setProductComponent] = useState(null);
  const [chooseProductTemplate, setChooseProductTemplate] = useState(null);
  const [dataBodySize, setDataBodySize] = useState([]);
  const [onFinishLoading, setOnFinishLoading] = useState(false);
  const [loadingUpdateBodyProfile, setLoadingUpdateBodyProfile] =
    useState(false);
  const [loadingCreateBodyProfile, setLoadingCreateBodyProfile] =
    useState(false);
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
  const [getProfileUpdateCustomer, setGetProfileUpdateCustomer] =
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
      } else if (response.status === 401) {
        localStorage.removeItem("manager");
        navigate("/management/login");
      }
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      setGetDetailDataProfileCustomerLoading(false);
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

  const onCreateNewProduct = async (values) => {
    const urlCreateNew = `https://e-tailorapi.azurewebsites.net/api/product/${saveOrderId}`;
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
        await Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Tạo mới thành công",
          showConfirmButton: false,
          timer: 1500,
          zIndex: 1000,
        });
        const loadingData = await handleDataOrderDetail();
        if (loadingData === 1) {
          setCurrent(1);
        }
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
  const initialProfileBodyValues = {};
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
    getDetailDataProfileCustomer?.bodyAttributes?.forEach((component) => {
      initialProfileBodyValues[`bodySizes_${component.bodySize.id}`] =
        component.value;
    });

    formProfileBody.setFieldsValue({
      nameProfile: getDetailDataProfileCustomer?.name,
      ...initialProfileBodyValues,
    });
  }, [getDetailDataProfileCustomer]);
  const filterOptionForMaterial = (input, option) =>
    (option?.title ?? "")
      .toString()
      .trim()
      .toLowerCase()
      .includes(input.toLowerCase());

  const onFinish = async () => {
    setOnFinishLoading(true);
    if (!chooseProductTemplate) {
      Swal.fire({
        icon: "error",
        title: "Chọn loại bản mẫu trước",
        showConfirmButton: false,
        timer: 4500,
        zIndex: 1000,
      });
      setOnFinishLoading(false);
    } else if (getDetailDataProfileCustomer) {
      const allValues = form.getFieldsValue();
      const backendData = {
        orderId: saveOrderId,
        name: allValues.name,
        productTemplateId: chooseProductTemplate.id,
        materialId: allValues.materialId,
        productComponents: Object.keys(allValues)
          .map((fieldName) => {
            if (fieldName.startsWith("productComponent_")) {
              const productComponent = allValues[fieldName];
              let note;
              let noteImageFiles;
              if (productComponent) {
                note = productComponent[0]?.note;
                noteImageFiles = productComponent[0]?.image?.fileList.map(
                  (image) => ({
                    base64String: image.thumbUrl,
                    fileName: image.name,
                    type: image.type,
                  })
                );
              }
              const componentId =
                allValues[fieldName.replace("productComponent_", "component_")];
              return { componentId: componentId, note, noteImageFiles };
            }
            return null;
          })
          .filter(Boolean),
        profileId: getDetailDataProfileCustomer.id,
        note: allValues.note ? allValues.note : "",
      };
      const checkResult = await onCreateNewProduct(backendData);
      if (checkResult === 1) {
        setProductComponent(null);
        form.resetFields();
        formProfileBody.resetFields();
        setGetDetailDataProfileCustomer(null);
        setChooseProductTemplate(null);
        setProductComponent(null);
        setOnFinishLoading(false);
      } else {
        setOnFinishLoading(false);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Chọn hồ sơ số đo phù hợp cho sản phẩm",
        showConfirmButton: false,
        timer: 4500,
        zIndex: 1000,
      });
      setOnFinishLoading(false);
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
          await Swal.fire({
            position: "top-center",
            icon: "success",
            title: responseData,
            showConfirmButton: false,
            timer: 1500,
            zIndex: 1000,
          });
          await fetchDataProfileBody(saveCustomer.id);
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
      } finally {
        setLoadingUpdateBodyProfile(false);
      }
    }
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
          await Swal.fire({
            position: "top-center",
            icon: "success",
            title: responseData,
            showConfirmButton: false,
            timer: 1500,
            zIndex: 1000,
          });
          await fetchDataProfileBody(saveCustomer.id);
          formProfileBody.resetFields();
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
      } finally {
        setLoadingCreateBodyProfile(false);
      }
    });
  };

  //----------------------------------------------------------------Cập nhật sản phẩm--------------------------------------------

  const [openUpdate, setOpenUpdate] = useState(false);
  const [saveIdProduct, setSaveIdProduct] = useState(null);
  const [formUpdate] = Form.useForm();
  const [formUpdateProfile] = Form.useForm();
  const handleCheckUpdateProduct = async (id) => {
    await setSaveIdProduct(id);
    setOpenUpdate(true);
    setCurrent(2);
  };
  const handleUpdateProduct = async () => {
    const urlUpdate = `https://e-tailorapi.azurewebsites.net/api/product/${saveOrderId}/${saveIdProduct}`;
    setOnFinishLoading(true);
    if (getProfileUpdateCustomer) {
      const allValues = formUpdate.getFieldsValue();
      const backendData = {
        id: saveIdProduct,
        orderId: saveOrderId,
        name: allValues.name,
        productTemplateId: allValues.productTemplateId,
        materialId: allValues.materialId,
        productComponents: Object.keys(allValues)
          .map((fieldName) => {
            if (fieldName.startsWith("productComponent_")) {
              const productComponent = allValues[fieldName];
              let note;
              let noteImageFiles = [];
              let noteImageObjects = [];
              if (productComponent) {
                note = productComponent[0]?.note;
                productComponent[0]?.image?.fileList?.map((image) =>
                  image.url
                    ? noteImageObjects.push(image.url)
                    : noteImageFiles.push({
                        base64String: image.thumbUrl,
                        fileName: image.name,
                        type: image.type,
                      })
                );
              }
              const componentId =
                allValues[fieldName.replace("productComponent_", "component_")];
              return {
                componentId: componentId,
                note,
                noteImageFiles,
                noteImageObjects,
              };
            }
            return null;
          })
          .filter(Boolean),
        profileId: getProfileUpdateCustomer.id,
        note: allValues.note ? allValues.note : "",
      };
      const checkResult = await (async () => {
        try {
          const response = await fetch(`${urlUpdate}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${manager?.token}`,
            },
            body: JSON.stringify(backendData),
          });
          if (response.ok && response.status === 200) {
            await Swal.fire({
              position: "top-center",
              icon: "success",
              title: "Cập nhật thành công",
              showConfirmButton: false,
              timer: 1500,
              zIndex: 1000,
            });
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
      })();
      if (checkResult === 1) {
        setCurrent(1);
        formUpdate.resetFields();
        const check = await handleDataOrderDetail();
        if (check === 1) {
          setOnFinishLoading(false);
        }
      } else {
        setOnFinishLoading(false);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Chọn hồ sơ số đo phù hợp cho sản phẩm",
        showConfirmButton: false,
        timer: 4500,
        zIndex: 1000,
      });
      setOnFinishLoading(false);
    }
  };

  const steps = [
    {
      title: "Thông tin khách hàng",
      content: (
        <>
          <StepOne
            setSaveCustomer={setSaveCustomer}
            setSaveOrderId={setSaveOrderId}
            formInfoCustomer={formInfoCustomer}
            setGetDetailDataProfileCustomer={setGetDetailDataProfileCustomer}
            setChooseProductTemplate={setChooseProductTemplate}
            setProductComponent={setProductComponent}
            form={form}
            saveCustomer={saveCustomer}
          />
        </>
      ),
    },
    {
      title: "Chi tiết đơn hàng",
      content: (
        <>
          <StepTwo
            setCurrent={setCurrent}
            setOpenUpdate={setOpenUpdate}
            orderPaymentDetail={orderPaymentDetail}
            loadingStep2={loadingStep2}
            saveOrderId={saveOrderId}
            handleDataOrderDetail={handleDataOrderDetail}
            formatCurrency={formatCurrency}
            handleDeleteProduct={handleDeleteProduct}
            handleCheckUpdateProduct={handleCheckUpdateProduct}
          />
        </>
      ),
    },
    {
      title: "Thông tin sản phẩm",
      content: (
        <>
          {!openUpdate ? (
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
                                    message:
                                      "Tên sản phẩm không được để trống!",
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
                                    message:
                                      "Tên sản phẩm không được để trống!",
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
                                        <Image
                                          width={35}
                                          src={material.image}
                                        />
                                        &nbsp; &nbsp;
                                        <Title
                                          level={5}
                                          style={{ marginTop: 6 }}
                                        >
                                          {material.name}
                                        </Title>
                                      </div>
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                              <Form.Item
                                label="Ghi chú"
                                name="note"
                                hasFeedback
                              >
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
                                                        beforeUpload={(
                                                          file
                                                        ) => {
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
                                                              overflow:
                                                                "hidden",
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
                                                            alignItems:
                                                              "center",
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
              handleChooseTemplate={handleChooseTemplate}
              formUpdate={formUpdate}
              formUpdateProfile={formUpdateProfile}
              getDetailDataProfileCustomer={getProfileUpdateCustomer}
              setGetDetailDataProfileCustomer={setGetProfileUpdateCustomer}
              saveCustomer={saveCustomer}
              getAllBodySize={getAllBodySize}
              fetchDataProfileBody={fetchDataProfileBody}
            />
          )}
          <ChooseTemplate
            open={openChooseProductTemplate}
            onCancel={() => setOpenChooseProductTemplate(false)}
            handleChooseTemplate={handleChooseTemplate}
          />
        </>
      ),
    },
  ];

  const next = async () => {
    if (current === 0) {
      if (saveCustomer || saveOrderId) {
        const check = await handleDataOrderDetail();
        if (check === 1) {
          setCurrent(current + 1);
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Vui lòng chọn khách hàng",
          showConfirmButton: false,
          timer: 4500,
          zIndex: 1000,
        });
      }
    } else if (current === 1) {
      handleDelayNext();
      return;
    }
  };
  const prev = () => {
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
          <Button type="primary" onClick={() => next()} loading={loadingStep2}>
            Tiếp theo
          </Button>
        )}
        {current === 1 && (
          <Button
            loading={createOrderLoading}
            type="primary"
            onClick={async () => {
              setCreateOrderLoading(true);
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
                  Swal.fire({
                    icon: "error",
                    title: responseData,
                    showConfirmButton: false,
                    timer: 1500,
                  });
                }
              } catch (error) {
                console.error("Error calling API:", error);
              } finally {
                setCreateOrderLoading(false);
              }
              return;
            }}
          >
            Tạo đơn
          </Button>
        )}
        {current === 2 &&
          (!openUpdate ? (
            <Button
              type="primary"
              style={{
                margin: "0 8px",
              }}
              onClick={onFinish}
              loading={onFinishLoading}
            >
              Tạo sản phẩm
            </Button>
          ) : (
            <Button
              type="primary"
              style={{
                margin: "0 8px",
              }}
              onClick={handleUpdateProduct}
              loading={onFinishLoading}
            >
              Cập nhật sản phẩm
            </Button>
          ))}
        {current > 0 && (
          <Button
            style={{
              margin: "0 8px",
            }}
            onClick={() => prev()}
            loading={onFinishLoading ? onFinishLoading : ""}
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
        className="manager-content"
        style={{
          minHeight: "95vh",
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
