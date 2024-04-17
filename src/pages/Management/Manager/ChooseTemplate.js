import React, { useState, useEffect } from "react";

import { Typography, Card, Form, Modal, Input, Select, Image } from "antd";
import "./index.css";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";

import chooseTemplate from "../../../assets/dress.png";
import toast from "react-hot-toast";

const { Title } = Typography;
const { Meta } = Card;

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
    if (selected) {
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
              toast.error("Chọn loại bản mẫu thì phải chọn bản mẫu", {
                duration: 4000,
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
                  setSelected((prev) => {
                    if (prev !== value) {
                      setActiveIndex(null);
                      return value;
                    } else {
                      return prev;
                    }
                  });
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
                          description={
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.description}
                            </div>
                          }
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

export default ChooseTemplate;
