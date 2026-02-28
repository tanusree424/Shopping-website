import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "./Api/Api";
const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`
        }
      });
      
      setOrder(res.data.order);
    } catch (error) {
      console.log(error?.response?.data?.message || error.message);
      
    }
  };

  if (!order) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container my-5">
       
      {/* Header */}
      <div className="card p-4 shadow-sm mb-4">
        <div className="d-flex justify-content-between">
          <div>
            <h4>Order #{order.order_number}</h4>
            <p className="text-muted">
              Ordered on {new Date(order.ordered_at).toLocaleDateString()}
            </p>
          </div>

          <div className="text-end">
            <h5>Status: 
              <span className="badge bg-primary ms-2">
                {order.order_status}
              </span>
            </h5>
            <p>
              Payment:{" "}
              <strong>{order.payment?.payment_status}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="card p-4 shadow-sm mb-4">
        <h5 className="mb-3">Items</h5>

        {order.order_items.map((item) => (
          <div
            key={item.id}
            className="d-flex align-items-center border-bottom py-3"
          >
            <img
              src={
                item.variant?.images?.[0]?.image ||
                item.product?.images?.[0]?.image
              }
              alt="product"
              width="80"
              height="80"
              className="me-3"
            />

            <div className="flex-grow-1">
              <h6>{item.product?.name}</h6>
              <p className="mb-1">Quantity: {item.quantity}</p>
              <p className="mb-0 text-muted">
                ₹{item.price} × {item.quantity}
              </p>
            </div>

            <div>
              <strong>₹{item.total}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Tracking Timeline */}
      <div className="card p-4 shadow-sm mb-4">
        <h5 className="mb-3">Order Tracking</h5>

        {order.tracking && order.tracking.length > 0 ? (
          order.tracking.map((track) => (
            <div key={track.id} className="mb-2">
              <strong>{track.status}</strong>
              <p className="text-muted mb-0">{track.description}</p>
              <small>
                {new Date(track.created_at).toLocaleString()}
              </small>
              <hr />
            </div>
          ))
        ) : (
          <p className="text-muted">No tracking updates yet.</p>
        )}
      </div>

      {/* Order Summary */}
      <div className="card p-4 shadow-sm">
        <h5 className="mb-3">Order Summary</h5>

        <div className="d-flex justify-content-between">
          <span>Subtotal</span>
          <span>₹{order.subtotal}</span>
        </div>

        <div className="d-flex justify-content-between">
          <span>Shipping</span>
          <span>₹{order.shipping_charges}</span>
        </div>

        <div className="d-flex justify-content-between">
          <span>Tax</span>
          <span>₹{order.tax}</span>
        </div>

        <div className="d-flex justify-content-between">
          <span>Discount</span>
          <span>-₹{order.discount}</span>
        </div>

        <hr />

        <div className="d-flex justify-content-between fw-bold">
          <span>Total</span>
          <span>₹{order.grand_total}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;