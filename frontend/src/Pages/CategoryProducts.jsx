import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Topbar from './Topbar';
import HeaderNavBar from './HeaderNavBar';
import Footer from './Footer';
import api from './Api/Api';
import "../assets/css/productImage.css";

const CategoryProducts = () => {

    const { category_slug, brand_slug } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            setLoading(true);

            let response;

            if (category_slug) {
                response = await api.get(`/api/categories/${category_slug}`);
            } 
            else if (brand_slug) {
                response = await api.get(`/api/brands/${brand_slug}`);
            } 
            else {
                return;
            }
            console.log(response.data)
            setData(response.data);

        } catch (error) {
            console.log(error?.response?.data?.message || error?.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [category_slug, brand_slug]);

    if (loading) return <div className="text-center mt-5">Loading...</div>;

    if (!data || !data || data.length === 0) {
        return <div className="text-center mt-5">No Products Found</div>;
    }

    return (
        <>
            <Topbar />
            <HeaderNavBar />

            <div className="container-fluid pt-5 pb-3">
                <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4">
                    <span className="bg-secondary pr-3">{data.name}</span>
                </h2>

                <div className="row px-xl-5">
                    {data?.map((p) => (
                        <div className="col-lg-3 col-md-4 col-sm-6 pb-1" key={p.id}>
                            <div className="product-item bg-light mb-4">

                                <div className="product-img position-relative overflow-hidden">
                                    {p.images?.length > 0 && (
                                        <img
                                            className="img-fluid w-100 product-img-fixed"
                                            src={p.images[0].image}
                                            alt={p.name}
                                        />
                                    )}
                                </div>

                                <div className="text-center py-4">
                                    <Link
                                        className="h6 text-decoration-none text-truncate"
                                        to={`/products/${p.slug}`}
                                    >
                                        {p.name.slice(0, 25)}
                                    </Link>

                                    <div className="d-flex align-items-center justify-content-center mt-2">
                                        {p.discount_price ? (
                                            <>
                                                <h5>${p.discount_price}</h5>
                                                <h6 className="text-muted ml-2">
                                                    <del>${p.price}</del>
                                                </h6>
                                            </>
                                        ) : (
                                            <h5>${p.price}</h5>
                                        )}
                                    </div>

                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </>
    );
};

export default CategoryProducts;
