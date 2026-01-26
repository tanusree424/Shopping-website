import React,{useState,useEffect} from 'react'
import api from '../Pages/Api/Api'
import toast from 'react-hot-toast'
import AdminLogin from '../Pages/Admin/AdminLogin'
import { Outlet } from 'react-router-dom'

const AdminProtectedRoute = () => {
  const [isAuth, setIsAuth] = useState(null)

  const token = localStorage.getItem("token")
 const authRoute = async () => {
      if (!token) {
        setIsAuth(false)
        return
      }

      try {
        const res = await api.get("/api/admin/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setIsAuth(res.data.status === true)
      } catch (error) {
        setIsAuth(false)
        toast.error("Unauthorized")
      }
    }
  useEffect(() => {
   

    authRoute()
  }, [token])

  if (isAuth === null) return null ;
  if (!isAuth) return <AdminLogin />

  return <Outlet />
}

export default AdminProtectedRoute
