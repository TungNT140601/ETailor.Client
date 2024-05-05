import React, { useEffect, useState } from "react";
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
  MinusCircleOutlined,
} from "@ant-design/icons";
import {
  Typography,
  Carousel,
  Table,
  Checkbox,
  Input,
  Modal,
  InputNumber,
  Tag,
} from "antd";
import CategoryIcon from "@mui/icons-material/Category";
import "./index.css";
import CircularProgress from "@mui/material/CircularProgress";
import shop from "../../../assets/shop.png";

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
import ManagerHeader from "../../../components/ManagerHeader";

const { Search, TextArea } = Input;
const { Title, Text } = Typography;
const { Meta } = Card;
const { Option } = Select;

const ManagementCategoryContent = () => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGetDataCategory = async () => {
    const getUrl =
      "https://e-tailorapi.azurewebsites.net/api/category-management";
    try {
      setLoading(true);
      const response = await fetch(getUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.json();
        setCategory(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    handleGetDataCategory();
  }, []);
  function randomColor() {
    const colors = [
      "magenta",
      "red",
      "volcano",
      "orange",
      "gold",
      "lime",
      "green",
      "cyan",
      "blue",
      "geekblue",
      "purple",
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  const columns = [
    {
      title: "STT",
      width: "10%",
      dataIndex: "stt",
      key: "stt",
      fixed: "left",
    },
    {
      title: "Tên loại đồ",
      dataIndex: "name",
      key: "name",
      width: "10%",
    },
    {
      title: "Các bộ phận",
      dataIndex: "componentTypes",
      key: "componentTypes",
      width: "40%",
      render: (_, record) => {
        const randomColors = record.componentTypes.map(() => randomColor());
        return (
          <>
            {record.componentTypes.map((item, index) => {
              return (
                <Tag
                  color={randomColors[index]}
                  key={item.id}
                  style={{ cursor: "pointer", margin: 5 }}
                >
                  {item.name}
                </Tag>
              );
            })}
          </>
        );
      },
    },
    {
      title: "Tùy chỉnh",
      dataIndex: "Action",
      key: "Action",
      width: "10%",
      fixed: "right",
      render: (_, record) => (
        <>
          <Row justify="start">
            <Col span={2}>
              <DeleteOutlined
                style={{
                  backgroundColor: "red",
                  color: "white",
                  padding: 6,
                  borderRadius: "5px",
                  fontSize: 15,
                  cursor: "pointer",
                }}
                onClick={() => onDelete(record.id)}
              />
            </Col>
            <Col span={4} offset={4}>
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
        </>
      ),
    },
  ];

  const getApi = category?.map((item, index) => ({
    id: item.id,
    key: item.id,
    stt: index + 1,
    name: item.name,
    componentTypes: item.componentTypes,
  }));

  //------------------------------------------------------------Modal create-------------------------------------------------------
  const [open, setOpen] = useState(false);
  const onCreate = async (values) => {
    const urlCreateMaterialType = `https://e-tailorapi.azurewebsites.net/api/category-management`;
    try {
      const response = await fetch(urlCreateMaterialType, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
        body: JSON.stringify(values),
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.text();
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: responseData,
          showConfirmButton: false,
          timer: 1500,
        });
        handleGetDataCategory();
        setOpen(false);
        return 1;
      } else if (response.status === 400 || response.status === 500) {
        const responseData = await response.text();
        Swal.fire({
          position: "top-center",
          icon: "error",
          title: responseData,
          showConfirmButton: false,
          timer: 1500,
        });
        return 0;
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };
  //-----------------------------------------------------------------Modal update-------------------------------------------
  const [openUpdate, setOpenUpdate] = useState(false);
  const [saveId, setSaveId] = useState(null);
  const handleOpenUpdate = async (id) => {
    await setSaveId(id);
    setOpenUpdate(true);
  };
  const onUpdate = async (values) => {
    const url = `https://e-tailorapi.azurewebsites.net/api/category-management/${saveId}`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
        body: JSON.stringify(values),
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.text();
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: responseData,
          showConfirmButton: false,
          timer: 1500,
        });
        handleGetDataCategory();
        setOpenUpdate(false);
        return 1;
      } else if (response.status === 400 || response.status === 500) {
        const responseData = await response.text();
        Swal.fire({
          position: "top-center",
          icon: "error",
          title: responseData,
          showConfirmButton: false,
          timer: 1500,
        });
        return 0;
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };
  //-----------------------------------------------------------------Delete-------------------------------------------------
  const onDelete = async (id) => {
    Swal.fire({
      title: "Bạn có muốn xóa loại danh mục?",

      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy bỏ",
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const url = `https://e-tailorapi.azurewebsites.net/api/category-management/${id}`;
        try {
          const response = await fetch(url, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
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
              timer: 1500,
            });
            handleGetDataCategory();
            return 1;
          } else if (response.status === 400 || response.status === 500) {
            const responseData = await response.text();
            Swal.fire({
              position: "top-center",
              icon: "error",
              title: responseData,
              showConfirmButton: false,
              timer: 5500,
            });
            return 0;
          }
        } catch (error) {
          console.error("Error calling API:", error);
        }
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  //----------------------------------------------------------Update Componenet Type----------------------
  // const [openComponentType, setOpenComponentType] = useState(false);
  // const [saveComponentId, setSaveComponentId] = useState(null);
  // const handleOpenUpdateComponent = (id) => {
  //   setSaveComponentId(id);
  //   setOpenComponentType(true);
  // };
  // const onUpdateComponents = async (id, value) => {
  //   console.log("id, value", id, value);
  //   const url = `https://e-tailorapi.azurewebsites.net/api/component-type-management/${id}`;
  //   try {
  //     const response = await fetch(url, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${manager?.token}`,
  //       },
  //       body: JSON.stringify({ id: id, name: value.name }),
  //     });
  //     if (response.ok && response.status === 200) {
  //       const responseData = await response.text();
  //       Swal.fire({
  //         position: "top-center",
  //         icon: "success",
  //         title: responseData,
  //         showConfirmButton: false,
  //         timer: 1500,
  //       });
  //       handleGetDataCategory();
  //       return 1;
  //     } else if (response.status === 400 || response.status === 500) {
  //       const responseData = await response.text();
  //       Swal.fire({
  //         position: "top-center",
  //         icon: "error",
  //         title: responseData,
  //         showConfirmButton: false,
  //         timer: 1500,
  //       });
  //       return 0;
  //     }
  //   } catch (error) {
  //     console.error("Error calling API:", error);
  //   }
  // };

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
      <CollectionUpdateForm
        open={openUpdate}
        onUpdate={onUpdate}
        onCancel={() => {
          setOpenUpdate(false);
        }}
        saveId={saveId}
        setSaveId={setSaveId}
      />
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
            <Button>Tổng cộng ({category?.length})</Button>
          </Col>
          <Col span={4} offset={10}>
            <Button
              onClick={() => {
                setOpen(true);
              }}
            >
              Thêm mới <PlusOutlined />
            </Button>
            <CollectionCreateForm
              open={open}
              onCreate={onCreate}
              onCancel={() => {
                setOpen(false);
              }}
              componentTypes={category && category.componentTypes}
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
          scroll={{ y: 428 }}
        />
      )}
    </div>
  );
};

const CollectionCreateForm = ({ open, onCreate, onCancel, componentTypes }) => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  return (
    <Modal
      open={open}
      style={{ top: 80 }}
      title="Thêm mới loại bản mẫu"
      okText="Tạo mới"
      cancelText="Hủy bỏ"
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => {
        form
          .validateFields()
          .then(async (values) => {
            setLoading(true);
            const checkData =
              values.componentTypes === null ||
              values.componentTypes === undefined;
            if (checkData) {
              alert("Phải có ít nhất 1 bộ phận");
              return;
            }
            const check = await onCreate(values);
            if (check === 1) {
              form.resetFields();
              onCancel();
            }
            setLoading(false);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
      okButtonProps={{ loading: loading }}
    >
      <Form
        style={{
          marginTop: 24,
          height: "400px",
          overflowY: "scroll",
          scrollbarWidth: "none",
          WebkitScrollbar: "none",
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
          label="Tên danh mục"
          rules={[
            {
              required: true,
              message: "Tên danh mục không được để trống!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item className="mt-2" hasFeedback label="Các bộ phận" required>
          <Form.List name="componentTypes" label="Thêm mới bộ phận">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{
                      display: "flex",
                      marginBottom: 8,
                    }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "name"]}
                      rules={[
                        {
                          required: true,
                          message: "Tên bộ phận không được để trống!",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Nhập tên bộ phận"
                        style={{ width: "450px" }}
                      />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>
      </Form>
    </Modal>
  );
};
const CollectionUpdateForm = ({
  open,
  onUpdate,
  onCancel,
  saveId,
  setSaveId,
}) => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [form] = Form.useForm();
  const [dataDetail, setDataDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleDataDetail = async () => {
      setLoading(true);
      const urlDetail = `https://e-tailorapi.azurewebsites.net/api/category-management/${saveId}`;
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

          setDataDetail(responseData);
        }
      } catch (error) {
        console.error("Error calling API:", error);
      }
    };
    handleDataDetail();
  }, [saveId]);

  useEffect(() => {
    const name = [];
    dataDetail?.componentTypes?.forEach((item) =>
      name.push({ name: item.name, id: item.id })
    );
    form.setFieldsValue({
      modifier: "public",
      name: dataDetail?.name,
      componentTypes: name,
    });
  }, [dataDetail]);
  console.log("dataDetail", dataDetail);

  return (
    <Modal
      open={open}
      style={{ top: 220 }}
      title="Cập nhật loại bản mẫu"
      okText="Cập nhật"
      cancelText="Hủy bỏ"
      onCancel={() => {
        setSaveId(null);
        onCancel();
      }}
      onOk={() => {
        form
          .validateFields()
          .then(async (values) => {
            console.log("valuessssss,", values);
            const check = await onUpdate(values);
            if (check === 1) {
              setSaveId(null);
              onCancel();
            }
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <Form
          style={{
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
            label="Tên danh mục"
            rules={[
              {
                required: true,
                message: "Tên danh mục không được để trống!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item className="mt-2" hasFeedback label="Các bộ phận" required>
            <Form.List name="componentTypes" label="Thêm mới bộ phận">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, id, ...restField }) => (
                    <Space
                      key={key}
                      style={{
                        display: "flex",
                        marginBottom: 8,
                      }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "name"]}
                        id={[id, "id"]}
                        rules={[
                          {
                            required: true,
                            message: "Tên bộ phận không được để trống!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Nhập tên bộ phận"
                          style={{ width: "470px" }}
                        />
                      </Form.Item>
                    </Space>
                  ))}
                </>
              )}
            </Form.List>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

function ManagementCategory() {
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
          name={"Loại bản mẫu"}
          link={"/manager/product-template/category"}
          iconHome={<HomeOutlined />}
          iconRoute={<CategoryIcon fontSize="small" />}
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
        <ManagementCategoryContent />
      </div>
    </div>
  );
}

export default ManagementCategory;
