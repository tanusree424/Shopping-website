import React, { useEffect, useState } from "react";
import api from "../../Api/Api";
import AddBannerModal from "./AddBannerModal";
import AdminHeader from "../AdminHeader";
import Sidebar from "../Sidebar";
import DataTable from 'react-data-table-component';
import { PencilIcon, Trash2Icon,Eye } from "lucide-react";
import toast from "react-hot-toast";
const AdminBanner = () => {

    const [banners, setBanners] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [EditBanner, setEditBanner] = useState(null)
   

    const fetchBanners = async () => {
        try {
            const res = await api.get("/api/admin/banners", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                }
            });
            setBanners(res.data);
            console.log(res.data)
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);
 const columns = [
     {
        name: 'Sl No.',
        selector: (row,i) => i+1,
        sortable: true,
    },
    {
    name: 'Image',
    cell: (row) => (
        <img 
            src={row.image} 
            alt={row.title}
            style={{ width: "80px", height: "60px", objectFit: "cover" }}
        />
    ),
},

    {
        name: 'Title',
        selector: (row) => row.title,
        sortable: true,
    },
    {
        name: 'Link',
        selector: (row) => row.link,
        sortable: true,

    },
    {
        name: 'Status',
        selector: (row) => row.status,
        sortable: true,

    },
    {
        name: 'Actions',
        cell: (row) => (

            <div className="flex gap-2">
                <button title="Edit" className='py-2 px-2 flex gap-2 justify-center items-center bg-yellow-500 text-white font-bold' onClick={()=>handleEdit(row)} >
                <PencilIcon /> 
                </button>
                 <button title="View" className='py-2 px-2 flex gap-2 justify-center items-center bg-sky-600 text-gray-200 font-bold' onClick={() => handleViewBarnd(row)}>
                <Eye /> 
                </button>
                <button title="Delete" className="py-2 px-2 flex gap-2 justify-center items-center bg-red-500 text-white rounded" onClick={()=>handleDelete(row.id)}>
                 <Trash2Icon/>   
                </button>
            </div>
        ),
    },

];
const handleEdit = (row) => {
    setEditBanner(row);     // যে banner edit হবে সেটা set করলাম
    setShowModal(true);     // modal open করলাম
};
const handleDelete = async (bannaerId)=>{
    if (window.confirm("Are you sure delete this banner ?")) {
        try {
         const response = await api.delete(`api/admin/banners/${bannaerId}`,{
    headers:{
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`
    }
 });
 console.log(response.data)
 toast.success(response.data.message)
 fetchBanners()
    } catch (error) {
        console.log(error?.response?.data?.message || error?.message)
    }
    } return;
    

}
    return (
        <div className="flex">
             <div className="w-[350px]">
            <Sidebar />
        </div>
        <div className="flex-1">
        <AdminHeader/>
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Banners</h4>
                <button 
                    className="btn btn-primary"
                    onClick={() => setShowModal(true)}
                >
                    + Add Banner
                </button>
            </div>

            <DataTable
                    columns={columns}
                    data={banners}
                   // selectableRows={false}
                    pagination
                    paginationPerPage={5}
                    paginationRowsPerPageOptions={[5,10,15,20,25]}
                    highlightOnHover
                />

            {showModal && 
    <AddBannerModal 
        closeModal={() => {
            setShowModal(false);
            setEditBanner(null);
        }} 
        refresh={fetchBanners}
        editBanner={EditBanner}   // 🔥 এটা নতুন
    />
}

        </div>
        </div>
        </div>
    );

};

export default AdminBanner;
