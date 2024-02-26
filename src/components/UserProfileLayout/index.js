import React from 'react'
import Header from '../Header/index'
import './index.css'
import CustomerSidebar from '../CustomerSidebar/CustomerSidebar'
const UserProfileLayout = ({ children }) => {
    return (
        <>
            <div className='container-wrapper'>
                <div>
                    <Header />
                </div>
                <div className='wrapper-profile'>
                    <div className='leftside-avatar'>
                        <CustomerSidebar />
                    </div>
                    <div className='wrapper-content'>
                        {children}
                    </div>

                </div>

            </div>
        </>

    )
}

export default UserProfileLayout
