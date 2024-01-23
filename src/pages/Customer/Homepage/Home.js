import React, { useRef, useState, useEffect } from 'react';
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
import CatalogType1 from '../../../assets/images/catalog-type/414110991e17d3770d91742e46c39121.jpg'
import CatalogType2 from '../../../assets/images/catalog-type/e71121ea0e13b8391dc7e1f8026fe4c8.jpg'
import CatalogType3 from '../../../assets/images/catalog-type/9294174f7778b13ee82e7861b749603f.jpg'
import CatalogType4 from '../../../assets/images/catalog-type/vest.jpg'
import ScrollReveal from 'scrollreveal';


const HomePage = () => {
    const [isHovered, setIsHovered] = useState(0)
    const handleHovered = (num) => {
        setIsHovered(num)
    }
    const handleHoveredOut = () => {
        setIsHovered(0)
    }


    const [catalogHover, setCatalogHover] = useState(0)

    const handleCatalogHover = (num) => {
        setCatalogHover(num)
    }

    const handleCatalogHoverOut = () => {
        setCatalogHover(0)
    }
    useEffect(() => {
        const handleScroll = () => {
            const element = document.querySelector('.wrapper-body');
            if (element.getBoundingClientRect().top < window.innerHeight / 2) {
                ScrollReveal().reveal('.catalog-wrapper', {
                    duration: 1500,
                    distance: '20px',
                    scale: 0.85,
                    easing: 'cubic-bezier(0.5, 0, 0, 1)',
                    mobile: true,
                });
                window.removeEventListener('scroll', handleScroll);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <div className='homepage-container'>
                <div className='wrapper-main'>
                    <div className='banner-swiper'>

                        <button className='btn-main' style={{ zIndex: "10", position: "absolute", bottom: "30px", left: "43.5%" }}>ĐẶT MAY NGAY</button>
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
                    {/* <div className='step-des'>
                        <div className='image-container'>
                            <img src={Step1Img} onMouseEnter={() => { handleHovered(1) }} onMouseLeave={handleHoveredOut} className="step-img"></img>
                        </div>

                        <div className='step-detail'>
                            <div className={`${isHovered === 1 ? "dot-hover" : "dot"} `}>
                                <p>1</p>
                            </div>
                            <h1 className={`title is-3 ${isHovered === 1 ? "text-hover" : ""}`} style={{ color: "#1D2547" }}> Lấy số đo</h1>
                        </div>
                        <div>
                            <h1 className='subtitle is-6'> Lấy số đo</h1>
                        </div>
                    </div>
                    <div className='step-des'>
                        <div className='image-container'>
                            <img src={Step2Img} onMouseEnter={() => { handleHovered(2) }} onMouseLeave={handleHoveredOut} className="step-img"></img>
                        </div>

                        <div className='step-detail'>
                            <div className={`${isHovered === 2 ? "dot-hover" : "dot"} `}>
                                <p>2</p>
                            </div>
                            <h1 className={`title is-3 ${isHovered === 2 ? "text-hover" : ""}`} style={{ color: "#1D2547" }}>Xử lý vải</h1>
                        </div>
                        <div>
                            <h1 className='subtitle is-6'> Lấy số đo</h1>
                        </div>
                    </div>
                    <div className='step-des'>
                        <div className='image-container'>
                            <img src={Step3Img} onMouseEnter={() => { handleHovered(3) }} onMouseLeave={handleHoveredOut} className="step-img"></img>
                        </div>
                        <div className='step-detail'>
                            <div className={`${isHovered === 3 ? "dot-hover" : "dot"} `}>
                                <p>3</p>
                            </div>
                            <h1 className={`title is-3 ${isHovered === 3 ? "text-hover" : ""}`} style={{ color: "#1D2547" }}> Hoàn thiện </h1>
                        </div>
                        <div>
                            <h1 className='subtitle is-6'> Lấy số đo</h1>
                        </div>
                    </div> */}
                    <div className='catalog-wrapper'>
                        <img style={{ height: "375px", width: "275px", borderRadius: "5px", boxShadow: "5px 10px 18px #888888" }} src={CatalogType1}></img>


                        <div className='catalog-wrapper-btn'>
                            <button className='btn-main'>ĐẶT MAY</button>
                        </div>
                        <div className='details'>
                            <span className='title'>Áo sơ mi</span>
                        </div>

                    </div>
                    <div className='catalog-wrapper'>
                        <img style={{ height: "375px", width: "275px", borderRadius: "5px", boxShadow: "5px 10px 18px #888888" }} src={CatalogType2}></img>


                        <div className='catalog-wrapper-btn'>
                            <button className='btn-main'>ĐẶT MAY</button>
                        </div>
                        <div className='details'>
                            <span className='title'>Áo dài</span>
                        </div>
                    </div>
                    <div className='catalog-wrapper'>
                        <img style={{ height: "375px", width: "275px", borderRadius: "5px", boxShadow: "5px 10px 18px #888888" }} src={CatalogType3}></img>


                        <div className='catalog-wrapper-btn'>
                            <button className='btn-main'>ĐẶT MAY</button>
                        </div>
                        <div className='details'>
                            <span className='title'>Quần tây</span>
                        </div>
                    </div>
                    <div className='catalog-wrapper'>
                        <img style={{ height: "375px", width: "275px", borderRadius: "5px", boxShadow: "5px 10px 18px #888888" }} src={CatalogType4}></img>


                        <div className='catalog-wrapper-btn'>
                            <button className='btn-main'>ĐẶT MAY</button>
                        </div>
                        <div className='details'>
                            <span className='title'>Áo vest</span>
                        </div>
                    </div>
                </div >
                <div className='wrapper-container-content'>
                    <div className='product-title'>
                        <p className='title is-2'>HI</p>
                    </div>
                </div>
            </div >
        </>
    )
}

export default HomePage
