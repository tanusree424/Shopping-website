import React from 'react'
import AdminLayout from './AdminLayout'
import api from '../Api/Api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
const AdminHome = () => {
  const navigate=useNavigate()
  const adminlogout = async()=>{
    if (window.confirm("Are you sure want to logout?")) {
      
    
    try {
      const response = await api.get("/api/logout", {withCredentials:true , headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})
      console.log(response.data)
      localStorage.removeItem("token")
      navigate("/admin/login")
    } catch (error) {
      console.log(error?.response?.data || error.message)
      toast.error(error?.response?.data || error.message)
    }
  }else{
    return ;
  }
  }
  return (
    <div>
      <AdminLayout adminlogout={adminlogout}/>
    </div>
  )
}

export default AdminHome
