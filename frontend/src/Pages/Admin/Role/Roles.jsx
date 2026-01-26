import React, { useEffect, useState } from "react";
import api from "../../Api/Api";
import DataTable from "react-data-table-component";
import Sidebar from "../Sidebar";
import AdminHeader from "../AdminHeader";
import { PlusCircle , Trash2, PencilIcon  } from "lucide-react";
import toast from "react-hot-toast";
import AddRole from "./AddRole";


const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [openAddRoleModel, setopenAddRoleModel] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [openEditModal, setopenEditModal] = useState(false);
  const [EditingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    const res = await api.get("/api/admin/roles", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    setRoles(res.data.roles);
  };

  const fetchPermissions = async () => {
    const res = await api.get("/api/admin/permissions", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    setPermissions(res.data.permissions);
  };

  const handlePermissionChange = async (row, permission, checked) => {
    console.log(row)

    // 🔥 FRONTEND STATE UPDATE FIRST
    setRoles(prev =>
      prev.map(role => {
        if (role.id !== row.id) return role;

        let updatedPermissions = checked
          ? [...role.permissions, permission]
          : role.permissions.filter(p => p.id !== permission.id);

        return { ...role, permissions: updatedPermissions };
      })
    );

    // 🔥 BACKEND CALL
    const url = checked
      ? `/api/admin/${row.id}/assign-permission`
      : `/api/admin/${row.id}/remove-permission`;

   const response = await api.post(
      url,
      { permissions_name: [permission.name] },
      {
        headers: { Accept: "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` }
      }
    );
    permissions.map(p => {
      if (p.id === permission.id) {
        p.assigned = checked;
      }
    });
    console.log(response.data);
    toast.success(`Permission ${checked ? `assigned to ${row.name}` : `removed from ${row.name}`} role successfully`);
  };

const handleDeleteRole = async (roleId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this role?"
  );
  if (!confirmDelete) return;

  try {
  const response=  await api.delete(`/api/admin/roles/${roleId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    // ✅ UI থেকে role remove
    setRoles(prev => prev.filter(role => role.id !== roleId));
    console.log(response.data);

    toast.success("Role deleted successfully");
  } catch (error) {
    console.error("Error deleting role:", error);
    toast.error("Failed to delete role");
  }
};

const handleEdit = (row) => { 
  setopenEditModal(true);
  setEditingUser(row);

}
  const columns = [
    {
      name: "Role",
      selector: row => row.name
    },
    {
      name: "Permissions",
      cell: row => (
        <div className="flex flex-col gap-1">
          {permissions.map(p => {
            const isChecked = row.permissions?.some(rp => rp.id === p.id);

            return (
              <label key={p.id} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={e =>
                    handlePermissionChange(row, p, e.target.checked)
                  }
                />
                {p.name}
              </label>
            );
          })}
        </div>
      )
    },
    {
      name: "Created At",
      selector: row =>
        new Date(row.created_at).toLocaleDateString(["en-IN"], {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })
    },
    {
      name: "Actions",
      cell: row => (
        <div className="flex">
          {/* Future action buttons can be added here */}
          <button className="bg-red-500 flex text-white  px-2 py-1 rounded mr-2" onClick={() => handleDeleteRole(row.id)}>
            {" "}<Trash2 /> <span className="mt-1 text-sm" >Delete</span>
          </button>
          <button onClick={() => handleEdit(row)} className="bg-blue-500 flex text-white  px-2 py-1 rounded">
            {" "}<PencilIcon/> <span className="mt-1 text-sm">Edit</span>
          </button>
        </div>
      )
    }
  ];
 const addRole = () => {
    setopenAddRoleModel(true);
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
          <h2 className="text-xl font-bold mb-4">Roles</h2>
          
            <button onClick={()=>addRole()} className='bg-blue-400 py-2 flex cursor-pointer text-white rounded-2xl px-2' ><PlusCircle className="mr-2" />Add Roles</button>
          
          </div>
          <DataTable
            columns={columns}
            data={roles}
            pagination
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5,10,15,20,25]}
            highlightOnHover
          />
        </div>
      </div>
      {openAddRoleModel && (
  <AddRole
    onClose={() => setopenAddRoleModel(false)}
    permissions={permissions}
    fetchRoles={fetchRoles}
  />
)}

     {openEditModal && (
  <AddRole
    onClose={() => {
      setopenEditModal(false);
      setEditingUser(null);
    }}
    permissions={permissions}
    fetchRoles={fetchRoles}
    EditingUser={EditingUser}
  />
)}

    </div>
  );
};

export default Roles;
