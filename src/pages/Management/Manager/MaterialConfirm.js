import React, { useState, useEffect } from "react";
import { InputNumber, Radio } from "antd";
import {
  FileSearchOutlined,
  SearchOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  EditOutlined,
  LeftOutlined,
  RightOutlined,
  DeleteOutlined,
  FileDoneOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { Modal, Row, Col, Form, Input, Select, Upload } from "antd";
import "./index.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function MaterialConfirm({
  open,
  onCancel,
  saveIdMaterial,
  saveOrderId,
  handleDataOrderDetail,
}) {
  const [form] = Form.useForm();
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const onConfirmMaterial = async (values) => {
    if (saveIdMaterial && saveOrderId) {
      const url = `https://e-tailorapi.azurewebsites.net/order/${saveOrderId}`;
      try {
        const response = await fetch(`${url}`, {
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
            title: responseData,
            showConfirmButton: false,
            timer: 1500,
            zIndex: 1000,
          });
          await handleDataOrderDetail();
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
    }
  };
  return (
    <Modal
      open={open}
      style={{ top: 95 }}
      title="Xác nhận vải"
      okText="Đồng ý"
      cancelText="Hủy bỏ"
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => {
        form
          .validateFields()
          .then(async (values) => {
            if (saveIdMaterial && saveOrderId) {
              const dataBackEnd = {
                materialId: saveIdMaterial,
                isCusMaterial: values.isCusMaterial,
                value: values.value,
                orderId: saveOrderId,
              };
              const check = await onConfirmMaterial(dataBackEnd);
              if (check === 1) {
                form.resetFields();
                onCancel();
              }
            }
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
      okButtonProps={{ loading: loading }}
    >
      <Form
        style={{
          height: 250,
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
          label="Xác nhận vải khách"
          name="isCusMaterial"
          rules={[
            {
              required: "true",
              message: "Xác nhận vải không được để trống",
            },
          ]}
        >
          <Radio.Group>
            <Radio value="true">Vải khách</Radio>
            <Radio value="false">Vải cửa hàng</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Số met yêu cầu"
          name="value"
          rules={[
            {
              required: "true",
              type: "number",
              min: 1,
              max: 100,
              message: `Số met vải không được để trống và phải là số và từ 1 - 100 m`,
            },
          ]}
          step={0.01}
        >
          <InputNumber
            formatter={(value) =>
              `${value}m`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/m\s?|(,*)/g, "")}
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MaterialConfirm;
