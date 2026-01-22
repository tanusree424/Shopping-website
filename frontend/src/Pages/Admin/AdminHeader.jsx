import React from 'react'
import toast from 'react-hot-toast';
import api from '../Api/Api';
import Offer1 from "../../assets/img/offer-1.jpg";
import { useNavigate } from 'react-router-dom';
const AdminHeader = ({toggleSidebar}) => {
  const navigate = useNavigate();
  
   const adminlogout = async()=>{
    if (window.confirm("Are you sure want to logout?")) {
      
    
    try {
      const response = await api.get("/api/admin/logout", {withCredentials:true , headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})
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
      <div className="bg-yellow-400 p-3 sticky top-0 h-[80px] ">
            <div className="row align-items-center m-0">

              {/* Toggle */}
              <div className="col-2">
                <i
                  onClick={toggleSidebar}
                  className="fa fa-bars text-2xl cursor-pointer"
                ></i>
              </div>

              {/* Title */}
              <div className="col-6 text-center">
                <h2 className="text-2xl font-bold">
                  Welcome to ShopKart Admin Panel
                </h2>
              </div>

              {/* Profile + Icon */}
             <div className="col-4 d-flex justify-content-end align-items-center gap-3">

  <img
    src={Offer1}
    className="w-12 h-12 object-cover rounded-full border"
    alt="profile"
  />

  <button className="rounded-full border-2 rounded-circle p-2 d-flex align-items-center gap-2" onClick={adminlogout}>
    <i title="logout" className="fa-solid fa-right-from-bracket"></i>
    
  </button>

</div>

            </div>
          </div>
    </div>
  )
}

export default AdminHeader
