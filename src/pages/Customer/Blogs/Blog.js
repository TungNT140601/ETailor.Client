import React from 'react'
import Banner10 from "../../../assets/images/banner-blog/surprised-curly-woman-beret-looks-left-charming-lady-pink-sweater-sunglasses-green-skirt-holds-grey-handbag.jpg"
import './blog.css'
import ViewBtn from "../../../assets/images/banner-blog/top-right.png"
import Fab from '@mui/material/Fab';
import Typography from '@mui/material/Typography'
import Blog1 from "../../../assets/images/banner-blog/female-fashion-designer-working-studio-sitting-desk.jpg"
import Blog2 from "../../../assets/images/banner-blog/three-young-beautiful-smiling-girls-trendy-summer-casual-jeans-clothes-sexy-carefree-women-posing-positive-models-sunglasses.jpg"
import Blog3 from "../../../assets/images/banner-blog/portrait-handsome-smiling-stylish-young-man-model-dressed-jeans-clothes-fashion-man.jpg"
import { Link } from 'react-router-dom';

export default function Blog() {
    return (
        <div style={{ paddingTop: "140px" }}>
            <div className='flex'>
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
                            <span style={{ color: "#eab676" }}>De</span>lovely.

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
                        <button className='button' style={{ backgroundColor: "#b19fca", color: "#fff", borderRadius: "20px" }}>
                            Tìm hiểu thêm
                        </button>
                    </div>
                    <img src={Banner10}></img>

                </div>
            </div>

            <div>
                <p className='subtitle is-3' style={{ padding: "80px 0 20px 80px", margin: 0 }}>
                    Bài viết gần đây
                </p>
                <div className='blog-container'>
                    <div className='blog-items'>
                        <Link to="/blog/blog-id">
                            <div className='blog-items-img'>
                                <img src={Blog1}></img>
                            </div>
                            <div className='blog-items-des'>
                                <p className='title is-4'>Làm chủ phong cách của bạn</p>
                                <p className='blog-description'>10/1/2024</p>
                            </div>
                        </Link>


                    </div>

                    <div className='blog-items'>
                        <div className='blog-items-img'>
                            <img src={Blog2}></img>
                        </div>
                        <div className='blog-items-des'>
                            <p className='title is-4'>Làm chủ phong cách của bạnLàm chủ phong cách của bạnLàm chủ phong cách của bạnLàm chủ phong cách của bạn</p>
                        </div>

                    </div>

                    <div className='blog-items'>
                        <div className='blog-items-img'>
                            <img src={Blog3}></img>
                        </div>
                        <div className='blog-items-des'>
                            <p className='title is-4'>Làm chủ phong cách của bạnLàm chủ phong cách của bạnLàm chủ phong cách của bạnLàm chủ phong cách của bạn</p>
                        </div>

                    </div>
                    <div className='blog-items'>
                        <div className='blog-items-img'>
                            <img src={Blog1}></img>
                        </div>
                        <div className='blog-items-des'>
                            <p className='title is-4'>Làm chủ phong cách của bạnLàm chủ phong cách của bạnLàm chủ phong cách của bạnLàm chủ phong cách của bạn</p>
                        </div>

                    </div>
                    <div className='blog-items'>
                        <div className='blog-items-img'>
                            <img src={Blog2}></img>
                        </div>
                        <div className='blog-items-des'>
                            <p className='title is-4'>Làm chủ phong cách của bạnLàm chủ phong cách của bạnLàm chủ phong cách của bạnLàm chủ phong cách của bạn</p>
                        </div>

                    </div>
                    <div className='blog-items'>
                        <div className='blog-items-img'>
                            <img src={Blog3}></img>
                        </div>
                        <div className='blog-items-des'>
                            <p className='title is-4'>Làm chủ phong cách của bạnLàm chủ phong cách của bạnLàm chủ phong cách của bạnLàm chủ phong cách của bạn</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
