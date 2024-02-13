import React, { useState } from "react";
import { Breadcrumb } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Typography, Table, Checkbox } from "antd";
import "./index.css";

import { Input } from "antd";
import { Button } from "antd";
import { Image } from "antd";
import { Avatar, Col, Row, Modal, Form, Upload, InputNumber } from "antd";
import CircularProgress from "@mui/material/CircularProgress";

import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useQuery } from "react-query";

const { Search } = Input;
const { Title, Text } = Typography;

const manager = JSON.parse(localStorage.getItem("manager"));
console.log("manager", manager);

const ManagementBodySizeHeader = () => {
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
              href: "#",
              title: <HomeOutlined />,
            },
            {
              href: "/manager/body-size",
              title: (
                <>
                  <Link to="/manager/body-size">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "#9F78FF",
                      }}
                    >
                      <UserOutlined fontSize="small" />
                      &nbsp;
                      <span>Số đo cơ thể</span>
                    </div>
                  </Link>
                </>
              ),
            },
          ]}
        />
        <Title level={4}>Số đo cơ thể</Title>
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

const ManagementBodySizeContent = () => {
  const getUrl = "https://etailorapi.azurewebsites.net/api/body-size";

  const { data: bodySize, isLoading: loading } = useQuery("get-body-size", () =>
    fetch(getUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${manager?.token}`,
      },
    }).then((response) => response.json())
  );

  const columns = [
    {
      title: "STT",
      width: 50,
      dataIndex: "stt",
      key: "index",
      fixed: "left",
    },
    {
      title: "Hình ảnh",
      width: 150,
      dataIndex: "image",
      key: "image",
      render: (_, record) => (
        <Image
          width={40}
          height={30}
          style={{ objectFit: "contain" }}
          src={record.image}
        />
      ),
    },
    {
      title: "Số đo từng bộ phận",
      dataIndex: "BodyPart",
      key: "1",
      width: 150,
    },
    {
      title: "Tên cơ thể",
      dataIndex: "name",
      key: "2",
      width: 150,
    },
    {
      title: "Clip hướng dẫn",
      dataIndex: "GuideVideoLink",
      key: "3",
      width: 150,
      render: (_, record) => (
        <>
          <Button type="link" title="Video hướng dẫn">
            <a href={record.GuideVideoLink}>Nhấn vào để xem</a>
          </Button>
        </>
      ),
    },
    {
      title: "Giá trị tối thiểu (cm)",
      dataIndex: "MinValidValue",
      key: "4",
      width: 150,
    },
    {
      title: "Giá trị tối đa (cm)",
      dataIndex: "MaxValidValue",
      key: "5",
      width: 150,
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "6",
      width: 100,
      fixed: "right",
      render: () => (
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
      ),
    },
  ];

  const getApi = bodySize?.map((item, index) => ({
    stt: index + 1,
    name: item.name,
    BodyPart: item.bodyPart,
    GuideVideoLink: item.guideVideoLink,
    MinValidValue: item.minValidValue,
    MaxValidValue: item.maxValidValue,
  }));

  // const data = [];
  // for (let i = 0; i < 100; i++) {
  //   data.push({
  //     stt: i,
  //     name: `Edward ${i}`,
  //     BodyPart: `${i}`,
  //     address: `London Park no. ${i}`,
  //     MinValidValue: `${i}`,
  //     MaxValidValue: `${i}`,
  //   });
  // }

  //------------------------------------------------------------Modal create-------------------------------------------------------
  const [open, setOpen] = useState(false);
  const onCreate = (values) => {
    console.log("Received values of form: ", values);
    setOpen(false);
  };

  const defaultCheckedList = columns.map((item) => item.key);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const options = columns.map(({ key, title }) => ({
    label: title,
    value: key,
  }));
  const newColumns = columns.map((item) => ({
    ...item,
    hidden: !checkedList.includes(item.key),
  }));
  return (
    <>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Checkbox.Group
              value={checkedList}
              options={options}
              onChange={(value) => {
                setCheckedList(value);
              }}
            />
          </div>
          <Row justify="start" style={{ paddingRight: "24px" }}>
            <Col span={4}>
              <Button>Tổng cộng ({bodySize?.length})</Button>
            </Col>
            <Col span={4} offset={10}>
              <Button
                onClick={() => {
                  setOpen(true);
                }}
              >
                Thêm mới <PlusOutlined />
              </Button>
              <CollectionCreateForm
                open={open}
                onCreate={onCreate}
                onCancel={() => {
                  setOpen(false);
                }}
              />
            </Col>
          </Row>
        </div>
        {loading ? (
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
        ) : (
          <Table
            columns={newColumns}
            dataSource={getApi}
            pagination={{
              position: ["bottomCenter"],
            }}
            style={{
              marginTop: 24,
            }}
          />
        )}
      </div>
    </>
  );
};

const CollectionCreateForm = ({ open, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const getFile = (e) => {
    console.log(e);
    const file = e.fileList[0];
    if (file && file.originFileObj) {
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
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  return (
    <Modal
      open={open}
      style={{ top: 65 }}
      title="Thêm mới số đo cơ thể"
      okText="Tạo mới"
      cancelText="Hủy bỏ"
      onCancel={() => {
        form.resetFields();
        setImageUrl(null);
        onCancel();
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
          height: 500,
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
                name="bodyPart"
                label="Số đo từng bộ phận"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Số đo từng bộ phận không được để trống",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                hasFeedback
                name="bodyIndex"
                label="Chỉ số cơ thể"
                rules={[
                  {
                    required: true,
                    message: "Chỉ số cơ thể không được để trống",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
          </Col>
          <Col span={12}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "25px",
              }}
            >
              <Form.Item
                name="image"
                getValueFromEvent={getFile}
                style={{ width: "130px" }}
                rules={[
                  {
                    required: true,
                    message: "Ảnh không được để trống",
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
                      alt="avatar"
                      style={{
                        width: "100%",
                      }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Form.Item>
            </div>
          </Col>
        </Row>
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
        <Row>
          <Col span={12}>
            <Form.Item
              hasFeedback
              className="mt-2"
              label="Giá trị tối thiểu (cm)"
              name="minValidValue"
              rules={[
                {
                  required: true,
                  message: "Giá trị tối thiểu (cm) không được để trống",
                },
                {
                  type: "number",
                  min: 1,
                  message: "Phải là một số lớn hơn hoặc bằng 1",
                },
              ]}
            >
              <InputNumber style={{ width: 220 }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              hasFeedback
              className="mt-2 ml-4"
              label="Giá trị tối đa (cm)"
              name="maxValidValue"
              rules={[
                {
                  required: true,
                  message: "Giá trị tối đa (cm) không được để trống",
                },
                {
                  type: "number",
                  min: 1,
                  message: "Phải là một số lớn hơn hoặc bằng 1",
                },
              ]}
            >
              <InputNumber style={{ width: 220 }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

function ManagementBodySize() {
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
        <ManagementBodySizeHeader />
      </div>
      <div
        className="manager-content"
        style={{
          height: "83vh",
          overflowY: "scroll",
          border: "1px solid #9F78FF",
        }}
      >
        <ManagementBodySizeContent />
      </div>
    </div>
  );
}

export default ManagementBodySize;
