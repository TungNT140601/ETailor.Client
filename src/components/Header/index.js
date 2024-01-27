import React, { useState } from 'react'
import "./index.css"
import Logo from "../../assets/logo.png"
import { Link } from 'react-router-dom'
import ShoppingBag from "../../assets/images/shopping-bag.png"
import Login from '../../pages/Customer/Login/Login'
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import UserLogo from '../../assets/images/user.png'
import MenuDropIcon from '../../assets/images/caret-down.png'

const Header = () => {
    const [clickedSection, setClickedSection] = useState("Trang Chu")
    const [open, setOpen] = React.useState(false);
    const customer = localStorage.getItem("customer")
    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false)
    };
    return (
        <nav className='mobile'>
            <div className='header-container'>
                <div className='header-menu-wrapper'>
                    <div className='header-logo'>
                        <Link to="/">
                            <figure className="image is-128x128">
                                <img className="is-rounded" src={Logo}></img>
                            </figure>
                        </Link>

                    </div>

                    <div className='header-menu'>
                        <div className='navbar-item'>
                            <Link to="/" onClick={() => setClickedSection("Trang Chu")} >
                                <h1 className="subtitle is-5 " style={{ color: clickedSection === "Trang Chu" ? "#9F78FF" : "#1D2547" }}>
                                    TRANG CHỦ
                                </h1>
                            </Link>
                        </div>

                        <div className='navbar-item'>
                            <Link to="/#" onClick={() => setClickedSection("Bai Viet")} >
                                <h1 className="subtitle is-5" style={{ color: clickedSection === "Bai Viet" ? "#9F78FF" : "#1D2547" }}>
                                    BÀI VIẾT
                                </h1>
                            </Link>
                        </div>
                        <div className='navbar-item'>
                            <Link to="/#" onClick={() => setClickedSection("Lien He")} >
                                <h1 className="subtitle is-5 " style={{ color: clickedSection === "Lien He" ? "#9F78FF" : "#1D2547" }}>
                                    LIÊN HỆ
                                </h1>
                            </Link>
                        </div>
                        <div className="navbar-item has-dropdown is-hoverable">
                            <div className='navbar-item' >
                                <div style={{ height: "auto" }}>
                                    <Link className='nav-link' to="/catalogue" onClick={() => setClickedSection("Dat May")}>
                                        <h1 className="subtitle is-5 " style={{ color: clickedSection === "Dat May" ? "#9F78FF" : "#1D2547" }}>
                                            ĐẶT MAY <img width={15} height={15} src={MenuDropIcon}></img>
                                        </h1>
                                    </Link>
                                </div>

                            </div>

                            <div className="navbar-dropdown is-boxed" style={{ zIndex: "9999999999999999" }}>
                                <a className="navbar-item">
                                    Áo sơ mi
                                </a>
                                <a className="navbar-item">
                                    Áo vest
                                </a>
                                <a className="navbar-item">
                                    Áo dài
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='header-end'>
                    {customer ? (
                        <div style={{ height: 'auto' }}>
                            <Dropdown>
                                <MenuButton className="user-logo" sx={{ border: "none" }}>
                                    <img src={UserLogo} width={30} height={30}></img>
                                </MenuButton>
                                <Menu sx={{ zIndex: 100000000 }}>
                                    <Link to="/profile">
                                        <MenuItem>Profile</MenuItem>
                                    </Link>
                                    <Link to="/profile">
                                        <MenuItem>
                                            My account
                                        </MenuItem>
                                    </Link>
                                    <MenuItem>Logout</MenuItem>
                                </Menu>
                            </Dropdown>
                        </div>
                    ) : (
                        <div className='navbar-items login'>
                            <h1 className='subtitle is-5' onClick={handleOpen}>Đăng nhập</h1>

                        </div>
                    )}


                    <div className='navbar-items'>
                        <button className="button is-rounded is-medium wrapper-shopping">
                            <img src={ShoppingBag}></img>
                            <p style={{ paddingLeft: 10, color: '#FFFFFF' }}>0</p>
                        </button>

                    </div>

                </div>
            </div>
            {open && <Login openModal={handleOpen} closeModal={handleClose} />}
        </nav >

    )
}

export default Header
