import React, { useEffect, useState } from 'react'
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend, ArcElement
} from 'chart.js';
import { RiseOutlined, FallOutlined, CalendarOutlined } from '@ant-design/icons';
import { DatePicker, Select, Space, Row, Col } from 'antd';
import 'dayjs/locale/vi';
import dayjs from 'dayjs';

dayjs.locale('vi_VN');
ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,

  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
  },
};
const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export default function ManagementDashboard() {
  const OrderStatistic = ({ searchMonth, searchYear }) => {
    const [orderStatistic, setOrderStatistic] = useState([]);

    useEffect(() => {
      const manager = JSON.parse(localStorage.getItem("manager"));
      const baseOrderStatisticURL = "https://e-tailorapi.azurewebsites.net/api/Dashboard/order-dashboard";
    
      const fetchOrderStatistic = async () => {
        let url = baseOrderStatisticURL;
    
        const params = new URLSearchParams();
        if (searchYear) params.append('year', searchYear);
        if (searchMonth) params.append('month', searchMonth);
        if (params.toString()) url += `?${params.toString()}`; // Append query parameters to the URL if any
    
        try {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${manager.token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setOrderStatistic(data);
            console.log("DTA:", data);
          }
        } catch (error) {
          console.log("Error:", error);
        }
      };
    
      fetchOrderStatistic();
    }, [searchMonth, searchYear]);
    
    return (


      <Bar data={{

        labels: labels,
        datasets: [
          {
            label: 'My   Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: 'rgb(255, 99, 132)',
          },
        ],
      }} options={options} />

    )
  }
  const OverAllStatistic = () => {

    return (
      <Row justify="space-between" style={{ backgroundColor: "unset", margin: 15 }}>
        <Col span={12}>
          <Row>
            <Col span={12} style={{ height: "230px" }}>
              <Col span={23} style={{ backgroundColor: "#ffffff", borderRadius: 10, height: "100%" }}>
                <div>
                  <h1 style={{ fontSize: 20, fontWeight: 600, color: "#727272", padding: 10 }}>Tổng số đơn hàng</h1>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 34, fontWeight: "bold", color: "#000000", margin: 0 }}>986</p>
                  <p style={{ fontSize: 24, fontWeight: 600, color: "green", margin: 0 }}><RiseOutlined /> 25%</p>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#c0c0c0", margin: 0 }}>so với 30 ngày trước</p>
                </div>
              </Col>
            </Col>
            <Col span={12} style={{ height: "230px" }}>

              <Col span={23} style={{ backgroundColor: "#ffffff", borderRadius: 10, height: "100%" }}>
                <div>
                  <h1 style={{ fontSize: 20, fontWeight: 600, color: "#727272", padding: 10 }}>Tổng doanh thu</h1>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 34, fontWeight: "bold", color: "#000000", margin: 0 }}>986</p>
                    <p style={{ fontSize: 24, fontWeight: 600, color: "red", margin: 0 }}><FallOutlined /> 25%</p>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#c0c0c0", margin: 0 }}>so với 30 ngày trước</p>
                  </div>
                </div>
              </Col>
            </Col>

          </Row>
          <Row justify="space-between" style={{ backgroundColor: "#fff", borderRadius: 10, marginTop: 15, marginRight: 13 }}>

            <OrderStatistic searchMonth={searchMonth} searchYear={searchYear} />

          </Row>
        </Col>
        <Col span={12}>
          <Row>
            <Col span={12} style={{ height: "230px" }}>
              <Col span={23} style={{ backgroundColor: "#ffffff", borderRadius: 10, height: "100%" }}>
                <div>
                  <h1 style={{ fontSize: 20, fontWeight: 600, color: "#727272", padding: 10 }}>Tổng số đơn hàng</h1>
                </div>
              </Col>
            </Col>
            <Col span={12} style={{ height: "230px" }}>
              <Col span={24} style={{ backgroundColor: "#ffffff", borderRadius: 10, height: "100%" }}>
                <div style={{ width: "100%", height: 200 }}>
                  <Pie options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                      title: {
                        display: true,
                        text: 'Biểu đồ tổng số đơn hàng',
                      },
                    }
                  }}
                    data={{
                      labels: ['Red', 'Blue', 'Yellow'],
                      datasets: [
                        {
                          label: '# of Votes',
                          data: [12, 19, 3],
                          backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                          ],
                          borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                          ],
                          borderWidth: 1,

                        },

                      ],
                    }}
                  />
                </div>
              </Col>
            </Col>
          </Row>
          <Row style={{ backgroundColor: "#fff", borderRadius: 10, marginTop: 15 }}>
            <Col span={24}>
              <OrderStatistic searchMonth={searchMonth} searchYear={searchYear} />
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
  const [searchMonth, setSearchMonth] = useState(new Date().getMonth())
  const handleChoseMonth = (value) => {
    setSearchMonth(value)
  }
  const [searchYear, setSearchYear] = useState(new Date().getFullYear())
  const handleChoseYear = (date, dateString) => {
    setSearchYear(dateString)
  }
  const StaffTaskStatistic = () => {
    return (
      <div style={{ width: "100%", height: 200, backgroundColor: "#fff", borderRadius: 10, border: "1px solid #9F78FF" }}>

      </div>
    )
  }
  const MaterialStatistic = () => {
    return (
      <div style={{ width: "100%", height: 200, backgroundColor: "#fff", borderRadius: 10, border: "1px solid #9F78FF" }}>

      </div>
    )
  }
  const disabledDate = (current) => {
    return current && current > dayjs().endOf('year');
  };
  return (
    <div style={{ width: "100%", height: "99vh", backgroundColor: "#f0f4f5", borderRadius: 10, border: "1px solid #9F78FF", overflowY: "scroll", scrollbarWidth: "none" }}>
      <div style={{ padding: "5px 20px" }}>
        <div style={{ paddingLeft: 20 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: "#3f4344" }}>Dashboard</h1>
        </div>

        <div style={{ display: "flex", margin: "5px 20px" }}>
          <Space direction="vertical" size={5}>
            <p style={{ fontSize: 15, fontWeight: 100, color: "#3f4344", paddingLeft: 5 }}>Chọn tháng</p>
            <Select
              defaultValue={dayjs().month() + 1}
              style={{ width: 200, height: 40 }}
              suffixIcon={<CalendarOutlined style={{ fontSize: 14 }} />}
              onChange={handleChoseMonth}
              options={[
                {
                  value: 1,
                  label: 'Tháng 1',
                  disabled: searchYear === dayjs().format('YYYY') && 1 > dayjs().month() + 1 ? true : false
                },
                {
                  value: 2,
                  label: 'Tháng 2',
                  disabled: searchYear === dayjs().format('YYYY') && 2 > dayjs().month() + 1 ? true : false

                },
                {
                  value: 3,
                  label: 'Tháng 3',
                  disabled: searchYear === dayjs().format('YYYY') && 3 > dayjs().month() + 1 ? true : false

                },
                {
                  value: 4,
                  label: 'Tháng 4',
                  disabled: searchYear === dayjs().format('YYYY') && 4 > dayjs().month() + 1 ? true : false

                },
                {
                  value: 5,
                  label: 'Tháng 5',
                  disabled: searchYear === dayjs().format('YYYY') && 5 > dayjs().month() + 1 ? true : false
                },
                {
                  value: 6,
                  label: 'Tháng 6',
                  disabled: searchYear === dayjs().format('YYYY') && 6 > dayjs().month() + 1 ? true : false
                },
                {
                  value: 7,
                  label: 'Tháng 7',
                  disabled: searchYear === dayjs().format('YYYY') && 7 > dayjs().month() + 1 ? true : false
                },
                {
                  value: 8,
                  label: 'Tháng 8',
                  disabled: searchYear === dayjs().format('YYYY') && 8 > dayjs().month() + 1 ? true : false
                },
                {
                  value: 9,
                  label: 'Tháng 9',
                  disabled: searchYear === dayjs().format('YYYY') && 9 > dayjs().month() + 1 ? true : false
                },
                {
                  value: 10,
                  label: 'Tháng 10',
                  disabled: searchYear === dayjs().format('YYYY') && 10 > dayjs().month() + 1 ? true : false
                },
                {
                  value: 11,
                  label: 'Tháng 11',
                  disabled: searchYear === dayjs().format('YYYY') && 11 > dayjs().month() + 1 ? true : false
                },
                {
                  value: 12,
                  label: 'Tháng 12',
                  disabled: searchYear === dayjs().format('YYYY') && 12 > dayjs().month() + 1 ? true : false
                },
              ]}
            />
          </Space>
          <Space direction="vertical" size={5} style={{ width: 200, marginLeft: 40 }}>
            <p style={{ fontSize: 15, fontWeight: 100, color: "#3f4344", paddingLeft: 5 }} >Chọn năm</p>
            <DatePicker
              picker='year'
              disabledDate={disabledDate}
              defaultValue={dayjs().startOf('year')}
              onChange={handleChoseYear}
              placeholder='Chọn năm'
              style={{ width: 200, height: 40 }} />
          </Space>

        </div>
        <div >
          <OverAllStatistic />
        </div>
        {/* <div style={{ marginTop: 20 }}>
          <OrderStatistic searchMonth={searchMonth} searchYear={searchYear} />
        </div> */}
        {/* <div>
          <StaffTaskStatistic />
        </div>
        <div>
          <MaterialStatistic />
        </div> */}
      </div>
    </div >
  )
}
