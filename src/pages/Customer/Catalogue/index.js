import React from 'react'
import './index.css'

import AoThun from '../../../assets/images/catalogues/ao-thun.jpg'
import AoDai from '../../../assets/images/catalogues/ao-dai.jpg'
import QuanTay from '../../../assets/images/catalogues/quan-tay.jpg'
import Suit from '../../../assets/images/catalogues/istockphoto-1213129801-2048x2048.jpg'

export default function Catalogue() {
    return (
        <>
            <div>

            </div>
            <div className='catalog-container'>
                <div className='catalog-section-1'>
                    <div className='catalog-1'>
                        <img style={{ width: "720px", height: "380px" }} width={720} height={383} src={AoThun}></img>
                    </div>

                    <div className='catalog-1' >
                        <img style={{ width: "720px", height: "380px" }} width={720} height={383} src={Suit}></img>
                    </div>
                </div>

            </div>
        </>
    )
}
