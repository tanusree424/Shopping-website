import React, {useEffect} from 'react'
import { Link } from 'react-router-dom'
import cat1 from "../assets/img/cat-1.jpg"
import {useSelector , useDispatch} from "react-redux"
import { fetchAllCategories } from '../redux/Slices/AllCategoriesSlice'
const Categories = () => {
    const {loading , allCategories } = useSelector((state)=> state.allCategories);
    const dispatch = useDispatch()
    useEffect(() => {
      
    dispatch(fetchAllCategories())
     
    }, [dispatch])
   // console.log(allCategories)
  return (
    <div className="container-fluid pt-5">
        <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">Categories</span></h2>
        <div className="row px-xl-5 pb-3">
            {
                allCategories.map((cat,item)=>(
                    <>
                    <div className="col-lg-3 col-md-4 col-sm-6 pb-1" key={item+1}>
                <Link className="text-decoration-none" to={`/category/${cat.slug}`}>
                    <div className="cat-item img-zoom d-flex align-items-center mb-4">
                        <div className="overflow-hidden" style={{"width": "100px", "height": "100px"}}>
                            <img className="img-fluid" src={cat.category_image} alt=""/>
                        </div>
                        <div className="flex-fill pl-3">
                            <h6>{cat.name}</h6>
                            <small className="text-body">100 Products</small>
                        </div>
                    </div>
                </Link>
            </div>
                    </>
                )) 

            }
           
            
            {/* <div className="col-lg-3 col-md-4 col-sm-6 pb-1">
                <a className="text-decoration-none" href="">
                    <div className="cat-item img-zoom d-flex align-items-center mb-4">
                        <div className="overflow-hidden" style="width: 100px; height: 100px;">
                            <img className="img-fluid" src="img/cat-3.jpg" alt=""/>
                        </div>
                        <div className="flex-fill pl-3">
                            <h6>Category Name</h6>
                            <small className="text-body">100 Products</small>
                        </div>
                    </div>
                </a>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6 pb-1">
                <a className="text-decoration-none" href="">
                    <div className="cat-item img-zoom d-flex align-items-center mb-4">
                        <div className="overflow-hidden" style="width: 100px; height: 100px;">
                            <img className="img-fluid" src="img/cat-4.jpg" alt=""/>
                        </div>
                        <div className="flex-fill pl-3">
                            <h6>Category Name</h6>
                            <small className="text-body">100 Products</small>
                        </div>
                    </div>
                </a>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6 pb-1">
                <a className="text-decoration-none" href="">
                    <div className="cat-item img-zoom d-flex align-items-center mb-4">
                        <div className="overflow-hidden" style="width: 100px; height: 100px;">
                            <img className="img-fluid" src="img/cat-4.jpg" alt=""/>
                        </div>
                        <div className="flex-fill pl-3">
                            <h6>Category Name</h6>
                            <small className="text-body">100 Products</small>
                        </div>
                    </div>
                </a>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6 pb-1">
                <a className="text-decoration-none" href="">
                    <div className="cat-item img-zoom d-flex align-items-center mb-4">
                        <div className="overflow-hidden" style="width: 100px; height: 100px;">
                            <img className="img-fluid" src="img/cat-3.jpg" alt=""/>
                        </div>
                        <div className="flex-fill pl-3">
                            <h6>Category Name</h6>
                            <small className="text-body">100 Products</small>
                        </div>
                    </div>
                </a>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6 pb-1">
                <a className="text-decoration-none" href="">
                    <div className="cat-item img-zoom d-flex align-items-center mb-4">
                        <div className="overflow-hidden" style="width: 100px; height: 100px;">
                            <img className="img-fluid" src="img/cat-2.jpg" alt=""/>
                        </div>
                        <div className="flex-fill pl-3">
                            <h6>Category Name</h6>
                            <small className="text-body">100 Products</small>
                        </div>
                    </div>
                </a>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6 pb-1">
                <a className="text-decoration-none" href="">
                    <div className="cat-item img-zoom d-flex align-items-center mb-4">
                        <div className="overflow-hidden" style="width: 100px; height: 100px;">
                            <img className="img-fluid" src="img/cat-1.jpg" alt=""/>
                        </div>
                        <div className="flex-fill pl-3">
                            <h6>Category Name</h6>
                            <small className="text-body">100 Products</small>
                        </div>
                    </div>
                </a>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6 pb-1">
                <a className="text-decoration-none" href="">
                    <div className="cat-item img-zoom d-flex align-items-center mb-4">
                        <div className="overflow-hidden" style="width: 100px; height: 100px;">
                            <img className="img-fluid" src="img/cat-2.jpg" alt=""/>
                        </div>
                        <div className="flex-fill pl-3">
                            <h6>Category Name</h6>
                            <small className="text-body">100 Products</small>
                        </div>
                    </div>
                </a>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6 pb-1">
                <a className="text-decoration-none" href="">
                    <div className="cat-item img-zoom d-flex align-items-center mb-4">
                        <div className="overflow-hidden" style="width: 100px; height: 100px;">
                            <img className="img-fluid" src="img/cat-1.jpg" alt=""/>
                        </div>
                        <div className="flex-fill pl-3">
                            <h6>Category Name</h6>
                            <small className="text-body">100 Products</small>
                        </div>
                    </div>
                </a>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6 pb-1">
                <a className="text-decoration-none" href="">
                    <div className="cat-item img-zoom d-flex align-items-center mb-4">
                        <div className="overflow-hidden" style="width: 100px; height: 100px;">
                            <img className="img-fluid" src="img/cat-4.jpg" alt=""/>
                        </div>
                        <div className="flex-fill pl-3">
                            <h6>Category Name</h6>
                            <small className="text-body">100 Products</small>
                        </div>
                    </div>
                </a>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6 pb-1">
                <a className="text-decoration-none" href="">
                    <div className="cat-item img-zoom d-flex align-items-center mb-4">
                        <div className="overflow-hidden" style="width: 100px; height: 100px;">
                            <img className="img-fluid" src="img/cat-3.jpg" alt=""/>
                        </div>
                        <div className="flex-fill pl-3">
                            <h6>Category Name</h6>
                            <small className="text-body">100 Products</small>
                        </div>
                    </div>
                </a>
            </div> */}
        </div>
    </div>
  )
}

export default Categories
