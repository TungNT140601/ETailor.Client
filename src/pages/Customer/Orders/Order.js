import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";
import "./order.css";
import LeftBanner from "../../../assets/images/banner-blog/still-life-spring-wardrobe-switch (1).jpg";
import RightBanner from "../../../assets/images/banner-blog/still-life-spring-wardrobe-switch.jpg";
import NoOrder from "../../../assets/images/2011.i203.010..hobby cartoon set-06.jpg";
import { DownOutlined } from "@ant-design/icons";
import { Form, Radio, Space, Switch, Table, Tag, Image, Row, Col } from "antd";
import { useQuery } from "react-query";
import { render } from "@testing-library/react";

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
          src={RightBanner}
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
                  src={RightBanner}
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
];
const OrderDetails = ({ id }) => {
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const customer = localStorage.getItem("customer");
        const token = JSON.parse(customer)?.token;
        const response = await fetch(
          `https://etailorapi.azurewebsites.net/api/order/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const orderDetailsData = await response.json();
        setOrderDetails(orderDetailsData);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (!orderDetails) {
    return <p>Loading...</p>;
  }

  const parsedStatus = getStatusTextAndColor(orderDetails.status);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p className="title is-5" style={{ margin: 0 }}>
          Mã đơn: {orderDetails.id}
        </p>
        <p className="has-text-weight-semibold" style={{ padding: 15 }}>
          Trạng thái: <Tag color={parsedStatus.color}>{parsedStatus.text}</Tag>
        </p>
      </div>
      <Row>
        <Col span={8}>
          <p
            className="has-text-weight-semibold"
            style={{ padding: 5, color: "red" }}
          >
            Chưa thanh toán:{" "}
            {orderDetails?.unPaidMoney === 0
              ? "0đ"
              : formatCurrency(orderDetails.unPaidMoney)}
          </p>
        </Col>

        <Col span={8}>
          <p
            className="has-text-weight-semibold"
            style={{ padding: 5, color: "green" }}
          >
            Đã thanh toán:{" "}
            {orderDetails.paidMoney === 0
              ? "0đ"
              : formatCurrency(orderDetails.paidMoney)}
          </p>
        </Col>

        <Col span={8}>
          <p
            className="has-text-weight-semibold"
            style={{ padding: 5, color: "rgb(83 104 208)" }}
          >
            Tổng tiền :{" "}
            <span style={{ fontWeight: "bold" }}>
              {formatCurrency(orderDetails.totalPrice)}
            </span>
          </p>
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <p className="has-text-weight-semibold" style={{ padding: 5 }}>
            Tổng sản phẩm: {orderDetails.totalProduct}
          </p>
        </Col>

        <Col span={8}>
          {orderDetails.payDeposit ? (
            <p className="has-text-weight-semibold" style={{ padding: 5 }}>
              Tổng tiền :{" "}
              <span style={{ fontWeight: "bold" }}>
                {formatCurrency(orderDetails.totalPrice)}
              </span>
            </p>
          ) : (
            ""
          )}
        </Col>
      </Row>
      <div>
        <Row>
          {orderDetails.products.map((product, index) => (
            <Col span={8} key={index}>
              <Image
                width={60}
                height={60}
                src={product?.templateThumnailImage}
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
                        src={product?.templateThumnailImage}
                      />
                    </div>
                  ),
                }}
              />
              <div style={{ width: "fit-content" }}>
                <p
                  className="has-text-weight-semibold"
                  style={{ marginLeft: "5px" }}
                >
                  {product.name}
                </p>
                <p
                  className="has-text-weight-light"
                  style={{ marginLeft: "5px" }}
                >
                  {product?.description}
                </p>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

const defaultExpandable = {
  expandedRowRender: (record) => <OrderDetails id={record.id} />,
};
const formatDate = (date) => {
  const datetime = new Date(date);
  const day = datetime.getDate();
  const month = datetime.getMonth() + 1;
  const year = datetime.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
};
export default function Order() {
  const customer = localStorage.getItem("customer");
  const token = JSON.parse(customer)?.token;
  const { data: getOrdersAPI, isLoading } = useQuery("get-order", () =>
    fetch(`https://etailorapi.azurewebsites.net/api/order`, {
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
    productImg: order?.productImg ? order.productImg : "",
    quantity: order?.totalProduct,
    price: order?.totalPrice,
    status: order?.status,
    date: order?.createdTime ? formatDate(order.createdTime) : "Date error",
  }));
  const [amount, setAmount] = useState(0);
  console.log("orders:", getOrdersAPI);
  const [bordered, setBordered] = useState(true);
  const [loading, setLoading] = useState(false);

  const [expandable, setExpandable] = useState(defaultExpandable);
  const [showTitle, setShowTitle] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [tableLayout, setTableLayout] = useState();
  const [bottom, setBottom] = useState("bottomCenter");
  const [ellipsis, setEllipsis] = useState(false);
  const tableColumns = columns.map((item) => ({
    ...item,
    ellipsis,
  }));
  const handleExpandChange = (enable) => {
    setExpandable(enable ? defaultExpandable : undefined);
  };
  const tableProps = {
    bordered,
    loading,
    expandable,
    showHeader,
    tableLayout,
  };
  return (
    <>
      <div
        style={{
          padding: "140px 20px 0 20px",
          display: "flex",
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
