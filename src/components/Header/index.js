import React, { useState } from 'react'
import "./index.css"
import Logo from "../../assets/logo.png"
import { Link } from 'react-router-dom'
const Header = () => {
    const [clickedSection, setClickedSection] = useState("Trang Chu")
    console.log('Section:', clickedSection)

    return (
        <nav className='mobile'>
            <div className='header-container'>
                <div className='header-logo'>
                    <figure className="image is-128x128">
                        <img className="is-rounded" src={Logo}></img>
                    </figure>
                </div>
                <div className='header-menu'>
                    <div className='navbar-item'>
                        <Link to="/#" onClick={() => setClickedSection("Trang Chu")}>
                            <h1 className="subtitle is-4 " style={{ color: clickedSection === "Trang Chu" ? "#000000" : "#999999" }}>
                                Trang chủ
                            </h1>
                        </Link>
                    </div>

                    <div className='navbar-item'>
                        <Link to="/#" onClick={() => setClickedSection("Bai Viet")} >
                            <h1 className="subtitle is-4"  style={{ color: clickedSection === "Bai Viet" ? "#000000" : "#999999" }}>
                                Bài viết
                            </h1>
                        </Link>
                    </div>
                    <div className='navbar-item'>
                        <Link to="/#" onClick={() => setClickedSection("Lien He")}>
                            <h1 className="subtitle is-4 "  style={{ color: clickedSection === "Lien He" ? "#000000" : "#999999" }}>
                                Liên hệ
                            </h1>
                        </Link>
                    </div>
                    <div className="navbar-item has-dropdown is-hoverable">
                        <div className='navbar-item' >
                            <Link className='nav-link' to="/#" onClick={() => setClickedSection("Dat May")}>
                                <h1 className="subtitle is-4 "  style={{ color: clickedSection === "Dat May" ? "#000000" : "#999999" }}>
                                    Đặt may
                                </h1>
                            </Link>
                        </div>

                        <div className="navbar-dropdown is-boxed">
                            <a className="navbar-item">
                                About
                            </a>
                            <a className="navbar-item">
                                Jobs
                            </a>
                            <a className="navbar-item">
                                Contact
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </nav >

    )
}

export default Header
