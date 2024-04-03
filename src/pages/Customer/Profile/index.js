import React, { useEffect, useState, useRef } from 'react'
import './index.css'
import UserAvatar from "../../../assets/images/user-avatar.jpg"
import Loading from '../LoadingComponent/loading'
import FormatPhoneNumber from '../utils/FormatPhonenumber'
import {
    Button,
} from '@mui/material'
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { toast, Toaster } from 'react-hot-toast'
export default function CustomerProfile() {
    const customer = localStorage.getItem("customer");
    const token = JSON.parse(customer)?.token;
    const [userInfo, setUserInfo] = useState({})
    const [loading, setLoading] = useState(false)
    const [buttonStyle, setButtonStyle] = useState({
        zIndex: 0,
    })
    const [buttonLoading, setButtonLoading] = useState(false)
    useEffect(() => {
        const GET_USER_INFO_URL = `https://e-tailorapi.azurewebsites.net/api/customer-management/info`

        const getUserInfo = async () => {
            try {
                setLoading(true)
                const response = await fetch(GET_USER_INFO_URL, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                })
                if (response.ok) {
                    const data = await response.json()
                    console.log(data)
                    setUserInfo(data)
                    setUpdateProfileData({
                        fullname: data.fullname || '',
                        phone: data.phone || '',
                        email: data.email || '',
                        address: data.address || '',
                        avatar: data.avatar || UserAvatar,
                    });
                }
            } catch (error) {
                setLoading(false)
                console.log("error", error)
            }
        }
        getUserInfo()
    }, [])

    const [image, setImage] = useState(null)

    const [selectedImage, setSelectedImage] = useState(null)
    const handleImageChange = (e) => {
        console.log("e.target.files[0]", e.target.files[0])
        setImage(e.target.files[0])

        const file = e.target.files[0]
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setSelectedImage(reader.result)
        }
    }
    // ----------------- Update personal profile -----------------
    const handleUpdatePersonalProfile = async () => {
        const customer = localStorage.getItem("customer");
        const token = JSON.parse(customer)?.token;

        const formData = new FormData()
        formData.append('Fullname', updateProfileData.fullname)
        // formData.append('Phone', updateProfileData.phone)
        formData.append('Email', updateProfileData.email)
        formData.append('Address', updateProfileData.address)
        formData.append('AvatarImage', image)
        for (var p of formData.entries()) {
            console.log("formData", p[0] + " - " + p[1]);
        }
        try {
            const UPDATE_PROFILE_URL = 'https://e-tailorapi.azurewebsites.net/api/customer-management'
            setButtonLoading(true)
            const response = await fetch(UPDATE_PROFILE_URL, {
                method: 'PUT',
                headers: {
                    "Accept": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                },
                body: formData
            })
            if (response.ok) {
                const data = await response.text()
                toast.success("Cập nhật thông tin thành công")
                setButtonLoading(false)
            }
        } catch (error) {
            setButtonLoading(false)
            toast.error("Cập nhật thông tin thất bại")
            console.log("error", error)
        }
    }
    // ----------------- End Update personal profile -----------------
    const fileInputRef = useRef(null)
    const handleUploadImages = () => {
        fileInputRef.current.click()
    }
    const [updateProfileData, setUpdateProfileData] = useState({
        fullname: '',
        phone: '',
        email: '',
        address: '',
        avatar: '',
    })
    console.log("updateProfileData", updateProfileData)
    const handleInputChange = (name, e) => {
        console.log(`${name} :`, e.target.value)
        setUpdateProfileData({
            ...updateProfileData,
            [name]: e.target.value
        })
    }

    return (
        <>
            <Toaster />
            <h2 className='title' style={{ textAlign: "center", fontSize: 26 }}> Thông tin tài khoản</h2>
            <div style={{ display: "grid", gridTemplateColumns: "60% 40%" }}>
                <div style={{ marginTop: "24px" }}>
                    <div className='user-info'>
                        <div className='input-title'><h2 className='subtitle is-5'>Họ và tên:</h2></div>
                        <div className='input-area'><input value={updateProfileData?.fullname} onChange={(e) => handleInputChange("fullname", e)} class="input" type="text"></input></div>

                    </div>
                    <div className='user-info'>
                        <div className='input-title'>
                            <h2 className='subtitle is-5'>Số điện thoại:</h2>
                        </div>
                        <div className='input-area'>
                            <h2 style={{ fontSize: "1.2rem", fontWeight: "400" }}>{FormatPhoneNumber(updateProfileData?.phone)}</h2>
                            <p style={{ paddingLeft: "20px", textDecoration: "underline", cursor: "pointer", color: "#0b5394" }}>Thay đổi</p>
                        </div>

                    </div>
                    <div className='user-info'>
                        <div className='input-title'><h2 className='subtitle is-5'>Email:</h2></div>
                        <div className='input-area'><input onChange={(e) => handleInputChange("email", e)} value={updateProfileData.email} class="input" type="text"></input></div>

                    </div>
                    <div className='user-info'>
                        <div className='input-title'><h2 className='subtitle is-5'>Địa chỉ:</h2></div>
                        <div className='input-area'><input value={updateProfileData.address} onChange={(e) => handleInputChange("address", e)} class="input" placeholder='Hãy nhập địa chỉ' type="text"></input></div>

                    </div>
                </div>
                <div>
                    <figure class="image preview-img-profile is-256x256" style={{ cursor: "pointer" }}>
                        <Button
                            onClick={handleUploadImages}
                            sx={{
                                backgroundImage: `url(${selectedImage || updateProfileData.avatar})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                width: '260px',
                                height: '260px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                border: '2px dashed #9F78FF',
                            }}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                            />
                            <AddPhotoAlternateIcon
                                fontSize="large"
                                sx={{ ...buttonStyle, color: '#9F78FF', opacity: 0.8 }}
                            />
                        </Button>
                    </figure>
                </div>
            </div>


            <div className='save-btn'>
                <div style={{ position: "absolute", bottom: "0", alignContent: "center" }}>
                    <button className='button btn-change' onClick={handleUpdatePersonalProfile}>Lưu thay đổi &nbsp;
                        {buttonLoading ? (
                            <Spin
                                indicator={
                                    <LoadingOutlined
                                        style={{
                                            fontSize: 15,
                                            color: "#fff"
                                        }}
                                        spin
                                    />
                                }
                            />
                        ) : ""}</button>
                </div>

            </div>

        </>
    )
}
