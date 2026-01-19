import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Offer1 from "../../assets/img/offer-1.jpg";

const AdminLayout = ({adminlogout}) => {
  const [showSidebar, setShowSidebar] = useState(true);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="container-fluid m-0 p-0">
      <div className="d-flex min-h-screen">

        {showSidebar && (
          <div className="bg-gray-700 min-h-screen">
            <Sidebar />
          </div>
        )}

        <div className="flex-grow-1">

          <div className="bg-yellow-400 p-3 sticky top-0 h-[80px]">
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
      </div>
    </div>
  );
};

export default AdminLayout;
