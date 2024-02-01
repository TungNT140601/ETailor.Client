import React from 'react'
import Banner10 from "../../../assets/images/banner-blog/surprised-curly-woman-beret-looks-left-charming-lady-pink-sweater-sunglasses-green-skirt-holds-grey-handbag.jpg"
import './blog.css'
import ViewBtn from "../../../assets/images/banner-blog/top-right.png"
import Fab from '@mui/material/Fab';
import Typography from '@mui/material/Typography'

export default function Blog() {
    return (
        <div style={{ paddingTop: "140px" }} className='flex'>
            <div className='blog-banner-wrapper'>
                <div className='view-blog-btn'>
                    <Fab color="primary">
                        <img src={ViewBtn} ></img>
                    </Fab>
                </div>
                <div className='blog-banner-title'>
                    <Typography
                        sx={{
                            fontSize: '65px',
                            display: 'inline',
                            fontStyle: 'italic',
                            paddingLeft: '5px',
                            color: '#fff',
                            fontWeight: '600',

                        }}
                    >
                        <span style={{ color: "#eab676" }}>De</span> lovely.

                    </Typography>

                    <br />
                    <Typography
                        sx={{
                            fontSize: '55px',
                            display: 'inline',
                            fontStyle: 'italic',
                            paddingLeft: '5px',
                            color: '#fff',
                            fontWeight: '600',

                        }}
                    >
                        <span style={{ color: "#eab676" }}>De</span>licious.

                    </Typography>
                    <br />
                    <Typography
                        sx={{
                            fontSize: '45px',
                            display: 'inline',
                            fontStyle: 'italic',
                            paddingLeft: '5px',
                            color: '#fff',
                            fontWeight: '600',

                        }}
                    >
                        <span style={{ color: "#eab676" }}>De</span>lightful.

                    </Typography>
                </div>
                <div className='blog-readmore-btn'>
                    <button className='button' style={{ backgroundColor: "#b19fca", color: "#fff", borderRadius:"20px" }}>
                        Tìm hiểu thêm
                    </button>
                </div>
                <img src={Banner10}></img>

            </div>
        </div>
    )
}
