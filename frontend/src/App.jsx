import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes,Route } from 'react-router-dom'
import Home from './Pages/Home'
import Shop from './Pages/Shop'

function App() {
 
  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/shop' element={<Shop/>} />
    </Routes>
    </>
  )
}

export default App
