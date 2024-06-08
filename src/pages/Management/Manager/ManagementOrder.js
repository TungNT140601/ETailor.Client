import React, { useEffect, useState, useRef } from "react";
import {
  HomeOutlined,
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { Typography, Table, Checkbox, ConfigProvider, message } from "antd";
import "./index.css";
import { useSearchParams } from "react-router-dom";

import { Col, Row, Tag, Button, Input, Space } from "antd";
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
        setDataOrder(responseData);
      } else if (response.status === 400 || response.status === 500) {
        const responseData = await response.text();
        message.error(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      setLoading(false);
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
    Swal.fire({
      title: "Xác nhận hủy đơn hàng?",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: `Hủy bỏ`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
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
      } else if (result.dismiss) {
        Swal.fire("Hủy đơn thất bại", "", "info");
      }
    });
  };

  const handleConfirmRefund = (paidMoney) => {
    if (paidMoney > 0) {
      setOpenRefund(true);
    }
  };
  const handleStatusOrder = (status) => {
    switch (status) {
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
        return <Tag color="red">Hủy đơn</Tag>;
    }
  };

  //---------------------------------------------------------------Search id order----------------------------------------
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex, textPlaceholder) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Nhập ${textPlaceholder}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Hủy
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Lọc
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Đóng
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "STT",
      width: 40,
      dataIndex: "stt",
      key: "index",
      fixed: "left",
    },
    {
      title: "Ngày tạo",
      width: 100,
      dataIndex: "createdTime",
      key: "createdTime",
      fixed: "left",
      ...getColumnSearchProps("createdTime", "ngày tạo"),
    },

    {
      title: "Mã đơn",
      width: 120,
      dataIndex: "id",
      key: "1",
      fixed: "left",
      ...getColumnSearchProps("id", "mã đơn"),
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "3",
      width: 100,
      fixed: "left",
      render: (_, record) => handleStatusOrder(record.status),
      showSorterTooltip: {
        target: "full-header",
      },
      filters: [
        {
          text: "Chờ xác nhận",
          value: 1,
        },
        {
          text: "Đã xác nhận",
          value: 2,
        },
        {
          text: "Chưa bắt đầu",
          value: 3,
        },
        {
          text: "Trong quá trình",
          value: 4,
        },
        {
          text: "Hoàn thành",
          value: 5,
        },
        {
          text: "Kiểm tra",
          value: 6,
        },
        {
          text: "Trả hàng",
          value: 7,
        },
        {
          text: "Đã giao",
          value: 8,
        },
      ],
      onFilter: (value, record) => {
        if (value === record.status) {
          return record;
        }
      },
    },
    {
      title: "Khách hàng",
      width: 120,
      dataIndex: "cusName",
      key: "2",
      ...getColumnSearchProps("cusName", "tên khách hàng"),
    },
    {
      title: "Ngày dự kiến hoàn thành",
      width: 150,
      dataIndex: "plannedTime",
      key: "plannedTime",
      render: (_, record) =>
        record.status !== 0 &&
        (record.plannedTime < new Date().toISOString() &&
        record.status !== 8 &&
        record.status !== 5 ? (
          <Text
            style={{ fontSize: 15, fontWeight: "bold" }}
            type="danger"
            underline
          >
            {new Date(record.plannedTime).toLocaleDateString("vn-VI", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </Text>
        ) : (
          <Text style={{ fontSize: 15, fontWeight: "bold", color: "#9F78FF" }}>
            {new Date(record.plannedTime).toLocaleDateString("vn-VI", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </Text>
        )),
      sorter: (a, b) => new Date(a.plannedTime) - new Date(b.plannedTime),
    },
    {
      title: "Tổng giá tiền",
      dataIndex: "totalPrice",
      key: "4",
      width: 100,
      render: (_, record) => (
        <Text>
          {`${record.totalPrice}đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </Text>
      ),
    },
    {
      title: "Tiền đã trả",
      dataIndex: "paidMoney",
      key: "5",
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
      key: "6",
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
      key: "7",
      width: 80,
      fixed: "right",
      render: (_, record) => (
        <>
          {record.status !== 0 && (
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
          )}
        </>
      ),
    },
  ];
  const [searchParams, setSearchParams] = useSearchParams();
  const onFilterStatus = (pagination, filters, sorter, extra) => {
    const statusFilter = filters["2"];

    if (statusFilter) {
      setSearchParams({ status: statusFilter });
    } else {
      setSearchParams({});
    }
  };

  useEffect(() => {
    if (searchParams) {
      setSearchParams({});
    }
  }, []);

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
    plannedTime: item.plannedTime,
    cusName: item.cusName,
    createdTime: new Date(item.createdTime).toLocaleDateString("vn-VI", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
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
        <Space>
          <Button>Tổng cộng ({getApi?.length})</Button>
          <Button onClick={() => handleDataOrder()}>
            <ReloadOutlined />
          </Button>
        </Space>
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
        <ConfigProvider
          theme={{
            components: {
              Table: {
                /* here is your component tokens */
              },
            },
          }}
        >
          <Table
            columns={newColumns}
            dataSource={getApi}
            showSorterTooltip={{
              target: "sorter-icon",
            }}
            onChange={onFilterStatus}
            pagination={{
              position: ["bottomCenter"],
              locale: { items_per_page: " / trang" },
            }}
            style={{
              marginTop: 24,
            }}
            scroll={{ x: 1500, y: 410 }}
            className="custom-table-orders"
          />
        </ConfigProvider>
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
