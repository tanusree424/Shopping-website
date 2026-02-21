import React, { useEffect, useState } from "react";
import Topbar from "./Topbar";
import HeaderNavBar from "./HeaderNavBar";
import Footer from "./Footer";
import api from "./Api/Api";

const Cart = () => {
  const userToken = localStorage.getItem("userToken");

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH CART =================
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/cartlist", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      setCartItems(response.data);
    } catch (error) {
      console.log(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userToken]);

  // ================= INCREASE =================
  const increaseQuantity = async (cartId) => {
    try {
      await api.put(
        `/api/increase-quantity/${cartId}`,
        {},
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      setCartItems((prev) =>
        prev.map((item) =>
          item.id === cartId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } catch (error) {
      console.log(error?.response?.data?.message || error?.message);
    }
  };

  // ================= DECREASE =================
  const decreaseQuantity = async (cartId) => {
    const item = cartItems.find((c) => c.id === cartId);

    if (item.quantity === 1) {
      removeItem(cartId);
      return;
    }

    try {
      await api.put(
        `/api/decrease-quantity/${cartId}`,
        {},
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      setCartItems((prev) =>
        prev.map((item) =>
          item.id === cartId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    } catch (error) {
      console.log(error?.response?.data?.message || error?.message);
    }
  };

  // ================= REMOVE =================
  const removeItem = async (cartId) => {
    try {
      await api.delete(`/api/remove-cart/${cartId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      setCartItems((prev) => prev.filter((item) => item.id !== cartId));
    } catch (error) {
      console.log(error?.response?.data?.message || error?.message);
    }
  };

  // ================= TOTAL CALCULATION =================
  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  const shipping = subtotal > 0 ? 50 : 0;
  const grandTotal = subtotal + shipping;

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
                            <span className="breadcrumb-item active">Shopping Cart</span>
                        </nav>
                    </div>
                </div>
            </div>
      <div className="container-fluid mt-4">
        <div className="row px-xl-5">
          <div className="col-lg-8 table-responsive mb-5">
            <table className="table table-light table-borderless table-hover text-center mb-0">
              <thead className="thead-dark">
                <tr>
                  <th>Product</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Remove</th>
                </tr>
              </thead>

              <tbody className="align-middle">
                {loading ? (
                  <tr>
                    <td colSpan="6">Loading...</td>
                  </tr>
                ) : cartItems.length > 0 ? (
                  cartItems.map((c) => (
                    <tr key={c.id}>
                      <td className="align-middle">
                        <img
                          src={c?.product?.images?.[0]?.image}
                          alt=""
                          style={{ width: "50px" }}
                        />
                      </td>

                      <td className="align-middle">
                        {c?.product?.name}
                      </td>

                      <td className="align-middle">
                        ₹{c.price}
                      </td>

                      <td className="align-middle">
                        <div
                          className="input-group quantity mx-auto"
                          style={{ width: "100px" }}
                        >
                          <div className="input-group-btn">
                            <button
                              onClick={() => decreaseQuantity(c.id)}
                              className="btn btn-sm btn-primary"
                            >
                              <i className="fa fa-minus"></i>
                            </button>
                          </div>

                          <input
                            type="text"
                            className="form-control form-control-sm bg-secondary border-0 text-center"
                            value={c.quantity}
                            readOnly
                          />

                          <div className="input-group-btn">
                            <button
                              onClick={() => increaseQuantity(c.id)}
                              className="btn btn-sm btn-primary"
                            >
                              <i className="fa fa-plus"></i>
                            </button>
                          </div>
                        </div>
                      </td>

                      <td className="align-middle">
                        ₹{Number(c.price) * c.quantity}
                      </td>

                      <td className="align-middle">
                        <button
                          onClick={() => removeItem(c.id)}
                          className="btn btn-sm btn-danger"
                        >
                          <i className="fa fa-times"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No Cart Items Found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ====== CART SUMMARY ====== */}
          <div className="col-lg-4">
            <div className="bg-light p-4">
              <h5 className="mb-3">Cart Summary</h5>

              <div className="d-flex justify-content-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="d-flex justify-content-between">
                <span>Shipping</span>
                <span>₹{shipping}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between">
                <strong>Total</strong>
                <strong>₹{grandTotal}</strong>
              </div>

              <button className="btn btn-primary w-100 mt-3">
                Proceed To Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;