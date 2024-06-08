import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";
import "./order.css";
import Highlighter from 'react-highlight-words';
import SendIcon from '@mui/icons-material/Send';
import LeftBanner from "../../../assets/images/banner-blog/still-life-spring-wardrobe-switch (1).jpg";
import RightBanner from "../../../assets/images/banner-blog/still-life-spring-wardrobe-switch.jpg";
import NoOrder from "../../../assets/images/2011.i203.010..hobby cartoon set-06.jpg";
import { DownOutlined } from "@ant-design/icons";
import { Divider, Table, Tag, Avatar, Image, Row, Col, Input, Space } from "antd";
import { useQuery } from "react-query";
import { render } from "@testing-library/react";
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import { EyeOutlined, UserOutlined, CheckCircleFilled, SearchOutlined } from '@ant-design/icons';
import { faImage, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

function formatString(str) {
  if (str.length <= 8) return str;

  const firstFour = str.slice(0, 4);
  const lastFour = str.slice(-4);

  return `${firstFour}...${lastFour}`; // Return the formatted string
}

const originalString = "cb1d2490-1485-4824-afc8-6b0d76";
const formattedString = formatString(originalString);
console.log(formattedString);

const getStatusTextAndColor = (status) => {
  let color;
  let text;
  switch (status) {
    case 0:
      color = "red";
      text = "Huỷ đơn";
      break;
    case 1:
      color = "purple";
      text = "Chờ xác nhận";
      break;
    case 2:
      color = "lime";
      text = "Đã xác nhận";
      break;
    case 3:
      color = "default";
      text = "Chưa bắt đầu";
      break;
    case 4:
      color = "blue";
      text = "Đang xử lý";
      break;
    case 5:
      color = "green";
      text = "Hoàn thành";
      break;
    case 6:
      color = "gold";
      text = "Kiểm tra";
      break;
    case 7:
      color = "volcano";
      text = "Trả hàng";
      break;
    case 8:
      color = "green";
      text = "Đã giao";
      break;
  }
  return { color, text };
};
function formatCurrency(amount) {
  if (amount) {
    const strAmount = amount.toString();
    const parts = [];
    for (let i = strAmount.length - 1, j = 0; i >= 0; i--, j++) {
      if (j > 0 && j % 3 === 0) {
        parts.unshift(".");
      }
      parts.unshift(strAmount[i]);
    }
    return parts.join("") + "đ";
  }
  return null;
}
const formatDate = (date) => {
  const datetime = new Date(date);
  const day = datetime.getDate();
  const month = datetime.getMonth() + 1;
  const year = datetime.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
};
export default function Order() {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
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
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
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
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
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
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  const navigate = useNavigate();
  const columns = [
    {
      title: "Stt",
      dataIndex: "index",

    },
    {
      title: "Mã đơn hàng",
      dataIndex: "orderID",
      render: (orderID) => {
        return <p style={{ fontWeight: "bold" }}>{orderID}</p>;
      }
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
      render: (quantity) => {
        return <p style={{ textAlign: "center" }}>{quantity}</p>;
      }
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        const parsedStatus = getStatusTextAndColor(status);
        return (
          <span>
            <Tag color={parsedStatus.color} key={status}>
              {parsedStatus.text}
            </Tag>
          </span>
        );
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "price",
    },
    {
      title: "Ngày mua",
      dataIndex: "date",
      ...getColumnSearchProps('date'),
    },
    {
      title: "",
      dataIndex: "",
      key: "5",
      width: 120,
      fixed: "right",
      render: (text, record) => (
        <>
          {record.status === 0 ? (

            < p
              style={{ fontSize: 12, fontWeight: "bold", color: "rgba(16, 16, 16, 0.3", cursor: "pointer" }}
            >
              Xem chi tiết
            </p>
          ) : (
            <p
              onClick={() => handleViewDetail(record.orderID, record.status)}
              style={{ fontSize: 12, fontWeight: "bold", color: "primary", cursor: "pointer" }}
            >
              Xem chi tiết
            </p>
          )
          }
        </>
      ),
    },
  ];
  const customer = localStorage.getItem("customer");
  const token = JSON.parse(customer)?.token;
  const { data: getOrdersAPI, isLoading } = useQuery("get-order", () =>
    fetch(`https://e-tailorapi.azurewebsites.net/api/order`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => response.json())
  );
  const orders = getOrdersAPI?.map((order, index) => ({
    index: index + 1,
    orderID: order.id,
    key: order.id,
    productName: order?.productName ? order.productName : "",
    productImg: order?.thumbnailImage ? order.thumbnailImage : "",
    quantity: order?.totalProduct,
    price: order?.totalPrice ? formatCurrency(order.totalPrice) : "Price error",
    status: order?.status,
    date: order?.createdTime ? formatDate(order.createdTime) : "Date error",
  }));
  const [amount, setAmount] = useState(0);
  console.log("orders:", getOrdersAPI);
  const [bordered, setBordered] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [tableLayout, setTableLayout] = useState();
  const [bottom, setBottom] = useState("bottomCenter");
  const [ellipsis, setEllipsis] = useState(false);
  const handleViewDetail = (id, status) => {
    console.log("detail id;", id)
    console.log("status:", status)
    navigate(`/orders/${id}`)
  }
  const tableColumns = columns.map((item) => ({
    ...item,
    ellipsis,
  }));
  const tableProps = {
    bordered,
    loading,
    showHeader,
    tableLayout,
  };

  return (
    <>
      <div
        style={{
          padding: "140px 20px 0 20px",
        }}
      >{/*  */}
        <div></div>
        <div
          style={{
            width: "100%",
            display: "flex",
            height: "fit-content",
            justifyContent: "center",
            position: "",
          }}
        >
          <div style={{ marginTop: "40px" }}>
            <Table
              {...tableProps}
              pagination={{
                position: [bottom],
              }}
              columns={tableColumns}
              dataSource={orders}
              size="large"
              className="is-family-code"
            />
          </div>
        </div>


      </div>
    </>
  );
}
