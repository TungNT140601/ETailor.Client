import React from "react";
import { Breadcrumb } from "antd";

import { Typography } from "antd";

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
