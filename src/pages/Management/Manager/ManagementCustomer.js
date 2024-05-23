import React, { useEffect, useState } from "react";
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
import toast, { Toaster } from "react-hot-toast";
import ManagerHeader from "../../../components/ManagerHeader";

const { Search, TextArea } = Input;
const { Title, Text } = Typography;
const { Meta } = Card;
const { Option } = Select;

const ManagementCustomerContent = () => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [getCustomer, setGetCustomer] = useState([]);
  const [getDetailCustomer, setGetDdetailCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const getUrl =
    "https://e-tailorapi.azurewebsites.net/api/customer-management";
  const getDetailUrl =
    "https://e-tailorapi.azurewebsites.net/api/customer-management/info/";

  const handleGetCustomer = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${getUrl}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setGetCustomer(responseData);
        setLoading(false);
        return 1;
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };
  const handleGetDetailCustomer = async (id) => {
    setDetailLoading(true);
    try {
      const response = await fetch(`${getDetailUrl}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("responseData", responseData);
        setGetDdetailCustomer(responseData);
        setDetailLoading(false);
        return 1;
      } else if (response.status === 400 || response.status === 500) {
        const responseData = await response.text();
        toast.error(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };
  useEffect(() => {
    handleGetCustomer();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = (id) => {
    handleGetDetailCustomer(id);
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
        <Image
          width={40}
          height={40}
          src={
            record.avatar
              ? record.avatar
              : "https://api.dicebear.com/7.x/miniavs/svg?seed=1"
          }
        />
      ),
    },
    // {
    //   title: "Tên người dùng",
    //   dataIndex: "username",
    //   key: "1",
    //   width: 150,
    // },
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
      width: 100,
      fixed: "right",
      render: (_, record) => (
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
                onClick={() => showModal(record.id)}
              />
            </Col>
          </Row>
        </>
      ),
    },
  ];

  const getApi = getCustomer?.map((item, index) => ({
    id: item.id,
    stt: index + 1,
    avatar: item.avatar,
    // username: item.username,
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
      <Toaster />
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
        title={`Khách hàng ${getDetailCustomer?.fullname}`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        style={{ top: 200 }}
        okText="OK"
        cancelText="Đóng"
      >
        {detailLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "250px",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <>
            <div
              style={{
                marginTop: 24,
              }}
            >
              <Row justify="center">
                <Col span={12}>
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Avatar
                          src={
                            getDetailCustomer?.avatar
                              ? getDetailCustomer?.avatar
                              : "https://api.dicebear.com/7.x/miniavs/svg?seed=1"
                          }
                          style={{ width: 100, height: 100 }}
                        />
                      </div>

                      <Title
                        level={4}
                        style={{
                          whiteSpace: "nowrap",
                          width: "300px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          marginTop: 10,
                          textAlign: "center",
                        }}
                      >
                        {getDetailCustomer?.fullname}
                      </Title>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <Title level={5}>Thông tin khách hàng</Title>
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
                        marginTop: 15,
                      }}
                    >
                      <Text level={5}>
                        <b>Họ và tên:</b> {getDetailCustomer?.fullname}
                      </Text>
                    </div>
                    <div
                      style={{
                        marginTop: 15,
                      }}
                    >
                      <Text level={5}>
                        <b>Email:</b>{" "}
                        {getDetailCustomer?.email
                          ? getDetailCustomer?.email
                          : "Chưa có"}
                      </Text>
                    </div>
                    <div
                      style={{
                        marginTop: 15,
                      }}
                    >
                      <Text level={5}>
                        <b>Địa chỉ:</b>{" "}
                        {getDetailCustomer?.address
                          ? getDetailCustomer?.address
                          : "Chưa có"}
                      </Text>
                    </div>
                    <div
                      style={{
                        marginTop: 15,
                      }}
                    >
                      <Text level={5}>
                        <b>Số điện thoại:</b> {getDetailCustomer?.phone}
                      </Text>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </>
        )}
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
        <ManagerHeader
          name={"Thông tin khách hàng"}
          link={"/manager/account/customer"}
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
        <ManagementCustomerContent />
      </div>
    </div>
  );
}

export default ManagementCustomer;
