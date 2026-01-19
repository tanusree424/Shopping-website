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

function App() {
 
  return (
    <>
    <Toaster position="top-right" reverseOrder={false} />
   <Routes>
  <Route path='/' element={<Home/>} />
  <Route path='/shop' element={<Shop/>} />
  <Route path='/cart' element={<Cart/>} />
  <Route path='/checkout' element={<Checkout/>} />
  <Route path='/contact' element={<Contact/>} />

  <Route path='/admin'>
    <Route index element={<AdminHome/>} />   {/* default admin page */}
    <Route path='signup' element={<AdminSignup/>} /> {/* ✅ relative path */}
    <Route path='login' element={<AdminLogin/>} />
  </Route>
</Routes>

    </>
  )
}

export default App
