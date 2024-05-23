import React, { useEffect, useState } from "react";

import {
  EyeOutlined,
  ArrowLeftOutlined,
  LoadingOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Typography, Table, Form } from "antd";

import {
  Avatar,
  Col,
  Row,
  Modal,
  Divider,
  Tag,
  Image,
  Button,
  Badge,
  Flex,
  Card,
  Popover,
  Collapse,
  Space,
  ConfigProvider,
  message,
  Input,
  Radio,
  Select,
  InputNumber,
} from "antd";
import CircularProgress from "@mui/material/CircularProgress";
import toast from "react-hot-toast";

import Swal from "sweetalert2";

const { Title, Paragraph } = Typography;

export const OrderMaterial = ({
  open,
  onCancel,
  stageId,
  taskId,
  handleViewProductDetail,
  saveIdOrder,
  handleDataOrder,
  materialId,
  detailProductData,
}) => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const getMaterialUrl = `https://e-tailorapi.azurewebsites.net/api/material/order/${saveIdOrder}/fabric`;
  const [loadingMaterial, setLoadingMaterial] = useState(false);
  const [formReset, setFormReset] = useState(0);
  const [loadingCreateOrderMaterial, setLoadingCreateOrderMaterial] =
    useState(false);
  const [material, setMaterial] = useState([]);
  const [form] = Form.useForm();
  console.log("stageId", stageId);
  const onCreate = async () => {
    const values = form.getFieldsValue();
    console.log("values", values);
    const url = `https://e-tailorapi.azurewebsites.net/api/task/${taskId}/stage/${stageId}/material`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
        body: JSON.stringify(values?.materialStages),
      });
      const responseData = await response.text();
      if (response.ok && response.status === 200) {
        message.success(responseData);
        return 1;
      } else if (response.status === 400 || response.status === 500) {
        message.error(responseData);
        return 0;
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };
  console.log("material", material);
  const handleDataMaterial = async () => {
    setLoadingMaterial(true);
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

  const filterOptionForMaterial = (input, option) =>
    (option?.title ?? "")
      .toString()
      .trim()
      .toLowerCase()
      .includes(input.toLowerCase());

  useEffect(() => {
    handleDataMaterial();
  }, []);
  useEffect(() => {
    if (material.orderMaterials && material.orderMaterials.length > 0) {
      if (
        detailProductData.productStages &&
        detailProductData.productStages.length > 0 &&
        detailProductData.productStages.find((item) => item.id === stageId)
          .productStageMaterials.length > 0
      ) {
        const dataUpdateMaterial = detailProductData.productStages.find(
          (item) => item.id === stageId
        );
        if (dataUpdateMaterial) {
          const materialsData = dataUpdateMaterial.productStageMaterials.map(
            (item) => ({
              materialId: item.materialId,
              quantity: item.quantity,
            })
          );

          console.log("dataUpdateMaterial", materialsData);
          form.setFieldsValue({
            materialStages: materialsData,
          });
        }
      } else {
        const defaultMaterial = material.orderMaterials.find(
          (item) => item.id === materialId
        );
        console.log("defaultMaterial", defaultMaterial);
        console.log("material", defaultMaterial);
        if (defaultMaterial) {
          console.log("form", form.getFieldsValue());
          form.setFieldsValue({
            materialStages: [
              {
                materialId: defaultMaterial.id,
                quantity: 0,
              },
            ],
          });
        }
      }
    }
  }, [material]);
  return (
    <>
      <Modal
        open={open}
        title="Thêm mới nguyên phụ liệu cần thiết cho một bước"
        okText="Thêm mới"
        cancelText="Hủy bỏ"
        okButtonProps={{
          autoFocus: true,
          loading: loadingCreateOrderMaterial,
        }}
        onCancel={() => {
          form.resetFields();
          onCancel();
          handleDataMaterial();
        }}
        onOk={async () => {
          try {
            console.log("alo");
            setLoadingCreateOrderMaterial(true);
            const values = await form?.validateFields();
            if (values) {
              const check = await onCreate(values);
              if (check === 1) {
                handleViewProductDetail(taskId);
                handleDataOrder();
                onCancel();
                form.resetFields();
              }
            }
          } catch (error) {
            console.log("Failed:", error);
          } finally {
            setLoadingCreateOrderMaterial(false);
          }
        }}
      >
        {loadingMaterial ? (
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
            style={{ marginTop: 15 }}
          >
            <Form.List name="materialStages">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{
                        display: "flex",
                        marginBottom: 8,
                      }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "materialId"]}
                        rules={[
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              const selectedMaterials =
                                getFieldValue("materialStages") || [];
                              const duplicateValues = selectedMaterials
                                .map((field) => field && field.materialId)
                                .filter((m) => m === value);

                              if (!value) {
                                return Promise.reject(
                                  new Error("Vải không được để trống!")
                                );
                              } else if (duplicateValues.length > 1) {
                                return Promise.reject(
                                  new Error("Vải đã được chọn trước đó!")
                                );
                              }

                              return Promise.resolve();
                            },
                          }),
                        ]}
                      >
                        <Select
                          style={{ height: 45, width: 290 }}
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
                              options: material?.orderMaterials?.map(
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
                                      <Title level={5} style={{ marginTop: 6 }}>
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
                              options: material?.materials?.map((material) => ({
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
                                    <Title level={5} style={{ marginTop: 6 }}>
                                      {material.name}
                                    </Title>
                                  </div>
                                ),
                                value: material.id,
                              })),
                            },
                          ]}
                        ></Select>
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "quantity"]}
                        rules={[
                          {
                            required: true,
                            message: "Số mét sử dụng không được để trống!",
                          },
                          {
                            type: "number",
                            min: 0,
                            message: "Số mét sử dụng phải lớn hơn hoặc bằng 0",
                          },
                        ]}
                      >
                        <InputNumber
                          placeholder="Nhập số met vải"
                          formatter={(value) =>
                            `${value}m`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value.replace(/m\s?|(,*)/g, "")}
                          style={{ width: "100%", height: 45 }}
                          step={0.01}
                          size="large"
                        />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Thêm vải
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        )}
      </Modal>
    </>
  );
};
