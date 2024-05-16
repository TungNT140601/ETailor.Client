import React, { useState, useEffect, memo } from "react";
import { InputNumber } from "antd";
import {
  FileSearchOutlined,
  DeleteOutlined,
  DollarOutlined,
  EditOutlined,
  CheckOutlined,
  EyeOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Typography,
  Button,
  Divider,
  Card,
  Row,
  Col,
  Form,
  Input,
  Image,
  Table,
  Radio,
  Select,
  Spin,
  Popover,
  Modal,
  Segmented,
  Upload,
  message,
} from "antd";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const { Title, Paragraph } = Typography;

export const MaterialComponent = ({ orderPaymentDetail }) => {
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 60,
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Nguyên phụ liệu",
      dataIndex: "name",
      width: 150,
      key: "name",
      ellipsis: true,
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Xác nhận vải",
      dataIndex: "materialConfirm",
      key: "materialConfirm",
      width: 150,
    },
    {
      title: "Số mét vải",
      dataIndex: "value",
      key: "value",
      width: 150,
      fixed: "right",
    },
    {
      title: "Tùy chỉnh",
      dataIndex: "Action",
      key: "Action",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <>
          <Row justify="start">
            <Col span={4}>
              <DeleteOutlined
                style={{
                  backgroundColor: "red",
                  color: "white",
                  padding: 6,
                  borderRadius: "5px",
                  fontSize: 15,
                  cursor: "pointer",
                }}
              />
            </Col>
            <Col span={4} offset={7}>
              <EditOutlined
                style={{
                  backgroundColor: "blue",
                  color: "white",
                  padding: 6,
                  borderRadius: "5px",
                  fontSize: 15,
                  cursor: "pointer",
                }}
              />
            </Col>
          </Row>
        </>
      ),
    },
  ];
  const dataOrderMaterials = orderPaymentDetail?.orderMaterials?.map(
    (item, index) => ({
      id: item.materialId,
      index: index + 1,
      name: item.material.name,
      image: item.material.image,
    })
  );
  return (
    <Table
      columns={columns}
      dataSource={dataOrderMaterials}
      pagination={false}
      scroll={{
        y: 200,
      }}
    />
  );
};

export const ConfirmMaterial = ({ open, onCancel }) => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [selectedOption, setSelectedOption] = useState("Vải có trong cửa hàng");
  const [form] = Form.useForm();
  const [formCreate] = Form.useForm();
  const [loadingMaterial, setLoadingMaterial] = useState(false);
  const [material, setMaterial] = useState([]);
  const [postImage, setPostImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [materialCategory, setMaterialCategory] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleDataMaterial = async () => {
    setLoadingMaterial(true);
    const getMaterialUrl = "https://e-tailorapi.azurewebsites.net/api/material";
    try {
      const response = await fetch(getMaterialUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.json();
        setLoadingMaterial(false);
        setMaterial(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };
  const handleDataMaterialCategory = async () => {
    const getMaterialCategoryUrl =
      "https://e-tailorapi.azurewebsites.net/api/material-category";
    try {
      const response = await fetch(getMaterialCategoryUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.json();
        setMaterialCategory(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };
  useEffect(() => {
    handleDataMaterial();
    handleDataMaterialCategory();
  }, []);
  const getFile = (e) => {
    const file = e.fileList[0];
    if (file && file.originFileObj) {
      setPostImage(file.originFileObj);
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);
      reader.onload = () => {
        setImageUrl(reader.result);
      };
    }
    return e && e.fileList;
  };
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      {loadingImage ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Tải ảnh
      </div>
    </button>
  );

  const onCreate = async (values) => {
    console.log("values trong create", values);
    formCreate.resetFields();
    setImageUrl(null);
    setPostImage(null);
    // const formData = new FormData();
    // formData.append("MaterialCategoryId", values.materialCategoryId);
    // formData.append("Name", values.name);
    // formData.append("ImageFile", values.imageFile);
    // formData.append("Quantity", values.quantity);
    // const urlCreateMaterialType = `https://e-tailorapi.azurewebsites1.net/api/material`;
    // try {
    //   const response = await fetch(urlCreateMaterialType, {
    //     method: "POST",
    //     headers: {
    //       Authorization: `Bearer ${manager?.token}`,
    //     },
    //     body: formData,
    //   });
    //   const responseData = await response.text();
    //   if (response.ok && response.status === 200) {
    //     message.success(responseData);
    //     return 1;
    //   } else if (response.status === 400 || response.status === 500) {
    //     message.error(responseData);
    //     return 0;
    //   }
    // } catch (error) {
    //   console.error("Error calling API:", error);
    // }
  };
  const onChoose = async (values) => {
    console.log("values trong choose", values);
    form.resetFields();
    // const url = `https://e-tailorapi.azurewebsites.net/order/${saveOrderId}`;
    //   try {
    //     const response = await fetch(`${url}`, {
    //       method: "PUT",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${manager?.token}`,
    //       },
    //       body: JSON.stringify(dataBackEnd),
    //     });
    //     if (response.ok && response.status === 200) {
    //       const responseData = await response.text();
    //       toast.success(responseData, {
    //         duration: 3000,
    //       });
    //       await handleDataOrderDetail();
    //       return 1;
    //     } else if (response.status === 400 || response.status === 500) {
    //       const responseData = await response.text();
    //       toast.error(responseData, {
    //         duration: 3000,
    //       });
    //       return 0;
    //     } else if (response.status === 401) {
    //       localStorage.removeItem("manager");
    //       navigate("/management/login");
    //     }
    //   } catch (error) {
    //     console.error("Error calling API:", error);
    //   }
  };
  const filterOptionForMaterial = (input, option) =>
    (option?.title ?? "")
      .toString()
      .trim()
      .toLowerCase()
      .includes(input.toLowerCase());
  return (
    <Modal
      open={open}
      title="Xác định vải cho đơn hàng"
      okText="Xác nhận"
      cancelText="Hủy bỏ"
      okButtonProps={{
        autoFocus: true,
      }}
      onCancel={() => {
        form.resetFields();
        formCreate.resetFields();
        setImageUrl(null);
        setPostImage(null);
        setMaterialCategory(null);
        onCancel();
      }}
      onOk={async () => {
        try {
          console.log("form", form.getFieldsValue());
          console.log("formCreate", formCreate.getFieldsValue());
          if (selectedOption === "Vải có trong cửa hàng") {
            form
              .validateFields()
              .then(async (values) => {
                setConfirmLoading(true);
                const dataBackEndConfirm = {
                  name: values.name,
                  quantity: values.quantity,
                };
                const check = await onChoose(dataBackEndConfirm);
                if (check === 1) {
                  form.resetFields();
                  formCreate.resetFields();
                  onCancel();
                }
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          } else {
            formCreate
              .validateFields()
              .then(async (values) => {
                setConfirmLoading(true);
                console.log("values", values);
                const dataBackEnd = {
                  image: values.image,
                  nameCreate: values.nameCreate,
                  quantityCreate: values.quantityCreate,
                  materialCategoryId: values.materialCategoryId,
                };

                const check = await onCreate(dataBackEnd);
                if (check === 1) {
                  formCreate.resetFields();
                  form.resetFields();
                  onCancel();
                }
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }
        } catch (error) {
          console.log("Failed:", error);
        } finally {
          setConfirmLoading(false);
        }
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Segmented
          options={["Vải có trong cửa hàng", "Vải không có trong cửa hàng"]}
          defaultValue={"Vải có trong cửa hàng"}
          onChange={(value) => {
            if (value === "Vải có trong cửa hàng" && formCreate) {
              formCreate.resetFields();
              setImageUrl(null);
              setPostImage(null);
            } else if (value === "Vải không có trong cửa hàng" && form) {
              form.resetFields();
            }
            setSelectedOption(value);
          }}
        />
      </div>

      {selectedOption === "Vải có trong cửa hàng" ? (
        loadingMaterial ? (
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
          <Form
            layout="vertical"
            form={form}
            name="form_in_modal"
            style={{ marginTop: 24 }}
          >
            <Form.Item
              name="name"
              label="Chọn vải cho đơn hàng"
              rules={[
                {
                  required: true,
                  message: "Chọn vải cho đơn hàng không được để trống",
                },
              ]}
            >
              <Select
                style={{ width: "100%", height: 45 }}
                showSearch
                placeholder="Chọn loại vải"
                optionFilterProp="children"
                filterOption={filterOptionForMaterial}
              >
                {material?.map((material) => (
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
                      <Image width={35} src={material.image} height={35} />
                      &nbsp; &nbsp;
                      <Title level={5} style={{ marginTop: 6 }}>
                        {material.name}
                      </Title>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="quantity"
              label="Số lượng"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Số lượng phải là số và không được để trống",
                },
                {
                  type: "number",
                  min: 1,
                  message: "Số lượng ít nhất là 1",
                },
              ]}
            >
              <InputNumber
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>
          </Form>
        )
      ) : (
        <Form
          layout="vertical"
          form={formCreate}
          name="form_in_modal_create"
          style={{ marginTop: 24 }}
        >
          <Row>
            <Col span={12}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "25px",
                  marginRight: "15px",
                }}
              >
                <Form.Item
                  name="image"
                  getValueFromEvent={getFile}
                  style={{ width: "130px" }}
                  rules={[
                    {
                      required: true,
                      message: "Ảnh nguyên liệu không được để trống",
                    },
                  ]}
                >
                  <Upload
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    listType="picture-card"
                    maxCount={1}
                    showUploadList={false}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="imageMaterial"
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </Form.Item>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <Form.Item
                  name="nameCreate"
                  label="Nguyên phụ liệu"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Nguyên phụ liệu không được để trống",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="quantityCreate"
                  label="Số lượng"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Số lượng phải là số và không được để trống",
                    },
                    {
                      type: "number",
                      min: 1,
                      message: "Số lượng ít nhất là 1",
                    },
                  ]}
                >
                  <InputNumber
                    style={{
                      width: "100%",
                    }}
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Form.Item
            hasFeedback
            label={`Danh mục`}
            name="materialCategoryId"
            rules={[
              {
                required: true,
                message: "Loại vải không được để trống",
              },
            ]}
          >
            <Select style={{ height: 45 }}>
              {materialCategory?.map((item) => {
                return (
                  <Select.Option value={item.id} key={item.id}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Title level={5}>{item.name}</Title>
                    </div>
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};
