import React, { useState, useRef } from 'react'
import './index.css'
import AoThun from '../../../assets/images/catalogues/ao-thun.jpg'
import AoDai from '../../../assets/images/catalogues/ao-dai.jpg'
import QuanTay from '../../../assets/images/catalog-type/9294174f7778b13ee82e7861b749603f.jpg'
import AoKhoac from '../../../assets/images/catalog-type/414110991e17d3770d91742e46c39121.jpg'
import Suit from '../../../assets/images/catalogues/istockphoto-1213129801-2048x2048.jpg'
import { Link } from 'react-router-dom'
import { Virtual, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

export default function Catalogue() {
    const [swiperRef, setSwiperRef] = useState(null);
    const appendNumber = useRef(500);
    const prependNumber = useRef(1);
    // Create array with 500 slides
    const [slides, setSlides] = useState(
        Array.from({ length: 5}).map((_, index) => `Slide ${index + 1}`)
    );

    const prepend = () => {
        setSlides([
            `Slide ${prependNumber.current - 2}`,
            `Slide ${prependNumber.current - 1}`,
            ...slides,
        ]);
        prependNumber.current = prependNumber.current - 2;
        swiperRef.slideTo(swiperRef.activeIndex + 2, 0);
    };

    const append = () => {
        setSlides([...slides, 'Slide ' + ++appendNumber.current]);
    };

    const slideTo = (index) => {
        swiperRef.slideTo(index - 1, 0);
    };

    return (
        <>
            <div className='catalog-container'>
                <div style={{ height: '100px', display: 'flex', color: "#140c40", justifyContent: "center", padding: "140px 0 40px 0" }} className='title is-1'>
                    <p>Sản phẩm mẫu</p>
                </div>
                <div style={{ paddingBottom: "20px" }}>
                    <div className='header-catalog-title' >
                        <div style={{ width: "150px", borderBottom: "2px solid #140c40", height: "40px", textAlign: "center", display: "flex" }}>
                            <h1 className='title is-3' style={{ position: "absolute", left: 0, color: "#140c40" }}>ÁO SƠ MI</h1>
                        </div>

                        <div className='view-more-btn'>
                            <p className='title is-4' >Tất cả</p>
                        </div>


                    </div>
                    <div className='catalog-section-1'>
                        <Swiper
                            modules={[Virtual, Navigation, Pagination]}
                            onSwiper={setSwiperRef}
                            slidesPerView={4}
                            centeredSlides={true}
                            pagination={{
                                type: 'fraction',
                            }}
                            spaceBetween={40}
                            navigation={true}
                            virtual
                            initialSlide={2}

                        >
                            {slides.map((slideContent, index) => (
                                <SwiperSlide key={slideContent} virtualIndex={index}>
                                    <div >
                                        <Link to="/catalogue/product">
                                            <div className="card">
                                                <div className="card-image" style={{ height: "232px", overflow: "hidden" }}>
                                                    <figure className="image is-4by3">
                                                        <img src={AoDai} alt="Placeholder image"></img>
                                                    </figure>
                                                </div>
                                                <div className="card-content">
                                                    <div className="media">
                                                        <div className="media-content">
                                                            <p className="title is-4">Áo sơ mi</p>

                                                        </div>
                                                    </div>

                                                    <div className="content">
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.

                                                    </div>
                                                </div>
                                            </div>
                                        </Link>

                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                    </div>
                </div>


                <div className='header-catalog-title' >
                    <div style={{ width: "15    0px", borderBottom: "2px solid #140c40", height: "40px", textAlign: "center", display: "flex" }}>
                        <h1 className='title is-3' style={{ position: "absolute", left: 0, color: "#140c40" }}>ÁO SƠ MI</h1>
                    </div>

                    <div className='view-more-btn'>
                        <p className='title is-4' >Tất cả</p>
                    </div>


                </div>
                <div className='catalog-section-1'>
                    <Swiper
                        modules={[Virtual, Navigation, Pagination]}
                        onSwiper={setSwiperRef}
                        slidesPerView={4}
                        centeredSlides={true}
                        pagination={{
                            type: 'fraction',
                        }}
                        spaceBetween={40}
                        navigation={true}
                        virtual
                        initialSlide={4}
                    >
                        {slides.map((slideContent, index) => (
                            <SwiperSlide key={slideContent} virtualIndex={index}>
                                <div >
                                    <Link to="">
                                        <div className="card">
                                            <div className="card-image" style={{ height: "232px", overflow: "hidden" }}>
                                                <figure className="image is-4by3">
                                                    <img src={AoDai} alt="Placeholder image"></img>
                                                </figure>
                                            </div>
                                            <div className="card-content">
                                                <div className="media">
                                                    <div className="media-content">
                                                        <p className="title is-4">Áo sơ mi</p>

                                                    </div>
                                                </div>

                                                <div className="content">
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.

                                                </div>
                                            </div>
                                        </div>
                                    </Link>

                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                </div>
            </div>
        </>

    )
}
