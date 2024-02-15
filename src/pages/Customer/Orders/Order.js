import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';
import './order.css';
import LeftBanner from '../../../assets/images/banner-blog/still-life-spring-wardrobe-switch (1).jpg';
import RightBanner from '../../../assets/images/banner-blog/still-life-spring-wardrobe-switch.jpg';
import NoOrder from '../../../assets/images/2011.i203.010..hobby cartoon set-06.jpg';

export default function Order() {
    return (
        <div style={{ padding: "140px 20px 0 20px",  display: "grid", gridTemplateColumns: "15% 70% 15%", columnGap: "20px" }}>
            <div style={{ maxWidth: "200px", gridColumn: "1", height: "fit-content" }}>
                <img src={LeftBanner} alt="Left Banner" />
            </div>
            {/* <div style={{ display: "flex", flexDirection: "column", borderRadius: "10px", gridColumn: "2" }}>
                <div style={{ display: "flex", justifyContent: "center", maxHeight: "fit-content", paddingBottom: "20px" }}>
                    <p className='title is-3' style={{ color: "#9e78ff8a", }}>Danh sách đơn hàng</p>
                </div>
                <table className="table" style={{ width: "100%" }}>
                    <thead>
                        <tr>
                            <th>Mã đơn</th>
                            <th>Sản phẩm</th>
                            <th>Số lượng</th>
                            <th>Trạng thái</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>c12302v3432</th>
                            <td>Hồ sơ 1</td>
                            <td>Nguyễn Công Vũ</td>
                            <td>12/10/2024</td>
                            <td style={{ display: "flex" }}>
                                <div>
                                    <FontAwesomeIcon icon={faTrash} />
                                </div>
                                <div style={{ paddingLeft: "20px" }}>
                                    <FontAwesomeIcon icon={faPencil} />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>c12302v3432</th>
                            <td>Hồ sơ 1</td>
                            <td>Nguyễn Công Vũ</td>
                            <td>12/10/2024</td>
                            <td style={{ display: "flex" }}>
                                <div>
                                    <FontAwesomeIcon icon={faTrash} />
                                </div>
                                <div style={{ paddingLeft: "20px" }}>
                                    <FontAwesomeIcon icon={faPencil} />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>c12302v3432</th>
                            <td>Hồ sơ 1</td>
                            <td>Nguyễn Công Vũ</td>
                            <td>12/10/2024</td>
                            <td style={{ display: "flex" }}>
                                <div>
                                    <FontAwesomeIcon icon={faTrash} />
                                </div>
                                <div style={{ paddingLeft: "20px" }}>
                                    <FontAwesomeIcon icon={faPencil} />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>c12302v3432</th>
                            <td>Hồ sơ 1</td>
                            <td>Nguyễn Công Vũ</td>
                            <td>12/10/2024</td>
                            <td style={{ display: "flex" }}>
                                <div>
                                    <FontAwesomeIcon icon={faTrash} />
                                </div>
                                <div style={{ paddingLeft: "20px" }}>
                                    <FontAwesomeIcon icon={faPencil} />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div> */}
            <div style={{ width: "100%", display: "flex", height:"600px", justifyContent: "center", position: "relative" }}>
                <div style={{paddingLeft:"20px"}}>
                    <img src={NoOrder} style={{ height:"90%" }}></img>
                </div>

                <div style={{position:"absolute", top:"40px"}}>
                    <h1>Bạn chưa đặt may <Link to="#">sản phẩm.</Link></h1>
                </div>

            </div>
            <div style={{ overflowX: "hidden", height: "fit-content", gridColumn: "3" }}>
                <img src={RightBanner} alt="Right Banner" />
            </div>
        </div>
    );
}
