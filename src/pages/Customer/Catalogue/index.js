import React from 'react'
import './index.css'

import AoThun from '../../../assets/images/catalogues/ao-thun.jpg'
import AoDai from '../../../assets/images/catalogues/ao-dai.jpg'
import QuanTay from '../../../assets/images/catalog-type/9294174f7778b13ee82e7861b749603f.jpg'
import AoKhoac from '../../../assets/images/catalog-type/414110991e17d3770d91742e46c39121.jpg'
import Suit from '../../../assets/images/catalogues/istockphoto-1213129801-2048x2048.jpg'
import { Link } from 'react-router-dom'

export default function Catalogue() {
    return (
        <>
            <div className='catalog-container'>
                <div className='header-catalog-title'>
                    <h1 className='title is-2' style={{ position: "absolute", left: 0, color: "rgb(159, 120, 255)", paddingLeft: "50px" }}>ÁO SƠ MI</h1>
                    <div className='view-more-btn'>
                        <p className='title is-4' >Xem thêm</p>
                    </div>


                </div>

                <div className='catalog-section-1'>

                    <div className='catalog-1'>
                        <Link>
                            <img style={{ width: "720px", height: "400px" }} width={720} height={400} src={QuanTay}></img>

                        </Link>

                    </div>

                    <div className='catalog-1' >
                        <img style={{ width: "720px", height: "400px" }} width={720} height={400} src={Suit}></img>

                    </div>
                    <div className='catalog-1' >
                        <img style={{ width: "720px", height: "400px" }} width={720} height={400} src={AoKhoac}></img>

                    </div>
                    <div className='catalog-1' >
                        <img style={{ width: "720px", height: "400px" }} width={720} height={400} src={AoDai}></img>

                    </div>

                </div>
                <div className='header-catalog-title'>
                    <h1 className='title is-2' style={{ position: "absolute", left: 0, color: "rgb(159, 120, 255)", paddingLeft: "50px" }}>ÁO DÀI</h1>
                    <div className='view-more-btn'>
                        <p className='title is-4' >Xem thêm</p>
                    </div>


                </div>

                <div className='catalog-section-1'>

                    <div className='catalog-1'>
                        <Link>
                            <img style={{ width: "720px", height: "400px" }} width={720} height={400} src={QuanTay}></img>

                        </Link>

                    </div>

                    <div className='catalog-1' >
                        <img style={{ width: "720px", height: "400px" }} width={720} height={400} src={Suit}></img>

                    </div>
                    <div className='catalog-1' >
                        <img style={{ width: "720px", height: "400px" }} width={720} height={400} src={AoKhoac}></img>

                    </div>
                    <div className='catalog-1' >
                        <img style={{ width: "720px", height: "400px" }} width={720} height={400} src={AoDai}></img>

                    </div>

                </div>
            </div>
        </>
    )
}
