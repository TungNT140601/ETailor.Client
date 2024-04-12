import React, { useEffect, useRef, useState } from "react";
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
  UploadOutlined,
  LoadingOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Typography, Carousel } from "antd";
import "./index.css";
import CircularProgress from "@mui/material/CircularProgress";

import { Input } from "antd";
import { Button, Flex, Divider, Modal } from "antd";
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
  Alert,
  InputNumber,
  Checkbox,
  Table,
} from "antd";

import CheckroomIcon from "@mui/icons-material/Checkroom";
import Paragraph from "antd/es/skeleton/Paragraph";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const { Search, TextArea } = Input;
const { Title, Text } = Typography;
const { Meta } = Card;
const { Option } = Select;

const ManagementProductTemplateHeader = () => {
  const manager = JSON.parse(localStorage.getItem("manager"));
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
              href: "/manager/product-template",
              title: (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "#9F78FF",
                    }}
                  >
                    <CheckroomIcon fontSize="small" />
                    &nbsp;
                    <span>Bản mẫu</span>
                  </div>
                </>
              ),
            },
          ]}
        />
        <Title level={4}>Bản mẫu</Title>
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

export const ManagementCreateProductTemplate = () => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const loading = false;
  const [form] = Form.useForm();
  //-----------------------------------------------Hinh anh buoc 1
  const [imageUrl, setImageUrl] = useState(null);
  const [postImageUrl, setPostImageUrl] = useState(null);
  const [uploadKey, setUploadKey] = useState(0);

  //-----------------------------------------------thumbnail buoc 1
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [postThumbnailUrl, setPostThumbUrl] = useState(null);

  //-----------------------------------------------Collection buoc 1
  const [collectionUrl, setCollectionUrl] = useState(null);
  const [uploadKeyCollection, setUploadKeyCollection] = useState(0);
  const [postUploadKeyCollection, setPostUploadKeyCollection] = useState(null);
  //-----------------------------------------------Product Template ID
  const [saveProductTemplateId, setSaveProductTemplate] = useState(null);

  const [current, setCurrent] = useState(0);
  const getFile = async (e) => {
    const files = e.fileList.map((file) => file.originFileObj);
    setPostImageUrl((prevResults) => {
      if (prevResults === null) {
        return files;
      } else {
        // Loại bỏ các URL ảnh đã tồn tại trong mảng trước khi thêm vào
        const filteredResults = files.filter(
          (files) => !prevResults.includes(files)
        );
        return [...prevResults, ...filteredResults];
      }
    });
    const readers = e.fileList.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);
      return reader;
    });

    // Đợi tất cả các FileReader hoàn thành
    const newResults = [];
    for (const reader of readers) {
      const result = await new Promise((resolve) => {
        reader.onload = () => {
          resolve(reader.result);
        };
      });
      newResults.push(result);
    }

    setImageUrl((prevResults) => {
      if (prevResults === null) {
        return newResults;
      } else {
        // Loại bỏ các URL ảnh đã tồn tại trong mảng trước khi thêm vào
        const filteredResults = newResults.filter(
          (newResult) => !prevResults.includes(newResult)
        );
        return [...prevResults, ...filteredResults];
      }
    });
    return e && e.fileList;
  };

  useEffect(() => {
    // Mỗi khi danh sách ảnh thay đổi, cập nhật key của Upload component
    setUploadKey(uploadKey + 1);
  }, [imageUrl]);

  const getFileThumbnail = (e) => {
    console.log(e);
    const file = e.fileList[0];
    if (file && file.originFileObj) {
      setPostThumbUrl(file.originFileObj);
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);
      reader.onload = () => {
        setThumbnailUrl(reader.result);
      };
    }
    return e && e.fileList;
  };

  const getFileCollection = async (e) => {
    const files = e.fileList.map((file) => file.originFileObj);
    setPostUploadKeyCollection((prevResults) => {
      if (prevResults === null) {
        return files;
      } else {
        // Loại bỏ các URL ảnh đã tồn tại trong mảng trước khi thêm vào
        const filteredResults = files.filter(
          (files) => !prevResults.includes(files)
        );
        return [...prevResults, ...filteredResults];
      }
    });
    const readers = e.fileList.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);
      return reader;
    });

    // Đợi tất cả các FileReader hoàn thành
    const newResults = [];
    for (const reader of readers) {
      const result = await new Promise((resolve) => {
        reader.onload = () => {
          resolve(reader.result);
        };
      });
      newResults.push(result);
    }

    setCollectionUrl((prevResults) => {
      if (prevResults === null) {
        return newResults;
      } else {
        // Loại bỏ các URL ảnh đã tồn tại trong mảng trước khi thêm vào
        const filteredResults = newResults.filter(
          (newResult) => !prevResults.includes(newResult)
        );
        return [...prevResults, ...filteredResults];
      }
    });
    return e && e.fileList;
  };

  useEffect(() => {
    setUploadKeyCollection(uploadKeyCollection + 1);
  }, [collectionUrl]);

  const clearAllImagesCollection = () => {
    setCollectionUrl(null);
    setPostUploadKeyCollection(null);
  };
  const handleClearAllImagesCollection = async () => {
    await clearAllImagesCollection();
  };

  const next = async () => {
    if (current === 0) {
      setCurrent(current + 1);
    } else if (current === 1) {
      const checkValid = !cards?.some((item) => item.components.length === 0);
      if (checkValid) {
        setCurrent(current + 1);
      } else {
        Swal.fire({
          position: "top-center",
          icon: "warning",
          title: "Vui lòng điền ít nhất 1 kiểu cho mỗi bộ phận!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } else if (current === 2) {
      if (saveBodySize[0].length >= 1) {
        setLoadingStep3(true);
        const getUrl = `https://e-tailorapi.azurewebsites.net/api/template-body-size/template/${saveProductTemplateId}`;
        try {
          const response = await fetch(getUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${manager?.token}`,
            },
            body: JSON.stringify(saveBodySize[0]),
          });
          if (response.ok && response.status === 200) {
            const responseData = await response.text();

            setCurrent(current + 1);
          }
        } catch (error) {
          console.error("Error calling API:", error);
        } finally {
          setLoadingStep3(false);
        }
      } else {
        Swal.fire({
          position: "top-center",
          icon: "warning",
          title: "Điền phải ít nhất 1 số đo cơ thể!!!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
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
        Upload
      </div>
    </button>
  );
  const prev = () => {
    setCurrent(current - 1);
  };

  const clearAllImages = () => {
    setImageUrl(null);
    setPostImageUrl(null);
  };
  const handleClearAllImages = async () => {
    clearAllImages();
  };
  //-------------------------------------------------------------step 1----------------------------------------------
  const [getCategory, setCategory] = useState([]);
  const [loadingStep1, setLoadingStep1] = useState(false);
  const getUrl =
    "https://e-tailorapi.azurewebsites.net/api/category-management";

  const handleGetCategory = async () => {
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
        setCategory(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  const [saveCategoryId, setSaveCategoryId] = useState(null);
  const [categoryDetailData, setCategoryDetailData] = useState({});

  const handleGetDetailCategory = async () => {
    const getDetailUrl = `https://e-tailorapi.azurewebsites.net/api/category-management/${saveCategoryId}`;
    try {
      const response = await fetch(getDetailUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.json();
        setCategoryDetailData(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  useEffect(() => {
    if (saveCategoryId) {
      handleGetDetailCategory();
    }
  }, [saveCategoryId]);

  //--------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    handleGetCategory();
  }, []);
  const onFinishStep1 = async () => {
    const values = form.getFieldsValue();
    const formData = new FormData();
    formData.append("Id", saveProductTemplateId ? saveProductTemplateId : null);
    formData.append("CategoryId", values.CategoryId);
    formData.append("Name", values.Name);
    formData.append("Description", values.Description);
    formData.append("Price", values.Price);
    formData.append("ThumbnailImageFile", postThumbnailUrl);
    if (postImageUrl?.length >= 1) {
      postImageUrl.map((item) => formData.append("ImageFiles", item));
    }
    if (postUploadKeyCollection?.length >= 1) {
      postUploadKeyCollection.map((item) =>
        formData.append("CollectionImageFiles", item)
      );
    }

    for (var pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    setLoadingStep1(true);
    const urlCreateMaterialType = `https://e-tailorapi.azurewebsites.net/api/template-management/create-template`;
    try {
      const response = await fetch(urlCreateMaterialType, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${manager?.token}`,
        },
        body: formData,
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.text();
        console.log("step1", responseData);
        setSaveProductTemplate((prev) => {
          if (prev) {
            return prev;
          } else {
            return responseData;
          }
        });
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Tạo thông tin cho bản mẫu hoàn tất",
          showConfirmButton: false,
          timer: 2500,
        });

        next();
        return 1;
      } else if (response.status === 400 || response.status === 500) {
        const responseData = await response.text();
        Swal.fire({
          position: "top-center",
          icon: "error",
          title: responseData,
          showConfirmButton: false,
          timer: 2500,
        });
      }
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      setLoadingStep1(false);
    }
  };

  //-------------------------------------------------------------step 2----------------------------------------------

  const [cards, setCards] = useState([]);

  const [componentTypeCreateData, setComponentTypeCreateData] = useState(null);

  const [open, setOpen] = useState(false);

  const handleOpen = (data) => {
    setComponentTypeCreateData(data);
    setOpen(true);
  };
  const onCreate = async (values) => {
    console.log("Values", values);
    const formData = new FormData();
    formData.append("Name", values.name);
    formData.append("ImageFile", values.image);
    formData.append("Default", values.default);

    const urlCreateMaterialType = `https://e-tailorapi.azurewebsites.net/api/Component/template/${saveProductTemplateId}/${values.componentTypeId}`;
    try {
      const response = await fetch(urlCreateMaterialType, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${manager?.token}`,
        },
        body: formData,
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.text();
        handleGetComponentType();
        return 1;
      } else if (response.status === 400 || response.status === 500) {
        const responseData = await response.text();
        Swal.fire({
          position: "top-center",
          icon: "error",
          title: responseData,
          showConfirmButton: false,
          timer: 4500,
        });
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
    setOpen(false);
  };

  const handleGetComponentType = async () => {
    const getDetailUrl = `https://e-tailorapi.azurewebsites.net/api/template/${saveProductTemplateId}/component-types`;
    try {
      const response = await fetch(getDetailUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.json();
        setCards(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };
  useEffect(() => {
    handleGetComponentType();
  }, [saveProductTemplateId]);

  const handleDeleteComponent = async (
    templateId,
    componentTypeId,
    componentId
  ) => {
    const getDetailUrl = `https://e-tailorapi.azurewebsites.net/api/Component/template/${templateId}/${componentTypeId}/${componentId}`;
    try {
      const response = await fetch(getDetailUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok && response.status === 200) {
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Xóa thành công",
          showConfirmButton: false,
          timer: 1500,
        });
        await handleGetComponentType();
      } else if (response.status === 400 || response.status === 500) {
        const responseData = await response.text();
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: responseData,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  //--------------------------------------------------------------step 3---------------------------------------------
  const [saveBodySize, setSaveBodySize] = useState([]);
  const [loadingStep3, setLoadingStep3] = useState(false);

  const handleChange = (value) => {
    setSaveBodySize([value]);
  };
  const [dataBodySize, setDataBodySize] = useState([]);

  const handleDataBodySize = async () => {
    const getDetailUrl = `https://e-tailorapi.azurewebsites.net/api/body-size`;
    try {
      const response = await fetch(getDetailUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.json();
        console.log("DATA BODY SIZE :", responseData);
        setDataBodySize(responseData);
      } else if (response.status === 400 || response.status === 500) {
        const responseData = await response.text();
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: responseData,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  useEffect(() => {
    handleDataBodySize();
  }, []);

  //--------------------------------------------------------------step 4---------------------------------------------
  const [itemCategoryStep4, setItemCategoryStep4] = useState([]);
  const [loadingStep4, setLoadingStep4] = useState(false);
  const navigate = useNavigate();

  const handleGetComponentTypesCategory = async () => {
    const getlUrl = `https://e-tailorapi.azurewebsites.net/api/category/${saveCategoryId}/component-types`;
    try {
      const response = await fetch(getlUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.json();
        setItemCategoryStep4(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  const handleCompletedTemplate = async () => {
    const step4Check = form.getFieldValue(["items"]);
    const beData = step4Check?.map((stage) => ({
      name: stage.name,
      componentTypeIds: stage.componentTypeIds.map((item) => item.value),
    }));
    setLoadingStep4(true);
    const postlUrl = `https://e-tailorapi.azurewebsites.net/api/template-stage/template/${saveProductTemplateId}`;
    try {
      const response = await fetch(postlUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
        body: JSON.stringify(beData),
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
        navigate("/manager/product-template");
      } else if (response.status === 400 || response.status === 500) {
        const responseData = await response.text();
        Swal.fire({
          position: "top-center",
          icon: "error",
          title: responseData,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      setLoadingStep4(false);
    }
  };
  useEffect(() => {
    handleGetComponentTypesCategory();
  }, [saveCategoryId]);

  const steps = [
    {
      title: "Khởi tạo bản mẫu",
      content: (
        <Row justify="center" style={{ marginTop: 24 }}>
          <Col span={24}>
            <Form
              form={form}
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              style={{
                maxWidth: 1000,
              }}
              initialValues={{
                remember: true,
              }}
              autoComplete="off"
            >
              {form.getFieldError("name").map((error) => (
                <Alert message={error} type="error" />
              ))}
              <Form.Item
                label="Tên bản mẫu"
                hasFeedback
                name="Name"
                rules={[
                  {
                    required: true,
                    message: "Nhập tên bản mẫu",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Chọn loại bản mẫu"
                hasFeedback
                name="CategoryId"
                rules={[
                  {
                    required: true,
                    message: "Chọn loại bản mẫu",
                  },
                ]}
              >
                <Select
                  onChange={(value) => setSaveCategoryId(value)}
                  disabled={saveProductTemplateId}
                >
                  {getCategory &&
                    getCategory?.map((category) => {
                      return (
                        <Select.Option value={category?.id} key={category?.id}>
                          {category?.name}
                        </Select.Option>
                      );
                    })}
                </Select>
              </Form.Item>
              <Form.Item
                className="mt-2"
                hasFeedback
                label="Nhập giá"
                name="Price"
                rules={[
                  {
                    required: true,
                    message: "Giá tiền không được để trống",
                  },
                  {
                    type: "number",
                    min: 10000,
                    message: "Phải là một số và lớn hơn hoặc bằng 10.000đ",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/đ\s?|(,*)/g, "")}
                />
              </Form.Item>
              <Form.Item
                label="Mô tả"
                name="Description"
                rules={[
                  {
                    required: true,
                    message: "Nhập mô tả cho bản mẫu",
                  },
                ]}
              >
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item
                label="Thumbnail"
                valuePropName="fileList"
                getValueFromEvent={getFileThumbnail}
                name="ThumbnailImageFile"
                rules={[
                  {
                    required: true,
                    message: "Thumbnail không được để trống",
                  },
                ]}
              >
                <Upload
                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  listType="picture-card"
                  maxCount={1}
                  showUploadList={false}
                >
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt="thumbnail"
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
              <Form.Item
                label="Hình ảnh bản mẫu"
                name="ImageFiles"
                getValueFromEvent={getFile}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Upload
                    key={uploadKey}
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    onChange={getFile}
                    multiple={true}
                    showUploadList={false}
                  >
                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                  </Upload>
                  {imageUrl && (
                    <Button
                      icon={<UploadOutlined />}
                      onClick={handleClearAllImages}
                    >
                      Clear tất cả
                    </Button>
                  )}
                </div>
                <Row gutter={[16, 24]}>
                  {imageUrl &&
                    imageUrl.map((url, index) => (
                      <Col
                        className="gutter-row"
                        span={6}
                        key={`image_${index}`}
                        style={{ position: "relative", marginTop: 10 }}
                      >
                        <img
                          src={url}
                          alt={`image_${index}`}
                          style={{
                            width: 129,
                            height: 129,
                            borderRadius: 10,
                            border: "1px solid #9F78FF",
                            marginTop: 10,
                          }}
                        />
                        <CloseCircleOutlined
                          style={{
                            fontSize: 15,
                            position: "absolute",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            const newImageUrlArray = imageUrl.filter(
                              (_, idx) => idx !== index
                            );
                            setImageUrl(newImageUrlArray);
                            const newPostImageArray = postImageUrl.filter(
                              (_, idx) => idx !== index
                            );
                            setPostImageUrl(newPostImageArray);
                          }}
                        />
                      </Col>
                    ))}
                </Row>
              </Form.Item>
              <Form.Item
                label="Bộ sưu tập"
                name="CollectionImageFiles"
                getValueFromEvent={getFileCollection}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Upload
                    key={uploadKeyCollection}
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    onChange={getFileCollection}
                    multiple={true}
                    showUploadList={false}
                  >
                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                  </Upload>
                  {collectionUrl && (
                    <Button
                      icon={<UploadOutlined />}
                      onClick={handleClearAllImagesCollection}
                    >
                      Clear tất cả
                    </Button>
                  )}
                </div>
                <Row gutter={[16, 24]} style={{ marginTop: 10 }}>
                  {collectionUrl &&
                    collectionUrl?.map((url, index) => (
                      <Col
                        className="gutter-row"
                        span={6}
                        key={`image_collection_${index}`}
                      >
                        <img
                          src={url}
                          alt={`image_collection_${index}`}
                          style={{
                            width: 129,
                            height: 129,
                            borderRadius: 10,
                            border: "1px solid #9F78FF",
                            marginTop: 10,
                          }}
                        />
                        <CloseCircleOutlined
                          style={{
                            fontSize: 15,
                            position: "absolute",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            const newImageUrlArray = collectionUrl.filter(
                              (_, idx) => idx !== index
                            );
                            setCollectionUrl(newImageUrlArray);
                            const newPostImageArray =
                              postUploadKeyCollection.filter(
                                (_, idx) => idx !== index
                              );
                            setPostUploadKeyCollection(newPostImageArray);
                          }}
                        />
                      </Col>
                    ))}
                </Row>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      ),
    },
    {
      title: "Thông tin cơ bản",
      content: (
        <>
          {categoryDetailData &&
            categoryDetailData?.componentTypes?.map((data, index) => {
              return (
                <>
                  <div
                    style={{
                      display: "flex",
                      marginTop: 20,
                    }}
                  >
                    <Title level={4}>
                      {index + 1}. {data.name}
                    </Title>
                    <Button
                      type="primary"
                      onClick={() => handleOpen(data)}
                      style={{ marginLeft: 24 }}
                    >
                      Thêm mới
                    </Button>
                  </div>
                  <div style={{ width: "100%" }}>
                    <Row
                      justify="center"
                      className="gutter-row"
                      style={{
                        backgroundColor: "white",
                        border: "1px solid #9F78FF",
                        borderRadius: "10px",
                        width: "100%",
                        height: 350,
                        overflowY: "scroll",
                      }}
                    >
                      {(() => {
                        const filteredCards = cards.filter(
                          (card) => card.id === data.id
                        );
                        return filteredCards?.map((card) => {
                          return card.components.length > 0 ? (
                            card.components?.map((component) => {
                              return (
                                <>
                                  <Col
                                    key={component.id}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Card
                                      style={{
                                        width: 200,
                                        marginTop: 15,
                                        marginLeft: 15,
                                        marginRight: 15,
                                        border: "1px solid #D4D4D4",
                                      }}
                                      cover={
                                        <Image
                                          width={200}
                                          height={200}
                                          src={component.image}
                                          style={{
                                            border: "1px solid #D4D4D4",
                                          }}
                                        />
                                      }
                                      actions={[
                                        <DeleteOutlined
                                          key="delete"
                                          onClick={() => {
                                            console.log(
                                              "Thang ong noi: ",
                                              saveProductTemplateId
                                            );
                                            console.log("Thang cha: ", data);
                                            console.log(
                                              "Thang con: ",
                                              component
                                            );
                                            handleDeleteComponent(
                                              saveProductTemplateId,
                                              data.id,
                                              component.id
                                            );
                                          }}
                                        />,
                                      ]}
                                    >
                                      <Meta title={component.name} />
                                    </Card>
                                  </Col>
                                </>
                              );
                            })
                          ) : (
                            <div
                              style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Title level={4}>
                                Chưa có kiểu nào. Hãy{" "}
                                <span
                                  style={{
                                    textDecoration: "underlined",
                                    color: "#9F78FF",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleOpen(data)}
                                >
                                  thêm vào
                                </span>
                              </Title>
                            </div>
                          );
                        });
                      })()}
                    </Row>
                  </div>
                </>
              );
            })}
          <CollectionCreateFormStep2
            open={open}
            onCreate={onCreate}
            onCancel={() => {
              setOpen(false);
            }}
            saveProductTemplateId={saveProductTemplateId}
            componentTypeCreateData={componentTypeCreateData}
          />
        </>
      ),
    },
    {
      title: "Số đo cần thiết",
      content: (
        <>
          <Divider>
            <Title level={4}>Số đo cần thiết cho bản mẫu</Title>
          </Divider>
          <br />
          <Space
            direction="vertical"
            style={{
              width: "100%",
              height: 340,
              textAlign: "center",
            }}
          >
            <Select
              mode="multiple"
              placeholder="Chọn số đo phù hợp cho bản mẫu"
              onChange={handleChange}
              defaultValue={() => {
                if (saveBodySize) {
                  // const matchingBodySizes = [];
                  // for (const bodysize in dataBodySize) {
                  //   let check = saveBodySize[0].includes(
                  //     dataBodySize.at(bodysize).id
                  //   );
                  //   if (check) {
                  //     matchingBodySizes.push(dataBodySize.at(bodysize).id);
                  //   }
                  // }
                  // return matchingBodySizes;
                  return saveBodySize[0];
                }
              }}
              style={{
                width: "80%",
              }}
              options={
                Array.isArray(dataBodySize)
                  ? dataBodySize.map((item) => ({
                      value: item.id,
                      label: item.name,
                    }))
                  : []
              }
            />
          </Space>
        </>
      ),
    },
    {
      title: "Quy trình",
      content: (
        <>
          <Row justify="center" style={{ marginTop: 10 }}>
            <Col span={24}>
              <Form
                labelCol={{
                  span: 6,
                }}
                wrapperCol={{
                  span: 18,
                }}
                form={form}
                name="dynamic_form_complex"
                style={{
                  maxWidth: "100%",
                }}
                autoComplete="off"
                initialValues={{
                  items: [{}],
                }}
              >
                <Form.List name="items">
                  {(fields, { add, remove }) => (
                    <>
                      <Table
                        scroll={{ y: 330, x: 1200 }}
                        dataSource={fields}
                        pagination={false}
                        rowKey="key"
                        columns={[
                          {
                            title: `Bước thực hiện`,
                            width: "15%",
                            render: (_, record, index) => (
                              <Text>{`Bước ${index + 1}`}</Text>
                            ),
                          },
                          {
                            title: "Quy trình",
                            dataIndex: ["name"],
                            render: (_, record, index) => (
                              <Form.Item
                                name={[record.name, "name"]}
                                noStyle
                                rules={[
                                  {
                                    required: true,
                                    message: "Quy trình không được bỏ trống",
                                  },
                                ]}
                              >
                                <Input />
                              </Form.Item>
                            ),
                          },
                          {
                            title: "Bộ phận thực hiện",
                            dataIndex: ["componentTypeIds"],
                            width: "50%",
                            render: (_, record, index) => (
                              <Form.Item
                                name={[record.name, "componentTypeIds"]}
                                noStyle
                                rules={[
                                  {
                                    validator(_, value) {
                                      if (value && value.length > 0) {
                                        return Promise.resolve();
                                      }
                                      return Promise.reject(
                                        new Error(
                                          "Please select at least one item."
                                        )
                                      );
                                    },
                                  },
                                ]}
                              >
                                <Select
                                  mode="multiple"
                                  size={"default"}
                                  placeholder="Select items"
                                  style={{ width: "100%" }}
                                  labelInValue
                                >
                                  {itemCategoryStep4.map((item) => {
                                    return (
                                      <>
                                        <Option value={item.id} key={item.id}>
                                          {item.name}
                                        </Option>
                                      </>
                                    );
                                  })}
                                </Select>
                              </Form.Item>
                            ),
                          },
                          {
                            title: "Actions",
                            dataIndex: "actions",
                            render: (_, record, index) => (
                              <Button
                                type="link"
                                onClick={() => {
                                  remove(index);
                                }}
                              >
                                Remove
                              </Button>
                            ),
                          },
                        ]}
                      />
                      <Form.Item
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          style={{ width: 200, marginTop: 10 }}
                        >
                          + Add Item
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Form>
            </Col>
          </Row>
        </>
      ),
    },
  ];
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const handleNext = async () => {
    try {
      const valid = await form.validateFields([
        "Name",
        "CategoryId",
        "Price",
        "Description",
        "ImageFiles",
        "CollectionImageFiles",
        "ThumbnailImageFile",
      ]);
      if (valid) {
        const check = await onFinishStep1();
        if (check === 1) {
          await handleGetComponentType();
        }
      }
    } catch (error) {
      message.error("Vui lòng điền đầy đủ thông tin trước khi chuyển bước.");
    }
  };

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
        <ManagementProductTemplateHeader />
      </div>
      <div
        className="manager-content"
        style={{
          height: "83vh",
          overflowY: "scroll",
          border: "1px solid #9F78FF",
        }}
      >
        <Divider orientation="center" style={{ marginTop: 0 }}>
          <Title level={3}>Tạo mới bản mẫu</Title>
        </Divider>
        <div>
          <div>
            <Steps current={current} items={items} />

            <div>{steps[current].content}</div>
            <div
              style={{
                marginTop: 24,
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <div>
                <Link to="/manager/product-template">
                  <Button icon={<RollbackOutlined />}>Thoát</Button>
                </Link>
              </div>
              <div>
                {current < steps.length - 1 && (
                  <Button
                    type="primary"
                    onClick={() => {
                      if (current === 0) {
                        handleNext();
                      } else {
                        next();
                      }
                    }}
                    loading={
                      current === 0
                        ? loadingStep1
                        : current === 2
                        ? loadingStep3
                        : false
                    }
                  >
                    Tiếp theo
                  </Button>
                )}
                {current === steps.length - 1 && (
                  <Button
                    type="primary"
                    onClick={() => handleCompletedTemplate()}
                    loading={loadingStep4}
                  >
                    Hoàn Thành
                  </Button>
                )}
                {current > 0 && (
                  <Button
                    style={{
                      margin: "0 8px",
                    }}
                    onClick={() => prev()}
                    loading={
                      current === 2
                        ? loadingStep3
                        : current === 3
                        ? loadingStep4
                        : false
                    }
                  >
                    Quay lại
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CollectionCreateFormStep2 = ({
  open,
  onCreate,
  onCancel,
  componentTypeId,
  componentTypeCreateData,
}) => {
  const [form] = Form.useForm();
  const manager = JSON.parse(localStorage.getItem("manager"));
  const loading = false;
  const [compomentUrl, setComponentUrl] = useState(null);
  const [postComponentUrl, setPostComponentUrl] = useState(null);
  const [loadingCreate, setLoadingCreate] = useState(false);

  const getFileComponent = (e) => {
    console.log(e);
    const file = e.fileList[0];
    if (file && file.originFileObj) {
      setPostComponentUrl(file.originFileObj);
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);
      reader.onload = () => {
        setComponentUrl(reader.result);
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
        Upload
      </div>
    </button>
  );
  return (
    <Modal
      width={300}
      open={open}
      title={`Thêm kiểu cho ${componentTypeCreateData?.name}`}
      okText="Tạo mới"
      cancelText="Hủy bỏ"
      onCancel={() => {
        onCancel();
        form.resetFields();
        setComponentUrl(null);
      }}
      onOk={() => {
        form
          .validateFields()
          .then(async (values) => {
            setLoadingCreate(true);
            const backendData = {
              componentTypeId: componentTypeCreateData.id,
              name: values.Name,
              image: postComponentUrl,
              default: values.Default,
            };
            const checkResult = await onCreate(backendData);
            if (checkResult === 1) {
              form.resetFields();
              setComponentUrl(null);
              onCancel();
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
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: "public",
          Default: false,
        }}
      >
        <Form.Item
          name="Name"
          label="Tên kiểu"
          rules={[
            {
              required: true,
              message: "Please input the title of collection!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Thêm hình ảnh"
          valuePropName="fileList"
          getValueFromEvent={getFileComponent}
          name="ImageFile"
          rules={[
            {
              required: true,
              message: "Thumbnail không được để trống",
            },
          ]}
        >
          <Upload
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
            listType="picture-card"
            maxCount={1}
            showUploadList={false}
          >
            {compomentUrl ? (
              <img
                src={compomentUrl}
                alt="component"
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
        <Form.Item name="Default" valuePropName="checked">
          <Checkbox>Mặc định</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const ManagementProductTemplateContent = () => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [loading, setLoading] = useState(false);
  const [getProductTemplate, setGetProductTemplate] = useState([]);
  const getUrl =
    "https://e-tailorapi.azurewebsites.net/api/template-management/templates";

  const handleGetProductTemplate = async () => {
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
        setGetProductTemplate(responseData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };
  const handleDeleteProductTemplate = async (id) => {
    Swal.fire({
      title: "Bạn có muốn xóa bản mẫu này?",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy bỏ",
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const deleteUrl = `https://e-tailorapi.azurewebsites.net/api/template-management/delete-template/${id}`;
        try {
          const response = await fetch(deleteUrl, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${manager?.token}`,
            },
          });
          if (response.ok && response.status === 200) {
            const responseData = await response.text();
            await Swal.fire({
              icon: "success",
              text: "Xóa bản mẫu thành công!",
              timer: 1500,
            });
            handleGetProductTemplate();
          }
        } catch (error) {
          console.error("Error calling API:", error);
        }
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };
  useEffect(() => {
    handleGetProductTemplate();
  }, []);

  return (
    <div>
      <div>
        <div>
          <Flex wrap="wrap" gap="small">
            <Button icon={<PushpinOutlined />}>
              Tổng cộng ({getProductTemplate?.length})
            </Button>
            <Link to="/manager/create/product-template">
              <Button icon={<PlusCircleOutlined />}>Thêm mới</Button>
            </Link>
          </Flex>
        </div>
        <div>
          <Divider plain icon={<PushpinOutlined />}>
            <Title level={4}>Bản mẫu sản phẩm hiện có</Title>
          </Divider>
          <div>
            <br />
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "450px",
                }}
              >
                <CircularProgress />
              </div>
            ) : (
              <Row gutter={[16, 24]}>
                {getProductTemplate.map((productTemplate) => {
                  return (
                    <Col
                      className="gutter-row"
                      span={6}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Card
                        bordered
                        style={{
                          width: 200,
                        }}
                        cover={
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 10,
                            }}
                          >
                            <Image
                              width={190}
                              src={productTemplate.thumbnailImage}
                              style={{
                                height: 200,
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        }
                        actions={[
                          <Link
                            to={`/manager/update/product-template/${productTemplate.id}`}
                          >
                            <EditOutlined key="edit" />
                          </Link>,
                          <Link
                            to={`/manager/product-template/${productTemplate.id}`}
                          >
                            <FileTextOutlined />
                          </Link>,
                          <DeleteOutlined
                            key="delete"
                            onClick={() =>
                              handleDeleteProductTemplate(productTemplate.id)
                            }
                          />,
                        ]}
                      >
                        <Meta title={productTemplate.name} />
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function ManagementProductTemplate() {
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
        <ManagementProductTemplateHeader />
      </div>
      <div
        className="manager-content"
        style={{
          height: "83vh",
          overflowY: "scroll",
          border: "1px solid #9F78FF",
        }}
      >
        <div>
          <ManagementProductTemplateContent />
        </div>
      </div>
    </div>
  );
}

export default ManagementProductTemplate;
