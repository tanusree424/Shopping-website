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
import Roles from './Pages/Admin/Role/Roles'
import Permissions from './Pages/Admin/Permissions/Permissions.jsx'
import Categories from './Pages/Admin/Categories/Categories.jsx'
import Brands from './Pages/Admin/Brands/Brands.jsx'
import Products from './Pages/Admin/Products/Products.jsx'
import CategoryProducts from './Pages/CategoryProducts.jsx'
import AllProducts from './Pages/AllProducts.jsx'
import Signup from './Pages/Signup.jsx'
import Login from "./Pages/Login.jsx"
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
    <Route path='category/:slug' element={<CategoryProducts/>} />
    <Route path='/products/:slug' element={<AllProducts/>}/>
    <Route path="signup" element={<Signup />} /> 
    <Route path="login" element={<Login />} /> 
  {/* Admin Public */}
  <Route path="/admin/login" element={<AdminLogin />} />
  <Route path="/admin/signup" element={<AdminSignup />} />
  

  {/* Admin Protected */}
  <Route path="/admin" element={<AdminProtectedRoute />}>
    <Route index element={<AdminHome />} />   {/* /admin */}
    <Route path="users" element={<Users />} /> {/* /admin/users */}
    <Route path="roles" element={<Roles />} /> {/* /admin/roles */}
    <Route path="permissions" element={<Permissions />} /> {/* /admin/permissions */}
    <Route path="categories" element={<Categories />} /> {/* /admin/categories */}
    <Route path="brands" element={<Brands />} /> {/* /admin/brands */}
     <Route path="products" element={<Products />} /> {/* /admin/products */}
     
    <Route path="*" element={<NotFound/>} />
  </Route>

</Routes>


    </>
  )
}

export default App
