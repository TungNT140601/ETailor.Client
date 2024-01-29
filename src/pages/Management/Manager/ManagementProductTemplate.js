import React, { useState } from "react";
import { Breadcrumb } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  PushpinOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  RollbackOutlined,
  PlusOutlined,
  CloseOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Typography, Carousel } from "antd";
import "./index.css";

import { Input } from "antd";
import { Button, Flex, Divider, Modal } from "antd";
import { Image } from "antd";
import {
  Avatar,
  Card,
  Col,
  Row,
  message,
  Steps,
  theme,
  Form,
  Space,
  Select,
  Upload,
  Radio,
} from "antd";

import CheckroomIcon from "@mui/icons-material/Checkroom";
import Paragraph from "antd/es/skeleton/Paragraph";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const { Search, TextArea } = Input;
const { Title, Text } = Typography;
const { Meta } = Card;
const { Option } = Select;

const manager = JSON.parse(localStorage.getItem("manager"));
console.log("manager", manager);

const ManagementProductTemplateHeader = () => {
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
              href: "/manager",
              title: (
                <>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <CheckroomIcon fontSize="small" />
                    &nbsp;
                    <span>Quản lý bản mẫu</span>
                  </div>
                </>
              ),
            },
            {
              href: "/manager",
              title: (
                <>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <CheckroomIcon fontSize="small" />
                    &nbsp;
                    <span>Bản mẫu</span>
                  </div>
                </>
              ),
            },
          ]}
        />
        <Title level={4}>Bản mẫu</Title>
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
          <UserOutlined
            style={{
              fontSize: "24px",
            }}
          />
          &nbsp; &nbsp;
          <Text>{manager?.name}</Text>
        </div>
      </div>
    </div>
  );
};

export const ManagementCreateProductTemplate = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    console.log(e?.fileList);
    return e?.fileList;
  };
  const normFile1 = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    console.log(e?.fileList);
    return e?.fileList;
  };
  const onFinish = (values) => {
    console.log("Success:", values);
    next();
  };
  const onFinishFailed = (errorInfo) => {
    if (errorInfo?.errorFields[0]?.errors[0] === "Nhập tên bản mẫu") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Nhập tên bản mẫu",
      });
    } else if (errorInfo?.errorFields[0]?.errors[0] === "Chọn loại bản mẫu") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Chọn loại bản mẫu",
      });
    } else if (
      errorInfo?.errorFields[0]?.errors[0] === "Nhập mô tả cho bản mẫu"
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Nhập mô tả cho bản mẫu",
      });
    } else if (errorInfo?.errorFields[0]?.errors[0] === "Hình ảnh bản mẫu") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Hình ảnh bản mẫu",
      });
    }
  };
  //-------------------------------------------------------------step 2----------------------------------------------

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [changeValue, setChangeValue] = useState("");
  const [changeImage, setChangeImage] = useState("");

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    console.log("gia tri ne`", changeValue);
    console.log("hinh anh ne`", changeImage);
    // setIsModalOpen(false);
  };
  const handleChangeImage = ({ changeImage: newFileList }) => {
    setChangeImage(newFileList);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  //--------------------------------------------------------------step 3---------------------------------------------
  const options = [];
  for (let i = 10; i < 36; i++) {
    options.push({
      value: i.toString(36) + i,
      label: i.toString(36) + i,
    });
  }
  const handleChange = (value) => {
    console.log(`Selected: ${value}`);
  };

  //--------------------------------------------------------------step 4---------------------------------------------
  const [form] = Form.useForm();
  const steps = [
    {
      title: "Khởi tạo bản mẫu",
      content: (
        <Row justify="center" style={{ marginTop: 24 }}>
          <Col span={24}>
            <Form
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              style={{
                maxWidth: 1000,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Tên bản mẫu"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Nhập tên bản mẫu",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Chọn loại bản mẫu"
                name="category"
                rules={[
                  {
                    required: true,
                    message: "Chọn loại bản mẫu",
                  },
                ]}
              >
                <Select>
                  <Select.Option value="1">Áo</Select.Option>
                  <Select.Option value="2">Quần</Select.Option>
                  <Select.Option value="3">Áo dài</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Mô tả"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Nhập mô tả cho bản mẫu",
                  },
                ]}
              >
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item
                label="Hình ảnh bản mẫu"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                name="image"
                rules={[
                  {
                    required: true,
                    message: "Hình ảnh bản mẫu",
                  },
                ]}
              >
                <Upload
                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  listType="picture-card"
                  multiple
                >
                  <button
                    style={{
                      border: 0,
                      background: "none",
                    }}
                    type="button"
                  >
                    <PlusOutlined />
                    <div
                      style={{
                        marginTop: 8,
                      }}
                    >
                      Upload
                    </div>
                  </button>
                </Upload>
              </Form.Item>
              <Form.Item
                label="Thumbnail"
                valuePropName="fileList"
                getValueFromEvent={normFile1}
                name="thumbnail"
                rules={[
                  {
                    required: true,
                    message: "Thumbnail",
                  },
                ]}
              >
                <Upload
                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  listType="picture-card"
                  multiple
                  maxCount={1}
                >
                  <button
                    style={{
                      border: 0,
                      background: "none",
                    }}
                    type="button"
                  >
                    <PlusOutlined />
                    <div
                      style={{
                        marginTop: 8,
                      }}
                    >
                      Upload
                    </div>
                  </button>
                </Upload>
              </Form.Item>
              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Button type="primary" htmlType="submit">
                  Tiếp theo
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      ),
    },
    {
      title: "Thông tin cơ bản",
      content: (
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          style={{ minWidth: 240 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Row gutter={[16, 24]} style={{ marginTop: 24, padding: "0 50px" }}>
            <Col span={12}>
              <Title level={3}>1. Cổ áo</Title>

              <Button type="primary" onClick={showModal}>
                Thêm mới thành phần
              </Button>
              <Modal
                title="Basic Modal"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <div>
                  <Typography.Title level={5}>Tên thành phần</Typography.Title>
                  <Input
                    placeholder="Nhập tên"
                    value={changeValue}
                    onChange={(e) => setChangeValue(e.target.value)}
                  />
                </div>
                <div>
                  <Typography.Title level={5}>Hình ảnh</Typography.Title>
                  <Upload
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    listType="picture"
                    maxCount={1}
                    onChange={handleChangeImage}
                  >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                </div>
              </Modal>
            </Col>
            <Col span={12}>
              <Title level={3}>1. Cổ áo</Title>

              <Button type="primary" onClick={showModal}>
                Thêm mới thành phần
              </Button>
              <Modal
                title="Basic Modal"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <div>
                  <Typography.Title level={5}>Tên thành phần</Typography.Title>
                  <Input placeholder="Nhập tên" />
                </div>
                <div>
                  <Typography.Title level={5}>Hình ảnh</Typography.Title>
                  <Upload
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    listType="picture"
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                </div>
              </Modal>
            </Col>
          </Row>
          <Row justify="center" style={{ marginTop: 220 }}>
            <Col span={2}>
              <Form.Item
                wrapperCol={{
                  span: 24,
                }}
              >
                <Button onClick={() => prev()}>Lùi lại</Button>
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item
                wrapperCol={{
                  span: 16,
                }}
              >
                <Button type="primary" onClick={() => next()}>
                  Tiếp theo
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      ),
    },
    {
      title: "Số đo cần thiết",
      content: (
        <>
          <Divider>
            <Title level={4}>Số đo cần thiết của áo</Title>
          </Divider>
          {/* <Radio.Group value={size} onChange={handleSizeChange}>
            <Radio.Button value="large">Large</Radio.Button>
            <Radio.Button value="middle">Default</Radio.Button>
            <Radio.Button value="small">Small</Radio.Button>
          </Radio.Group> */}
          <br />
          <br />
          <Space
            direction="vertical"
            style={{
              width: "100%",
              textAlign: "center",
            }}
          >
            <Select
              mode="multiple"
              placeholder="Please select"
              defaultValue={["a10", "c12"]}
              onChange={handleChange}
              style={{
                width: "80%",
                height: "100px",
              }}
              options={options}
            />
          </Space>

          <Row justify="center" style={{ marginTop: 200 }}>
            <Col span={2}>
              <Button
                style={{
                  margin: "0 8px",
                }}
                onClick={() => prev()}
              >
                Previous
              </Button>
            </Col>
            <Col span={2}>
              <Button type="primary" onClick={() => next()}>
                Tiếp theo
              </Button>
            </Col>
          </Row>
        </>
      ),
    },
    {
      title: "Quy trình",
      content: (
        <>
          <Divider>
            <Title level={4}>Quy trình xử lý</Title>
          </Divider>
          <Row justify="center">
            <Col span={12}>
              <Form
                labelCol={{
                  span: 6,
                }}
                wrapperCol={{
                  span: 18,
                }}
                form={form}
                name="dynamic_form_complex"
                style={{
                  maxWidth: 600,
                }}
                autoComplete="off"
                initialValues={{
                  items: [{}],
                }}
              >
                <Form.List name="items">
                  {(fields, { add, remove }) => (
                    <div
                      style={{
                        display: "flex",
                        rowGap: 16,
                        flexDirection: "column",
                      }}
                    >
                      {fields.map((field) => (
                        <Card
                          size="small"
                          title={`Bước ${field.name + 1}`}
                          key={field.key}
                          extra={
                            <CloseOutlined
                              onClick={() => {
                                remove(field.name);
                              }}
                            />
                          }
                        >
                          <Form.Item label="Name" name={[field.name, "name"]}>
                            <Input />
                          </Form.Item>

                          {/* Nest Form.List */}
                          <Form.Item label="List">
                            <Form.Item
                              name={[field.name, "list"]}
                              noStyle
                              rules={[
                                {
                                  validator(_, value) {
                                    if (value && value.length > 0) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject(
                                      new Error(
                                        "Please select at least one item."
                                      )
                                    );
                                  },
                                },
                              ]}
                            >
                              <Select
                                mode="multiple"
                                placeholder="Select items"
                                style={{ width: "100%" }}
                              >
                                {/* Options for the multi-select */}
                                <Option value="item1">Item 1</Option>
                                <Option value="item2">Item 2</Option>
                                <Option value="item3">Item 3</Option>
                                {/* Add more options as needed */}
                              </Select>
                            </Form.Item>
                          </Form.Item>
                        </Card>
                      ))}

                      <Button type="dashed" onClick={() => add()} block>
                        + Add Item
                      </Button>
                    </div>
                  )}
                </Form.List>
                <div style={{ textAlign: "center", marginTop: 100 }}>
                  <Button
                    style={{
                      margin: "0 8px",
                    }}
                    onClick={() => prev()}
                  >
                    Previous
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => message.success("Processing complete!")}
                  >
                    Hoàn thành
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </>
      ),
    },
  ];
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  return (
    <div>
      <div
        style={{
          padding: "20px 20px",
          backgroundColor: "#FFFFFF",
        }}
        className="manager-header"
      >
        <ManagementProductTemplateHeader />
      </div>
      <div
        className="manager-content"
        style={{ height: "84vh", overflowY: "scroll" }}
      >
        <div>
          <Link to="/manager">
            <Button icon={<RollbackOutlined />}>Thoát</Button>
          </Link>
          <Divider orientation="left">
            <Title level={3}>Tạo mới bản mẫu</Title>
          </Divider>
          <div>
            <Steps current={current} items={items} />

            <div>{steps[current].content}</div>

            <div
              style={{
                marginTop: 24,
              }}
            >
              {/* {current < steps.length - 1 && (
                <Button type="primary" onClick={() => next()}>
                  Next
                </Button>
              )} */}
              {/* {current === steps.length - 1 && (
                <Button
                  type="primary"
                  onClick={() => message.success("Processing complete!")}
                >
                  Done
                </Button>
              )} */}
              {/* {current > 0 && (
                <Button
                  style={{
                    margin: "0 8px",
                  }}
                  onClick={() => prev()}
                >
                  Previous
                </Button>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ManagementProductTemplateContent = () => {
  const data = [
    {
      stt: 1,
      name: "Áo sơ mi",
      image: [
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
      ],
    },
    {
      stt: 1,
      name: "Áo sơ mi",
      image: [
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
      ],
    },
    {
      stt: 1,
      name: "Áo sơ mi",
      image: [
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
      ],
    },
    {
      stt: 1,
      name: "Áo sơ mi",
      image: [
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
      ],
    },
    {
      stt: 1,
      name: "Áo sơ mi",
      image: [
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
      ],
    },
    {
      stt: 1,
      name: "Áo sơ mi",
      image: [
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
      ],
    },
    {
      stt: 1,
      name: "Áo sơ mi",
      image: [
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
      ],
    },
    {
      stt: 1,
      name: "Áo sơ mi",
      image: [
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
      ],
    },
    {
      stt: 1,
      name: "Áo sơ mi",
      image: [
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
      ],
    },
    {
      stt: 1,
      name: "Áo sơ mi",
      image: [
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
      ],
    },
    {
      stt: 1,
      name: "Áo sơ mi",
      image: [
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
      ],
    },
    {
      stt: 1,
      name: "Áo sơ mi",
      image: [
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
      ],
    },
    {
      stt: 1,
      name: "Áo sơ mi",
      image: [
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
        {
          iname:
            "https://firebasestorage.googleapis.com/v0/b/etailor-21a50.appspot.com/o/Uploads%2FStaffAvatar%2F9cbfe8c2-5681-4f7d-9122-e0eb11.jpg?alt=media&token=8209eb82-bc92-428d-ba04-22716ce474e2",
        },
      ],
    },
  ];
  const contentStyle = {
    height: "160px",
    lineHeight: "160px",
  };

  return (
    <div>
      <div>
        <div>
          <Flex wrap="wrap" gap="small">
            <Button icon={<PushpinOutlined />}>Tổng cộng (2)</Button>
            <Link to="/manager/create/product-template">
              <Button icon={<PlusCircleOutlined />}>Thêm mới</Button>
            </Link>
          </Flex>
        </div>
        <div>
          <Divider plain icon={<PushpinOutlined />}>
            Bản mẫu sản phẩm hiện có
          </Divider>
          <div>
            <br />
            <Row gutter={[16, 24]}>
              {data.map((item) => {
                return (
                  <Col
                    className="gutter-row"
                    span={6}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Card
                      style={{
                        width: 200,
                      }}
                      cover={
                        <Carousel autoplay>
                          {item?.image?.map((img) => {
                            return (
                              <div>
                                <h3 style={contentStyle}>
                                  <img src={img.iname} alt="#" />
                                </h3>
                              </div>
                            );
                          })}
                        </Carousel>
                      }
                      actions={[
                        <EditOutlined key="edit" />,
                        <DeleteOutlined key="delete" />,
                      ]}
                    >
                      <Meta
                        title="Card title"
                        description="This is the description"
                      />
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

function ManagementProductTemplate() {
  return (
    <div>
      <div
        style={{
          padding: "20px 20px",
          backgroundColor: "#FFFFFF",
        }}
        className="manager-header"
      >
        <ManagementProductTemplateHeader />
      </div>
      <div
        className="manager-content"
        style={{ height: "84vh", overflowY: "scroll" }}
      >
        <ManagementProductTemplateContent />
      </div>
    </div>
  );
}

export default ManagementProductTemplate;
