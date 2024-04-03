import React, { useState, useEffect } from 'react'
import {
    HomeOutlined,
    UserOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    LoadingOutlined,
    SettingOutlined,
    ClockCircleOutlined
} from "@ant-design/icons";
import { Typography } from "antd";
import "./index.css";
import {
    Avatar,
    Input,
    Divider,
    Select,
    Breadcrumb,
    Popover,
    Button,
    Modal
} from "antd";
import Notask from "../../../assets/images/nodata.jpg";
import toast, { Toaster } from 'react-hot-toast';
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useQuery } from "react-query";
import CircularProgress from "@mui/material/CircularProgress";
import { render } from '@testing-library/react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Fade from '@mui/material/Fade';

const { Search } = Input;
const { Title, Text } = Typography;
const { Option } = Select;
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("vi-VI", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`
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
            color = "volcano";
            text = "Hoàn thành";
            break;

    }
    return { color, text, backgroundColor, borderColor };
};
// const getBorderColorByStage = (stageNum) => {
//     let color;
//     let text;
//     let backgroundColor;
//     let borderColor;
//     switch (stageNum) {
//         case 0:
//             color = "#e0616b";
//             backgroundColor = "#fff1f0";
//             borderColor = "#ffaba7";
//             text = "Đã huỷ";
//             break;
//         case 1:
//             color = "#8157c2";
//             borderColor = "#d3adf7";
//             backgroundColor = "#f9f0ff";
//             text = "Chưa bắt đầu";
//             break;
//         case 2:
//             color = "#1d39c4";
//             borderColor = "#adc6ff";
//             backgroundColor = "#f0f5ff";
//             text = "Đang xử lý";
//             break;
//         case 3:
//             color = "#dc9e2f";
//             borderColor = "#ffe58f";
//             backgroundColor = "#fffbe6";
//             text = "Tạm dừng";
//             break;
//         case 4:
//             color = "volcano";
//             text = "Hoàn thành";
//             break;

//     }
//     return { color, text, backgroundColor, borderColor };
// };

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

        const [expanded, setExpanded] = useState(false);
        const handleExpansion = (panel) => {
            setExpanded((prevExpanded) => ({
                ...prevExpanded,
                [panel]: !prevExpanded[panel],
            }));
        };
        const staffImageHover = (product) => {
            console.log("Staff Image Hover", product.id)
        }
        const handleCloseAll = () => {
            console.log("Closing all accordions");
            const newExpandedState = {};
            Object.keys(expanded).forEach((panel) => {
                newExpandedState[panel] = false;
            });
            console.log("New Expanded State:", newExpandedState);
            setExpanded(false);
        };
        const [loading, setLoading] = useState(true);
        const [templatesData, setTemplatesData] = useState("");
        const [templateCategories, setTemplateCategories] = useState("");
        const [currentTemplate, setCurrentTemplate] = useState("");
        const handleChoseTemplate = (id) => {
            console.log("Chose template:", id);
            templatesData.filter((category) => {
                category.productTemplates.filter((template) => {
                    if (template.id === id) {
                        setCurrentTemplate(template);
                    }
                })
            })
        }
        console.log("Current Template:", currentTemplate);
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
                    console.log("Data:", data);
                    setTemplatesData(data);
                    setCurrentTemplate(data[0]?.productTemplates[0]);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error:", error);
                setLoading(false);
            }
        };
        useEffect(() => {

            const manager = JSON.parse(localStorage.getItem("manager"));
            // const fetchTemplates = async () => {
            //     try {
            //         const response = await fetch(
            //             "https://e-tailorapi.azurewebsites.net/api/task/dashboard",
            //             {
            //                 method: "GET",
            //                 headers: {
            //                     "Content-Type": "application/json",
            //                     Authorization: `Bearer ${manager.token}`,
            //                 },
            //             }
            //         );
            //         if (response.ok) {
            //             const data = await response.json();
            //             console.log("Data:", data);
            //             setTemplatesData(data);
            //             setCurrentTemplate(data[0]?.productTemplates[0]);
            //             setLoading(false);
            //         }
            //     } catch (error) {
            //         console.error("Error:", error);
            //         setLoading(false);
            //     }
            // };

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
                        console.log("Data staff:", data);
                        setAllStaff(data);
                    }
                } catch (error) {
                    console.error("Error:", error);
                }
            }
            fetchTemplates();
            fetchAllStaff();
        }, []);

        const Content = ({ product, stage }) => {
            const [open, setOpen] = useState(false);
            const [confirmLoading, setConfirmLoading] = useState(false);
            const showModal = () => {
                setOpen(true);
            };
            const [changeClick, setChangeClick] = useState(false);
            const [selectedValue, setSelectedValue] = useState(null);

            const handleSelectChange = (value) => {
                setSelectedValue(value);
            };
            const handleCancel = () => {
                console.log('Clicked cancel button');
                setOpen(false);
            };

            const handleOk = async (productId) => {
                console.log('Clicked ok', productId, selectedValue);
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
                            console.log("Data:", data);
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
                else{
                    setOpen(false);
                }
            };

            return (
                <div style={{ marginLeft: 10, minWidth: 240 }}>
                    <div>
                        <div>
                            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Tên sản phẩm: {product?.name}</h3>
                        </div>

                        <p style={{ fontSize: 15, fontWeight: 600 }}>Ghi chú: <span style={{ fontWeight: 400 }}>{product?.note ? product.note : "Không có ghi chú"}</span> </p>
                        <p style={{ fontSize: 15, fontWeight: 600 }}>Tổng cộng: <span style={{ fontWeight: 400 }}>{formatCurrency(product?.price)}</span></p>
                        <p style={{ fontSize: 15, fontWeight: 600 }}>Thời hạn: <span style={{ fontWeight: 400 }}>{formatDate(product.createdTime)}-{product.productStages[0].deadline ? formatDate(product.productStages[0].deadline) : ''} </span></p>
                        <p style={{ fontSize: 15, fontWeight: 600 }}>Tiến độ: <span style={{ fontWeight: 400 }}>{product.productStages[0].stageNum}/{currentTemplate?.templateStages?.length}</span></p>
                        <Button type="primary" onClick={showModal}>
                            Xem chi tiết
                        </Button>
                    </div>
                    <Modal
                        title="Chi tiết công việc"
                        open={open}
                        okText="Xác nhận"
                        cancelText="Đóng"
                        onOk={() => handleOk(product.id)}
                        confirmLoading={confirmLoading}
                        onCancel={handleCancel}
                        style={{ width: 500, height: 500 }}
                    >
                        <div style={{ marginLeft: 10, minWidth: 240 }}>
                            <div>
                                <div>
                                    <h3 style={{ fontSize: 15, fontWeight: 600 }}>Tên sản phẩm: {product?.name}</h3>
                                </div>

                                <p style={{ fontSize: 15, fontWeight: 600, margin: 5 }}>Ghi chú: <span style={{ fontWeight: 400 }}>{product?.note ? product.note : "Không có ghi chú"}</span> </p>
                                <p style={{ fontSize: 15, fontWeight: 600, margin: 5 }}>Tổng cộng: <span style={{ fontWeight: 400 }}>{formatCurrency(product?.price)}</span></p>
                                <p style={{ fontSize: 15, fontWeight: 600, margin: 5 }}>Thời hạn: <span style={{ fontWeight: 400 }}>{formatDate(product.createdTime)}-{product.productStages[0].deadline ? formatDate(product.productStages[0].deadline) : ''} </span></p>
                                <p style={{ fontSize: 15, fontWeight: 600, margin: 5 }}>Tiến độ: <span style={{ fontWeight: 400 }}>{product.productStages[0].stageNum}/{currentTemplate?.templateStages?.length}</span></p>
                                <div style={{ display: "flex" }}>
                                    <p style={{ fontSize: 15, fontWeight: 600 }}>Nhân viên thực hiện : {product?.staffMaker?.fullname}</p>
                                    <Button style={{ marginLeft: 50 }} onClick={() => setChangeClick(changeClick ? false : true)}>Thay đổi</Button>

                                </div>
                                {changeClick ? (
                                    <div>
                                        <Select
                                            showSearch
                                            style={{ width: 280, marginTop: 20, height: 60 }}
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
                                ) : null}
                            </div>
                        </div>
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
                        <div style={{ width: "25%", maxHeight: "100%", borderTopLeftRadius: 10, borderBottomLeftRadius: 10, position: "relative", }}>

                            <div style={{ paddingTop: 10, overflowY: "scroll", backgroundColor: "#ffffff", scrollbarWidth: "none", height: "82vh", marginTop: 10, width: "100%", border: "1px solid #9F78FF", borderRadius: 20 }}>
                                <div style={{ backgroundColor: "#ffffff", height: "6vh", width: "100%", display: "flex", alignItems: "end", borderRadius: 20 }}>
                                    <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", paddingLeft: 20, color: "#9F78FF" }}>Tất cả bản mẫu</h2>
                                </div>
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
                                                        <AccordionDetails sx={{ cursor: "pointer" }} onClick={() => handleChoseTemplate(template.id)} key={template.id}>

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
                        <div style={{ border: "1px solid #9F78FF", width: "75%", height: "82vh", margin: "10px 10px 10px 30px", borderRadius: 20, alignItems: "center" }}>

                            <div style={{ overflowX: "auto", scrollbarWidth: "thin", marginRight: 20 }}>
                                <div style={{ display: "grid", height: "70vh", gridTemplateColumns: " repeat(minmax(300px,300px))", gridAutoFlow: "column", paddingLeft: 20, paddingRight: 20, marginTop: 20 }}>
                                    {currentTemplate?.templateStages?.map((stage, index) => (
                                        <div style={{ alignItems: "center", textAlign: "center", height: "70vh", marginRight: 20 }} key={stage.id}>
                                            <div style={{ borderRadius: 15, alignItems: "end", alignContent: "end" }}>
                                                <p style={{ fontSize: 18, fontWeight: 600 }}>{stage?.name}</p>
                                            </div>
                                            <div style={{ backgroundColor: "#f3f1fa", marginTop: 20, height: "62vh", width: "280px", paddingTop: 15, overflowY: "scroll", scrollbarWidth: "none" }}>
                                                {currentTemplate?.products && currentTemplate?.products.map((product, index) => {
                                                    if (product.productStages[0].stageNum === stage.stageNum) {
                                                        return (
                                                            <div
                                                                style={{
                                                                    border: `2px solid ${getStatusTextAndColor(stage?.stageNum).borderColor}`,
                                                                    borderRadius: 5,
                                                                    backgroundColor: `${getStatusTextAndColor(stage?.stageNum).backgroundColor}`,
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
                                                                    <Popover placement={stage.stageNum === 5 ? "leftTop" : "rightTop"} content={() => <Content product={product} stage={stage} />} >
                                                                        <h3 style={{ color: `${getStatusTextAndColor(stage?.stageNum).color}`, fontWeight: "600", fontSize: 15, alignContent: "start" }}>Tên sản phẩm:<span style={{ color: `${getStatusTextAndColor(stage?.stageNum).color}`, }}> {product?.name}</span> </h3>
                                                                        <h3 style={{ color: `${getStatusTextAndColor(stage?.stageNum).color}`, fontWeight: "600", fontSize: 15, alignContent: "start" }}>Mã đơn hàng: {product?.orderId}</h3>
                                                                        <p style={{ color: `${getStatusTextAndColor(stage?.stageNum).color}` }}><ClockCircleOutlined style={{ color: `${getStatusTextAndColor(stage?.stageNum).color}` }} /> :{product.productStages[0]?.deadline ? product.productStages[0]?.deadline : "-"}</p>



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
