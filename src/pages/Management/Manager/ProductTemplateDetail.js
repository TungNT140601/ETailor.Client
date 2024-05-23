import { useParams } from "react-router-dom";
import chooseTemplate from "../../../assets/dress.png";
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
} from "@ant-design/icons";
import { Typography, Carousel } from "antd";
import "./index.css";
import CircularProgress from "@mui/material/CircularProgress";
import StarIcon from "@mui/icons-material/Star";

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
  Tag,
  Badge,
  Popover,
} from "antd";

import CheckroomIcon from "@mui/icons-material/Checkroom";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ManagerHeader from "../../../components/ManagerHeader";

const { Search, TextArea } = Input;
const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;
const { Option } = Select;
function formatCurrency(amount) {
  if (amount) {
    const strAmount = amount.toString();
    const parts = [];
    for (let i = strAmount.length - 1, j = 0; i >= 0; i--, j++) {
      if (j > 0 && j % 3 === 0) {
        parts.unshift(".");
      }
      parts.unshift(strAmount[i]);
    }
    return parts.join("") + "đ";
  }
  return null;
}
const ManagementProductDetailTemplateHeader = () => {
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
                    <span>Quản lý bản mẫu</span>
                  </div>
                </>
              ),
            },
            {
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
                    <span>Chi tiết bản mẫu</span>
                  </div>
                </>
              ),
            },
          ]}
        />
        <Title level={4}>Chi tiết bản mẫu</Title>
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

const ManagementProductDetailContent = () => {
  const { id } = useParams();
  const manager = JSON.parse(localStorage.getItem("manager"));
  const [dataDetail, setDataDetail] = useState(null);
  const [componentType, setComponentType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [templateStage, setTemplateStage] = useState(null);
  const navigate = useNavigate();
  console.log("templateStage", templateStage);
  console.log("dataDetail", dataDetail);
  useEffect(() => {
    const handleGetDetail = async () => {
      const urlProductDetail = `https://e-tailorapi.azurewebsites.net/api/template-management/detail/${id}`;
      // const urlProductDetail = `https://localhost:7259/api/template-management/detail/${id}`;
      setLoading(true);
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
          setLoading(false);
          console.log("response: ", responseData);
          setDataDetail(responseData);
        }
      } catch (error) {
        console.error("Error calling API:", error);
      }
    };
    const handleGetTemplateStage = async () => {
      const urlProductDetail = `https://e-tailorapi.azurewebsites.net/api/template-stage/template/${id}`;
      setLoading(true);
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
          setLoading(false);
          setTemplateStage(responseData);
        }
      } catch (error) {
        console.error("Error calling API:", error);
      }
    };
    handleGetTemplateStage();
    handleGetDetail();
  }, []);
  useEffect(() => {
    const handleGetDetail = async () => {
      const url = `https://e-tailorapi.azurewebsites.net/api/template/${id}/component-types`;
      try {
        const response = await fetch(`${url}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${manager?.token}`,
          },
        });
        if (response.ok && response.status === 200) {
          const responseData = await response.json();
          setComponentType(responseData);
        }
      } catch (error) {
        console.error("Error calling API:", error);
      }
    };
    handleGetDetail();
  }, [dataDetail]);
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
            navigate("/manager/product-template");
          }
        } catch (error) {
          console.error("Error calling API:", error);
        }
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };
  return (
    <>
      <div>
        <Divider style={{ marginTop: 0 }}>
          <Title level={4}>Chi tiết bản mẫu</Title>
        </Divider>
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
          <>
            <Row>
              <Col span={12} push={1}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <img
                    alt="product-template-detail"
                    style={{
                      width: 400,
                      height: 400,
                      objectFit: "cover",
                      border: "1px solid #9F78FF",
                    }}
                    src={dataDetail?.thumbnailImage}
                  />
                </div>
              </Col>
              <Col span={12}>
                <Title level={2}>{dataDetail?.name}</Title>
                <div>
                  <Text style={{ fontSize: 18 }}>
                    Giá: {formatCurrency(dataDetail?.price)}
                  </Text>
                </div>
                <div style={{ marginTop: 10 }}>
                  <Text style={{ fontSize: 18 }}>
                    Loại đồ:{" "}
                    <Tag color="purple" style={{ fontSize: 18 }}>
                      {dataDetail?.category?.name}
                    </Tag>
                  </Text>
                </div>
                <div style={{ marginTop: 10 }}>
                  <Text style={{ fontSize: 18 }}>
                    Dành cho:{" "}
                    {dataDetail?.gender &&
                      (() => {
                        switch (dataDetail.gender) {
                          case 0:
                            return "Nam giới";
                          case 1:
                            return "Nữ giới";
                          default:
                            return "Nam và Nữ";
                        }
                      })()}
                  </Text>
                </div>
                <div style={{ marginTop: 10 }}>
                  <Text style={{ fontSize: 18 }}>
                    Thời gian may: {dataDetail?.aveDateForComplete} ngày
                  </Text>
                </div>
                <div
                  style={{
                    marginTop: 10,
                    height: "200px",
                    overflowY: "scroll",
                    scrollbarWidth: "none",
                    WebkitScrollbar: "none",
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ fontSize: 18 }}>
                    Mô tả: {dataDetail?.description}
                  </Text>
                </div>
                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    icon={<CloseCircleOutlined />}
                    style={{ marginRight: 10 }}
                    onClick={() => handleDeleteProductTemplate(id)}
                  >
                    Xóa bản mẫu
                  </Button>
                  <Link to={`/manager/update/product-template/${id}`}>
                    <Button icon={<EditOutlined />}>Chỉnh sửa</Button>
                  </Link>
                </div>
              </Col>
            </Row>
            <Title level={3} style={{ marginTop: 20 }}>
              1/ Các kiểu cho bản mẫu:{" "}
            </Title>
            <div
              style={{
                marginTop: 10,
                borderRadius: 10,
                paddingLeft: 20,
              }}
            >
              {componentType &&
                componentType?.map((component) => {
                  return (
                    <>
                      <Title level={4}>{component?.name}:</Title>
                      <Row gutter={[16, 24]}>
                        {component?.components?.map((item) => {
                          return (
                            <>
                              <Col className="gutter-row" span={2}>
                                <div
                                  style={{
                                    marginLeft: 10,
                                    marginRight: 10,
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Image
                                      width={200}
                                      src={item?.image}
                                      style={{
                                        borderRadius: "50%",
                                        height: 60,
                                        objectFit: "cover",
                                        textAlign: "center",
                                      }}
                                    />
                                  </div>

                                  <div style={{ textAlign: "center" }}>
                                    {item.default ? (
                                      <Popover title="Kiểu mặc định">
                                        <Text
                                          style={{
                                            color: item.default
                                              ? "#9F78FF"
                                              : "",
                                            fontSize: item.default
                                              ? "bold"
                                              : "",
                                          }}
                                        >
                                          {item?.name}
                                        </Text>
                                      </Popover>
                                    ) : (
                                      <Text>{item?.name}</Text>
                                    )}
                                  </div>
                                </div>
                              </Col>
                            </>
                          );
                        })}
                      </Row>
                    </>
                  );
                })}
            </div>
            <Title level={3} style={{ marginTop: 20 }}>
              2/ Hình ảnh bản mẫu:{" "}
            </Title>
            <div>
              <Space size={[8, 16]} wrap>
                {dataDetail?.image &&
                  JSON.parse(dataDetail?.image)?.map((img) => (
                    <Image
                      width={150}
                      src={img}
                      style={{ height: 150, border: "1px solid #9F78FF" }}
                    />
                  ))}
              </Space>
            </div>
            <Title level={3} style={{ marginTop: 20 }}>
              3/ Bộ sưu tập:{" "}
            </Title>
            <div>
              <Space size={[16, 16]} wrap>
                {dataDetail?.collectionImage ? (
                  JSON.parse(dataDetail?.collectionImage)?.map((img) => (
                    <Image
                      width={150}
                      src={img}
                      style={{ height: 150, border: "1px solid #9F78FF" }}
                    />
                  ))
                ) : (
                  <div
                    style={{
                      width: "1300px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <img
                          style={{ width: 150, height: 150 }}
                          src={chooseTemplate}
                        />
                      </div>
                      <Title level={4}>
                        Chưa có bộ sưu tập nào trong bản mẫu này!
                      </Title>
                    </div>
                  </div>
                )}
              </Space>
            </div>
            <Title level={3} style={{ marginTop: 20 }}>
              4/ Quy trình thực hiện
            </Title>
            <div>
              {templateStage && (
                <div>
                  {templateStage?.map((stage) => {
                    return (
                      <>
                        <Title level={4} style={{ marginLeft: 50 }}>
                          Bước {stage?.stageNum}: {stage?.name}
                        </Title>
                        <div style={{ marginLeft: 70 }}>
                          {stage?.componentStages?.length > 0 ? (
                            stage?.componentStages?.map((componenetStage) => {
                              return (
                                <Tag
                                  bordered={false}
                                  color="processing"
                                  key={componenetStage?.id}
                                  style={{ fontSize: 15 }}
                                >
                                  {componenetStage?.componentType.name}
                                </Tag>
                              );
                            })
                          ) : (
                            <Text>
                              Không có bộ phận nào cần xử lý trong bước này.
                            </Text>
                          )}
                        </div>
                      </>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

function ProductTemplateDetail() {
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
          <ManagementProductDetailContent />
        </div>
      </div>
    </div>
  );
}

export default ProductTemplateDetail;
