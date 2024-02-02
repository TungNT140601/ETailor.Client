import React from 'react'

import Blog1 from "../../../assets/images/banner-blog/female-fashion-designer-working-studio-sitting-desk.jpg"
import './blog.css'


export default function BlogDetail() {
    return (
        <div style={{ paddingTop: "140px" }}>
            <div style={{ height: "60px", paddingLeft: "60px" }}>
                <nav className="breadcrumb has-bullet-separator" aria-label="breadcrumbs">
                    <ul>
                        <li> <a href="#" style={{ color: "#000000" }}>Trang Chủ</a></li>
                        <li> <a href="#" style={{ color: "#000000" }}>Bài Viết</a></li>
                        <li className="is-active" style={{ fontWeight: "bold" }}> <a href="#" style={{ color: "#000000" }} aria-current="page">Xu Hướng</a></li>
                    </ul>
                </nav>

            </div>


            <div className='blog-wrapper-container'>
                <div>
                    <div className='title-blog'>
                        <p className='title is-2'>Làm chủ phong cách của bạn</p>
                        <p>Được đăng bởi <bold style={{ color: "rgb(159, 120, 255)" }}>Vũ Nguyễn</bold> ngày 10/1/2024</p>
                    </div>
                    <div className='content-blog'>
                        <img src={Blog1}></img>
                        <p>
                            Để thực hiện công việc hiệu quả hơn, bạn hãy tận dụng tư duy có tổ chức của mình để sắp xếp công việc, lập danh sách các nhiệm vụ cần làm hợp lý để có thể tập trung nguồn lực hoàn thành nhanh chóng và tối ưu nhất.

                            Tận dụng những khoảng thời gian trống trong ngày như chờ xe, đi xe ô tô để hoàn thành công việc. Dù chỉ một khoảng thời gian nhỏ những bạn cũng có thể sắp xếp để hoàn thành các nhiệm vụ phù hợp như check email, phản hồi tin nhắn khách hàng.
                        </p>
                    </div>
                </div>
                <div>
                    <div>
                        <p className='title is-3'>Xu hướng</p>
                    </div>
                </div>

            </div>
        </div>
    )
}
