import React, { useEffect, useState } from 'react'
import AdminHeader from '../AdminHeader'
import DataTable from 'react-data-table-component';
import Sidebar from '../Sidebar';
import api from '../../Api/Api';
import PaymentOder from './PaymentOder';

const Payments = () => {

    const [Payments, setPayments] = useState([]);
    const [PayementOrderModal, setPayementOrderModal] = useState(false)
    const [PaymentOrderDeatils, setPaymentOrderDeatils] = useState(null)

    const fetchAllPayemnts = async () => {
        try {
            const response = await api.get("/api/admin/payments", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                }
            });

            console.log(response.data)
            setPayments(response.data)

        } catch (error) {
            console.log(error?.response?.data?.message)
        }
    }

    useEffect(() => {
        fetchAllPayemnts()
    }, []);

    const seeOrderDetails = async (paymentOrder) => {
 try {

  const response = await api.get(
  `/api/admin/payment/${paymentOrder.id}`,
  {
   headers:{
    Authorization:`Bearer ${localStorage.getItem("adminToken")}`
   }
  });

  console.log(response.data)

  setPayementOrderModal(true)
  setPaymentOrderDeatils(response.data?.order?.order_items)

 } catch (error) {
  console.log(error?.response?.data?.message || error?.message)
 }
}

    const columns = [
        {
            name: "ID",
            selector: row => row.id,
            sortable: true
        },
        {
            name: "Item Name",
            selector: row => row.order?.order_items[0]?.product?.name,
            sortable: true
        },
        {
            name:"Payer Name",
            selector: row =>  row?.user?.name,
            sortable:true
        },
        {
        name:"Payment Method",
        selector: row => row.payment_method
        },
        {
        name:"Payment Status",
        selector: row => row.payment_status
        },
        {
            name: "Actions",
            cell :  row => (
                <>
                <button onClick={()=> seeOrderDetails(row)} className='px-2 py-2 bg-blue-500 text-white text-2xl rounded-2xl'>See Deatils</button>
                </>
            )
        }
        
    ]

    return (
        <div className='flex'>

            <div className="w-[350px]">
                <Sidebar />
            </div>

            <div className="flex-1">
                <AdminHeader />

                <div className="p-4">

                    <div className="flex justify-between">
                        <h2>PAYMENT DETAILS</h2>
                    </div>

                    <DataTable
                        columns={columns}
                        data={Payments}
                        pagination
                    />

                </div>
            </div>
      {
PayementOrderModal && (
<PaymentOder
orderDetails={PaymentOrderDeatils}
autoClose={()=>{
setPayementOrderModal(false)
setPaymentOrderDeatils(null)
}}
/>
)
}
        </div>
    )
}

export default Payments