import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';
import './order.css';
import LeftBanner from '../../../assets/images/banner-blog/still-life-spring-wardrobe-switch (1).jpg';
import RightBanner from '../../../assets/images/banner-blog/still-life-spring-wardrobe-switch.jpg';
import NoOrder from '../../../assets/images/2011.i203.010..hobby cartoon set-06.jpg';
import { DownOutlined } from '@ant-design/icons';
import { Form, Radio, Space, Switch, Table, Tag, Image } from 'antd';
import { useQuery } from "react-query";
import { render } from '@testing-library/react';

const columns = [
    {
        title: 'Stt',
        dataIndex: 'index',
    },
    {
        title: 'Sản phẩm',
        dataIndex: 'productName',
        sorter: (a, b) => a.productName - b.productName,
    },
    {
        title: 'Hình ảnh',
        dataIndex: 'productImg',
        render: (imgSrc) => {
            return (
                <Image
                    width={60}
                    src={RightBanner}
                    alt=''
                    preview={{
                        imageRender: () => (
                            <div style={{ marginTop: "60px", height: "65%", overflowY: "hidden" }}>
                                <Image
                                    width="100%"
                                    height="100%"
                                    style={{ objectFit: "cover" }}
                                    src={RightBanner}
                                />
                            </div>
                        ),
                    }}
                />
            );
        }
    }
    ,
    {
        title: 'Số lượng',
        dataIndex: 'quantity',
        sorter: (a, b) => a.quantity - b.quantity,
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        render: (status) => {
            let color;
            let text;
            switch (status) {
                case 0:
                    color = 'red';
                    text = 'Đã huỷ'
                case 1:
                    color = 'geekblue';
                    text = 'Đang duyệt'
                    break;
                case 2:
                    color = 'geekblue';
                    text = 'Đã nhận đơn';
                    break;
                case 3:
                    color = 'volcano';
                    text = 'Chưa bắt đầu';
                    break;
                case 4:
                    color = 'volcano';
                    text = 'Đang xử lý';
                    break;
                case 5:
                    color = 'green';
                    text = 'Kiểm thử';
                    break;
                case 6:
                    color = 'green';
                    text = 'Hoàn thành';
                    break;
                default:
                    color = 'defaultColor';
                    break;
            }
            return (
                <span>
                    <Tag color={color} key={status}>
                        {status === 2 ? text : ""}
                    </Tag>
                </span>
            );

        }
    },
    {
        title: 'Giá',
        dataIndex: 'price'
    }
    ,
    {
        title: 'Ngày mua',
        dataIndex: 'date',
    }
];

const defaultExpandable = {
    expandedRowRender: (record) => <p>{record.status}</p>,
};
export default function Order() {
    const customer = localStorage.getItem("customer")
    const token = JSON.parse(customer)?.token
    const { data: getOrdersAPI, isLoading } = useQuery("get-order", () =>
        fetch(`https://etailorapi.azurewebsites.net/api/order`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => response.json())
    );
    const orders = getOrdersAPI?.map((order, index) => ({
        index: index + 1,
        key: order.id,
        productName: order?.productName ? order.productName : "",
        productImg: order?.productImg ? order.productImg : "",
        quantity: order?.totalProduct,
        price: order?.totalPrice,
        status: order?.status,
        date: order?.createdDate ? order.createdDate : "Date error",
    }))
    console.log("orders:", getOrdersAPI)
    const [bordered, setBordered] = useState(true);
    const [loading, setLoading] = useState(false);

    const [expandable, setExpandable] = useState(defaultExpandable);
    const [showTitle, setShowTitle] = useState(false);
    const [showHeader, setShowHeader] = useState(true);
    const [tableLayout, setTableLayout] = useState();
    const [bottom, setBottom] = useState('bottomCenter');
    const [ellipsis, setEllipsis] = useState(false);
    const tableColumns = columns.map((item) => ({
        ...item,
        ellipsis,
    }));
    const handleExpandChange = (enable) => {
        setExpandable(enable ? defaultExpandable : undefined);
    };
    const tableProps = {
        bordered,
        loading,
        expandable,
        showHeader,
        tableLayout,
    };
    return (
        <>
            <div style={{ padding: "140px 20px 0 20px", display: "flex", columnGap: "20px", position: "relative", alignContent: "center" }}>
                <div style={{ maxWidth: "200px", left: "60px", top: "200px", height: "fit-content", position: "absolute" }}>
                    <img src={LeftBanner} alt="Left Banner" />
                </div>
                <div style={{ width: "100%", display: "flex", height: "600px", justifyContent: "center", position: "" }}>
                    <div style={{ marginTop: "40px" }}>

                        <Table
                            {...tableProps}
                            pagination={{
                                position: [bottom],
                            }}
                            columns={tableColumns}
                            dataSource={orders}
                            size='large'
                        />
                    </div>
                </div>
                <div style={{ overflowX: "hidden", height: "fit-content", position: "absolute", top: "200px", right: "60px" }}>
                    <img src={RightBanner} alt="Right Banner" width={200} />
                </div>
            </div >
        </>
    );
}
