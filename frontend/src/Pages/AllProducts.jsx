import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Topbar from './Topbar';
import HeaderNavBar from './HeaderNavBar';
import api from './Api/Api';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/Slices/CartSlice';
import Footer from './Footer';

const AllProducts = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const dispatch = useDispatch();

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/api/similar-product/${slug}`);
      setProduct(response.data.product);
      setSimilarProducts(response.data.similar_products);
    } catch (error) {
      console.log(error?.response?.data?.message || error?.message);
    }
  };

  useEffect(() => {
    fetchProduct();
    setSelectedColor(null);
    setSelectedVariant(null);
  }, [slug]);

  const handleAddToCart = (productDetails) => {
    toast.success("Product Added to Cart");
    dispatch(addToCart(productDetails));
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);

    const variant = product.variants.find(
      v => v.color.toLowerCase() === color.toLowerCase()
    );

    setSelectedVariant(variant || null);
  };

  const uniqueColors = product?.variants
    ? [...new Map(
        product.variants.map(v => [v.color.toLowerCase(), v])
      ).values()]
    : [];

  if (!product) return <div>Loading...</div>;
console.log(product)
  return (
    <>
      <Topbar />
      <HeaderNavBar />

      <div className="container py-5">
        <div className="row">

          {/* Product Image */}
          <div className="col-md-6">
            {selectedVariant ? (
              selectedVariant.images?.length > 0 && (
                <img
                  src={selectedVariant.images[0].image}
                  alt={`${product.name} - ${selectedVariant.color}`}
                  className="img-fluid rounded shadow"
                  style={{ maxHeight: '400px', objectFit: 'cover' }}
                />
              )
            ) : (
              product.images?.length > 0 && (
                <img
                  src={product.images[0].image}
                  alt={product.name}
                  className="img-fluid rounded shadow"
                  style={{ maxHeight: '400px', objectFit: 'cover' }}
                />
              )
            )}
          </div>

          {/* Product Info */}
          <div className="col-md-6">
            <h2 className="mb-3">{product.name}</h2>

            {/* Price */}
            <div className="mb-3">
              {selectedVariant ? (
                <h4 className="text-success">₹{selectedVariant.price}</h4>
              ) : product.discount_price ? (
                <>
                  <h4 className="text-success">₹{product.discount_price}</h4>
                  <h6 className="text-muted"><del>₹{product.price}</del></h6>
                </>
              ) : (
                <h4>₹{product.price}</h4>
              )}
            </div>

            <p className="text-muted">{product.description}</p>

            <p className="my-2 pb-8">
              <strong>Stock:</strong>{" "}
              {selectedVariant
                ? selectedVariant.stock > 0 ? 'Available' : 'Out of Stock'
                : product.stock > 0 ? 'Available' : 'Out of Stock'}
            </p>

            {/* Color Selector */}
            <div className="flex gap-2 mb-4">
              {uniqueColors.map(variant => (
                <div
                  key={variant.color}
                  onClick={() => handleColorSelect(variant.color)}
                  style={{ backgroundColor: variant.color }}
                  className={`rounded-full h-8 w-8 cursor-pointer border 
                    ${selectedColor === variant.color ? 'ring-2 ring-black' : ''}`}
                ></div>
              ))}
            </div>

            {/* Buttons */}
            <div className="d-flex gap-3 mt-4">
              <button
                className="btn btn-primary"
                onClick={() => handleAddToCart(selectedVariant || product)}
              >
                <i className="fa fa-shopping-cart"></i> Add to Cart
              </button>

              <button className="btn btn-outline-dark">
                <i className="far fa-heart"></i> Wishlist
              </button>
            </div>

          </div>
        </div>

        {/* Extra Images */}
        {selectedVariant ? (
          selectedVariant.images?.length > 1 && (
            <div className="row mt-5">
              <h5>More Images</h5>
              {selectedVariant.images.slice(1).map(img => (
                <div className="col-md-3 col-6 mb-3" key={img.id}>
                  <img
                    src={img.image}
                    alt={`${product.name} - ${selectedVariant.color}`}
                    className="img-fluid rounded border"
                    style={{ height: '150px', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          )
        ) : (
          product.images?.length > 1 && (
            <div className="row mt-5">
              <h5>More Images</h5>
              {product.images.slice(1).map(img => (
                <div className="col-md-3 col-6 mb-3" key={img.id}>
                  <img
                    src={img.image}
                    alt={product.name}
                    className="img-fluid rounded border"
                    style={{ height: '150px', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          )
        )}

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-5">
            <h3 className="mb-4">Similar Products</h3>
            <div className="row">
              {similarProducts.map(sp => (
                <div className="col-md-3 col-sm-6 mb-4" key={sp.id}>
                  <div className="card h-100 shadow-sm">
                    {sp.images?.length > 0 && (
                      <img
                        src={sp.images[0].image}
                        alt={sp.name}
                        className="card-img-top"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    )}
                    <div className="card-body text-center">
                      <h6 className="card-title text-truncate">
                        <Link to={`/products/${sp.slug}`}>{sp.name}</Link>
                      </h6>
                      {sp.discount_price ? (
                        <>
                          <h6 className="text-success">₹{sp.discount_price}</h6>
                          <small className="text-muted"><del>₹{sp.price}</del></small>
                        </>
                      ) : (
                        <h6>₹{sp.price}</h6>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <Footer />
    </>
  );
};

export default AllProducts;
