import React, { useState } from "react";
import { Breadcrumb } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  CloseOutlined,
  SearchOutlined,
  FileSearchOutlined,
  IdcardOutlined,
  PhoneOutlined,
  GlobalOutlined,
  CheckSquareOutlined,
  CloseSquareOutlined,
  UploadOutlined,
  PayCircleOutlined,
  ArrowDownOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import {
  Typography,
  Button,
  message,
  Steps,
  Divider,
  Flex,
  Card,
  Row,
  Col,
  InputNumber,
  Form,
  Space,
  Modal,
  Avatar,
  Input,
  List,
  Select,
  Image,
  Upload,
  Statistic,
  Table,
  Radio,
} from "antd";
import "./index.css";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";

import { Link } from "react-router-dom";
// import Swal from "sweetalert2";
import { useQuery } from "react-query";

const { Search } = Input;
const { Title, Text } = Typography;
const { Meta } = Card;

const manager = JSON.parse(localStorage.getItem("manager"));

const OrderToCustomerHeader = () => {
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
              href: "/manager",
              title: (
                <>
                  <Link to="/manager">
                    <div>
                      <HomeOutlined />
                    </div>
                  </Link>
                </>
              ),
            },
            {
              href: "/manager/order-for-customer",
              title: (
                <>
                  <Link to="/manager/order-for-customer">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "#9F78FF",
                      }}
                    >
                      <UserOutlined fontSize="small" />
                      &nbsp;
                      <span>Lên đơn hàng</span>
                    </div>
                  </Link>
                </>
              ),
            },
          ]}
        />
        <Title level={4}>Lên đơn hàng</Title>
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

const OrderToCustomerContent = () => {
  const [form] = Form.useForm();
  // const [open, setOpen] = useState(false);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectItem, setSelectItem] = useState([]);
  const [selectProductType, setSelectProductType] = useState([]);
  const [searchInfo, setSearchInfo] = useState("");

  const onFinish = (values) => {
    console.log(values);
  };

  //-------------------------------------------------------------------------------------------------

  // const dataStep2 = [
  //   {
  //     id: 1,
  //     name: "Mẫu áo 1",
  //     img: "https://bizweb.dktcdn.net/100/287/440/products/ao-thun-form-rong-nu-b93d9bfb-c74b-4bc9-95c7-177b8f620315.jpg?v=1612168347387",
  //   },
  //   {
  //     id: 2,
  //     name: "Mẫu áo dài 2",
  //     img: "https://pos.nvncdn.com/af3c03-152482/ps/20230826_lAtpEIcUbv.jpeg",
  //   },
  //   {
  //     id: 3,
  //     name: "Mẫu quần 3",
  //     img: "https://savani.vn/images/products/2023/09/15/large/wqj007k3-4-b03-2-min_1694768595.jpg",
  //   },
  //   {
  //     id: 4,
  //     name: "Mẫu quần 4",
  //     img: "https://lamia.com.vn/storage/anh-seo/quan-tay-nu-lung-cao-dep.jpg",
  //   },
  // ];
  // const dataStep2_1 = [
  //   {
  //     id: 1,
  //     name: "Mẫu áo 1",
  //     img: "https://bizweb.dktcdn.net/100/287/440/products/ao-thun-form-rong-nu-b93d9bfb-c74b-4bc9-95c7-177b8f620315.jpg?v=1612168347387",
  //   },
  //   {
  //     id: 2,
  //     name: "Mẫu áo dài 2",
  //     img: "https://pos.nvncdn.com/af3c03-152482/ps/20230826_lAtpEIcUbv.jpeg",
  //   },
  //   {
  //     id: 3,
  //     name: "Mẫu quần 3",
  //     img: "https://savani.vn/images/products/2023/09/15/large/wqj007k3-4-b03-2-min_1694768595.jpg",
  //   },
  //   {
  //     id: 4,
  //     name: "Mẫu quần 4",
  //     img: "https://lamia.com.vn/storage/anh-seo/quan-tay-nu-lung-cao-dep.jpg",
  //   },
  // ];

  const [modalState, setModalState] = useState({});
  const [modalProductTypeState, setModalProductTypeState] = useState({});

  // const showModal = (fieldName) => {
  //   setModalState({ ...modalState, [fieldName]: true });
  // };

  // const handleOk = (fieldName) => {
  //   setModalState({ ...modalState, [fieldName]: false });
  // };

  // const handleCancel = (fieldName) => {
  //   setModalState({ ...modalState, [fieldName]: false });
  // };

  // const handleSelectTemplate = (item, index) => {
  //   console.log(index);
  //   const newSelectedItems = [...selectItem];
  //   newSelectedItems[index] = item;
  //   setSelectItem(newSelectedItems);
  // };

  //---------------------------------------------------------------------------------------------------

  // const showProductTypeModal = (fieldName) => {
  //   console.log("fieldName", fieldName);
  //   setModalProductTypeState({ ...modalProductTypeState, [fieldName]: true });
  // };

  // const handleProductTypeOk = (fieldName) => {
  //   setModalProductTypeState({ ...modalProductTypeState, [fieldName]: false });
  // };

  // const handleProductTypeCancel = (fieldName) => {
  //   setModalProductTypeState({ ...modalProductTypeState, [fieldName]: false });
  // };

  // const handleSelectProductType = (item, index) => {
  //   const currentSelected = selectProductType[index];
  //   if (!currentSelected || currentSelected !== item) {
  //     const newSelectedItems = [...selectProductType];
  //     newSelectedItems[index] = item;
  //     setSelectProductType(newSelectedItems);
  //   }
  // };

  //----------------------------------------chọn vải-----------------------------------------------------------
  // const [checkMaterial, setCheckMaterial] = useState(0);

  //---------------------------------------------------------------------------------------------------

  //-----------------------------------------Thử làm cách mới--------------------------------------------------

  const [checkTemplateArray, setCheckTemplateArray] = useState([]);
  const filterOption = (input, option) =>
    (option?.title ?? "")
      .toString()
      .trim()
      .toLowerCase()
      .includes(input.toLowerCase());
  const filterOption1 = (input, option) =>
    (option?.title ?? "")
      .toString()
      .trim()
      .toLowerCase()
      .includes(input.toLowerCase());

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log("search:", value);
  };

  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const [active, setActive] = useState(0);

  const data = [
    {
      key: "1",
      index: "1",
      name: "Sản phẩm 1",

      address: "Loại vải 1",
    },
    {
      key: "2",
      index: "2",
      name: "Sản phẩm 2",

      age: 42,
      address: "Loại vải 1",
    },
    {
      key: "3",
      index: "3",
      name: "Sản phẩm 3",

      age: 32,
      address: "Loại vải 1",
    },
    {
      key: "4",
      index: "4",
      name: "Sản phẩm 4",

      age: 32,
      address: "Loại vải 1",
    },
    {
      key: "5",
      index: "5",
      name: "Sản phẩm 5",

      age: 32,
      address: "Loại vải 1",
    },
  ];
  //---------------------------------------------------------------------------------------------------------

  const [rowData, setRowData] = useState(
    data.map((item) => ({ ...item, radioValue: null }))
  );

  const onChange1 = (e, record) => {
    const { value } = e.target;
    const newData = rowData.map((item) =>
      item.key === record.key ? { ...item, radioValue: value } : item
    );
    setRowData(newData);
  };
  //-------------------------------------------------Modal thêm mới khách hàng--------------------------------------------------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const onCreate = (values) => {
    console.log("Received values of form: ", values);
    setIsModalOpen(false);
  };
  //------------------------------------------------Kiểm tra 2 field options---------------------------------------------------------
  const [checkValid, setCheckValid] = useState(0);

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 60,
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Tên bản mẫu",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Loại vải",
      dataIndex: "address",
      key: "address",
      render: (text) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image
            width={35}
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          />
          &nbsp; &nbsp;
          <Title level={5}>{text}</Title>
        </div>
      ),
    },
    {
      title: "Profile",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Radio.Group
            onChange={(e) => onChange1(e, record)}
            value={record.radioValue}
          >
            <Radio value={1}>Đã có vải</Radio>
            <Radio value={2} className="mt-2">
              Chưa có vải
            </Radio>
          </Radio.Group>
        </Space>
      ),
    },
  ];

  const steps = [
    {
      title: "Thông tin khách hàng",
      content: (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 500,
                marginTop: 24,
                border: "1px solid #D4D4D4",
                height: 460,
                padding: 30,
                borderRadius: "10px",
              }}
            >
              <Title level={4}>
                <FileSearchOutlined /> Tìm kiếm thông tin khách hàng
              </Title>
              <Text>Nhập số điện thoại để tìm kiếm thông tin khách hàng</Text>
              <Search
                placeholder="Nhập số điện thoại"
                size="large"
                style={{ marginTop: 15 }}
                value={searchInfo}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchInfo(value === "1" ? 1 : value);
                }}
              />
              <div
                style={{
                  height: 300,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {searchInfo === 1 ? (
                  <>
                    <div
                      style={{
                        height: 250,
                        overflowY: searchInfo === 1 ? "hidden" : "scroll",
                      }}
                    >
                      <Card
                        style={{
                          width: 400,
                          border: "1px solid #9F78FF",
                          marginTop: 20,
                        }}
                      >
                        <Row>
                          <Col span={4}>
                            <Avatar
                              src="https://api.dicebear.com/7.x/miniavs/svg?seed=3"
                              size={"large"}
                            />
                          </Col>
                          <Col span={20}>
                            <div className="mt-2">
                              <Text>
                                <b>
                                  <IdcardOutlined /> Họ và tên:
                                </b>
                                &nbsp; Đào Anh Tú
                              </Text>
                            </div>
                            <div className="mt-2">
                              <Text>
                                <b>
                                  <UserOutlined /> Tên người dùng:
                                </b>
                                &nbsp; anhtu
                              </Text>
                            </div>
                            <div className="mt-2">
                              <Text>
                                <b>
                                  <PhoneOutlined /> Số điện thoại:
                                </b>
                                &nbsp; 0937550256
                              </Text>
                            </div>
                            <div className="mt-2">
                              <Text>
                                <b>
                                  <GlobalOutlined /> Địa chỉ:
                                </b>
                                &nbsp; 117/18 Phan Văn Hân Phường 17 Quận Bình
                                Thạnh
                              </Text>
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    </div>
                  </>
                ) : (
                  <>
                    <Text strong>
                      Không tìm thấy khách hàng! &nbsp;
                      <b
                        level={4}
                        onClick={showModal}
                        style={{
                          fontSize: "18px",
                          color: "#9F78FF",
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        Tạo mới
                      </b>
                    </Text>
                    <Modal
                      open={isModalOpen}
                      style={{ top: 75 }}
                      title="Thêm mới khách hàng"
                      okText="Tạo mới"
                      cancelText="Hủy bỏ"
                      onCancel={() => {
                        form.resetFields();
                        setCheckValid(0);
                        setIsModalOpen(false);
                      }}
                      onOk={() => {
                        form
                          .validateFields()
                          .then((values) => {
                            form.resetFields();
                            onCreate(values);
                          })
                          .catch((info) => {
                            console.log("Validate Failed:", info);
                          });
                      }}
                    >
                      <Form
                        style={{
                          height: 400,
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
                          name="fullname"
                          label="Họ và tên"
                          hasFeedback
                          rules={[
                            {
                              required: true,
                              message: "Họ và tên không được để trống",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          hasFeedback
                          name="username"
                          label="Tên người dùng"
                          rules={[
                            {
                              required: true,
                              message: "Tên người dùng không được để trống",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>

                        {checkValid === 2 ? (
                          <Form.Item className="mt-2" label="Email">
                            <Input disabled />
                          </Form.Item>
                        ) : (
                          <Form.Item
                            className="mt-2"
                            hasFeedback
                            name="email"
                            label="Email"
                            rules={[
                              {
                                required: true,
                                message: "Email không được để trống",
                              },
                            ]}
                          >
                            <Input
                              onChange={(e) => {
                                const check = e.target.value;
                                if (check !== "") {
                                  setCheckValid(1);
                                } else {
                                  setCheckValid(0);
                                }
                              }}
                            />
                          </Form.Item>
                        )}

                        {checkValid === 1 ? (
                          <Form.Item label="Số điện thoại">
                            <Input disabled />
                          </Form.Item>
                        ) : (
                          <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            hasFeedback
                            rules={[
                              {
                                required: true,
                                message: "Số điện thoại không được để trống",
                              },
                              {
                                pattern: /^[0-9]{10}$/,
                                message: "Số điện thoại phải là 10 số",
                              },
                            ]}
                          >
                            <Input
                              onChange={(e) => {
                                const check = e.target.value;
                                if (check !== "") {
                                  setCheckValid(2);
                                } else {
                                  setCheckValid(0);
                                }
                              }}
                            />
                          </Form.Item>
                        )}
                      </Form>
                    </Modal>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Kiểu bản mẫu",
      content: (
        // <Form
        //   labelCol={{
        //     span: 6,
        //   }}
        //   wrapperCol={{
        //     span: 18,
        //   }}
        //   form={form}
        //   name="dynamic_form_complex"
        //   style={{
        //     maxWidth: 600,
        //     margin: "0 auto",
        //     marginTop: 24,
        //   }}
        //   autoComplete="off"
        //   initialValues={{
        //     items: [{}],
        //   }}
        //   onFinish={onFinish}
        // >
        //   <Form.List name="items">
        //     {(fields, { add, remove }) => (
        //       <div
        //         style={{
        //           display: "flex",
        //           rowGap: 16,
        //           flexDirection: "column",
        //         }}
        //       >
        //         {fields.map((field, index) => (
        //           <Card
        //             size="small"
        //             title={`Sản phẩm số ${field.name + 1}`}
        //             key={field.key}
        //             extra={
        //               <CloseOutlined
        //                 onClick={() => {
        //                   const updatedSelectItem = selectItem.filter(
        //                     (item, idx) => idx !== index
        //                   );
        //                   setSelectItem(updatedSelectItem);
        //                   const updatedProductType = selectProductType.filter(
        //                     (item, idx) => idx !== index
        //                   );
        //                   setSelectProductType(updatedProductType);
        //                   remove(field.name);
        //                 }}
        //               />
        //             }
        //           >
        //             <Form.Item
        //               label="Chọn bản mẫu"
        //               name={[field.name, "product_template"]}
        //             >
        //               <div>
        //                 {selectItem[field.name] ? (
        //                   <>
        //                     <Card
        //                       hoverable
        //                       style={{ width: 400 }}
        //                       styles={{
        //                         body: {
        //                           padding: 0,
        //                           overflow: "hidden",
        //                         },
        //                       }}
        //                       key={selectItem[field.name].id}
        //                       onClick={() => showModal(field.name)}
        //                     >
        //                       <Flex justify="space-between">
        //                         <img
        //                           alt="avatar"
        //                           src={selectItem[field.name].img}
        //                           style={{
        //                             display: "block",
        //                             width: 150,
        //                             height: 150,
        //                           }}
        //                         />
        //                         <Flex
        //                           vertical
        //                           align="flex-end"
        //                           justify="space-between"
        //                           style={{
        //                             padding: 32,
        //                           }}
        //                         >
        //                           <Typography.Title level={3}>
        //                             {selectItem[field.name].name}
        //                           </Typography.Title>
        //                         </Flex>
        //                       </Flex>
        //                     </Card>
        //                   </>
        //                 ) : (
        //                   <Button
        //                     type="primary"
        //                     onClick={() => showModal(field.name)}
        //                   >
        //                     Xem chi tiết
        //                   </Button>
        //                 )}

        //                 <Modal
        //                   title="Chọn bản mẫu phù hợp"
        //                   visible={modalState[field.name]} // Sử dụng trạng thái từ modalState thay vì index
        //                   onOk={() => handleOk(field.name)} // Truyền tên trường khi xác nhận
        //                   onCancel={() => handleCancel(field.name)} // Truyền tên trường khi hủy bỏ
        //                   width={1000}
        //                   style={{
        //                     top: 20,
        //                     height: 650,
        //                     overflowY: "scroll",
        //                     scrollbarWidth: "none",
        //                     WebkitScrollbar: "none",
        //                     marginTop: 24,
        //                   }}
        //                 >
        //                   <Row gutter={[16, 24]}>
        //                     {dataStep2.map((item) => {
        //                       return (
        //                         <Col
        //                           className="gutter-row"
        //                           span={12}
        //                           key={item.id}
        //                         >
        //                           <Card
        //                             hoverable
        //                             style={{ width: 400 }}
        //                             onClick={() =>
        //                               handleSelectTemplate(item, field.name)
        //                             } // Truyền tên trường khi chọn bản mẫu
        //                           >
        //                             <Flex justify="space-between">
        //                               <img
        //                                 alt="avatar"
        //                                 src={item.img}
        //                                 style={{
        //                                   display: "block",
        //                                   width: 150,
        //                                   height: 150,
        //                                 }}
        //                               />
        //                               <div style={{ padding: 32 }}>
        //                                 <Typography.Title level={3}>
        //                                   {item.name}
        //                                 </Typography.Title>
        //                               </div>
        //                             </Flex>
        //                           </Card>
        //                         </Col>
        //                       );
        //                     })}
        //                   </Row>
        //                 </Modal>
        //               </div>
        //             </Form.Item>
        //             <Form.Item
        //               label="Chọn kiểu"
        //               name={[field.name, "product_type"]}
        //             >
        //               {selectProductType[field.name] ? (
        //                 <Row gutter={[16, 24]}>
        //                   <Col className="gutter-row" span={6}>
        //                     <Card
        //                       hoverable
        //                       style={{
        //                         width: 200,
        //                       }}
        //                       cover={
        //                         <img
        //                           alt="example"
        //                           src={selectProductType[field.name].img}
        //                           style={{
        //                             height: 150,
        //                             objectFit: "cover",
        //                           }}
        //                         />
        //                       }
        //                       onClick={() => showProductTypeModal(field.name)}
        //                     >
        //                       <Meta
        //                         title={selectProductType[field.name].name}
        //                       />
        //                     </Card>
        //                   </Col>
        //                 </Row>
        //               ) : (
        //                 <Button
        //                   type="primary"
        //                   onClick={() => showProductTypeModal(field.name)}
        //                 >
        //                   Xem kiểu chi tiết
        //                 </Button>
        //               )}

        //               <Modal
        //                 title="Chọn kiểu mẫu phù hợp"
        //                 visible={modalProductTypeState[field.name]}
        //                 onOk={() => handleProductTypeOk(field.name)}
        //                 onCancel={() => handleProductTypeCancel(field.name)}
        //                 width={1000}
        //                 style={{
        //                   top: 20,
        //                   height: 650,
        //                   overflowY: "scroll",
        //                   scrollbarWidth: "none",
        //                   WebkitScrollbar: "none",
        //                   marginTop: 24,
        //                 }}
        //               >
        //                 <>
        //                   <Title level={4} className="mt-4">
        //                     Cổ áo
        //                   </Title>
        //                   <Row gutter={[16, 24]}>
        //                     {dataStep2_1.map((item) => {
        //                       return (
        //                         <>
        //                           <Col className="gutter-row" span={6}>
        //                             <Card
        //                               hoverable
        //                               style={{
        //                                 width: 200,
        //                               }}
        //                               cover={
        //                                 <img
        //                                   alt="example"
        //                                   src={item.img}
        //                                   style={{
        //                                     height: 150,
        //                                     objectFit: "cover",
        //                                   }}
        //                                 />
        //                               }
        //                               onClick={() =>
        //                                 handleSelectProductType(
        //                                   item,
        //                                   field.name
        //                                 )
        //                               }
        //                             >
        //                               <Meta title={item.name} />
        //                             </Card>
        //                           </Col>
        //                         </>
        //                       );
        //                     })}
        //                   </Row>
        //                   <Title level={4} className="mt-4">
        //                     Thân áo
        //                   </Title>
        //                   <Row gutter={[16, 24]}>
        //                     {dataStep2_1.map((item) => {
        //                       return (
        //                         <>
        //                           <Col className="gutter-row" span={6}>
        //                             <Card
        //                               hoverable
        //                               style={{
        //                                 width: 200,
        //                               }}
        //                               cover={
        //                                 <img
        //                                   alt="example"
        //                                   src={item.img}
        //                                   style={{
        //                                     height: 150,
        //                                     objectFit: "cover",
        //                                   }}
        //                                 />
        //                               }
        //                             >
        //                               <Meta title={item.name} />
        //                             </Card>
        //                           </Col>
        //                         </>
        //                       );
        //                     })}
        //                   </Row>
        //                 </>
        //               </Modal>
        //             </Form.Item>
        //             <Form.Item
        //               label="Chọn vải"
        //               name={[field.name, "product_material"]}
        //             >
        //               <Row>
        //                 <Col span={12}>
        //                   <Button
        //                     type="primary"
        //                     icon={<CheckSquareOutlined />}
        //                     onClick={() => setCheckMaterial(1)}
        //                   >
        //                     Đã có vải
        //                   </Button>
        //                 </Col>
        //                 <Col span={12}>
        //                   <Button
        //                     type="primary"
        //                     icon={<CloseSquareOutlined />}
        //                     onClick={() => setCheckMaterial(2)}
        //                   >
        //                     Chưa có vải
        //                   </Button>
        //                 </Col>
        //               </Row>
        //             </Form.Item>
        //             <Form.Item
        //               label="Profile khách hàng"
        //               name={[field.name, "profile_customer"]}
        //             >
        //               <Input />
        //             </Form.Item>
        //           </Card>
        //         ))}

        //         <Button type="dashed" onClick={() => add()} block>
        //           Thêm mới form
        //         </Button>
        //       </div>
        //     )}
        //   </Form.List>
        // </Form>
        <Form
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 13,
          }}
          form={form}
          name="dynamic_form_complex"
          style={{
            maxWidth: 700,
            margin: "0 auto",
            marginTop: 24,
          }}
          autoComplete="off"
          initialValues={{
            items: [{}],
          }}
        >
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <div
                style={{
                  display: "flex",
                  rowGap: 16,
                  flexDirection: "column",
                }}
              >
                {fields.map((field, index) => (
                  <Card
                    size="small"
                    title={`Sản phẩm ${field.name + 1}`}
                    key={field.key}
                    extra={
                      <CloseOutlined
                        onClick={() => {
                          remove(field.name);
                          const newCheckTemplateArray = [...checkTemplateArray];
                          newCheckTemplateArray.splice(index, 1);
                          setCheckTemplateArray(newCheckTemplateArray);
                        }}
                      />
                    }
                  >
                    <Form.Item
                      label="Chọn bản mẫu"
                      name={[field.name, "template"]}
                    >
                      <Select
                        style={{ height: 45 }}
                        onChange={(value) => {
                          const newCheckTemplateArray = [...checkTemplateArray];
                          newCheckTemplateArray[index] = value;
                          setCheckTemplateArray(newCheckTemplateArray);
                        }}
                      >
                        <Select.Option value="1">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Image
                              width={35}
                              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                            />
                            &nbsp; &nbsp;
                            <Title level={5}>Bản mẫu 1</Title>
                          </div>
                        </Select.Option>
                        <Select.Option value="2">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Image
                              width={35}
                              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                            />
                            &nbsp; &nbsp;
                            <Title level={5}>Bản mẫu 2</Title>
                          </div>
                        </Select.Option>
                        <Select.Option value="3">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Image
                              width={35}
                              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                            />
                            &nbsp; &nbsp;
                            <Title level={5}>Bản mẫu 3</Title>
                          </div>
                        </Select.Option>
                      </Select>
                    </Form.Item>
                    {checkTemplateArray[index] && (
                      <>
                        <Form.Item
                          label="Chọn cổ áo"
                          name={[field.name, "component"]}
                        >
                          <Select style={{ height: 45 }}>
                            <Select.Option value="1">
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Image
                                  width={35}
                                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                                />
                                &nbsp; &nbsp;
                                <Title level={5}>cổ áo 1</Title>
                              </div>
                            </Select.Option>
                            <Select.Option value="2">
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Image
                                  width={35}
                                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                                />
                                &nbsp; &nbsp;
                                <Title level={5}>cổ áo 2</Title>
                              </div>
                            </Select.Option>
                            <Select.Option value="3">
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Image
                                  width={35}
                                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                                />
                                &nbsp; &nbsp;
                                <Title level={5}>cổ áo 3</Title>
                              </div>
                            </Select.Option>
                          </Select>
                        </Form.Item>
                        <Form.Item
                          label="Chọn thân áo"
                          name={[field.name, "component_body"]}
                        >
                          <Select style={{ height: 45 }}>
                            <Select.Option value="1">
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Image
                                  width={35}
                                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                                />
                                &nbsp; &nbsp;
                                <Title level={5}>Thân áo 1</Title>
                              </div>
                            </Select.Option>
                            <Select.Option value="2">
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Image
                                  width={35}
                                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                                />
                                &nbsp; &nbsp;
                                <Title level={5}>Thân áo 2</Title>
                              </div>
                            </Select.Option>
                            <Select.Option value="3">
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Image
                                  width={35}
                                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                                />
                                &nbsp; &nbsp;
                                <Title level={5}>Thân áo 3</Title>
                              </div>
                            </Select.Option>
                          </Select>
                        </Form.Item>
                        <Form.Item
                          label="Chọn tay áo"
                          name={[field.name, "component_hand"]}
                        >
                          <Select style={{ height: 45 }}>
                            <Select.Option value="1">
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Image
                                  width={35}
                                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                                />
                                &nbsp; &nbsp;
                                <Title level={5}>Tay áo 1</Title>
                              </div>
                            </Select.Option>
                            <Select.Option value="2">
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Image
                                  width={35}
                                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                                />
                                &nbsp; &nbsp;
                                <Title level={5}>Tay áo 2</Title>
                              </div>
                            </Select.Option>
                            <Select.Option value="3">
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Image
                                  width={35}
                                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                                />
                                &nbsp; &nbsp;
                                <Title level={5}>Tay áo 3</Title>
                              </div>
                            </Select.Option>
                          </Select>
                        </Form.Item>
                        <Form.Item
                          label="Chọn loại vải"
                          name={[field.name, "component_material"]}
                        >
                          <Select
                            style={{ height: 45 }}
                            showSearch
                            placeholder="Chọn vải"
                            optionFilterProp="children"
                            allowClear
                            onChange={onChange}
                            onSearch={onSearch}
                            filterOption={filterOption}
                            options={[
                              {
                                value: "1",
                                title: "Bản mẫu 1",
                                label: (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Image
                                      width={35}
                                      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                                    />
                                    &nbsp; &nbsp;
                                    <Title level={5}>Bản mẫu 1</Title>
                                  </div>
                                ),
                              },
                              {
                                value: "2",
                                title: "Bản mẫu 2",
                                label: (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Image
                                      width={35}
                                      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                                    />
                                    &nbsp; &nbsp;
                                    <Title level={5}>Bản mẫu 2</Title>
                                  </div>
                                ),
                              },
                              {
                                value: "3",
                                title: "Bản mẫu 3",
                                label: (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Image
                                      width={35}
                                      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                                    />
                                    &nbsp; &nbsp;
                                    <Title level={5}>Bản mẫu 3</Title>
                                  </div>
                                ),
                              },
                            ]}
                          />
                        </Form.Item>

                        <Form.Item
                          name={[field.name, "component_profile_customer"]}
                          label="Profile khách hàng"
                        >
                          <Select
                            style={{ height: 45 }}
                            showSearch
                            allowClear
                            placeholder="Chọn profile"
                            optionFilterProp="children"
                            filterOption={filterOption1}
                            options={[
                              {
                                value: "1",
                                title: "Bản mẫu 1",
                                label: (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Image
                                      width={35}
                                      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                                    />
                                    &nbsp; &nbsp;
                                    <Title level={5}>Bản mẫu 1</Title>
                                  </div>
                                ),
                              },
                              {
                                value: "2",
                                title: "Bản mẫu 2",
                                label: (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Image
                                      width={35}
                                      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                                    />
                                    &nbsp; &nbsp;
                                    <Title level={5}>Bản mẫu 2</Title>
                                  </div>
                                ),
                              },
                              {
                                value: "3",
                                title: "Bản mẫu 3",
                                label: (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Image
                                      width={35}
                                      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                                    />
                                    &nbsp; &nbsp;
                                    <Title level={5}>Bản mẫu 3</Title>
                                  </div>
                                ),
                              },
                            ]}
                          />
                        </Form.Item>
                      </>
                    )}
                  </Card>
                ))}

                <Button type="dashed" onClick={() => add()} block>
                  + Add Item
                </Button>
              </div>
            )}
          </Form.List>
        </Form>
      ),
    },
    {
      title: "Thanh toán",
      content: (
        <>
          <Row style={{ marginTop: 24 }}>
            <Col
              span={18}
              push={6}
              style={{
                height: 490,
                border: "1px solid #9F78FF",
                borderRadius: "5px",
                padding: 15,
              }}
            >
              <Divider orientation="left" plain>
                <Title level={5}>Phương thức thanh toán</Title>
              </Divider>
              <Row gutter={16} justify="center">
                <Col span={5}>
                  <Card
                    style={{
                      width: 180,
                      border: "1px solid #D4D4D4",
                      cursor: "pointer",
                      backgroundColor: active === 1 ? "#9F78FF" : "",
                      color: active === 1 ? "white" : "",
                      textAlign: "center",
                    }}
                    onClick={() => setActive(active === 1 ? null : 1)}
                  >
                    <DollarOutlined style={{ fontSize: 24 }} /> &nbsp;
                    <Text
                      style={{
                        fontSize: 20,
                        color: active === 1 ? "white" : "",
                      }}
                    >
                      Vnpay
                    </Text>
                  </Card>
                </Col>
                <Col span={5}>
                  <Card
                    style={{
                      border: "1px solid #D4D4D4",
                      cursor: "pointer",
                      backgroundColor: active === 2 ? "#9F78FF" : "",
                      color: active === 2 ? "white" : "",
                      textAlign: "center",
                      width: 180,
                    }}
                    onClick={() => setActive(active === 2 ? null : 2)}
                  >
                    <PayCircleOutlined style={{ fontSize: 24 }} /> &nbsp;
                    <Text
                      style={{
                        fontSize: 20,
                        color: active === 2 ? "white" : "",
                      }}
                    >
                      Momo
                    </Text>
                  </Card>
                </Col>
                <Col span={5}>
                  <Card
                    style={{
                      border: "1px solid #D4D4D4",
                      cursor: "pointer",
                      backgroundColor: active === 3 ? "#9F78FF" : "",
                      color: active === 3 ? "white" : "",
                      textAlign: "center",
                      width: 180,
                    }}
                    onClick={() => setActive(active === 3 ? null : 3)}
                  >
                    <HomeOutlined style={{ fontSize: 24 }} /> &nbsp;
                    <Text
                      style={{
                        fontSize: 20,
                        color: active === 3 ? "white" : "",
                      }}
                    >
                      Tiền mặt
                    </Text>
                  </Card>
                </Col>
              </Row>
              <Divider orientation="left" plain>
                <Title level={5}>Thông tin sản phẩm</Title>
              </Divider>
              <div
                style={{
                  height: 250,
                }}
              >
                <Table
                  columns={columns}
                  dataSource={rowData}
                  pagination={false}
                  scroll={{
                    y: 200,
                  }}
                />
              </div>
            </Col>
            <Col
              span={5}
              pull={18}
              style={{
                height: 490,
                border: "1px solid #9F78FF",
                borderRadius: "5px",
                padding: 15,
                overflowY: "scroll",
                scrollbarWidth: "none",
                WebkitScrollbar: "none",
              }}
            >
              <div>
                <Title level={4}>Thông tin khách hàng</Title>
                <div style={{ marginTop: 24 }}>
                  <Text>
                    <b>Họ và tên:</b>
                    &nbsp; Đào Anh Tú
                  </Text>
                </div>
                <div style={{ marginTop: 5 }}>
                  <Text>
                    <b>Số điện thoại:</b>
                    &nbsp; 0937550256
                  </Text>
                </div>
              </div>
              <Divider />
              <div>
                <Title level={4}>Thông tin đơn hàng</Title>
                <div style={{ marginTop: 24 }}>
                  <Text>
                    <b>Mã đơn:</b>
                    &nbsp; 123456789
                  </Text>
                </div>
                <div style={{ marginTop: 5 }}>
                  <Text>
                    <b>Tổng sản phẩm</b>
                    &nbsp; 3
                  </Text>
                </div>
                <div style={{ marginTop: 5 }}>
                  <Text>
                    <b>Số tiền giảm</b>
                    &nbsp; 20.000đ
                  </Text>
                </div>
              </div>
              <Divider />
              <div>
                <Title level={4}>Áp dụng mã</Title>
                <div style={{ marginTop: 10 }}>
                  <Search
                    placeholder="Mã giảm giá"
                    allowClear
                    enterButton="Kiểm tra"
                  />
                </div>
              </div>
              <Divider />
              <div>
                <Title level={4}>Tổng cộng: 300.000đ</Title>
                <div style={{ marginTop: 5 }}>
                  <Text>
                    <b>Mã áp dụng:</b>
                    &nbsp; tudeptrai
                  </Text>
                </div>
                <div style={{ marginTop: 5 }}>
                  <Text>
                    <b>Số tiền giảm:</b>
                    &nbsp; -20.000đ
                  </Text>
                </div>
              </div>
              <Divider />
              <Title level={4}>Tổng thanh toán: 280.000đ</Title>
            </Col>
          </Row>
        </>
      ),
    },
  ];

  const [current, setCurrent] = useState(0);
  const next = () => {
    if (current === 0) {
      console.log("step1", current);
    } else if (current === 1) {
      console.log("next", current);
    } else if (current === 2) {
      console.log("next", current);
      setCurrent(0);
      return;
    }
    setCurrent(current + 1);
  };
  const prev = () => {
    console.log("prev", current);
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  return (
    <>
      <Steps current={current} items={items} />
      <div>{steps[current]?.content}</div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "24px",
        }}
      >
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Tiếp theo
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Tạo đơn
          </Button>
        )}
        {current > 0 && (
          <Button
            style={{
              margin: "0 8px",
            }}
            onClick={() => prev()}
          >
            Quay lại
          </Button>
        )}
      </div>
    </>
  );
};

function OrderToCustomer() {
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
        <OrderToCustomerHeader />
      </div>
      <div
        className="manager-content"
        style={{
          height: "83vh",
          overflowY: "scroll",
          border: "1px solid #9F78FF",
        }}
      >
        <OrderToCustomerContent />
      </div>
    </div>
  );
}

export default OrderToCustomer;
