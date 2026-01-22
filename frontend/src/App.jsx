import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes,Route } from 'react-router-dom'
import Home from './Pages/Home'
import Shop from './Pages/Shop'
import Cart from './Pages/Cart'
import Checkout from './Pages/Checkout'
import Contact from './Pages/Contact'
import AdminHome from './Pages/Admin/AdminHome'
import AdminSignup from './Pages/Admin/AdminSignup'
import AdminLogin from './Pages/Admin/AdminLogin'
import {Toaster} from "react-hot-toast"
import Users from './Pages/Admin/Users'
import AdminProtectedRoute from './ProtectedRoute/ProtectedRoute'
import NotFound from './Pages/NotFound'
function App() {
 
  return (
    <>
    <Toaster position="top-right" reverseOrder={false} />
  <Routes>

  {/* Public Routes */}
  <Route path="/" element={<Home />} />
  <Route path="/shop" element={<Shop />} />
  <Route path="/cart" element={<Cart />} />
  <Route path="/checkout" element={<Checkout />} />
  <Route path="/contact" element={<Contact />} />
    <Route path='*' element={<NotFound/>} />
  {/* Admin Public */}
  <Route path="/admin/login" element={<AdminLogin />} />
  <Route path="/admin/signup" element={<AdminSignup />} />

  {/* Admin Protected */}
  <Route path="/admin" element={<AdminProtectedRoute />}>
    <Route index element={<AdminHome />} />   {/* /admin */}
    <Route path="users" element={<Users />} /> {/* /admin/users */}
  </Route>

</Routes>


    </>
  )
}

export default App
