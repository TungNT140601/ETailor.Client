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
} from "@ant-design/icons";
import {
  Typography,
  Carousel,
  Table,
  Checkbox,
  InputNumber,
  Modal,
  DatePicker,
} from "antd";
import "./index.css";
import DiscountIcon from "@mui/icons-material/Discount";
import CircularProgress from "@mui/material/CircularProgress";

import { Input } from "antd";
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

const ManagementDiscountHeader = () => {
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
              href: "/manager/discount",
              title: (
                <>
                  <Link to="/manager/discount">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <DiscountIcon fontSize="small" style={{ fontSize: 15 }} />
                      &nbsp;
                      <span>Mã giảm giá</span>
                    </div>
                  </Link>
                </>
              ),
            },
          ]}
        />
        <Title level={4}>Mã giảm giá</Title>
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

const ManagementDiscountContent = () => {
  const getUrl = "https://e-tailorapi.azurewebsites.net/api/discount";

  const { data: discount, isLoading: loading } = useQuery("get-discount", () =>
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
      width: 70,
      dataIndex: "stt",
      key: "index",
      fixed: "left",
    },

    {
      title: "Tên mã",
      dataIndex: "name",
      key: "1",
      width: 150,
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "2",
      width: 150,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startdate",
      key: "3",
      width: 150,
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "enđate",
      key: "4",
      width: 150,
    },
    {
      title: "Giám giá theo %",
      dataIndex: "discountpercent",
      key: "5",
      width: 150,
      render: (_, record) => <Text>{`${record.discountpercent}%`}</Text>,
    },
    {
      title: "Số tiền giảm",
      dataIndex: "discountprice",
      key: "6",
      width: 150,
      render: (_, record) => (
        <Text>
          {`${record.discountprice}đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </Text>
      ),
    },
    {
      title: "Điều kiện giảm giá tối thiểu",
      dataIndex: "conditionPriceMin",
      key: "7",
      width: 220,
    },
    {
      title: "Điều kiện giảm giá tối đa",
      dataIndex: "conditionPriceMax",
      key: "8",
      width: 200,
    },
    {
      title: "Sản phẩm tối thiểu",
      dataIndex: "conditionProductMin",
      key: "9",
      width: 200,
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "10",
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
          <Col span={4} offset={8}>
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

  const getApi = discount?.map((item, index) => ({
    id: item.id,
    stt: index + 1,
    name: item.name,
    code: item.code,
    startdate: new Date(item.startDate).toLocaleDateString(),
    enđate: new Date(item.endDate).toLocaleDateString(),
    discountpercent: item.discountPercent,
    discountprice: item.discountPrice,
    conditionPriceMin: item.conditionPriceMin,
    conditionPriceMax: item.conditionPriceMax,
    conditionProductMin: item.conditionProductMin,
  }));

  //------------------------------------------------------------Modal create-------------------------------------------------------
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const onCreate = (values) => {
    const { startDate, endDate } = values;
    console.log("success");
    if (startDate.isAfter(endDate)) {
      setError("Ngày bắt đầu không được lớn hơn ngày kết thúc");
      return;
    } else if (endDate.isBefore(startDate)) {
      setError("Ngày kết thúc không được bé hơn ngày bắt đầu");
      return;
    }
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
        <div style={{ maxWidth: "900px" }}>
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
            <Button>Tổng cộng ({manager?.totalData})</Button>
          </Col>
          <Col span={4} offset={12}>
            <Button
              type="primary"
              onClick={() => {
                setOpen(true);
              }}
            >
              Thêm mới
            </Button>
            <CollectionCreateForm
              open={open}
              onCreate={onCreate}
              onCancel={() => {
                setOpen(false);
              }}
              error={error}
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
          scroll={{
            x: 1500,
          }}
        />
      )}
    </div>
  );
};

const CollectionCreateForm = ({ open, onCreate, onCancel, error }) => {
  const [form] = Form.useForm();
  const [componentDisabled, setComponentDisabled] = useState(0);
  console.log(componentDisabled);

  const handleDisable = (value) => {
    console.log(value);
    if (value !== "") {
      setComponentDisabled(1);
    } else {
      setComponentDisabled(0);
    }
  };
  const handleDisable1 = (value) => {
    console.log(value);
    if (value !== "") {
      setComponentDisabled(2);
    } else {
      setComponentDisabled(0);
    }
  };

  return (
    <Modal
      open={open}
      style={{ top: 40 }}
      title="Thêm mới mã giảm giá"
      okText="Tạo mới"
      cancelText="Hủy bỏ"
      onCancel={() => {
        form.resetFields();
        setComponentDisabled(0);
        onCancel();
      }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            setComponentDisabled(0);
            onCreate(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        style={{
          height: 530,
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
          className="mt-2"
          hasFeedback
          name="name"
          label="Tên mã"
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
          hasFeedback
          name="code"
          label="Code"
          rules={[
            {
              required: true,
              message: "Code không được để trống",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          className="mt-2"
          hasFeedback
          label="Sản phẩm tối thiểu"
          name="conditionProductMin"
          rules={[
            {
              required: true,
              message: "Sản phẩm tối thiểu không được để trống",
            },
            {
              type: "number",
              min: 1,
              message: "Phải là một số lớn hơn hoặc bằng 1",
            },
          ]}
        >
          <InputNumber style={{ width: 472 }} />
        </Form.Item>
        <Row>
          <Col span={12}>
            <Form.Item
              className="mt-2"
              label="Ngày bắt đầu"
              name="startDate"
              rules={[
                {
                  required: true,
                  message: "Ngày bắt đầu không được để trống",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const endDate = getFieldValue("endDate");
                    if (!endDate || value.isBefore(endDate)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      "Ngày bắt đầu phải trước ngày kết thúc"
                    );
                  },
                }),
              ]}
            >
              <DatePicker style={{ width: 220 }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              className="mt-2 ml-4"
              label="Ngày kết thúc"
              name="endDate"
              rules={[
                {
                  required: true,
                  message: "Ngày kết thúc không được để trống",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const startDate = getFieldValue("startDate");
                    if (startDate && value.isBefore(startDate)) {
                      return Promise.reject(
                        "Ngày kết thúc phải sau ngày bắt đầu"
                      );
                    } else if (startDate && value.isSame(startDate, "day")) {
                      return Promise.reject(
                        "Ngày kết thúc không được trùng với ngày bắt đầu"
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <DatePicker style={{ width: 220 }} />
            </Form.Item>
          </Col>
        </Row>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <Row>
          <Col span={12}>
            {componentDisabled === 2 ? (
              <Form.Item
                hasFeedback
                className="mt-2"
                label="Giảm giá theo % (10-50)"
              >
                <InputNumber style={{ width: 220 }} disabled={true} />
              </Form.Item>
            ) : (
              <Form.Item
                hasFeedback
                className="mt-2"
                label="Giảm giá theo % (10-50)"
                name="discountPercent"
                onChange={(e) => handleDisable(e.target.value)}
                rules={[
                  {
                    required: true,
                    message: "Giảm giá theo % không được để trống",
                  },
                  {
                    type: "number",
                    min: 10,
                    max: 50,
                    step: 0.5,
                    message:
                      "Giảm giá phải là số nguyên và trong khoảng từ 10 - 50%",
                  },
                ]}
              >
                <InputNumber style={{ width: 220 }} />
              </Form.Item>
            )}
          </Col>
          {componentDisabled === 1 ? (
            <Col span={12}>
              <Form.Item className="mt-2 ml-4" hasFeedback label="Số tiền giảm">
                <InputNumber style={{ width: 220 }} disabled={true} />
              </Form.Item>
            </Col>
          ) : (
            <Col span={12}>
              <Form.Item
                className="mt-2 ml-4"
                hasFeedback
                label="Số tiền giảm"
                name="discountPrice"
                onChange={(e) => handleDisable1(e.target.value)}
                rules={[
                  {
                    required: true,
                    message: "Số tiền giảm không được để trống",
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
          )}
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              className="mt-2"
              hasFeedback
              label="Điều kiện giảm giá tối thiểu"
              name="conditionPriceMin"
              rules={[
                {
                  required: true,
                  message: "Điều kiện giảm giá tối thiểu không được để trống",
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
              className="mt-2 ml-4"
              hasFeedback
              label="Điều kiện giảm giá tối đa"
              name="conditionPriceMax"
              rules={[
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

function ManagementDiscount() {
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
        <ManagementDiscountHeader />
      </div>
      <div
        className="manager-content"
        style={{
          height: "83vh",
          overflowY: "scroll",
          border: "1px solid #9F78FF",
        }}
      >
        <ManagementDiscountContent />
      </div>
    </div>
  );
}

export default ManagementDiscount;
