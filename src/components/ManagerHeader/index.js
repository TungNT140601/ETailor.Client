import React, { useEffect, useState } from "react";
import { Breadcrumb, notification } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { Typography, Badge, Popover, message, Spin, Alert } from "antd";

import { Avatar } from "antd";
import { Link } from "react-router-dom";
import { NotificationRealTime } from "../NotificationManager/NotificationRealTime";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const ManagerHeader = ({ name, link, iconHome, iconRoute }) => {
  const manager = JSON.parse(localStorage.getItem("manager"));
  const chatNotification = NotificationRealTime();
  const navigate = useNavigate();
  const { messageReturn, resetMessageReturn } = chatNotification;
  const [allNotification, setAllNotification] = useState(null);
  const [loadingNotification, setLoadingNotification] = useState(false);
  useEffect(() => {
    if (messageReturn) {
      message.info("Bạn có thông báo mới");
      fetchNotification();
    }
  }, [messageReturn]);
  console.log("manager", manager);

  const fetchNotification = async () => {
    const GET_NOTIFICATIONS = `https://e-tailorapi.azurewebsites.net/api/notification/get-notification`;
    try {
      const response = await fetch(GET_NOTIFICATIONS, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok && response.status === 200) {
        const data = await response.json();
        setAllNotification(data);
      } else if (response.status === 400 || response.status === 500) {
        const data = await response.text();
        message.error(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleReadNotification = async (id) => {
    setLoadingNotification(id);
    const GET_NOTIFICATIONS = `https://e-tailorapi.azurewebsites.net/api/notification/get-notification/${id}`;
    try {
      const response = await fetch(GET_NOTIFICATIONS, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${manager?.token}`,
        },
      });
      if (response.ok && response.status === 200) {
        message.success("Đã xem thông báo");
        navigate("/manager/orders");
        fetchNotification();
      } else if (response.status === 400 || response.status === 500) {
        const data = await response.text();
        message.error(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingNotification(null);
    }
  };
  useEffect(() => {
    const handleGetNotification = async () => {
      await fetchNotification();
    };
    handleGetNotification();
  }, []);
  const handleCheckRoute = (name, link, iconHome, iconRoute) => {
    return (
      <div>
        <Breadcrumb
          items={[
            {
              href: "/manager",
              title: iconHome,
            },
            {
              href: link,
              title: (
                <>
                  <Link to={link}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "#9F78FF",
                      }}
                    >
                      {iconRoute}
                      &nbsp;
                      {/* <span>Thông tin khách hàng</span> */}
                      <span>{name}</span>
                    </div>
                  </Link>
                </>
              ),
            },
          ]}
        />
        <Title level={4}>{name}</Title>
      </div>
    );
  };

  const calculateDifferenceDays = (sendTime) => {
    const firstDate = new Date(sendTime);
    const secondDate = new Date();

    const differenceBtwDates = secondDate.getTime() - firstDate.getTime();
    const minutesDiff = Math.floor(differenceBtwDates / (1000 * 60));

    if (minutesDiff <= 0) {
      return `0 phút trước`;
    } else if (minutesDiff < 60) {
      return `${minutesDiff} phút trước`;
    } else if (minutesDiff < 1440) {
      const hoursDiff = Math.floor(minutesDiff / 60);
      return `${hoursDiff} giờ trước`;
    } else {
      const daysDiff = Math.floor(minutesDiff / (24 * 60));
      return `${daysDiff} ngày trước`;
    }
  };
  const content = (
    <div style={{ width: 350, height: 350 }}>
      <div
        style={{
          height: "100%",
          overflowY: "scroll",
          scrollbarWidth: "none",
          WebkitScrollbar: "none",
        }}
      >
        {allNotification && (
          <div
            style={{
              marginTop: 5,
              marginBottom: 5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Title level={5}>
                Tất cả:{" "}
                <span style={{ color: "#9F78FF" }}>
                  {allNotification && allNotification?.data?.length}
                </span>
              </Title>
            </div>
            <div>
              <Title level={5}>
                Chưa đọc:{" "}
                <span style={{ color: "#9F78FF" }}>
                  {allNotification && allNotification?.unread}
                </span>
              </Title>
            </div>
          </div>
        )}

        {allNotification && allNotification?.data?.length > 0 ? (
          allNotification?.data?.map((notification) => (
            <div
              key={notification.id}
              style={{
                width: "100%",
                height: "auto",
                border: "1px solid #9F78FF",
                borderRadius: 10,
                padding: 10,
                marginBottom: 10,
                cursor: "pointer",
              }}
              onClick={() => handleReadNotification(notification.id)}
            >
              <Spin
                spinning={loadingNotification === notification.id}
                tip="Loading..."
                key={notification.id}
              >
                <>
                  <Title style={{ marginBottom: 4, fontSize: 15 }}>
                    {!notification.isRead && (
                      <Badge
                        status="processing"
                        style={{ marginRight: 5, fontSize: 18 }}
                      />
                    )}

                    {notification.title}
                  </Title>
                  <Text>{notification.content}</Text>
                  <br />
                  <Text>
                    Thời gian: {calculateDifferenceDays(notification.sendTime)}
                  </Text>
                </>
              </Spin>
            </div>
          ))
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Title level={5}>Bạn chưa có thông báo nào!</Title>
          </div>
        )}
      </div>
    </div>
  );
  const contentManager = (
    <div style={{ marginTop: 10 }}>
      <Link to={"/manager/manager-info"} style={{ color: "black" }}>
        <span>Thông tin cá nhân</span>
      </Link>
    </div>
  );
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {handleCheckRoute(name, link, iconHome, iconRoute)}
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Badge
          dot={messageReturn ? true : false}
          size="default"
          style={{ marginRight: 15 }}
        >
          <Popover content={content} title="Thông báo" trigger="click">
            <div
              style={{ cursor: "pointer" }}
              onClick={() => resetMessageReturn()}
            >
              <BellOutlined style={{ fontSize: 24, marginRight: 15 }} />{" "}
            </div>
          </Popover>
        </Badge>
        <div style={{ display: "flex", alignItems: "center" }}>
          {manager?.avatar ? (
            <Popover
              title={"Thông tin"}
              content={contentManager}
              trigger="click"
            >
              <Avatar src={manager?.avatar} />
            </Popover>
          ) : (
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
          )}
          &nbsp; &nbsp;
          <Popover title={"Thông tin"} content={contentManager} trigger="click">
            <Text style={{ fontSize: 18 }}>{manager?.name}</Text>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default ManagerHeader;
