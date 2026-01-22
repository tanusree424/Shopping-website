import React, { useState } from "react";
import Sidebar from "./Sidebar";

import AdminHeader from "./AdminHeader";

const AdminLayout = () => {
  const [showSidebar, setShowSidebar] = useState(true);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="container-fluid overflow-y-hidden o m-0 p-0">
      <div className="d-flex min-h-screen">

        {showSidebar && (
          <div className="bg-gray-700 min-h-screen">
            <Sidebar />
          </div>
        )}

        <div className="flex-grow-1">

          <AdminHeader  toggleSidebar={toggleSidebar}/>

        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
