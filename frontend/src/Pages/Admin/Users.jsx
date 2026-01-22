import React, { useState, useEffect } from "react";
import api from "../Api/Api";
import DataTable from "react-data-table-component";
import Sidebar from "./Sidebar";
import AddModel from "./AddModel";
import toast from "react-hot-toast";
import AdminHeader from "./AdminHeader";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(res.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= EDIT ================= */
  const handleEdit = (row) => {
    setEditUser(row);
    setOpenEditModal(true);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await api.delete(`/api/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("User deleted");
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  /* ================= ROLE CHANGE ================= */
  const handleRoleChange = async (userId, roleName, checked) => {
    try {
      const user = users.find((u) => u.id === userId);
      if (!user) return;

      let roles = Array.isArray(user.roles)
        ? user.roles.map((r) => (typeof r === "string" ? r : r.name))
        : [];

      if (checked) {
        roles = [...new Set([...roles, roleName])];
      } else {
        roles = roles.filter((r) => r !== roleName);
      }

      if (roles.length === 0) {
        toast.error("User must have at least one role");
        return;
      }

      const res = await api.post(
        `/api/admin/users/${userId}/roles`,
        { roles },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(res.data.message);

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? res.data.user : u))
      );
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    {
      name: "ID",
      selector: (row,i) => i+1,
      sortable: true,
      width: "80px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Assign Role",
      cell: (row) => (
        <div className="flex gap-3">
          {["Admin", "Vendor", "User"].map((role) => (
            <label key={role} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={
                  Array.isArray(row.roles) &&
                  row.roles.some((r) =>
                    typeof r === "string" ? r === role : r.name === role
                  )
                }
                onChange={(e) =>
                  handleRoleChange(row.id, role, e.target.checked)
                }
              />
              <span className="text-nowrap">{role}</span>
            </label>
          ))}
        </div>
      ),
    },
    {
      name: "Roles",
      selector: (row) =>
        Array.isArray(row.roles)
          ? row.roles
              .map((r) => (typeof r === "string" ? r : r.name))
              .join(", ")
          : "-",
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row) =>
        row.created_at
          ? new Date(row.created_at).toLocaleString("en-IN", {
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="px-3 py-1 text-sm bg-green-500 text-white rounded"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  /* ================= UI ================= */
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-[320px] bg-gray-800">
        <Sidebar />
      </div>

      {/* Content */}
      <div className="flex-1">
        <AdminHeader />

        <div className="p-8">
          <div className="bg-white rounded shadow">
            <div className="flex justify-between items-center p-4">
              <h2 className="text-xl font-bold">Users List</h2>
              <button
                onClick={() => setOpenAddModal(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add User
              </button>
            </div>

            <DataTable
              columns={columns}
              data={Array.isArray(users) ? users.filter(u => u?.id) : []}
              progressPending={loading}
              pagination
              paginationPerPage={5}
              paginationRowsPerPageOptions={[5, 10, 15, 20]}
              highlightOnHover
              striped
            />
          </div>
        </div>
      </div>

      {/* ADD MODAL */}
      {openAddModal && (
        <AddModel
          autoClose={() => setOpenAddModal(false)}
          setusers={setUsers}
        />
      )}

      {/* EDIT MODAL */}
      {openEditModal && (
        <AddModel
          isEdit={true}
          EditUser={editUser}
          autoClose={() => setOpenEditModal(false)}
          setusers={setUsers}
        />
      )}
    </div>
  );
};

export default Users;
