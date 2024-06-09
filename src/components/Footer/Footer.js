import React from 'react'

export default function Footer() {
    return (
        <div style={{ height: "200px", display: "flex", justifyContent: "center", marginTop: "120px" }}>
            <div style={{ backgroundColor: "#1d2547", width: "70%", color: "#fff", padding: "40px 80px 0 40px" }}>
                <p style={{ fontSize: 20, fontWeight: "bold" }}>Giới thiệu:</p>
                <p style={{ marginTop: 5 }}>E-tailor là thương hiệu với hơn 10 năm kinh nghiệm trong lĩnh vực thời trang cao cấp, tự hào mang đến cho quý khách những trang phục hoàn hảo nhất,</p>
                <p style={{ marginTop: 5 }}>Địa chỉ: 117/18 Phan Văn Hân, phường 17, Q.Bình Thạnh, TP. HCM</p>
                <p style={{ marginTop: 5 }}>Liên hệ: 0338 010 426</p>
                <p>No copyright © {new Date().getFullYear()}</p>
            </div>
        </div>
    )
}
