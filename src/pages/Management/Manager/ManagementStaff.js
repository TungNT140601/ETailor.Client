import React, { useEffect, useState } from "react";
import {
  HomeOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Table, Checkbox } from "antd";
import "./index.css";

import {
  Col,
  Row,
  Image,
  Button,
  Input,
  Modal,
  Form,
  Upload,
  Select,
} from "antd";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";
import ManagerHeader from "../../../components/ManagerHeader";

const ManagementStaffContent = () => {
  const getStaffUrl = "https://e-tailorapi.azurewebsites.net/api/staff";
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const manager = JSON.parse(localStorage.getItem("manager"));
  const handleDataStaff = async () => {
    setLoading(true);
    try {
      const response = await fetch(getStaffUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.json();
        setLoading(false);
        setStaffs(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };
  useEffect(() => {
    handleDataStaff();
  }, []);
  const columns = [
    {
      title: "STT",
      width: 50,
      dataIndex: "stt",
      key: "index",
      fixed: "left",
    },
    {
      title: "Hình đại diện",
      width: 150,
      dataIndex: "avatar",
      key: "avatar",
      render: (_, record) => (
        <Image
          width={30}
          height={30}
          style={{ objectFit: "contain" }}
          src={
            record.avatar
              ? record.avatar
              : "https://api.dicebear.com/7.x/miniavs/svg?seed=1"
          }
        />
      ),
    },
    {
      title: "Tên người dùng",
      dataIndex: "username",
      key: "1",
      width: 150,
    },
    {
      title: "Họ và tên",
      dataIndex: "fullname",
      key: "2",
      width: 150,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "3",
      width: 150,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "4",
      width: 150,
    },
    {
      title: "Tùy chỉnh",
      dataIndex: "Action",
      key: "5",
      width: 150,
      fixed: "right",
      render: (_, record) => (
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
              onClick={() => {
                onDelete(record.id);
              }}
            />
          </Col>
          <Col span={4} offset={2}>
            <EditOutlined
              style={{
                backgroundColor: "blue",
                color: "white",
                padding: 6,
                borderRadius: "5px",
                fontSize: 15,
                cursor: "pointer",
              }}
              onClick={() => {
                handleOpenUpdate(record.id);
              }}
            />
          </Col>
        </Row>
      ),
    },
  ];

  const getApi = staffs?.data?.map((item, index) => ({
    id: item.id,
    stt: index + 1,
    avatar: item.avatar,
    username: item.username,
    fullname: item.fullname,
    address: item.address,
    phone: item.phone,
  }));

  //------------------------------------------------------------Modal create-------------------------------------------------------
  const [open, setOpen] = useState(false);
  const onCreate = async (values) => {
    const formData = new FormData();
    formData.append("AvatarImage", values.avatar);
    formData.append("Fullname", values.fullname);
    formData.append("Address", values.address);
    formData.append("Phone", values.phone);
    formData.append("Username", values.username);
    values?.masterySkill?.map((item) => formData.append("MasterySkill", item));
    const urlCreateMaterialType = `https://e-tailorapi.azurewebsites.net/api/staff`;
    try {
      const response = await fetch(urlCreateMaterialType, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${manager?.token}`,
        },
        body: formData,
      });
      const responseData = await response.text();
      if (response.ok && response.status === 200) {
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: responseData,
          showConfirmButton: false,
          timer: 1500,
        });
        handleDataStaff();
        return 1;
      } else if (response.status === 400 || response.status === 500) {
        Swal.fire({
          position: "top-center",
          icon: "error",
          title: responseData,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };
  //----------------------------------------------------------------Update------------------------------------------------
  const [openUpdate, setOpenUpdate] = useState(false);
  const [saveIdStaff, setSaveIdStaff] = useState(null);
  const handleOpenUpdate = async (id) => {
    console.log("id", id);
    await setSaveIdStaff(id);
    setOpenUpdate(true);
  };
  const onUpdate = async (values) => {
    const formData = new FormData();
    if (saveIdStaff) {
      formData.append("Id", saveIdStaff);
      formData.append("AvatarImage", values.avatar);
      formData.append("Fullname", values.fullname);
      formData.append("Address", values.address);
      formData.append("Phone", values.phone);
      formData.append("Username", values.username);
      values?.masterySkill?.map((item) =>
        formData.append("MasterySkill", item)
      );
      const url = `https://e-tailorapi.azurewebsites.net/api/staff?id=${saveIdStaff}`;
      try {
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${manager?.token}`,
          },
          body: formData,
        });
        const responseData = await response.text();
        if (response.ok && response.status === 200) {
          Swal.fire({
            position: "top-center",
            icon: "success",
            title: responseData,
            showConfirmButton: false,
            timer: 1500,
          });
          handleDataStaff();
          return 1;
        } else if (response.status === 400 || response.status === 500) {
          Swal.fire({
            position: "top-center",
            icon: "error",
            title: responseData,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (error) {
        console.error("Error calling API:", error);
      }
    }
  };
  //---------------------------------------------------------------------------Delete-------------------------------------------------------
  const onDelete = (id) => {
    const urlCreateBodySize = `https://e-tailorapi.azurewebsites.net/api/staff/${id}`;
    Swal.fire({
      title: "Bạn có muốn xóa nhân viên này?",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(urlCreateBodySize, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${manager?.token}`,
            },
          });
          const responseData = await response.text();
          if (response.ok && response.status === 200) {
            Swal.fire({
              position: "top-center",
              icon: "success",
              title: responseData,
              showConfirmButton: false,
              timer: 2000,
            });
            handleDataStaff();
            return 1;
          } else if (response.status === 400 || response.status === 500) {
            Swal.fire({
              position: "top-center",
              icon: "error",
              title: responseData,
              showConfirmButton: false,
              timer: 2000,
            });
            return 0;
          }
        } catch (error) {
          console.error("Error calling API:", error);
        }
      } else if (result.isDenied) {
        Swal.fire("Hủy bỏ xóa nguyên liệu", "", "info");
      }
    });
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
            style={{ backgroundColor: "" }}
          />
        </div>
        <Row justify="start" style={{ paddingRight: "24px" }}>
          <Col span={4}>
            <Button>Tổng cộng ({staffs?.totalData})</Button>
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
          scroll={{ y: 426 }}
        />
      )}
      <CollectionUpdateForm
        open={openUpdate}
        onUpdate={onUpdate}
        onCancel={() => {
          setOpenUpdate(false);
        }}
        saveIdStaff={saveIdStaff}
        setSaveIdStaff={setSaveIdStaff}
      />
    </div>
  );
};

const CollectionCreateForm = ({ open, onCreate, onCancel }) => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [postImage, setPostImage] = useState(null);
  const [masteryLoading, setMasteryLoading] = useState(false);
  const [masterySkill, setMasterySkill] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);

  const handleDataMastery = async () => {
    setMasteryLoading(true);
    try {
      const response = await fetch(
        "https://e-tailorapi.azurewebsites.net/api/category-management",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${manager?.token}`,
          },
        }
      );
      if (response.ok && response.status === 200) {
        const responseData = await response.json();
        setMasterySkill(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      setMasteryLoading(false);
    }
  };
  useEffect(() => {
    handleDataMastery();
  }, []);

  const getFile = (e) => {
    console.log(e);
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
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Hình đại diện
      </div>
    </button>
  );

  return (
    <Modal
      open={open}
      style={{ top: 75 }}
      title="Thêm mới nhân viên"
      okText="Tạo mới"
      cancelText="Hủy bỏ"
      onCancel={() => {
        form.resetFields();
        setImageUrl(null);
        setPostImage(null);
        onCancel();
      }}
      onOk={() => {
        form
          .validateFields()
          .then(async (values) => {
            setCreateLoading(true);
            const backendData = {
              address: values.address,
              avatar: postImage,
              fullname: values.fullname,
              phone: values.phone,
              username: values.username,
              masterySkill: values.masterySkill,
            };
            console.log("valuesvaluesvaluesvaluesvaluesvalues", backendData);
            const check = await onCreate(backendData);
            if (check === 1) {
              form.resetFields();
              setImageUrl(null);
              setPostImage(null);
              onCancel();
            }
          })
          .then(() => setCreateLoading(false))
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
      okButtonProps={{ loading: createLoading }}
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
          masterySkill: [],
        }}
      >
        {masteryLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "500px",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <>
            <Row>
              <Col span={12}>
                <div>
                  <Form.Item
                    name="fullname"
                    label="Họ và tên"
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Họ và tên không được để trống",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    hasFeedback
                    name="username"
                    label="Tên người dùng"
                    rules={[
                      {
                        required: true,
                        message: "Tên người dùng không được để trống",
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
                    name="avatar"
                    getValueFromEvent={getFile}
                    style={{ width: "130px" }}
                    rules={[
                      {
                        required: true,
                        message: "Ảnh đại diện không được để trống",
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
            </Row>
            <Form.Item
              className="mt-2"
              hasFeedback
              name="masterySkill"
              label="Kỹ năng chuyên môn"
            >
              <Select
                mode="multiple"
                style={{
                  width: "100%",
                }}
                options={
                  masterySkill &&
                  masterySkill?.map((skill) => ({
                    value: skill.id,
                    label: skill.name,
                  }))
                }
              />
            </Form.Item>
            <Form.Item
              className="mt-2"
              hasFeedback
              name="address"
              label="Địa chỉ"
              rules={[
                {
                  required: true,
                  message: "Địa chỉ không được để trống",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số điện thoại"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Số điện thoại không được để trống",
                },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Số điện thoại phải là 10 số",
                },
              ]}
            >
              <Input
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

const CollectionUpdateForm = ({
  open,
  onUpdate,
  onCancel,
  saveIdStaff,
  setSaveIdStaff,
}) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [postImage, setPostImage] = useState(null);
  const [masteryLoading, setMasteryLoading] = useState(false);
  const [masterySkill, setMasterySkill] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [dataDetailUpdate, setDadtaDetailUpdate] = useState(null);
  const manager = JSON.parse(localStorage.getItem("manager"));

  const handleDataMastery = async () => {
    setMasteryLoading(true);
    try {
      const response = await fetch(
        "https://e-tailorapi.azurewebsites.net/api/category-management",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${manager?.token}`,
          },
        }
      );
      if (response.ok && response.status === 200) {
        const responseData = await response.json();
        setMasterySkill(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      setMasteryLoading(false);
    }
  };
  const handleDetailStaff = async () => {
    setUpdateLoading(true);
    try {
      const response = await fetch(
        `https://e-tailorapi.azurewebsites.net/api/staff/info?id=${saveIdStaff}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${manager?.token}`,
          },
        }
      );
      if (response.ok && response.status === 200) {
        const responseData = await response.json();
        setImageUrl(responseData.avatar);
        setDadtaDetailUpdate(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      setUpdateLoading(false);
    }
  };
  useEffect(() => {
    if (saveIdStaff) {
      handleDataMastery();
      handleDetailStaff();
    }
  }, [saveIdStaff]);
  useEffect(() => {
    if (dataDetailUpdate) {
      form.setFieldsValue({
        modifier: "public",
        avatar: dataDetailUpdate.avatar || "",
        fullname: dataDetailUpdate.fullname || "",
        image: dataDetailUpdate.image || "",
        address: dataDetailUpdate.address || "",
        username: dataDetailUpdate.username || "",
        phone: dataDetailUpdate.phone || "",
        masterySkill:
          dataDetailUpdate.masterySkills && dataDetailUpdate.masterySkills,
      });
    }
  }, [dataDetailUpdate]);

  const getFile = (e) => {
    console.log(e);
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
      style={{ top: 75 }}
      title="Cập nhật nhân viên"
      okText="Cập nhật"
      cancelText="Hủy bỏ"
      onCancel={() => {
        form.resetFields();
        setImageUrl(null);
        setPostImage(null);
        onCancel();
        setSaveIdStaff(null);
      }}
      onOk={() => {
        form
          .validateFields()
          .then(async (values) => {
            setCreateLoading(true);
            const backendData = {
              address: values.address,
              avatar: postImage,
              fullname: values.fullname,
              phone: values.phone,
              username: values.username,
              masterySkill: values.masterySkill,
            };
            console.log("valuesvaluesvaluesvaluesvaluesvalues", backendData);
            const check = await onUpdate(backendData);
            if (check === 1) {
              form.resetFields();
              setImageUrl(null);
              setPostImage(null);
              onCancel();
              setSaveIdStaff(null);
            }
          })
          .then(() => setCreateLoading(false))
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
      okButtonProps={{ loading: createLoading }}
    >
      <Form
        style={{
          height: 400,
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
          masterySkill: [],
        }}
      >
        {masteryLoading ? (
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
          <>
            <Row>
              <Col span={12}>
                <div>
                  <Form.Item
                    name="fullname"
                    label="Họ và tên"
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Họ và tên không được để trống",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    hasFeedback
                    name="username"
                    label="Tên người dùng"
                    rules={[
                      {
                        required: true,
                        message: "Tên người dùng không được để trống",
                      },
                    ]}
                  >
                    <Input disabled />
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
                    name="avatar"
                    getValueFromEvent={getFile}
                    style={{ width: "130px" }}
                    rules={[
                      {
                        required: true,
                        message: "Ảnh đại diện không được để trống",
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
            </Row>
            <Form.Item
              className="mt-2"
              hasFeedback
              name="masterySkill"
              label="Kỹ năng chuyên môn"
            >
              <Select
                mode="multiple"
                style={{
                  width: "100%",
                }}
                options={
                  masterySkill &&
                  masterySkill?.map((skill) => ({
                    value: skill.id,
                    label: skill.name,
                  }))
                }
              />
            </Form.Item>
            <Form.Item
              className="mt-2"
              hasFeedback
              name="address"
              label="Địa chỉ"
              rules={[
                {
                  required: true,
                  message: "Địa chỉ không được để trống",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số điện thoại"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Số điện thoại không được để trống",
                },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Số điện thoại phải là 10 số",
                },
              ]}
            >
              <Input
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

function ManagementStaff() {
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
          name={"Nhân viên"}
          link={"/manager/account/staffs"}
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
        <ManagementStaffContent />
      </div>
    </div>
  );
}

export default ManagementStaff;
