import React, { useState } from 'react';
import api from '../../Api/Api';
import toast from 'react-hot-toast';

const AddCategories = ({ onClose, fetchCategories, categories, categoryData }) => {
    const [form, setForm] = useState({
        name: categoryData ? categoryData.name : "",
        slug: categoryData ? categoryData.slug : "",
        description: categoryData ? categoryData.description : "",
        parent_id: categoryData ? categoryData.parent_id : "",
        category_image: null,
    });

    const [preview, setPreview] = useState(categoryData ? categoryData.image : null);
    const categoriesList = categories || [];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...form, category_image: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("slug", form.slug);
            formData.append("description", form.description);
            if (form.parent_id) {
                formData.append("parent_id", form.parent_id); // keep as string
            }
            if (form.category_image) {
                formData.append("category_image", form.category_image);
            }

            let response;
            if (categoryData) {
                // Use POST + _method=PUT for Laravel
                formData.append("_method", "PUT");
                response = await api.post(`/api/admin/categories/${categoryData.id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                    },
                });
                toast.success(response.data.message || "Category Updated Successfully");
            } else {
                response = await api.post(`/api/admin/categories`, formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                toast.success(response.data.message || "Category Added Successfully");
            }

            onClose();
            fetchCategories();
        } catch (error) {
            console.error(error.message);
            toast.error(error?.response?.data?.message || error?.message || "Failed to save category");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                        {categoryData ? `Edit Category - ${categoryData.name}` : "Add Category"}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">X</button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col">
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Category Name"
                        className="w-full p-2 border rounded mb-4"
                    />
                    <input
                        type="text"
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        placeholder="Category Slug"
                        className="w-full p-2 border rounded mb-4"
                    />
                    <textarea
                        placeholder="Category Description"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full p-2 border rounded mb-4"
                    ></textarea>

                    <select
                        className="w-full p-2 border rounded mb-4"
                        value={form.parent_id}
                        onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
                    >
                        {categoriesList.length === 0 ? (
                            <option value="">No Categories Available</option>
                        ) : (
                            <>
                                <option value="">Select Parent Category (Optional)</option>
                                {categoriesList.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </>
                        )}
                    </select>

                    <input type="file" name="category_image" onChange={handleImageChange} className="w-full border-red-300 mb-4" />

                    {preview ? (
                        <img src={preview} alt="Preview" className="w-20 border mb-4" />
                    ) : categoryData?.category_image ? (
                        <img src={categoryData.category_image} alt="Preview" className="w-20 border mb-4" />
                    ) : (
                        <span>No Image</span>
                    )}
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                        {categoryData ? `Update Category - ${categoryData.name}` : "Add Category"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddCategories;