import React from 'react'
import Header from '../Header/index'
import './index.css'
import Footer from '../Footer/Footer'

const DefaultLayout = ({ children }) => {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>

    )
}

export default DefaultLayout
