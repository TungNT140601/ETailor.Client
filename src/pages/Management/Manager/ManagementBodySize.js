import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Breadcrumb } from "antd";
import { useQueryClient } from "react-query";
import {
  HomeOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Typography, Table, Checkbox } from "antd";
import "./index.css";

import { Input } from "antd";
import { Button } from "antd";
import { Image } from "antd";
import {
  Avatar,
  Col,
  Row,
  Modal,
  Form,
  Upload,
  InputNumber,
  Select,
  message,
} from "antd";
import CircularProgress from "@mui/material/CircularProgress";
import StraightenIcon from "@mui/icons-material/Straighten";

import { Link } from "react-router-dom";
// import Swal from "sweetalert2";
import { useQuery } from "react-query";
import ManagerHeader from "../../../components/ManagerHeader";

const { Search } = Input;
const { Title, Text } = Typography;

const ManagementBodySizeContent = () => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [bodySize, setBodySize] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUrl = "https://e-tailorapi.azurewebsites.net/api/body-size";

  const handleBodySize = async () => {
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
        setLoading(false);
        setBodySize(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  useEffect(() => {
    handleBodySize();
  }, []);

  const columns = [
    {
      title: "STT",
      width: 50,
      dataIndex: "stt",
      key: "index",
      fixed: "left",
    },
    {
      title: "Hình ảnh",
      width: 150,
      dataIndex: "image",
      key: "image",
      render: (_, record) => (
        <Image
          width={40}
          height={30}
          style={{ objectFit: "contain" }}
          src={record.image}
        />
      ),
    },
    {
      title: "Số đo của bộ phận",
      dataIndex: "BodyPart",
      key: "1",
      width: 150,
    },
    {
      title: "Tên cơ thể",
      dataIndex: "name",
      key: "2",
      width: 150,
    },
    {
      title: "Clip hướng dẫn",
      dataIndex: "GuideVideoLink",
      key: "3",
      width: 150,
      render: (_, record) => (
        <>
          <Button type="link" title="Video hướng dẫn">
            <a href={record.GuideVideoLink} target="_blank" rel="noreferrer">
              Nhấn vào để xem
            </a>
          </Button>
        </>
      ),
    },
    {
      title: "Giá trị tối thiểu (cm)",
      dataIndex: "MinValidValue",
      key: "4",
      width: 150,
    },
    {
      title: "Giá trị tối đa (cm)",
      dataIndex: "MaxValidValue",
      key: "5",
      width: 150,
    },
    {
      title: "Tùy chỉnh",
      dataIndex: "Action",
      key: "6",
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
              onClick={() => onDeleteBodySize(record?.id)}
            />
          </Col>
          <Col span={4} offset={7}>
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

  const getApi = bodySize?.map((item, index) => ({
    stt: index + 1,
    id: item.id,
    name: item.name,
    BodyPart: item.bodyPart,
    GuideVideoLink: item.guideVideoLink,
    MinValidValue: item.minValidValue,
    MaxValidValue: item.maxValidValue,
    image: item.image,
  }));

  //------------------------------------------------------------Modal create-------------------------------------------------------
  const [open, setOpen] = useState(false);
  const onCreate = async (values) => {
    const urlCreateMaterialType = `https://e-tailorapi.azurewebsites.net/api/body-size`;
    try {
      const response = await fetch(urlCreateMaterialType, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${manager?.token}`,
        },
        body: values,
      });
      const responseData = await response.text();
      if (response.ok && response.status === 200) {
        message.success(responseData);
        handleBodySize();
        return 1;
      } else if (response.status === 400 || response.status === 500) {
        message.error(responseData);
        return 0;
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  //-----------------------------------------------------------------Update------------------------------------------------
  const [openUpdate, setOpenUpdate] = useState(false);
  const [saveBodySizeId, setSaveBodySizeId] = useState(null);
  const handleOpenUpdate = (id) => {
    setSaveBodySizeId(id);
    setOpenUpdate(true);
  };
  const onUpdate = async (values) => {
    const url = `https://e-tailorapi.azurewebsites.net/api/body-size/${saveBodySizeId}`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${manager?.token}`,
        },
        body: values,
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
        handleBodySize();
        return 1;
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  //-------------------------------------------------------------------------Delete-------------------------------------------------------------------------
  const onDeleteBodySize = (id) => {
    const urlCreateBodySize = `https://e-tailorapi.azurewebsites.net/api/body-size/${id}`;
    Swal.fire({
      title: "Bạn có muốn xóa số đo cơ thể này?",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(urlCreateBodySize, {
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
              timer: 2000,
            });
            handleBodySize();
            return 1;
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
    <>
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
              <Button>Tổng cộng ({bodySize?.length})</Button>
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
              />
              <CollectionUpdateForm
                open={openUpdate}
                onUpdate={onUpdate}
                onCancel={() => {
                  setOpenUpdate(false);
                }}
                saveBodySizeId={saveBodySizeId}
                setSaveBodySizeId={setSaveBodySizeId}
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
    </>
  );
};

const CollectionCreateForm = ({ open, onCreate, onCancel }) => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [postImage, setPostImage] = useState(null);
  const [loading] = useState(false);
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
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Hình Ảnh
      </div>
    </button>
  );

  return (
    <Modal
      open={open}
      style={{ top: 95 }}
      title="Thêm mới số đo cơ thể"
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
            const bodyIndex = function CheckBodyIndex() {
              if (values.bodyPart === "Đầu") {
                return 1;
              } else if (values.bodyPart === "Thân") {
                return 2;
              } else if (values.bodyPart === "Chân") {
                return 3;
              } else if (values.bodyPart === "Cơ Thể") {
                return 4;
              }
            };
            const formData = new FormData();
            formData.append("BodyPart", values.bodyPart);
            formData.append("BodyIndex", bodyIndex());
            formData.append("Name", values.name);
            formData.append("Image", postImage);
            formData.append("GuideVideoLink", values.guideVideoLink);
            formData.append("MinValidValue", values.minValidValue);
            formData.append("MaxValidValue", values.maxValidValue);

            const check = await onCreate(formData);
            if (check === 1) {
              form.resetFields();
              setPostImage(null);
              setImageUrl(null);
              onCancel();
            }
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        style={{
          height: 420,
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
            <div>
              <Form.Item
                label="Số đo của bộ phận"
                name="bodyPart"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Số đo của bộ phận không được để trống",
                  },
                ]}
              >
                <Select>
                  <Select.Option value="Đầu">Đầu</Select.Option>
                  <Select.Option value="Thân">Thân</Select.Option>
                  <Select.Option value="Chân">Chân</Select.Option>
                  <Select.Option value="Cơ Thể">Cơ thể</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                className="mt-2"
                hasFeedback
                name="name"
                label="Tên số đo"
                rules={[
                  {
                    required: true,
                    message: "Tên không được để trống",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
          </Col>
          <Col span={12}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "25px",
              }}
            >
              <Form.Item
                name="image"
                getValueFromEvent={getFile}
                style={{ width: "130px" }}
                rules={[
                  {
                    required: true,
                    message: "Ảnh không được để trống",
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
                      alt="bodySize"
                      style={{
                        width: "131px",
                        height: "131px",
                        borderRadius: "10px",
                      }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Form.Item>
            </div>
          </Col>
        </Row>

        <Form.Item
          className="mt-2"
          name="guideVideoLink"
          label="Video hướng dẫn"
          hasFeedback
          rules={[
            { required: true, message: "Video hướng dẫn không được để trống" },
            { type: "url", warningOnly: true },
            { type: "string", min: 6 },
          ]}
        >
          <Input placeholder="Nhập đường dẫn" />
        </Form.Item>
        <Row>
          <Col span={12}>
            <Form.Item
              hasFeedback
              className="mt-2"
              label="Giá trị tối thiểu (cm)"
              name="minValidValue"
              rules={[
                {
                  required: true,
                  message: "Giá trị tối thiểu (cm) không được để trống",
                },
                {
                  type: "number",
                  min: 1,
                  message: "Phải là một số lớn hơn hoặc bằng 1",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const maxValidValue = getFieldValue("maxValidValue");
                    if (value && maxValidValue && value > maxValidValue) {
                      return Promise.reject(
                        new Error(
                          "Giá trị tối thiểu không thể lớn hơn giá trị tối đa"
                        )
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <InputNumber style={{ width: 220 }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              hasFeedback
              className="mt-2 ml-4"
              label="Giá trị tối đa (cm)"
              name="maxValidValue"
              rules={[
                {
                  required: true,
                  message: "Giá trị tối đa (cm) không được để trống",
                },
                {
                  type: "number",
                  min: 1,
                  message: "Phải là một số lớn hơn hoặc bằng 1",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const minValidValue = getFieldValue("minValidValue");
                    if (value && minValidValue && value < minValidValue) {
                      return Promise.reject(
                        new Error(
                          "Giá trị tối đa không thể nhỏ hơn giá trị tối thiểu"
                        )
                      );
                    }
                    return Promise.resolve();
                  },
                }),
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
  saveBodySizeId,
  setSaveBodySizeId,
}) => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [postImage, setPostImage] = useState(null);
  const [loadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [bodySizeDetail, setBodySizeDetail] = useState(null);
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

  useEffect(() => {
    const handleDataDetail = async () => {
      setLoading(true);
      const urlDetail = `https://e-tailorapi.azurewebsites.net/api/body-size/${saveBodySizeId}`;
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
          setImageUrl(responseData?.image);
          setBodySizeDetail(responseData);
        }
      } catch (error) {
        console.error("Error calling API:", error);
      }
    };
    handleDataDetail();
  }, [saveBodySizeId]);

  useEffect(() => {
    if (bodySizeDetail) {
      form.setFieldsValue({
        modifier: "public",
        bodyPart: bodySizeDetail.bodyPart || "",
        name: bodySizeDetail.name || "",
        image: bodySizeDetail.image || "",
        guideVideoLink: bodySizeDetail.guideVideoLink || "",
        minValidValue: bodySizeDetail.minValidValue || "",
        maxValidValue: bodySizeDetail.maxValidValue || "",
      });
    }
  }, [bodySizeDetail]);

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
        Hình Ảnh
      </div>
    </button>
  );

  return (
    <Modal
      open={open}
      style={{ top: 95 }}
      title="Cập nhật số đo cơ thể"
      okText="Cập nhật"
      cancelText="Hủy bỏ"
      onCancel={() => {
        onCancel();
        setSaveBodySizeId(null);
      }}
      onOk={() => {
        form
          .validateFields()
          .then(async (values) => {
            setLoadingUpdate(true);
            const bodyIndex = function CheckBodyIndex() {
              if (values.bodyPart === "Đầu") {
                return 1;
              } else if (values.bodyPart === "Thân") {
                return 2;
              } else if (values.bodyPart === "Chân") {
                return 3;
              } else if (values.bodyPart === "Cơ Thể") {
                return 4;
              }
            };
            const formData = new FormData();
            formData.append("Id", saveBodySizeId);
            formData.append("BodyPart", values.bodyPart);
            formData.append("BodyIndex", bodyIndex());
            formData.append("Name", values.name);
            formData.append("Image", postImage);
            formData.append("GuideVideoLink", values.guideVideoLink);
            formData.append("MinValidValue", values.minValidValue);
            formData.append("MaxValidValue", values.maxValidValue);
            const check = await onUpdate(formData);
            if (check === 1) {
              onCancel();
              setSaveBodySizeId(null);
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
            height: "350px",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <Form
          style={{
            height: 420,
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
              <div>
                <Form.Item
                  label="Số đo của bộ phận"
                  name="bodyPart"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Số đo của bộ phận không được để trống",
                    },
                  ]}
                >
                  <Select disabled>
                    <Select.Option value="Đầu">Đầu</Select.Option>
                    <Select.Option value="Thân">Thân</Select.Option>
                    <Select.Option value="Chân">Chân</Select.Option>
                    <Select.Option value="Cơ Thể">Cơ Thể</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  className="mt-2"
                  hasFeedback
                  name="name"
                  label="Tên số đo"
                  rules={[
                    {
                      required: true,
                      message: "Tên không được để trống",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
            </Col>
            <Col span={12}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "25px",
                }}
              >
                <Form.Item
                  name="image"
                  getValueFromEvent={getFile}
                  style={{ width: "130px" }}
                  rules={[
                    {
                      required: true,
                      message: "Ảnh không được để trống",
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
                        alt="avatar"
                        style={{
                          width: "131px",
                          height: "131px",
                          borderRadius: "10px",
                        }}
                      />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Form.Item
            className="mt-2"
            name="guideVideoLink"
            label="Video hướng dẫn"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Video hướng dẫn không được để trống",
              },
              { type: "url", warningOnly: true },
              { type: "string", min: 6 },
            ]}
          >
            <Input placeholder="Nhập đường dẫn" />
          </Form.Item>
          <Row>
            <Col span={12}>
              <Form.Item
                hasFeedback
                className="mt-2"
                label="Giá trị tối thiểu (cm)"
                name="minValidValue"
                rules={[
                  {
                    required: true,
                    message: "Giá trị tối thiểu (cm) không được để trống",
                  },
                  {
                    type: "number",
                    min: 1,
                    message: "Phải là một số lớn hơn hoặc bằng 1",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const maxValidValue = getFieldValue("maxValidValue");
                      if (value && maxValidValue && value > maxValidValue) {
                        return Promise.reject(
                          new Error(
                            "Giá trị tối thiểu không thể lớn hơn giá trị tối đa"
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <InputNumber style={{ width: 220 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                hasFeedback
                className="mt-2 ml-4"
                label="Giá trị tối đa (cm)"
                name="maxValidValue"
                rules={[
                  {
                    required: true,
                    message: "Giá trị tối đa (cm) không được để trống",
                  },
                  {
                    type: "number",
                    min: 1,
                    message: "Phải là một số lớn hơn hoặc bằng 1",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const minValidValue = getFieldValue("minValidValue");
                      if (value && minValidValue && value < minValidValue) {
                        return Promise.reject(
                          new Error(
                            "Giá trị tối đa không thể nhỏ hơn giá trị tối thiểu"
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
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

function ManagementBodySize() {
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
          name={"Số đo cơ thể"}
          link={"/manager/body-size"}
          iconHome={<HomeOutlined />}
          iconRoute={<StraightenIcon style={{ fontSize: 15 }} />}
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
        <ManagementBodySizeContent />
      </div>
    </div>
  );
}

export default ManagementBodySize;
