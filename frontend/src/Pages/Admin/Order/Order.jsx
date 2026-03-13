import React, { useState, useEffect } from 'react'
import Sidebar from '../Sidebar'
import AdminHeader from '../AdminHeader'
import DataTable from 'react-data-table-component';
import api from '../../Api/Api';
import { Trash2 , Eye } from 'lucide-react';
import OrderDetails from './OrderDetails';
import toast from 'react-hot-toast';
const Order = () => {
    const [Orders, setOrders] = useState([]);
    const [ViewOrderDetails, setViewOrderDetails] = useState(false)
    const [singleOrder, setSingleOrder] = useState(null)
    const [status, setStatus] = useState("")
    const fetchOrders = async () => {
        try {
            const response = await api.get("/api/admin/orders", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken")} `
                }
            });
            console.log(response?.data)
            setOrders(response?.data?.orders)
        } catch (error) {
            console.log(error?.response?.data?.message || error?.message)
        }
    }
   const handleChange = async (e, orderId) => {

    const value = e.target.value;

    try {

        const response = await api.put(
            `/api/admin/status-change/${orderId}`,
            {
                status: value
            },
            {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                }
            }
        );

        console.log(response.data);
        toast.success(response?.data?.message)

        fetchOrders();

    } catch (error) {
        console.log(error?.response?.data?.message || error?.message);
    }
}
    const handleViewOrder = async (orderId)=>{
        setViewOrderDetails(true)
        try {
            const response = await api.get(`/api/admin/orders/${orderId}`, {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                }
            });
          //  console.log(response.data)
            setSingleOrder(response.data)

        } catch (error) {
            console.log(error?.response?.data?.message || error?.message)
        }

    }
    useEffect(() => {
        fetchOrders()
    }, [])
    const handleDelete = async (row) => {
        if (window.confirm("Are You sure want to delete?")) {
            
        
        try {
            const response = await api.delete(`/api/admin/order/${row?.id}`,{
                headers:{Authorization:`Bearer ${localStorage.getItem("adminToken")}`}
            })
            console.log(response.data);
            toast.success(response.data?.message)
            fetchOrders();
        } catch (error) {
             console.log(error?.response?.data?.message || error?.message)
        }
    }else
        return
}

    const columns = [

        {
            name: "Order Number",
            selector: row => row.order_number,
            sortable: true
        },
       {
  name: "Order Status",
  cell: row => (
   <select
  value={row.order_status}
  onChange={(e) => handleChange(e, row.id)}
  className="px-2 py-1 border rounded"
>
  {["pending","processing","shipped","delivered","cancelled"].map((s) => (
    <option key={s} value={s}>
      {s}
    </option>
  ))}
</select>
  ),
  sortable: true
},


        {
            name: "Price",
            selector: row => row.order_items[0]?.price
        },
        {
            name: "Quantity",
            selector: row => row.order_items[0]?.quantity
        },
        {
            name: "Grand Total",
            selector: row => row.grand_total,
            sortable: true
        },
        {
            name: "Order Date",
            selector: row => new Date(row.created_at).toLocaleDateString(["en-IN"], {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',

                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }),
        },
        {
            name: "Actions",
            cell: (row) => (
                <div className='flex'>
                    {/* Future action buttons can be added here */}
                    <button className="bg-red-500 flex text-white  px-2 py-1 rounded mr-2" onClick={() => handleDelete(row)} > <Trash2 /> <span className='mt-1 text-sm'></span></button>
                    <button
                        title='View'
                        className="inline-flex items-center gap-2 py-2 px-3 rounded bg-sky-600 text-white font-bold"
                        onClick={() => handleViewOrder(row.id)}
                    >
                        <Eye className="w-4 h-4" />

                    </button>
                </div>
            ),
        }
    ];

    return (
        <div className="flex">
            <div className='w-[350px]' >
                <Sidebar />

            </div>
            <div className="flex-1">
                <AdminHeader />
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold mb-4">Orders</h2>



                    </div>
                    <DataTable
                        columns={columns}
                        data={Orders}
                        paginationPerPage={5}
                        paginationRowsPerPageOptions={[5, 10, 15, 20, 25]}
                        pagination
                    />
                </div>
                <div className="position-relative">
                  {
                    
                ViewOrderDetails && (
                   <OrderDetails setViewOrderDetails={setViewOrderDetails} singleOrder={singleOrder}/>
                )
                
            }
            </div>
            </div>
    
          
        </div>
    )
}

export default Order
