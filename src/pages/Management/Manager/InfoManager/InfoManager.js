import React, { useEffect, useState } from "react";
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
  EyeOutlined,
} from "@ant-design/icons";
import {
  Typography,
  Carousel,
  Table,
  Checkbox,
  Modal,
  Divider,
  Input,
  Card,
  Col,
  Row,
  Image,
  Tag,
  Form,
  Button,
  Collapse,
  message,
  Avatar,
} from "antd";
import ManagerHeader from "../../../../components/ManagerHeader";
import CircularProgress from "@mui/material/CircularProgress";

const { Search, TextArea } = Input;
const { Title, Text } = Typography;
const { Meta } = Card;

export const InfoManager = () => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(null);
  const [category, setCategory] = useState(null);
  const [form] = Form.useForm();
  const [updatePasswordLoading, setUpdatePasswordLoading] = useState(false);
  const [open, setOpen] = useState([]);
  const handleGetInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://e-tailorapi.azurewebsites.net/api/staff/info`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${manager?.token}`,
          },
        }
      );

      if (response.ok) {
        const responseData = await response.json();

        setInfo(responseData);
        handleCategory();
        return 1;
      }
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleCategory = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://e-tailorapi.azurewebsites.net/api/category-management`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${manager?.token}`,
          },
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        setCategory(responseData);
        return 1;
      }
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleFilterCategory = (masterySkills) => {
    if (category && masterySkills) {
      const categoryFilter = category.filter((item) =>
        masterySkills.includes(item.id)
      );
      return categoryFilter.map((item) => {
        return (
          <Tag color="purple" style={{ fontSize: 15, padding: 5 }}>
            {item.name}
          </Tag>
        );
      });
    }
  };
  useEffect(() => {
    const getInfo = async () => await handleGetInfo();
    getInfo();
  }, []);
  const onFinish = async (values) => {
    console.log("values:", values);

    setUpdatePasswordLoading(true);
    const dataBackend = {
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    };
    try {
      const response = await fetch(
        `https://e-tailorapi.azurewebsites.net/api/staff/change-password`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${manager?.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataBackend),
        }
      );
      if (response.ok && response.status === 200) {
        const responseData = await response.text();
        message.success(responseData);
        form.resetFields();
        setOpen([]);
      } else if (response.status === 400 || response.status === 500) {
        const responseData = await response.text();
        message.error(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      setUpdatePasswordLoading(false);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
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
        <ManagerHeader
          name={"Thông tin cá nhân"}
          link={"/manager/manager-info"}
          iconHome={<HomeOutlined />}
          iconRoute={<UserOutlined fontSize="small" />}
        />
      </div>
      <div
        className="manager-content"
        style={{
          height: "83vh",
          overflowY: "scroll",
          border: "1px solid #9F78FF",
        }}
      >
        <Divider style={{ marginTop: 0 }}>
          <Title level={4}>Thông tin cá nhân</Title>
        </Divider>
        {loading && info ? (
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
          <>
            <Row
              justify={"center"}
              style={{ height: "450px" }}
              align={"middle"}
            >
              <Col span={8}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      border: "1px solid #9F78FF",
                      padding: 10,
                      borderRadius: "50%",
                    }}
                  >
                    <Avatar
                      style={{
                        width: 250,
                        height: 250,
                      }}
                      src={
                        info?.avatar
                          ? info?.avatar
                          : "https://api.dicebear.com/7.x/miniavs/svg?seed=1"
                      }
                    />
                  </div>
                </div>
              </Col>
              <Col span={10}>
                <div
                  style={{
                    padding: 20,
                    height: "auto",
                    border: "1px solid #9F78FF",
                  }}
                >
                  <div style={{ margin: "10px 0" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0px 30px",
                      }}
                    >
                      <Title level={5} style={{ margin: 0 }}>
                        Họ và tên:{" "}
                      </Title>{" "}
                      <Text style={{ fontSize: 15 }}>{info?.fullname}</Text>
                    </div>
                  </div>
                  <div style={{ margin: "10px 0" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0px 30px",
                      }}
                    >
                      <Title level={5} style={{ margin: 0 }}>
                        Tên tài khoản:{" "}
                      </Title>{" "}
                      <Text style={{ fontSize: 15 }}>{info?.username}</Text>
                    </div>
                  </div>
                  <div style={{ margin: "10px 0" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0px 30px",
                      }}
                    >
                      <Title level={5} style={{ margin: 0 }}>
                        Số điện thoại:{" "}
                      </Title>{" "}
                      <Text style={{ fontSize: 15 }}>{info?.phone}</Text>
                    </div>
                  </div>
                  <div style={{ margin: "10px 0" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0px 30px",
                      }}
                    >
                      <Title level={5} style={{ margin: 0 }}>
                        Địa chỉ:{" "}
                      </Title>{" "}
                      <Text style={{ fontSize: 15 }}>{info?.address}</Text>
                    </div>
                  </div>
                  {info?.masterySkills ? (
                    <div style={{ margin: "10px 0" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0px 30px",
                        }}
                      >
                        <Title level={5} style={{ margin: 0 }}>
                          Kỹ năng chuyên môn:{" "}
                        </Title>{" "}
                      </div>
                      <div style={{ marginTop: 5, textAlign: "center" }}>
                        <Text style={{ fontSize: 20 }}>
                          {handleFilterCategory(info?.masterySkills)}
                        </Text>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Title level={5} style={{ margin: 0 }}>
                        Kỹ năng chuyên môn:{" "}
                      </Title>{" "}
                      &nbsp; &nbsp; &nbsp;
                      <Text style={{ fontSize: 15 }}>
                        Chưa có kỹ năng chuyên môn
                      </Text>
                    </div>
                  )}
                  <div style={{ margin: "10px 0" }}>
                    <Collapse
                      items={[
                        {
                          key: "1",
                          label: "Thay đổi mật khẩu",
                          children: (
                            <Form
                              form={form}
                              layout={"vertical"}
                              name="basic"
                              style={{
                                maxWidth: 600,
                              }}
                              onFinish={onFinish}
                              onFinishFailed={onFinishFailed}
                              autoComplete="off"
                            >
                              <Form.Item
                                label={
                                  <Title level={5} style={{ margin: 0 }}>
                                    Mật khẩu cũ
                                  </Title>
                                }
                                name="oldPassword"
                                rules={[
                                  {
                                    required: true,
                                    message: "Mật khẩu không được để trống",
                                  },
                                ]}
                              >
                                <Input.Password />
                              </Form.Item>

                              <Form.Item
                                label={
                                  <Title level={5} style={{ margin: 0 }}>
                                    Mật khẩu mới
                                  </Title>
                                }
                                name="newPassword"
                                rules={[
                                  {
                                    required: true,
                                    message:
                                      "Mật khẩu mới không được để trống!",
                                  },
                                ]}
                              >
                                <Input.Password />
                              </Form.Item>
                              <Form.Item
                                label={
                                  <Title level={5} style={{ margin: 0 }}>
                                    Xác nhận mật khẩu
                                  </Title>
                                }
                                name="confirmPassword"
                                rules={[
                                  ({ getFieldValue }) => ({
                                    validator(_, value) {
                                      const newPassword =
                                        getFieldValue("newPassword");
                                      if (!value) {
                                        return Promise.reject(
                                          "Xác nhận mật khẩu không được để trống!"
                                        );
                                      }
                                      if (value === newPassword) {
                                        return Promise.resolve();
                                      }
                                      return Promise.reject(
                                        "Mật khẩu không trùng khớp!"
                                      );
                                    },
                                  }),
                                ]}
                              >
                                <Input.Password />
                              </Form.Item>

                              <Form.Item
                                wrapperCol={{
                                  offset: 8,
                                  span: 16,
                                }}
                              >
                                <Button
                                  type="primary"
                                  htmlType="submit"
                                  style={{ marginTop: 10 }}
                                  loading={updatePasswordLoading}
                                >
                                  Cập nhật mật khẩu
                                </Button>
                              </Form.Item>
                            </Form>
                          ),
                        },
                      ]}
                      activeKey={open}
                      onChange={() =>
                        setOpen((prev) => {
                          if (prev[0] === "1") {
                            return [];
                          } else {
                            return ["1"];
                          }
                        })
                      }
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </>
        )}
      </div>
    </div>
  );
};
