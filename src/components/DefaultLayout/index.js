import React, { useState, useEffect } from 'react'
import Header from '../Header/index'
import './index.css'
import Footer from '../Footer/Footer'
import BackToTopIcon from '../../../src/assets/icons/backtotop.png'

const DefaultLayout = ({ children }) => {
    const ScrollToTopButton = () => {
        const [isVisible, setIsVisible] = useState(false);
        const toggleVisibility = () => {
            if (window.scrollY > 700) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        const scrollToTop = () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };
        
        useEffect(() => {
            window.addEventListener('scroll', toggleVisibility);
            return () => {
                window.removeEventListener('scroll', toggleVisibility);
            };
        }, []);


        return (
            <div className={`scroll-to-top ${isVisible ? 'visible' : ''}`}>
                {isVisible &&

                    <img src={BackToTopIcon} width={80} height={80} onClick={scrollToTop}></img>
                }
            </div>
        );
    }
    return (
        <>
            <Header />
            <div style={{ minHeight: '80vh', position: "relative" }}>
                {children}
                <ScrollToTopButton />
            </div>
            <Footer />
        </>

    )
}

export default DefaultLayout
