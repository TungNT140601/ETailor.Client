import React from 'react'
import './index.css'
import UserAvatar from "../../../src/assets/images/user-avatar.jpg"
import UserIcon from "../../../src/assets/images/profile-user.png"
import OrderIcon from "../../../src/assets/images/box.png"
import BodyIcon from "../../../src/assets/images/tape-measure.png"

export default function CustomerSidebar() {
    return (
        <>
            <div className='avatar-wrapper'>
                <figure class="image is-64x64">
                    <img className='user-avatar' src={UserAvatar}></img>

                </figure>
                <h2 className='subtitle is-4' style={{ paddingLeft: '20px' }}> Nguyễn Công Vũ </h2>
            </div>
            <hr class="dropdown-divider" />
            <div className='profile-detail active'>
                <img className='detail-icon' src={UserIcon}></img>
                <p className='subtitle is-5 ' style={{ paddingLeft: "15px" }}> Thông tin cá nhân </p>
            </div>
            <hr class="dropdown-divider" />
            <div className='profile-detail'>
                <img className='detail-icon' src={OrderIcon}></img>
                <p className='subtitle is-5' style={{ paddingLeft: "15px" }}> Quản lý đơn hàng </p>
            </div>
            <hr class="dropdown-divider" />
            <div className='profile-detail'>
                <img className='detail-icon' src={BodyIcon}></img>
                <p className='subtitle is-5' style={{ paddingLeft: "15px" }}> Hồ sơ số đo </p>
            </div>
        </>
    )
}
