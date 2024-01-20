import React from 'react'
import Header from '../Header/index'
import './index.css'

const DefaultLayout = ({ children }) => {
    return (
        <>
            <div className='container'>
                <div>
                    <Header />
                </div>
                <div className='home-wrapper'>
                    {children}
                </div>

            </div>
        </>

    )
}

export default DefaultLayout
