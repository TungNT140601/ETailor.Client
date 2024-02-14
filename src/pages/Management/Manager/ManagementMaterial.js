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
  LoadingOutlined,
} from "@ant-design/icons";
import "./index.css";
import FactCheckIcon from "@mui/icons-material/FactCheck";
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
  Typography,
  Carousel,
  Table,
  Checkbox,
  Modal,
  Input,
  Button,
  Flex,
  Divider,
  Image,
  InputNumber,
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

const ManagementMaterialHeader = () => {
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
              href: "/manager/material",
              title: (
                <>
                  <Link to="/manager/material">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "#9F78FF",
                      }}
                    >
                      <FactCheckIcon
                        fontSize="small"
                        style={{ fontSize: "18px" }}
                      />
                      &nbsp;
                      <span>Nguyên liệu</span>
                    </div>
                  </Link>
                </>
              ),
            },
          ]}
        />
        <Title level={4}>Nguyên liệu</Title>
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

const ManagementMaterialContent = () => {
  //   const getStaffUrl = "https://etailorapi.azurewebsites.net/api/staff";
  //   const manager = JSON.parse(localStorage.getItem("manager"));
  //   const { data: staffs, isLoading: loading } = useQuery("getStaffs", () =>
  //     fetch(getStaffUrl, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${manager?.token}`,
  //       },
  //     }).then((response) => response.json())
  //   );

  //   const getApi = staffs?.data?.map((item) => ({
  //     stt: item.stt,
  //     avatar: item.avatar,
  //     username: item.username,
  //     fullname: item.fullname,
  //     address: item.address,
  //     phone: item.phone,
  //   }));

  //--------------------------------------------------------------------data table Material-------------------------------------------------

  const columns = [
    {
      title: "STT",
      width: "4%",
      dataIndex: "stt",
      key: "index",
      fixed: "left",
    },
    {
      title: "Hình ảnh",
      width: "7%",
      dataIndex: "image",
      key: "image",
      render: () => (
        <Image
          width={30}
          height={30}
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
      ),
    },
    {
      title: "Tên nguyên liệu",
      dataIndex: "name",
      key: "1",
      width: "7%",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "2",
      width: "7%",
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "6",
      width: "5%",
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
          <Col span={4} offset={1}>
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

  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      stt: i,
      name: `Nguyên liệu ${i}`,
      quantity: `${i}`,
    });
  }

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
      <>
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
              <CreateMaterial
                open={open}
                onCreate={onCreate}
                onCancel={() => {
                  setOpen(false);
                }}
              />
            </Col>
          </Row>
        </div>

        <Table
          columns={newColumns}
          dataSource={data}
          pagination={{
            position: ["bottomCenter"],
          }}
          style={{
            marginTop: 24,
          }}
        />
      </>
    </div>
  );
};

const CreateMaterial = ({ open, onCreate, onCancel }) => {
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
      style={{ top: 155 }}
      title="Thêm mới nguyên liệu"
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
          height: 200,
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
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "25px",
                marginRight: "15px",
              }}
            >
              <Form.Item
                name="image"
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
                      alt="imageMaterial"
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
          <Col span={12}>
            <div>
              <Form.Item
                name="name"
                label="Tên nguyên liệu"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Tên nguyên liệu không được để trống",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="quantity"
                label="Số lượng"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Số lượng phải là số và không được để trống",
                  },
                  {
                    type: "number",
                    min: 1,
                    message: "Số lượng ít nhất là 1",
                  },
                ]}
              >
                <InputNumber
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

function ManagementMaterialTypeContent() {
  const columns2 = [
    {
      title: "STT",
      width: "10%",
      dataIndex: "stt",
      key: "index",
      fixed: "left",
    },

    {
      title: "Tên loại nguyên liệu",
      dataIndex: "name",
      key: "1",
      width: "35%",
    },
    {
      title: "Đơn vị đo",
      dataIndex: "unit",
      key: "2",
      width: "35%",
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "3",
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
          <Col span={4}>
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

  const data2 = [];
  for (let i = 0; i < 100; i++) {
    data2.push({
      stt: i,
      name: `Edward ${i}`,
      unit: `${i} cái`,
    });
  }

  //------------------------------------------------------------Modal create-------------------------------------------------------
  const [open, setOpen] = useState(false);
  const onCreate = (values) => {
    console.log("Received values of form: ", values);
    setOpen(false);
  };

  const defaultCheckedList2 = columns2.map((item) => item.key);
  const [checkedList2, setCheckedList2] = useState(defaultCheckedList2);
  const options2 = columns2.map(({ key, title }) => ({
    label: title,
    value: key,
  }));
  const newColumns2 = columns2.map((item) => ({
    ...item,
    hidden: !checkedList2.includes(item.key),
  }));

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Checkbox.Group
            value={checkedList2}
            options={options2}
            onChange={(value) => {
              setCheckedList2(value);
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
            <CreateMaterialType
              open={open}
              onCreate={onCreate}
              onCancel={() => {
                setOpen(false);
              }}
            />
          </Col>
        </Row>
      </div>

      <Table
        columns={newColumns2}
        dataSource={data2}
        pagination={{
          position: ["bottomCenter"],
        }}
        style={{
          marginTop: 24,
        }}
      />
    </>
  );
}

const CreateMaterialType = ({ open, onCreate, onCancel }) => {
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
      style={{ top: 155 }}
      title="Thêm mới loại nguyên liệu"
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
          height: 200,
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
        <div>
          <Form.Item
            name="name"
            label="Tên nguyên liệu"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Tên nguyên liệu không được để trống",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Đơn vị tính"
            name="unit"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Đơn vị tính không được để trống",
              },
            ]}
          >
            <Select>
              <Select.Option value="m">Met</Select.Option>
              <Select.Option value="cái">Cái</Select.Option>
              <Select.Option value="hộp">Hộp</Select.Option>
              <Select.Option value="Bịch">Bịch</Select.Option>
            </Select>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

function ManagementMaterialCategoryContent() {
  const columns1 = [
    {
      title: "STT",
      width: "10%",
      dataIndex: "stt",
      key: "index",
      fixed: "left",
    },

    {
      title: "Số lượng",
      dataIndex: "name",
      key: "1",
      width: "35%",
    },
    {
      title: "Giá tiền theo đơn vị",
      dataIndex: "pricePerUnit",
      key: "1",
      width: "35%",
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "2",
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
          <Col span={4}>
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

  const data1 = [];
  for (let i = 0; i < 100; i++) {
    data1.push({
      stt: i,
      name: `Edward ${i}`,
      pricePerUnit: `${i}`,
    });
  }

  //------------------------------------------------------------Modal create-------------------------------------------------------
  const [open, setOpen] = useState(false);
  const onCreate = (values) => {
    console.log("Received values of form: ", values);
    setOpen(false);
  };

  const defaultCheckedList1 = columns1.map((item) => item.key);
  const [checkedList1, setCheckedList1] = useState(defaultCheckedList1);
  const options1 = columns1.map(({ key, title }) => ({
    label: title,
    value: key,
  }));
  const newColumns1 = columns1.map((item) => ({
    ...item,
    hidden: !checkedList1.includes(item.key),
  }));

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Checkbox.Group
            value={checkedList1}
            options={options1}
            onChange={(value) => {
              setCheckedList1(value);
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
            <CreateMaterialCategory
              open={open}
              onCreate={onCreate}
              onCancel={() => {
                setOpen(false);
              }}
            />
          </Col>
        </Row>
      </div>

      <Table
        columns={newColumns1}
        dataSource={data1}
        pagination={{
          position: ["bottomCenter"],
        }}
        style={{
          marginTop: 24,
        }}
      />
    </>
  );
}

const CreateMaterialCategory = ({ open, onCreate, onCancel }) => {
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
      style={{ top: 155 }}
      title="Thêm mới danh mục"
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
          height: 200,
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
        <div>
          <Form.Item
            name="quantity"
            label="Số lượng"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Số lượng phải là số và không được để trống",
              },
              {
                type: "number",
                min: 1,
                message: "Số lượng ít nhất là 1",
              },
            ]}
          >
            <InputNumber
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
          <Form.Item
            name="pricePerUnit "
            label="Giá tiền theo đơn vị"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Giá tiền theo đơn vị không được để trống",
              },
              {
                type: "number",
                min: 1,
                message: "Giá tiền theo đơn vị phải là số và ít nhất là 1",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export function ManagementMaterialCategory() {
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
        <ManagementMaterialHeader />
      </div>
      <div
        className="manager-content"
        style={{
          height: "83vh",
          overflowY: "scroll",
          border: "1px solid #9F78FF",
        }}
      >
        <ManagementMaterialCategoryContent />
      </div>
    </div>
  );
}

export function ManagementMaterialType() {
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
        <ManagementMaterialHeader />
      </div>
      <div
        className="manager-content"
        style={{
          height: "83vh",
          overflowY: "scroll",
          border: "1px solid #9F78FF",
        }}
      >
        <ManagementMaterialTypeContent />
      </div>
    </div>
  );
}

function ManagementMaterial() {
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
        <ManagementMaterialHeader />
      </div>
      <div
        className="manager-content"
        style={{
          height: "83vh",
          overflowY: "scroll",
          border: "1px solid #9F78FF",
        }}
      >
        <ManagementMaterialContent />
      </div>
    </div>
  );
}

export default ManagementMaterial;
