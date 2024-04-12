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
  DeleteOutlined,
  FileDoneOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { Modal, Row, Col, Form, Input, Select, Upload } from "antd";
import "./index.css";

function MaterialConfirm({ open, onCancel }) {
  const [form] = Form.useForm();
  const onConfirmMaterial = (values) => {
    console.log("values", values);
  };
  return (
    <Modal
      open={open}
      style={{ top: 95 }}
      title="Thêm mới số đo cơ thể"
      okText="Tạo mới"
      cancelText="Hủy bỏ"
      onCancel={() => {
        form.resetFields();

        onCancel();
      }}
      onOk={() => {
        form
          .validateFields()
          .then(async (values) => {
            const check = await onConfirmMaterial();
            if (check === 1) {
              form.resetFields();

              onCancel();
            }
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        style={{
          height: 420,
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
        <Row>
          <Col span={12}>
            <div>
              <Form.Item
                label="Số đo từng bộ phận"
                name="bodyPart"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Số đo từng bộ phận không được để trống",
                  },
                ]}
              >
                <Select>
                  <Select.Option value="Đầu">Đầu</Select.Option>
                  <Select.Option value="Thân">Thân</Select.Option>
                  <Select.Option value="Chân">Chân</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                className="mt-2"
                hasFeedback
                name="name"
                label="Tên số đo"
                rules={[
                  {
                    required: true,
                    message: "Tên không được để trống",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
          </Col>
        </Row>
        <Form.Item
          className="mt-2"
          name="guideVideoLink"
          label="Video hướng dẫn"
          hasFeedback
          rules={[
            { required: true, message: "Video hướng dẫn không được để trống" },
            { type: "url", warningOnly: true },
            { type: "string", min: 6 },
          ]}
        >
          <Input placeholder="Nhập đường dẫn" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MaterialConfirm;
