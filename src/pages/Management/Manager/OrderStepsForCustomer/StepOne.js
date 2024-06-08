import React, { useState, useEffect, memo } from "react";
import { debounce } from "lodash";

import { FileSearchOutlined, SearchOutlined } from "@ant-design/icons";
import { Typography, Button, Card, Row, Col, Form, Input, Select } from "antd";
import "../index.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";

const { Search } = Input;
const { Title, Text } = Typography;
const { Meta } = Card;
const { Option } = Select;

function StepOne({
  setSaveCustomer,
  setSaveOrderId,
  formInfoCustomer,
  setGetDetailDataProfileCustomer,
  setChooseProductTemplate,
  setProductComponent,
  form,
  saveCustomer,
  setLoadingForm,
}) {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [searchResult, setSearchResult] = useState([]);
  const [searchInfo, setSearchInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [createCustomerLoading, setCreateCustomerLoading] = useState(false);
  const handleCreateInfoCustomer = async () => {
    try {
      const checkForm = await formInfoCustomer.validateFields();
      if (!checkForm) return 0;

      const getAllValues = formInfoCustomer.getFieldsValue();
      const url = `https://e-tailorapi.azurewebsites.net/api/customer-management/staff/customer`;
      setCreateCustomerLoading(true);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
        body: JSON.stringify(getAllValues),
      });

      if (response.ok) {
        const responseData = await response.text();
        toast.success(responseData, { duration: 3000 });
        formInfoCustomer.resetFields();
        return 1;
      } else {
        const errorData = await response.text();
        toast.error(errorData, { duration: 3000 });
        return 0;
      }
    } catch (error) {
      console.error("Error calling API:", error);
      return 0; // or handle the error accordingly
    } finally {
      setCreateCustomerLoading(false);
    }
  };

  const handleSearchInfoCustomer = async (value) => {
    if (!value || !searchInfo) {
      setSearchInfo(value);
      setSearchResult([]);
    } else {
      setSearchInfo(value);
    }
  };
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

  let timeoutId = null;

  const handleInputChange = (fieldName, value) => {
    setSaveCustomer((prevCustomer) => ({
      ...prevCustomer,
      [fieldName]: value,
    }));
  };

  const debouncedHandleInputChange = debounce(handleInputChange, 2000);

  const handleFormInputChange = (fieldName, e) => {
    setLoadingForm(true);
    const { value } = e.target;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      debouncedHandleInputChange(fieldName, value);
    }, 2000);
  };

  return (
    <>
      <Toaster />
      <div
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div>
          <div
            style={{
              width: 800,
              padding: 30,
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div>
              <Title level={4}>
                <FileSearchOutlined /> Tìm kiếm thông tin khách hàng
              </Title>
              <Text>
                Nhập email hoặc số điện thoại để tìm kiếm thông tin khách hàng
              </Text>
              <div style={{ marginTop: 10 }}>
                <div style={{ position: "relative" }}>
                  <Select
                    showSearch
                    value={searchInfo}
                    style={{ width: 450 }}
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
                          if (responseData.length === 0) {
                            setSaveCustomer(null);
                            setSaveOrderId(null);
                            toast.error("Không tìm thấy khách hàng");
                          }
                          setSaveCustomer((prev) => {
                            if (prev && prev.id !== responseData.id) {
                              setSaveOrderId(null);
                              setGetDetailDataProfileCustomer(null);
                              setChooseProductTemplate(null);
                              setProductComponent(null);
                              form.resetFields();
                            }
                            return responseData;
                          });
                          toast.success("Đã xác nhận khách hàng");
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
                      right: 20,
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
              width: 800,
              height: 400,
              padding: 10,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Form
              layout="vertical"
              form={formInfoCustomer}
              name="create_customer"
              initialValues={{ modifier: "create_customer" }}
            >
              <Form.Item
                name="fullname"
                label="Họ và tên"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Họ và tên không được để trống",
                  },
                ]}
                style={{ width: 700 }}
              >
                {!saveCustomer ? (
                  <Input placeholder={"Nhập họ và tên"} />
                ) : (
                  <Input
                    placeholder={"Nhập họ và tên"}
                    // readOnly={saveCustomer ? true : false}
                    onChange={(e) => handleFormInputChange("fullname", e)}
                  />
                )}
              </Form.Item>
              <Form.Item
                name="address"
                label="Địa chỉ"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Địa chỉ không được để trống",
                  },
                ]}
                style={{ width: 700 }}
              >
                {!saveCustomer ? (
                  <Input placeholder={"Nhập địa chỉ"} />
                ) : (
                  <Input
                    placeholder={"Nhập địa chỉ"}
                    // readOnly={saveCustomer ? true : false}
                    onChange={(e) => handleFormInputChange("address", e)}
                  />
                )}
              </Form.Item>
              <Row>
                <Col span={11}>
                  <Form.Item
                    name="email"
                    label="Email"
                    style={{ width: 320 }}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Email không được để trống",
                      },
                    ]}
                  >
                    {!saveCustomer ? (
                      <Input placeholder={"Nhập email"} />
                    ) : (
                      <Input
                        placeholder={"Nhập email"}
                        // readOnly={saveCustomer ? true : false}
                        onChange={(e) => handleFormInputChange("email", e)}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={11} push={2}>
                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Số điện thoại không được để trống",
                      },
                    ]}
                    style={{ width: 320 }}
                  >
                    {!saveCustomer ? (
                      <Input placeholder={"Nhập số điện thoại"} />
                    ) : (
                      <Input
                        placeholder={"Nhập số điện thoại"}
                        // readOnly={saveCustomer ? true : false}
                        onChange={(e) => handleFormInputChange("phone", e)}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              {!saveCustomer && (
                <Form.Item style={{ textAlign: "center" }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => handleCreateInfoCustomer()}
                  >
                    Tạo mới
                  </Button>
                </Form.Item>
              )}
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(StepOne);
