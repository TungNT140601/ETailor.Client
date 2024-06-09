import { useParams } from "react-router-dom";
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
  DownloadOutlined,
  VerticalAlignTopOutlined,
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
import toast, { Toaster } from "react-hot-toast";
import ManagerHeader from "../../../components/ManagerHeader";

const { Search, TextArea } = Input;
const { Title, Text } = Typography;
const { Meta } = Card;
const { Option } = Select;

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
              whitespace: true,
              message: "Tên kiểu không được để trống",
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
              message: "Ảnh kiểu không được để trống!",
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

const ManagementUpdateProductTemplateContent = () => {
  const { id } = useParams();
  const manager = JSON.parse(localStorage.getItem("manager"));
  const loading = false;
  const [form] = Form.useForm();
  const [formUpdateStep1] = Form.useForm();
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [dataDetailForUpdate, setDataDetailForUpdate] = useState(null);
  //-----------------------------------------------Hinh anh buoc 1
  const [imageUrl, setImageUrl] = useState(null);
  const [postImageUrl, setPostImageUrl] = useState(null);
  const [uploadKey, setUploadKey] = useState(0);
  const [oldImages, setOldImages] = useState(null);

  //-----------------------------------------------thumbnail buoc 1
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [postThumbnailUrl, setPostThumbUrl] = useState(null);

  //-----------------------------------------------Collection buoc 1
  const [collectionUrl, setCollectionUrl] = useState(null);
  const [uploadKeyCollection, setUploadKeyCollection] = useState(0);
  const [postUploadKeyCollection, setPostUploadKeyCollection] = useState(null);
  const [oldImagesCollection, setOldImagesCollection] = useState(null);

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
          (files) =>
            !prevResults.includes(files) && oldImagesCollection.includes(files)
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
          (newResult) =>
            !prevResults.includes(newResult) &&
            oldImagesCollection.includes(files)
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
          title: "Vui lòng điền ít nhất 1 kiểu cho mỗi bộ phận",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } else if (current === 2) {
      if (saveBodySize[0].length >= 1) {
        setLoadingStep3(true);
        const getUrl = `https://e-tailorapi.azurewebsites.net/api/template-body-size/template/${id}`;
        try {
          const response = await fetch(getUrl, {
            method: "PUT",
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
    setOldImages(null);
  };
  const handleClearAllImages = async () => {
    clearAllImages();
  };
  //-------------------------------------------------------------step 1----------------------------------------------
  const [getCategory, setCategory] = useState([]);
  const [loadingStep1, setLoadingStep1] = useState(false);
  const [step3, setStep3] = useState([]);
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
  const [categoryDetailData, setCategoryDetailData] = useState({});
  const handleGetDetailCategory = async () => {
    const getDetailUrl = `https://e-tailorapi.azurewebsites.net/api/category-management/${dataDetailForUpdate.category.id}`;
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
  const handleGetDataCategoryStep3 = async () => {
    const getDetailUrl = `https://e-tailorapi.azurewebsites.net/api/template-body-size/template/${id}/manager`;
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
        console.log("responseData", responseData);
        setStep3(responseData.map((item) => item.id));
        setSaveBodySize([responseData.map((item) => item.id)]);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };
  const handleGetDataCategoryStep4 = async () => {
    const getDetailUrl = `https://e-tailorapi.azurewebsites.net/api/template-stage/template/${id}`;
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
        console.log(
          "responseDataresponseDataresponseDataresponseData: ",
          responseData
        );
        const transformedData = responseData.map((stage) => ({
          name: stage.name,
          componentTypeIds: stage.componentStages.map((component) => ({
            value: component.componentTypeId,
            label: component.componentType.name,
          })),
        }));
        console.log("transformedData", transformedData);
        form.setFieldsValue({ items: transformedData });
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  useEffect(() => {
    if (dataDetailForUpdate) {
      handleGetDetailCategory();
      handleGetDataCategoryStep3();
    }
  }, [dataDetailForUpdate]);

  useEffect(() => {
    handleGetDataCategoryStep4();
  }, [dataDetailForUpdate]);

  //--------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    handleGetCategory();
  }, []);
  const onFinishStep1 = async () => {
    const values = formUpdateStep1.getFieldsValue();
    const formData = new FormData();
    console.log("postThumbnailUrl: ", postThumbnailUrl);
    formData.append("Id", id);
    formData.append("CategoryId", values.CategoryId);
    formData.append("Name", values.Name);
    formData.append("Description", values.Description);
    formData.append("Price", values.Price);
    formData.append("AveDateForComplete", values.deadline);
    formData.append("ThumbnailImageFile", postThumbnailUrl);
    formData.append("Gender", values.gender);
    if (postImageUrl?.length >= 1) {
      postImageUrl.map((item) => formData.append("ImageFiles", item));
    }
    if (postUploadKeyCollection?.length >= 1) {
      postUploadKeyCollection.map((item) =>
        formData.append("CollectionImageFiles", item)
      );
    }
    oldImages &&
      oldImages.forEach((image) => {
        formData.append("OldImages", image);
      });

    oldImagesCollection &&
      oldImagesCollection.forEach((imageCollection) => {
        formData.append("OldCollectionImages", imageCollection);
      });

    for (var pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    setLoadingStep1(true);
    const urlCreate = `https://e-tailorapi.azurewebsites.net/api/template-management/update-template/${id}`;
    try {
      const response = await fetch(urlCreate, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${manager?.token}`,
        },
        body: formData,
      });
      if (response.ok && response.status === 200) {
        const responseData = await response.text();
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Cập nhật thông tin sản phẩm thành công!",
          showConfirmButton: false,
          timer: 1500,
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
          timer: 3500,
        });
        return 0;
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

    const urlCreateMaterialType = `https://e-tailorapi.azurewebsites.net/api/Component/template/${id}/${values.componentTypeId}`;
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
        handleGetComponentType();
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

  const handleGetComponentType = async () => {
    const getDetailUrl = `https://e-tailorapi.azurewebsites.net/api/template/${id}/component-types`;
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
    if (id !== null && id !== undefined) {
      handleGetComponentType();
    }
  }, []);

  const handleDeleteComponent = async (
    templateId,
    componentTypeId,
    componentId,
    name
  ) => {
    Swal.fire({
      title: `Xác nhận xóa kiểu ${name} ?`,
      showCancelButton: true,
      confirmButtonText: "Xóa",
      denyButtonText: `Không xóa`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const getDetailUrl = `https://e-tailorapi.azurewebsites.net/api/Component/template/${templateId}/${componentTypeId}/${componentId}`;
        try {
          const response = await fetch(getDetailUrl, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${manager?.token}`,
            },
          });
          const responseData = await response.text();
          if (response.ok && response.status === 200) {
            Swal.fire({
              position: "top-center",
              icon: "success",
              title: responseData,
              showConfirmButton: false,
              timer: 1500,
            });
            await handleGetComponentType();
          } else if (response.status === 400 || response.status === 500) {
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
      } else if (result.dismiss) {
        Swal.fire("Hủy xóa", "", "info");
      }
    });
  };

  //--------------------------------------------------------------step 3---------------------------------------------
  const [saveBodySize, setSaveBodySize] = useState([]);
  const [loadingStep3, setLoadingStep3] = useState(false);

  const handleChange = (value) => {
    console.log(value);
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
  console.log("itemCategoryStep4", itemCategoryStep4);
  const navigate = useNavigate();

  const handleGetComponentTypesCategory = async () => {
    const getlUrl = `https://e-tailorapi.azurewebsites.net/api/category/${dataDetailForUpdate?.category?.id}/component-types`;
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
    const step4Check = form.getFieldValue();
    console.log("step4Check", step4Check);
    const beData = step4Check?.items?.map((stage) => ({
      id: id,
      name: stage.name,
      componentTypeIds: stage?.componentTypeIds
        ? stage?.componentTypeIds?.map((item) => item.value)
        : null,
    }));
    console.log("beData", beData);
    setLoadingStep4(true);
    const postlUrl = `https://e-tailorapi.azurewebsites.net/api/template-stage/template/${id}`;
    try {
      const response = await fetch(postlUrl, {
        method: "PUT",
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
    if (dataDetailForUpdate) {
      handleGetComponentTypesCategory();
    }
  }, [dataDetailForUpdate]);

  //--------------------------------------------------------------Cập nhật bản mẫu-----------------------------------------------------------

  useEffect(() => {
    const handleGetDetail = async () => {
      const urlProductDetail = `https://e-tailorapi.azurewebsites.net/api/template-management/detail/${id}`;
      setLoadingUpdate(true);
      try {
        const response = await fetch(`${urlProductDetail}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${manager?.token}`,
          },
        });
        if (response.ok && response.status === 200) {
          const responseData = await response.json();
          setLoadingUpdate(false);
          console.log("response: ", responseData);
          setDataDetailForUpdate(responseData);
        }
      } catch (error) {
        console.error("Error calling API:", error);
      }
    };
    handleGetDetail();
  }, []);

  useEffect(() => {
    formUpdateStep1.setFieldsValue({
      Name: dataDetailForUpdate?.name,
      CategoryId: dataDetailForUpdate?.category?.id,
      Price: dataDetailForUpdate?.price,
      Description: dataDetailForUpdate?.description,
      deadline: dataDetailForUpdate?.aveDateForComplete,
      gender: dataDetailForUpdate?.gender?.toString(),
      ThumbnailImageFile: dataDetailForUpdate?.thumbnailImage
        ? [
            {
              uid: "-1",
              name: "thumbnail.png",
              status: "done",
              url: dataDetailForUpdate.thumbnailImage,
            },
          ]
        : [],
    });
    if (dataDetailForUpdate?.thumbnailImage) {
      setThumbnailUrl(dataDetailForUpdate.thumbnailImage);
      setPostThumbUrl(dataDetailForUpdate?.thumbnailImage);
    }
    if (dataDetailForUpdate?.image) {
      try {
        const convertJSON = JSON.parse(dataDetailForUpdate.image);
        if (Array.isArray(convertJSON)) {
          setOldImages(convertJSON);
        } else {
          console.error("Parsed image data is not an array.");
        }
      } catch (error) {
        console.error("Error parsing image data:", error);
      }
    } else if (dataDetailForUpdate?.collectionImage) {
      try {
        const convertJSON = JSON.parse(dataDetailForUpdate.collectionImage);
        if (Array.isArray(convertJSON)) {
          setOldImagesCollection(convertJSON);
        } else {
          console.error("Parsed image data is not an array.");
        }
      } catch (error) {
        console.error("Error parsing image data:", error);
      }
    }
  }, [dataDetailForUpdate]);

  const [exportFileLoading, setExportFileLoading] = useState(false);
  const handleDownloadExportFile = async () => {
    if (id) {
      const getlUrl = `https://e-tailorapi.azurewebsites.net/api/Component/export/template/${id}`;
      setExportFileLoading(true);
      const response = await fetch(getlUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      })
        .then((response) => response.blob()) // Convert the response to a blob
        .then((blob) => {
          // Create a URL for the blob
          const fileUrl = window.URL.createObjectURL(blob);
          // Create a temporary anchor element and trigger a download
          const a = document.createElement("a");
          a.href = fileUrl;
          a.download = "Output.xlsx"; // Suggest a filename
          document.body.appendChild(a); // Required for this to work in FireFox
          a.click(); // Trigger the download
          a.remove(); // Clean up
          setExportFileLoading(false);
        })
        .catch((error) => {
          console.error("Error downloading the file:", error);
        });
    }
  };
  const [importFileLoading, setImportFileLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const handleDeleteFile = () => {
    setSelectedFile(null);
    fileInputRef.current.value = null;
  };
  const handleImportFile = async (event) => {
    try {
      setImportFileLoading(true);
      const file = event.target.files[0];
      if (!file) {
        throw new Error("Vui lòng chọn một file để nhập.");
      }
      console.log("file", file);
      setSelectedFile(file);
      await uploadFile(file);
    } catch (error) {
      console.error("Error:", error);
      message.error(error.message);
    } finally {
      setImportFileLoading(false);
    }
  };
  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `https://e-tailorapi.azurewebsites.net/api/Component/import/template/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${manager?.token}`,
          },
          body: formData,
        }
      );

      if (response.status === 200 && response.ok) {
        const responseData = await response.text();
        console.log("Upload successful:", responseData);
        handleGetComponentType();
      } else if (response.status === 400 || response.status === 500) {
        const responseData = await response.text();
        message.error(responseData);
      }
    } catch (error) {
      console.error("Error:", error);
      message.error(error.message);
    }
  };

  const steps = [
    {
      title: "Khởi tạo bản mẫu",
      content: loadingUpdate ? (
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
        <Row justify="center" style={{ marginTop: 24 }}>
          <Col span={24}>
            <Form
              form={formUpdateStep1}
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
                gender: "-1",
              }}
              autoComplete="off"
            >
              {formUpdateStep1.getFieldError("name").map((error) => (
                <Alert message={error} type="error" />
              ))}
              <Form.Item
                label="Tên bản mẫu"
                hasFeedback
                name="Name"
                rules={[
                  {
                    required: true,
                    whitespace: true,
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
                <Select disabled={id}>
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
                name="gender"
                label="Phù hợp"
                rules={[
                  {
                    required: true,
                    message: "Phù hợp của 1 bản mẫu không được để trống",
                  },
                ]}
              >
                <Select placeholder="Bản mẫu này phù hợp với">
                  <Option value="-1">Nam và Nữ</Option>
                  <Option value="0">Nam</Option>
                  <Option value="1">Nữ</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="deadline"
                label="Ngày dự kiến hoàn thành"
                rules={[
                  {
                    required: true,
                    message:
                      "Ngày dự kiến hoàn thành của bản mẫu không được để trống",
                  },
                  {
                    type: "number",
                    min: 1,
                    message: "Ngày dự kiến hoàn thành phải lớn hơn hoặc bằng 1",
                  },
                ]}
              >
                <InputNumber style={{ width: "100%" }} />
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
                  parser={(value) => value.replace(/\đ\s?|(,*)/g, "")}
                />
              </Form.Item>
              <Form.Item
                label="Mô tả"
                name="Description"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Nhập mô tả cho bản mẫu",
                  },
                ]}
              >
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item
                label="Hình ảnh đại diện"
                valuePropName="fileList"
                getValueFromEvent={getFileThumbnail}
                name="ThumbnailImageFile"
                rules={[
                  {
                    required: true,
                    message: "Hình ảnh đại diện không được để trống",
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
                  {(imageUrl || oldImages) && (
                    <Button
                      icon={<UploadOutlined />}
                      onClick={handleClearAllImages}
                    >
                      Clear tất cả
                    </Button>
                  )}
                </div>
                <Row gutter={[16, 24]}>
                  {oldImages &&
                    oldImages.map((url, index) => (
                      <Col
                        className="gutter-row"
                        span={6}
                        key={`old_image_${index}`}
                      >
                        <div style={{ position: "relative" }}>
                          <img
                            src={url}
                            alt={`Old image ${index}`}
                            style={{
                              width: 129,
                              height: 129,
                              borderRadius: 10,
                              border: "1px solid #9F78FF",
                              marginTop: 10,
                            }}
                          />
                          <CloseCircleOutlined
                            onClick={() =>
                              setOldImages(
                                oldImages.filter((_, idx) => idx !== index)
                              )
                            }
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "10px",
                              cursor: "pointer",
                            }}
                          />
                        </div>
                      </Col>
                    ))}
                  {imageUrl &&
                    imageUrl.map((url, index) => {
                      return (
                        <Col
                          className="gutter-row"
                          span={6}
                          key={`image_${index}`}
                          style={{ position: "relative", marginTop: 15 }}
                        >
                          <img
                            src={url}
                            alt={`image_${index}`}
                            style={{
                              width: 129,
                              height: 129,
                              borderRadius: 10,
                              border: "1px solid #9F78FF",
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
                              console.log("newImageUrlArray", newImageUrlArray);
                              setImageUrl(newImageUrlArray);
                              const newPostImageArray = postImageUrl.filter(
                                (_, idx) => idx !== index
                              );
                              setPostImageUrl(newPostImageArray);
                            }}
                          />
                        </Col>
                      );
                    })}
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
                  {(collectionUrl || oldImagesCollection) && (
                    <Button
                      icon={<UploadOutlined />}
                      onClick={handleClearAllImagesCollection}
                    >
                      Clear tất cả
                    </Button>
                  )}
                </div>
                <Row gutter={[16, 24]}>
                  {oldImagesCollection &&
                    oldImagesCollection.map((url, index) => (
                      <Col
                        className="gutter-row"
                        span={6}
                        key={`old_image_${index}`}
                      >
                        <div style={{ position: "relative" }}>
                          <img
                            src={url}
                            alt={`Old image ${index}`}
                            style={{
                              width: 129,
                              height: 129,
                              borderRadius: 10,
                              border: "1px solid #9F78FF",
                              marginTop: 10,
                            }}
                          />
                          <CloseCircleOutlined
                            onClick={() =>
                              setOldImagesCollection(
                                oldImagesCollection.filter(
                                  (_, idx) => idx !== index
                                )
                              )
                            }
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "10px",
                              cursor: "pointer",
                            }}
                          />
                        </div>
                      </Col>
                    ))}
                  {collectionUrl &&
                    collectionUrl?.map((url, index) => (
                      <Col
                        className="gutter-row"
                        span={6}
                        key={`image_collection_${index}`}
                        style={{ position: "relative", marginTop: 15 }}
                      >
                        <img
                          src={url}
                          alt={`image_collection_${index}`}
                          style={{
                            width: 129,
                            height: 129,
                            borderRadius: 10,
                            border: "1px solid #9F78FF",
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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 15,
            }}
          >
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              style={{ marginLeft: "20px" }}
              onClick={() => handleDownloadExportFile()}
              loading={exportFileLoading}
            >
              Xuất file mẫu
            </Button>
            <Button
              type="primary"
              icon={<VerticalAlignTopOutlined />}
              style={{ marginLeft: "20px" }}
              onClick={() => fileInputRef.current.click()}
              loading={importFileLoading}
            >
              Nhập file mẫu
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImportFile}
              accept=".xlsx,.xls"
            />
          </div>
          <div>
            {selectedFile && (
              <div style={{ marginTop: 10, textAlign: "center" }}>
                <strong>{selectedFile.name}</strong> ({selectedFile.size} bytes)
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  onClick={handleDeleteFile}
                  style={{ marginLeft: 10 }}
                  disabled={importFileLoading}
                >
                  Xóa
                </Button>
              </div>
            )}
          </div>
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
                  <div>
                    <Row
                      justify="start"
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
                                    offset={2}
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
                                            handleDeleteComponent(
                                              id,
                                              data.id,
                                              component.id,
                                              component?.name
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
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                paddingLeft: 125,
                              }}
                            >
                              <Title level={4} onClick={() => handleOpen(data)}>
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
            saveProductTemplateId={id}
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
              showSearch
              mode="multiple"
              placeholder="Chọn số đo phù hợp cho bản mẫu"
              onChange={handleChange}
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
              defaultValue={() => {
                if (saveBodySize) {
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
              id="product_template_step_3"
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
                                    whitespace: true,
                                    message: "Quy trình không được bỏ trống!",
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
                                      return Promise.reject(new Error(""));
                                    },
                                  },
                                ]}
                              >
                                <Select
                                  mode="multiple"
                                  size={"default"}
                                  placeholder="Bộ phận thực hiện"
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
                            title: "Tùy chỉnh",
                            dataIndex: "actions",
                            render: (_, record, index) => (
                              <Button
                                type="link"
                                onClick={() => {
                                  remove(index);
                                }}
                              >
                                Xóa quy trình
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
                          Thêm quy trình
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
    const check = await onFinishStep1();
    if (check === 1) {
      await handleGetComponentType();
    }
  };

  return (
    <div>
      <Divider orientation="center" style={{ marginTop: 0 }}>
        <Title level={3}>Cập nhật bản mẫu</Title>
      </Divider>
      <div>
        <div>
          <Steps current={current} items={items} />
          <div>{steps[current].content}</div>
          <div
            style={{
              marginTop: current === 3 ? 0 : 24,
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
                  Cập nhật
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
  );
};

function ManagementUpdateProductTemplate() {
  const { id } = useParams();
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
          name={"Bản mẫu"}
          link={"/manager/product-template"}
          iconHome={<HomeOutlined />}
          iconRoute={<CheckroomIcon fontSize="small" />}
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
        <div>
          <ManagementUpdateProductTemplateContent />
        </div>
      </div>
    </div>
  );
}

export default ManagementUpdateProductTemplate;
