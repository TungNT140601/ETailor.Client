import React, { useState } from "react";
import { Breadcrumb } from "antd";
import CircularProgress from "@mui/material/CircularProgress";
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
import { Typography, Carousel, Table, Checkbox, Modal } from "antd";
import "./index.css";

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

const ManagementCustomerHeader = () => {
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
                      <span>Thông tin khách hàng</span>
                    </div>
                  </Link>
                </>
              ),
            },
          ]}
        />
        <Title level={4}>Thông tin khách hàng</Title>
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

const ManagementCustomerContent = () => {
  const manager = JSON.parse(localStorage.getItem("manager"));

  const getUrl =
    "https://e-tailorapi.azurewebsites.net/api/customer-management";

  const { data: getCustomer, isLoading: loading } = useQuery(
    "get-customer",
    () =>
      fetch(getUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      }).then((response) => response.json())
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
        <Image width={40} height={40} src={record.avatar} />
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
      width: 100,
      fixed: "right",
      render: () => (
        <>
          <Row justify="start">
            <Col span={4}>
              <EyeOutlined
                title="Xem chi tiết"
                style={{
                  backgroundColor: "rgb(140, 173, 245)",
                  color: "white",
                  padding: 6,
                  borderRadius: "5px",
                  fontSize: 15,
                  cursor: "pointer",
                }}
                onClick={showModal}
              />
            </Col>
          </Row>
        </>
      ),
    },
  ];

  const getApi = getCustomer?.map((item, index) => ({
    id: item.id,
    stt: index,
    avatar: item.avatar,
    username: item.username,
    fullname: item.fullname,
    address: item.address,
    phone: item.phone,
  }));

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

  //---------------------------------------------------------------------------------------------------------------------------------------------------------

  const onChange = (currentSlide) => {
    console.log(currentSlide);
  };

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
        <Row justify="start">
          <Col span={4}>
            <Button>Tổng cộng ({getApi?.length})</Button>
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
          scroll={{ y: 428 }}
        />
      )}

      <Modal
        title="Hồ sơ số đo"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 24,
          }}
        >
          <div>
            <Avatar
              src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
              style={{ width: 100, height: 100 }}
            />
            <Title
              level={4}
              style={{
                marginTop: 10,
              }}
            >
              Đào Anh Tú
            </Title>
          </div>
        </div>
        <Divider />
        <div
          style={{
            marginTop: 24,
          }}
        >
          <Row justify="center">
            <Col span={12}>
              <Title level={5}>Thông tin người dùng</Title>
              <div
                style={{
                  border: "1px solid #9F78FF",
                  width: 360,
                  height: 200,
                  padding: "0px 10px",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    marginTop: 10,
                  }}
                >
                  <Text level={5}>
                    <b>Tên người dùng:</b> anhtu21
                  </Text>
                </div>
                <div
                  style={{
                    marginTop: 10,
                  }}
                >
                  <Text level={5}>
                    <b>Họ và tên:</b> Đào Anh Tú
                  </Text>
                </div>
                <div
                  style={{
                    marginTop: 10,
                  }}
                >
                  <Text level={5}>
                    <b>Địa chỉ:</b> 117/18 Phan văn hân phường 17 quận bình
                    thạnh
                  </Text>
                </div>
                <div
                  style={{
                    marginTop: 10,
                  }}
                >
                  <Text level={5}>
                    <b>Số điện thoại:</b> 0937550256
                  </Text>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <Title level={5}>Profile số đo cơ thể</Title>
              <Carousel afterChange={onChange} id="carousel-management-cus">
                <div>
                  <Card
                    size="small"
                    title="Tên profile"
                    style={{
                      width: 370,
                      height: 200,
                      border: "1px solid #9F78FF",
                    }}
                  >
                    <Row gutter={[16, 12]}>
                      <Col className="gutter-row" span={12}>
                        <div>
                          <p>Số đo ngực: 1 cm</p>
                        </div>
                      </Col>

                      <Col className="gutter-row" span={12}>
                        <div>
                          <p>Số đo eo: 1 cm</p>
                        </div>
                      </Col>
                      <Col className="gutter-row" span={12}>
                        <div>
                          <p>Số đo tay: 1 cm</p>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </div>
                <div>
                  <Card
                    size="small"
                    title="Tên profile"
                    style={{
                      width: 370,
                      height: 200,
                      border: "1px solid #9F78FF",
                    }}
                  >
                    <Row gutter={[16, 12]}>
                      <Col className="gutter-row" span={12}>
                        <div>
                          <p>Số đo ngực: 1 cm</p>
                        </div>
                      </Col>

                      <Col className="gutter-row" span={12}>
                        <div>
                          <p>Số đo eo: 1 cm</p>
                        </div>
                      </Col>
                      <Col className="gutter-row" span={12}>
                        <div>
                          <p>Số đo tay: 1 cm</p>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </div>
                <div>
                  <Card
                    size="small"
                    title="Tên profile"
                    style={{
                      width: 370,
                      height: 200,
                      border: "1px solid #9F78FF",
                    }}
                  >
                    <Row gutter={[16, 12]}>
                      <Col className="gutter-row" span={12}>
                        <div>
                          <p>Số đo ngực: 1 cm</p>
                        </div>
                      </Col>

                      <Col className="gutter-row" span={12}>
                        <div>
                          <p>Số đo eo: 1 cm</p>
                        </div>
                      </Col>
                      <Col className="gutter-row" span={12}>
                        <div>
                          <p>Số đo tay: 1 cm</p>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </div>
              </Carousel>
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
};

function ManagementCustomer() {
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
        <ManagementCustomerHeader />
      </div>
      <div
        className="manager-content"
        style={{
          height: "83vh",
          overflowY: "scroll",
          border: "1px solid #9F78FF",
        }}
      >
        <ManagementCustomerContent />
      </div>
    </div>
  );
}

export default ManagementCustomer;
