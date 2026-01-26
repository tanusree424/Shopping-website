import React from 'react'
import { CircleX } from 'lucide-react';

const ViewModel = ({ ViewUser , autoClose }) => {
   // console.log(ViewUser)
    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black/50 '>
            <div className="bg-white w-[450px] p-4">

                <div className="border border-dark pb-0 p-4">
                    <div className="flex justify-between">
                    <h3>View User</h3>
                    <CircleX onClick={ autoClose} className='text-3xl cursor-pointer'/>

                    </div>
                    <div className="border-2 w-full"></div>
                    <div className="my-3 flex gap-3">
                        <span>Name:</span>
                        <span>{ViewUser?.name}</span>
                    </div>
                    <div className="mb-3 flex gap-3">
                        <span>Email:</span>
                        <span>{ViewUser?.email}</span>
                    </div>
                     <div className="mb-3 flex gap-3">
                        <span>Role:</span>
                        <span>{ViewUser?.roles.join(", ")}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewModel
