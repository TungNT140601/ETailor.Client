import React from 'react'
import Header from '../Header/index'
import './index.css'

const DefaultLayout = ({ children }) => {
    return (
        <>
            <div className='container-wrapper'>
                <div>
                    <Header />
                </div>
                <div className='section-wrapper'>
                    {children}
                </div>

            </div>
        </>

    )
}

export default DefaultLayout
