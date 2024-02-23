import React, { useEffect, useState } from 'react'
import Banner10 from "../../../assets/images/banner-blog/surprised-curly-woman-beret-looks-left-charming-lady-pink-sweater-sunglasses-green-skirt-holds-grey-handbag.jpg"
import './blog.css'
import ViewBtn from "../../../assets/images/banner-blog/top-right.png"
import Fab from '@mui/material/Fab';
import Typography from '@mui/material/Typography'
import Blog1 from "../../../assets/images/banner-blog/female-fashion-designer-working-studio-sitting-desk.jpg"
import Blog2 from "../../../assets/images/banner-blog/three-young-beautiful-smiling-girls-trendy-summer-casual-jeans-clothes-sexy-carefree-women-posing-positive-models-sunglasses.jpg"
import Blog3 from "../../../assets/images/banner-blog/portrait-handsome-smiling-stylish-young-man-model-dressed-jeans-clothes-fashion-man.jpg"
import { Link } from 'react-router-dom';
import ScrollReveal from 'scrollreveal';

export default function Blog() {
    useEffect(() => {
        ScrollReveal().reveal('.blog-container', {
            duration: 2500,
            distance: '60px',
            scale: 0.85,
            easing: 'cubic-bezier(0.5, 0, 0, 1)',
            mobile: true,
        });
    }, []);
    const [blogsData, setBlogsData] = useState('')
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch("https://etailorapi.azurewebsites.net/api/blog", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log("blogs:", data)
                    setBlogsData(data);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchBlogs();
    }, []);


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('vi-VI', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

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
                    {blogsData && blogsData.map((blog, index) => {
                        return (
                            <div className='blog-items' key={index}>
                                <Link to={`/blog/${blog.id}`}>
                                    <div className='blog-items-img'>
                                        <img src={blog.thumbnail} alt={`Blog ${index + 1}`} />
                                    </div>
                                    <div className='blog-items-des'>
                                        <p className='title is-4'>{blog.title}</p>
                                        <p className='blog-description'>Ngày đăng: {formatDate(blog.createdTime)}</p>
                                    </div>
                                </Link>
                            </div>
                        )
                    })}



                </div>
            </div>
        </div>
    )
}
