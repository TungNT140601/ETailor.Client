import React, { useState, useRef, useEffect } from "react";
import "./index.css";
import AoThun from "../../../assets/images/catalogues/ao-thun.jpg";
import AoDai from "../../../assets/images/catalogues/ao-dai.jpg";
import QuanTay from "../../../assets/images/catalog-type/9294174f7778b13ee82e7861b749603f.jpg";
import AoKhoac from "../../../assets/images/catalog-type/414110991e17d3770d91742e46c39121.jpg";
import Suit from "../../../assets/images/catalogues/istockphoto-1213129801-2048x2048.jpg";
import { Link } from "react-router-dom";
import { Virtual, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import Loading from "../LoadingComponent/loading";

export default function Catalogue() {
  const [swiperRef, setSwiperRef] = useState(null);
  const appendNumber = useRef(500);
  const prependNumber = useRef(1);
  const [templatesData, setTemplatesData] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(
          "https://localhost:7259/api/template-management/get-all-template",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setTemplatesData(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const [slides, setSlides] = useState(
    Array.from({ length: 5 }).map((_, index) => `Slide ${index + 1}`)
  );
  console.log("Silede:", slides);
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
    setSlides([...slides, "Slide " + ++appendNumber.current]);
  };

  const slideTo = (index) => {
    swiperRef.slideTo(index - 1, 0);
  };

  return (
    <>
      {loading ? (
        <div style={{ paddingTop: "300px" }}>
          <Loading />
        </div>
      ) : (
        <div className="catalog-container" style={{ paddingTop: "100px" }}>
          {templatesData &&
            templatesData.map((template, index) => {
              return (
                <div>
                  <div className="header-catalog-title">
                    <div className="catalog-title">
                      <h1
                        style={{
                          left: 0,
                          color: "#140c40",
                          borderBottom: "2px solid #140c40",
                          paddingBottom: "5px",
                          fontSize: '18px',  
                          fontWeight: 600,
                          lineHeight: 1.125,  
                        }}
                      >
                        {template.name}
                      </h1>
                    </div>

                    {/* <div className='view-more-btn'>
                                                <p className='title is-4' >Tất cả</p>
                                            </div> */}
                  </div>
                  <div className="catalog-section-1">
                    <Swiper
                      modules={[Virtual, Navigation, Pagination]}
                      onSwiper={setSwiperRef}
                      slidesPerView={4}
                      centeredSlides={true}
                      pagination={{
                        type: "fraction",
                      }}
                      spaceBetween={40}
                      navigation={true}
                      virtual
                      initialSlide={2}
                      style={{ overflow: "unset" }}
                    >
                      {template?.productTemplates &&
                        template.productTemplates.map((slideContent, index) => (
                          <SwiperSlide key={slideContent} virtualIndex={index}>
                            <div>
                              <Link to={`/catalogue/${slideContent.urlPath}`}>
                                <div className="card">
                                  <div
                                    className="card-image"
                                    style={{
                                      height: "262px",
                                      width: "350px",
                                      overflow: "hidden",
                                    }}
                                  >
                                    <figure className="image is-4by3">
                                      <img
                                        src={slideContent.thumbnailImage}
                                        alt="temp"
                                      ></img>
                                    </figure>
                                  </div>
                                  <div
                                    className="card-content"
                                    style={{ padding: "10px 24px 10px 24px" }}
                                  >
                                    <div className="media">
                                      <div className="media-content">
                                        <p className="title is-4">
                                          {slideContent.name}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="content">
                                      {slideContent.description}
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
              );
            })}
        </div>
      )}
    </>
  );
}
