import React, { useState, useEffect } from 'react'
import "../assets/css/productImage.css"
import api from './Api/Api';


const FeatureProducts = () => {
    const [featuredProducts, setFeaturedProducts] = useState(null)
    const fetchFeaturedProducts = async () => {
        try {
            const response = await api.get("/api/featured");
          //  console.log(response.data)
            setFeaturedProducts(response.data)
        } catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        fetchFeaturedProducts()
    }, [])

    // const FeaturePro = [
    //     Produt1, Produt2,Produt3,Produt4, Produt5, Produt6,Produt7,Produt8,Produt9
    // ]
    return (
        <div class="container-fluid pt-5 pb-3">
            <h2 class="section-title position-relative text-uppercase mx-xl-5 mb-4"><span class="bg-secondary pr-3">Featured Products</span></h2>
            <div class="row px-xl-5">
                {
                    featuredProducts?.map((product, i) => (
                        <>
                            <div class="col-lg-3 col-md-4 col-sm-6 pb-1" key={i + 1}>
                                <div class="product-item bg-light mb-4">
                                    <div className="product-img position-relative overflow-hidden fixed-img-wrapper">
                                        <img
                                            className="img-fluid w-100 fixed-product-img"
                                            src={product?.images?.[0]?.image}
                                            alt=""
                                        />

                                        <div class="product-action">
                                            <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-shopping-cart"></i></a>
                                            <a class="btn btn-outline-dark btn-square" href=""><i class="far fa-heart"></i></a>
                                            <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-sync-alt"></i></a>
                                            <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-search"></i></a>
                                        </div>
                                    </div>
                                    <div class="text-center py-4">
                                        <a class="h6 text-decoration-none text-truncate" href="">{product?.name.substr(0, 20)}</a>
                                        <div class="d-flex align-items-center justify-content-center mt-2">
                                            <h5>${product.discount_price ? product.discount_price : product.price}</h5><h6 class="text-muted ml-2"><del>${product.price}</del></h6>
                                        </div>
                                        <div class="d-flex align-items-center justify-content-center mb-1">
                                            <small class="fa fa-star text-primary mr-1"></small>
                                            <small class="fa fa-star text-primary mr-1"></small>
                                            <small class="fa fa-star text-primary mr-1"></small>
                                            <small class="fa fa-star text-primary mr-1"></small>
                                            <small class="fa fa-star text-primary mr-1"></small>
                                            <small>(99)</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ))
                }


            </div>
        </div>
    )
}

export default FeatureProducts
