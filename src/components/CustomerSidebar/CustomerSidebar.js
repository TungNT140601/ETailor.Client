import React from 'react'
import './index.css'
import UserAvatar from "../../../src/assets/images/user-avatar.jpg"
import UserIcon from "../../../src/assets/images/profile-user.png"
import OrderIcon from "../../../src/assets/images/box.png"
import BodyIcon from "../../../src/assets/images/tape-measure.png"
import { Link } from 'react-router-dom'

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
            <Link to="/profile">
                <div className='profile-detail active'>
                    <img className='detail-icon' width={24} height={24} src={UserIcon}></img>
                    <p className='subtitle is-6 ' style={{ paddingLeft: "15px" }}> Thông tin cá nhân </p>
                </div>
            </Link>
            <hr class="dropdown-divider" />
            <Link to="/body-profile">
                <div className='profile-detail'>

                    <img className='detail-icon' src={BodyIcon}></img>
                    <p className='subtitle is-6' style={{ paddingLeft: "15px" }}> Hồ sơ số đo </p>


                </div>
            </Link>
        </>
    )
}
