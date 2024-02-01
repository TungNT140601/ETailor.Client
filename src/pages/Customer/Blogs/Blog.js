import React from 'react'
import Banner10 from "../../../assets/images/banner-blog/surprised-curly-woman-beret-looks-left-charming-lady-pink-sweater-sunglasses-green-skirt-holds-grey-handbag.jpg"
import './blog.css'
import ViewBtn from "../../../assets/images/banner-blog/top-right.png"
import Fab from '@mui/material/Fab';

export default function Blog() {
    return (
        <div style={{ paddingTop: "140px" }} className='flex'>
            <div className='blog-banner-wrapper'>
                <div className='view-blog-btn'>
                    <Fab color="primary">
                        <img src={ViewBtn} ></img>
                    </Fab>
                </div>

                <img src={Banner10}></img>

            </div>
        </div>
    )
}
