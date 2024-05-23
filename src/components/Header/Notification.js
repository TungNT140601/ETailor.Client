import React, { useEffect, useState } from 'react'
import NotificationBell from "../../assets/images/notification.png";
import { App, Button, Space, Popover, Divider, Modal, Badge, notification } from 'antd';
import './index.css'
import {
    CloseOutlined,
    DownOutlined,
} from '@ant-design/icons';
import { NotificationRealTime } from './NoticRealTime';
import toast, { Toaster } from 'react-hot-toast';

function getHoursDifference(startDate) {
    const currentDateUTC = new Date();
    // const currentDateUTC7 = new Date(currentDateUTC.getTime() + (7 * 60 * 60 * 1000));

    const startMillis = startDate.getTime();
    const currentMillisUTC7 = currentDateUTC.getTime();

    const millisDiff = currentMillisUTC7 - startMillis;
    console.log('**********************************')
    console.log("currentDateUTC7", startMillis)
    console.log("startDate", currentMillisUTC7)
    const hoursDiff = millisDiff / (1000 * 60 * 60);

    return hoursDiff < 1 ? `${Math.floor(hoursDiff * 60)} phút trước` : hoursDiff < 24 ? `${Math.floor(hoursDiff)} giờ trước` : `${Math.floor(hoursDiff / 24)} ngày trước`;
}

export default function Notification() {
    const chatNotification = NotificationRealTime();
    useEffect(() => {
        const noticToast = async () => {
            console.log("CÓ TÔNG BSO")
            toast('Bạn có 1 thông báo mới', {
                duration: 4000,
                position: 'top-center',
                style: { zIndex: 1000001 },
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
            });
        }
        if (chatNotification) {
            console.log("Notification", chatNotification);
            noticToast()
        }
    }, [chatNotification]);

    const [open, setOpen] = useState(false);
    const [allNotification, setAllNotification] = useState('')
    const hide = () => {
        setOpen(false);
    };

    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
            const customer = JSON.parse(localStorage.getItem("customer"));
            const token = customer?.token;
            const GET_NOTIFICATIONS = `https://e-tailorapi.azurewebsites.net/api/notification/read-all-notification`
            try {
                const response = fetch(GET_NOTIFICATIONS, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    fetchNotifications()
                }

            } catch (error) {
                console.error("Error:", error);
            }
        }

    };
    const [customer, setCustomer] = useState()
    const [unreadCount, setUnreadCount] = useState(0)

    const fetchNotifications = async () => {
        const customer = JSON.parse(localStorage.getItem("customer"));
        const token = customer?.token;
        const GET_NOTIFICATIONS = `https://e-tailorapi.azurewebsites.net/api/notification/get-notification`
        try {
            const response = await fetch(GET_NOTIFICATIONS, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json()
                setAllNotification(data)
                console.log("allNotification", data)
                setUnreadCount(data.unread)
            }

        }
        catch (error) {
            console.error("Error:", error);
        }
    }

    useEffect(() => {
        fetchNotifications()
    }, [chatNotification])
    useEffect(() => {
        const customer = JSON.parse(localStorage.getItem("customer"));
        setCustomer(customer)
        fetchNotifications()
    }, [])

    const NoticeInfo = () => {
        return (
            <>
                {customer ? (
                    <div style={{ maxHeight: 400, overflowY: "scroll" }}>
                        {allNotification?.data.length > 0 ? allNotification?.data.map((notification, index) => (
                            <>

                                <>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} key={index}>
                                        <div style={{ height: "100%", borderLeft: `${notification.isRead ? "3px solid #bcdcfc" : "3px solid #9F78FF"}`, margin: 10, paddingLeft: 20, alignItems: "center", width: "100%" }}>
                                            <p style={{ fontWeight: "bold", color: `${notification.isRead ? "#Acacac" : "black"}` }}> {notification.title} </p>
                                            <p style={{ width: 300, padding: "5 0 0 5", fontWeight: 400, color: `${notification.isRead ? "#Acacac" : "black"}` }}>
                                                {notification.content}
                                                <span style={{ fontWeight: 400, color: `${notification.isRead ? "#Acacac" : "black"}` }}>
                                                    &nbsp;&nbsp;.&nbsp;{getHoursDifference(new Date(notification?.sendTime))}
                                                </span>
                                            </p>

                                        </div>
                                        {notification.isRead ? null : (
                                            <p style={{ fontSize: 50, color: "#9F78FF", paddingRight: 20 }}>&#x2022;</p>
                                        )}
                                    </div >
                                    <Divider style={{ margin: 0, }} />
                                </>

                            </>
                        )) : (
                            <p>Không có thông báo nào</p>

                        )
                        }

                    </div >
                ) : (
                    <p>Bạn cần đăng nhập để xem thông báo</p>
                )
                }

                {/* <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Modal> */}
            </>
        )
    }
    const NoticeTitle = () => {
        return (
            <>
                {/* <ConfigProvider
                    button={{
                        style: {
                            width: buttonWidth,
                            margin: 4,
                        },
                    }}
                > */}
                <div style={{ display: "flex", justifyContent: "space-between", width: 350 }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <p style={{ fontWeight: "bold", fontSize: 20, marginRight: 15, marginLeft: 10 }}>Tất cả thông báo</p>

                        <div style={{ backgroundColor: "#9F78FF", minWidth: 20, borderRadius: 5, textAlign: "center" }}>
                            <p style={{ padding: "2px 10px 2px 10px", margin: 0, color: "#ffffff" }} >{allNotification?.data.length}</p>
                        </div>

                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", marginRight: 10 }}>
                        <CloseOutlined onClick={hide} />
                    </div>

                </div>

                {/* </ConfigProvider> */}
            </>
        )
    }

    return (
        <div>
            <Popover
                content={NoticeInfo}
                title={NoticeTitle}
                trigger="click"
                open={open}
                style={{ position: 'relative', backgroundColor: "#000000" }}
                className='notification-popover'
                onOpenChange={handleOpenChange}
            >
                <Badge count={unreadCount} showZero>
                    <Button className="wrapper-shopping">
                        <img src={NotificationBell} width={22} height={22}></img>
                    </Button>
                </Badge>
            </Popover>

            <Toaster />
        </div >
    )
}
