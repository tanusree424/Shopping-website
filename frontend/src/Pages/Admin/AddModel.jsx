import React, { useState, useEffect } from "react";
import api from "../Api/Api";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const AddModel = ({ autoClose, setusers, EditUser = null, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setshowPassword] = useState(true)
 const [showConfirmPassword, setshowConfirmPassword] = useState(true)
  /* ================= PREFILL FOR EDIT ================= */
  useEffect(() => {
    if (isEdit && EditUser) {
      setFormData({
        name: EditUser.name || "",
        email: EditUser.email || "",
        password: "",
        password_confirmation: "",
      });
    }
  }, [isEdit, EditUser]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      let res;

      if (isEdit) {
        // 🔥 EDIT USER
        res = await api.put(
          `/api/admin/users/${EditUser?.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        toast.success("User updated successfully");
       


        setusers((prev) =>
          prev.map((u) => (u.id === EditUser.id ? res.data.user : u))
        );
      } else {
        // 🔥 ADD USER
        res = await api.post("/api/admin/users", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        toast.success("User added successfully");
        setusers((prev) => [res.data.user, ...prev]);
      }

      autoClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-[450px] rounded-lg shadow-lg">
        {/* HEADER */}
        <div className="flex justify-between items-center px-5 py-3 border-b">
          <h2 className="text-lg font-bold">
            {isEdit ? "Edit User" : "Add User"}
          </h2>
          <button
            onClick={autoClose}
            className="text-red-500 font-semibold"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* PASSWORD (only required for add) */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Password {isEdit && "(optional)"}
            </label>
            <div className="relative w-full">
             <input
              type={showPassword ? "password" :"text"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!isEdit}
              className="w-full border px-3 py-2 rounded"
            />
            {
                showPassword ?
                  <Eye onClick={(e)=>setshowPassword(!showPassword)} className="absolute right-4 top-2 cursor-pointer "/> : <EyeOff onClick={(e)=>setshowPassword(!showPassword)} className="absolute right-4 top-2 cursor-pointer " />
            }
           
            </div>
           
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Confirm Password {isEdit && "(optional)"}
            </label>
           <div className="relative w-full">
             <input
              type={showConfirmPassword ? "password" :"text"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!isEdit}
              className="w-full border px-3 py-2 rounded"
            />
            {
                showConfirmPassword ?
                  <Eye onClick={(e)=>setshowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-2 cursor-pointer "/> : <EyeOff onClick={(e)=>setshowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-2 cursor-pointer " />
            }
           
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={autoClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {loading ? "Saving..." : isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModel;
