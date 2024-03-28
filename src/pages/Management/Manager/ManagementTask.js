import React, { useState, useEffect } from 'react'
import {
    HomeOutlined,
    UserOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    LoadingOutlined,
    ClockCircleOutlined
} from "@ant-design/icons";
import { Typography, Table, Checkbox } from "antd";
import "./index.css";

import {
    Avatar,
    Col,
    Row,
    InputNumber,
    Image,
    Button,
    Input,
    Divider,
    Select,
    Breadcrumb,
    Popover
} from "antd";
import Notask from "../../../assets/images/nodata.jpg";
import toast, { Toaster } from 'react-hot-toast';
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useQuery } from "react-query";
import CircularProgress from "@mui/material/CircularProgress";
import { render } from '@testing-library/react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

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
export default function ManagementTask() {

    const manager = JSON.parse(localStorage.getItem("manager"));
    const ManagementStaffHeader = () => {
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
                    <Title level={4}>Quản lý công việc</Title>
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
        const [unAssignedTasks, setUnAssignedTasks] = useState({
            id: "unAssignedTasks",
            data: []

        });
        const getAllTasksUrl = "https://e-tailorapi.azurewebsites.net/api/task/manager/get-all";
        const [allTasks, setAllTasks] = useState('');
        const [loading, setLoading] = useState(false);
        const manager = JSON.parse(localStorage.getItem("manager"));
        console.log("unAssignedTasks", unAssignedTasks)
        const handleGetAllTasks = async () => {
            setLoading(true);
            try {
                const response = await fetch(getAllTasksUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${manager?.token}`,
                    },
                });
                if (response.ok && response.status === 200) {
                    const responseData = await response.json();
                    setLoading(false);
                    setAllTasks(responseData);
                    const filteredTasks = responseData.filter((task) => task.staffMakerId === null);
                    setUnAssignedTasks({
                        ...unAssignedTasks,
                        data: filteredTasks
                    });
                    console.log("ALL TASKS", (responseData));
                }
            } catch (error) {
                console.error("Error calling API:", error);
            }
        };
        const getStaffUrl = "https://e-tailorapi.azurewebsites.net/api/staff";
        const [staffs, setStaffs] = useState([]);

        const handleDataStaff = async () => {
            setLoading(true);
            try {
                const response = await fetch(getStaffUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${manager?.token}`,
                    },
                });
                if (response.ok && response.status === 200) {
                    const responseData = await response.json();
                    setLoading(false);
                    setStaffs(responseData);

                    console.log("STAFFS", (responseData.data));
                }
            } catch (error) {
                console.error("Error calling API:", error);
            }
        };
        useEffect(() => {
            handleGetAllTasks();
            handleDataStaff();
        }, []);
        const notify = (msg) => toast(msg, {
            duration: 4000,
            position: 'top-center',
            style: {},
            className: '',
            icon: '👏',
            iconTheme: {
                primary: '#000',
                secondary: '#fff',
            },
            ariaProps: {
                role: 'status',
                'aria-live': 'polite',
            },
        })
        const handleDragEnd = async (result) => {
            console.log("RESULT", result)
            if (!result.destination) return;
            const DndTaskURL = `https://e-tailorapi.azurewebsites.net/api/task/swap-task/${result.draggableId}?staffId=${result.destination.droppableId}&index=${result.destination.index}`;
            const handleDndTask = async () => {
                setLoading(true);
                try {
                    const response = await fetch(DndTaskURL, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${manager?.token}`,
                        },
                    });
                    if (response.ok && response.status === 200) {
                        const msg = await response.text();
                        notify(msg);
                        handleGetAllTasks();
                    }
                } catch (error) {
                    console.error("Error calling API:", error);
                }

            }
            handleDndTask()
        }
        const content = (
            <div>
                <p>Content</p>
                <p>Content</p>
            </div>
        );
        return (
            <div >
                <Toaster />
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
                    <div style={{ display: "flex" }}>

                        <DragDropContext onDragEnd={handleDragEnd}>
                            <div style={{ marginRight: 20, height: "82.2vh", width: 500, borderRight: "1px solid #9F78FF" }}>
                                <div style={{ height: 60, borderBottom: "1px solid #9F78FF", alignItems: "end", alignContent: "end", paddingLeft: 20 }}>
                                    <h2 style={{ fontWeight: "bold", fontSize: "1.6rem", color: " #9F78FF", paddingBottom: 5 }}>Tất cả</h2>
                                </div>
                                <Droppable key={unAssignedTasks?.id} droppableId={unAssignedTasks?.id}>
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            style={{ marginRight: 20, height: "90%", width: "300px", }}
                                        >
                                            {provided.placeholder}
                                            <div style={{ color: "#000000", fontWeight: "600" }}>
                                                <div style={{ width: "100%", paddingLeft: 15, borderRadius: 5, height: "600px", fontStyle: "poppins" }}>
                                                    {unAssignedTasks?.data.length === 0 && (
                                                        <div style={{ textAlign: "center", height: "100%", position: "relative" }}>
                                                            <img src={Notask} alt="No task" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                                            <h2 style={{ position: "absolute", top: "80%", left: "50%", transform: "translate(-50%, -50%)" }}>Không có công việc</h2>
                                                        </div>
                                                    )}
                                                    <div style={{ backgroundColor: "f8f4fc", marginTop: 20, maxHeight: 600, overflowY: "scroll", scrollbarWidth: "none", }}>
                                                        {unAssignedTasks?.data.length > 0 && unAssignedTasks?.data.map((task, index) => (
                                                            <Popover content={content} title="Title" trigger="click">
                                                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                                                    {(provided, snapshot) => (
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            style={{
                                                                                position: "relative",
                                                                                margin: "0 10px 8px 10px",
                                                                                border: `2px solid ${getStatusTextAndColor(task?.status).borderColor}`,
                                                                                borderRadius: "5px",
                                                                                backgroundColor: snapshot.isDragging ? "#9F78FF" : `${getStatusTextAndColor(task?.status).backgroundColor}`,
                                                                                maxWidth: "320px",
                                                                                textAlign: "center",
                                                                                ...provided.draggableProps.style,
                                                                                opacity: snapshot.isDragging ? 0.5 : 1,
                                                                                cursor: "pointer",
                                                                                "&:hover": {
                                                                                    opacity: 0.8,
                                                                                    color: "#ffffff",
                                                                                    backgroundColor: "#9F78FF",
                                                                                }
                                                                            }}
                                                                        >
                                                                            <h3 style={{ color: `${getStatusTextAndColor(task?.status).color}`, fontWeight: "bold" }}>{task?.name}</h3>
                                                                            <p style={{ color: `${getStatusTextAndColor(task?.status).color}` }}>{task?.deadline ? task?.deadline : "-"}</p>

                                                                            {snapshot.hover && <Popover content={content} title="Title" />}
                                                                        </div>
                                                                    )}
                                                                </Draggable>

                                                            </Popover>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                            </div>

                            <div style={{ padding: 50, textAlign: "center", position: "fixed", left: "60%" }}>
                                <h2 style={{ fontWeight: "bold", fontSize: "1.5rem", color: " #9F78FF" }}>Đã phân việc</h2>
                            </div>
                            <div style={{ overflowX: "auto", whiteSpace: "nowrap", scrollbarWidth: "thin" }}>

                                <div style={{ display: "grid", gridTemplateColumns: " repeat(minmax(300px,300px))", gridAutoFlow: "column", marginTop: "100px" }}>


                                    {staffs?.data && staffs?.data.map((staff) => (
                                        <Droppable key={staff?.id} droppableId={staff?.id}>
                                            {(provided) => (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    style={{ border: "1px solid #9F78FF", borderRadius: "5px", marginRight: 20, height: "90%", width: "300px", }}
                                                >

                                                    <div style={{ color: "#000000", fontWeight: "600" }}>
                                                        <div style={{ width: "100%", borderRadius: 15, padding: "10px 15px 0 15px", height: "600px", fontStyle: "poppins" }}>
                                                            <div style={{ background: "#ffffff", width: "90%", height: 40, alignContent: "center", alignItems: "center", display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f3f5fa" }}>
                                                                <h2 style={{ color: "#000000", maxHeight: 90, textOverflow: "ellipsis", overflow: "hidden", fontSize: "1 rem", fontWeight: 600 }}>{staff?.fullname}</h2>
                                                                <div style={{ display: "flex", justifyContent: "flex-end", color: "#000000", fontSize: "1rem", fontWeight: 600 }}>
                                                                    <h2>Số lượng việc<span style={{ width: "fit-content", padding: "2px 4px 2px 4px", marginLeft: 10, borderRadius: 2, border: "0.5px solid #f3f5fa" }}>{allTasks && allTasks.filter((task) => task?.staffMaker?.id === staff.id).length}</span></h2>
                                                                </div>
                                                            </div>
                                                            <div style={{ backgroundColor: "#f3f1fa", marginTop: 20, height: 450, alignItems: "center", paddingTop: 15, overflowY: "scroll", scrollbarWidth: "none" }}>
                                                                {allTasks && allTasks.filter((task) => task?.staffMaker?.id === staff.id).map((task, index) => (
                                                                    <Draggable key={task.id} draggableId={task.id} index={task?.index}>
                                                                        {(provided, snapshot) => (
                                                                            <div
                                                                                ref={provided.innerRef}
                                                                                {...provided.draggableProps}
                                                                                {...provided.dragHandleProps}
                                                                                style={{
                                                                                    margin: "0 10px 8px 10px",
                                                                                    border: `2px solid ${getStatusTextAndColor(task?.status).borderColor}`,
                                                                                    borderRadius: "15px",
                                                                                    backgroundColor: `${getStatusTextAndColor(task?.status).backgroundColor}`,
                                                                                    maxWidth: "320px",
                                                                                    ...provided.draggableProps.style,
                                                                                    opacity: snapshot.isDragging ? 0.5 : 1,
                                                                                    padding: "5px 10px",
                                                                                    cursor: "pointer",

                                                                                    "&:hover": {
                                                                                        opacity: 0.8,
                                                                                        color: "#ffffff",
                                                                                        backgroundColor: "#9F78FF",
                                                                                    }

                                                                                }}
                                                                            >
                                                                                <div>

                                                                                    <h3 style={{ color: `${getStatusTextAndColor(task?.status).color}`, fontWeight: "600" }}> <span style={{ fontSize: 15 }}>{index + 1}. </span>{task?.name}</h3>
                                                                                    <p style={{ color: `${getStatusTextAndColor(task?.status).color}` }}><ClockCircleOutlined style={{ color: `${getStatusTextAndColor(task?.status).color}` }} /> :{task?.deadline ? task?.deadline : "-"}</p>

                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </Draggable>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </Droppable>
                                    ))}
                                </div>
                            </div>
                        </DragDropContext>

                    </div>
                )
                }
            </div >
        );
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
                <ManagementStaffHeader />
            </div>
            <div
                className="manager-task-content"
                style={{
                    height: "83vh",
                    overflowY: "scroll",
                    border: "1px solid #9F78FF",
                }}
            >
                <ManagementTasksContent />
            </div>
        </div>
    )
}
