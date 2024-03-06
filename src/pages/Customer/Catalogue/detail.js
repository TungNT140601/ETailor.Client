import React, { useEffect, useState } from "react";
import "./detail.css";
import { useParams } from "react-router-dom";
import NoData from "../../../assets/images/nodata.jpg";
import Loading from "../LoadingComponent/loading";
import { Button, Popover, Space } from "antd";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
export default function ProductDetail() {
  const [isLoading, setIsLoading] = useState(true);
  const [productData, setProductData] = useState("");
  const [imgData, setImgData] = useState("");
  const [componentData, setComponentData] = useState("");
  const [selectedImg, setSelectedImg] = useState("");
  const { id } = useParams();
  function formatCurrency(amount) {
    if (amount) {
      const strAmount = amount.toString();
      const parts = [];
      for (let i = strAmount.length - 1, j = 0; i >= 0; i--, j++) {
        if (j > 0 && j % 3 === 0) {
          parts.unshift(".");
        }
        parts.unshift(strAmount[i]);
      }
      return parts.join("") + "đ";
    }
    return null;
  }
  useEffect(() => {
    const fetchDetailProduct = async () => {
      try {
        const response = await fetch(
          `https://etailorapi.azurewebsites.net/api/template-management/get-template/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log("detail:", typeof data.template);
          setProductData(data?.template);
          setComponentData(data.component);
          setImgData(JSON.parse(data?.template.image));
          setSelectedImg(JSON.parse(data?.template.image)[0]);
        }
      } catch (error) {
        console.error("Error:", error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetailProduct();
  }, []);
  const handleSelectedImg = (img) => {
    setSelectedImg(img);
  };
  console.log("COMPONENT:", componentData);
  return (
    <>
      {isLoading ? (
        <div style={{ paddingTop: "300px" }}>
          <Loading />
        </div>
      ) : (
        <div style={{ paddingTop: "140px" }}>
          <div style={{ height: "60px", paddingLeft: "60px" }}>
            <nav
              className="breadcrumb has-bullet-separator"
              aria-label="breadcrumbs"
            >
              <ul>
                <li>
                  {" "}
                  <a href="#" style={{ color: "#000000" }}>
                    Trang Chủ
                  </a>
                </li>
                <li>
                  {" "}
                  <a href="#" style={{ color: "#000000" }}>
                    Áo sơ mi nam
                  </a>
                </li>

                <li className="is-active" style={{ fontWeight: "bold" }}>
                  {" "}
                  <a href="#" style={{ color: "#000000" }} aria-current="page">
                    Áo sơ mi
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div className="product-detail-wrapper">
            <div className="product-detail-items">

            </div>
            <div className="product-detail-items">
              <div>
                <figure className="image is-5by4">
                  <img
                    style={{
                      borderRadius: "5px",
                      objectFit: "cover",
                      boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.1)",
                      maxHeight: 450,
                      maxWidth: 450
                    }}
                    src={selectedImg}
                  ></img>
                </figure>
              </div>

              <div
                className="product-detail-preview"
                style={{ marginLeft: "10px" }}
              >
                {imgData && imgData.length > 6 ? (
                  <Swiper
                    rewind={true}
                    navigation={true}
                    modules={[Navigation]}
                    className="mySwiper1"
                    slidesPerView={6}
                  >
                    {imgData.map((img, index) => (
                      <Space wrap key={index}>
                        <Popover title={img.name} trigger="hover">
                          <SwiperSlide>
                            <figure
                              className="image is-64x64"
                              style={{ marginBottom: "10px", objectFit: 'contain', marginLeft: 10, maxHeight: 64, maxWidth: 64, overflow: 'hidden', borderRadius: 10 }}
                              onMouseEnter={() => {
                                handleSelectedImg(img);
                              }}
                            >
                              <img
                                src={img}
                                style={{
                                  boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.25)",
                                  width: "64px",
                                  height: "64px"
                                }}
                                alt=""
                              />
                            </figure>
                          </SwiperSlide>
                        </Popover>
                      </Space>
                    ))}
                  </Swiper>
                ) : (
                  imgData.map((img, index) => (
                    <Space wrap key={index}>
                      <Popover title={img.name} trigger="hover">
                        <figure
                          className="image is-64x64"
                          style={{ marginBottom: "10px", objectFit: 'contain', marginLeft: 10, maxHeight: 64, maxWidth: 64, overflow: 'hidden', borderRadius: 10 }}
                          onMouseEnter={() => {
                            handleSelectedImg(img);
                          }}
                        >
                          <img
                            src={img}
                            style={{
                              boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.25)",
                              width: "64px",
                              height: "64px"
                            }}
                            alt=""
                          />
                        </figure>
                      </Popover>
                    </Space>
                  ))
                )}

              </div>
            </div>
            <div className="product-detail-items">
              <div style={{ paddingLeft: "50px" }}>
                <p
                  className="title is-1"
                  style={{ margin: 0, paddingBottom: "5px" }}
                >
                  {productData.name}
                </p>
                <p
                  className="has-text-weight-light is-6"
                  style={{ margin: 0, paddingBottom: "5px" }}
                >
                  {productData.description}
                </p>
                <p
                  className="subtitle is-4"
                  style={{ margin: 0, paddingBottom: "5px" }}
                >
                  $ {formatCurrency(productData?.price)}
                </p>
                <div>
                  {componentData &&
                    componentData.map((component, index) => {
                      return (
                        <>
                          <p
                            className="has-text-weight-light is-6"
                            style={{ margin: 0, paddingBottom: "5px" }}
                          >
                            Các loại {component.name}
                          </p>
                          <div style={{ display: "flex" }}>
                            {component?.components &&
                              component?.components.map((img, index) => {
                                return (
                                  <div className="product-component-style-items">
                                    <figure
                                      className="image is-32x32"
                                      style={{
                                        overflowY: "hidden",
                                        borderRadius: "10px",
                                      }}
                                    >
                                      <img
                                        src={img?.image}
                                        alt=""
                                        style={{ objectFit: "cover" }}
                                      ></img>
                                    </figure>
                                  </div>
                                );
                              })}
                          </div>
                        </>
                      );
                    })}
                </div>
                <div style={{ marginTop: "60px" }}>
                  <button className="btn-contact ">Liên hệ đặt may</button>
                </div>
              </div>
            </div>
          </div>
        </div >
        //         ) : (
        //             <div style={{ paddingTop: "70px", width: "100vw", display: "flex", justifyContent: "center" }}>
        //                 <div style={{ width: "30%", textAlign: "center" }}>

        //                     <img style={{ zIndex: '-1', objectFit: "cover" }} width={'100%'} height={'100%'} src={NoData} alt='no data'></img>
        //                     <div>
        //                         <p className='subtitle is-4'>Không tìm thấy sản phẩm</p>
        //                     </div>
        //                 </div>

        //             </div>
        //         )
        //     }
        // </>
      )
      }
    </>
  );
}