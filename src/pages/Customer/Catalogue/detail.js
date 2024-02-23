import React, { useEffect, useState } from 'react'
import './detail.css'
import { useParams } from 'react-router-dom'

function formatCurrency(amount) {
    console.log("Amount:", amount)
    const parts = amount.toString().split(/\B(?=(\d{3})+(?!\d))/);
    console.log("after join:", parts.join(".") + "đ")
    return parts.join(".") + "đ";
}
export default function ProductDetail() {
    const [productData, setProductData] = useState('')
    const [imgData, setImgData] = useState('')
    const [selectedImg, setSelectedImg] = useState('')
    const { id } = useParams();

    useEffect(() => {
        const fetchDetailProduct = async () => {
            try {
                const response = await fetch(`https://etailorapi.azurewebsites.net/api/template-management/get-template/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log("detail:", data)
                    setProductData(data);
                    setImgData(JSON.parse(data.image))
                    setSelectedImg(JSON.parse(data.image)[0])
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchDetailProduct();
    }, [])

    const handleSelectedImg = (img) => {
        setSelectedImg(img)
    }
    return (
        <>
            {productData ? (
                <div style={{ paddingTop: "140px" }}>
                    <div style={{ height: "60px", paddingLeft: "60px" }}>
                        <nav className="breadcrumb has-bullet-separator" aria-label="breadcrumbs">
                            <ul>
                                <li> <a href="#" style={{ color: "#000000" }}>Trang Chủ</a></li>
                                <li> <a href="#" style={{ color: "#000000" }}>Áo sơ mi nam</a></li>

                                <li className="is-active" style={{ fontWeight: "bold" }}> <a href="#" style={{ color: "#000000" }} aria-current="page">Áo sơ mi</a></li>
                            </ul>
                        </nav>
                    </div>
                    <div className='product-detail-wrapper'>
                        <div className='product-detail-items'>
                            <div className='product-detail-preview' style={{ marginLeft: "10px" }}>
                                {imgData && imgData.map((img, index) => {
                                    return (
                                        <figure className="image is-96x96" style={{ marginBottom: "10px" }} onMouseEnter={() => { handleSelectedImg(img) }}>
                                            <img src={img} style={{
                                                boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.25)"
                                            }} alt=""></img>
                                        </figure>
                                    )
                                })}
                            </div>

                        </div>
                        <div className='product-detail-items'>
                            <div>
                                <figure className="image is-5by4">
                                    <img style={{ borderRadius: "5px", objectFit: "cover", boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.05)" }} src={selectedImg}></img>
                                </figure>
                            </div>
                        </div>
                        <div className='product-detail-items'>
                            <div style={{ paddingLeft: "50px" }} >
                                <p className='title is-1'>{productData.name}</p>
                                <p className='subtitle is-6'>{productData.description}</p>
                                <p className='subtitle is-4'> {formatCurrency(productData.price)}</p>
                                <div>
                                    <p className='subtitle is-5'>Các loại cổ áo</p>
                                    <div style={{ display: "flex" }}>
                                        <div className='product-component-style-items'>
                                            <figure className="image is-64x64">
                                                <img src="https://bulma.io/images/placeholders/128x128.png"></img>
                                            </figure>
                                        </div>

                                        <div className='product-component-style-items'>
                                            <figure className="image is-64x64">
                                                <img src="https://bulma.io/images/placeholders/128x128.png"></img>
                                            </figure>
                                        </div>
                                        <div className='product-component-style-items'>
                                            <figure className="image is-64x64">
                                                <img src="https://bulma.io/images/placeholders/128x128.png"></img>
                                            </figure>
                                        </div>
                                        <div className='product-component-style-items'>
                                            <figure className="image is-64x64">
                                                <img src="https://bulma.io/images/placeholders/128x128.png"></img>
                                            </figure>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ paddingTop: "60px" }}>
                                    <button className='btn-contact '>
                                        Liên hệ đặt may
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            ) : (
                <div>
                    Not Found
                </div>
            )
            }
        </>
    )
}
