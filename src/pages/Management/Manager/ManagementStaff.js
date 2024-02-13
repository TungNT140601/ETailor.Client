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

import {
  Avatar,
  Col,
  Row,
  InputNumber,
  Image,
  Button,
  Input,
  Modal,
  Form,
  Upload,
  Select,
} from "antd";

import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useQuery } from "react-query";
import CircularProgress from "@mui/material/CircularProgress";

const { Search } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

const manager = JSON.parse(localStorage.getItem("manager"));

const ManagementStaffHeader = () => {
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
              href: "/manager/account/staffs",
              title: (
                <>
                  <Link to="/manager/account/staffs">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "#9F78FF",
                      }}
                    >
                      <UserOutlined fontSize="small" />
                      &nbsp;
                      <span>Nhân viên</span>
                    </div>
                  </Link>
                </>
              ),
            },
          ]}
        />
        <Title level={4}>Nhân viên</Title>
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

const ManagementStaffContent = () => {
  const getStaffUrl = "https://etailorapi.azurewebsites.net/api/staff";
  const manager = JSON.parse(localStorage.getItem("manager"));
  const { data: staffs, isLoading: loading } = useQuery("getStaffs", () =>
    fetch(getStaffUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${manager?.token}`,
      },
    }).then((response) => response.json())
  );
  console.log("staffs", staffs);
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
          width={60}
          height={30}
          style={{ objectFit: "contain" }}
          src={record.avatar}
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
      title: "Action",
      dataIndex: "Action",
      key: "5",
      width: 150,
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
            />
          </Col>
        </Row>
      ),
    },
  ];

  const getApi = staffs?.data?.map((item) => ({
    stt: item.stt,
    avatar: item.avatar,
    username: item.username,
    fullname: item.fullname,
    address: item.address,
    phone: item.phone,
  }));

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
        />
      )}
    </div>
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
      style={{ top: 75 }}
      title="Thêm mới nhân viên"
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
        }}
      >
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
              type: "number",
              min: 10,
              max: 11,
              message:
                "Số điện thoại phải là số và ít nhất là 10 và tối đa là 11 số",
            },
          ]}
        >
          <Input
            style={{
              width: "100%",
            }}
          />
        </Form.Item>
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
        <ManagementStaffHeader />
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
