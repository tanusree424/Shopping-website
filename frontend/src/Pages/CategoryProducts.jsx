import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Topbar from './Topbar';
import HeaderNavBar from './HeaderNavBar';
import Footer from './Footer';
import api from './Api/Api';
import "../assets/css/productImage.css";
const CategoryProducts = () => {
    const { slug } = useParams();
    const [category, setCategory] = useState(null);

    const fetchCategoryProducts = async () => {
        try {
            const response = await api.get(`/api/categories/${slug}`);
          //  console.log(response.data);
            setCategory(response.data); // পুরো category object রাখো
        } catch (error) {
            console.log(error?.response?.data?.message || error?.message);
        }
    };

    useEffect(() => {
        fetchCategoryProducts();
    }, [slug]);

    if (!category) return <div>Loading...</div>;

    return (
        <>
        <Topbar/>
        <HeaderNavBar/>
        <div class="container-fluid pt-5 pb-3">
            <h2 class="section-title position-relative text-uppercase mx-xl-5 mb-4"><span class="bg-secondary pr-3">{category.name}</span></h2>
            <div class="row px-xl-5">
                {
                    category.products.map((p, i) => (
                        <>
                            <div class="col-lg-3 col-md-4 col-sm-6 pb-1" key={i + 1}>
                                <div class="product-item bg-light mb-4">
                                    <div class="product-img position-relative overflow-hidden">
                                        {p.images?.length > 0 && (
                                            <img class="img-fluid w-100 h-200 product-img-fixed" src={p.images[0].image} width="200" alt={p.name} />
                                        )}


                                        <div class="product-action">
                                            <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-shopping-cart"></i></a>
                                            <a class="btn btn-outline-dark btn-square" href=""><i class="far fa-heart"></i></a>
                                            <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-sync-alt"></i></a>
                                            <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-search"></i></a>
                                        </div>
                                    </div>
                                    <div class="text-center py-4">
                                        <Link class="h6 text-decoration-none text-truncate" to={`/products/${p.slug}`}>{p.name.substr(0, 25)}</Link>
                                        <div class="d-flex align-items-center justify-content-center mt-2">
                                            {
                                                p.discount_price !== null ? (
                                                    <>
                                                        <h5>${p.discount_price}</h5><h6 class="text-muted ml-2"><del>${p.price}</del></h6>
                                                    </>
                                                )
                                                    : (
                                                        <>
                                                            <h5>${p.price}</h5>
                                                        </>
                                                    )


                                            }
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
        <Footer/>
        </>
    );
};

export default CategoryProducts;