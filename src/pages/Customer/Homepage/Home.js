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
    const [isHovered, setIsHovered] = useState(0)
    const handleHovered = (num) => {
        setIsHovered(num)
    }
    const handleHoveredOut = () => {
        setIsHovered(0)
    }
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
                    <div className='step-des'>
                        <img src={Step1Img} onMouseEnter={() => { handleHovered(1) }} onMouseLeave={handleHoveredOut} className="step-img"></img>
                        <div>
                            <h1 className={`title is-3 ${isHovered === 1 ? "text-hover" : ""}`} style={{ color: "#1D2547" }}><span className={`${isHovered === 1 ? "dot-hover" : "dot"} `}><p>1</p></span>  Lấy số đo</h1>
                        </div>
                        <div>
                            <h1 className='subtitle is-6'> Lấy số đo</h1>
                        </div>
                    </div>
                    <div className='step-des'>
                        <img src={Step2Img} onMouseEnter={() => { handleHovered(2) }} onMouseLeave={handleHoveredOut} className="step-img"></img>
                        <div>
                            <h1 className={`title is-3 ${isHovered === 2 ? "text-hover" : ""}`} style={{ color: "#1D2547" }}><span className={`${isHovered === 2 ? "dot-hover" : "dot"} `}>2</span>  Lấy số đo</h1>
                        </div>
                        <div>
                            <h1 className='subtitle is-6'> Lấy số đo</h1>
                        </div>
                    </div>
                    <div className='step-des'>
                        <img src={Step3Img} onMouseEnter={() => { handleHovered(3) }} onMouseLeave={handleHoveredOut} className="step-img"></img>
                        <div>
                            <h1 className={`title is-3 ${isHovered === 3 ? "text-hover" : ""}`} style={{ color: "#1D2547" }}><span className={`${isHovered === 3 ? "dot-hover" : "dot"} `}>3</span>  Lấy số đo</h1>
                        </div>
                        <div>
                            <h1 className='subtitle is-6'> Lấy số đo</h1>
                        </div>
                    </div>
                </div >
            </div >
        </>
    )
}

export default HomePage
