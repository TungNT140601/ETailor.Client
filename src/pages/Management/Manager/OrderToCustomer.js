import React, { useState, useEffect, useCallback } from "react";

import { Button, Steps, Form } from "antd";
import "./index.css";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import StepOne from "./OrderStepsForCustomer/StepOne.js";
import StepTwo from "./OrderStepsForCustomer/StepTwo.js";
import StepThree from "./OrderStepsForCustomer/StepThree.js";
import toast, { Toaster } from "react-hot-toast";

const OrderToCustomerContent = () => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [formProfileBody] = Form.useForm();
  const [formInfoCustomer] = Form.useForm();

  const [current, setCurrent] = useState(0);

  //-----------------------------------------Thử làm cách mới--------------------------------------------------

  //---------------------------------------------------Lưu orderId-----------------------------------------------------------------
  const [saveCustomer, setSaveCustomer] = useState(null);
  const [saveOrderId, setSaveOrderId] = useState(null);
  const [discountForOrder, setDiscountForOrder] = useState(null);

  const [createOrderLoading, setCreateOrderLoading] = useState(false);

  const [loadingForm, setLoadingForm] = useState(false);

  const getDiscountForOrder = async () => {
    if (saveOrderId) {
      const url = `https://e-tailorapi.azurewebsites.net/api/discount/order/${saveOrderId}`;
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
          setDiscountForOrder(responseData);
        } else if (response.status === 401) {
          localStorage.removeItem("manager");
          navigate("/management/login");
        }
      } catch (error) {
        console.error("Error calling API:", error);
      }
    }
  };

  const handleSaveOrder = async () => {
    const urlCreateNew = `https://e-tailorapi.azurewebsites.net/api/order`;

    try {
      const response = await fetch(urlCreateNew, {
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
      });

      if (response.ok && response.status === 200) {
        const responseData = await response.text();
        setSaveOrderId(responseData);
        return true;
      } else if (response.status === 401) {
        localStorage.removeItem("manager");
        navigate("/management/login");
        return false;
      }
    } catch (error) {
      console.error("Error calling API:", error);
      return false;
    }
  };

  const handleDelayNext = () => {
    setTimeout(() => {
      setCurrent((prevCurrent) => prevCurrent + 1);
    }, 2000);
  };

  useEffect(() => {
    const saveOrderAsync = async () => {
      if (saveCustomer) {
        const check = await handleSaveOrder();
        if (check) {
          setLoadingForm(false);
        }
      }
    };
    saveOrderAsync();
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
        if (saveOrderId) {
          const urlDeleteProduct = `https://e-tailorapi.azurewebsites.net/api/product/${saveOrderId}/${id}`;
          try {
            const response = await fetch(`${urlDeleteProduct}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${manager?.token}`,
              },
            });
            if (response.ok && response.status === 200) {
              const check = await handleDataOrderDetail();
              if (check === 1) {
                toast.success("Đã xóa sản phẩm!");
              }
            } else if (response.status === 401) {
              localStorage.removeItem("manager");
              navigate("/management/login");
            }
          } catch (error) {
            console.error("Error calling API:", error);
          }
        }
      }
    });
  };
  //------------------------------------------------------------Api xử lý bước 3--------------------------------------------
  const [orderPaymentDetail, setOrderPaymentDetail] = useState(null);

  const [loadingStep2, setLoadingStep2] = useState(false);

  const handleDataOrderDetail = async () => {
    setLoadingStep2(true);
    if (saveOrderId) {
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

  const [productComponent, setProductComponent] = useState(null);
  const [chooseProductTemplate, setChooseProductTemplate] = useState(null);
  const [dataBodySize, setDataBodySize] = useState([]);
  const [onFinishLoading, setOnFinishLoading] = useState(false);

  const [getDetailDataProfileCustomer, setGetDetailDataProfileCustomer] =
    useState(null);
  const [getProfileUpdateCustomer, setGetProfileUpdateCustomer] =
    useState(null);

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
  const [inputValue, setInputValue] = useState(1);
  const onChange = (newValue) => {
    setInputValue(newValue);
  };
  const onCreateNewProduct = async (values) => {
    const urlCreateNew = `https://e-tailorapi.azurewebsites.net/api/product/${saveOrderId}?quantity=${inputValue}`;
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
        toast.success("Tạo mới thành công");
        setCurrent(1);
        getDiscountForOrder();
        await handleDataOrderDetail();
        return 1;
      } else if (response.status === 400 || response.status === 500) {
        const responseData = await response.text();
        toast.error(responseData);
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

  const onFinish = async () => {
    if (!chooseProductTemplate) {
      toast.error("Chọn loại bản mẫu trước", {
        duration: 5000,
      });
      setOnFinishLoading(false);
    } else if (getDetailDataProfileCustomer) {
      try {
        const validate = await form.validateFields();
        console.log("allValues cua buoc 3", validate);
        setOnFinishLoading(true);
        if (validate) {
          console.log("allValues vo if", validate);
          const allValues = await form.getFieldsValue();
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
                    allValues[
                      fieldName.replace("productComponent_", "component_")
                    ];
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
            setInputValue(1);
          } else {
            setOnFinishLoading(false);
          }
        }
      } catch (error) {
        console.error("Validation failed:", error);
        console.log("Validation error fields:", error.errorFields);
      } finally {
        setOnFinishLoading(false);
      }
    } else {
      toast.error("Chọn hồ sơ số đo phù hợp cho sản phẩm", {
        duration: 4000,
      });
      setOnFinishLoading(false);
    }
  };

  //----------------------------------------------------------------Cập nhật sản phẩm--------------------------------------------

  const [openUpdate, setOpenUpdate] = useState(false);
  const [saveIdProduct, setSaveIdProduct] = useState(null);
  const [formUpdate] = Form.useForm();

  const handleCheckUpdateProduct = async (id) => {
    await setSaveIdProduct(id);
    setOpenUpdate(true);
    setCurrent(2);
  };
  const handleUpdateProduct = async () => {
    const urlUpdate = `https://e-tailorapi.azurewebsites.net/api/product/${saveOrderId}/${saveIdProduct}`;

    if (getProfileUpdateCustomer) {
      try {
        const validate = await formUpdate.validateFields();
        if (validate) {
          setOnFinishLoading(true);
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
                  console.log("productComponent", productComponent);
                  let note;
                  let noteImageFiles = [];
                  let noteImageObjects = [];
                  if (productComponent) {
                    note = productComponent[0]?.note;
                    if (productComponent[0]?.image?.fileList) {
                      productComponent[0]?.image?.fileList?.map((image) =>
                        image.url
                          ? noteImageObjects.push(image.url)
                          : noteImageFiles.push({
                              base64String: image.thumbUrl,
                              fileName: image.name,
                              type: image.type,
                            })
                      );
                    } else {
                      productComponent[0]?.image?.map((image) =>
                        noteImageObjects.push(image.url)
                      );
                    }
                  }
                  const componentId =
                    allValues[
                      fieldName.replace("productComponent_", "component_")
                    ];
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
                toast.success("Cập nhật thành công");
                return 1;
              } else if (response.status === 400 || response.status === 500) {
                const responseData = await response.text();
                toast.error(responseData);
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
            getDiscountForOrder();
            const check = await handleDataOrderDetail();
            if (check === 1) {
              setOnFinishLoading(false);
            }
          } else {
            setOnFinishLoading(false);
          }
        }
      } catch (error) {
        console.error("Validation failed:", error);
        console.log("Validation error fields:", error.errorFields);
        // Optionally, provide feedback to the user about which fields need attention
      } finally {
        setOnFinishLoading(false);
      }
    } else {
      toast.error("Chọn hồ sơ số đo phù hợp cho sản phẩm", {
        duration: 2000,
      });
      setOnFinishLoading(false);
    }
  };
  const [loadingDiscount, setLoadingDiscount] = useState(false);
  const [saveDiscount, setSaveDiscount] = useState(null);
  const handleCheckDiscount = async (value) => {
    const urlOrderDetail = `https://e-tailorapi.azurewebsites.net/api/discount/order/${saveOrderId}/discount?code=${value}`;
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
        toast.success(responseData, {
          duration: 3000,
        });
        setLoadingDiscount(false);
        handleDataOrderDetail();
        setSaveDiscount(value);
      } else if (response.status === 400 || response.status === 500) {
        toast.error(responseData, {
          duration: 3000,
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
  const steps = [
    {
      title: "Thông tin khách hàng",
      content: (
        <>
          <StepOne
            saveOrderId={saveOrderId}
            setSaveCustomer={setSaveCustomer}
            setSaveOrderId={setSaveOrderId}
            formInfoCustomer={formInfoCustomer}
            setGetDetailDataProfileCustomer={setGetDetailDataProfileCustomer}
            setChooseProductTemplate={setChooseProductTemplate}
            setProductComponent={setProductComponent}
            form={form}
            saveCustomer={saveCustomer}
            setLoadingForm={setLoadingForm}
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
            discountForOrder={discountForOrder}
            loadingDiscount={loadingDiscount}
            saveDiscount={saveDiscount}
            handleCheckDiscount={handleCheckDiscount}
          />
        </>
      ),
    },
    {
      title: "Thông tin sản phẩm",
      content: (
        <>
          <StepThree
            chooseProductTemplate={chooseProductTemplate}
            setChooseProductTemplate={setChooseProductTemplate}
            setProductComponent={setProductComponent}
            openUpdate={openUpdate}
            form={form}
            initialComponentValues={initialComponentValues}
            setGetDetailDataProfileCustomer={setGetDetailDataProfileCustomer}
            getDetailDataProfileCustomer={getDetailDataProfileCustomer}
            formProfileBody={formProfileBody}
            fetchDataProfileBody={fetchDataProfileBody}
            saveCustomer={saveCustomer}
            dataBodySize={dataBodySize}
            productComponent={productComponent}
            profileCustomer={profileCustomer}
            saveOrderId={saveOrderId}
            saveIdProduct={saveIdProduct}
            formUpdate={formUpdate}
            getProfileUpdateCustomer={getProfileUpdateCustomer}
            setGetProfileUpdateCustomer={setGetProfileUpdateCustomer}
            getAllBodySize={getAllBodySize}
            inputValue={inputValue}
            setInputValue={setInputValue}
            onChange={onChange}
          />
        </>
      ),
    },
  ];

  const next = async () => {
    if (current === 0) {
      if (saveCustomer && saveOrderId) {
        const check = await handleDataOrderDetail();
        if (check === 1) {
          setCurrent(current + 1);
        }
      } else {
        toast.error("Vui lòng chọn khách hàng");
      }
    } else if (current === 1) {
      handleDelayNext();
      return;
    }
  };
  const prev = () => {
    if (saveIdProduct) {
      formUpdate.resetFields();
      setSaveIdProduct(null);
    } else {
      setProductComponent(null);
      form.resetFields();
      formProfileBody.resetFields();
      setGetDetailDataProfileCustomer(null);
      setChooseProductTemplate(null);
      setProductComponent(null);
      setOnFinishLoading(false);
      setInputValue(1);
    }
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  return (
    <>
      <Toaster />
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
          <Button
            type="primary"
            onClick={() => next()}
            loading={loadingStep2}
            disabled={!saveOrderId || loadingForm}
            style={{ color: "white" }}
          >
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
