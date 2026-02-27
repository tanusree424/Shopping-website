import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../redux/Slices/CategorySlice";
import api from "./Api/Api";
import toast from "react-hot-toast";
import { useCart } from "./Context/CartContext";

const HeaderNavBar = () => {
  const [open, setOpen] = useState(false);
  const [activeParent, setActiveParent] = useState(null);

  // ✅ USE CONTEXT (IMPORTANT)
  const { cartItemsCount, setCartItemsCount } = useCart();

  const { categories, loading } = useSelector((state) => state.categories);

  const token = localStorage.getItem("userToken");
  const user = localStorage.getItem("userData");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // ✅ Fetch Cart Count
  const CartTotal = async () => {
    try {
      const response = await api.get("/api/cart-count", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItemsCount(response.data.cart_count); // 🔥 update global state
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    }
  };

  useEffect(() => {
    if (token) {
      CartTotal();
    }
  }, [token]);

  const redirectToCart = () => {
    navigate("/cart");
  };

  return (
    <div className="container-fluid bg-dark mb-30">
      <div className="row px-xl-5">

        {/* Categories */}
        <div className="col-lg-3 d-none d-lg-block position-relative">
          <div
            className="btn d-flex align-items-center justify-content-between bg-primary w-100 py-3"
            style={{
              paddingLeft: "20px",
              height: "100px",
              paddingRight: "20px",
              cursor: "pointer",
            }}
            onClick={() => setOpen(!open)}
          >
            <h6 className="text-dark m-0">
              <i className="fa fa-bars mr-2"></i> Categories
            </h6>
            <i
              className={`fa fa-angle-${open ? "up" : "down"} text-dark`}
            ></i>
          </div>

          {open && (
            <div
              className="position-absolute navbar navbar-vertical navbar-light p-0 bg-light"
              style={{ width: "100%", zIndex: 999 }}
            >
              <div className="navbar-nav w-100">

                {loading && (
                  <span className="nav-item nav-link">Loading...</span>
                )}

                {!loading &&
                  categories.map((parent) => (
                    <div key={parent.id} className="border-bottom">
                      <div
                        className="d-flex justify-content-between align-items-center nav-item nav-link font-weight-bold text-dark"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setActiveParent(
                            activeParent === parent.id ? null : parent.id
                          )
                        }
                      >
                        <span>{parent.name}</span>
                        <i
                          className={`fa fa-angle-${
                            activeParent === parent.id ? "up" : "down"
                          }`}
                        ></i>
                      </div>

                      {activeParent === parent.id &&
                        parent.children?.map((child) => (
                          <Link
                            key={child.id}
                            to={`/category/${child.slug}`}
                            className="nav-item nav-link pl-4"
                            onClick={() => setOpen(false)}
                          >
                            {child.name}
                          </Link>
                        ))}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Navbar */}
        <div className="col-lg-9">
          <nav className="navbar navbar-expand-lg bg-dark navbar-dark py-3 px-0">

            <div className="navbar-nav mr-auto py-0">
              <Link to="/" className="nav-item nav-link active">
                Home
              </Link>
              <Link to="/shop" className="nav-item nav-link">
                Shop
              </Link>

              {token && user ? (
                <>
                  <Link to="/cart" className="nav-item nav-link">
                    Cart
                  </Link>
                  <Link to="/orders" className="nav-item nav-link">
                    Orders
                  </Link>
                </>
              ) : (
                <Link to="/products" className="nav-item nav-link">
                  Products
                </Link>
              )}

              <Link to="/about" className="nav-item nav-link">
                About
              </Link>
              <Link to="/contact" className="nav-item nav-link">
                Contact
              </Link>
            </div>

            <div className="navbar-nav ml-auto py-0 d-none d-lg-block">
              <Link to="" className="btn px-0">
                <i className="fas fa-heart text-primary"></i>
                <span className="badge text-secondary border border-secondary rounded-circle">
                  0
                </span>
              </Link>

              {/* ✅ LIVE CART COUNT */}
              <button onClick={redirectToCart} className="btn px-0 ml-3">
                <i className="fas fa-shopping-cart text-primary"></i>
                <span className="badge text-secondary border border-secondary rounded-circle">
                  {cartItemsCount}
                </span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default HeaderNavBar;