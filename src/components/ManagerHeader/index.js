import React from "react";
import { Breadcrumb } from "antd";
import { NotificationOutlined } from "@ant-design/icons";
import { Typography, Badge, Popover } from "antd";

import { Avatar } from "antd";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const ManagerHeader = ({ name, link, iconHome, iconRoute }) => {
  const manager = JSON.parse(localStorage.getItem("manager"));
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
  const content = (
    <div>
      <p>Content</p>
      <p>Content</p>
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
          count={12}
          overflowCount={10}
          style={{ marginRight: 30 }}
          size="small"
        >
          <Popover content={content} title="Thông báo" trigger="click">
            <NotificationOutlined
              size="large"
              style={{ marginRight: 30, fontSize: 30 }}
            />
          </Popover>
        </Badge>
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

export default ManagerHeader;
