import React, { useEffect, useRef, useState } from "react";
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
  LoadingOutlined,
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
  Alert,
} from "antd";

import CheckroomIcon from "@mui/icons-material/Checkroom";
import Paragraph from "antd/es/skeleton/Paragraph";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const { Search, TextArea } = Input;
const { Title, Text } = Typography;
const { Meta } = Card;
const { Option } = Select;

const ManagementProductTemplateHeader = () => {
  const manager = JSON.parse(localStorage.getItem("manager"));
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "#9F78FF",
                    }}
                  >
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "#9F78FF",
                    }}
                  >
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

export const ManagementCreateProductTemplate = () => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const loading = false;
  const [form] = Form.useForm();
  //-----------------------------------------------Hinh anh buoc 1
  const [imageUrl, setImageUrl] = useState(null);
  const [postImage, setPostImage] = useState(null);
  const [uploadKey, setUploadKey] = useState(0);

  console.log("postImage", postImage);
  console.log("imageUrl", imageUrl);
  //-----------------------------------------------thumbnail buoc 1
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [postThumbnailImage, setPostThumbnailImage] = useState(null);

  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const getFile = async (e) => {
    const files = e.fileList.map((file) => file.originFileObj);
    setPostImage(files);

    const readers = e.fileList.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);
      return reader;
    });

    // Đợi tất cả các FileReader hoàn thành
    const newResults = [];
    for (const reader of readers) {
      const result = await new Promise((resolve) => {
        reader.onload = () => {
          resolve(reader.result);
        };
      });
      newResults.push(result);
    }

    setImageUrl((prevResults) => {
      if (prevResults === null) {
        return newResults;
      } else {
        // Loại bỏ các URL ảnh đã tồn tại trong mảng trước khi thêm vào
        const filteredResults = newResults.filter(
          (newResult) => !prevResults.includes(newResult)
        );
        return [...prevResults, ...filteredResults];
      }
    });
  };

  useEffect(() => {
    // Mỗi khi danh sách ảnh thay đổi, cập nhật key của Upload component
    setUploadKey(uploadKey + 1);
  }, [imageUrl]);

  const getFileThumbnail = (e) => {
    console.log(e);
    const file = e.fileList[0];
    if (file && file.originFileObj) {
      setPostThumbnailImage(file.originFileObj);
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);
      reader.onload = () => {
        setThumbnailUrl(reader.result);
      };
    }
    return e && e.fileList;
  };
  const next = () => {
    if (current === 0) {
      console.log("CURRRENT 0");
      setCurrent(current + 1);
    } else if (current === 1) {
      setCurrent(current + 1);
    } else if (current === 2) {
      setCurrent(current + 1);
    } else if (current === 3) {
      setCurrent(current + 1);
    }
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
  const prev = () => {
    setCurrent(current - 1);
  };

  const clearAllImages = () => {
    setImageUrl(null);
    setPostImage(null);
  };
  const handleClearAllImages = async () => {
    clearAllImages();
  };
  //-------------------------------------------------------------step 1----------------------------------------------
  const [getCategory, setCategory] = useState([]);
  const getUrl =
    "https://e-tailorapi.azurewebsites.net/api/category-management";

  const handleGetCategory = async () => {
    try {
      const response = await fetch(getUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.json();

        setCategory(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };
  useEffect(() => {
    handleGetCategory();
  }, []);
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
  const dataStep2 = [
    {
      id: 1,
      name: "Cổ áo",
    },
    {
      id: 2,
      name: "Tay áo",
    },
    {
      id: 3,
      name: "Thân áo",
    },
  ];
  const [cards, setCards] = useState([]);

  const [open, setOpen] = useState(false);

  const handleOpen = (value) => {
    setOpen(true);
  };
  const onCreate = (values) => {
    setOpen(false);
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
              autoComplete="off"
            >
              {form.getFieldError("name").map((error) => (
                <Alert message={error} type="error" />
              ))}
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
                  {getCategory &&
                    getCategory?.map((category) => {
                      return (
                        <Select.Option value={category?.id} key={category?.id}>
                          {category?.name}
                        </Select.Option>
                      );
                    })}
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
                name="image"
                rules={[
                  {
                    required: true,
                    message: "Hình ảnh bản mẫu",
                  },
                ]}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Upload
                    key={uploadKey}
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    onChange={getFile}
                    multiple={true}
                    showUploadList={false}
                  >
                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                  </Upload>
                  {imageUrl && (
                    <Button
                      icon={<UploadOutlined />}
                      onClick={handleClearAllImages}
                    >
                      Clear tất cả
                    </Button>
                  )}
                </div>
                <Row gutter={[16, 24]}>
                  {imageUrl &&
                    imageUrl.map((url, index) => (
                      <Col
                        className="gutter-row"
                        span={6}
                        key={`image_${index}`}
                      >
                        <img
                          src={url}
                          alt={`image_${index}`}
                          style={{
                            width: 129,
                            height: 129,
                            borderRadius: 10,
                            border: "1px solid #9F78FF",
                            marginTop: 10,
                          }}
                        />
                      </Col>
                    ))}
                </Row>
              </Form.Item>
              <Form.Item
                label="Thumbnail"
                valuePropName="fileList"
                getValueFromEvent={getFileThumbnail}
                name="thumbnail"
                rules={[
                  {
                    required: true,
                    message: "Thumbnail không được để trống",
                  },
                ]}
              >
                <Upload
                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  listType="picture-card"
                  maxCount={1}
                  showUploadList={false}
                >
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt="thumbnail"
                      style={{
                        width: "131px",
                        height: "131px",
                        borderRadius: "10px",
                      }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      ),
    },
    {
      title: "Thông tin cơ bản",
      content: (
        <>
          <Row gutter={[16, 24]} justify="start">
            {dataStep2.map((data, index) => {
              return (
                <>
                  <Col
                    className="gutter-row"
                    span={12}
                    style={{
                      marginTop: 24,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      <Title level={4}>
                        {index + 1} - {data.name}
                      </Title>
                      <Button
                        type="primary"
                        onClick={() => handleOpen(data)}
                        style={{ marginLeft: 24 }}
                      >
                        Thêm mới
                      </Button>
                    </div>
                    <div>
                      <Row
                        justify="start"
                        className="gutter-row"
                        style={{
                          backgroundColor: "white",
                          border: "1px solid #9F78FF",
                          borderRadius: "10px",
                          width: 550,
                          height: 350,
                          overflowY: "scroll",
                        }}
                      >
                        {(() => {
                          const filteredCards = cards.filter(
                            (card) => card.section === data.id
                          );
                          if (filteredCards.length > 0) {
                            return filteredCards.map((card, cardIndex) => (
                              <>
                                <Col offset={2}>
                                  <Card
                                    style={{
                                      width: 200,
                                      marginTop: 10,
                                      border: "1px solid #D4D4D4",
                                    }}
                                    cover={
                                      <Image
                                        width={200}
                                        height={200}
                                        src={card.image}
                                        style={{
                                          border: "1px solid #D4D4D4",
                                        }}
                                      />
                                    }
                                    actions={[<DeleteOutlined key="delete" />]}
                                  >
                                    <Meta title={card.title} />
                                  </Card>
                                </Col>
                              </>
                            ));
                          } else {
                            return (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  paddingLeft: 125,
                                }}
                              >
                                <Title level={4}>
                                  Chưa có kiểu nào. Hãy thêm vào
                                </Title>
                              </div>
                            );
                          }
                        })()}
                      </Row>
                    </div>
                  </Col>
                </>
              );
            })}

            <CollectionCreateForm
              open={open}
              onCreate={onCreate}
              onCancel={() => {
                setOpen(false);
              }}
            />
          </Row>
        </>
      ),
    },
    {
      title: "Số đo cần thiết",
      content: (
        <>
          <Divider>
            <Title level={4}>Số đo cần thiết của áo</Title>
          </Divider>

          <br />
          <br />
          <Space
            direction="vertical"
            style={{
              width: "100%",
              height: 340,
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
              id="product_template_step_3"
            />
          </Space>
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
          <Row justify="center" style={{ marginBottom: 100 }}>
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

  const handleNext = async () => {
    try {
      const valid = await form.validateFields();
      if (valid) {
        onFinish();
      } else {
        onFinishFailed();
      }
    } catch (error) {
      message.error("Vui lòng điền đầy đủ thông tin trước khi chuyển bước.");
    }
  };

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
        <ManagementProductTemplateHeader />
      </div>
      <div
        className="manager-content"
        style={{
          height: "83vh",
          overflowY: "scroll",
          border: "1px solid #9F78FF",
        }}
      >
        <Divider orientation="center" style={{ marginTop: 0 }}>
          <Title level={3}>Tạo mới bản mẫu</Title>
        </Divider>
        <div>
          <div>
            <Steps current={current} items={items} />

            <div>{steps[current].content}</div>
            <div
              style={{
                marginTop: 24,
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <div>
                <Link to="/manager/product-template">
                  <Button icon={<RollbackOutlined />}>Thoát</Button>
                </Link>
              </div>
              <div>
                {current < steps.length - 1 && (
                  <Button
                    type="primary"
                    onClick={() => {
                      if (current === 0) {
                        handleNext();
                      } else {
                        next();
                      }
                    }}
                  >
                    Tiếp theo
                  </Button>
                )}
                {current === steps.length - 1 && (
                  <Button
                    type="primary"
                    onClick={() => message.success("Processing complete!")}
                  >
                    Hoàn Thành
                  </Button>
                )}
                {current > 0 && (
                  <Button
                    style={{
                      margin: "0 8px",
                    }}
                    onClick={() => prev()}
                  >
                    Quay lại
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CollectionCreateForm = ({ open, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const manager = JSON.parse(localStorage.getItem("manager"));

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      form.resetFields();
      onCreate(values);
    } catch (errorInfo) {
      console.log("Validate Failed:", errorInfo);
    }
  };
  const handleUploadChange = async (info) => {
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (url) => {
        form.setFieldsValue({
          image: url,
        });
      });
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };
  return (
    <Modal
      open={open}
      title={`Create a new collection`}
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleOk}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: "public",
        }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[
            {
              required: true,
              message: "Please input the title of collection!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="image" label="Upload Image">
          <Upload
            name="file"
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
            onChange={handleUploadChange}
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const ManagementProductTemplateContent = () => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [loading, setLoading] = useState(false);
  const [getProductTemplate, setGetProductTemplate] = useState([]);
  const getUrl =
    "https://e-tailorapi.azurewebsites.net/api/template-management/get-all-template";

  const handleGetProductTemplate = async () => {
    setLoading(true);
    try {
      const response = await fetch(getUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.json();
        setLoading(false);
        setGetProductTemplate(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };
  useEffect(() => {
    handleGetProductTemplate();
  }, []);

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
            <Title level={4}> Bản mẫu sản phẩm hiện có</Title>
          </Divider>
          <div>
            <br />
            <Row gutter={[16, 24]}>
              {getProductTemplate.map((item) =>
                item?.productTemplates?.map((productTemplate) => {
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
                          <Image
                            width={200}
                            src={productTemplate.thumbnailImage}
                          />
                        }
                        actions={[
                          <EditOutlined key="edit" />,
                          <DeleteOutlined key="delete" />,
                        ]}
                      >
                        <Meta title={productTemplate.name} />
                      </Card>
                    </Col>
                  );
                })
              )}
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

function ManagementProductTemplate() {
  const manager = JSON.parse(localStorage.getItem("manager"));
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
        <ManagementProductTemplateHeader />
      </div>
      <div
        className="manager-content"
        style={{
          height: "83vh",
          overflowY: "scroll",
          border: "1px solid #9F78FF",
        }}
      >
        <div>
          <ManagementProductTemplateContent />
        </div>
      </div>
    </div>
  );
}

export default ManagementProductTemplate;
