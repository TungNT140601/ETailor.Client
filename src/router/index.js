import React, { Fragment, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

import DefaultLayout from '../components/DefaultLayout'
import Home from '../pages/Customer/Home'
import AdminRouters from './AdminRouter'
import CustomerRouter from './CustomerRouter'
import NotFound from '../pages/NotFound/NotFound'
export const customerRouters = [
]

export const publicRouters = [
    {
        path: '/',
        name: 'home',
        component: Home,
    },
    
    {
        path: '/error',
        name: 'error',
        component: NotFound,
        layout: null,
    },
]

export const privateRouters = [
    // {
    //     path: '/profile',
    //     name: 'user-profile',
    //     component: Profile,
    //     layout: LayoutWithoutFilter,
    // },
]

export const adminRouters = [
    // {
    //     path: '/',
    //     name: 'user-list',
    //     component: UserList,
    //     layout: LayoutWithoutFilter,
    // },
]


//Scroll Top when clicked another page
function ScrollToTop() {
    const location = useLocation()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [location])

    return null
}

export const RouterComponents = () => {
    return (
        <BrowserRouter>
            <div>
                <ScrollToTop />
                <Routes>
                    {publicRouters.map((route, index) => {
                        const Page = route.component
                        let Layout = DefaultLayout
                        if (route.layout) {
                            Layout = route.layout
                        } else if (route.layout === null) {
                            Layout = Fragment
                        }
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        )
                    })}
                    {/* <Route exact path="/" element={<PrivateRouters />}>
                        {privateRouters.map((route, index) => {
                            const Page = route.component
                            let Layout = DefaultLayout
                            if (route.layout) {
                                Layout = route.layout
                            } else if (route.layout === null) {
                                Layout = Fragment
                            }
                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            )
                        })}
                    </Route> */}
                    <Route exact path="/" element={<AdminRouters />}>
                        {adminRouters.map((route, index) => {
                            const Page = route.component
                            let Layout = DefaultLayout
                            if (route.layout) {
                                Layout = route.layout
                            } else if (route.layout === null) {
                                Layout = Fragment
                            }
                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            )
                        })}
                    </Route>
                    
                    <Route exact path="/" element={<CustomerRouter />}>
                        {customerRouters.map((route, index) => {
                            const Page = route.component
                            let Layout = DefaultLayout
                            if (route.layout) {
                                Layout = route.layout
                            } else if (route.layout === null) {
                                Layout = Fragment
                            }
                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            )
                        })}
                    </Route>
                </Routes>
            </div>
        </BrowserRouter>
    )
}
