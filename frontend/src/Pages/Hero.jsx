import React, { useState, useEffect } from 'react'
import carousel1 from "../assets/img/carousel-1.jpg"
import carousel2 from "../assets/img/carousel-2.jpg"
import carousel3 from "../assets/img/carousel-3.jpg"
import offer1 from "../assets/img/offer-1.jpg"
import offer2 from "../assets/img/offer-2.jpg"
import api from './Api/Api'
const Hero = () => {
    const [banners, setBanners] = useState(null)
    const fetchBanners = async () => {
        try {
            const res = await api.get("/api/banners",
            );
            setBanners(res.data);
            console.log(res.data)
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchBanners()
    }, [])

    return (
        <div className="container-fluid mb-3">
            <div className="row px-xl-5">
                <div className="col-lg-8">
                    <div id="header-carousel" className="carousel slide carousel-fade mb-30 mb-lg-0" data-ride="carousel">
                        <ol className="carousel-indicators">
                            <li data-target="#header-carousel" data-slide-to="0" className="active"></li>
                            <li data-target="#header-carousel" data-slide-to="1"></li>
                            <li data-target="#header-carousel" data-slide-to="2"></li>
                        </ol>
                        <div className="carousel-inner">
                            {
                                banners?.map((banner, i) => (
                                    <div
                                        key={i}
                                        className={`carousel-item position-relative ${i === 0 ? "active" : ""}`}
                                        style={{ height: "430px" }}
                                    >
                                        <img
                                            className="position-absolute w-100 h-100"
                                            src={banner?.image}
                                            alt=""
                                            style={{ objectFit: "cover" }}
                                        />
                                        <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                                            <div className="p-3" style={{ "maxWidth": "700px" }}>
                                                <h1 className="display-4 text-white mb-3 animate__animated animate__fadeInDown">{banner.title}</h1>
                                                <p className="mx-md-5 px-5 animate__animated animate__bounceIn">{banner?.subtitle}</p>
                                                <a className="btn btn-outline-light py-2 px-4 mt-3 animate__animated animate__fadeInUp" href={banner.link}>Shop Now</a>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                           

                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="product-offer mb-30" style={{ "height": "200px" }}>
                        <img className="img-fluid" src={offer1} alt="" />
                        <div className="offer-text">
                            <h6 className="text-white text-uppercase">Save 20%</h6>
                            <h3 className="text-white mb-3">Special Offer</h3>
                            <a href="" className="btn btn-primary">Shop Now</a>
                        </div>
                    </div>
                    <div className="product-offer mb-30" style={{ "height": "200px" }}>
                        <img className="img-fluid" src={offer2} alt="" />
                        <div className="offer-text">
                            <h6 className="text-white text-uppercase">Save 20%</h6>
                            <h3 className="text-white mb-3">Special Offer</h3>
                            <a href="" className="btn btn-primary">Shop Now</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero
