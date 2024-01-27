import React, { useState } from "react";
import "./index.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Breadcrumb } from "antd";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Typography } from "antd";

import { Input } from "antd";
import { Divider } from "antd";
import { Table, Checkbox, Button } from "antd";
import { Image } from "antd";
import { useQuery } from "react-query";

const { Search } = Input;
const { Title, Text } = Typography;

const AccountSysHeader = () => {
  const admin = JSON.parse(localStorage.getItem("admin"));
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
              href: "/admin",
              title: <HomeOutlined />,
            },
            {
              href: "/admin",
              title: (
                <>
                  <UserOutlined />
                  <span>Khách hàng</span>
                </>
              ),
            },
          ]}
        />
        <Title level={4}>Khách hàng</Title>
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
          <UserOutlined
            style={{
              fontSize: "24px",
            }}
          />
          &nbsp; &nbsp;
          <Text>{admin.role}</Text>
        </div>
      </div>
    </div>
  );
};

const items = [
  {
    Id: 1,
    Name: "Lịch sử ra đời của tiệm may Tuệ",
    Description:
      "Gốc của tiệm may truyền thống này có thể được truy nguyên về thời kỳ trước công nghiệp hóa, khi nghệ thuật may mặc là sự kết hợp tinh tế giữa nghệ thuật và kỹ thuật. Gia đình của bạn, với đam mê và kỹ năng về may, quyết định mở cửa tiệm để cung cấp sản phẩm may mặc chất lượng cho cộng đồng địa phương.Đến những năm 2000, thách thức đầu tiên xuất hiện khi tiệm may phải đối mặt với sự cạnh tranh từ các nhãn hiệu lớn và sự gia tăng của sản xuất hàng loạt. Tuy nhiên, gia đình bạn đã nhìn nhận cơ hội từ sự thay đổi này. Việc tích hợp công nghệ và mở rộng qua mô hình kinh doanh trực tuyến giúp tiệm may tiếp cận thị trường rộng lớn hơn, thu hút đối tượng khách hàng mới và duy trì sự độc lập.Trong thập kỷ gần đây, tiệm may của gia đình bạn đã đặt sự chú trọng vào việc duy trì và nâng cao chất lượng sản phẩm. Sự độc đáo và cá nhân hóa trong từng sản phẩm là điểm mạnh khiến khách hàng đánh giá cao. Những bộ trang phục và sản phẩm may mặc không chỉ là đồ vật, mà còn là tác phẩm nghệ thuật, mang đậm tâm huyết và câu chuyện của gia đình bạn.Tiệm may không chỉ là nơi mua sắm, mà còn là một phần của cộng đồng. Gia đình bạn luôn nỗ lực duy trì mối liên kết với khách hàng cũ và thu hút khách hàng mới bằng cách tham gia các sự kiện cộng đồng, tổ chức các lớp học may và đồng thời hỗ trợ các hoạt động từ thiện. Sự gắn bó này làm cho tiệm may trở thành một điểm đến không chỉ để mua sắm mà còn để tìm kiếm sự chia sẻ và giao lưu.",
  },
  {
    Id: 1,
    Name: "Lịch sử ra đời của tiệm may Tuệ",
    Description:
      "Gốc của tiệm may truyền thống này có thể được truy nguyên về thời kỳ trước công nghiệp hóa, khi nghệ thuật may mặc là sự kết hợp tinh tế giữa nghệ thuật và kỹ thuật. Gia đình của bạn, với đam mê và kỹ năng về may, quyết định mở cửa tiệm để cung cấp sản phẩm may mặc chất lượng cho cộng đồng địa phương.Đến những năm 2000, thách thức đầu tiên xuất hiện khi tiệm may phải đối mặt với sự cạnh tranh từ các nhãn hiệu lớn và sự gia tăng của sản xuất hàng loạt. Tuy nhiên, gia đình bạn đã nhìn nhận cơ hội từ sự thay đổi này. Việc tích hợp công nghệ và mở rộng qua mô hình kinh doanh trực tuyến giúp tiệm may tiếp cận thị trường rộng lớn hơn, thu hút đối tượng khách hàng mới và duy trì sự độc lập.Trong thập kỷ gần đây, tiệm may của gia đình bạn đã đặt sự chú trọng vào việc duy trì và nâng cao chất lượng sản phẩm. Sự độc đáo và cá nhân hóa trong từng sản phẩm là điểm mạnh khiến khách hàng đánh giá cao. Những bộ trang phục và sản phẩm may mặc không chỉ là đồ vật, mà còn là tác phẩm nghệ thuật, mang đậm tâm huyết và câu chuyện của gia đình bạn.Tiệm may không chỉ là nơi mua sắm, mà còn là một phần của cộng đồng. Gia đình bạn luôn nỗ lực duy trì mối liên kết với khách hàng cũ và thu hút khách hàng mới bằng cách tham gia các sự kiện cộng đồng, tổ chức các lớp học may và đồng thời hỗ trợ các hoạt động từ thiện. Sự gắn bó này làm cho tiệm may trở thành một điểm đến không chỉ để mua sắm mà còn để tìm kiếm sự chia sẻ và giao lưu.",
  },
  {
    Id: 1,
    Name: "Lịch sử ra đời của tiệm may Tuệ",
    Description:
      "Gốc của tiệm may truyền thống này có thể được truy nguyên về thời kỳ trước công nghiệp hóa, khi nghệ thuật may mặc là sự kết hợp tinh tế giữa nghệ thuật và kỹ thuật. Gia đình của bạn, với đam mê và kỹ năng về may, quyết định mở cửa tiệm để cung cấp sản phẩm may mặc chất lượng cho cộng đồng địa phương.Đến những năm 2000, thách thức đầu tiên xuất hiện khi tiệm may phải đối mặt với sự cạnh tranh từ các nhãn hiệu lớn và sự gia tăng của sản xuất hàng loạt. Tuy nhiên, gia đình bạn đã nhìn nhận cơ hội từ sự thay đổi này. Việc tích hợp công nghệ và mở rộng qua mô hình kinh doanh trực tuyến giúp tiệm may tiếp cận thị trường rộng lớn hơn, thu hút đối tượng khách hàng mới và duy trì sự độc lập.Trong thập kỷ gần đây, tiệm may của gia đình bạn đã đặt sự chú trọng vào việc duy trì và nâng cao chất lượng sản phẩm. Sự độc đáo và cá nhân hóa trong từng sản phẩm là điểm mạnh khiến khách hàng đánh giá cao. Những bộ trang phục và sản phẩm may mặc không chỉ là đồ vật, mà còn là tác phẩm nghệ thuật, mang đậm tâm huyết và câu chuyện của gia đình bạn.Tiệm may không chỉ là nơi mua sắm, mà còn là một phần của cộng đồng. Gia đình bạn luôn nỗ lực duy trì mối liên kết với khách hàng cũ và thu hút khách hàng mới bằng cách tham gia các sự kiện cộng đồng, tổ chức các lớp học may và đồng thời hỗ trợ các hoạt động từ thiện. Sự gắn bó này làm cho tiệm may trở thành một điểm đến không chỉ để mua sắm mà còn để tìm kiếm sự chia sẻ và giao lưu.",
  },
];

const AccountSysContent = () => {
  return (
    <div className="table-container">
      <div>
        <div>
          <span
            className="icon-text"
            style={{
              height: "50px",
              display: "flex",
              alignItems: "center",
              paddingLeft: "10px",
            }}
          >
            <span className="icon" style={{ height: "50px" }}>
              <i className="fas fa-home" style={{ fontSize: "30px" }}></i>
            </span>
            &nbsp; &nbsp;
            <h3 className="title is-3">Câu hỏi chung ({items.length})</h3>
          </span>
        </div>
        <div>
          {items.map((item, index) => (
            <>
              <div style={{ marginTop: 20, paddingLeft: "10px" }}>
                <h4 className="title is-4">
                  {index}: {item.Name}
                </h4>
                <p>{item.Description}</p>
                <div className="buttons mt-5">
                  <button className="button is-danger">Xóa câu hỏi</button>
                  <button className="button is-warning">
                    Chỉnh sửa câu hỏi
                  </button>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SystemConfig = () => {
  return (
    <>
      <AccountSysHeader />
      <Divider />
      <div className="admin-account-system-content">
        <AccountSysContent />
      </div>
    </>
  );
};
