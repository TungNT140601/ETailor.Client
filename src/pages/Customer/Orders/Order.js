import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';
import './order.css';
import LeftBanner from '../../../assets/images/banner-blog/still-life-spring-wardrobe-switch (1).jpg';
import RightBanner from '../../../assets/images/banner-blog/still-life-spring-wardrobe-switch.jpg';

export default function Order() {
    return (
        <div style={{ padding: "140px 20px 0 20px", width: "100vw", display: "grid", gridTemplateColumns: "15% 70% 15%", columnGap: "20px" }}>
            <div style={{ maxWidth: "200px", gridColumn: "1" }}>
                <img src={LeftBanner} alt="Left Banner" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", borderRadius: "10px", gridColumn: "2" }}>
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
            </div>
            <div style={{ overflowX: "hidden", height: "80vh", gridColumn: "3" }}>
                <img src={RightBanner} alt="Right Banner" />
            </div>
        </div>
    );
}
