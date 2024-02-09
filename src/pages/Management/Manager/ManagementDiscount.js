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
import { Typography, Carousel, Table, Checkbox } from "antd";
import "./index.css";
import DiscountIcon from "@mui/icons-material/Discount";

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
  const getUrl = "https://etailorapi.azurewebsites.net/api/discount";

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
    },
    {
      title: "Số tiền giảm",
      dataIndex: "discountprice",
      key: "6",
      width: 150,
    },
    {
      title: "Điều kiện giảm giá tối thiểu",
      dataIndex: "conditionPriceMin",
      key: "7",
      width: 200,
    },
    {
      title: "Điều kiện giảm giá tối đa",
      dataIndex: "conditionPriceMax",
      key: "8",
      width: 200,
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "9",
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
    stt: index + 1,
    name: item.name,
    code: item.code,
    startdate: new Date(item.startDate).toLocaleDateString(),
    enđate: new Date(item.endDate).toLocaleDateString(),
    discountpercent: item.discountPercent,
    discountprice: item.discountPrice,
    conditionPriceMin: item.conditionPriceMin,
    conditionPriceMax: item.conditionPriceMax,
  }));

  console.log(getApi);

  // const data = [];
  // for (let i = 0; i < 100; i++) {
  //   data.push({
  //     stt: i,
  //     name: `Tudeptrai${i}`,
  //     code: `21050${i}`,
  //     startdate: `29/1/2024`,
  //     enđate: `30/1/2024`,
  //     discountpercent: `100`,
  //     discountprice: `2.000.000`,
  //   });
  // }

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
            <Button>Tổng cộng ({manager?.totalData})</Button>
          </Col>
          <Col span={4} offset={12}>
            <Button type="primary">Thêm mới</Button>
          </Col>
        </Row>
      </div>

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
    </div>
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
