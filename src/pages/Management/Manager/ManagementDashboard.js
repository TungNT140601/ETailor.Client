import React, { useEffect, useState } from 'react'
import { Bar, Pie, Line } from 'react-chartjs-2';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRankingStar } from "@fortawesome/free-solid-svg-icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend, ArcElement
} from 'chart.js';
import { RiseOutlined, FallOutlined, CalendarOutlined } from '@ant-design/icons';
import { DatePicker, Select, Space, Row, Col, Spin } from 'antd';
import 'dayjs/locale/vi';
import dayjs from 'dayjs';
import FormatVNCurrency from '../../utils/FormatVNCurrency'

dayjs.locale('vi_VN');
ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
const getStatusTextAndColor = (status) => {
  let color;
  let text;
  switch (status) {
    case 0:
      color = "red";
      text = "Đã huỷ";
    case 1:
      color = "geekblue";
      text = "Chờ duyệt";
      break;
    case 2:
      color = "geekblue";
      text = "Đã duyệt";
      break;
    case 3:
      color = "volcano";
      text = "Chưa bắt đầu";
      break;
    case 4:
      color = "volcano";
      text = "Đang xử lý";
      break;
    case 5:
      color = "green";
      text = "Hoàn thiện";
      break;
    case 6:
      color = "green";
      text = "Kiểm thử";
      break;
    case 7:
      color = "green";
      text = "Hoàn tất & nhận hàng";
      break;
  }
  return { color, text };
};

export default function ManagementDashboard() {
  const OrderStatistic = ({ searchMonth, searchYear, lineChart, barChart }) => {
    const [totalOrdersByYear, setTotalOrdersByYear] = useState([]);
    const [totalCancelOrdersByYear, setTotalCancelOrdersByYear] = useState([]);
    const [revenueRateByYear, setRevenueRateByYear] = useState([]);
    useEffect(() => {
      const manager = JSON.parse(localStorage.getItem("manager"));
      const GET_ORDER_STATISTIC_BY_YEAR = `https://e-tailorapi.azurewebsites.net/api/Dashboard/order-dashboard-by-year?year=${searchYear}`;

      const fetchOrderStatistic = async () => {
        try {
          const response = await fetch(GET_ORDER_STATISTIC_BY_YEAR, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${manager.token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            const totalOrders = []
            const totalCancelOrders = []
            data.forEach(element => {
              revenueRateByYear.push(element.orderDone.totalPrice)
            })
            data.forEach(element => {
              totalOrders.push(element.orderDone.total)
              totalCancelOrders.push(element.orderCancel.total)
            });
            setTotalOrdersByYear(totalOrders)
            setTotalCancelOrdersByYear(totalCancelOrders)
            console.log("BY year data", totalOrders)
          }
        } catch (error) {
          console.log("Error:", error);
        }
      };

      fetchOrderStatistic();
    }, [searchYear]);
    const options = {
      responsive: true,
      width: "800px",
      height: "400px",
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `Thống kê đơn hàng theo năm ${searchYear}`,
        },
      },
    };
    const labels = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

    return (
      barChart && !lineChart ? (
        <Bar data={{
          labels: labels,
          datasets: [
            {
              label: 'Đơn hàng hoàn thành ',
              data: totalOrdersByYear,
              backgroundColor: '#389e0d',
            },
            {
              label: 'Đơn hàng bị huỷ ',
              data: totalCancelOrdersByYear,
              backgroundColor: 'rgb(255, 99, 132)',
            }
          ],
        }} options={options} />
      ) : (
        <Line
          options={{
            responsive: true,
            width: "580px",
            height: "400px",
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,

                text: `Thống kê doanh thu theo năm ${searchYear}`,
              },
            },
          }}

          data={{
            labels: labels,
            datasets: [
              {
                fill: true,
                label: `Doanh thu (vnđ)`,
                data: [revenueRateByYear[0], revenueRateByYear[1], revenueRateByYear[2], revenueRateByYear[3], revenueRateByYear[4], revenueRateByYear[5], revenueRateByYear[6], revenueRateByYear[7], revenueRateByYear[8], revenueRateByYear[9], revenueRateByYear[10], revenueRateByYear[11]],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
              },
            ],
          }} />
      )


    )
  }
  const OverAllStatistic = () => {

    const [orderStatistic, setOrderStatistic] = useState([]);
    const [totalForStatus0, setTotalForStatus0] = useState(0);
    const [totalForStatus7, setTotalForStatus7] = useState(0);
    const [totalForOtherStatuses, setTotalForOtherStatuses] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalOrderRate, setTotalOrderRate] = useState("");
    const [totalRevenueRate, setTotalRevenueRate] = useState("");
    const [revenueLoading, setRevenueLoading] = useState(false)
    const [orderLoading, setOrderLoading] = useState(false)
    useEffect(() => {
      const manager = JSON.parse(localStorage.getItem("manager"));
      const baseOrderStatisticURL = "https://e-tailorapi.azurewebsites.net/api/Dashboard/order-dashboard";
      const fetchOrderStatistic = async () => {
        let url = baseOrderStatisticURL;
        const params = new URLSearchParams();
        if (searchYear) params.append('year', searchYear);
        if (searchMonth) params.append('month', searchMonth);
        if (params.toString()) url += `?${params.toString()}`;
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
            const totalForStatus0 = data.find(stat => stat.status === 0)?.total;
            const totalForStatus7 = data.find(stat => stat.status === 7)?.total;
            const totalRevenue = data.find(stat => stat.status === 7)?.totalPrice;
            const otherStatusTotals = data
              .filter(stat => stat.status !== 0 && stat.status !== 7)
              .map(stat => stat.total);

            const sumOfOtherStatuses = otherStatusTotals.reduce((acc, curr) => acc + curr, 0);
            const sumofAllOrders = data.map(stat => stat.total).reduce((acc, curr) => acc + curr, 0);
            setTotalOrders(sumofAllOrders)
            setTotalForOtherStatuses(sumOfOtherStatuses);
            setTotalRevenue(totalRevenue);
            setTotalForStatus0(totalForStatus0);
            setTotalForStatus7(totalForStatus7);

          }
        } catch (error) {
          console.log("Error:", error);
        }
      };

      const fetchTotalOrderRate = async () => {
        setOrderLoading(true)
        const GET_TOTAL_ORDER_RATE = `https://e-tailorapi.azurewebsites.net/api/Dashboard/order-rate-dashboard?year=${searchYear}&month=${searchMonth}`;
        try {
          const response = await fetch(GET_TOTAL_ORDER_RATE, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${manager.token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            console.log("total order rate", data);
            setOrderLoading(false)
            setTotalOrderRate(data);
          }
        } catch (error) {
          setOrderLoading(false)
          console.log("Error:", error);
        }
      }

      const fetchRevenueRate = async () => {
        setRevenueLoading(true)
        const GET_REVENUE_RATE = `https://e-tailorapi.azurewebsites.net/api/Dashboard/order-price-rate-dashboard?year=${searchYear}&month=${searchMonth}`;
        try {
          const response = await fetch(GET_REVENUE_RATE, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${manager.token}`,
            },
          });
          if (response.ok) {
            setRevenueLoading(false)
            const data = await response.json();
            console.log("revenue rate", data);
            setTotalRevenueRate(data);
          }
        } catch (error) {
          console.log("Error:", error);
        }
      }

      fetchOrderStatistic();
      fetchRevenueRate();
      fetchTotalOrderRate();
    }, [searchMonth, searchYear]);
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
                  {orderLoading ? <Spin size="large" color="#9F78FF" style={{ paddingTop: 40 }} /> : (
                    <>
                      <p style={{ fontSize: 34, fontWeight: "bold", color: "#000000", margin: 0 }}>{totalForStatus7}</p>
                      <p style={{ fontSize: 24, fontWeight: 600, color: totalOrderRate.increase ? "green" : "red", margin: 0 }}>
                        {totalOrderRate.increase ? <RiseOutlined /> : <FallOutlined />} {totalOrderRate.rate}%
                      </p>
                      <p style={{ fontSize: 15, fontWeight: 600, color: "#c0c0c0", margin: 0 }}>so với tháng trước</p>
                    </>
                  )}

                </div>
              </Col>
            </Col>
            <Col span={12} style={{ height: "230px" }}>

              <Col span={23} style={{ backgroundColor: "#ffffff", borderRadius: 10, height: "100%" }}>
                <div>
                  <h1 style={{ fontSize: 20, fontWeight: 600, color: "#727272", padding: 10 }}>Tổng doanh thu</h1>
                  <div style={{ textAlign: "center" }}>
                    {revenueLoading ? <Spin size="large" color="#9F78FF" style={{ paddingTop: 40 }} /> : (
                      <>
                        <p style={{ fontSize: 34, fontWeight: "bold", color: "#000000", margin: 0 }}>{totalRevenue ? FormatVNCurrency(totalRevenue) : 0}</p>

                        <p style={{ fontSize: 24, fontWeight: 600, color: totalRevenueRate.increase ? "green" : "red", margin: 0 }}>
                          {totalRevenueRate.increase ? <RiseOutlined /> : <FallOutlined />} {totalRevenueRate.rate}%
                        </p>
                        <p style={{ fontSize: 15, fontWeight: 600, color: "#c0c0c0", margin: 0 }}>so với tháng trước</p>
                      </>
                    )}

                  </div>
                </div>
              </Col>
            </Col>

          </Row>
          <Row style={{ backgroundColor: "#fff", borderRadius: 10, marginTop: 15, marginRight: 15 }}>
            <Col span={23} style={{ height: 400 }}>
              <OrderStatistic searchMonth={searchMonth} searchYear={searchYear} barChart={true} lineChart={false} />
            </Col>


          </Row>
        </Col>
        <Col span={12}>
          <Row>
            <Col span={24} style={{ height: "230px", backgroundColor: "#ffffff", borderRadius: 10 }}>

              <div style={{ width: "100%", height: 200 }}>
                <Pie options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                    title: {
                      display: true,
                      text: `Biểu đồ tổng số đơn hàng ${searchMonth}/${searchYear}`,
                    },
                  }
                }}

                  data={{
                    labels: ['Đã huỷ', 'Hoàn thiện', 'Đang thực hiện'],
                    datasets: [
                      {
                        label: 'Số lượng',
                        data: [totalForStatus0, totalForStatus7, totalForOtherStatuses],
                        backgroundColor: [
                          'rgba(255, 99, 132, 0.2)',
                          '#f6ffed',
                          'rgba(255, 206, 86, 0.2)',
                        ],
                        borderColor: [
                          'rgba(255, 99, 132, 1)',
                          '#389e0d',
                          'rgba(255, 206, 86, 1)',
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              </div>
            </Col>
          </Row>
          <Row style={{ backgroundColor: "#fff", borderRadius: 10, marginTop: 15, width: "620px", height: "400px" }}>

            <OrderStatistic searchMonth={searchMonth} searchYear={searchYear} barChart={false} lineChart={true} />


          </Row>
        </Col>
      </Row>
    )
  }
  const [searchMonth, setSearchMonth] = useState(new Date().getMonth() + 1)
  console.log("searchMonth", searchMonth)
  const handleChoseMonth = (value) => {
    setSearchMonth(value)
  }
  const [searchYear, setSearchYear] = useState(new Date().getFullYear())
  console.log("search year", searchYear)
  const handleChoseYear = (date, dateString) => {
    setSearchYear(dateString)
  }
  const StaffTaskStatistic = () => {
    return (
      <div style={{ width: "100%", height: 200, backgroundColor: "#fff", borderRadius: 10, border: "1px solid #9F78FF" }}>

      </div>
    )
  }
  const MaterialStatistic = ({ searchMonth, searchYear }) => {
    const [fabricLoading, setFabricLoading] = useState(false)
    const [materialStatistic, setMaterialStatistic] = useState([]);
    const [fabricName, setFabricName] = useState([]);
    const [commonTemplate, setCommonTemplate] = useState([])
    const [commonTemplateLoading, setCommonTemplateLoading] = useState(false)
    useEffect(() => {
      const fetchMaterialStatistic = async () => {
        setFabricLoading(true)
        const manager = JSON.parse(localStorage.getItem("manager"));
        const GET_MATERIAL_STATISTIC = `https://e-tailorapi.azurewebsites.net/api/Dashboard/fabric-material-common-used?year=${searchYear}&month=${searchMonth}`;
        try {
          const response = await fetch(GET_MATERIAL_STATISTIC, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${manager.token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setFabricLoading(false)
            console.log("material statistic", data);
            setMaterialStatistic(data);
          }
        } catch (error) {
          console.log("Error:", error);
          setFabricLoading(false)
        }
      }

      const fetchCommonTemplate = async () => {
        setCommonTemplateLoading(true)
        const manager = JSON.parse(localStorage.getItem("manager"));
        const GET_COMMON_TEMPLATE = `https://e-tailorapi.azurewebsites.net/api/Dashboard/template-common-used?year=${searchYear}&month=${searchMonth}`;
        try {
          const response = await fetch(GET_COMMON_TEMPLATE, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${manager.token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setCommonTemplateLoading(false)
            console.log("common template", data);
            setCommonTemplate(data);
          }
        } catch (error) {
          console.log("Error:", error);
          setCommonTemplateLoading(false)
        }
      }
      fetchCommonTemplate();
      fetchMaterialStatistic();
    }, [searchMonth, searchYear])

    const fabricLabels = materialStatistic.map(material => material.name);
    const options = {
      indexAxis: 'y',
      elements: {
        bar: {
          borderWidth: 1,
        },

      },
      responsive: true,
      plugins: {

        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Số lượng đơn hàng theo loại vải',
        },
      },
    };

    const fabricData = {
      labels: fabricLabels,
      datasets:
        [
          {
            label: '',
            data: materialStatistic.map(material => material.totalProducts),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ]
    }

    const templateData = {
      templateLabels: commonTemplate && commonTemplate.map(template => template.name),
      datasets:
        [
          {
            label: '',
            data: commonTemplate && commonTemplate.map(template => template?.total),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ]
    }
    const templateChartOptions = {
      indexAxis: 'y',
      elements: {
        bar: {
          borderWidth: 1,
          label: {
            display: true,
            overflow: "hidden",
            align: "center",
            padding: 10,
            maxWidth: 40,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
        },

      },
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Số lượng bản mãu được sử dụng',
        },
      },
    };

    return (
      <Row justify="space-between" style={{ backgroundColor: "unset", margin: 15 }}>
        <Col span={14} >
          <div style={{ marginRight: 10, borderRadius: 10, height: "45em" }} >
            <div style={{ display: "flex", backgroundColor: "#ffffff", height: "22em", borderRadius: 10 }}>
              {fabricLoading ?
                <div style={{ width: "100%", height: "100%", alignContent: "center", alignItems: "center", display: "flex", justifyContent: "center" }}>
                  <Spin size="large" color="#9F78FF" style={{ paddingTop: 40 }} />
                </div>
                : (
                  <>
                    <Col span={14}>
                      <div>
                        <h1 style={{ fontSize: 20, fontWeight: 600, color: "#727272", padding: 10 }}>Loại vải được ưa chuộng tháng {searchMonth}</h1>
                      </div>
                      <Bar options={options} data={fabricData} />
                    </Col>
                    <Col span={10} style={{ backgroundColor: "#ffffff", borderRadius: 10 }}>
                      <div style={{ padding: "20px 5px 20px 50px", alignContent: "center", alignItems: "center", height: "100%" }}>
                        {materialStatistic.map((material, index) => (
                          <div style={{ display: "flex", padding: 5, alignItems: "center" }} key={index}>
                            <div>
                              <img src={material.image} style={{ width: 50, height: 50, objectFit: "contain", borderRadius: 10 }}></img>
                            </div>
                            <div style={{ marginLeft: 20 }}>
                              <p style={{ fontSize: 12, fontWeight: 600, color: "#000000", margin: 0 }}>{material.name}</p>
                              <p style={{ fontSize: 12, fontWeight: 600, color: "#000000", margin: 0 }}>Số đơn: {material.totalProducts ? material.totalProducts : 0}</p>
                            </div>
                          </div>
                        ))}
                      </div>


                    </Col>
                  </>
                )}
            </div>
            <div style={{ display: "flex", backgroundColor: "#ffffff", height: "22em", marginTop: "1em", borderRadius: 10 }}>
              {commonTemplateLoading ?
                <div style={{ width: "100%", height: "100%", alignContent: "center", alignItems: "center", display: "flex", justifyContent: "center" }}>
                  <Spin size="large" color="#9F78FF" style={{ paddingTop: 40 }} />
                </div>
                : (
                  <>
                    <Col span={14}>
                      <div>
                        <h1 style={{ fontSize: 20, fontWeight: 600, color: "#727272", padding: 10 }}>Bản mẫu được ưa chuộng tháng {searchMonth}</h1>
                      </div>
                      <Bar options={templateChartOptions} data={{
                        labels: commonTemplate && commonTemplate.map(template => template?.name),
                        datasets: [{
                          label: '',
                          data: commonTemplate && commonTemplate.map(template => template?.total),
                          borderColor: 'rgb(53, 162, 235)',
                          backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        }],
                      }} />
                    </Col>
                    <Col span={10} style={{ backgroundColor: "#ffffff", borderRadius: 10 }}>
                      <div style={{ padding: "20px 5px 20px 50px", alignContent: "center", alignItems: "center", height: "100%" }}>
                        {/* <p><FontAwesomeIcon icon={faRankingStar} /></p> */}
                        {commonTemplate && commonTemplate.map((template, index) => (
                          <div style={{ display: "flex", padding: 5, alignItems: "center" }} key={index}>
                            <div>
                              <img src={template?.thumbnailImage} style={{ width: 50, height: 50, objectFit: "contain", borderRadius: 10 }}></img>
                            </div>
                            <div style={{ marginLeft: 20 }}>
                              <p style={{ fontSize: 12, fontWeight: 600, color: "#000000", margin: 0 }}>{template?.name}</p>
                              <p style={{ fontSize: 12, fontWeight: 600, color: "#000000", margin: 0 }}>Số đơn: {template?.total ? template?.total : 0}</p>
                            </div>
                          </div>
                        ))}
                      </div>


                    </Col>
                  </>
                )}


            </div>

          </div>
        </Col>
        <Col span={10}>
          <Row style={{ backgroundColor: "#ffffff", borderRadius: 10, height: "45em" }}>
            <div>
              <div>
                <h1 style={{ fontSize: 20, fontWeight: 600, color: "#727272", padding: 10 }}>Đề xuất nhập vải</h1>
                {materialStatistic.map((material, index) => (
                  material.totalProducts > 0 && (
                    <div style={{ display: "flex", padding: 15, alignItems: "center", height: "22vh" }} key={index}>
                      <div>
                        <img src={material.image} style={{ width: 50, height: 50, objectFit: "contain", borderRadius: 10 }}></img>
                      </div>
                      <div style={{ marginLeft: 20 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: "#000000", margin: 0 }}>{material.name}</p>
                      </div>
                    </div>
                  )

                ))}
              </div>
              <div>
                <h1 style={{ fontSize: 20, fontWeight: 600, color: "#727272", padding: 10 }}>Xu hướng thịnh hành</h1>
                {commonTemplate && commonTemplate.map((template, index) => (
                  commonTemplate && commonTemplate.total > 0 && (
                    <div style={{ padding: 5, alignItems: "center" }} key={index}>
                      <div>
                        <img src={template?.thumbnailImage} style={{ width: 50, height: 50, objectFit: "contain", borderRadius: 10 }}></img>
                      </div>
                      <div style={{ marginLeft: 20 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: "#000000", margin: 0 }}>{template?.name}</p>
                      </div>
                    </div>
                  )

                ))}
              </div>

            </div>
          </Row>
        </Col>
      </Row>
    )
  }
  const disabledDate = (current) => {
    return current && current > dayjs().endOf('year');
  };

  const generateMonthOptions = async () => {
    const currentYear = dayjs().year();
    const isCurrentYear = parseInt(searchYear, 10) === currentYear;
    const currentMonth = dayjs().month() + 1;

    return Array.from({ length: 12 }, (_, i) => ({
      value: i + 1,
      label: `Tháng ${i + 1}`,
      disabled: isCurrentYear && i + 1 > currentMonth,
    }));
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
        <div>
          <MaterialStatistic searchMonth={searchMonth} searchYear={searchYear} />
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
