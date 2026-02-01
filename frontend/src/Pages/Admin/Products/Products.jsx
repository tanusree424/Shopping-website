import React,{useState, useEffect} from 'react'
import Sidebar from '../Sidebar'
import AdminHeader from '../AdminHeader'
import DataTable from 'react-data-table-component'
import api from '../../Api/Api'
import { Eye, PencilIcon, Trash2Icon, PlusCircle } from 'lucide-react'
import AddProductsModel from './AddProductsModel'
import ViewProducts from './ViewProducts'
import toast from 'react-hot-toast'
const Products = () => {
    const [products, setProducts] = useState([]);
    const [openAddProductModel, setOpenAddProductModel] = useState(false);
    const [openViewProductModal, setopenViewProductModal] = useState(false)
    const [SingleProduct, setSingleProduct] = useState([]);
    const [editingProductsModalOpen, setEditingProductsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState([]);
const fetchProducts = async ()=>{
    try {
        const response = await api.get("/api/admin/products",{
            headers:{
                Accept:"application/json",
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        });
       // console.log(response.data.products);
        setProducts(response.data.products)
    } catch (error) {
        console.log(error.message)
    }
}
const handleEdit =(row)=>{
 setEditingProductsModalOpen(true);
 setEditingProduct(row)

}
const handleViewProdcut = (product)=>{
setopenViewProductModal(true)
setSingleProduct(product)
}

const handleDelete = async(Prodcut)=>{
  if (window.confirm(`Are you sure want to delete ${Prodcut.name} ?`)) {
    
  
try {
  const response = await api.delete(`/api/admin/products/${Prodcut.id}`,{
    headers:{
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }
  });
  console.log(response.data);
  toast.success(response.data.message);
  fetchProducts();
} catch (error) {
  console.log(error?.response?.data?.message || error?.message);
  toast.error(error?.response?.data?.message || error?.message)
}
} else
return;
}
useEffect(() => {
  fetchProducts()
}, [])
// console.log(products)
  const columns =[
    {
        name:"ID",
          selector: (row,i) => i+1,
        sortable: true,
    },
    {
        name:"Prodcut Name",
        selector: (row)=>row.name,
        sortable:true
    },
    
    
    
{
    name: "status",
    selector: (row) => row.status === 1 ? "active" : "deactive",
    sortable: true
},
{
 name:"Action",
 cell: (row)=> (
    <div className='flex gap-2'>
    <button className='py-2 px-2 flex gap-2 justify-center rounded items-center bg-yellow-500 text-white font-bold' onClick={()=>handleEdit(row)} >
                    <PencilIcon /> Edit
                    </button>
                     <button onClick={()=>handleViewProdcut(row)} className='py-2 px-2 flex gap-2 justify-center items-center bg-sky-600 text-gray-200 font-bold'>
                    <Eye /> View
                    </button>
                    <button className="py-2 px-2 flex gap-2 justify-center items-center bg-red-500 text-white rounded" onClick={()=>handleDelete(row)}>
                     <Trash2Icon/>   Delete
                    </button>
    </div>
 )
}

  ]  
  const handleAddProdcut =()=>{
    setOpenAddProductModel(true)
  }
  return (
    <>
    <div className='flex'>
      <div className="w-[350px]">
        <Sidebar/>
      </div>
      <div className="flex-1 w-full">
        <AdminHeader/>
        <div className="p-4">
            <div className="flex py-4 justify-between items-center">
             <h2> Products</h2>  
             <button className='flex py-2 px-2 text-white bg-blue-400 justify-center items-center' onClick={()=>handleAddProdcut()} >
                <PlusCircle /> Add Products
             </button>
            </div>
            <DataTable columns={columns}
            data={products}
            />
        </div>
      </div>

    
    </div>
    {
        openAddProductModel && (
            <AddProductsModel onClose={()=>setOpenAddProductModel(false)} fetchProducts={fetchProducts} />
        )
    }
    {
      openViewProductModal && (
        <ViewProducts onClose={()=>setopenViewProductModal(false)} products={SingleProduct}/>
      )
    }

    {
      editingProductsModalOpen && editingProduct && (
       <AddProductsModel onClose={()=> {setEditingProductsModalOpen(false); setEditingProduct(null) }} editingProduct={editingProduct} fetchProducts={fetchProducts}/>
      )
    }
  
    </>
  )
}

export default Products
