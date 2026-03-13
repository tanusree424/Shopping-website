import React from 'react'

const OrderDetails = ({ setViewOrderDetails, singleOrder }) => {

  return (
    <div className='flex fixed inset-0 justify-center items-center bg-black/50 z-50'>
      
      <div className='bg-white p-6 rounded-lg shadow-lg w-[600px]'>

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className='text-lg font-bold'>Order Details</h2>

          <button
            onClick={() => setViewOrderDetails(false)}
            className='bg-gray-500 px-3 py-1 rounded text-white'
          >
            Close
          </button>
        </div>

        {/* Order Info */}
        <div className='mb-4'>
          <p><b>Order Number:</b> {singleOrder?.order_number}</p>
          <p><b>Status:</b> {singleOrder?.order_status}</p>
          <p><b>Grand Total:</b> ₹{singleOrder?.grand_total}</p>
          <p><b>Ordered By:</b> - {singleOrder?.user?.name || "Guest User"}</p>
          <p>
            <b>Date:</b>{" "}
            {singleOrder?.created_at &&
              new Date(singleOrder.created_at).toLocaleString()}
          </p>
        </div>

        {/* Product List */}
        <div>
          <h3 className='font-semibold mb-2'>Products</h3>

          {singleOrder?.order_items?.map((item) => (
            <div
              key={item.id}
              className='flex items-center gap-3 border-b py-2'
            >

              <img
                src={item?.product?.images[0]?.image}
                alt=""
                className='w-12 h-12 object-cover rounded'
              />

              <div>
                <p className='text-sm font-medium'>
                  {item?.product?.name}
                </p>

                <p className='text-xs text-gray-500'>
                  Qty: {item?.quantity} | Price: ₹{item?.price}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default OrderDetails