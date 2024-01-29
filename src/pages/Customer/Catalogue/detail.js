import React from 'react'
import './detail.css'
export default function ProductDetail() {
    return (
        <div style={{ paddingTop: "140px" }}>
            <div style={{ height: "60px", paddingLeft: "60px" }}>
                <nav class="breadcrumb has-bullet-separator" aria-label="breadcrumbs">
                    <ul>
                        <li><a href="#">Trang Chủ</a></li>
                        <li><a href="#">Áo sơ mi nam</a></li>
                        <li><a href="#">Áo sơ mi </a></li>
                        <li class="is-active"><a href="#" aria-current="page">Breadcrumb</a></li>
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
                        <p className='title is-1'>Áo dài </p>
                        <p className='subtitle is-4'>Áo dài </p>
                        <p className='subtitle is-4'>$ 500.00 </p>
                        <div>
                            <p className='subtitle is-5'>Cổ áo</p>
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
                        <div style={{paddingTop:"60px"}}>
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
