import React from 'react'
import Header from '../Header/index'
// import Footer from '../Footer/index'
import './index.css'
// import SearchFilter from '../SearchFilter'

const DefaultLayout = ({ children }) => {
    return (
        <div className='container'>
            <Header />
            {children}
        </div>
    )
}

export default DefaultLayout
