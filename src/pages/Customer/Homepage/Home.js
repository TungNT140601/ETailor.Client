import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Banner1 from '../../../assets/images/6782271.jpg'
import Banner2 from '../../../assets/images/824.jpg'
import './home.css';
import Step1Img from '../../../assets/images/offers1.png'
import Step2Img from '../../../assets/images/offers2.png'
import Step3Img from '../../../assets/images/offers3.png'
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
const HomePage = () => {
    return (
        <>
            <div className='homepage-container'>
                <div className='wrapper-main'>
                    <div className='banner-swiper'>
                        <Swiper
                            spaceBetween={30}
                            centeredSlides={true}
                            autoplay={{
                                delay: 2500,
                                disableOnInteraction: false,
                            }}
                            pagination={{
                                clickable: true,
                            }}
                            modules={[Autoplay, Pagination, Navigation]}
                            className="mySwiper"
                        >
                            <SwiperSlide>
                                <img src={Banner1}>
                                </img>
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src={Banner2}>
                                </img>
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </div>
                <div className='wrapper-body'>
                    <div>
                        <img src={Step1Img}></img>
                    </div>
                    <div>   <img src={Step2Img}></img></div>
                    <div>   <img src={Step3Img}></img></div>
                </div>
            </div>
        </>
    )
}

export default HomePage
