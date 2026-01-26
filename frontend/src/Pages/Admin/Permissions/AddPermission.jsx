import React,{useState} from 'react'
import { RemoveFormattingIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../Api/Api'
const AddPermission = ({ autoclose, fetchPermissions, EditPermission, EditPermissionModalOpen }) => {
    const [form, setform] = useState({
        name: EditPermission ? EditPermission.name : "",
    })
    
    const handleSubmit=async (e)=>{
        e.preventDefault();
        if (EditPermission && EditPermissionModalOpen) {
            // Edit API call to update permission here
            const updatedPermission = { name: form.name };
            console.log("Permission to be updated:", updatedPermission);
            // On success, close the modal
            const response = await api.put(`/api/admin/permissions/${EditPermission.id}`, updatedPermission, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            toast.success("Permission Updated Successfully");
            autoclose();
            fetchPermissions(); // Refresh the permissions list
        } else {
            try {
                // Add API call to create permission here
                const newPermission = { name: form.name };
                console.log("Permission to be added:", newPermission);
                // On success, close the modal
                const response = await api.post("/api/admin/permissions", newPermission, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                toast.success(response.data.message || "Permission Added Successfully");  
                autoclose();
                fetchPermissions(); // Refresh the permissions list
            } catch (error) {
                console.error("Error adding permission:", error);
                toast.error("Failed to add permission");
            }
        }
    }
    
  return (
    <div className='fixed inset-0 bg-black/50 flex justify-center items-center z-50'>
     <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{EditPermission && EditPermissionModalOpen ? `Edit Permission ${EditPermission.name}` : "Add Permission"}</h2>
          <button onClick={autoclose} className="text-gray-500 hover:text-gray-700"> <RemoveFormattingIcon /></button>
        </div>
        <form className="flex flex-col" onSubmit={handleSubmit} >
          <input type="text" value={form.name} onChange={(e) => setform({...form, name: e.target.value})} placeholder="Permission Name" className="w-full p-2 border rounded mb-4" />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {EditPermission && EditPermissionModalOpen ? "Update Permission" : "Add Permission"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddPermission
