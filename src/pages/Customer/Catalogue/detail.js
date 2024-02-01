import React from 'react'
import './detail.css'

export default function ProductDetail() {
    return (
        <div style={{ paddingTop: "140px" }}>
            <div style={{ height: "60px", paddingLeft: "60px" }}>
                <nav class="breadcrumb has-bullet-separator" aria-label="breadcrumbs">
                    <ul>
                        <li> <a href="#" style={{ color: "#000000" }}>Trang Chủ</a></li>
                        <li> <a href="#" style={{ color: "#000000" }}>Áo sơ mi nam</a></li>

                        <li class="is-active" style={{ fontWeight: "bold" }}> <a href="#" style={{ color: "#000000" }} aria-current="page">Áo sơ mi</a></li>
                    </ul>
                </nav>
            </div>
            <div className='product-detail-wrapper'>
                <div className='product-detail-items'>
                    <div className='product-detail-preview'>
                        <figure class="image is-96x96">
                            <img src="https://bulma.io/images/placeholders/128x128.png"></img>
                        </figure>
                        <figure class="image is-96x96">
                            <img src="https://bulma.io/images/placeholders/128x128.png"></img>
                        </figure>
                        <figure class="image is-96x96">
                            <img src="https://bulma.io/images/placeholders/128x128.png"></img>
                        </figure>
                        <figure class="image is-96x96">
                            <img src="https://bulma.io/images/placeholders/128x128.png"></img>
                        </figure>
                    </div>

                </div>
                <div className='product-detail-items'>
                    <div>
                        <figure class="image is-5by4">
                            <img style={{ borderRadius: "5px" }} src="https://bulma.io/images/placeholders/256x256.png"></img>
                        </figure>
                    </div>
                </div>
                <div className='product-detail-items'>
                    <div style={{ paddingLeft: "50px" }} >
                        <p className='title is-1'>Áo sơ mi </p>
                        <p className='subtitle is-5'>Áo sơ mi nam form rộng</p>
                        <p className='subtitle is-4'> 500.000đ </p>
                        <div>
                            <p className='subtitle is-5'>Các loại cổ áo</p>
                            <div style={{ display: "flex" }}>
                                <div className='product-component-style-items'>
                                    <figure class="image is-64x64">
                                        <img src="https://bulma.io/images/placeholders/128x128.png"></img>
                                    </figure>
                                </div>

                                <div className='product-component-style-items'>
                                    <figure class="image is-64x64">
                                        <img src="https://bulma.io/images/placeholders/128x128.png"></img>
                                    </figure>
                                </div>
                                <div className='product-component-style-items'>
                                    <figure class="image is-64x64">
                                        <img src="https://bulma.io/images/placeholders/128x128.png"></img>
                                    </figure>
                                </div>
                                <div className='product-component-style-items'>
                                    <figure class="image is-64x64">
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
    )
}
