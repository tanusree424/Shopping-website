import React from 'react'

const ViewBrands = ({onClose , singleBarnd}) => {
    
  return (
    <div className='flex justify-center items-center fixed inset-0 bg-black/50 z-50'>
      <div className="bg-white border w-[450px] p-4">
        <div className="flex justify-between gap-5">
            <h2>Brand - {singleBarnd?.name}</h2>
            <button className='py-2 px-2 bg-gray-400 font-bold rounded-2xl text-white' onClick={()=>onClose()}>
                Close
            </button>
        </div>
        <hr />
        <img src={singleBarnd.logo} />
        <div className='mb-2'>
        <span className='font-bold  text-gray-500'>
            BrandName: <span>{singleBarnd?.name}</span>
        </span>
        </div>
        <div className="mb-2">

        <span className='font-bold text-gray-500'>
            Country: <span>{singleBarnd?.country}</span>
        </span>
        </div>
         <div className="mb-2">

        <span className='font-bold text-gray-500'>
            Website: <span><a href={singleBarnd?.website} target="_blank">{singleBarnd?.website}</a></span>
        </span>
        </div>
         <div className="mb-2">

        <span className='font-bold text-gray-500'>
            slug: <span>{singleBarnd?.slug}</span>
        </span>
        </div>
         <div className="mb-2">

        <span className='font-bold text-gray-500'>
            Description: <span>{singleBarnd?.description}</span>
        </span>
        </div>
      </div>
    </div>
  )
}

export default ViewBrands
