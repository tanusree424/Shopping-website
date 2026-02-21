import React, { useState, useEffect } from "react";
import api from "../../Api/Api";
import toast from "react-hot-toast";

const AddBrands = ({
  onClose,
  fetchBrands,
  EditBrandModal = false,
  SingleBarnd = null,
}) => {

  const [form, setForm] = useState({
    brandName: "",
    brandSlug: "",
    brandCountry: "",
    brandWebsite: "",
    description: "",
  });

  const [brandLogo, setBrandLogo] = useState(null);
  const [brandLogoPreview, setBrandLogoPreview] = useState(null);

  /* 🔹 Edit হলে DB data form এ বসাবে */
  useEffect(() => {
    if (EditBrandModal && SingleBarnd) {
      setForm({
        brandName: SingleBarnd.name || "",
        brandSlug: SingleBarnd.slug || "",
        brandCountry: SingleBarnd.country || "",
        brandWebsite: SingleBarnd.website || "",
        description: SingleBarnd.description || "",
      });

      if (SingleBarnd.logo) {
        setBrandLogoPreview(
          `${SingleBarnd.logo}`
        );
      }
    }
  }, [EditBrandModal, SingleBarnd]);

  /* 🔹 Logo change */
  const handleBrandLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBrandLogo(file);
      setBrandLogoPreview(URL.createObjectURL(file));
    }
  };

  /* 🔹 Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!window.confirm("Are you sure?")) return;

    const formData = new FormData();
    formData.append("name", form.brandName);
    formData.append("slug", form.brandSlug);
    formData.append("country", form.brandCountry);
    formData.append("website", form.brandWebsite);
    formData.append("description", form.description);

    if (brandLogo) {
      formData.append("logo", brandLogo);
    }

    try {
      let response;

      if (EditBrandModal && SingleBarnd) {
        response = await api.post(
          `/api/admin/brands/${SingleBarnd.id}?_method=PUT`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );
      } else {
        response = await api.post("/api/admin/brands", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }

      toast.success(response.data.message || "Brand saved successfully");
      fetchBrands();
      onClose();

    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-white w-[550px] p-4 rounded shadow">

        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold">
            {EditBrandModal ? "Edit Brand" : "Add New Brand"}
          </h2>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-3 py-1 rounded"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Brand Name */}
          <div className="mb-1">
            <label className="font-bold">Brand Name</label>
            <input
              type="text"
              value={form.brandName}
              onChange={(e) =>
                setForm({ ...form, brandName: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Slug */}
          <div className="mb-1">
            <label className="font-bold">Brand Slug</label>
            <input
              type="text"
              value={form.brandSlug}
              onChange={(e) =>
                setForm({ ...form, brandSlug: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Country */}
          <div className="mb-1">
            <label className="font-bold">Brand Country</label>
            <select
              value={form.brandCountry}
              onChange={(e) =>
                setForm({ ...form, brandCountry: e.target.value })
              }
              className="w-full border p-2 rounded"
            >
              <option value="">Select Country</option>
              <option value="USA">USA</option>
              <option value="India">India</option>
              <option value="Canada">Canada</option>
              <option value="UK">UK</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Italy">Italy</option>
              <option value="Japan">Japan</option>
            </select>
          </div>

          {/* Website */}
          <div className="mb-1">
            <label className="font-bold">Brand Website</label>
            <input
              type="text"
              value={form.brandWebsite}
              onChange={(e) =>
                setForm({ ...form, brandWebsite: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Logo */}
          <div className="mb-1">
            <label className="font-bold">Brand Logo</label>
            <input
              type="file"
              onChange={handleBrandLogoChange}
              className="w-full"
            />
          </div>

          {/* Logo Preview */}
          {brandLogoPreview && (
            <img
              src={brandLogoPreview}
              className="w-20 h-20 object-cover mb-1"
              alt="Brand Logo"
            />
          )}

          {/* Description */}
          <div className="mb-1">
            <label className="font-bold">Description</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-1 rounded"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-1 rounded"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddBrands;
