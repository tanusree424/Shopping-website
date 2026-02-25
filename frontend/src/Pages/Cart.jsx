import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "./Topbar";
import HeaderNavBar from "./HeaderNavBar";
import Footer from "./Footer";
import api from "./Api/Api";

const Cart = () => {
  const userToken = localStorage.getItem("userToken");
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
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
console.log(cartItems)
  useEffect(() => {
    fetchCart();
  }, [userToken]);

  // ================= SELECT ITEM =================
  const toggleSelect = (cartId) => {
    setSelectedItems((prev) =>
      prev.includes(cartId)
        ? prev.filter((cart_id) => cart_id !== cartId)
        : [...prev, cartId]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(cartItems.map((item) => item.cart_id));
    } else {
      setSelectedItems([]);
    }
  };

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
      fetchCart()
    } catch (error) {
      console.log(error?.response?.data?.message || error?.message);
    }
  };

  // ================= DECREASE =================
  const decreaseQuantity = async (cartId) => {
    const item = cartItems.find((c) => c.cart_id === cartId);

    if (item?.quantity === 1) {
      removeItem(cartId);
      return;
    }
    console.log(item)
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
          item.cart_id === cartId
            ? { ...item, quantity: item?.quantity - 1 }
            : item
        )
      );
     // fetchCart()
    } catch (error) {
      console.log(error?.response?.data?.message || error?.message);
    }
  };

  // ================= REMOVE =================
  const removeItem = async (cartId) => {
    if (window.confirm("Are You sure to remove this product from the cart?")) {
      try {
        await api.delete(`/api/remove-cart-item/${cartId}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        setCartItems((prev) => prev.filter((item) => item.id !== cartId));
        setSelectedItems((prev) => prev.filter((id) => id !== cartId));
      } catch (error) {
        console.log(error?.response?.data?.message || error?.message);
      }
    }
  };

  // ================= SELECTED CALCULATION =================
  const selectedCartItems = cartItems.filter((item) =>
    selectedItems.includes(item.cart_id)
  );

  const subtotal = selectedCartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  const shipping = subtotal < 1000 ? 50 : 0;
  const grandTotal = subtotal + shipping;

  // ================= CHECKOUT =================
  const handleCheckout = () => {
    navigate("/checkout", {
      state: { selectedCartIds: selectedItems },
    });
  };

  return (
    <div>
      <Topbar />
      <HeaderNavBar />

      <div className="container-fluid mt-4">
        <div className="row px-xl-5">
          <div className="col-lg-8 table-responsive mb-5">
            <table className="table table-light table-borderless table-hover text-center mb-0">
              <thead className="thead-dark">
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      checked={
                        selectedItems.length === cartItems.length &&
                        cartItems.length > 0
                      }
                    />
                  </th>
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
                    <td colSpan="7">Loading...</td>
                  </tr>
                ) : cartItems.length > 0 ? (
                  cartItems.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(c.cart_id)}
                          onChange={() => toggleSelect(c.cart_id)}
                        />
                      </td>

                      <td className="align-middle">
                        <img
                          src={c?.image}
                          alt=""
                          style={{ width: "50px" }}
                        />
                      </td>

                      <td className="align-middle">
                        {c?.product_name}
                      </td>

                      <td className="align-middle">₹{c.price}</td>

                      <td className="align-middle">
                        <div
                          className="input-group quantity mx-auto"
                          style={{ width: "100px" }}
                        >
                          <div className="input-group-btn">
                            <button
                              onClick={() => decreaseQuantity(c.cart_id)}
                              className="btn btn-sm btn-primary"
                            >
                              <i className="fa fa-minus"></i>
                            </button>
                          </div>

                          <input
                            type="text"
                            name="quantity"
                            className="form-control form-control-sm bg-secondary border-0 text-center"
                            value={c.quantity}
                            readOnly
                          />

                          <div className="input-group-btn">
                            <button
                              onClick={() => increaseQuantity(c.cart_id)}
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
                    <td colSpan="7">No Cart Items Found</td>
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
                <span>Selected Items</span>
                <span>{selectedItems.length}</span>
              </div>

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

              <button
                className="btn btn-primary w-100 mt-3"
                disabled={selectedItems.length === 0}
                onClick={handleCheckout}
              >
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