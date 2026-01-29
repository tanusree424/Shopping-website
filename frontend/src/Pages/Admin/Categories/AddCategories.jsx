import React, { useState, useEffect } from 'react'
import api from '../../Api/Api';
import toast from 'react-hot-toast';

const AddCategories = ({ onClose, fetchCategories ,categories , categoryData  }) => {
    const [form, setForm] = useState({
        name: categoryData ? categoryData.name : "",
        slug: categoryData ? categoryData.slug : "",
        description: categoryData ? categoryData.description : "",
        parent_id: categoryData ? categoryData.parent_id : ""
    });
    const categoriesList = categories || [];
    console.log(categoriesList)
    const handleSubmit = async (e) => {

        e.preventDefault();
        // Handle form submission logic here
        if (categoryData) {
            try {
                const response = await api.put(`/api/admin/categories/${categoryData.id}`, form, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        "Accept": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                console.log("Form submitted:", response.data);
                toast.success(response.data.message || "Category Updated Successfully");
                onClose(); // Close the modal after submission 
                fetchCategories(); // Refresh the categories list
            } catch (error) {
                console.log(error.message);
                toast.error(error?.response?.data?.message || error?.message || "Failed to update category");
            }
        } else {
            try {
                const response = await api.post('/api/admin/categories', form, {
                    method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,

                },

            });
            console.log("Form submitted:", response.data);
            toast.success(response.data.message || "Category Added Successfully");
            onClose(); // Close the modal after submission 
            fetchCategories(); // Refresh the categories list
        } catch (error) {
            console.log(error.message);
            toast.error(error?.response?.data?.message || error?.message || "Failed to add category");
        }

    };
}

    return (
        <div>
            <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">{categoryData ? `Edit Category - ${categoryData.name}` : "Add Category"}</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">X</button>
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col">
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e)=> setForm({...form , name:e.target.value})}
                            placeholder="Category Name"
                            className="w-full p-2 border rounded mb-4"
                        />
                        <input
                            type="text"
                            value={form.slug}
                            onChange={(e)=> setForm({...form , slug:e.target.value})}
                            placeholder="Category Slug"
                            className="w-full p-2 border rounded mb-4"
                        />

                        <textarea
                            placeholder="Category Description"
                            value={form.description}
                            onChange={(e)=> setForm({...form , description:e.target.value})}
                            className="w-full p-2 border rounded mb-4"
                        ></textarea>
                        <select
                            className="w-full p-2 form-control border rounded mb-4"
                            value={form.parent_id}
                            checked={form.parent_id === categoryData?.parent_id}
                            onChange={(e) =>
                                setForm({ ...form, parent_id: e.target.value })
                            }
                        >
                            {

                            categoriesList.length === 0 ? (
                                <option value="">No Categories Available</option>
                            ) :
                            (
                                <>
                                    <option value="">Select Parent Category (Optional)</option>
                                    
                                    {categoriesList.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </>
                            )
                            }
                        </select>


                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                         {categoryData ? `Update Category - ${categoryData.name}` : "Add Category"}
                        </button>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default AddCategories
