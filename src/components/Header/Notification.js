import React, { useState } from 'react'
import NotificationBell from "../../assets/images/notification.png";
import { App, Button, Space, Popover, Divider } from 'antd';
import './index.css'
import {
    CloseOutlined,
    DownOutlined,
} from '@ant-design/icons';




export default function Notification() {
    const [open, setOpen] = useState(false);
    const hide = () => {
        setOpen(false);
    };
    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };
    const NoticeInfo = () => {
        return (
            <div >
                <div style={{ width: "320px", borderLeft: "3px solid #bcdcfc", marginBottom: 10, paddingLeft: 20, alignItems: "center" }}>
                    <p style={{ fontWeight: "bold" }}>Đơn hàng của bạn đã được xác nhận</p>
                    <p>3 giờ trước</p>

                </div>
                <Divider style={{ margin: 0 }} />
                <div style={{ width: "320px", borderLeft: "3px solid green", marginTop: 10, marginBottom: 10, paddingLeft: 20, alignItems: "center" }}>
                    <p style={{ fontWeight: "bold" }}>Đơn hàng của bạn đã được hoàn thành</p>
                    <p>3 giờ trước</p>
                </div>
                <Divider style={{ margin: 0 }} />
                <div style={{ textAlign: "center", marginTop: 20 }}>
                    <p style={{ cursor: "pointer" }}>Xem thêm <DownOutlined /></p>
                </div>

            </div>
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
                            <p style={{ padding: "2px 10px 2px 10px", margin: 0, color: "#ffffff" }} >35</p>
                        </div>

                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", marginRight: 10 }}>
                        <CloseOutlined onClick={hide} />
                    </div>

                </div>
                <Divider style={{ margin: 10 }} />
                <div style={{ display: "flex" }}>
                    <div style={{ backgroundColor: "#9F78FF", minWidth: 20, marginRight: "10px", borderRadius: 5, textAlign: "center" }}>
                        <p style={{ padding: "2px 12px 2px 12px", margin: 0, color: "#ffffff" }} >Tất cả</p>
                    </div>
                    <div style={{ minWidth: 20, marginRight: "20px", borderRadius: 5, textAlign: "center" }}>
                        <p style={{ padding: "2px 10px 2px 10px", margin: 0 }} >Chưa đọc</p>
                    </div>

                </div>
                <Divider style={{ margin: 10 }} />
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
                <Button className="button is-rounded is-medium wrapper-shopping">
                    <img src={NotificationBell} width={18} height={18}></img>
                </Button>
            </Popover>
        </div >
    )
}
