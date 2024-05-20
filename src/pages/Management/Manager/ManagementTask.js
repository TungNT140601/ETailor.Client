import React, { useState, useEffect } from 'react'
import {
    HomeOutlined,
    UserOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import { Typography, Table, Checkbox } from "antd";
import "./index.css";

import {
    Input,
    Select,
    Popover,
    Button,
} from "antd";
import Notask from "../../../assets/images/nodata.jpg";
import toast, { Toaster } from 'react-hot-toast';
import CircularProgress from "@mui/material/CircularProgress";
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import ManagerHeader from "../../../components/ManagerHeader/index.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from '@fortawesome/free-solid-svg-icons';
const { Search } = Input;
const { Title, Text } = Typography;
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

export default function ManagementTask() {

    const manager = JSON.parse(localStorage.getItem("manager"));
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
        const notify = (msg) => toast.success(msg, {
            duration: 4000,
            position: 'top-center',
            ariaProps: {
                role: 'status',
                'aria-live': 'polite',
            },
        })
        const handleDragEnd = async (result) => {
            console.log("RESULT", result)
            const { destination, source } = result
            // if (destination.dr)
            if (destination.droppableId === source.droppableId && destination.index === source.index) return;
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

        const handleAutoAssign = async () => {
            const autoAssignURL = `https://e-tailorapi.azurewebsites.net/api/test/RunAutoAssignTask`;
            const handleAutoAssignTaskForStaffs = async () => {
                const URL = `https://e-tailorapi.azurewebsites.net/api/test/AutoAssignTaskForStaff`;
                const response = await fetch(URL, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${manager?.token}`,
                    },

                })
                if (response.ok && response.status === 200) {
                    handleGetAllTasks();
                }
            }
            const handleAutoAssign = async () => {
                setLoading(true);
                try {
                    const response = await fetch(autoAssignURL, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${manager?.token}`,
                        },
                    });
                    if (response.ok && response.status === 200) {
                        const msg = await response.text();
                        notify("Tự động phân thành công!");
                        handleAutoAssignTaskForStaffs()

                    }
                } catch (error) {
                    console.error("Error calling API:", error);
                }

            }
            handleAutoAssign()
        }
        const content = (
            <div>
                <p>Content</p>
                <p>Content</p>
            </div>
        );
        return (
            <div style={{ height: "100%" }}>
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
                            <div style={{ width: 500, height: "82vh", borderRight: "1px solid #9F78FF" }}>
                                <div style={{ height: 60, borderBottom: "1px solid #9F78FF", alignItems: "end", alignContent: "end", width: "100%", paddingLeft: 20 }}>
                                    <h2 style={{ fontWeight: "bold", fontSize: "1.5rem", color: " #9F78FF", paddingBottom: 5 }}>Tất cả công việc</h2>
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
                                                <div style={{ width: "100%", paddingLeft: 15, borderRadius: 5, height: "100%", maxHeight: "70vh", fontStyle: "poppins", overflowY: "scroll", scrollbarWidth: "none" }}>
                                                    {unAssignedTasks?.data.length === 0 ? (
                                                        <div style={{ textAlign: "center", height: "60vh", position: "relative" }}>
                                                            <h2 style={{ position: "absolute", top: "20%", left: "50%", transform: "translate(-50%, -50%)" }}>Đã xử lý hết công việc</h2>
                                                            <img src={Notask} alt="No task" style={{ width: "100%", height: "100%", objectFit: "contain", marginTop: 20 }} />

                                                        </div>
                                                    ) : (
                                                        <div style={{ backgroundColor: "#f3f1fa", minHeight: 500, marginTop: 20, maxHeight: 600, overflowY: "scroll", scrollbarWidth: "none", }}>
                                                            {unAssignedTasks?.data.length > 0 && unAssignedTasks?.data.map((task, index) => (
                                                                <Popover content={content} title="Title" trigger="click">
                                                                    <Draggable key={task.id} draggableId={task.id} index={task?.index}>
                                                                        {(provided, snapshot) => (
                                                                            <div
                                                                                ref={provided.innerRef}
                                                                                {...provided.draggableProps}
                                                                                {...provided.dragHandleProps}
                                                                                style={{
                                                                                    position: "relative",
                                                                                    margin: "0 10px 8px 10px",
                                                                                    border: `2px solid ${getStatusTextAndColor(task?.status).borderColor}`,
                                                                                    borderRadius: 10,
                                                                                    backgroundColor: `${getStatusTextAndColor(task?.status).backgroundColor}`,
                                                                                    maxWidth: "320px",
                                                                                    marginTop: 10,
                                                                                    ...provided.draggableProps.style,
                                                                                    opacity: snapshot.isDragging ? 0.5 : 1,
                                                                                    padding: "3px 20px",
                                                                                    cursor: snapshot.isDragging ? "grabbing" : "grab",

                                                                                    "&:hover": {
                                                                                        opacity: 0.8,
                                                                                        color: "#ffffff",
                                                                                        backgroundColor: "#9F78FF",
                                                                                    }

                                                                                }}
                                                                            >
                                                                                <div>
                                                                                    <h3
                                                                                        style={{
                                                                                            color: `${getStatusTextAndColor(task?.status).color}`,
                                                                                            fontWeight: "bold",
                                                                                            overflow: "hidden",
                                                                                            whiteSpace: "nowrap",
                                                                                            textOverflow: "ellipsis",
                                                                                            maxWidth: "150px", // Adjust as needed
                                                                                        }}
                                                                                        title={task?.name}
                                                                                    >
                                                                                        {task?.name}+{task?.index}
                                                                                    </h3>
                                                                                    <p style={{ minHeight: "fit-content", color: `${getStatusTextAndColor(task?.status).color}` }}><ClockCircleOutlined style={{ color: `${getStatusTextAndColor(task?.status).color}` }} /> :{task?.plannedTime ? getHoursDifference(task.plannedTime) : "Không có thời hạn"}</p>
                                                                                </div>
                                                                                {snapshot.hover && <Popover content={content} title="Title" />}
                                                                            </div>
                                                                        )}
                                                                    </Draggable>

                                                                </Popover>
                                                            ))}
                                                        </div>
                                                    )}

                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                            </div>

                            <div style={{ height: "82vh", overflowX: "auto", overflowY: "hidden", scrollbarWidth: "thin", position: "relative" }}>
                                <div style={{ height: 60, borderBottom: "1px solid #9F78FF", alignItems: "end", alignContent: "end", width: "100vw", position: "fixed" }}> {/* Use 100vw instead of 100% */}
                                    <div style={{ display: "flex" }}>
                                        <div>
                                            <h2 style={{ fontWeight: "bold", fontSize: "1.5rem", color: "#9F78FF", paddingLeft: 20 }}>Tất cả nhân viên</h2>
                                        </div>
                                        <div style={{ display: "flex", paddingLeft: "5vw" }}>
                                            {[0, 1, 2, 3, 4].map(index => (
                                                <div key={index} style={{ display: "flex", alignItems: "center", marginRight: "10px" }}>
                                                    <button style={{ width: "2rem", height: "1rem", backgroundColor: getStatusTextAndColor(index).backgroundColor, borderRadius: 5, border: `1px solid ${getStatusTextAndColor(index).borderColor}` }}></button>
                                                    &nbsp;<p style={{ fontSize: 15, color: getStatusTextAndColor(index).color }}>{getStatusTextAndColor(index).text}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ paddingLeft: 16 }}>
                                            <Button onClick={() => handleAutoAssign()}><FontAwesomeIcon icon={faRotate} /></Button>
                                        </div>


                                    </div>

                                </div>
                                <div style={{ display: "grid", paddingTop: 60, paddingLeft: 10, gridTemplateColumns: " repeat(minmax(300px,300px))", gridAutoFlow: "column", marginTop: "20px" }}>


                                    {staffs?.data && staffs?.data.map((staff) => (
                                        <Droppable key={staff?.id} droppableId={staff?.id}>
                                            {(provided) => (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    style={{ border: "1px solid #9F78FF", borderRadius: "5px", marginRight: 20, height: "90%", width: "300px", }}
                                                >

                                                    <div style={{ color: "#000000", fontWeight: "600" }}>
                                                        <div style={{ width: "100%", borderRadius: 15, padding: "10px 15px 0 15px", height: "75vh", paddingLeft: 15, fontStyle: "poppins" }}>
                                                            <div style={{ background: "#ffffff", width: "90%", height: 40, alignContent: "center", alignItems: "center", display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f3f5fa" }}>
                                                                <h2 style={{ color: "#000000", maxHeight: 60, textOverflow: "ellipsis", overflow: "hidden", fontSize: "1 rem", fontWeight: 600 }}>{staff?.fullname}</h2>
                                                                <div style={{ display: "flex", justifyContent: "flex-end", color: "#000000", fontSize: "1rem", fontWeight: 600 }}>
                                                                    <h2>Tất cả<span style={{ width: "fit-content", padding: "2px 4px 2px 4px", marginLeft: 10, borderRadius: 2, border: "0.8px solid #f3f5fa" }}>{allTasks && allTasks.filter((task) => task?.staffMaker?.id === staff.id).length}</span></h2>
                                                                </div>
                                                            </div>
                                                            <div style={{ backgroundColor: "#f3f1fa", marginTop: 20, height: "55vh", alignItems: "center", paddingTop: 15, overflowY: "scroll", scrollbarWidth: "none" }}>
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
                                                                                    borderRadius: 10,
                                                                                    backgroundColor: `${getStatusTextAndColor(task?.status).backgroundColor}`,
                                                                                    maxWidth: "320px",
                                                                                    ...provided.draggableProps.style,
                                                                                    opacity: snapshot.isDragging ? 0.5 : 1,
                                                                                    padding: "3px 20px",
                                                                                    cursor: "pointer",
                                                                                    height: 58,
                                                                                    "&:hover": {
                                                                                        opacity: 0.8,
                                                                                        color: "#ffffff",
                                                                                        backgroundColor: "#9F78FF",
                                                                                    }

                                                                                }}
                                                                            >
                                                                                <div>

                                                                                    <h3 style={{
                                                                                        color: `${getStatusTextAndColor(task?.status).color}`,
                                                                                        fontWeight: "bold",
                                                                                        overflow: "hidden",
                                                                                        whiteSpace: "nowrap",
                                                                                        textOverflow: "ellipsis",
                                                                                        maxWidth: "150px",
                                                                                    }}> <span style={{ fontSize: 15 }}>{index + 1}. </span>{task?.name}</h3>
                                                                                    <p style={{ color: `${getStatusTextAndColor(task?.status).color}` }}><ClockCircleOutlined style={{ color: `${getStatusTextAndColor(task?.status).color}` }} /> :{task?.plannedTime ? getHoursDifference(task?.plannedTime) : "Không có thời hạn"}</p>

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

                    </div >
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
                <ManagerHeader
                    name={"Quản lý công việc của nhân viên"}
                    link={"#"}
                    iconHome={<HomeOutlined />}
                    iconRoute={<UserOutlined style={{ fontSize: 15 }} />}
                />
            </div>
            <div
                className="manager-task-content"
                style={{
                    height: "82vh",
                    border: "1px solid #9F78FF",
                }}
            >
                <ManagementTasksContent />
            </div>
        </div>
    )
}
