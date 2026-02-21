import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "../assets/css/productImage.css"
import "swiper/css";


import api from "./Api/Api";
import { Link } from "react-router-dom"
const Vendors = () => {

  const [vendors, setVendors] = useState();
  const fecthAllBrands = async (params) => {
    try {
      const response = await api.get("/api/brands")
    //  console.log(response.data.brands)
      setVendors(response.data.brands)
    } catch (error) {
      console.log(error?.response?.data?.message)
    }
  }
  useEffect(() => {
    fecthAllBrands()
  }, [])


  return (
    <div className="container-fluid py-5">
      <div className="px-xl-5">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={5}
          autoplay={{ delay: 2000 }}
          loop={true}
          breakpoints={{
            0: { slidesPerView: 2 },
            576: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            992: { slidesPerView: 5 },
          }}
        >
          {vendors?.map((vendor, index) => (
            <SwiperSlide key={index}>
              <Link to={`/brands/${vendor.slug}`}>
              <div className="product-img position-relative bg-white overflow-hidden fixed-img-wrapper">
                <img
                  className="img-fluid w-100 fixed-product-img"
                  src={vendor?.logo}
                  alt=""
                />
              </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Vendors;
