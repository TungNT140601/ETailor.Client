import React from 'react'
import './index.css'
import UserAvatar from "../../../assets/images/user-avatar.jpg"

export default function CustomerProfile() {
    return (
        <>
            <h2 className='title is-3' style={{ textAlign: "center" }}> Thông tin tài khoản</h2>
            <div style={{ display: "grid", gridTemplateColumns: "60% 40%" }}>
                <div style={{ marginTop: "24px" }}>
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
                            <p style={{ paddingLeft: "20px", textDecoration: "underline", cursor: "pointer", color: "#0b5394" }}>Thay đổi</p>
                        </div>

                    </div>
                    <div className='user-info'>
                        <div className='input-title'><h2 className='subtitle is-5'>Giới tính:</h2></div>
                        <div className='input-area'>
                            <label class="radio">

                                <input type="radio" value={"Nam"} name="answer" checked>
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
                    <div className='user-info'>
                        <div className='input-title'><h2 className='subtitle is-5'>Email</h2></div>
                        <div className='input-area'><input value={'vu12ace3@gmail.com'} class="input" type="text"></input></div>

                    </div>
                  
                </div>
                <div>
                    <figure class="image is-256x256">
                        <img class="is-rounded" src={UserAvatar}></img>
                    </figure>
                </div>
            </div>


            <div className='save-btn'>
                <div style={{ position: "absolute", bottom: "0", alignContent: "center" }}>
                    <button className='button btn-change'>Lưu thay đổi</button>
                </div>

            </div>

        </>
    )
}
