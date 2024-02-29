import React from 'react'
import { Alert, Flex, Spin } from 'antd';
import './index.css'
export default function Loading() {
    return (
        <Spin size="large" style={{backgroundColor:"#fff"}}>
            <div className="loading-content" />
        </Spin>

    )
}
