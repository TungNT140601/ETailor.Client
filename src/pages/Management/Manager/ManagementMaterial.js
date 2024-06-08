import React, { useEffect, useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";
import { Breadcrumb } from "antd";
import {
  HomeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  LoadingOutlined,
  OrderedListOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import "./index.css";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import {
  Avatar,
  Col,
  Row,
  Form,
  Select,
  Upload,
  Typography,
  Table,
  Checkbox,
  Modal,
  Input,
  Button,
  Image,
  InputNumber,
  message,
} from "antd";

import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import ManagerHeader from "../../../components/ManagerHeader";

const { Search } = Input;
const { Title, Text } = Typography;

const manager = JSON.parse(localStorage.getItem("manager"));

const ManagementMaterialContent = () => {
  const [material, setMaterial] = useState([]);
  const [loadingMaterial, setLoadingMaterial] = useState(false);
  const [materialCategory, setMaterialCategory] = useState([]);
  const getMaterialUrl = "https://e-tailorapi.azurewebsites.net/api/material";
  const manager = JSON.parse(localStorage.getItem("manager"));
  const getMaterialCategoryUrl =
    "https://e-tailorapi.azurewebsites.net/api/material-category";

  const handleDataMaterialCategory = async () => {
    try {
      const response = await fetch(getMaterialCategoryUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.json();

        setMaterialCategory(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };
  const handleDataMaterial = async () => {
    setLoadingMaterial(true);
    try {
      const response = await fetch(getMaterialUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.json();
        setLoadingMaterial(false);
        setMaterial(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  useEffect(() => {
    handleDataMaterial();
    handleDataMaterialCategory();
  }, []);

  const getApi = material?.map((item, index) => ({
    stt: index,
    name: item.name,
    image: item.image,
    quantity: item.quantity,
    id: item.id,
  }));

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
      render: (_, record) => (
        <Image width={30} height={30} src={record.image} />
      ),
    },
    {
      title: "Nguyên phụ liệu",
      dataIndex: "name",
      key: "1",
      width: "7%",
    },
    {
      title: "Số lượng (mét)",
      dataIndex: "quantity",
      key: "2",
      width: "7%",
      render: (_, record) => <Text>{record.quantity + " mét"}</Text>,
    },
    {
      title: "Tùy chỉnh",
      dataIndex: "Action",
      key: "6",
      width: "5%",
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
              onClick={() => onDeleteMaterial(record.id)}
            />
          </Col>
          <Col span={4} offset={1}>
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

  //------------------------------------------------------------Modal create-------------------------------------------------------
  const [open, setOpen] = useState(false);
  const onCreateMaterial = async (values) => {
    const formData = new FormData();
    formData.append("MaterialCategoryId", values.materialCategoryId);
    formData.append("Name", values.name);
    formData.append("ImageFile", values.imageFile);
    formData.append("Quantity", values.quantity);
    const urlCreateMaterialType = `https://e-tailorapi.azurewebsites.net/api/material`;
    try {
      const response = await fetch(urlCreateMaterialType, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${manager?.token}`,
        },
        body: formData,
      });
      const responseData = await response.text();
      if (response.ok && response.status === 200) {
        message.success(responseData);
        handleDataMaterial();
        setOpen(false);
        return 1;
      } else if (response.status === 400 || response.status === 500) {
        message.error(responseData);
        return 0;
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  //--------------------------------------------------------------Update--------------------------------------------------------
  const [openUpdate, setOpenUpdate] = useState(false);
  const [saveMaterialId, setSaveMaterialId] = useState(null);
  const handleOpenUpdate = (id) => {
    console.log(id);
    setSaveMaterialId(id);
    setOpenUpdate(true);
  };
  const onUpdate = async (values) => {
    const urlCreateMaterial = `https://e-tailorapi.azurewebsites.net/api/material/${saveMaterialId}`;
    try {
      const response = await fetch(urlCreateMaterial, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${manager?.token}`,
        },
        body: values,
      });
      const responseData = await response.text();
      if (response.ok && response.status === 200) {
        message.success(responseData);
        handleDataMaterial();
        return 1;
      } else if (response.status === 400 || response.status === 500) {
        message.error(responseData);
        return 0;
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };
  //---------------------------------------------------------------------------------------Delete--------------------------------------------------
  const onDeleteMaterial = (id) => {
    const urlCreateMaterial = `https://e-tailorapi.azurewebsites.net/api/material/${id}`;
    Swal.fire({
      title: "Bạn có muốn xóa nguyên liệu này?",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(urlCreateMaterial, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${manager?.token}`,
            },
          });
          const responseData = await response.text();
          if (response.ok && response.status === 200) {
            message.success(responseData);
            handleDataMaterial();
            return 1;
          } else if (response.status === 400 || response.status === 500) {
            message.error(responseData);
            return 0;
          }
        } catch (error) {
          console.error("Error calling API:", error);
        }
      } else if (result.isDenied) {
        Swal.fire("Hủy bỏ xóa nguyên liệu", "", "info");
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
          </div>
          <Row justify="start" style={{ paddingRight: "24px" }}>
            <Col span={4}>
              <Button>Tổng cộng ({getApi?.length})</Button>
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
              <CreateMaterial
                open={open}
                onCreateMaterial={onCreateMaterial}
                onCancel={() => {
                  setOpen(false);
                }}
                materialCategory={materialCategory}
              />
              <UpdateMaterial
                open={openUpdate}
                onUpdate={onUpdate}
                onCancel={() => {
                  setOpenUpdate(false);
                }}
                saveMaterialId={saveMaterialId}
                setSaveMaterialId={setSaveMaterialId}
              />
            </Col>
          </Row>
        </div>
        {loadingMaterial ? (
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
          <>
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
                y: 426,
              }}
            />
          </>
        )}
      </>
    </div>
  );
};

const UpdateMaterial = ({
  open,
  onUpdate,
  onCancel,
  saveMaterialId,
  setSaveMaterialId,
}) => {
  const [form] = Form.useForm();
  const [materialDetail, setMaterialDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [postImage, setPostImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);

  const getFile = (e) => {
    console.log(e);
    const file = e.fileList[0];
    if (file && file.originFileObj) {
      setPostImage(file.originFileObj);
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);
      reader.onload = () => {
        setImageUrl(reader.result);
      };
    }
    return e && e.fileList;
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      {loadingImage ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Tải ảnh
      </div>
    </button>
  );

  useEffect(() => {
    const handleDataDetail = async () => {
      setLoading(true);
      const urlMaterialDetail = `https://e-tailorapi.azurewebsites.net/api/material/${saveMaterialId}`;
      try {
        const response = await fetch(urlMaterialDetail, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${manager?.token}`,
          },
        });
        if (response.ok && response.status === 200) {
          const responseData = await response.json();
          setLoading(false);
          setImageUrl(responseData?.image);
          setMaterialDetail(responseData);
        }
      } catch (error) {
        console.error("Error calling API:", error);
      }
    };
    if (saveMaterialId) {
      handleDataDetail();
    }
  }, [saveMaterialId]);

  useEffect(() => {
    console.log("materialDetail,", materialDetail);
    if (materialDetail) {
      form.setFieldsValue({
        modifier: "public",
        name: materialDetail.name || "",
        quantity: materialDetail.quantity || "",
        image: materialDetail.image || "",
        materialCategoryId: materialDetail.materialCategory.name || "",
      });
    }
  }, [materialDetail]);

  return (
    <Modal
      open={open}
      style={{ top: 155 }}
      title="Cập nhật nguyên liệu"
      okText="Cập nhật"
      cancelText="Hủy bỏ"
      onCancel={() => {
        onCancel();
        setSaveMaterialId(null);
      }}
      onOk={() => {
        form
          .validateFields()
          .then(async (values) => {
            setLoadingUpdate(true);
            const formData = new FormData();
            formData.append("Id", saveMaterialId);
            formData.append("MaterialCategoryId", values.materialCategoryId);
            formData.append("Name", values.name);
            formData.append("ImageFile", postImage);
            formData.append("Quantity", values.quantity);

            const check = await onUpdate(formData);
            if (check === 1) {
              onCancel();
              setSaveMaterialId(null);
            }
            setLoadingUpdate(false);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
      okButtonProps={{ loading: loadingUpdate }}
    >
      <Form
        style={{
          height: 300,
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
          <>
            <Row>
              <Col span={12}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "25px",
                    marginRight: "15px",
                  }}
                >
                  <Form.Item
                    name="image"
                    getValueFromEvent={getFile}
                    style={{ width: "130px" }}
                    rules={[
                      {
                        required: true,
                        message: "Ảnh nguyên liệu không được để trống",
                      },
                    ]}
                  >
                    <Upload
                      action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                      listType="picture-card"
                      maxCount={1}
                      showUploadList={false}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="imageMaterial"
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      ) : (
                        uploadButton
                      )}
                    </Upload>
                  </Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <Form.Item
                    name="name"
                    label="Nguyên phụ liệu"
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Nguyên phụ liệu không được để trống",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="quantity"
                    label="Số lượng"
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Số lượng phải là số và không được để trống",
                      },
                      {
                        type: "number",
                        min: 1,
                        message: "Số lượng ít nhất là 1",
                      },
                    ]}
                  >
                    <InputNumber
                      style={{
                        width: "100%",
                      }}
                    />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Form.Item
              hasFeedback
              label={`Danh mục`}
              name="materialCategoryId"
              rules={[
                {
                  required: true,
                  message: "Loại vải không được để trống",
                },
              ]}
            >
              <Select style={{ height: 45 }} disabled></Select>
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

const CreateMaterial = ({
  open,
  onCreateMaterial,
  onCancel,
  materialCategory,
}) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [postImage, setPostImage] = useState(null);

  const getFile = (e) => {
    console.log(e);
    const file = e.fileList[0];
    if (file && file.originFileObj) {
      setPostImage(file.originFileObj);
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);
      reader.onload = () => {
        setImageUrl(reader.result);
      };
    }
    return e && e.fileList;
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      {loadingImage ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Tải ảnh
      </div>
    </button>
  );

  return (
    <Modal
      open={open}
      style={{ top: 155 }}
      title="Thêm mới nguyên liệu"
      okText="Tạo mới"
      cancelText="Hủy bỏ"
      onCancel={() => {
        form.resetFields();
        setImageUrl(null);
        setPostImage(null);
        onCancel();
      }}
      onOk={() => {
        form
          .validateFields()
          .then(async (values) => {
            setLoading(true);
            const dataBackEnd = {
              materialCategoryId: values.materialCategoryId,
              name: values.name,
              imageFile: postImage,
              quantity: values.quantity,
            };
            const check = await onCreateMaterial(dataBackEnd);
            if (check === 1) {
              form.resetFields();
              setImageUrl(null);
              setPostImage(null);
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
          height: 300,
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
        <Row>
          <Col span={12}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "25px",
                marginRight: "15px",
              }}
            >
              <Form.Item
                name="image"
                getValueFromEvent={getFile}
                style={{ width: "130px" }}
                rules={[
                  {
                    required: true,
                    message: "Ảnh nguyên liệu không được để trống",
                  },
                ]}
              >
                <Upload
                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  listType="picture-card"
                  maxCount={1}
                  showUploadList={false}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="imageMaterial"
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Form.Item>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <Form.Item
                name="name"
                label="Nguyên phụ liệu"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Nguyên phụ liệu không được để trống",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="quantity"
                label="Số lượng"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Số lượng phải là số và không được để trống",
                  },
                  {
                    type: "number",
                    min: 1,
                    message: "Số lượng ít nhất là 1",
                  },
                ]}
              >
                <InputNumber
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
            </div>
          </Col>
        </Row>
        <Form.Item
          hasFeedback
          label={`Danh mục`}
          name="materialCategoryId"
          rules={[
            {
              required: true,
              message: "Loại vải không được để trống",
            },
          ]}
        >
          <Select style={{ height: 45 }}>
            {materialCategory?.map((item) => {
              return (
                <Select.Option value={item.id} key={item.id}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Title level={5}>{item.name}</Title>
                  </div>
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

function ManagementMaterialTypeContent() {
  const [materialType, setMaterialType] = useState([]);
  const [loadingMaterialType, setLoadingMaterialType] = useState(false);
  const getMaterialTypeUrl =
    "https://e-tailorapi.azurewebsites.net/api/material-type";
  const manager = JSON.parse(localStorage.getItem("manager"));
  const handleDataMaterialType = async () => {
    setLoadingMaterialType(true);
    try {
      const response = await fetch(getMaterialTypeUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.json();
        setLoadingMaterialType(false);
        setMaterialType(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  useEffect(() => {
    handleDataMaterialType();
  }, []);

  const getApi = materialType?.map((item, index) => ({
    stt: index,
    id: item.id,
    name: item.name,
    unit: item.unit,
  }));

  const columns2 = [
    {
      title: "STT",
      width: "10%",
      dataIndex: "stt",
      key: "index",
      fixed: "left",
    },

    {
      title: "Tên loại nguyên liệu",
      dataIndex: "name",
      key: "1",
      width: "35%",
    },
    {
      title: "Đơn vị đo",
      dataIndex: "unit",
      key: "2",
      width: "35%",
    },
    {
      title: "Tùy chỉnh",
      dataIndex: "Action",
      key: "3",
      width: "20%",
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
              onClick={() => onDeleteMaterialType(record.id)}
            />
          </Col>
          <Col span={4}>
            <EditOutlined
              onClick={() => handleOpenUpdate(record.id)}
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

  //------------------------------------------------------------Modal create-------------------------------------------------------
  const [open, setOpen] = useState(false);
  const onCreateMaterialType = async (values) => {
    const urlCreateMaterialType = `https://e-tailorapi.azurewebsites.net/api/material-type`;
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
        message.success(responseData);
        handleDataMaterialType();
        setOpen(false);
        return 1;
      } else if (response.status === 400 || response.status === 500) {
        message.error(responseData);
        return 0;
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  //-----------------------------------------------------------Modal Update---------------------------------------------------
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [saveId, setSaveId] = useState(null);

  const handleOpenUpdate = async (id) => {
    await setSaveId(id);
    setOpenUpdateModal(true);
  };
  const onUpdateMaterialType = async (values) => {
    const urlCreateMaterialType = `https://e-tailorapi.azurewebsites.net/api/material-type/${values}`;
    try {
      const response = await fetch(urlCreateMaterialType, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
        body: JSON.stringify(values),
      });
      const responseData = await response.text();
      if (response.ok && response.status === 200) {
        message.success(responseData);
        handleDataMaterialType();
        return 1;
      } else if (response.status === 400 || response.status === 500) {
        message.error(responseData);
        return 0;
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  //------------------------------------------------------------------Delete------------------------------------------------------------------------------
  const onDeleteMaterialType = (id) => {
    const urlCreateMaterialType = `https://e-tailorapi.azurewebsites.net/api/material-type/${id}`;
    Swal.fire({
      title: "Bạn có muốn xóa nguyên liệu này?",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(urlCreateMaterialType, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${manager?.token}`,
            },
          });
          const responseData = await response.text();
          if (response.ok && response.status === 200) {
            message.success(responseData);
            handleDataMaterialType();
            return 1;
          } else if (response.status === 400 || response.status === 500) {
            message.error(responseData);
            return 0;
          }
        } catch (error) {
          console.error("Error calling API:", error);
        }
      } else if (result.isDenied) {
        Swal.fire("Hủy bỏ xóa nguyên liệu", "", "info");
      }
    });
  };

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

  return (
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
        </div>
        <Row justify="start" style={{ paddingRight: "24px" }}>
          <Col span={4}>
            <Button>Tổng cộng ({getApi?.length})</Button>
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
            <CreateMaterialType
              open={open}
              onCreateMaterialType={onCreateMaterialType}
              onCancel={() => {
                setOpen(false);
              }}
            />
            <UpdateMaterialType
              open={openUpdateModal}
              onUpdateMaterialType={onUpdateMaterialType}
              saveId={saveId}
              setSaveId={setSaveId}
              onCancel={() => {
                setOpenUpdateModal(false);
              }}
            />
          </Col>
        </Row>
      </div>

      {loadingMaterialType ? (
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
          columns={newColumns2}
          dataSource={getApi}
          pagination={{
            position: ["bottomCenter"],
          }}
          style={{
            marginTop: 24,
          }}
        />
      )}
    </>
  );
}

const CreateMaterialType = ({ open, onCreateMaterialType, onCancel }) => {
  const [form] = Form.useForm();
  const [loadingCreate, setLoadingCreate] = useState(false);

  return (
    <Modal
      open={open}
      style={{ top: 155 }}
      title="Thêm mới loại nguyên liệu"
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
            setLoadingCreate(true);
            const check = await onCreateMaterialType(values);
            if (check === 1) {
              form.resetFields();
            }
            setLoadingCreate(false);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
      okButtonProps={{ loading: loadingCreate }}
    >
      <Form
        style={{
          height: 200,
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
        <div>
          <Form.Item
            name="name"
            label="Nguyên phụ liệu"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Nguyên phụ liệu không được để trống",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Đơn vị đo"
            name="unit"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Đơn vị đo không được để trống",
              },
            ]}
            initialValue={"mét"}
          >
            <Input />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};
const UpdateMaterialType = ({
  open,
  onUpdateMaterialType,
  onCancel,
  saveId,
  setSaveId,
}) => {
  const [form] = Form.useForm();
  const [materialTypeDetail, setMaterialTypeDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  useEffect(() => {
    const handleDataDetail = async () => {
      setLoading(true);
      const urlMaterialTypeDetail = `https://e-tailorapi.azurewebsites.net/api/material-type/${saveId}`;
      try {
        const response = await fetch(urlMaterialTypeDetail, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${manager?.token}`,
          },
        });
        if (response.ok && response.status === 200) {
          const responseData = await response.json();
          setLoading(false);
          setMaterialTypeDetail(responseData);
        }
      } catch (error) {
        console.error("Error calling API:", error);
      }
    };
    if (saveId) {
      handleDataDetail();
    }
  }, [saveId]);

  useEffect(() => {
    if (materialTypeDetail) {
      form.setFieldsValue({
        modifier: "public",
        name: materialTypeDetail.name || "",
        unit: materialTypeDetail.unit || "",
      });
    }
  }, [materialTypeDetail]);

  return (
    <Modal
      open={open}
      style={{ top: 155 }}
      title="Cập nhật loại nguyên liệu"
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
            setLoadingUpdate(true);
            const dataBackEnd = {
              id: saveId,
              name: values.name,
              unit: values.unit,
            };
            const checkResult = await onUpdateMaterialType(dataBackEnd);
            if (checkResult === 1) {
              onCancel();
              setSaveId(null);
            }
            setLoadingUpdate(false);
          })
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
            height: "300px",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <Form
          style={{
            height: 200,
            overflowY: "scroll",
            scrollbarWidth: "none",
            WebkitScrollbar: "none",
            marginTop: 24,
          }}
          form={form}
          layout="vertical"
          name="form_in_modal"
        >
          <div>
            <Form.Item
              name="name"
              label="Nguyên phụ liệu"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Nguyên phụ liệu không được để trống",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Đơn vị đo"
              name="unit"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Đơn vị đo không được để trống",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </div>
        </Form>
      )}
    </Modal>
  );
};

function ManagementMaterialCategoryContent() {
  const [materialCategory, setMaterialCategory] = useState([]);
  // const [materialType, setMaterialType] = useState([]);
  const [loadingMaterialCategory, setLoadingMaterialCategory] = useState(false);
  const getMaterialCategoryUrl =
    "https://e-tailorapi.azurewebsites.net/api/material-category";
  const manager = JSON.parse(localStorage.getItem("manager"));
  const handleDataMaterialCategory = async () => {
    setLoadingMaterialCategory(true);
    try {
      const response = await fetch(getMaterialCategoryUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.json();
        setLoadingMaterialCategory(false);
        setMaterialCategory(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  useEffect(() => {
    handleDataMaterialCategory();
  }, []);

  const columns1 = [
    {
      title: "STT",
      width: "10%",
      dataIndex: "stt",
      key: "index",
      fixed: "left",
    },

    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "1",
      width: "55%",
    },
    {
      title: "Tùy chỉnh",
      dataIndex: "Action",
      key: "4",
      width: "20%",
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
              onClick={() => onDeleteMaterialCategory(record.id)}
            />
          </Col>
          <Col span={4}>
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
  const getApi = materialCategory?.map((item, index) => ({
    stt: index,
    id: item.id,
    name: item.name,
  }));

  //------------------------------------------------------------Modal create-------------------------------------------------------
  const [open, setOpen] = useState(false);
  const onCreate = async (values) => {
    const urlCreateMaterialCategory = `https://e-tailorapi.azurewebsites.net/api/material-category`;
    try {
      const response = await fetch(urlCreateMaterialCategory, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
        body: JSON.stringify(values),
      });
      const responseData = await response.text();
      if (response.ok && response.status === 200) {
        message.success(responseData);
        handleDataMaterialCategory();
        setOpen(false);
        return 1;
      } else if (response.status === 400 || response.status === 500) {
        message.error(responseData);
        return 0;
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
    setOpen(false);
  };

  //-------------------------------------------------------------Update--------------------------------------------------------
  const [openUpdate, setOpenUpdate] = useState(false);
  const [saveMaterialCategoryId, setSaveMaterialCategory] = useState(null);
  const handleOpenUpdate = (id) => {
    setSaveMaterialCategory(id);
    setOpenUpdate(true);
  };
  const onUpdate = async (values) => {
    const urlCreateMaterialCategory = `https://e-tailorapi.azurewebsites.net/api/material-category/${values.id}`;
    try {
      const response = await fetch(urlCreateMaterialCategory, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
        body: JSON.stringify(values),
      });
      const responseData = await response.text();
      if (response.ok && response.status === 200) {
        message.success(responseData);
        handleDataMaterialCategory();
        return 1;
      } else if (response.status === 400 || response.status === 500) {
        message.error(responseData);
        return 0;
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
    setOpenUpdate(false);
  };

  //--------------------------------------------------------------------Delete--------------------------------------------------------
  const onDeleteMaterialCategory = (id) => {
    const urlCreateMaterialType = `https://e-tailorapi.azurewebsites.net/api/material-category/${id}`;
    Swal.fire({
      title: "Bạn có muốn xóa danh mục nguyên liệu này?",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(urlCreateMaterialType, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${manager?.token}`,
            },
          });
          const responseData = await response.text();
          if (response.ok && response.status === 200) {
            message.success(responseData);
            handleDataMaterialCategory();
            return 1;
          } else if (response.status === 400 || response.status === 500) {
            message.error(responseData);
            return 0;
          }
        } catch (error) {
          console.error("Error calling API:", error);
        }
      } else if (result.isDenied) {
        Swal.fire("Hủy bỏ xóa danh mục nguyên liệu", "", "info");
      }
    });
  };
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

  return (
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
        </div>
        <Row justify="start" style={{ paddingRight: "24px" }}>
          <Col span={4}>
            <Button>Tổng cộng ({getApi?.length})</Button>
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
            <CreateMaterialCategory
              open={open}
              onCreate={onCreate}
              onCancel={() => {
                setOpen(false);
              }}
              // materialType={materialType}
            />
            <UpdateMaterialCategory
              open={openUpdate}
              onUpdate={onUpdate}
              onCancel={() => {
                setOpenUpdate(false);
              }}
              saveMaterialCategoryId={saveMaterialCategoryId}
              setSaveMaterialCategory={setSaveMaterialCategory}
            />
          </Col>
        </Row>
      </div>
      {loadingMaterialCategory ? (
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
        <>
          <Table
            columns={newColumns1}
            dataSource={getApi}
            pagination={{
              position: ["bottomCenter"],
              locale: { items_per_page: " / trang" },
            }}
            style={{
              marginTop: 24,
            }}
            scroll={{
              y: 410,
            }}
          />
        </>
      )}
    </>
  );
}

const UpdateMaterialCategory = ({
  open,
  onUpdate,
  onCancel,
  saveMaterialCategoryId,
  setSaveMaterialCategory,
}) => {
  const [form] = Form.useForm();
  const [materialCategoryDetail, setMaterialCategoryDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  useEffect(() => {
    const handleDataDetail = async () => {
      setLoading(true);
      const urlMaterialTypeDetail = `https://e-tailorapi.azurewebsites.net/api/material-category/${saveMaterialCategoryId}`;
      try {
        const response = await fetch(urlMaterialTypeDetail, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${manager?.token}`,
          },
        });
        if (response.ok && response.status === 200) {
          const responseData = await response.json();
          setLoading(false);
          setMaterialCategoryDetail(responseData);
        }
      } catch (error) {
        console.error("Error calling API:", error);
      }
    };
    if (saveMaterialCategoryId) {
      handleDataDetail();
    }
  }, [saveMaterialCategoryId]);

  useEffect(() => {
    if (materialCategoryDetail) {
      form.setFieldsValue({
        modifier: "public",
        name: materialCategoryDetail.name || "",
        pricePerUnit: materialCategoryDetail.pricePerUnit || "",
        // materialTypeId: materialCategoryDetail.materialTypeName || "",
      });
    }
  }, [materialCategoryDetail]);

  return (
    <Modal
      open={open}
      style={{ top: 155 }}
      title="Cập nhật danh mục"
      okText="Cập nhật"
      cancelText="Hủy bỏ"
      onCancel={() => {
        setSaveMaterialCategory(null);
        onCancel();
      }}
      onOk={() => {
        form
          .validateFields()
          .then(async (values) => {
            setLoadingUpdate(true);
            const dataBackEnd = {
              id: saveMaterialCategoryId,
              name: values.name,
            };
            const check = await onUpdate(dataBackEnd);
            if (check === 1) {
              onCancel();
              setSaveMaterialCategory(null);
            }
            setLoadingUpdate(false);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
      okButtonProps={{ loading: loadingUpdate }}
    >
      <Form
        style={{
          height: 100,
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
          <div>
            <Form.Item
              name="name"
              label="Tên danh mục"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Tên danh mục không được để trống",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </div>
        )}
      </Form>
    </Modal>
  );
};

const CreateMaterialCategory = ({ open, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const [loadingCreate, setLoadingCreate] = useState(false);

  return (
    <Modal
      open={open}
      style={{ top: 170 }}
      title="Thêm mới danh mục"
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
            setLoadingCreate(true);
            const check = await onCreate(values);
            if (check === 1) {
              form.resetFields();
            }
            setLoadingCreate(false);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
      okButtonProps={{ loading: loadingCreate }}
    >
      <Form
        style={{
          height: 100,
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
        <div>
          <Form.Item
            name="name"
            label="Tên danh mục"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Tên danh mục không được để trống",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export function ManagementMaterialCategory() {
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
          name={"Danh mục nguyên liệu"}
          link={"/manager/material-category"}
          iconHome={<HomeOutlined />}
          iconRoute={<AppstoreAddOutlined />}
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
        <ManagementMaterialCategoryContent />
      </div>
    </div>
  );
}

export function ManagementMaterialType() {
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
          name={"Loại nguyên liệu"}
          link={"/manager/material-type"}
          iconHome={<HomeOutlined />}
          iconRoute={<OrderedListOutlined />}
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
        <ManagementMaterialTypeContent />
      </div>
    </div>
  );
}

function ManagementMaterial() {
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
          name={"Nguyên liệu"}
          link={"/manager/material"}
          iconHome={<HomeOutlined />}
          iconRoute={
            <FactCheckIcon fontSize="small" style={{ fontSize: "18px" }} />
          }
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
        <ManagementMaterialContent />
      </div>
    </div>
  );
}

export default ManagementMaterial;
