import React, { useEffect, useState } from 'react'
import { Bar, Pie, Line } from 'react-chartjs-2';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRankingStar } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
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
  Legend,
  ArcElement
} from 'chart.js';
import { RiseOutlined, FallOutlined, CalendarOutlined, WarningFilled, DoubleRightOutlined } from '@ant-design/icons';
import { DatePicker, Select, Space, Row, Col, Spin, Button, Collapse } from 'antd';
import 'dayjs/locale/vi';
import dayjs from 'dayjs';
import FormatVNCurrency from '../../utils/FormatVNCurrency'
import { useNavigate } from 'react-router-dom';
import MedalIcon from '../../../assets/images/medal.png'
dayjs.locale('vi');

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
    const navigate = useNavigate();
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
    const [allTask, setAllTask] = useState([])
    const [warnTasks, setWarnTasks] = useState([]);
    const [lateTasks, setLateTasks] = useState([]);
    const [fetching, setFetching] = useState(false)
    const [taskLoading, setTaskLoading] = useState(false)
    const [totalOrderLoading, setTotalOrderLoading] = useState(false)
    useEffect(() => {
      if (allTask.length > 0) {
        const currentDateTime = new Date();

        const filteredTasks = allTask.filter(task => {
          if (task.status === 1 || task.status === 2 || task.status === 3) {
            const timeDifference = new Date(task.plannedTime) - currentDateTime;
            const hoursDifference = timeDifference / (1000 * 60 * 60);
            if (hoursDifference < 48 && hoursDifference > 0) {
              setWarnTasks(prevWarnTasks => [...prevWarnTasks, task]);
            } else if (hoursDifference < 0) {
              setLateTasks(prevLateTasks => [...prevLateTasks, task]);
            }

          }
          return null;
        });
      }
    }, [allTask]);
    useEffect(() => {
      const fetchTaskCurrentMonthStatistic = async () => {
        setTaskLoading(true)
        const manager = JSON.parse(localStorage.getItem("manager"));
        const GET_TASK_CURRENT_MONTH_STATISTIC = 'https://e-tailorapi.azurewebsites.net/api/task/manager/get-all';
        try {
          const response = await fetch(GET_TASK_CURRENT_MONTH_STATISTIC, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${manager.token}`,
            },
          });
          if (response.ok) {
            setTaskLoading(false)
            const data = await response.json();
            setAllTask(data)
          }
        } catch (error) {
          console.log("Error:", error);
          setTaskLoading(false)
        }
      }
      fetchTaskCurrentMonthStatistic();
    }, [fetching]);

    useEffect(() => {
      const manager = JSON.parse(localStorage.getItem("manager"));
      const baseOrderStatisticURL = "https://e-tailorapi.azurewebsites.net/api/Dashboard/order-dashboard";
      const fetchOrderStatistic = async () => {
        let url = baseOrderStatisticURL;
        const params = new URLSearchParams();
        setTotalOrderLoading(true)
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
            const totalForStatus7 = data.find(stat => stat.status === 8)?.total;
            const totalRevenue = data.find(stat => stat.status === 8)?.totalPrice;
            const otherStatusTotals = data
              .filter(stat => stat.status !== 0 && stat.status !== 8)
              .map(stat => stat.total);

            const sumOfOtherStatuses = otherStatusTotals.reduce((acc, curr) => acc + curr, 0);
            const sumofAllOrders = data.map(stat => stat.total).reduce((acc, curr) => acc + curr, 0);
            setTotalOrders(sumofAllOrders)
            setTotalForOtherStatuses(sumOfOtherStatuses);
            setTotalRevenue(totalRevenue);
            setTotalForStatus0(totalForStatus0);
            setTotalForStatus7(totalForStatus7);
            setTotalOrderLoading(false)
          }
        } catch (error) {
          setTotalOrderLoading(false)
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
          <Row gutter={5}>
            <Col span={24} style={{ height: "230px", borderRadius: 10, backgroundColor: "#fff", }}>
              {totalOrderLoading ? <div style={{ width: "100%", height: "100%", alignContent: "center", alignItems: "center", display: "flex", justifyContent: "center" }}>
                <Spin size="large" color="#9F78FF" style={{ paddingTop: 40 }} />
              </div> : (
                <>
                  {totalForStatus0 === 0 && totalForStatus7 === 0 && totalForOtherStatuses === 0 ? (
                    <>
                      <div style={{ width: "100%" }}>
                        <h1 style={{ fontSize: 20, fontWeight: 600, color: "#727272", padding: 10 }}>Tổng số đơn hàng</h1>
                        <p style={{ fontSize: 15, fontWeight: 600, color: "#c0c0c0", margin: "auto" }}>Không có dữ liệu đơn hàng tháng {searchMonth} </p>
                      </div>

                    </>
                  ) : (
                    <>
                      <div style={{ width: "100%", height: 200, position: "relative" }}>

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
                      {searchYear === new Date().getFullYear() && searchMonth === (dayjs().month() + 1) + 1 ? (
                        <div style={{ position: "absolute", bottom: 0, right: 5 }}>
                          <Link to="/manager/orders" style={{ fontWeight: "bold", alignItems: "center" }}>Xem tất cả <DoubleRightOutlined /></Link>
                        </div>
                      ) : null
                      }
                    </>
                  )}
                </>
              )}
            </Col>
            {/* <Col span={12} style={{ height: "230px", backgroundColor: "#ffffff", borderRadius: 10 }}>

              <div style={{ width: "100%", height: 200 }}>
                <Pie options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                    title: {
                      display: true,
                      text: `Trạng thái công việc hiện tại`,
                    },
                  }
                }}

                  data={{
                    labels: ['Trễ', 'Gần tới hạn hoàn thành', 'Đang thực hiện'],
                    datasets: [
                      {
                        label: 'Số lượng',
                        data: [lateTasks.length, warnTasks.length, allTask.length],
                        backgroundColor: [
                          'rgba(255, 99, 132, 0.2)',
                          'rgba(255, 206, 86, 0.2)',
                          '#f6ffed',
                        ],

                        borderColor: [
                          'rgba(255, 99, 132, 1)',
                          'rgba(255, 206, 86, 1)',
                          '#389e0d',
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}

                />
              </div>
            </Col> */}

          </Row>
          <Row style={{ backgroundColor: "#fff", borderRadius: 10, marginTop: 15, width: "620px", height: "400px" }}>

            <OrderStatistic searchMonth={searchMonth} searchYear={searchYear} barChart={false} lineChart={true} />


          </Row>
        </Col>
      </Row>
    )
  }
  const currentDate = dayjs()
  const [searchMonth, setSearchMonth] = useState(currentDate.month() + 1)

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
  const disabledDate = (current) => {
    return current && current > dayjs().endOf('year');
  };

  const MaterialStatistic = ({ searchMonth, searchYear }) => {
    const [fabricLoading, setFabricLoading] = useState(false)
    const [materialStatistic, setMaterialStatistic] = useState([]);
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

    const fabricLabels = materialStatistic
      .filter(material => material.totalProducts > 0)
      .map(material => material.name);

    const fData = materialStatistic
      .filter(material => material.totalProducts > 0)
      .map(material => material.totalProducts);

    console.log(fabricLabels);
    console.log(fData);

    const fabricData = {
      labels: fabricLabels,
      datasets: [{
        label: 'Total Products',
        data: fData,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1
      }]
    };

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
            height: 70,
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
    const onChange = (key) => {

    };
    const items = [
      {
        key: '1',
        label: `Đề xuất nhập vải`,
        children:
          <>

            <Row gutter={[16, 16]}>
              {materialStatistic.map((material, index) => (
                <Col xs={24} sm={12} md={12} lg={12} xl={12} key={index}>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid #e8e8e8", borderRadius: 10, padding: 10 }}>
                    <img src={material.image} style={{ width: 50, height: 40, objectFit: "cover", borderRadius: 5 }} alt={material.name} />
                    <div style={{ marginLeft: 10 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#000000", margin: 0 }}>{material?.name}</p>
                      {material && material.quantity < 10 ? (
                        <p style={{ fontSize: 12, fontWeight: 600, color: "#000000", margin: 0 }}>Kho: {material.quantity} mét
                          <WarningFilled title='Gần hết vải' style={{ color: "red", paddingLeft: 5 }} />
                        </p>
                      ) : (
                        <p style={{ fontSize: 12, fontWeight: 600, color: "#000000", margin: 0 }}>Kho: {material.quantity} mét </p>
                      )}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </>,
      },
      {
        key: '2',
        label: 'Xu hướng thịnh hành',
        children:
          <>
            <Row gutter={[16, 16]}>
              {commonTemplate ? (
                commonTemplate.map((material, index) => (
                  material.total > 0 &&
                  <Col xs={24} sm={12} md={12} lg={12} xl={12} key={index}>
                    <div style={{ display: "flex", alignItems: "center", border: "1px solid #e8e8e8", borderRadius: 10, padding: 10, position: "relative" }}>
                      {(index === 0 || index === 2 || index == 1) && (
                        <div style={{ position: "absolute", top: -12, right: 0 }}>
                          <img src={MedalIcon} style={{ width: 40, height: 40 }} />
                        </div>
                      )}
                      <img title={material.name} src={material.thumbnailImage} width={50} height={40} style={{ width: 50, height: 40, objectFit: "cover", borderRadius: 5 }} alt={material.name} />
                      <div style={{ marginLeft: 10 }}>
                        <p title={material.name} style={{ fontSize: 12, fontWeight: 600, color: "#000000", margin: 0, color: "#000000", margin: 0, overflow: "hidden", textOverflow: "ellipsis", width: 130, textWrap: "nowrap" }}>{material?.name}</p>
                        <p style={{ fontSize: 12, fontWeight: 600, color: "#000000", margin: 0 }}>Số đơn: {material.total ? material.total : 0}</p>
                      </div>
                    </div>
                  </Col>
                ))
              ) : (
                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                  <p style={{ fontSize: 18, fontWeight: 600, color: "#000000", margin: 0 }}>Không có dữ liệu hoặc chưa có đơn hàng</p>
                </div>
              )}
            </Row>
          </>,
      },

    ];
    return (
      <Row justify="space-between" style={{ backgroundColor: "unset", margin: 15, display: 'flex', flexWrap: 'wrap' }}>
        <Col span={14} style={{ width: "100%", maxHeight: "40vh" }}>
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
                        <p style={{ padding: 5, fontSize: 14, fontWeight: 600, color: "#727272", }}>Top 3 loại vải được sử dụng nhiều nhất</p>
                        {materialStatistic
                          .sort((a, b) => (b.totalProducts ? b.totalProducts : 0) - (a.totalProducts ? a.totalProducts : 0))
                          .slice(0, 3)
                          .map((material, index) => (
                            <div style={{ display: "flex", padding: 5, alignItems: "center" }} key={index}>
                              <div>
                                <img src={material.image} style={{ width: 50, height: 40, objectFit: "cover", borderRadius: 5 }}></img>
                              </div>
                              <div style={{ marginLeft: 20 }}>
                                <p style={{ fontSize: 12, fontWeight: 600, color: "#000000", margin: 0, overflow: "hidden", textOverflow: "ellipsis", width: 130, textWrap: "nowrap" }}>{material.name}</p>
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
                        labels: commonTemplate && commonTemplate.filter(template => template.total > 0).map(template => template?.name),
                        datasets: [{
                          label: '',
                          data: commonTemplate && commonTemplate.filter(template => template.total > 0).map(template => template?.total),
                          borderColor: 'rgb(53, 162, 235)',
                          backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        }],
                      }} />
                    </Col>
                    <Col span={10} style={{ backgroundColor: "#ffffff", borderRadius: 10 }}>
                      <div style={{ padding: "20px 5px 20px 50px", alignContent: "center", alignItems: "center", height: "100%" }}>
                        <p style={{ padding: 5, fontSize: 14, fontWeight: 600, color: "#727272", }}>Top 3 bản mẫu được ưa chuộng nhất</p>
                        {/* <p><FontAwesomeIcon icon={faRankingStar} /></p> */}
                        {commonTemplate
                          .sort((a, b) => (b.total ? b.total : 0) - (a.total ? a.total : 0))
                          .slice(0, 3)
                          .map((material, index) => (
                            <div style={{ display: "flex", padding: 5, alignItems: "center" }} key={index}>
                              <div>
                                <img src={material.thumbnailImage} title={material?.name} style={{ width: 50, height: 40, objectFit: "cover", borderRadius: 5 }}></img>
                              </div>
                              <div style={{ marginLeft: 20 }}>
                                <p title={material?.name} style={{ fontSize: 12, fontWeight: 600, color: "#000000", margin: 0, overflow: "hidden", textOverflow: "ellipsis", width: 130, textWrap: "nowrap" }}>{material.name}</p>
                                <p style={{ fontSize: 12, fontWeight: 600, color: "#000000", margin: 0 }}>Số đơn: {material.total ? material.total : 0}</p>
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
        <Col span={10} style={{ width: "100%", maxHeight: "40vh" }}>
          <Row style={{ backgroundColor: "#ffffff", borderRadius: 10, height: "45em", width: "100%" }}>
            <div style={{ width: "100%" }}>
              <Collapse items={items} defaultActiveKey={['1']} onChange={onChange} />
            </div>
          </Row>
        </Col>

      </Row>
    )
  }


  return (
    <div style={{ width: "100%", height: "99vh", backgroundColor: "#f0f4f5", borderRadius: 10, border: "1px solid #9F78FF", overflowY: "scroll", scrollbarWidth: "none" }}>
      <div style={{ padding: "5px 20px" }}>
        <div style={{ paddingLeft: 20 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: "#3f4344" }}>Quản lý chung</h1>
        </div>

        <div style={{ display: "flex", margin: "5px 20px" }}>
          <Space direction="vertical" size={5}>
            <p style={{ fontSize: 15, fontWeight: 400, color: "#3f4344", paddingLeft: 5 }}>Chọn tháng</p>
            <Select
              defaultValue={(currentDate.month() + 1)}
              style={{ width: 200, height: 40 }}
              suffixIcon={<CalendarOutlined style={{ fontSize: 14 }} />}
              onChange={handleChoseMonth}
              options={[
                {
                  value: 1,
                  label: 'Tháng 1',
                  disabled: searchYear === dayjs().year() && 1 > dayjs().month() + 1 ? true : false
                },
                {
                  value: 2,
                  label: 'Tháng 2',
                  disabled: searchYear === dayjs().year() && 2 > dayjs().month() + 1 ? true : false

                },
                {
                  value: 3,
                  label: 'Tháng 3',
                  disabled: searchYear === dayjs().year() && 3 > dayjs().month() + 1 ? true : false

                },
                {
                  value: 4,
                  label: 'Tháng 4',
                  disabled: searchYear === dayjs().year() && 4 > dayjs().month() + 1 ? true : false

                },
                {
                  value: 5,
                  label: 'Tháng 5',
                  disabled: searchYear === dayjs().year() && 5 > dayjs().month() + 1 ? true : false
                },
                {
                  value: 6,
                  label: 'Tháng 6',
                  disabled: searchYear === dayjs().year() && 6 > dayjs().month() + 1 ? true : false
                },
                {
                  value: 7,
                  label: 'Tháng 7',
                  disabled: searchYear === dayjs().year() && 7 > dayjs().month() + 1 ? true : false
                },
                {
                  value: 8,
                  label: 'Tháng 8',
                  disabled: searchYear === dayjs().year() && 8 > dayjs().month() + 1 ? true : false
                },
                {
                  value: 9,
                  label: 'Tháng 9',
                  disabled: searchYear === dayjs().year() && 9 > dayjs().month() + 1 ? true : false
                },
                {
                  value: 10,
                  label: 'Tháng 10',
                  disabled: searchYear === dayjs().year() && 10 > dayjs().month() + 1 ? true : false
                },
                {
                  value: 11,
                  label: 'Tháng 11',
                  disabled: searchYear === dayjs().year() && 11 > dayjs().month() + 1 ? true : false
                },
                {
                  value: 12,
                  label: 'Tháng 12',
                  disabled: searchYear === dayjs().year() && 12 > dayjs().month() + 1 ? true : false
                },
              ]}
            />
          </Space>

          <Space direction="vertical" size={5} style={{ width: 200, marginLeft: 40 }}>
            <p style={{ fontSize: 15, fontWeight: 400, color: "#3f4344", paddingLeft: 5 }} >Chọn năm</p>
            <DatePicker
              picker='year'
              disabledDate={disabledDate}
              defaultValue={currentDate.startOf('year')}
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
      </div>
    </div >
  )
}
