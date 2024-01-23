import React from 'react'
import './index.css'
import UserAvatar from "../../../assets/images/user-avatar.jpg"

export default function CustomerProfile() {
    return (
        <>
            <h2 className='title is-3'> Thông tin tài khoản</h2>
            <div className='user-info'>
                <div className='input-title'><h2 className='subtitle is-5'>Họ và tên:</h2></div>
                <div className='input-area'><input value={'Nguyễn Công Vũ'} class="input" type="text"></input></div>

            </div>
            <div className='user-info'>
                <div className='input-title'>
                    <h2 className='subtitle is-5'>Số điện thoại:</h2>
                </div>
                <div className='input-area'>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: "400" }}>0338 1423 452</h2>
                    <button className='button btn-change'>Thay đổi</button>
                </div>

            </div>
            <div className='user-info'>
                <div className='input-title'><h2 className='subtitle is-5'>Giới tính:</h2></div>
                <div className='input-area'>
                    <label class="radio">

                        <input type="radio" value={"Nam"} name="answer">
                        </input>
                        Nam
                    </label>
                    <label class="radio">
                        <input type="radio" value={"Nữ"} name="answer">
                        </input>
                        Nữ
                    </label>
                </div>

            </div >
            <div className='save-btn'>
                <div style={{ position: "absolute", bottom: "0", alignContent:"center" }}>
                    <button className='button btn-change'>Lưu thay đổi</button>
                </div>

            </div>

        </>
    )
}
