import React, { useEffect, useState } from "react";
import api from "./Api/Api";
import toast from "react-hot-toast";
import Topbar from "./Topbar";
import HeaderNavBar from "./HeaderNavBar";
import Footer from "./Footer";
import { Link } from "react-router-dom";

const Orders = () => {

  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/api/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`
        }
      });
      console.log(response.data.orders)
      setOrders(response.data.orders);

    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
        <Topbar />
      <HeaderNavBar />

      <div className="container mt-5">
        <h3 className="mb-4">My Orders</h3>

        {orders.length === 0 && (
          <p>No orders found.</p>
        )}

        {orders.map((order) => (
          <div key={order.id} className="card mb-4 shadow-sm">

            <div className="card-header bg-dark text-white d-flex justify-content-between">
              <div>
                <strong>Order No:</strong> {order.order_number}
              </div>
              <div>
                <strong>Status:</strong> {order.order_status}
              </div>
            </div>

            <div className="card-body">

              {order.order_items.map((item) => (
                <div key={item.id} className="d-flex justify-content-between border-bottom py-2">
                 <img src={item.product?.images?.[0]?.image || "default-image-url.jpg"} alt={item.product?.name} className="img-fluid" style={{ width: "50px", height: "50px", objectFit: "cover" }} />   
                  <div>
                  <Link to={`/orders/${item.order_id}`}>{item.product?.name}</Link> × {item.quantity}
                  </div>
                  <div>
                    ₹{item.total}
                  </div>
                </div>
              ))}

              <div className="d-flex justify-content-between mt-3">
                <strong>Total:</strong>
                <strong>₹{order.grand_total}</strong>
              </div>

              <div className="mt-2">
                <strong>Payment:</strong> {order.payment?.payment_method}  
                ({order.payment?.payment_status})
              </div>

            </div>
          </div>
        ))}

      </div>

      <Footer />
    </>
  );
};

export default Orders;