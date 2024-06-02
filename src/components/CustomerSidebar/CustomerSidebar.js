import React, { useState } from 'react'
import './index.css'
import UserAvatar from "../../../src/assets/images/user-avatar.jpg"
import UserIcon from "../../../src/assets/images/profile-user.png"
import OrderIcon from "../../../src/assets/images/box.png"
import BodyIcon from "../../../src/assets/images/tape-measure.png"
import { Link } from 'react-router-dom'
import { CaretRightFilled } from '@ant-design/icons';
export default function CustomerSidebar() {
    const [isHover, setIsHover] = useState('');
    const customer = JSON.parse(localStorage.getItem('customer'));
    console.log(customer);
    const handleHover = (name) => {

        console.log("location:", `/${name}`)

        if (`/${name}` !== window.location.pathname) {
            setIsHover(name);
            console.log("HIIIII")
        }
    };

    const pathname = window.location.pathname;
    const renderCaretRight = (section) => {
        return isHover === section && pathname.includes(section);
    };

    return (
        <>
            <div className='avatar-wrapper'>
               
                <h2 className='subtitle is-4' style={{ paddingLeft: '20px' }}> Cài đặt hồ sơ </h2>
            </div>
            <hr className="dropdown-divider" />
            <Link to="/profile">
                <div className='profile-detail' onMouseEnter={() => handleHover('profile')} onMouseLeave={() => setIsHover('')}>
                    {isHover === 'profile' && <CaretRightFilled style={{ color: "#9F78FF" }} />}

                    <p className='subtitle is-6 ' style={{ color: pathname.includes("/profile") ? "#9F78FF" : "#1D2547", paddingLeft: "15px" }}> Thông tin cá nhân </p>
                </div>
            </Link>
            <hr className="dropdown-divider" />
            <Link to="/body-profile">
                <div className='profile-detail' onMouseEnter={() => handleHover('body-profile')} onMouseLeave={() => setIsHover('')}>
                    {isHover === 'body-profile' && <CaretRightFilled style={{ color: "#9F78FF" }} />}

                    <p className='subtitle is-6' style={{ color: pathname.includes("/body-profile") ? "#9F78FF" : "#1D2547", paddingLeft: "15px" }}> Hồ sơ số đo </p>
                </div>
            </Link>
            <hr className="dropdown-divider" />
            <Link to="/change-password">
                <div className='profile-detail' onMouseEnter={() => handleHover('change-password')} onMouseLeave={() => setIsHover('')}>
                    {isHover === 'change-password' && <CaretRightFilled style={{ color: "#9F78FF" }} />}

                    <p className='subtitle is-6' style={{ color: pathname.includes("/change-password") ? "#9F78FF" : "#1D2547", paddingLeft: "15px" }}> Đổi mật khẩu </p>
                </div>
            </Link>
        </>
    );
}