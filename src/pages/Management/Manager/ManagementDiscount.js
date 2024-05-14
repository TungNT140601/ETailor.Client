import React, { useState, useEffect } from "react";
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
import {
  Typography,
  Carousel,
  Table,
  Checkbox,
  InputNumber,
  Modal,
  DatePicker,
} from "antd";
import "./index.css";
import DiscountIcon from "@mui/icons-material/Discount";
import CircularProgress from "@mui/material/CircularProgress";

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
import toast, { Toaster } from "react-hot-toast";

import Paragraph from "antd/es/skeleton/Paragraph";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useQuery } from "react-query";
import dayjs from "dayjs";
import ManagerHeader from "../../../components/ManagerHeader";

const { Search, TextArea } = Input;
const { Title, Text } = Typography;
const { Meta } = Card;
const { Option } = Select;

const ManagementDiscountContent = () => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const getUrl = "https://e-tailorapi.azurewebsites.net/api/discount";

  const {
    data: discount,
    isLoading: loading,
    refetch: Discount,
  } = useQuery("get-discount", () =>
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
      title: "Tên chương trình",
      dataIndex: "name",
      key: "1",
      width: 150,
      ellipsis: {
        showTitle: false,
      },
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
      render: (_, record) => (
        <Text>
          {record.discountpercent === null
            ? "0%"
            : `${record.discountpercent}%`}
        </Text>
      ),
    },
    {
      title: "Số tiền giảm",
      dataIndex: "discountprice",
      key: "6",
      width: 150,
      render: (_, record) => (
        <Text>
          {record.discountprice === null
            ? "0đ"
            : `${record.discountprice}đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </Text>
      ),
    },
    {
      title: "Số tiền tối thiểu",
      dataIndex: "conditionPriceMin",
      key: "7",
      width: 220,
      render: (_, record) => (
        <Text>
          {record.conditionPriceMin === null
            ? "0đ"
            : `${record.conditionPriceMin}đ`.replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              )}
        </Text>
      ),
    },
    {
      title: "Số tiền giảm tối đa",
      dataIndex: "conditionPriceMax",
      key: "8",
      width: 200,
      render: (_, record) => (
        <Text>
          {record.conditionPriceMax === null
            ? "0đ"
            : `${record.conditionPriceMax}đ`.replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              )}
        </Text>
      ),
    },
    {
      title: "Sản phẩm tối thiểu",
      dataIndex: "conditionProductMin",
      key: "9",
      width: 200,
    },
    {
      title: "Tùy chỉnh",
      dataIndex: "Action",
      key: "10",
      width: 100,
      fixed: "right",
      render: (_, record) => (
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
              onClick={() => onDeleteDiscount(record.id)}
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
              onClick={() => handleOpenUpdate(record.id)}
            />
          </Col>
        </Row>
      ),
    },
  ];

  const getApi = discount?.map((item, index) => ({
    id: item.id,
    stt: index + 1,
    name: item.name,
    code: item.code,
    startdate: new Date(item.startDate).toLocaleDateString(),
    enđate: new Date(item.endDate).toLocaleDateString(),
    discountpercent: item.discountPercent,
    discountprice: item.discountPrice,
    conditionPriceMin: item.conditionPriceMin,
    conditionPriceMax: item.conditionPriceMax,
    conditionProductMin: item.conditionProductMin,
  }));

  //------------------------------------------------------------Modal create-------------------------------------------------------
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const onCreate = async (values, startDate, endDate) => {
    const urlCreateMaterialType = `https://e-tailorapi.azurewebsites.net/api/discount`;
    if (startDate.isAfter(endDate)) {
      setError("Ngày bắt đầu không được lớn hơn ngày kết thúc");
      return;
    } else if (endDate.isBefore(startDate)) {
      setError("Ngày kết thúc không được bé hơn ngày bắt đầu");
      return;
    }
    try {
      const response = await fetch(urlCreateMaterialType, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
        body: JSON.stringify(values),
      });
      const responseData = await response.text();
      if (response.ok && response.status === 200) {
        toast.success(responseData);
        Discount();
        return 1;
      } else if (response.status === 400 || response.status === 500) {
        toast.error(responseData);
        return 0;
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };
  //------------------------------------------------------------Modal Update-------------------------------------------------------
  const [openUpdate, setOpenUpdate] = useState(false);
  const [saveDiscountId, setSaveDiscountId] = useState(null);
  const [errorUpdate, setErrorUpdate] = useState("");

  const handleOpenUpdate = (id) => {
    setSaveDiscountId(id);
    setOpenUpdate(true);
  };
  const onUpdate = async (values, startDate, endDate) => {
    const url = `https://e-tailorapi.azurewebsites.net/api/discount/${saveDiscountId}`;
    if (startDate.isAfter(endDate)) {
      setErrorUpdate("Ngày bắt đầu không được lớn hơn ngày kết thúc");
      return;
    } else if (endDate.isBefore(startDate)) {
      setErrorUpdate("Ngày kết thúc không được bé hơn ngày bắt đầu");
      return;
    }
    console.log("values PUT", values);
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
        body: JSON.stringify(values),
      });
      const responseData = await response.text();
      if (response.ok && response.status === 200) {
        toast.success(responseData);
        Discount();
        return 1;
      } else if (response.status === 400 || response.status === 500) {
        toast.error(responseData);
        return 0;
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  //----------------------------------------------------------------------------------------------------------------
  const onDeleteDiscount = (id) => {
    const url = `https://e-tailorapi.azurewebsites.net/api/discount/${id}`;
    Swal.fire({
      title: "Bạn có muốn xóa chương trình giảm giá này?",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(url, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${manager?.token}`,
            },
          });
          const responseData = await response.text();
          if (response.ok && response.status === 200) {
            toast.success(responseData);
            Discount();
            return 1;
          } else if (response.status === 400 || response.status === 500) {
            toast.error(responseData);
            return 0;
          }
        } catch (error) {
          console.error("Error calling API:", error);
        }
      } else if (result.isDenied) {
        Swal.fire("Hủy bỏ xóa chương trình giảm giá", "", "info");
      }
    });
  };

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
      <Toaster />
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
        <Row justify="start" style={{ paddingRight: "24px" }}>
          <Col span={4}>
            <Button>Tổng cộng ({manager?.totalData})</Button>
          </Col>
          <Col span={4} offset={12}>
            <Button
              type="primary"
              onClick={() => {
                setOpen(true);
              }}
            >
              Thêm mới
            </Button>
            <CollectionCreateForm
              open={open}
              onCreate={onCreate}
              onCancel={() => {
                setOpen(false);
              }}
              error={error}
            />
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
          scroll={{
            x: 1500,
          }}
        />
      )}
      <CollectionUpdateForm
        open={openUpdate}
        onCancel={() => setOpenUpdate(false)}
        error={errorUpdate}
        saveDiscountId={saveDiscountId}
        setSaveDiscountId={setSaveDiscountId}
        onUpdate={onUpdate}
      />
    </div>
  );
};

const CollectionCreateForm = ({ open, onCreate, onCancel, error }) => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [form] = Form.useForm();
  const [componentDisabled, setComponentDisabled] = useState(0);
  const [createLoading, setCreateLoading] = useState(false);
  console.log(componentDisabled);

  const handleDisable = (value) => {
    console.log(value);
    if (value !== "") {
      setComponentDisabled(1);
    } else {
      setComponentDisabled(0);
    }
  };
  const handleDisable1 = (value) => {
    console.log(value);
    if (value !== "") {
      setComponentDisabled(2);
    } else {
      setComponentDisabled(0);
    }
  };

  return (
    <Modal
      open={open}
      style={{ top: 40 }}
      title="Thêm mới chương trình giảm giá"
      okText="Tạo mới"
      cancelText="Hủy bỏ"
      onCancel={() => {
        form.resetFields();
        setComponentDisabled(0);
        onCancel();
        setCreateLoading(false);
      }}
      onOk={() => {
        form
          .validateFields()
          .then(async (values) => {
            setCreateLoading(true);
            const startDateConvert = new Date(values.startDate.$d);
            const endDateConvert = new Date(values.endDate.$d);

            const dataBackend = {
              name: values?.name,
              startDate: startDateConvert,
              endDate: endDateConvert,
              discountPercent: values?.discountPercent
                ? values?.discountPercent
                : null,
              discountPrice: values?.discountPrice
                ? values?.discountPrice
                : null,
              conditionPriceMin:
                values?.conditionPriceMin && values?.conditionPriceMin,
              conditionPriceMax: values?.conditionPriceMax
                ? values?.conditionPriceMax
                : null,
              conditionProductMin:
                values?.conditionProductMin && values?.conditionProductMin,
            };
            const check = await onCreate(
              dataBackend,
              values.startDate,
              values.endDate
            );
            if (check === 1) {
              form.resetFields();
              setComponentDisabled(0);
              onCancel();
            }
          })
          .then(() => setCreateLoading(false))
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
      okButtonProps={{ loading: createLoading }}
    >
      <Form
        style={{
          height: 530,
          overflowY: "scroll",
          scrollbarWidth: "none",
          WebkitScrollbar: "none",
          marginTop: 24,
        }}
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: "public",
        }}
      >
        <Form.Item
          className="mt-2"
          hasFeedback
          name="name"
          label="Tên chương trình"
          rules={[
            {
              required: true,
              message: "Tên chương trình không được để trống",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Row>
          <Col span={12}>
            <Form.Item
              className="mt-2"
              label="Ngày bắt đầu"
              name="startDate"
              rules={[
                {
                  required: true,
                  message: "Ngày bắt đầu không được để trống",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const endDate = getFieldValue("endDate");
                    if (!endDate || value.isBefore(endDate)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      "Ngày bắt đầu phải trước ngày kết thúc"
                    );
                  },
                }),
              ]}
            >
              <DatePicker style={{ width: 220 }} placeholder="Ngày bắt đầu" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              className="mt-2 ml-4"
              label="Ngày kết thúc"
              name="endDate"
              rules={[
                {
                  required: true,
                  message: "Ngày kết thúc không được để trống",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const startDate = getFieldValue("startDate");
                    if (startDate && value.isBefore(startDate)) {
                      return Promise.reject(
                        "Ngày kết thúc phải sau ngày bắt đầu"
                      );
                    } else if (startDate && value.isSame(startDate, "day")) {
                      return Promise.reject(
                        "Ngày kết thúc không được trùng với ngày bắt đầu"
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <DatePicker style={{ width: 220 }} placeholder="Ngày kết thúc" />
            </Form.Item>
          </Col>
        </Row>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <Row>
          <Col span={12}>
            {componentDisabled === 2 ? (
              <Form.Item
                hasFeedback
                className="mt-2"
                label="Giảm giá theo % (10-50)"
              >
                <InputNumber style={{ width: 220 }} disabled={true} />
              </Form.Item>
            ) : (
              <Form.Item
                hasFeedback
                className="mt-2"
                label="Giảm giá theo % (10-50)"
                name="discountPercent"
                onChange={(e) => handleDisable(e.target.value)}
                rules={[
                  {
                    required: true,
                    message: "Giảm giá theo % không được để trống",
                  },
                  {
                    type: "number",
                    min: 10,
                    max: 50,
                    step: 0.5,
                    message:
                      "Giảm giá phải là số nguyên và trong khoảng từ 10 - 50%",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: 220 }}
                  formatter={(value) =>
                    `${value}%`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/%\s?|(,*)/g, "")}
                />
              </Form.Item>
            )}
          </Col>
          <Col span={12}>
            {componentDisabled === 2 ? (
              <Form.Item
                className="mt-2 ml-4"
                hasFeedback
                label="Số tiền giảm tối đa"
              >
                <InputNumber style={{ width: 220 }} disabled={true} />
              </Form.Item>
            ) : (
              <Form.Item
                className="mt-2 ml-4"
                hasFeedback
                label="Số tiền giảm tối đa"
                name="conditionPriceMax"
                rules={[
                  {
                    type: "number",
                    min: 1,
                    message: "Phải là một số lớn hơn hoặc bằng 1",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value && getFieldValue("discountPercent")) {
                        return Promise.reject(
                          new Error("Số tiền giảm tối đa không được để trống")
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <InputNumber
                  style={{ width: 220 }}
                  formatter={(value) =>
                    `${value}đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/đ\s?|(,*)/g, "")}
                />
              </Form.Item>
            )}
          </Col>
        </Row>
        {componentDisabled === 1 ? (
          <Col span={12}>
            {" "}
            <Form.Item className="mt-2 " hasFeedback label="Số tiền giảm">
              <InputNumber style={{ width: 220 }} disabled={true} />
            </Form.Item>
          </Col>
        ) : (
          <Col span={12}>
            {" "}
            <Form.Item
              className="mt-2 "
              hasFeedback
              label="Số tiền giảm"
              name="discountPrice"
              onChange={(e) => handleDisable1(e.target.value)}
              rules={[
                {
                  required: true,
                  message: "Số tiền giảm không được để trống",
                },
                {
                  type: "number",
                  min: 1,
                  message: "Phải là một số lớn hơn hoặc bằng 1",
                },
              ]}
            >
              <InputNumber
                style={{ width: 220 }}
                formatter={(value) =>
                  `${value}đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/đ\s?|(,*)/g, "")}
              />
            </Form.Item>
          </Col>
        )}
        <Row>
          <Col span={12}>
            <Form.Item
              className="mt-2"
              hasFeedback
              label="Số tiền hóa đơn tối thiểu"
              name="conditionPriceMin"
              rules={[
                {
                  required: true,
                  message: "Số tiền hóa đơn tối thiểu không được để trống",
                },
                {
                  type: "number",
                  min: 1,
                  message: "Phải là một số lớn hơn hoặc bằng 1",
                },
              ]}
            >
              <InputNumber
                style={{ width: 220 }}
                formatter={(value) =>
                  `${value}đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/đ\s?|(,*)/g, "")}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              className="mt-2 ml-4"
              hasFeedback
              label="Sản phẩm hóa đơn tối thiểu"
              name="conditionProductMin"
              rules={[
                {
                  required: true,
                  message: "Sản phẩm hóa đơn tối thiểu không được để trống",
                },
                {
                  type: "number",
                  min: 1,
                  message: "Phải là một số lớn hơn hoặc bằng 1",
                },
              ]}
            >
              <InputNumber style={{ width: 220 }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
const CollectionUpdateForm = ({
  open,
  onUpdate,
  onCancel,
  setSaveDiscountId,
  saveDiscountId,
  error,
}) => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [discountDetail, setSaveDiscountDetail] = useState(null);
  const [componentDisabled, setComponentDisabled] = useState(0);

  const handleDisable = (value) => {
    console.log(value);
    if (value !== "") {
      setComponentDisabled(1);
    } else {
      setComponentDisabled(0);
    }
  };
  const handleDisable1 = (value) => {
    console.log(value);
    if (value !== "") {
      setComponentDisabled(2);
    } else {
      setComponentDisabled(0);
    }
  };

  useEffect(() => {
    const handleDataDetail = async () => {
      setLoading(true);
      const urlDetail = `https://e-tailorapi.azurewebsites.net/api/discount/${saveDiscountId}`;
      try {
        const response = await fetch(urlDetail, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${manager?.token}`,
          },
        });
        if (response.ok && response.status === 200) {
          const responseData = await response.json();
          setLoading(false);
          setSaveDiscountDetail(responseData);
        }
      } catch (error) {
        console.error("Error calling API:", error);
      }
    };
    if (saveDiscountId) {
      handleDataDetail();
    }
  }, [saveDiscountId]);
  console.log("Discount detail: ", discountDetail);
  useEffect(() => {
    if (discountDetail) {
      form.setFieldsValue({
        modifier: "public",
        name: discountDetail.name,
        discountPrice: discountDetail.discountPrice
          ? discountDetail.discountPrice
          : setComponentDisabled(1),
        startDate: dayjs(discountDetail.startDate),
        endDate: dayjs(discountDetail.endDate),
        discountPercent:
          discountDetail.discountPercent && discountDetail.conditionPriceMax
            ? discountDetail.discountPercent
            : setComponentDisabled(2),
        conditionPriceMax: discountDetail.conditionPriceMax,
        conditionPriceMin: discountDetail.conditionPriceMin,
        conditionProductMin: discountDetail.conditionProductMin,
      });
    }
  }, [discountDetail]);

  return (
    <Modal
      open={open}
      style={{ top: 65 }}
      title="Cập nhật chương trình giảm giá"
      okText="Cập nhật"
      cancelText="Hủy bỏ"
      onCancel={() => {
        form.resetFields();
        onCancel();
        setSaveDiscountId(null);
      }}
      onOk={() => {
        form
          .validateFields()
          .then(async (values) => {
            setLoadingUpdate(true);

            const startDateConvert = new Date(values.startDate.$d);
            const endDateConvert = new Date(values.endDate.$d);

            const dataBackend = {
              id: saveDiscountId,
              name: values?.name,
              startDate: startDateConvert,
              endDate: endDateConvert,
              discountPercent: values?.discountPercent
                ? values?.discountPercent
                : null,
              discountPrice: values?.discountPrice
                ? values?.discountPrice
                : null,
              conditionPriceMin:
                values?.conditionPriceMin && values?.conditionPriceMin,
              conditionPriceMax: values?.conditionPriceMax
                ? values?.conditionPriceMax
                : null,
              conditionProductMin:
                values?.conditionProductMin && values?.conditionProductMin,
            };
            const check = await onUpdate(
              dataBackend,
              values.startDate,
              values.endDate
            );
            if (check === 1) {
              form.resetFields();
              onCancel();
              setSaveDiscountId(null);
            }
          })
          .then(() => setLoadingUpdate(false))
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
      okButtonProps={{ loading: loadingUpdate }}
    >
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "350px",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <Form
          style={{
            height: 530,
            overflowY: "scroll",
            scrollbarWidth: "none",
            WebkitScrollbar: "none",
            marginTop: 24,
          }}
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: "public",
          }}
        >
          <Form.Item
            className="mt-2"
            hasFeedback
            name="name"
            label="Tên chương trình"
            rules={[
              {
                required: true,
                message: "Tên chương trình không được để trống",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Row>
            <Col span={12}>
              <Form.Item
                className="mt-2"
                label="Ngày bắt đầu"
                name="startDate"
                rules={[
                  {
                    required: true,
                    message: "Ngày bắt đầu không được để trống",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const endDate = getFieldValue("endDate");
                      if (!endDate || value.isBefore(endDate)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        "Ngày bắt đầu phải trước ngày kết thúc"
                      );
                    },
                  }),
                ]}
              >
                <DatePicker style={{ width: 220 }} placeholder="Ngày bắt đầu" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                className="mt-2 ml-4"
                label="Ngày kết thúc"
                name="endDate"
                rules={[
                  {
                    required: true,
                    message: "Ngày kết thúc không được để trống",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const startDate = getFieldValue("startDate");
                      if (startDate && value.isBefore(startDate)) {
                        return Promise.reject(
                          "Ngày kết thúc phải sau ngày bắt đầu"
                        );
                      } else if (startDate && value.isSame(startDate, "day")) {
                        return Promise.reject(
                          "Ngày kết thúc không được trùng với ngày bắt đầu"
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <DatePicker
                  style={{ width: 220 }}
                  placeholder="Ngày kết thúc"
                />
              </Form.Item>
            </Col>
          </Row>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <Row>
            <Col span={12}>
              {componentDisabled === 2 ? (
                <Form.Item
                  hasFeedback
                  className="mt-2"
                  label="Giảm giá theo % (10-50)"
                >
                  <InputNumber style={{ width: 220 }} disabled={true} />
                </Form.Item>
              ) : (
                <Form.Item
                  hasFeedback
                  className="mt-2"
                  label="Giảm giá theo % (10-50)"
                  name="discountPercent"
                  onChange={(e) => handleDisable(e.target.value)}
                  rules={[
                    {
                      required: true,
                      message: "Giảm giá theo % không được để trống",
                    },
                    {
                      type: "number",
                      min: 10,
                      max: 50,
                      step: 0.5,
                      message:
                        "Giảm giá phải là số nguyên và trong khoảng từ 10 - 50%",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: 220 }}
                    formatter={(value) =>
                      `${value}%`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/%\s?|(,*)/g, "")}
                  />
                </Form.Item>
              )}
            </Col>
            <Col span={12}>
              {componentDisabled === 2 ? (
                <Form.Item
                  className="mt-2 ml-4"
                  hasFeedback
                  label="Số tiền giảm tối đa"
                >
                  <InputNumber style={{ width: 220 }} disabled={true} />
                </Form.Item>
              ) : (
                <Form.Item
                  className="mt-2 ml-4"
                  hasFeedback
                  label="Số tiền giảm tối đa"
                  name="conditionPriceMax"
                  rules={[
                    {
                      type: "number",
                      min: 1,
                      message: "Phải là một số lớn hơn hoặc bằng 1",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value && getFieldValue("discountPercent")) {
                          return Promise.reject(
                            new Error("Số tiền giảm tối đa không được để trống")
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <InputNumber
                    style={{ width: 220 }}
                    formatter={(value) =>
                      `${value}đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/đ\s?|(,*)/g, "")}
                  />
                </Form.Item>
              )}
            </Col>
          </Row>
          {componentDisabled === 1 ? (
            <Col span={12}>
              {" "}
              <Form.Item className="mt-2 " hasFeedback label="Số tiền giảm">
                <InputNumber
                  style={{ width: 220 }}
                  disabled={true}
                  formatter={(value) =>
                    `${value}đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/đ\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
          ) : (
            <Col span={12}>
              {" "}
              <Form.Item
                className="mt-2 "
                hasFeedback
                label="Số tiền giảm"
                name="discountPrice"
                onChange={(e) => handleDisable1(e.target.value)}
                rules={[
                  {
                    required: true,
                    message: "Số tiền giảm không được để trống",
                  },
                  {
                    type: "number",
                    min: 1,
                    message: "Phải là một số lớn hơn hoặc bằng 1",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: 220 }}
                  formatter={(value) =>
                    `${value}đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/đ\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
          )}
          <Row>
            <Col span={12}>
              <Form.Item
                className="mt-2"
                hasFeedback
                label="Số tiền tối thiểu"
                name="conditionPriceMin"
                rules={[
                  {
                    required: true,
                    message: "Số tiền tối thiểu không được để trống",
                  },
                  {
                    type: "number",
                    min: 1,
                    message: "Phải là một số lớn hơn hoặc bằng 1",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: 220 }}
                  formatter={(value) =>
                    `${value}đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/đ\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                className="mt-2 ml-4"
                hasFeedback
                label="Sản phẩm tối thiểu"
                name="conditionProductMin"
                rules={[
                  {
                    required: true,
                    message: "Sản phẩm tối thiểu không được để trống",
                  },
                  {
                    type: "number",
                    min: 1,
                    message: "Phải là một số lớn hơn hoặc bằng 1",
                  },
                ]}
              >
                <InputNumber style={{ width: 220 }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
    </Modal>
  );
};

function ManagementDiscount() {
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
          name={"Chương trình giảm giá"}
          link={"/manager/discount"}
          iconHome={<HomeOutlined />}
          iconRoute={<DiscountIcon style={{ fontSize: 15 }} />}
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
        <ManagementDiscountContent />
      </div>
    </div>
  );
}

export default ManagementDiscount;
