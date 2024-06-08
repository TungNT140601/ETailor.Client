import React, { useState, useRef, useEffect } from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { UploadOutlined } from "@ant-design/icons";
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
import {
  Typography,
  Button,
  Flex,
  Divider,
  Carousel,
  Input,
  Table,
  Checkbox,
  Modal,
  Breadcrumb,
  theme,
  Form,
  Space,
  Select,
  Radio,
  Upload,
  Steps,
  Row,
  Col,
  Card,
  Avatar,
  message,
} from "antd";
import CircularProgress from "@mui/material/CircularProgress";
import "./index.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Paragraph from "antd/es/skeleton/Paragraph";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useQuery } from "react-query";
import ManagerHeader from "../../../components/ManagerHeader";

const { Search, TextArea } = Input;
const { Title, Text } = Typography;
const { Meta } = Card;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 48,
    },
    sm: {
      span: 14,
    },
  },
};
const manager = JSON.parse(localStorage.getItem("manager"));
const BlogUpdateFormModal = ({
  openUpdateModal,
  handleUpdate,
  onCancel,
  initialUpdateValues,
  data,
}) => {
  const [contentUpdateValue, setContentUpdateValue] = useState(data?.content);
  useEffect(() => {
    if (data) {
      setContentUpdateValue(data.content);
    }
  }, [data]);

  const reactQuillRef = useRef(null);
  const onChange = (content, _delta, _source, editor) => {
    setContentUpdateValue(content);
  };
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(data?.thumbnail);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const getFile = (e) => {
    const file = e.fileList[0];
    if (file && file.originFileObj) {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);
      reader.onload = () => {
        setUploadedImageUrl(reader.result);
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
      <div
        style={{
          marginTop: 8,
        }}
      >
        <PlusOutlined /> Upload
      </div>
    </button>
  );
  return (
    <Modal
      open={openUpdateModal}
      title="Cập nhật bài viết"
      okText="Cập nhật"
      cancelText="Huỷ"
      okButtonProps={{
        autoFocus: true,
      }}
      onCancel={() => {
        form.resetFields();
        setImageUrl(null);
        onCancel();
      }}
      width={900}
      destroyOnClose
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            const success = handleUpdate(data.id, values);
            console.log("UPDATE:", values);
            if (success === 1) {
              form.resetFields();
              setImageUrl("");
            }
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >

      <Form
        layout="vertical"
        form={form}
        name="form_in_modal"
        initialValues={data}
      >
        <Form.Item
          name="Title"
          label="Tiêu đề"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tiêu đề",
            },
          ]}
          initialValue={data?.title}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="Hastag"
          label="Hastag"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập hastag",
            },
          ]}
          initialValue={data?.hastag}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="image"
          label="Ảnh Thumbnail"
          style={{ width: "130px" }}
          rules={[
            {
              required:true,
              message:"Không được để trống ảnh"
            }
          ]}
        >
          <Upload
            beforeUpload={(file) => {
              console.log(
                "file image: ",
                file
              );
              return false;
            }}
            listType="picture-card"
            maxCount={1}
            showUploadList={false}
          >
            <img
              src={data?.thumbnail}
              alt="avatar"
              style={{ width: "100%", maxHeight: 120, objectFit: "cover" }}
            />
          </Upload>
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            {
              required: true,
              message: "Please input the title of collection!",
            },
          ]}
          initialValue={data?.content}
        >
          <ReactQuill
            ref={reactQuillRef}
            theme="snow"
            placeholder="Start writing..."
            modules={{
              toolbar: {
                container: [
                  [{ header: "1" }, { header: "2" }, { font: [] }],
                  [{ size: [] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [
                    { list: "ordered" },
                    { list: "bullet" },
                    { indent: "-1" },
                    { indent: "+1" },
                  ],
                  ["link", "image", "video"],
                  ["code-block"],
                  ["clean"],
                ],
              },
              clipboard: {
                matchVisual: false,
              },
            }}
            formats={[
              "header",
              "font",
              "size",
              "bold",
              "italic",
              "underline",
              "strike",
              "blockquote",
              "list",
              "bullet",
              "indent",
              "link",
              "image",
              "video",
              "code-block",
            ]}
            value={contentUpdateValue}
            onChange={onChange}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
const BlogCreateFormModal = ({ open, onCreate, onCancel, initialValues }) => {
  const [contentCreateValue, setContentCreateValue] = useState("");
  const reactQuillRef = useRef(null);

  const onChange = (content, _delta, _source, editor) => {
    setContentCreateValue(content);
  };
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  // const getFile = (e) => {
  //   const file = e.fileList[0];
  //   if (file && file.originFileObj) {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file.originFileObj);
  //     reader.onload = () => {
  //       setImageUrl(reader.result);
  //     };
  //   }
  //   return e && e.fileList;
  // };
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <div
        style={{
          marginTop: 8,
        }}
      >
        <PlusOutlined /> Upload
      </div>
    </button>
  );

  return (
    <Modal
      open={open}
      title="Tạo blog mới"
      okText="Tạo mới"
      cancelText="Huỷ"
      okButtonProps={{
        autoFocus: true,
      }}
      onCancel={() => {
        form.resetFields();
        setImageUrl(null);
        onCancel();
      }}
      destroyOnClose
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            const success = onCreate(values, imageUrl, contentCreateValue);
            if (success === 1) {
              form.resetFields();
              setImageUrl("");
            }

          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        layout="vertical"
        form={form}
        name="form_in_modal"
        initialValues={initialValues}
      >
        <Form.Item
          name="Title"
          label="Tiêu đề"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tiêu đề",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="Hastag"
          label="Hastag"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập hastag",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="image"
          label="Ảnh Thumbnail"
          rules={[
            {
              required: true,
              message: "Vui lòng upload ảnh"
            }
          ]}
          style={{ width: "130px" }}
        >
          <Upload
            beforeUpload={(file) => {
              console.log(
                "file image: ",
                file
              );

              return false;
            }}
            listType="picture-card"
            maxCount={1}

          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="avatar"
                style={{
                  width: "100%",
                }}
              />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            {
              required: true,
              message: "Please input the title of collection!",
            },
          ]}
        >
          <ReactQuill
            ref={reactQuillRef}
            theme="snow"
            placeholder="Start writing..."
            modules={{
              toolbar: {
                container: [
                  [{ header: "1" }, { header: "2" }, { font: [] }],
                  [{ size: [] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [
                    { list: "ordered" },
                    { list: "bullet" },
                    { indent: "-1" },
                    { indent: "+1" },
                  ],
                  ["link", "image", "video"],
                  ["code-block"],
                  ["clean"],
                ],
              },
              clipboard: {
                matchVisual: false,
              },
            }}
            formats={[
              "header",
              "font",
              "size",
              "bold",
              "italic",
              "underline",
              "strike",
              "blockquote",
              "list",
              "bullet",
              "indent",
              "link",
              "image",
              "video",
              "code-block",
            ]}
            value={contentCreateValue}
            onChange={onChange}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};


const ManagementBlogContent = () => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  useEffect(() => {
    if (!manager) {
      manager = JSON.parse(localStorage.getItem("manager"));
    }
  }, []);
  const getUrl = "https://e-tailorapi.azurewebsites.net/api/blog";
  const [formValues, setFormValues] = useState();
  const [open, setOpen] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const navigate = useNavigate();
  const onCreate = async (values) => {

    console.log("VALUE:", values);
    setFormValues(values);
    const formData = new FormData();
    formData.append("Title", values.Title);
    formData.append("Hastag", values.Hastag);
    formData.append("Thumbnail", values.image.fileList[0]?.originFileObj);
    formData.append("Content", values.description);
    for (var p of formData.entries()) {
      console.log("formData", p[0] + " - " + p[1]);
    }
    try {
      const CREATE_BLOG_URL = `https://e-tailorapi.azurewebsites.net/api/blog`;
      const response = await fetch(CREATE_BLOG_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${manager?.token}`,
        },

        body: formData,
      });
      const text = await response.text()
      if (response.ok) {

        setOpen(false);
        await Swal.fire({
          icon: "success",
          title: text,
          timer: 2000,
        });
        LoadBlog();
        return 1;
      } else {
        Swal.fire({
          icon: "error",
          title: "Tạo blog không thành công",
          text: text,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      return -1;
    } finally {
    }
  };

  const handleUpdate = async (id, values) => {
    setFormValues(values);
    console.log("ID:", id);
    const formData = new FormData();
    formData.append("Title", values.Title);
    formData.append("Hastag", values.Hastag);
    formData.append("Thumbnail", values?.image.fileList[0]?.originFileObj);
    formData.append("Content", values.description);
    formData.append("Id", id);
    console.log("VALUES UPDATE:", values);
    try {
      const UPDATE_BLOG_URL = `https://e-tailorapi.azurewebsites.net/api/blog/${id}`;
      const response = await fetch(UPDATE_BLOG_URL, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${manager?.token}`,
        },

        body: formData,
      });
      const text = await response.text()
      if (response.ok) {
        setOpenUpdateModal(false);
        await Swal.fire({
          icon: "success",
          title: "Chỉnh sửa thành công",
          timer: 2000,
        });
        LoadBlog();
        return 1;
      } else {
        Swal.fire({
          icon: "error",
          title: "Chỉnh sửa thất bại!",
          text: text,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      return -1;
    } finally {
    }
  };
  const {
    data: blog,
    isLoading: loading,
    refetch: LoadBlog,
  } = useQuery("get-blog", () =>
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
      width: "5%",
      dataIndex: "stt",
      key: "stt",
      fixed: "left",
    },
    {
      title: "Tựa đề",
      width: "70%",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Action",
      width: "20%",
      dataIndex: "Action",
      key: "Action",
      fixed: "right",
      render: (_, record) => (
        <Row justify="start">
          <Col span={4}>
            <DeleteOutlined
              onClick={() => handleDelete(record.id)}
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
          <Col span={4}>
            <EditOutlined
              onClick={() => handleEdit(record)}
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

  const getApi = blog?.map((item, index) => ({
    key: index + 1,
    stt: index + 1,
    id: item.id,
    title: item.title,
    description: item.content,
  }));

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
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Bạn muốn xoá blog này ?",
      showDenyButton: true,
      showCancelButton: true,
      showConfirmButton: false,
      denyButtonText: `Xoá`,
      cancelButtonText: `Huỷ`,
    }).then(async (result) => {
      if (result.isDenied) {
        const DELETE_URL = `https://e-tailorapi.azurewebsites.net/api/blog/${id}`;
        try {
          const response = await fetch(DELETE_URL, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${manager?.token}`,
            },
          });

          if (response.ok) {
            LoadBlog();
            await Swal.fire({
              icon: "success",
              title: "Đã xoá",
              timer: 2000,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Tạo mới không thành công!",
            });
          }
        } catch (error) {
          console.error("Error:", error);
        } finally {
        }
      }
    });
  };
  const [blogDetail, setBlogDetail] = useState(null);

  const handleEdit = (record) => {
    console.log("Edit clicked for:", record);
    if (record) {
      const GET_DETAIL_BLOG_URL = `https://e-tailorapi.azurewebsites.net/api/blog/${record.id}`;
      fetch(GET_DETAIL_BLOG_URL, {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setBlogDetail(data);
          setOpenUpdateModal(true);
        })
        .catch((error) => {
          console.error("Error fetching blog detail:", error);
        });
    }
  };
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
            <Button>Tổng cộng ({blog?.length})</Button>
          </Col>
          <Col span={4} offset={10}>
            <Button type="primary" onClick={() => setOpen(true)}>
              Thêm mới <PlusOutlined />
            </Button>
            <BlogCreateFormModal
              open={open}
              onCreate={onCreate}
              onCancel={() => setOpen(false)}
              initialValues={{
                modifier: "public",
              }}
            />
            <BlogUpdateFormModal
              handleUpdate={handleUpdate}
              onCancel={() => setOpenUpdateModal(false)}
              openUpdateModal={openUpdateModal}
              data={blogDetail}
              initialUpdateValues={{
                modifier: "public",
              }}
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
          style={{ marginTop: 24 }}
          expandable={{
            expandedRowRender: (record) => (
              <p
                style={{
                  margin: 0,
                }}
              >
                {record?.description}
              </p>
            ),
            rowExpandable: (record) => record?.stt !== "Not Expandable",
          }}
          pagination={{
            position: ["bottomCenter"],
          }}
          dataSource={getApi}
        />
      )}
    </div>
  );
};

function ManagementBlog() {

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
        {/* <ManagementBlogHeader /> */}
        <ManagerHeader
          name={"Bài viết"}
          link={"/manager/orders"}
          iconHome={<HomeOutlined />}
          iconRoute={<MenuBookIcon style={{ fontSize: 15 }} />}
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
        <ManagementBlogContent />
      </div>
    </div>
  );
}

export default ManagementBlog;
