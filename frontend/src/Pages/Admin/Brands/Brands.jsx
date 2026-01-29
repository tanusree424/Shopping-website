import React,{useState, useEffect} from 'react'
import api from '../../Api/Api';
import DataTable from 'react-data-table-component';
import Sidebar from '../Sidebar';
import AdminHeader from '../AdminHeader';
import AddBrands from './AddBrands';
import ViewBrands from './ViewBrands';

import { PencilIcon, PlusCircle, Trash2Icon, Eye } from 'lucide-react';

const Brands = () => {
    const [Brands, setBrands] = useState([]);
    const [openAddBrandModal, setopenAddBrandModal] = useState(false);
    const [viewBrandModal, setViewBrandModal] = useState(false);
    const [singleBarnd, setSingleBarnd] = useState(null);
    const [EditBrandModal, setEditBrandModal] = useState(false);
    

    const fetchBrands = async () => {
        try {
            const response = await api.get("/api/admin/brands",{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },


            });
            console.log(response.data)
            setBrands(response.data.brands);

        } catch (error) {
            console.error("Error fetching brands:", error);
        }
    };
    useEffect(() => {
        fetchBrands();
    }, []);
    const handleViewBarnd = (brand)=>{
        setViewBrandModal(true)
        setSingleBarnd(brand);
    }
    const handleEdit = (row)=>{
        setEditBrandModal(true)
        setSingleBarnd(row)
    }
    const columns = [
    {
        name: 'ID',
        selector: (row,i) => i+1,
        sortable: true,
    },
    {
        name: 'Brand Name',
        selector: (row) => row.name,
        sortable: true,
    },
    {
        name: 'Description',
        selector: (row) => row.description,
        sortable: true,

    },
    {
        name: 'Actions',
        cell: (row) => (

            <div className="flex gap-2">
                <button className='py-2 px-2 flex gap-2 justify-center items-center bg-yellow-500 text-white font-bold' onClick={()=>handleEdit(row)} >
                <PencilIcon /> Edit
                </button>
                 <button className='py-2 px-2 flex gap-2 justify-center items-center bg-sky-600 text-gray-200 font-bold' onClick={() => handleViewBarnd(row)}>
                <Eye /> View
                </button>
                <button className="py-2 px-2 flex gap-2 justify-center items-center bg-red-500 text-white rounded" onClick={()=>handleDelete(row.id)}>
                 <Trash2Icon/>   Delete
                </button>
            </div>
        ),
    },

];


  return (
    <div className='flex' >
        <div className="w-[350px]">
            <Sidebar />
        </div>
        <div className="flex-1">
            <AdminHeader />
            <div className="p-4">
                <div className="flex m-3 justify-between items-center">
                <h2 className="text-xl font-semibold mb-4">Brands</h2>
                <button className="py-3 px-2 text-white bg-sky-500" onClick={() => setopenAddBrandModal(true)}>
                    <PlusCircle className="inline-block mr-2" />
                    Add Brand
                </button>
                </div>

                <DataTable
                    columns={columns}
                    data={Brands}
                   // selectableRows={false}
                    pagination
                    paginationPerPage={5}
                    paginationRowsPerPageOptions={[5,10,15,20,25]}
                    highlightOnHover
                />
            </div>
        </div>
        {openAddBrandModal && <AddBrands fetchBrands={fetchBrands} onClose={() => setopenAddBrandModal(false)} />}
        {
            viewBrandModal && <ViewBrands singleBarnd={singleBarnd} onClose={()=> setViewBrandModal(false)}  />
        }

        {
            EditBrandModal && <AddBrands fetchBrands={fetchBrands} onClose={() => setEditBrandModal(false) } SingleBarnd={singleBarnd} EditBrandModal={EditBrandModal}   />
        }
    </div>
  )
}

export default Brands
