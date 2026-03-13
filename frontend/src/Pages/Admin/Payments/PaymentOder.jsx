import React from 'react'

const PaymentOder = ({autoClose}) => {
  return (
    <div className='inset-0 fixed bg-black/50 flex justify-center items-center'>
      <div className="bg-white px-[15px]">
        <div className="flex w-[300px] justify-center gap-[18px] items-center">
            <h2 >Order Details</h2>
            <button onClick={()=>autoClose} className='px-3 py-2 bg-gray-500 text-white rounded-full'>Close</button>
        </div>
      </div>
    </div>
  )
}

export default PaymentOder
