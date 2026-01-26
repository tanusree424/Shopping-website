import React,{useState, useEffect} from 'react'
import api from '../../Api/Api';
import DataTable from 'react-data-table-component';
import Sidebar from '../Sidebar';
import AdminHeader from '../AdminHeader';
import AddPermission from './AddPermission';
import { Trash2 , PencilIcon , PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
const Permissions = () => {
    const [permissions, setPermissions] = useState([]);
    const [openPermissionModel, setOpenPermissionModel] = useState(false);
    const [EditPermissionModalOpen, setEditPermissionModalOpen] = useState(false);
    const [EditPermission, setEditPermission] = useState(null);
    const fetchPermissions = async () => {
    try {
      const response = await api.get("/api/admin/permissions", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        });
        setPermissions(response.data.permissions);
    } catch (error) {
        console.log(error?.response?.data || error?.message);
    }
    };
    useEffect(() => {
        fetchPermissions();
    }, []);
    const handleDelete = async (permission) => {
        if (window.confirm(`Are you sure you want to delete ${permission.name}?`)) {
          try {
            const response = await api.delete(`/api/admin/permissions/${permission.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }); 
            console.log(response.data);
            toast.success("Permission Deleted Successfully");
            fetchPermissions(); // Refresh the permissions list
        } catch (error) {
            console.log(error?.response?.data || error?.message);
            toast.error("Failed to delete permission");
        }  
        }else
        {
            return;
        }
        
    };
    const handleEdit = (permission) => {
        setEditPermission(permission);
        setEditPermissionModalOpen(true);
    }

const columns = [
    {
        name: 'ID',    
        selector: (row,i) => i+1,
        sortable: true,
    },
    {
        name: 'Permission Name',    
        selector: row => row.name,
        sortable: true,
    },
    {
        name: 'Created At',    
        selector: row => new Date(row.created_at).toLocaleDateString(["en-IN"], { year: 'numeric',
             month: '2-digit', 
             day: '2-digit',
            
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit' }),
        sortable: true,
    },
    {
        name:"Actions",
        cell: (row) => (
            <div className='flex'>
                {/* Future action buttons can be added here */} 
                <button className="bg-red-500 flex text-white  px-2 py-1 rounded mr-2" onClick={() =>  handleDelete(row)} > <Trash2 /> <span className='mt-1 text-sm'>Delete</span></button>
                <button className="bg-blue-500 flex text-white  px-2 py-1 rounded" onClick={() =>  handleEdit(row)}> <PencilIcon/> <span className='mt-1 text-sm'>Edit</span></button>
            </div>
        ),
    }
];
const addPermissionModel=()=>{
alert("Add Permission Modal Opened");
setOpenPermissionModel(true);
}
  return (
    <div className='flex'>
        <div className="w-[350px]">
      <Sidebar />
      </div>
      <div className="flex-1">
        <AdminHeader />
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold mb-4">Permissions</h2>
          
            <button onClick={()=>addPermissionModel()} className='bg-blue-400 py-2 flex cursor-pointer text-white rounded-2xl px-2' ><PlusCircle className="mr-2" />Add Permission</button>
          
          </div>
          <DataTable
            columns={columns}
            data={permissions}
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5,10,15,20,25]}
            pagination
          />
        </div>
      </div>
      {
        openPermissionModel && (
            <AddPermission fetchPermissions={fetchPermissions} autoclose={() => setOpenPermissionModel(false)} />
        )

      }
      {
        EditPermissionModalOpen && (
           <AddPermission fetchPermissions={fetchPermissions} EditPermission={EditPermission} EditPermissionModalOpen={EditPermissionModalOpen} autoclose={() => setEditPermissionModalOpen(false)} />
        )
      }
    </div>
  )
}

export default Permissions
