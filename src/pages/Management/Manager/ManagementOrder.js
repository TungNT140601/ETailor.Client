import React, { useEffect, useState } from "react";
import { HomeOutlined, EyeOutlined } from "@ant-design/icons";
import { Typography, Table, Checkbox } from "antd";
import "./index.css";

import { Col, Row, Tag, Button } from "antd";
import CircularProgress from "@mui/material/CircularProgress";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import Swal from "sweetalert2";
import ManagerHeader from "../../../components/ManagerHeader/index.js";
import { ViewDetailOrder } from "./ViewDetailOrder/ViewDetailOrder.js";

const { Text } = Typography;

const ManagementOrderContent = () => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [dataOrder, setDataOrder] = useState([]);
  const [loading, setLoading] = useState([]);
  const getUrl = "https://e-tailorapi.azurewebsites.net/api/order";

  const handleDataOrder = async () => {
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
        setDataOrder(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  useEffect(() => {
    handleDataOrder();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [saveIdOrder, setSaveIdOrder] = useState(null);

  const [checkStatus, setCheckStatus] = useState(null);

  const [cancelOrderLoading, setCancelOrderLoading] = useState(false);

  const [approveOrderLoading, setApproveOrderLoading] = useState(false);

  const [openRefund, setOpenRefund] = useState(false);
  const showModal = async (id, status) => {
    await setSaveIdOrder(id);
    await setCheckStatus(status);
    setIsModalOpen(true);
  };
  const handleApproveOrder = async (id) => {
    setApproveOrderLoading(true);
    const getUrl = `https://e-tailorapi.azurewebsites.net/api/order/approve/${id}`;
    try {
      const response = await fetch(getUrl, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.text();
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: responseData,
          showConfirmButton: false,
          timer: 4500,
          zIndex: 1000,
        });
        handleDataOrder();
        setIsModalOpen(false);
      } else if (response.status === 400 || response.status === 500) {
        const responseData = await response.text();
        Swal.fire({
          position: "top-center",
          icon: "error",
          title: responseData,
          showConfirmButton: false,
          timer: 4500,
          zIndex: 1000,
        });
      }
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      setApproveOrderLoading(false);
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleCancelOrder = async (id) => {
    setCancelOrderLoading(true);
    const getUrl = `https://e-tailorapi.azurewebsites.net/api/order/cancel/${id}`;
    try {
      const response = await fetch(getUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.text();
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: responseData,
          showConfirmButton: false,
          timer: 4500,
          zIndex: 1000,
        });
        handleDataOrder();
        setIsModalOpen(false);
        return 1;
      } else if (response.status === 400 || response.status === 500) {
        const responseData = await response.text();
        Swal.fire({
          position: "top-center",
          icon: "error",
          title: responseData,
          showConfirmButton: false,
          timer: 4500,
          zIndex: 1000,
        });
        return 0;
      }
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      setCancelOrderLoading(false);
    }
  };

  const handleConfirmRefund = (paidMoney) => {
    if (paidMoney > 0) {
      setOpenRefund(true);
    }
  };

  const columns = [
    {
      title: "STT",
      width: 70,
      dataIndex: "stt",
      key: "index",
      fixed: "left",
    },
    {
      title: "Mã đơn",
      width: 120,
      dataIndex: "id",
      key: "1",
      fixed: "left",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "2",
      width: 100,
      fixed: "left",
      render: (_, record) => {
        switch (record.status) {
          case 1:
            return <Tag color="purple">Chờ xác nhận</Tag>;
          case 2:
            return <Tag color="lime">Đã xác nhận</Tag>;
          case 3:
            return <Tag color="default">Chưa bắt đầu</Tag>;
          case 4:
            return <Tag color="blue">Trong quá trình</Tag>;
          case 5:
            return <Tag color="green">Hoàn thành</Tag>;
          case 6:
            return <Tag color="gold">Kiểm tra</Tag>;
          case 7:
            return <Tag color="volcano">Trả hàng</Tag>;
          case 8:
            return <Tag color="green">Đã giao</Tag>;
          default:
            return (
              <Tag color="red" style={{ display: "none" }}>
                Hủy đơn
              </Tag>
            );
        }
      },
    },
    {
      title: "Tổng giá tiền",
      dataIndex: "totalPrice",
      key: "4",
      width: 150,
      render: (_, record) => (
        <Text>
          {`${record.totalPrice}đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </Text>
      ),
    },
    {
      title: "Tiền đặt cọc đã trả",
      dataIndex: "payDeposit",
      key: "8",
      width: 120,
      render: (_, record) =>
        record.payDeposit ? (
          <Text>
            {`${record.payDeposit}đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </Text>
        ) : (
          <Text>{`0đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
        ),
    },
    {
      title: "Tiền đã trả",
      dataIndex: "paidMoney",
      key: "10",
      width: 100,
      render: (_, record) =>
        record.paidMoney ? (
          <Text>
            {`${record.paidMoney}đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </Text>
        ) : (
          <Text>{`0đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
        ),
    },
    {
      title: "Tiền còn lại",
      dataIndex: "unPaidMoney",
      key: "11",
      width: 100,
      render: (_, record) => (
        <Text>
          {`${record.unPaidMoney}đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </Text>
      ),
    },
    {
      title: "Tùy chỉnh",
      dataIndex: "Action",
      key: "12",
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
                onClick={() => showModal(record.id, record.status)}
              />
            </Col>
          </Row>
        </>
      ),
    },
  ];

  const getApi = dataOrder?.map((item, index) => ({
    stt: index + 1,
    id: item.id,
    status: item.status,
    totalProduct: item.totalProduct,
    totalPrice: item.totalPrice,
    discountPrice: item.discountPrice,
    discountCode: item.discountCode,
    afterDiscountPrice: item.afterDiscountPrice,
    payDeposit: item.payDeposit,
    deposit: item.deposit,
    paidMoney: item.paidMoney,
    unPaidMoney: item.unPaidMoney,
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
          scroll={{ x: 1000, y: 410 }}
        />
      )}
      {isModalOpen && saveIdOrder && checkStatus && (
        <ViewDetailOrder
          isModalOpen={isModalOpen}
          handleApproveOrder={handleApproveOrder}
          handleCancel={handleCancel}
          saveIdOrder={saveIdOrder}
          setSaveIdOrder={setSaveIdOrder}
          checkStatus={checkStatus}
          handleCancelOrder={handleCancelOrder}
          cancelOrderLoading={cancelOrderLoading}
          approveOrderLoading={approveOrderLoading}
          handleDataOrderContent={handleDataOrder}
          handleConfirmRefund={handleConfirmRefund}
          openRefund={openRefund}
          setOpenRefund={setOpenRefund}
        />
      )}
    </div>
  );
};

function ManagementOrder() {
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
          name={"Đơn hàng"}
          link={"/manager/orders"}
          iconHome={<HomeOutlined />}
          iconRoute={<ShoppingCartIcon style={{ fontSize: 15 }} />}
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
        <ManagementOrderContent />
      </div>
    </div>
  );
}

export default ManagementOrder;
