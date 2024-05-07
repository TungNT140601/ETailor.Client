import React, { useState, useEffect } from 'react'
import {
    HomeOutlined,
    UserOutlined,
    ClockCircleOutlined,
    WarningOutlined,
    MinusCircleOutlined, PlusOutlined
} from "@ant-design/icons";
import "./index.css";
import {
    Avatar,
    Input,
    Divider,
    Select,
    Breadcrumb,
    Popover,
    Button,
    Modal,
    Typography,
    Form,
    Space,
    DatePicker,
    Spin,
    Col,
    Row,
    TreeSelect,
    Image
} from "antd";
import Notask from "../../../assets/images/nodata.jpg";
import toast, { Toaster } from 'react-hot-toast';
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
const { Search } = Input;
const { Title, Text } = Typography;
const { Option } = Select;
function getHoursDifference(deadline) {
    const currentDateUTC = new Date();

    const startMillis = new Date(deadline).getTime();
    const currentMillisUTC7 = currentDateUTC.getTime();

    const millisDiff = startMillis - currentMillisUTC7;
    const hoursDiff = millisDiff / (1000 * 60 * 60);

    return hoursDiff < 0 ? "Quá hạn" : hoursDiff < 24 ? `${Math.floor(hoursDiff)} giờ ` : `${Math.floor(hoursDiff / 24)} ngày`;
}
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("vi-VI", { month: "2-digit" });
    const year = date.getFullYear();
    return `${day}/${month}/${year}`
};
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
const getStatusTextAndColor = (status) => {
    let color;
    let text;
    let backgroundColor;
    let borderColor;
    switch (status) {
        case 0:
            color = "#e0616b";
            backgroundColor = "#fff1f0";
            borderColor = "#ffaba7";
            text = "Đã huỷ";
            break;
        case 1:
            color = "#8157c2";
            borderColor = "#d3adf7";
            backgroundColor = "#f9f0ff";
            text = "Chưa bắt đầu";
            break;
        case 2:
            color = "#1d39c4";
            borderColor = "#adc6ff";
            backgroundColor = "#f0f5ff";
            text = "Đang xử lý";
            break;
        case 3:
            color = "#dc9e2f";
            borderColor = "#ffe58f";
            backgroundColor = "#fffbe6";
            text = "Tạm dừng";
            break;
        case 4:
            color = "#67b645";
            borderColor = "#c6f0a6"
            text = "Hoàn thành";
            backgroundColor = "#f6ffed";
            break;

    }
    return { color, text, backgroundColor, borderColor };
};

export default function ManagementTaskByOrder() {
    const ManagementTasksHeader = () => {
        const onSearch = (value, _e, info) => console.log(info?.source, value);
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
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
                                href: "#",
                                title: (
                                    <>
                                        <Link to="#">
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    color: "#9F78FF",
                                                }}
                                            >
                                                <UserOutlined fontSize="small" />
                                                &nbsp;
                                                <span>Quản lý công việc</span>
                                            </div>
                                        </Link>
                                    </>
                                ),
                            },
                        ]}
                    />
                    <Title level={4}>Quản lý công việc theo công đoạn</Title>
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
    const ManagementTasksContent = () => {

        const dayjs = require('dayjs');
        const utc = require('dayjs/plugin/utc');
        const timezone = require('dayjs/plugin/timezone');

        dayjs.extend(utc);
        dayjs.extend(timezone);

        dayjs.tz.setDefault('Asia/Ho_Chi_Minh');

        const currentTimeVietnam = dayjs().format('YYYY-MM-DD HH:mm:ss');
        const milliseconds = dayjs(currentTimeVietnam).valueOf()

        const [expanded, setExpanded] = useState(true);
        const handleExpansion = (panel) => {
            setExpanded((prevExpanded) => ({
                ...prevExpanded,
                [panel]: !prevExpanded[panel],
            }));
        };
        const staffImageHover = (product) => {
            // console.log("Staff Image Hover", product.id)
        }
        const handleCloseAll = () => {
            const newExpandedState = {};
            Object.keys(expanded).forEach((panel) => {
                newExpandedState[panel] = false;
            });
            // console.log("New Expanded State:", newExpandedState);
            setExpanded(false);
        };
        const [loading, setLoading] = useState(true);
        const [templatesData, setTemplatesData] = useState("");
        const [templateCategories, setTemplateCategories] = useState("");
        const [currentTemplate, setCurrentTemplate] = useState("");
        const handleChoseTemplate = (id) => {
            // console.log("Chose template:", id);
            templatesData.filter((category) => {
                category.productTemplates.filter((template) => {
                    if (template.id === id) {
                        setCurrentTemplate(template);
                    }
                })
            })
        }
        // console.log("Current Template:", currentTemplate);
        const [allStaff, setAllStaff] = useState("");
        const fetchTemplates = async () => {
            try {
                const response = await fetch(
                    "https://e-tailorapi.azurewebsites.net/api/task/dashboard",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${manager.token}`,
                        },
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    // console.log("Data:", data);
                    setTemplatesData(data);
                    setCurrentTemplate(data[0]?.productTemplates[0]);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error:", error);
                setLoading(false);
            }
        };
        const [allMaterials, setAllMaterials] = useState("");
        useEffect(() => {

            const manager = JSON.parse(localStorage.getItem("manager"))
            const fetchAllMaterial = async () => {
                const GET_ALL_MATERIAL_URL = `https://e-tailorapi.azurewebsites.net/api/material`
                try {
                    const response = await fetch(GET_ALL_MATERIAL_URL, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${manager.token}`,
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setAllMaterials(data);
                    }
                } catch (error) {
                    console.error("Error:", error);
                }
            }
            const fetchAllStaff = async () => {
                try {
                    const response = await fetch(
                        "https://e-tailorapi.azurewebsites.net/api/staff/current-tasks",
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${manager.token}`,
                            },
                        }
                    );
                    if (response.ok) {
                        const data = await response.json();
                        // console.log("Data staff:", data);
                        setAllStaff(data);
                    }
                } catch (error) {
                    console.error("Error:", error);
                }
            }
            fetchTemplates();
            fetchAllMaterial()
            fetchAllStaff();
        }, []);

        const Content = ({ product, stage, materials }) => {
            const [open, setOpen] = useState(false);
            const [confirmLoading, setConfirmLoading] = useState(false);
            const showModal = () => {
                setOpen(true);
            };
            const [deadlineUpdateLoading, setDeadlineUpdateLoading] = useState(false);
            const [changeClick, setChangeClick] = useState(false);
            const [selectedValue, setSelectedValue] = useState(null);

            const handleSelectChange = (value) => {
                setSelectedValue(value);
            };
            const handleCancel = () => {
                setOpen(false);
            };

            const handleOk = async (productId) => {
                if (productId && selectedValue !== null) {
                    setConfirmLoading(true);
                    const manager = JSON.parse(localStorage.getItem("manager"));
                    try {

                        const URL = `https://e-tailorapi.azurewebsites.net/api/task/staff/${selectedValue}/assign/${productId}`
                        const response = await fetch(URL, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${manager.token}`,
                            },
                        });
                        if (response.status === 200) {
                            const data = await response.text();
                            // console.log("Data:", data);
                            setConfirmLoading(false);
                            toast.success("Thay đổi nhân viên thực hiện thành công");
                            fetchTemplates();
                            setChangeClick(false);
                            setOpen(false);
                        } else {

                            toast.error("Thay đổi nhân viên thực hiện thất bại");
                            setConfirmLoading(false);
                            setOpen(false);
                        }
                    } catch (error) {
                        console.error("Error:", error);
                        setConfirmLoading(false);
                        toast.error("Thay đổi nhân viên thực hiện thất bại");
                        setOpen(false);
                    }
                }
                else {
                    setOpen(false);
                }
            };
            const [deadline, setDeadline] = useState(null);
            const handleDeadlineUpdate = async (productId, newDeadline) => {
                setDeadlineUpdateLoading(true);
                const manager = JSON.parse(localStorage.getItem("manager"));
                const UPDATE_DEADLINE_URL = `https://e-tailorapi.azurewebsites.net/api/task/task/${productId}/deadline?deadlineTickString=${newDeadline}`;
                try {
                    const response = await fetch(UPDATE_DEADLINE_URL, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${manager.token}`,
                        },
                    });
                    if (response.status === 200) {
                        const data = await response.text();
                        setDeadlineUpdateLoading(false);
                        console.log("Data:", data);
                        fetchTemplates();
                        setDeadline(null);
                        toast.success("Cập nhật deadline thành công");
                    } else {
                        const msg = await response.text();
                        toast.error(msg);
                        setDeadlineUpdateLoading(false);
                    }
                } catch (e) {
                    console.log("Error at update deadline:", e);
                }
            };

            return (
                <div style={{ marginLeft: 10, minWidth: 240 }}>
                    <div>
                        <div style={{ display: "flex" }}>
                            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Tên sản phẩm: {product?.name}</h3>
                            <p style={{ fontSize: 15, fontWeight: 600, paddingLeft: 30 }}>Tiến độ: <span style={{ fontWeight: 400 }}>{product.productStages[0].stageNum}/{currentTemplate?.templateStages?.length}</span></p>
                        </div>

                        <p style={{ fontSize: 15, fontWeight: 600 }}>Ghi chú: <span style={{ fontWeight: 400 }}>{product?.note ? product.note : "Không có ghi chú"}</span> </p>
                        <p style={{ fontSize: 15, fontWeight: 600 }}>Giá trị đơn hàng: <span style={{ fontWeight: 400 }}>{formatCurrency(product?.price)}</span></p>
                        <p style={{ fontSize: 15, fontWeight: 600 }}>Ngày bắt đầu: <span style={{ fontWeight: 400 }}>{formatDate(product.createdTime)} </span></p>
                        <p style={{ fontSize: 15, fontWeight: 600 }}>Hạn hoàn thành: <span style={{ fontWeight: 400 }}>{product.plannedTime ? formatDate(product.plannedTime) : "Không có hạn hoàn thành"}</span></p>

                        <Button style={{ paddingTop: 5 }} type="primary" onClick={showModal}>
                            Xem chi tiết
                        </Button>
                    </div>
                    <Modal
                        title="Chi tiết công việc"
                        open={open}
                        okText="Xác nhận"
                        width={700}
                        height={500}
                        cancelText="Đóng"
                        onOk={() => handleOk(product.id)}
                        confirmLoading={confirmLoading}
                        onCancel={handleCancel}

                    >
                        <div style={{ marginLeft: 10, minWidth: 240, width: 700 }}>
                            {deadlineUpdateLoading ? (
                                <div style={{ width: 480, height: 250, textAlign: "center" }}>
                                    <Spin size="large" color="#9F78FF" style={{ paddingTop: 40 }} />
                                </div>
                            ) : (
                                <div style={{ marginTop: 20, width: "100%" }}>
                                    <div>
                                        <h3 style={{ fontSize: 15, fontWeight: 600 }}>Tên sản phẩm: {product?.name}</h3>
                                    </div>
                                    <Row style={{ width: "100%", justifyContent: "flex-end" }}>
                                        <Col span={12}>
                                            <p style={{ fontSize: 15, fontWeight: 600, margin: 10 }}>Ghi chú: <span style={{ fontWeight: 400 }}>{product?.note ? product.note : "Không có ghi chú"}</span> </p>
                                            <p style={{ fontSize: 15, fontWeight: 600, margin: 10 }}>Tổng cộng: <span style={{ fontWeight: 400 }}>{formatCurrency(product?.price)}</span></p>
                                            <p style={{ fontSize: 15, fontWeight: 600, margin: 10 }}>Tiến độ: <span style={{ fontWeight: 400 }}>{product.productStages[0].stageNum}/{currentTemplate?.templateStages?.length}</span></p>

                                        </Col>
                                        <Col span={12}>
                                            <p style={{ fontSize: 15, fontWeight: 600, margin: 10 }}>Thời hạn:&nbsp;

                                                <span style={{ fontSize: 14, fontWeight: 400 }}>
                                                    {formatDate(product?.plannedTime)}
                                                </span>
                                                {/* <DatePicker
                                                        value={product.plannedTime ? dayjs(product.plannedTime) : ''}
                                                        showTime={{ format: 'HH:mm' }}
                                                        onChange={(value, dateString) => {
                                                            console.log('Selected Time: ', dateString);
                                                            const newDeadline = dayjs(dateString).valueOf().toString();
                                                            setDeadline(newDeadline);
                                                            console.log('Formatted Selected Time: ', dayjs(dateString).valueOf());
                                                            if (newDeadline !== null) {
                                                                handleDeadlineUpdate(product.id, newDeadline);
                                                            }
                                                        }}

                                                    /> */}

                                            </p>
                                            <div>
                                                <p style={{ fontSize: 15, fontWeight: 600, margin: 10 }}>Màu vải:</p>
                                                <div style={{ marginLeft: 10, display: "flex" }}>
                                                    <Image
                                                        width={50}
                                                        style={{ borderRadius: 5, marginRight: 10 }}
                                                        src={product?.fabricMaterial?.image}
                                                    />
                                                    <p style={{ fontSize: 14, fontWeight: 400, paddingLeft: 5 }}>{product?.fabricMaterial?.name} </p>
                                                </div>
                                            </div>


                                        </Col>
                                    </Row>

                                    <div style={{ display: "flex", marginLeft: 10, alignItems: "center", marginTop: 20 }}>
                                        <p style={{ fontSize: 15, fontWeight: 600 }}>Nhân viên thực hiện : {product?.staffMaker?.fullname}</p>
                                        <Button style={{ marginLeft: 20, border: "none" }} onClick={() => setChangeClick(changeClick ? false : true)}>Thay đổi</Button>

                                    </div>
                                    {
                                        changeClick ? (
                                            <div>
                                                <Select
                                                    showSearch
                                                    style={{ width: 280, marginTop: 10, height: 60 }}
                                                    placeholder="Chọn nhân viên"
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) => {
                                                        const staffName = option.props.children.props.children[1].props.children;
                                                        return staffName.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                                    }}
                                                    onChange={handleSelectChange}
                                                    defaultValue={product?.staffMaker?.id}
                                                >
                                                    {allStaff && allStaff.map((staff, index) => (
                                                        <Option key={staff.id} value={staff.id}>
                                                            <div>
                                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                                    <Avatar src={staff.avatar} />
                                                                    <div>
                                                                        <p style={{ marginLeft: 10 }}>{staff.fullname}</p>
                                                                        <p style={{ marginLeft: 10, marginTop: 0 }}>Task đang có: {staff.totalTask}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </div>
                                        ) : null
                                    }
                                </div >
                            )
                            }
                        </div >
                    </Modal >
                </div >
            );
        }


        return (
            <div style={{ width: "100%", height: "100%", borderRadius: 10, display: "flex" }}>
                {loading ? (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "550px",
                            width: "100%",
                        }}
                    >
                        <CircularProgress />
                    </div>
                ) : (
                    <>
                        <div style={{ width: "25%", maxHeight: "90%", borderTopLeftRadius: 10, borderBottomLeftRadius: 10, position: "relative", }}>

                            <div style={{ paddingTop: 10, overflowY: "scroll", backgroundColor: "#ffffff", scrollbarWidth: "none", height: "82vh", width: "100%", border: "1px solid #9F78FF", borderRadius: 10 }}>
                                <div style={{ backgroundColor: "#ffffff", height: "6vh", width: "100%", display: "flex", alignItems: "end", borderRadius: 20 }}>
                                    <h2 style={{ fontSize: "1.4rem", fontWeight: "bold", paddingLeft: 20, color: "#9F78FF" }}>Tất cả bản mẫu</h2>

                                </div>
                                <Divider style={{ margin: 5 }} />
                                <div style={{ padding: 5 }}>

                                    {templatesData && templatesData?.map((category, index) => (
                                        <div style={{ margin: "5px 4px 10px 4px", borderRadius: 10, overflow: "hidden" }} key={index}>
                                            <Accordion disabled={category.totalTask === 0 ? true : false} >
                                                <AccordionSummary
                                                    sx={{ backgroundColor: category.totalTask === 0 ? "rgba(217, 217, 217, 0.432)" : "#9F78FF" }}
                                                    expandIcon={<ExpandMoreIcon style={{ color: category.totalTask === 0 ? "#000000" : "#ffffff" }} />}
                                                    aria-controls="panel2-content"

                                                    id="panel2-header"
                                                >
                                                    <p className='template-category-text' style={{ color: category.totalTask === 0 ? "#000000" : "#ffffff" }}> ( {category.totalTask} ) {category.name}</p>
                                                </AccordionSummary>
                                                {category?.productTemplates?.map((template, index) => (
                                                    <>
                                                        <AccordionDetails expanded={expanded} sx={{ cursor: "pointer" }} onClick={() => handleChoseTemplate(template.id)} key={template.id}>

                                                            <p className='template-product-text' style={{ color: currentTemplate.id === template.id ? "#9F78FF" : "#000000" }}>
                                                                {template.name} ({template?.products?.length})
                                                            </p>
                                                        </AccordionDetails>
                                                        <Divider style={{ margin: 5 }} />

                                                    </>
                                                ))}
                                            </Accordion>
                                        </div>
                                    ))}
                                </div>

                            </div>

                        </div>
                        <div style={{ border: "1px solid #9F78FF", width: "75%", height: "82vh", margin: "0px 0px 10px 30px", borderRadius: 10, alignItems: "center" }}>

                            <div style={{ overflowX: "auto", scrollbarWidth: "thin", marginRight: 20, height: "80vh" }}>
                                <div style={{ display: "grid", height: "70vh", gridTemplateColumns: " repeat(minmax(300px,300px))", gridAutoFlow: "column", paddingLeft: 20, paddingRight: 20, marginTop: 20 }}>
                                    {currentTemplate?.templateStages?.map((stage, index) => (
                                        <div style={{ alignItems: "center", textAlign: "center", height: "70vh", marginRight: 20 }} key={stage.id}>
                                            <div style={{ borderRadius: 15, alignItems: "end", alignContent: "end" }}>
                                                <Divider plain>
                                                    <p style={{ fontSize: 18, fontWeight: 600 }}>{stage?.name}</p>
                                                </Divider>

                                            </div>
                                            <div style={{ backgroundColor: "#f3f1fa", marginTop: 20, height: "75vh", width: "280px", paddingTop: 15, overflowY: "scroll", scrollbarWidth: "none" }}>
                                                {currentTemplate?.products && currentTemplate?.products.map((product, index) => {
                                                    if (product?.productStages[0]?.stageNum === stage?.stageNum) {
                                                        return (
                                                            // color = "#8157c2";
                                                            // borderColor = "#d3adf7";
                                                            // backgroundColor = "#f9f0ff";
                                                            <div
                                                                style={{
                                                                    border: `2px solid #d3adf7`,
                                                                    borderRadius: 5,
                                                                    backgroundColor: `#f9f0ff`,
                                                                    width: "250px",
                                                                    margin: "auto",
                                                                    marginBottom: 20,
                                                                    cursor: "pointer",
                                                                    height: 120,
                                                                    alignContent: "start"
                                                                }}
                                                                className="task-card"
                                                                key={product.id}
                                                            >
                                                                <div style={{ textAlign: "start", paddingLeft: 10, paddingRight: 10, height: '100%', position: "relative" }}>
                                                                    <Popover placement={stage.stageNum === 5 ? "leftTop" : "rightTop"} content={() => <Content product={product} stage={stage} materials={allMaterials} />} >
                                                                        <h3 style={{ color: `#8157c2`, fontWeight: "600", fontSize: 15, alignContent: "start" }}><span style={{ color: `#8157c2`, }}> {product?.name}</span> </h3>
                                                                        <h3 style={{ color: `#8157c2`, fontWeight: "600", fontSize: 15, alignContent: "start" }}>Mã đơn: <span style={{ fontSize: 14, fontWeight: 400 }}>{product?.orderId}</span></h3>
                                                                        {product?.plannedTime ? (
                                                                            <h3
                                                                                style={{
                                                                                    color: `#8157c2`,
                                                                                    fontWeight: "600",
                                                                                    fontSize: 15,
                                                                                    alignContent: "start"
                                                                                }}
                                                                            >Thời hạn: &nbsp;
                                                                                <span style={{ fontSize: 14, fontWeight: 400 }}>
                                                                                    {formatDate(product?.plannedTime)}
                                                                                </span>
                                                                            </h3>
                                                                        ) : ""}
                                                                        <p style={{ color: `#8157c2`, fontWeight: "600", fontSize: 15, alignContent: "start" }}>Hoàn thiện: <span style={{ fontWeight: 400 }}>{product.productStages[0].stageNum}/{currentTemplate?.templateStages?.length}</span></p>
                                                                        <p style={{ color: `#8157c2` }}>
                                                                            {product.plannedTime ? (
                                                                                getHoursDifference(product.plannedTime) === "Quá hạn" ? (
                                                                                    <>
                                                                                        <div style={{ display: "flex", alignItems: "center" }}>
                                                                                            <WarningOutlined style={{ color: "red" }} />
                                                                                            <p style={{ color: "red", paddingLeft: 5 }}>{getHoursDifference(product.productStages[0]?.deadline)} </p>
                                                                                        </div>

                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <ClockCircleOutlined style={{ color: `#8157c2` }} />
                                                                                        &nbsp;{getHoursDifference(product.plannedTime)}
                                                                                    </>
                                                                                )


                                                                            ) : (
                                                                                <>
                                                                                    <WarningOutlined /> Chưa có deadline
                                                                                </>

                                                                            )}
                                                                        </p>




                                                                        <div title={product?.staffMaker?.fullname} style={{ position: "absolute", bottom: 2, right: 2 }} >

                                                                            <img src={product?.staffMaker?.avatar} alt='' style={{ width: 40, height: 40, borderRadius: "50%" }} ></img>

                                                                        </div>
                                                                    </Popover>
                                                                </div>

                                                            </div>

                                                        )

                                                    }
                                                })}
                                            </div>


                                        </div>
                                    ))}


                                </div>
                            </div>

                        </div>
                    </>
                )
                }

            </div >
        )
    }

    const manager = JSON.parse(localStorage.getItem("manager"));
    return (
        <div>
            <Toaster />
            <div
                style={{
                    padding: "20px 20px",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #9F78FF",
                }}
                className="manager-header"
            >
                <ManagementTasksHeader />
            </div>
            <div
                className="manager-task-content"
                style={{
                    height: "82vh",

                }}
            >
                <ManagementTasksContent />
            </div>
        </div>
    )
}
