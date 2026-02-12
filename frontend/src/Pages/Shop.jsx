import React, { useEffect, useState } from 'react'
import Topbar from './Topbar'
import HeaderNavBar from './HeaderNavBar'
import Footer from './Footer'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProducts } from '../redux/Slices/ProductsSlice'
import { Images } from 'lucide-react'
import { Link } from 'react-router-dom'
const Shop = () => {
    const { loading, allProducts } = useSelector((state) => state.allProducts)
    console.log(allProducts)
    const [filters, setFilters] = useState({
        //  page: 1,
        min_price: '',
        max_price: '',
        color: '',
        size: ''
    })

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchProducts(filters))
    }, [filters])

    const priceRanges = [
        { id: "all", label: "All Price", min: null, max: null },
         { id: "0-500", label: "₹0 - ₹500", min: 0, max: 500 },
        { id: "500-1000", label: "₹500 - ₹1,000", min: 500, max: 1000 },
        { id: "1000-5000", label: "₹1,000 - ₹5,000", min: 1000, max: 5000 },
        { id: "5000-10000", label: "₹5,000 - ₹10,000", min: 5000, max: 10000 },
        { id: "10000-20000", label: "₹10,000 - ₹20,000", min: 10000, max: 20000 },
        { id: "20000-30000", label: "₹20,000 - ₹30,000", min: 20000, max: 30000 },
        { id: "30000-50000", label: "₹30,000 - ₹50,000", min: 30000, max: 50000 },
        { id: "50000-100000", label: "₹50,000 - ₹1,00,000", min: 50000, max: 100000 },
        { id: "100000-1000000", label: "₹1,00,000 - ₹10,00,000", min: 100000, max: 1000000 },
    ];
    const colors = [
        { id: "all", label: "All Color", value: null, count: 1000 },
        { id: "black", label: "Black", value: "Black", count: 150 },
        { id: "white", label: "White", value: "White", count: 295 },
        { id: "red", label: "Red", value: "Red", count: 246 },
        { id: "blue", label: "Blue", value: "Blue", count: 145 },
        { id: "green", label: "Green", value: "Green", count: 168 },
    ]


    const getActiveVariant = (product, filters) => {
        if (!product?.variants?.length) return null;

        // যদি color select না করা থাকে
        if (!filters?.color) return null;

        return product.variants.find(
            v => v.color?.toLowerCase() === filters.color.toLowerCase()
        ) || null;
    };


    const getVariantImage = (product, activeVariant, filters) => {

        // 🟢 যদি কোনো color select না থাকে
        if (!filters?.color) {
            return product?.images?.[0]?.image || "/no-image.png";
        }

        // 🔴 যদি color select করা থাকে

        // matching variant না থাকলে কিছুই দেখাবে না
        if (!activeVariant) return null;

        // selected variant এর image না থাকলে কিছুই দেখাবে না
        if (!activeVariant?.images?.length) return null;

        // ✅ শুধু selected color image দেখাবে
        return activeVariant.images[0].image;
    };


    return (
        <div>
            <Topbar />
            <HeaderNavBar />
            <div className="container-fluid">
                <div className="row px-xl-5">
                    <div className="col-12">
                        <nav className="breadcrumb bg-light mb-30">
                            <a className="breadcrumb-item text-dark" href="#">Home</a>
                            <a className="breadcrumb-item text-dark" href="#">Shop</a>
                            <span className="breadcrumb-item active">Shop List</span>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="container-fluid">
                <div className="row px-xl-5">

                    <div className="col-lg-3 col-md-4">

                        <h5 className="section-title position-relative text-uppercase mb-3">
                            <span className="bg-secondary pr-3">Filter by price</span>
                        </h5>

                        <div className="bg-light p-4 mb-30">
    <form>
        {priceRanges.map((price) => {

            const isChecked =
                filters.min_price === price.min &&
                filters.max_price === price.max;

            return (
                <div
                    key={price.id}
                    className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3"
                >
                    <input
                        type="checkbox"
                        className="custom-control-input"
                        id={`price-${price.id}`}
                        checked={isChecked}
                        onChange={() => {

                            let newFilters;

                            // ✅ যদি already selected থাকে → remove filter
                            if (isChecked) {
                                newFilters = {
                                    ...filters,
                                    min_price: null,
                                    max_price: null,
                                    page: 1
                                };
                            } 
                            // ✅ নতুন range select করলে
                            else {
                                newFilters = {
                                    ...filters,
                                    min_price: price.min,
                                    max_price: price.max,
                                    page: 1
                                };
                            }

                            setFilters(newFilters);
                            dispatch(fetchProducts(newFilters));
                        }}
                    />

                    <label
                        className="custom-control-label"
                        htmlFor={`price-${price.id}`}
                    >
                        {price.label}
                    </label>

                    <span className="badge border font-weight-normal">
                        {/* optional count */}
                    </span>
                </div>
            );
        })}
    </form>
</div>



                        <h5 className="section-title position-relative text-uppercase mb-3"><span className="bg-secondary pr-3">Filter by color</span></h5>


                        <div className="bg-light p-4 mb-30">
                            <form>
                                {colors.map((c) => (
                                    <div
                                        key={c.id}
                                        className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3"
                                    >
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            id={`color-${c.id}`}
                                            checked={filters.color === c.value}
                                            onChange={() => {
                                                const newFilters = {
                                                    ...filters,
                                                    page: 1,
                                                    color: filters.color === c.value ? '' : c.value
                                                }

                                                setFilters(newFilters)
                                                dispatch(fetchProducts(newFilters))
                                            }}
                                        />


                                        <label
                                            className="custom-control-label"
                                            htmlFor={`color-${c.id}`}
                                        >
                                            {c.label}
                                        </label>

                                        <span className="badge border font-weight-normal">
                                            {c.count}
                                        </span>
                                    </div>
                                ))}
                            </form>
                        </div>

                        <h5 className="section-title position-relative text-uppercase mb-3"><span className="bg-secondary pr-3">Filter by size</span></h5>
                        <div className="bg-light p-4 mb-30">
                            <form>
                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                    <input type="checkbox" className="custom-control-input" checked id="size-all" />
                                    <label className="custom-control-label" for="size-all">All Size</label>
                                    <span className="badge border font-weight-normal">1000</span>
                                </div>
                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                    <input type="checkbox" className="custom-control-input" id="size-1" />
                                    <label className="custom-control-label" for="size-1">XS</label>
                                    <span className="badge border font-weight-normal">150</span>
                                </div>
                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                    <input type="checkbox" className="custom-control-input" id="size-2" />
                                    <label className="custom-control-label" for="size-2">S</label>
                                    <span className="badge border font-weight-normal">295</span>
                                </div>
                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                    <input type="checkbox" className="custom-control-input" id="size-3" />
                                    <label className="custom-control-label" for="size-3">M</label>
                                    <span className="badge border font-weight-normal">246</span>
                                </div>
                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                    <input type="checkbox" className="custom-control-input" id="size-4" />
                                    <label className="custom-control-label" for="size-4">L</label>
                                    <span className="badge border font-weight-normal">145</span>
                                </div>
                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between">
                                    <input type="checkbox" className="custom-control-input" id="size-5" />
                                    <label className="custom-control-label" for="size-5">XL</label>
                                    <span className="badge border font-weight-normal">168</span>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="col-lg-9 col-md-8">
                        <div className="row pb-3">
                            <div className="col-12 pb-1">
                                <div className="d-flex align-items-center justify-content-between mb-4">
                                    <div>
                                        <button className="btn btn-sm btn-light"><i className="fa fa-th-large"></i></button>
                                        <button className="btn btn-sm btn-light ml-2"><i className="fa fa-bars"></i></button>
                                    </div>
                                    <div className="ml-2">
                                        <div className="btn-group">
                                            <button type="button" className="btn btn-sm btn-light dropdown-toggle" data-toggle="dropdown">Sorting</button>
                                            <div className="dropdown-menu dropdown-menu-right">
                                                <a className="dropdown-item" href="#">Latest</a>
                                                <a className="dropdown-item" href="#">Popularity</a>
                                                <a className="dropdown-item" href="#">Best Rating</a>
                                            </div>
                                        </div>
                                        <div className="btn-group ml-2">
                                            <button type="button" className="btn btn-sm btn-light dropdown-toggle" data-toggle="dropdown">Showing</button>
                                            <div className="dropdown-menu dropdown-menu-right">
                                                <a className="dropdown-item" href="#">10</a>
                                                <a className="dropdown-item" href="#">20</a>
                                                <a className="dropdown-item" href="#">30</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                allProducts?.data?.map(product => {

                                    const activeVariant = getActiveVariant(product, filters);

                                    const image = getVariantImage(product, activeVariant, filters);

                                    // যদি color select করা থাকে কিন্তু image null আসে → product render করবে না
                                    if (filters?.color && !image) return null;

                                    return (
                                        <div key={product.id} className="col-lg-4 col-md-6 col-sm-6 pb-1">
                                            <div className="product-item bg-light mb-4">

                                                <div className="product-img position-relative overflow-hidden">
                                                    <img
                                                        className="img-fluid w-100"
                                                        src={image}
                                                        alt={product.name}
                                                    />

                                                    <div className="product-action">
                                                        <a className="btn btn-outline-dark btn-square" href="#"><i className="fa fa-shopping-cart"></i></a>
                                                        <a className="btn btn-outline-dark btn-square" href="#"><i className="far fa-heart"></i></a>
                                                        <a className="btn btn-outline-dark btn-square" href="#"><i className="fa fa-sync-alt"></i></a>
                                                        <a className="btn btn-outline-dark btn-square" href="#"><i className="fa fa-search"></i></a>
                                                    </div>
                                                </div>

                                                <div className="text-center py-4">
                                                    <Link to={`/products/${product.slug}`} className="h6 text-decoration-none text-truncate" href="#">
                                                        {product?.name?.substr(0, 12)}
                                                    </Link>

                                                    <div className="d-flex align-items-center justify-content-center mt-2">
                                                        <h5>
                                                            ₹{activeVariant?.price || product.discount_price}
                                                        </h5>
                                                        <h6 className="text-muted ml-2">
                                                            <del>₹{product.price}</del>
                                                        </h6>
                                                    </div>

                                                    {activeVariant && filters?.color && (
                                                        <small className="text-muted d-block">
                                                            Color: {activeVariant.color} | Size: {activeVariant.size}
                                                        </small>
                                                    )}

                                                    <div className="d-flex align-items-center justify-content-center mb-1">
                                                        <small className="fa fa-star text-primary mr-1"></small>
                                                        <small className="fa fa-star text-primary mr-1"></small>
                                                        <small className="fa fa-star text-primary mr-1"></small>
                                                        <small className="fa fa-star text-primary mr-1"></small>
                                                        <small className="fa fa-star text-primary mr-1"></small>
                                                        <small>(99)</small>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    );
                                })
                            }







                        </div>
                        <div className="col-12">
                            <nav>
                                <ul className="pagination justify-content-center">

                                    {/* Previous */}
                                    <li className={`page-item ${allProducts?.current_page === 1 ? 'disabled' : ''}`}>
                                        <a
                                            href="#"
                                            className="page-link"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                dispatch(fetchProducts({
                                                    ...filters,
                                                    page: allProducts.current_page - 1
                                                }))
                                            }}
                                        >
                                            Previous
                                        </a>
                                    </li>

                                    {/* Pages */}
                                    {
                                        Array.from({ length: allProducts?.last_page || 0 }, (_, i) => {
                                            const page = i + 1
                                            return (
                                                <li
                                                    key={page}
                                                    className={`page-item ${page === allProducts.current_page ? 'active' : ''}`}
                                                >
                                                    <a
                                                        href="#"
                                                        className="page-link"
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            dispatch(fetchProducts({
                                                                ...filters,
                                                                page
                                                            }))
                                                        }}
                                                    >
                                                        {page}
                                                    </a>
                                                </li>
                                            )
                                        })
                                    }

                                    {/* Next */}
                                    <li
                                        className={`page-item ${allProducts?.current_page === allProducts?.last_page ? 'disabled' : ''
                                            }`}
                                    >
                                        <a
                                            href="#"
                                            className="page-link"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                if (allProducts.current_page === allProducts.last_page) return
                                                dispatch(fetchProducts({ ...filters, page: allProducts.current_page + 1 }))
                                            }}
                                        >
                                            Next
                                        </a>
                                    </li>

                                </ul>
                            </nav>
                        </div>



                    </div>

                </div>
            </div>

            <Footer />

        </div >










    )
}

export default Shop
