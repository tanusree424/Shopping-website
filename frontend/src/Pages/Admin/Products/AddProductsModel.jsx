import React, { useEffect, useState } from "react";
import api from "../../Api/Api";
import toast from "react-hot-toast";

const AddProductsModel = ({ onClose, fetchProducts, editingProduct }) => {

  /* ================== STATES ================== */
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: "",
    discount_price: "",
    sku: "",
    category_id: "",
    brand_id: "",
    description: "",
    short_desc: "",
    stock: "",
    images: []
  });

  const [variants, setVariants] = useState([
    { id: null, color: "", size: "", stock: "", price: "", images: [] }
  ]);

console.log(editingProduct)
  const [previewImages, setPreviewImages] = useState([]);
  const [previewVariantImages, setPreviewVariantImages] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  /* ================== EDIT INIT ================== */
/* ================== EDIT INIT ================== */
useEffect(() => {
  if (editingProduct) {
    setFormData({
      name: editingProduct.name ?? "",
      slug: editingProduct.slug ?? "",
      price: editingProduct.price ?? "",
      discount_price: editingProduct.discount_price ?? "",
      sku: editingProduct.sku ?? "",
      category_id: editingProduct.category_id ?? "",
      brand_id: editingProduct.brand_id ?? "",
      description: editingProduct.description ?? "",
      short_desc: editingProduct.short_desc ?? "",
      stock: editingProduct.stock ?? "",
      images: []
    });

    if (editingProduct.images?.length) {
      setPreviewImages(editingProduct.images.map(img => img.image));
    }

    if (editingProduct.variants?.length) {
      const variantData = editingProduct.variants.map((v, index) => ({
        id: v.id,
        color: v.color,
        size: v.size,
        stock: v.stock,
        price: v.price,
        images: [] // new upload only
      }));

      setVariants(variantData);

      // Existing variant images preview
      const preview = {};
      editingProduct.variants.forEach((v, idx) => {
        if (v.images?.length) {
          preview[idx] = v.images.map(img => img.image);
        }
      });
      setPreviewVariantImages(preview);
    }
  }
}, [editingProduct]);
console.log(previewVariantImages)


  /* ================== FETCH DATA ================== */
  useEffect(() => {
    api.get("/api/admin/brands", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setAllBrands(res.data.brands));

    api.get("/api/admin/categories", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setCategories(res.data));
  }, []);

  /* ================== AUTO SLUG ================== */
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      slug: prev.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    }));
  }, [formData.name]);

  /* ================== HANDLERS ================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: files }));
    setPreviewImages(files.map(file => URL.createObjectURL(file)));
  };

  /* ================== VARIANT HANDLERS ================== */
  const addVariant = () => {
    setVariants([
      ...variants,
      { id: null, color: "", size: "", stock: "", price: "", images: [] }
    ]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleVariantImageChange = (index, files) => {
    const updatedVariants = [...variants];
    const imagesArray = Array.from(files);

    // variant images store
    updatedVariants[index].images = imagesArray;
    setVariants(updatedVariants);

    // preview urls তৈরি
    const previewUrls = imagesArray.map(file =>
      URL.createObjectURL(file)
    );

    // variant wise preview store
    setPreviewVariantImages(prev => ({
      ...prev,
      [index]: previewUrls
    }));
  };

  /* ================== SUBMIT ================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formSubmitData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "images") {
          formSubmitData.append(key, value);
        }
      });

      formData.images.forEach(file => {
        formSubmitData.append("images[]", file);
      });

      variants.forEach((variant, index) => {
        if (variant.id) {
          formSubmitData.append(`variants[${index}][id]`, variant.id);
        }
        formSubmitData.append(`variants[${index}][color]`, variant.color);
        formSubmitData.append(`variants[${index}][size]`, variant.size);
        formSubmitData.append(`variants[${index}][stock]`, variant.stock);
        formSubmitData.append(`variants[${index}][price]`, variant.price);

        if (variant.images?.length) {
          variant.images.forEach(img => {
            formSubmitData.append(
              `variants[${index}][images][]`,
              img
            );
          });
        }
      });

      if (editingProduct) {
      const response=  await api.post(
          `/api/admin/products/${editingProduct.id}?_method=PUT`,
          formSubmitData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data"
            }
          }
        );
        //console.log(response.data)
      } else {
        await api.post(
          "/api/admin/products",
          formSubmitData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data"
            }
          }
        );
      }

      toast.success("Product saved successfully");
      fetchProducts();
      onClose();

    } catch (error) {
      console.log(error?.response?.data?.message ||error?.message)
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  /* ================== UI ================== */
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-[750px] max-h-[90vh] overflow-y-auto p-4 rounded">

        <div className="flex justify-between mb-3">
          <h2 className="text-xl font-bold">
            {editingProduct ? `Edit Product - ${editingProduct.name}` : "Add Product"}
          </h2>
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input name="name" value={formData.name} onChange={handleChange} className="w-full border p-2" placeholder="Product Name" />
          <input name="slug" value={formData.slug} readOnly className="w-full border p-2 bg-gray-100" />

          <div className="flex gap-2">
            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-1/2 border p-2" placeholder="Price" />
            <input type="number" name="discount_price" value={formData.discount_price} onChange={handleChange} className="w-1/2 border p-2" placeholder="Discount Price" />
          </div>

          <div className="flex gap-2">
            <input type="text" name="sku" value={formData.sku} onChange={handleChange} className="w-1/2 border p-2" placeholder="SKU" />
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-1/2 border p-2" placeholder="Base Stock" />
          </div>

          <input type="text" name="short_desc" value={formData.short_desc} onChange={handleChange} className="w-full border p-2" placeholder="Short Description" />

          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border p-2" placeholder="Description"></textarea>

          <div className="flex gap-2">
            <select name="brand_id" value={formData.brand_id} onChange={handleChange} className="w-1/2 border p-2">
              <option value="">Select Brand</option>
              {allBrands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>

            <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-1/2 border p-2">
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <input type="file" multiple onChange={handleFileChange} />

          {previewImages.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {previewImages.map((img, i) => (
                <img key={i} src={img} className="w-20 h-20 border object-cover" />
              ))}
            </div>
          )}

          {/* ================= VARIANTS ================= */}
          <h3 className="font-semibold mt-4">Product Variants</h3>

          {variants.map((variant, index) => (
            <div key={index} className="border p-3 rounded space-y-2">
              <div className="flex gap-2">
                <input className="w-1/4 border p-2" placeholder="Color"
                  value={variant.color}
                  onChange={(e) => handleVariantChange(index, "color", e.target.value)} />

                <input className="w-1/4 border p-2" placeholder="Size"
                  value={variant.size}
                  onChange={(e) => handleVariantChange(index, "size", e.target.value)} />

                <input type="number" className="w-1/4 border p-2" placeholder="Stock"
                  value={variant.stock}
                  onChange={(e) => handleVariantChange(index, "stock", e.target.value)} />

                <input type="number" className="w-1/4 border p-2" placeholder="Price"
                  value={variant.price}
                  onChange={(e) => handleVariantChange(index, "price", e.target.value)} />
              </div>

              <input
                type="file"
                multiple
                name={`variants[${index}][images][]`}
                accept="image/*"
                onChange={(e) => handleVariantImageChange(index, e.target.files)}
              />
              {previewVariantImages[index]?.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {previewVariantImages[index].map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      className="w-16 h-16 object-cover border"
                    />
                  ))}
                </div>
              )}

              {variants.length > 1 && (
                <button type="button" onClick={() => removeVariant(index)}
                  className="text-red-600 text-sm">
                  Remove Variant
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={addVariant}
            className="bg-green-600 text-white px-3 py-1 rounded">
            + Add Variant
          </button>

          <button className="bg-blue-600 text-white w-full py-2 rounded">
            {editingProduct ? "Update Product" : "Save Product"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddProductsModel;
