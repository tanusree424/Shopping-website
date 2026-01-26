import React, { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../../Api/Api'
const AddRole = ({ autoClose, permissions, fetchRoles, EditingUser, setopenEditModal, openEditModal, onClose }) => {
    // console.log(permissions)
    console.log(EditingUser)
    console.log(openEditModal)
    const [form, setform] = useState({
        name: EditingUser ? EditingUser.name : "",
        permissions: []
    })
    const handleSubmit = async (e) => {
        e.preventDefault()
        // 🔥 ADD ROLE LOGIC HERE
        if (EditingUser) {
            try {
                const response = await api.put(`/api/admin/roles/${EditingUser.id}`, form, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                });
                toast.success("Role Updated Successfully");
                console.log(response.data);
                onClose()
                fetchRoles();
            } catch (error) {
                console.log(error.message)
                toast.error(error?.response?.data?.message || error.message);
                return;
            }
        } else {
            try {
                const response = await api.post("/api/admin/roles", form, {
                    headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });

            toast.success("Role Added Successfully");
            console.log(response.data);
        } catch (error) {
            console.log(error.message)
            toast.error(error?.response?.data?.message || error.message);
            return;
        }
        autoClose()
        fetchRoles();
    }
    }
    return (
        <div className="flex inset-0  fixed justify-center bg-black/50 items-center z-50">
            <div className="bg-white border p-4  w-[350px] rounded-lg shadow-lg">
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h2>{EditingUser ? "Edit Role" : "Add Role"}</h2>
                    <button
                        onClick={() => EditingUser ? onClose() : onClose()}
                        className="text-red-500 font-semibold"
                    >
                        ✕
                    </button>

                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 flex flex-col">
                        <h2 htmlFor="" className='font-bold text-xl text-nowrap w-24'>{EditingUser ? "Edit Role" : "Add Role"}</h2>
                        <input type="text" value={form.name} onChange={(e) => { setform({ ...form, name: e.target.value }) }} placeholder="Role Name" className="border p-2 w-full rounded-md" />
                    </div>
                    <div className="mb-3">
                        <h3 className="font-bold text-lg mb-2">Assign Permissions</h3>

                        {
                            permissions.map((permission) => (
                                <div key={permission.id} className="flex gap-2 items-center">
                                    <input
                                        type="checkbox"
                                        checked={EditingUser ? EditingUser.permissions.some(p => p.id === permission.id) : form.permissions.includes(permission.id)}
                                        onChange={(e) => {
                                            setform({
                                                ...form,
                                                permissions: e.target.checked
                                                    ? [...form.permissions, permission.id]
                                                    : form.permissions.filter(p => p !== permission.id),
                                            });
                                        }}
                                    />

                                    <span>{permission.name}</span>
                                </div>
                            ))

                        }
                    </div>
                    <button className="bg-blue-500 text-white px-4 py-2 w-100 rounded-md">Add Role</button>
                </form>
            </div>
        </div>
    )
}

export default AddRole
