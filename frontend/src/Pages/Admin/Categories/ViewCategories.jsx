import React from 'react'

const ViewCategories = ({onClose, category }) => {
  return (
    <div className='fixed inset-0 bg-black/50 flex justify-center items-center z-50'>
      <div className="bg-white border p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">View Category</h2>
          <button onClick={onClose} className="bg-gray-500 py-2 px-3 text-white rounded-lg hover:text-gray-700">Close</button>
        </div>
        <p className="mb-2">Name: <span className="font-semibold">{category?.name}</span></p>
        <p className="mb-2">Description: <span className="font-semibold">{category?.description}</span></p>
      </div>
    </div>
  )
}

export default ViewCategories
