import React from 'react'
import AdminLayout from './AdminLayout'
import api from '../Api/Api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
const AdminHome = () => {
  const navigate=useNavigate()
 
  return (
    <div>
      <AdminLayout />
    </div>
  )
}

export default AdminHome
