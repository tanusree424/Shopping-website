import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const ViewProducts = ({ products, onClose }) => {
    console.log(products)
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <div className='flex justify-center items-center fixed inset-0 z-50 bg-black/50'>
      <div className="bg-white w-[450px] border p-4 rounded-xl">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">Product Details</h2>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Close
          </button>
        </div>

        {/* Product Info */}
        <div className="mb-4">
          <p><strong>Name:</strong> {products.name}</p>
          <p><strong>Price:</strong> ₹{products.price}</p>
          <p><strong>Discount:</strong> ₹{products.discount_price}</p>
          <p><strong>SKU:</strong> {products.sku}</p>
          <p><strong>Category:</strong> {products.category?.name}</p>
          <p><strong>Brand:</strong> {products.brand?.name}</p>
        </div>

        {/* Image Slider */ }
         {products.images && products.images.length > 0 ? (
          <Slider {...settings}>
            {products.images.map((img, index) => (
              <div key={index} className="flex justify-center">
                <img
                  src={img.image}
                  alt={`product-${index}`}
                  className="w-full h-[250px] object-contain rounded"
                />
              </div>
            ))}
          </Slider>
        ) : (
          <p className="text-center text-gray-500">No images available</p>
        )}
      </div>
    </div>
  );
};

export default ViewProducts;