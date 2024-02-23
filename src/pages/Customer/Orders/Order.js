import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';
import './order.css';
import LeftBanner from '../../../assets/images/banner-blog/still-life-spring-wardrobe-switch (1).jpg';
import RightBanner from '../../../assets/images/banner-blog/still-life-spring-wardrobe-switch.jpg';
import NoOrder from '../../../assets/images/2011.i203.010..hobby cartoon set-06.jpg';
import { DownOutlined } from '@ant-design/icons';
import { Form, Radio, Space, Switch, Table, Tag } from 'antd';
import { useQuery } from "react-query";

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
        dataIndex: 'productImg'
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
            switch (status) {
                case 1:
                    color = 'volcano';
                    break;
                case 2:
                    color = 'geekblue';
                    break;
                case 3:
                    color = 'green';
                    break;
                default:
                    color = 'defaultColor'; // Set default color if status doesn't match any case
                    break;
            }
            return (
                <span>
                    <Tag color={color} key={status}>
                        {status === 2 ? "Hoàn thành" : ""}
                    </Tag>
                </span>
            );

        }
    }
    ,
    {
        title: 'Ngày mua',
        dataIndex: 'date',
    }
];

const defaultExpandable = {
    expandedRowRender: (record) => <p>{record.description}</p>,
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
        status: order?.status
    }))
    console.log("orders:",getOrdersAPI)
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
    const tableProps = {
        bordered,
        loading,
        expandable,
        showHeader,
        tableLayout,
    };
    return (
        <>
            <div style={{ padding: "140px 20px 0 20px", display: "grid", gridTemplateColumns: "15% 70% 15%", columnGap: "20px" }}>
                <div style={{ maxWidth: "200px", gridColumn: "1", height: "fit-content" }}>
                    <img src={LeftBanner} alt="Left Banner" />
                </div>
                <div style={{ width: "100%", display: "flex", height: "600px", justifyContent: "center", position: "relative" }}>
                    {/* <div style={{ paddingLeft: "20px" }}>
                    <img src={NoOrder} style={{ height: "90%" }}></img>
                </div>

                <div style={{ position: "absolute", top: "40px" }}>
                    <h1>Bạn chưa đặt may <Link to="#">sản phẩm.</Link></h1>
                </div> */}
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
                <div style={{ overflowX: "hidden", height: "fit-content", gridColumn: "3" }}>
                    <img src={RightBanner} alt="Right Banner" />
                </div>
            </div >
        </>
    );
}
