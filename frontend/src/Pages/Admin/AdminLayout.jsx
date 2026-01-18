import React from 'react'
import Sidebar from './Sidebar'
const AdminLayout = () => {
    return (

        <>
            <div className="container-fluid m-0 p-0 flex">
                <div className="m-0 bg-gray-700 min-h-screen">
                    <Sidebar />
                </div>
                <div className="bg-yellow-400 w-full h-[80px]">
                    <h2 className='text-center text-bold text-2xl p-3 text-shadow-2xs'>Welcome to ShopKart Admin Panel</h2>
                </div>
            </div>

        </>

    )
}

export default AdminLayout
