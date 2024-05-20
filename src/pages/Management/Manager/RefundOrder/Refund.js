import React, { useEffect, useState } from "react";
import { Breadcrumb, InputNumber } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Typography, Table, Checkbox } from "antd";

import {
  Avatar,
  Col,
  Row,
  Modal,
  Divider,
  Tag,
  Image,
  Button,
  Input,
  Badge,
  Flex,
  Card,
  Popover,
  Descriptions,
  List,
  Form,
  Space,
} from "antd";
import CircularProgress from "@mui/material/CircularProgress";
import toast, { Toaster } from "react-hot-toast";

import { Link } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

function Refund({
  open,
  onCancel,
  saveIdOrder,
  dataOrderDetail,
  formatCurrency,
}) {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  console.log("dataOrderDetail", dataOrderDetail);
  const getColorForStatus = (status) => {
    switch (status) {
      case 1:
        return "purple";
      case 2:
        return "blue";
      case 3:
        return "orange";
      case 4:
        return "red";
      default:
        return "default";
    }
  };

  const [refresh, setRefresh] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const hasSelected = selectedRowKeys.length > 0;
  const start = () => {
    setRefresh(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setRefresh(false);
    }, 1000);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 60,
      render: (text, record, index) => <Text>{index + 1}</Text>,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
    },
    {
      title: "Giá sản phẩm",
      dataIndex: "price",
      render: (_, record) => <Text>{formatCurrency(record.price)}</Text>,
    },
    {
      title: "Bản mẫu sử dụng",
      dataIndex: "templateName",
    },
    {
      title: "Hình ảnh",
      dataIndex: "templateThumnailImage",
      render: (_, record) => (
        <Image
          width={50}
          height={50}
          style={{ objectFit: "contain" }}
          src={record.templateThumnailImage}
        />
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (_, record) => (
        <Tag color={getColorForStatus(record.status)}>
          {(() => {
            switch (record.status) {
              case 1:
                return "Chưa bắt đầu";
              case 2:
                return "Trong quá trình";
              case 3:
                return "Tạm dừng";
              case 4:
                return "Trả hàng";
              default:
                return "Không xác định";
            }
          })()}
        </Tag>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: "odd",
        text: "Select Odd Row",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: "even",
        text: "Select Even Row",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };

  useEffect(() => {
    const handleCheckSumPrice = () => {
      if (selectedRowKeys) {
        const checkSum = dataOrderDetail.products
          .filter((item) => selectedRowKeys.includes(item.id))
          .reduce((total, item) => total + item.price, 0);

        return checkSum;
      }
      return undefined;
    };
    const price = handleCheckSumPrice();
    form.setFieldsValue({
      refundPrice: price,
    });
  }, [selectedRowKeys]);

  return (
    <>
      <Modal
        title="Xác nhận hoàn trả cho khách"
        open={open}
        onCancel={() => {
          onCancel();
        }}
        width={1200}
        style={{ top: 40, height: 100 }}
        bodyStyle={{ height: "600px" }}
        footer={[
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "0 20px",
            }}
          >
            <Button
              key="chat"
              type="primary"
              style={{ marginLeft: 15 }}
              onClick={() => {
                onCancel();
              }}
            >
              Quay lại
            </Button>
            <Button
              key="chat"
              type="primary"
              style={{ marginLeft: 15 }}
              // onClick={async () => {
              //   const check = await handleCancelOrder(saveIdOrder);
              //   if (check === 1) {
              //     onCancel();
              //   }
              // }}
            >
              Xác nhận
            </Button>
          </div>,
        ]}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "560px",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <>
            <div
              style={{
                height: "100%",
                overflowY: "scroll",
                scrollbarWidth: "none",
                WebkitScrollbar: "none",
              }}
            >
              <div
                style={{
                  marginBottom: 16,
                }}
              >
                <Button
                  type="primary"
                  onClick={start}
                  disabled={!hasSelected}
                  loading={refresh}
                >
                  Bỏ chọn {`${selectedRowKeys.length}`} sản phẩm
                </Button>
                <span
                  style={{
                    marginLeft: 8,
                  }}
                >
                  {hasSelected ? `Chọn ${selectedRowKeys.length} sản phẩm` : ""}
                </span>
              </div>
              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={
                  dataOrderDetail &&
                  dataOrderDetail.products.map((item) => ({
                    ...item,
                    key: item.id,
                  }))
                }
                scroll={{ y: 300 }}
                pagination={false}
              />
              <br />
              <Title level={4} style={{ textAlign: "center" }}>
                Thông tin hoàn trả cho khách
              </Title>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 24,
                }}
              >
                <Form
                  form={form}
                  name="dynamic_form_nest_item"
                  style={{
                    maxWidth: "100%",
                  }}
                  autoComplete="off"
                  layout="vertical"
                >
                  <Row justify="center" gutter={[16, 24]}>
                    <Col span={12}>
                      <Form.Item
                        name="refundPrice"
                        label="Tổng tiền hoàn trả"
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        <InputNumber
                          formatter={(value) =>
                            `${value}đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value.replace(/đ\s?|(,*)/g, "")}
                          style={{ width: "400px" }}
                          step={0.01}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      {" "}
                      <Form.Item
                        name="compensationPrice"
                        label="Tổng tiền đền bù"
                      >
                        <InputNumber
                          formatter={(value) =>
                            `${value}đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value.replace(/đ\s?|(,*)/g, "")}
                          style={{ width: "400px" }}
                          step={0.01}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Title
                    level={5}
                    style={{ textAlign: "center", marginBottom: 10 }}
                  >
                    Danh sách nguyên phụ liệu
                  </Title>

                  <Form.List name="users">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, index, ...restField }) => (
                          <Row justify="center" gutter={[16, 24]}>
                            <Col span={12}>
                              <Form.Item
                                {...restField}
                                name={[name, "material"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Tên vải không được để trống",
                                  },
                                ]}
                                label="Tên vải"
                              >
                                <Input
                                  placeholder="Nhập tên vải"
                                  style={{ width: 400 }}
                                />
                              </Form.Item>
                            </Col>
                            <Col
                              span={12}
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Form.Item
                                {...restField}
                                name={[name, "unit"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Số met vải không được để trống",
                                  },
                                ]}
                                label="Số met vải"
                              >
                                <InputNumber
                                  placeholder="Số met vải"
                                  style={{ width: 400 }}
                                  step={0.1}
                                  formatter={(value) =>
                                    `${value}m`.replace(
                                      /\B(?=(\d{3})+(?!\d))/g,
                                      ","
                                    )
                                  }
                                  parser={(value) =>
                                    value.replace(/m\s?|(,*)/g, "")
                                  }
                                />
                              </Form.Item>{" "}
                              <MinusCircleOutlined
                                onClick={() => remove(name)}
                                style={{ marginLeft: 10, marginTop: 5 }}
                              />
                            </Col>
                          </Row>
                        ))}
                        <Row justify="center">
                          <Col>
                            <Form.Item>
                              <Button
                                style={{ width: "412px" }}
                                type="dashed"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
                              >
                                Thêm mới
                              </Button>
                            </Form.Item>
                          </Col>
                        </Row>
                      </>
                    )}
                  </Form.List>
                </Form>
              </div>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}

export default Refund;
