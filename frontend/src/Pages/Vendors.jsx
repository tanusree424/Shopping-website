import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import vendor1 from "../assets/img/vendor-1.jpg";
import vendor2 from "../assets/img/vendor-2.jpg";
import vendor3 from "../assets/img/vendor-3.jpg";
import vendor4 from "../assets/img/vendor-4.jpg";
import vendor5 from "../assets/img/vendor-5.jpg";
import vendor6 from "../assets/img/vendor-6.jpg";
import vendor7 from "../assets/img/vendor-7.jpg";
import vendor8 from "../assets/img/vendor-8.jpg";

const Vendors = () => {
  const vendors = [
    vendor1, vendor2, vendor3, vendor4,
    vendor5, vendor6, vendor7, vendor8
  ];

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
          {vendors.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="bg-light p-4 text-center">
                <img src={img} alt="vendor" className="img-fluid" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Vendors;
