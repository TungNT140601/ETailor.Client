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
} from "@ant-design/icons";
import { Typography, Carousel, Table, Checkbox } from "antd";
import "./index.css";
import FactCheckIcon from "@mui/icons-material/FactCheck";

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
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <FactCheckIcon fontSize="small" />
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
          <UserOutlined
            style={{
              fontSize: "24px",
            }}
          />
          &nbsp; &nbsp;
          <Text>{manager?.name}</Text>
        </div>
      </div>
    </div>
  );
};

const ManagementMaterialCategory = () => {
  return <div>Hello material category</div>;
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

  const [changeTable, setChangeTable] = useState("1");

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
          width={150}
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
      ),
      //   render: (_, record) => (
      //     <Image
      //       width={100}
      //       height={90}
      //       style={{ objectFit: "contain" }}
      //       src={record.avatar}
      //     />
      //   ),
    },
    {
      title: "Tên nguyên liệu",
      dataIndex: "BodyPart",
      key: "1",
      width: "7%",
    },
    {
      title: "Số lượng",
      dataIndex: "name",
      key: "2",
      width: "7%",
    },
    // {
    //   title: "Clip hướng dẫn",
    //   dataIndex: "GuideVideoLink",
    //   key: "3",
    //   width: 150,
    //   render: () => (
    //     <Button type="link">
    //       <a href="#">Nhấn vào để xem</a>
    //     </Button>
    //   ),
    // },
    // {
    //   title: "Giá trị tối thiểu",
    //   dataIndex: "MinValidValue",
    //   key: "4",
    //   width: 150,
    // },
    // {
    //   title: "Giá trị tối đa",
    //   dataIndex: "MaxValidValue",
    //   key: "5",
    //   width: 150,
    // },
    {
      title: "Action",
      dataIndex: "Action",
      key: "6",
      width: "5%",
      fixed: "right",
      render: () => (
        <Row justify="center">
          <Col span={4}>
            <Button
              type="primary"
              icon={<DeleteOutlined />}
              size="default"
              danger
            />
          </Col>
          <Col span={4} offset={2}>
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="default"
              warning
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
      name: `Edward ${i}`,
      BodyPart: `${i}`,
      address: `London Park no. ${i}`,
      MinValidValue: `${i}`,
      MaxValidValue: `${i}`,
    });
  }

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

  //--------------------------------------------------------------------data table Material Category-------------------------------------------------

  const columns1 = [
    {
      title: "STT",
      width: 10,
      dataIndex: "stt",
      key: "index",
      fixed: "left",
    },

    {
      title: "Số lượng",
      dataIndex: "name",
      key: "1",
      width: 40,
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "2",
      width: 10,
      fixed: "right",
      render: () => (
        <Row justify="center">
          <Col span={4}>
            <Button
              type="primary"
              icon={<DeleteOutlined />}
              size="default"
              danger
            />
          </Col>
          <Col span={4} offset={1}>
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="default"
              warning
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
    });
  }

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

  //--------------------------------------------------------------------data table Material Category-------------------------------------------------

  const columns2 = [
    {
      title: "STT",
      width: 10,
      dataIndex: "stt",
      key: "index",
      fixed: "left",
    },

    {
      title: "Tên loại nguyên liệu",
      dataIndex: "name",
      key: "1",
      width: 40,
    },
    {
      title: "Đơn vị đo",
      dataIndex: "unit",
      key: "2",
      width: 40,
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "3",
      width: 15,
      fixed: "right",
      render: () => (
        <Row justify="center">
          <Col span={4}>
            <Button
              type="primary"
              icon={<DeleteOutlined />}
              size="default"
              danger
            />
          </Col>
          <Col span={4} offset={3}>
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="default"
              warning
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

  //---------------------------------------------------------------Select table----------------------------------------------------
  const onChange = (value) => {
    setChangeTable(value);
  };
  const onSearch = (value) => {
    console.log("search:", value);
  };

  // Filter `option.label` match the user type `input`
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <div>
      {changeTable === "1" ? (
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
              &nbsp; &nbsp; &nbsp;
              <Select
                showSearch
                placeholder="Quản lý nguyên liệu"
                optionFilterProp="children"
                onChange={onChange}
                onSearch={onSearch}
                filterOption={filterOption}
                defaultValue={"1"}
                options={[
                  {
                    value: "1",
                    label: "Material",
                  },
                  {
                    value: "2",
                    label: "Material Category",
                  },
                  {
                    value: "3",
                    label: "Material Type",
                  },
                ]}
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
            dataSource={data}
            pagination={{
              position: ["bottomCenter"],
            }}
            style={{
              marginTop: 24,
            }}
            scroll={{
              y: 435,
            }}
          />
        </>
      ) : changeTable === "2" ? (
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
              &nbsp; &nbsp; &nbsp;
              <Select
                showSearch
                placeholder="Quản lý nguyên liệu"
                optionFilterProp="children"
                onChange={onChange}
                onSearch={onSearch}
                filterOption={filterOption}
                options={[
                  {
                    value: "1",
                    label: "Material",
                  },
                  {
                    value: "2",
                    label: "Material Category",
                  },
                  {
                    value: "3",
                    label: "Material Type",
                  },
                ]}
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
            columns={newColumns1}
            dataSource={data1}
            pagination={{
              position: ["bottomCenter"],
            }}
            style={{
              marginTop: 24,
            }}
            scroll={{
              y: 435,
            }}
          />
        </>
      ) : (
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
              &nbsp; &nbsp; &nbsp;
              <Select
                showSearch
                placeholder="Quản lý nguyên liệu"
                optionFilterProp="children"
                onChange={onChange}
                onSearch={onSearch}
                filterOption={filterOption}
                options={[
                  {
                    value: "1",
                    label: "Material",
                  },
                  {
                    value: "2",
                    label: "Material Category",
                  },
                  {
                    value: "3",
                    label: "Material Type",
                  },
                ]}
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
            columns={newColumns2}
            dataSource={data2}
            pagination={{
              position: ["bottomCenter"],
            }}
            style={{
              marginTop: 24,
            }}
            scroll={{
              y: 435,
            }}
          />
        </>
      )}
    </div>
  );
};

function ManagementMaterial() {
  return (
    <div>
      <div
        style={{
          padding: "20px 20px",
          backgroundColor: "#FFFFFF",
        }}
        className="manager-header"
      >
        <ManagementMaterialHeader />
      </div>
      <div
        className="manager-content"
        style={{ height: "84vh", overflowY: "scroll" }}
      >
        <ManagementMaterialContent />
      </div>
    </div>
  );
}

export default ManagementMaterial;
