import React, { useEffect, useState } from "react";
import "./detail.css";
import { useParams } from "react-router-dom";
import NoData from "../../../assets/images/nodata.jpg";
import Loading from "../LoadingComponent/loading";
import { Button, Popover, Space, Divider, Image } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
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
          `https://e-tailorapi.azurewebsites.net/api/template-management/get-template/${id}`,
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
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const hide = () => {
    setClicked(false);
    setHovered(false);
  };
  const handleHoverChange = (open) => {
    setHovered(open);
    setClicked(false);
  };
  const handleClickChange = (open) => {
    setHovered(false);
    setClicked(open);
  };
  const hoverContent = <div>This is hover content.</div>;
  const clickContent = <div>This is click content.</div>;
  return (
    <>
      {isLoading ? (
        <div style={{ paddingTop: "300px" }}>
          <Loading />
        </div>
      ) : (
        <div style={{ paddingTop: "140px" }}>
          {/* <div style={{ height: "60px", paddingLeft: "60px" }}>
            <nav
              className="breadcrumb has-bullet-separator"
              aria-label="breadcrumbs"
            >
              <ul>
                <li>
                  {" "}
                  <a href="/" style={{ color: "#000000" }}>
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
          </div> */}
          <div className="product-detail-wrapper">
            <div className="product-detail-items"></div>
            <div className="product-detail-items">
              <div>
                <figure className="image is-5by4">
                  <img
                    style={{
                      borderRadius: "5px",
                      objectFit: "cover",
                      boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.1)",
                      maxHeight: 450,
                      maxWidth: 450,
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
                    {imgData && imgData.map((img, index) => (
                      <Space wrap key={index}>
                        <Popover title={img.name} trigger="hover">
                          <SwiperSlide>
                            <figure
                              className="image is-64x64"
                              style={{
                                marginBottom: "10px",
                                objectFit: "contain",
                                marginLeft: 10,
                                maxHeight: 64,
                                maxWidth: 64,
                                overflow: "hidden",
                                borderRadius: 10,
                              }}
                              onMouseEnter={() => {
                                handleSelectedImg(img);
                              }}
                            >
                              <img
                                src={img}
                                style={{
                                  boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.25)",
                                  width: "64px",
                                  height: "64px",
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
                          style={{
                            marginBottom: "10px",
                            objectFit: "contain",
                            marginLeft: 10,
                            maxHeight: 64,
                            maxWidth: 64,
                            overflow: "hidden",
                            borderRadius: 10,
                          }}
                          onMouseEnter={() => {
                            handleSelectedImg(img);
                          }}
                        >
                          <img
                            src={img}
                            style={{
                              boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.25)",
                              width: "64px",
                              height: "64px",
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
                  className="subtitle is-4"
                  style={{ margin: 0, paddingBottom: "5px" }}
                >
                  Giá tham khảo:  {formatCurrency(productData?.price)}
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
                            {component.name}
                          </p>
                          <div style={{ display: "flex" }}>
                            {component?.components &&
                              component?.components.map((img, index) => {
                                return (
                                  <>

                                    <div className="product-component-style-items">
                                      <Popover
                                        content={
                                          <div>
                                            <p>{img?.name}</p>
                                          </div>
                                        }
                                        trigger="hover"
                                        onOpenChange={handleHoverChange}
                                      >
                                        <figure
                                          className="image is-32x32"
                                          style={{
                                            overflow: "hidden",
                                            borderRadius: "10px",
                                            cursor: "pointer",
                                            objectFit: "fill"
                                          }}
                                        >
                                          <Image
                                            style={{ objectFit: "fill", zIndex: 1000000 }}
                                            src={img?.image ? img.image : "error"}
                                            fallback="data:image/png;base64,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"
                                          />
                                        </figure>
                                      </Popover>
                                    </div >

                                  </>
                                );
                              })}

                          </div >
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
          <div style={{ padding: "50px 100px 20px 100px" }}>
            <Divider plain>Mô tả</Divider>
            <p
              className="has-text-weight-light is-6"
              style={{ margin: 0, padding: "10px 100px 10px 100px" }}
            >
              {productData.description}
            </p>
          </div>
        </div>
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
      )}
    </>
  );
}
