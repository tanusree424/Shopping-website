import React, { useState, useEffect } from 'react'
import AddCategories from './AddCategories';
import ViewCategories from './ViewCategories';
import DataTable from 'react-data-table-component';
import api from "../../Api/Api";
import Sidebar from '../Sidebar';
import AdminHeader from '../AdminHeader';
import { PlusCircle, Trash2, PencilIcon, Eye } from "lucide-react";
import toast from "react-hot-toast";
const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [openAddCategoryModal, setopenAddCategoryModal] = useState(false);
    const [ViewCategoryModalOpen, setViewCategoryModalOpen] = useState(false);
    const [SingleCategory, setSingleCategory] = useState(null);
    const [openEditCategoryModal, setopenEditCategoryModal] = useState(false)
    const [loading, setLoading] = useState(true);
    const fetchCategories = async () => {
            try {
                const response = await api.get('/api/admin/categories', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
               // const data = await response.json();
             //  console.log(response.data)
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };


    useEffect(() => {
        
        fetchCategories();
    }, []);

    const handleViewCategory = (category) => {
        setViewCategoryModalOpen(true);
        setSingleCategory(category);

    };

    const handleDelete = async (category) => {
        if (window.confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
            try {
                const response = await api.delete(`/api/admin/categories/${category.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                toast.success(response.data.message || "Category Deleted Successfully");
                // Remove the deleted category from the state
                setCategories(categories.filter(cat => cat.id !== category.id));
            } catch (error) {
                console.error("Error deleting category:", error);
                toast.error(error?.response?.data?.message || error?.message || "Failed to delete category");
            }

        }
    };
        const handleEditCategory = (category) => {
        setopenEditCategoryModal(true);
        setSingleCategory(category);
    };

    if (loading) return <div>Loading...</div>;
    const columns = [
        {
            name: 'ID',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Description',
            selector: row => JSON.stringify(row.description).length > 30 ? JSON.stringify(row.description).substring(0, 30) + "..." : JSON.stringify(row.description),
            sortable: true,

        },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex justify-center items-center gap-2 space-x-3">
                    <button className="bg-yellow-400 flex gap-2 py-2 text-white px-2 rounded hover:bg-blue-500" onClick={()=>handleEditCategory(row)}>
                       <PencilIcon size={16} /> Edit
                    </button>
                    <button className="bg-sky-400 flex gap-2 py-2 text-white px-2 rounded hover:bg-blue-500" onClick={()=>handleViewCategory(row)}>
                       <Eye size={16} /> View
                    </button>
                    <button className="bg-red-400 flex gap-2 py-2 text-white px-2 rounded hover:bg-red-500" onClick={()=> handleDelete(row)}>
                        <Trash2 size={16} /> Delete
                    </button>
                </div>
            ),
        },
    ];
    return (
        <div className='flex'>
            <div className="w-[350px]">
                <Sidebar />
            </div>
            <div className="flex-1">
                <AdminHeader />
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold mb-4">Categories</h2>
                        <button onClick={() => setopenAddCategoryModal(true)} className='bg-blue-400 py-2 flex cursor-pointer text-white rounded-2xl px-2' ><PlusCircle className="mr-2" />Add Category</button>
                    </div>
                    <div>
                        {openAddCategoryModal && <AddCategories onClose={() => setopenAddCategoryModal(false) } categories={categories} fetchCategories={fetchCategories} />}
                    </div>
                </div>
                <div className="p-4">
                <DataTable 
                    columns={columns}
                    data={categories}
                    pagination
                    paginationPerPage={5}
                    paginationRowsPerPageOptions={[5, 10, 15, 20, 25]}
                    highlightOnHovers
                />
            </div>
            </div>
            {
                ViewCategoryModalOpen && <ViewCategories onClose={() => setViewCategoryModalOpen(false)} category={SingleCategory}  />   
            }

            {
                openEditCategoryModal && <AddCategories onClose={() => setopenEditCategoryModal(false)} fetchCategories={fetchCategories} categories={categories} categoryData={SingleCategory} />
            }

        </div>


    )
}

export default Categories
