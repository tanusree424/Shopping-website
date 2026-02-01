import React, { useEffect, useState } from "react";
import api from "../../Api/Api";
import toast from "react-hot-toast";

const AddProductsModel = ({ onClose, fetchProducts, editingProduct }) => {

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
    status: "",
    images: [] // ✅ only NEW uploaded files
  });

  const [previewImages, setPreviewImages] = useState([]); // ✅ DB + new preview
  const [allBrands, setAllBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  /* ================== EDIT MODE INIT ================== */
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
        status: editingProduct.status ?? "",
        images: [] // ❗ very important
      });

      // ✅ DB images show in edit form
      if (editingProduct.images?.length > 0) {
        setPreviewImages(editingProduct.images.map(img => img.url));
      }
    }
  }, [editingProduct]);

  /* ================== FETCH DATA ================== */
  useEffect(() => {
    api.get("/api/admin/brands", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setAllBrands(res.data.brands));

    api.get("/api/admin/categories", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setCategories(res.data));
  }, []);

  /* ================== HANDLERS ================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: files }));
    setPreviewImages(files.map(file => URL.createObjectURL(file))); // overwrite preview
  };
  useEffect(() => {
  if (editingProduct ) {
    const editingProductImage = Array.from(editingProduct.images);
    // console.log(editingProductImage)
    editingProductImage.map((img)=>{
        const files = Array.from(editingProductImage.map((edp)=> edp.image));
        //console.log(files)
        const previews = files.map(file =>
           {
            return typeof file === "string" ?
            file : URL.createObjectURL(file)
           }
          );
          setPreviewImages(previews);

       // console.log(previews)
       // setPreviewImages(previews)
    }


    )
  }
}, [editingProduct])

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

        let res;

        if (editingProduct) {
            res = await api.post(
                `/api/admin/products/${editingProduct.id}?_method=PUT`,
                formSubmitData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
        } else {
            res = await api.post(
                "/api/admin/products",
                formSubmitData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            
             toast.success(res.data?.message || "Product saved successfully");
        fetchProducts();   // ✅ list refresh
        onClose(); 
        }

        toast.success(res.data?.message || "Product saved successfully");
        fetchProducts();   // ✅ list refresh
        onClose();         // ✅ modal close (GUARANTEED)

    } catch (error) {
        toast.error(
            error?.response?.data?.message || "Something went wrong"
        );
    }
};


  /* ================== UI ================== */
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-[650px] max-h-[90vh] overflow-y-auto p-4 rounded">

        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">
            {editingProduct ? `Edit Product - ${editingProduct?.name}` : "Add Product"}
          </h2>
          <button onClick={onClose} className="bg-gray-400 px-3 py-1 text-white rounded">
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input name="name" value={formData.name} onChange={handleChange} className="w-full border p-2" placeholder="Product Name" />

          <input name="slug" value={formData.slug} onChange={handleChange} className="w-full border p-2" placeholder="Slug" />

          <div className="flex gap-2">
            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-1/2 border p-2" placeholder="Price" />
            <input type="number" name="discount_price" value={formData.discount_price} onChange={handleChange} className="w-1/2 border p-2" placeholder="Discount Price" />
          </div>

          <input name="sku" value={formData.sku} onChange={handleChange} className="w-full border p-2" placeholder="SKU" />

          <div className="flex gap-2">
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-1/2 border p-2" placeholder="Stock" />
            <select name="status" value={formData.status} onChange={handleChange} className="w-1/2 border p-2">
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="deactive">Deactive</option>
            </select>
          </div>

          <div className="flex gap-2">
          
            <select name="brand_id" value={formData.brand_id} onChange={handleChange} className="w-1/2 border p-2">
            {
                allBrands.map((brand)=>
                 <option value={brand.id}>{brand.name}</option>
                )
            }
            </select>
             <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-1/2 border p-2">
            {
                categories.map((cat)=>
                 <option key={cat.id} value={cat.id}>{cat.name}</option>
                )
            }
            </select>
          </div>

          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border p-2" placeholder="Description" />

          <input type="file" multiple onChange={handleFileChange} />

          {/* ✅ DB + new preview */}
          {previewImages.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {previewImages.map((src, i) => (
                <img key={i} src={src} className="w-24 h-24 object-cover border rounded" />
              ))}
            </div>
          )}

          <button className="bg-blue-600 text-white w-full py-2 rounded">
            Save Product
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddProductsModel;
