import React, { useState, useEffect } from "react";
import api from "../../Api/Api";
import toast from "react-hot-toast";

const AddBannerModal = ({ closeModal, refresh, editBanner }) => {

    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        link: "",
        status: 1
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    // 🔥 Edit হলে form auto fill
    useEffect(() => {
        if (editBanner) {
            setFormData({
                title: editBanner.title || "",
                subtitle: editBanner.subtitle || "",
                link: editBanner.link || "",
                status: editBanner.status ?? 1
            });
        }
    }, [editBanner]);

    // 🔥 Memory Cleanup
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);

        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append("title", formData.title);
        data.append("subtitle", formData.subtitle);
        data.append("link", formData.link);
        data.append("status", formData.status);

        if (image) {
            data.append("image", image);
        }

        try {
            let response;

            if (editBanner) {
                response = await api.post(
                    `/api/admin/banners/${editBanner.id}?_method=PUT`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );
            } else {
                response = await api.post(
                    "/api/admin/banners",
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );
            }

            toast.success(response.data.message);
            refresh();
            closeModal();

        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message || "Something went wrong!"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal d-block inset-0 bg-black/50 flex justify-center items-center">
            <div className="modal-dialog">
                <div className="modal-content p-4 rounded-3 shadow">

                    <h5 className="mb-3">
                        {editBanner ? `Edit Banner - ${editBanner?.title}` : "Add Banner"}
                    </h5>

                    <form onSubmit={handleSubmit}>

                        <input 
                            type="text"
                            name="title"
                            placeholder="Title"
                            className="form-control mb-2"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />

                        <input 
                            type="text"
                            name="subtitle"
                            placeholder="Subtitle"
                            className="form-control mb-2"
                            value={formData.subtitle}
                            onChange={handleChange}
                        />

                        <input 
                            type="text"
                            name="link"
                            placeholder="/category/men"
                            className="form-control mb-2"
                            value={formData.link}
                            onChange={handleChange}
                            required
                        />

                        <input 
                            type="file"
                            className="form-control mb-2"
                            onChange={handleImageChange}
                        />

                        {/* 🔥 Image Preview */}
                        {preview ? (
                            <img 
                                src={preview}
                                alt="preview"
                                style={{ width: "100%", height: "120px", objectFit: "cover" }}
                                className="mb-2 rounded"
                            />
                        ) : editBanner?.image ? (
                            <img 
                                src={editBanner.image}
                                alt="preview"
                                style={{ width: "100%", height: "120px", objectFit: "cover" }}
                                className="mb-2 rounded"
                            />
                        ) : null}

                        <select 
                            name="status"
                            className="form-control mb-3"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>

                        <div className="d-flex justify-content-end">
                            <button 
                                type="button"
                                className="btn btn-secondary me-2"
                                onClick={closeModal}
                                disabled={loading}
                            >
                                Cancel
                            </button>

                            <button 
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading
                                    ? "Processing..."
                                    : editBanner
                                    ? "Update"
                                    : "Save"}
                            </button>
                        </div>

                    </form>

                </div>
            </div>
        </div>
    );
};

export default AddBannerModal;
