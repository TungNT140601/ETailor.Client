import React from 'react'
import "./index.css"
import Logo from "../../assets/logo.png"
import { Link } from 'react-router-dom'
const Header = () => {
    return (
        <div className='header-container'>
            <div className='header-logo'>
                <figure class="image is-128x128">
                    <img class="is-rounded" src={Logo}></img>
                </figure>
            </div>
            <div className='header-menu'>
                <Link to="/#">
                    <h1 class="subtitle is-4">
                        Trang chủ
                    </h1>
                </Link>
                <Link to="/#">
                    <h1 class="subtitle is-4">
                        Trang chủ
                    </h1>
                </Link>
                <Link to="/#">
                    <h1 class="subtitle is-4">
                        Trang chủ
                    </h1>
                </Link>
            </div>
        </div>
    )
}

export default Header
