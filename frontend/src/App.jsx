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


function App() {
 
  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/shop' element={<Shop/>} />
      <Route path='/cart' element={<Cart/>} />
      <Route path='/checkout' element={<Checkout/>} />
      <Route path='/contact' element={<Contact/>} />
      <Route path='/admin' >
      <Route path='' element={<AdminHome/>} />
      </Route>

    </Routes>
    </>
  )
}

export default App
