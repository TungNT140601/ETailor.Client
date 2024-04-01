import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";
import "./order.css";
import SendIcon from '@mui/icons-material/Send';
import LeftBanner from "../../../assets/images/banner-blog/still-life-spring-wardrobe-switch (1).jpg";
import RightBanner from "../../../assets/images/banner-blog/still-life-spring-wardrobe-switch.jpg";
import NoOrder from "../../../assets/images/2011.i203.010..hobby cartoon set-06.jpg";
import { DownOutlined } from "@ant-design/icons";
import { Divider, Table, Tag, Avatar, Image, Row, Col } from "antd";
import { useQuery } from "react-query";
import { render } from "@testing-library/react";
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import { EyeOutlined, UserOutlined, CheckCircleFilled } from '@ant-design/icons';
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
      text = "Đã huỷ";
    case 1:
      color = "geekblue";
      text = "Chờ duyệt";
      break;
    case 2:
      color = "geekblue";
      text = "Đã duyệt";
      break;
    case 3:
      color = "volcano";
      text = "Chưa bắt đầu";
      break;
    case 4:
      color = "volcano";
      text = "Đang xử lý";
      break;
    case 5:
      color = "green";
      text = "Hoàn thiện";
      break;
    case 6:
      color = "green";
      text = "Kiểm thử thành";
      break;
    case 7:
      color = "green";
      text = "Hoàn tất & nhận hàng";
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
  const navigate = useNavigate();
  const columns = [
    {
      title: "Stt",
      dataIndex: "index",
    },

    {
      title: "Hình ảnh",
      dataIndex: "productImg",
      render: (imgSrc) => {
        return (
          <Image
            width={60}
            height={60}
            src={imgSrc}
            style={{ objectFit: "cover" }}
            alt=""
            preview={{
              imageRender: () => (
                <div
                  style={{
                    marginTop: "60px",
                    height: "65%",
                    overflowY: "hidden",
                  }}
                >
                  <Image
                    width="100%"
                    height="100%"
                    style={{ objectFit: "cover" }}
                    src={imgSrc}
                  />
                </div>
              ),
            }}
          />
        );
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
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
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "5",
      width: 120,
      fixed: "right",
      render: (id) => (
        <>
          <p onClick={() => handleViewDetail(id)} style={{ fontSize: 12, fontWeight: "bold", color: "primary", cursor: "pointer" }}>Xem chi tiết</p>
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
    id: order.id,
    key: order.id,
    productName: order?.productName ? order.productName : "",
    productImg: order?.thumbnailImage ? order.thumbnailImage : "",
    quantity: order?.totalProduct,
    price:  order?.totalPrice? formatCurrency(order.totalPrice) : "Price error",
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
  const handleViewDetail = (id) => {
    console.log("detail id;", id)
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
          display: "flex",
          position: "relative",
          columnGap: "20px",
          position: "relative",
          alignContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: "200px",
            left: "60px",
            top: "200px",
            height: "fit-content",
            position: "absolute",
          }}
        >
          <img src={LeftBanner} alt="Left Banner" loading="lazy" />
        </div>
        <div></div>
        <div
          style={{
            width: "100%",
            display: "flex",
            height: "600px",
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
        <div
          style={{
            overflowX: "hidden",
            height: "fit-content",
            position: "absolute",
            top: "200px",
            right: "60px",
          }}
        >
          <img
            src={RightBanner}
            alt="Right Banner"
            width={200}
            loading="lazy"
          />
        </div>
   
      </div>
    </>
  );
}
