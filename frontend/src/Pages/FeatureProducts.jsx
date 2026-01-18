import React from 'react'
import Produt1 from "../assets/img/product-1.jpg";
import Produt2 from "../assets/img/product-2.jpg";
import Produt3 from "../assets/img/product-3.jpg";
import Produt4 from "../assets/img/product-4.jpg";
import Produt5 from "../assets/img/product-5.jpg";
import Produt6 from "../assets/img/product-6.jpg";
import Produt7 from "../assets/img/product-7.jpg";
import Produt8 from "../assets/img/product-8.jpg";
import Produt9 from "../assets/img/product-9.jpg";


const FeatureProducts = () => {
    const FeaturePro = [
        Produt1, Produt2,Produt3,Produt4, Produt5, Produt6,Produt7,Produt8,Produt9
    ]
  return (
     <div class="container-fluid pt-5 pb-3">
        <h2 class="section-title position-relative text-uppercase mx-xl-5 mb-4"><span class="bg-secondary pr-3">Featured Products</span></h2>
        <div class="row px-xl-5">
            {
                FeaturePro.map((img, i)=>(
                    <>
                      <div class="col-lg-3 col-md-4 col-sm-6 pb-1" key={i+1}>
                <div class="product-item bg-light mb-4">
                    <div class="product-img position-relative overflow-hidden">
                        <img class="img-fluid w-100" src={img} alt=""/>
                        <div class="product-action">
                            <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-shopping-cart"></i></a>
                            <a class="btn btn-outline-dark btn-square" href=""><i class="far fa-heart"></i></a>
                            <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-sync-alt"></i></a>
                            <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-search"></i></a>
                        </div>
                    </div>
                    <div class="text-center py-4">
                        <a class="h6 text-decoration-none text-truncate" href="">Product Name Goes Here</a>
                        <div class="d-flex align-items-center justify-content-center mt-2">
                            <h5>$123.00</h5><h6 class="text-muted ml-2"><del>$123.00</del></h6>
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
