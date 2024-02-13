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
} from "@ant-design/icons";
import {
  Typography,
  Carousel,
  Table,
  Checkbox,
  Input,
  Modal,
  InputNumber,
} from "antd";
import "./index.css";
import CircularProgress from "@mui/material/CircularProgress";

import { Button, Flex, Divider } from "antd";
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

import Paragraph from "antd/es/skeleton/Paragraph";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useQuery } from "react-query";

const { Search, TextArea } = Input;
const { Title, Text } = Typography;
const { Meta } = Card;
const { Option } = Select;

const manager = JSON.parse(localStorage.getItem("manager"));
console.log("manager", manager);

const ManagementCategoryHeader = () => {
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

const ManagementCategoryContent = () => {
  const getUrl = "https://etailorapi.azurewebsites.net/api/category-management";

  const { data: category, isLoading: loading } = useQuery("get-category", () =>
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
      width: "10%",
      dataIndex: "stt",
      key: "index",
      fixed: "left",
    },
    {
      title: "Tên loại đồ",
      dataIndex: "name",
      key: "2",
      width: "70%",
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "6",
      width: "20%",
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
          <Col span={2}>
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

  const getApi = category?.map((item, index) => ({
    stt: index + 1,
    name: item.name,
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
            <Button>Tổng cộng ({category?.length})</Button>
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

  return (
    <Modal
      open={open}
      style={{ top: 220 }}
      title="Thêm mới loại bản mẫu"
      okText="Tạo mới"
      cancelText="Hủy bỏ"
      onCancel={() => {
        form.resetFields();

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
          className="mt-2"
          hasFeedback
          name="name"
          label="Tên số đo"
          rules={[
            {
              required: true,
              message: "Tên loại bản mẫu không được để trống!",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

function ManagementCategory() {
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
        <ManagementCategoryHeader />
      </div>
      <div
        className="manager-content"
        style={{
          height: "83vh",
          overflowY: "scroll",
          border: "1px solid #9F78FF",
        }}
      >
        <ManagementCategoryContent />
      </div>
    </div>
  );
}

export default ManagementCategory;
