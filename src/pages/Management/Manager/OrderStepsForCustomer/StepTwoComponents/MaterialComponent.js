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

const { Title, Paragraph, Text } = Typography;

export const MaterialComponent = ({
  orderPaymentDetail,
  saveOrderId,
  handleDataOrderDetail,
}) => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [formMaterial] = Form.useForm();
  const [materialLoading, setMaterialLoading] = useState(false);

  const onConfirmMaterial = async () => {
    const getFieldMaterial = formMaterial.getFieldsValue();
    console.log("getFieldMaterial", getFieldMaterial);
    if (saveOrderId) {
      const dataBackEnd = getFieldMaterial?.itemsMaterial?.map((items) => {
        const { materialConfirm, value, materialId } = items;
        return {
          materialId,
          isCusMaterial: materialConfirm,
          value,
          orderId: saveOrderId,
        };
      });
      setMaterialLoading(true);
      const url = `https://e-tailorapi.azurewebsites.net/api/order-material/order/${saveOrderId}`;
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
          await handleDataOrderDetail();
          return 1;
        } else if (response.status === 400 || response.status === 500) {
          const responseData = await response.text();
          toast.error(responseData, {
            duration: 3000,
          });
          return 0;
        }
      } catch (error) {
        console.error("Error calling API:", error);
      } finally {
        setMaterialLoading(false);
      }
    }
  };

  // const columns = [
  //   {
  //     title: "STT",
  //     dataIndex: "index",
  //     key: "index",
  //     width: 60,
  //     render: (text) => <a>{text}</a>,
  //   },
  //   {
  //     title: "Nguyên phụ liệu",
  //     dataIndex: "name",
  //     width: 150,
  //     key: "name",
  //     ellipsis: true,
  //   },
  //   {
  //     title: "Hình ảnh",
  //     dataIndex: "image",
  //     key: "image",
  //     width: 150,
  //     ellipsis: true,
  //     render: (_, record) => {
  //       return <Image width={35} src={record.image} height={35} />;
  //     },
  //   },
  //   {
  //     title: "Xác nhận vải",
  //     dataIndex: "materialConfirm",
  //     key: "materialConfirm",
  //     width: 150,
  //     render: (_, record) => {
  //       if (record.isCusMaterial) {
  //         return <Text>Vải khách</Text>;
  //       } else {
  //         return <Text>Vải cửa hàng</Text>;
  //       }
  //     },
  //   },
  //   {
  //     title: "Số mét vải",
  //     dataIndex: "value",
  //     key: "value",
  //     width: 150,
  //     fixed: "right",
  //     render: (_, record) =>
  //       productChangePrice[record.id] ? (
  //         <InputNumber
  //           style={{ width: "100%" }}
  //           formatter={(value) =>
  //             `${value}m`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  //           }
  //           parser={(value) => value.replace(/m\s?|(,*)/g, "")}
  //           onChange={(value) => setInputValue(value)}
  //           onBlur={() => handleToggleChangePrice(record.id)}
  //         />
  //       ) : (
  //         <>
  //           <Text onClick={() => handleToggleChangePrice(record.id)}>
  //             {record.value} mét
  //           </Text>
  //         </>
  //       ),
  //   },
  //   {
  //     title: "Tùy chỉnh",
  //     dataIndex: "Action",
  //     key: "Action",
  //     width: 100,
  //     fixed: "right",
  //     render: (_, record) => (
  //       <>
  //         <Row justify="start">
  //           <Col span={4}>
  //             <DeleteOutlined
  //               style={{
  //                 backgroundColor: "red",
  //                 color: "white",
  //                 padding: 6,
  //                 borderRadius: "5px",
  //                 fontSize: 15,
  //                 cursor: "pointer",
  //               }}
  //             />
  //           </Col>
  //         </Row>
  //       </>
  //     ),
  //   },
  // ];
  const dataOrderMaterials = orderPaymentDetail?.orderMaterials?.map(
    (item, index) => ({
      id: item.materialId,
      index: index + 1,
      name: item.material.name,
      image: item.material.image,
      isCusMaterial: item.isCusMaterial,
      value: item.value,
    })
  );
  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      form={formMaterial}
      name="dynamic_form_complex"
      style={{ maxWidth: "100%" }}
      autoComplete="off"
      initialValues={{ items: [{}] }}
    >
      <Form.List name="itemsMaterial">
        {(fields, { add, remove }) => (
          <>
            <Table
              dataSource={dataOrderMaterials}
              pagination={false}
              scroll={{ y: 250 }}
              rowKey={(record) => record.id}
              columns={[
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
                  key: "name",
                },
                {
                  title: "Hình ảnh",
                  dataIndex: "image",
                  key: "image",
                  render: (text) => (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Image width={40} src={text} height={40} />
                    </div>
                  ),
                },
                {
                  title: "Xác nhận vải",
                  dataIndex: "materialConfirm",
                  key: "materialConfirm",
                  render: (_, record, index) => {
                    if (record.isCusMaterial) {
                      return (
                        <Form.Item
                          name={[index, "materialConfirm"]}
                          noStyle
                          initialValue={record.isCusMaterial}
                        >
                          <Text>Vải khách</Text>
                        </Form.Item>
                      );
                    } else {
                      return (
                        <Form.Item
                          name={[index, "materialConfirm"]}
                          noStyle
                          initialValue={record.isCusMaterial}
                        >
                          <Text>Vải cửa hàng</Text>
                        </Form.Item>
                      );
                    }
                  },
                },
                {
                  title: "Số met vải đã nhận",
                  dataIndex: "value",
                  key: "value",
                  render: (_, record, index) => (
                    <>
                      <Form.Item
                        name={[index, "value"]}
                        key={`${record.id}-value`}
                        noStyle
                        initialValue={record?.value}
                        rules={[
                          {
                            required: true,
                            message: "Số mét nhận không được để trống!",
                          },
                          {
                            type: "number",
                            min: 0,
                            message: "Số mét nhận phải lớn hơn hoặc bằng 0",
                          },
                        ]}
                      >
                        <InputNumber
                          disabled={!record?.isCusMaterial}
                          formatter={(value) =>
                            `${value}m`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value.replace(/m\s?|(,*)/g, "")}
                          style={{ width: "100%" }}
                          step={0.01}
                        />
                      </Form.Item>
                      <Form.Item
                        name={[index, "materialId"]}
                        initialValue={record.id}
                        noStyle
                      >
                        <Input type="hidden" />
                      </Form.Item>
                    </>
                  ),
                },
              ]}
            />
            <Form.Item
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                disabled={orderPaymentDetail?.paidMoney > 0}
                type="dashed"
                onClick={() => onConfirmMaterial()}
                block
                style={{ width: 200, marginTop: 10 }}
                loading={materialLoading}
              >
                Cập nhật
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  );
};

export const ConfirmMaterial = ({
  open,
  onCancel,
  handleDataOrderDetail,
  saveOrderId,
}) => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [selectedOption, setSelectedOption] = useState("Vải có trong cửa hàng");
  const [form] = Form.useForm();
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

  const onDefinedMaterial = async (values) => {
    const url = `https://e-tailorapi.azurewebsites.net/api/order-material/order/${saveOrderId}/customer-material`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${manager?.token}`,
        },
        body: values,
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.text();
        message.success(responseData);
        handleDataOrderDetail();
        return 1;
      } else if (response.status === 400 || response.status === 500) {
        const responseData = await response.text();
        message.error(responseData);
        return 0;
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
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
        loading: confirmLoading,
      }}
      onCancel={() => {
        form.resetFields();
        setImageUrl(null);
        setPostImage(null);
        setMaterialCategory(null);
        onCancel();
      }}
      onOk={async () => {
        setConfirmLoading(true);

        try {
          if (selectedOption === "Vải có trong cửa hàng") {
            const values = await form.validateFields();
            const formData = new FormData();

            formData.append("Id", values.name);
            formData.append("Quantity", values.quantity);
            console.log("FormData :", values);

            const check = await onDefinedMaterial(formData);
            if (check === 1) {
              form.resetFields();
              setMaterialCategory(null);
              onCancel();
            }
          } else {
            const values = await form.validateFields();
            const formData = new FormData();

            formData.append("Name", values.nameCreate);
            formData.append("Quantity", values.quantityCreate);
            formData.append("MaterialCategoryId", values.materialCategoryId);
            formData.append("ImageFile", postImage);
            const check = await onDefinedMaterial(formData);
            if (check === 1) {
              form.resetFields();
              setImageUrl(null);
              setPostImage(null);
              setMaterialCategory(null);
              onCancel();
            }
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
          defaultValue="Vải có trong cửa hàng"
          onChange={(value) => {
            setSelectedOption(value);
            form.resetFields();
            setImageUrl(null);
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
              label="Số mét vải nhận"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Số mét vải nhận phải là số và không được để trống",
                },
                {
                  type: "number",
                  min: 1,
                  message: "Số mét vải nhận ít nhất là 1",
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
          form={form}
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
                  label="Số mét vải"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Số mét vải phải là số và không được để trống",
                    },
                    {
                      type: "number",
                      min: 1,
                      message: "Số mét vải ít nhất là 1",
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
