import React, { useEffect, useState } from "react";
import Topbar from "./Topbar";
import HeaderNavBar from "./HeaderNavBar";
import Footer from "./Footer";
import api from "./Api/Api";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
const Checkout = () => {
    const location = useLocation();
    const Navigate = useNavigate();
    const selectedCartIds = location.state?.selectedCartIds || [];

    const [products, setProducts] = useState([]);
    const [createAccount, setCreateAccount] = useState(false);
    const [shipDifferent, setShipDifferent] = useState(false);
    const paymentMethods = ["Cash On Delivery", "razorpay", 'UPI', 'Net Banking', 'Credit/Debit Card'];
    useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  document.body.appendChild(script);
}, []);

    const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0])
    const [billingData, setBillingData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address1: "",
        address2: "",
        country: "",
        city: "",
        state: "",
        zip: "",
    });
    console.log(products)
    // ================= Fetch Selected Products =================
    const fetchProductDetails = async (cartIds) => {
        try {
            const response = await api.get(
                `/api/cart-product-details?ids=${cartIds.join(",")}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );

            setProducts(response.data);
        } catch (error) {
            console.log(error?.response?.data?.message || error?.message);
        }
    };

    useEffect(() => {
        if (selectedCartIds.length > 0) {
            fetchProductDetails(selectedCartIds);
        }
    }, [selectedCartIds]);

    // ================= Calculations =================
    const subtotal = products.reduce(
        (total, item) => total + Number(item.price) * item.quantity,
        0
    );

    const shipping = subtotal > 1000 ? 50 : 0;
    const total = subtotal + shipping;

    const handleChange = (e) => {
        setBillingData({
            ...billingData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePlaceOrder = async () => {
        console.log("Billing:", billingData);
        console.log("Payment:", paymentMethod);
        console.log("Products:", products);
        try {
            const response = await api.post("/api/place-order", {
                billing: [billingData],
                payment_method: paymentMethod,
                cart_ids: selectedCartIds
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                },
            });
            console.log(response.data);
            if (paymentMethod === "Cash On Delivery") {
                toast.success("Order Placed Successfully");
                return;
            }


            // Razorpay Flow
            const { razorpay_order_id, amount, order_id } = response.data;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_SLRzlqIgnKyGs3",
                amount: amount * 100,
                currency: "INR",
                order_id: razorpay_order_id,

                handler: async function (paymentResponse) {

                 const payment_data = await api.post("/api/verify-payment", {
                        order_id: order_id,
                        razorpay_payment_id: paymentResponse.razorpay_payment_id
                    } , {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                        },
                    });
                    console.log(payment_data.data);
                    toast.success("Payment Successful!");
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.log(error?.response?.data?.message || error?.message);
            toast.error(error?.response?.data?.message || error?.message || "Failed to place order. Please try again.");

        }
    };
    if (createAccount) {
        Navigate("/signup", { state: { billingData } });
    }

    return (
        <div>
            <Topbar />
            <HeaderNavBar />

            <div className="container-fluid">
                <div className="row px-xl-5">
                    <div className="col-lg-8">
                        <h5 className="section-title position-relative text-uppercase mb-3">
                            <span className="bg-secondary pr-3">Billing Address</span>
                        </h5>

                        <div className="bg-light p-30 mb-5">
                            <div className="row">

                                <div className="col-md-6 form-group">
                                    <label>First Name</label>
                                    <input className="form-control" name="first_name" onChange={handleChange} />
                                </div>

                                <div className="col-md-6 form-group">
                                    <label>Last Name</label>
                                    <input className="form-control" name="last_name" onChange={handleChange} />
                                </div>

                                <div className="col-md-6 form-group">
                                    <label>E-mail</label>
                                    <input className="form-control" name="email" onChange={handleChange} />
                                </div>

                                <div className="col-md-6 form-group">
                                    <label>Mobile No</label>
                                    <input className="form-control" name="phone" onChange={handleChange} />
                                </div>

                                <div className="col-md-6 form-group">
                                    <label>Address Line 1</label>
                                    <input className="form-control" name="address1" onChange={handleChange} />
                                </div>

                                <div className="col-md-6 form-group">
                                    <label>Address Line 2</label>
                                    <input className="form-control" name="address2" onChange={handleChange} />
                                </div>

                                <div className="col-md-6 form-group">
                                    <label>Country</label>
                                    <input className="form-control" name="country" onChange={handleChange} />
                                </div>

                                <div className="col-md-6 form-group">
                                    <label>City</label>
                                    <input className="form-control" name="city" onChange={handleChange} />
                                </div>

                                <div className="col-md-6 form-group">
                                    <label>State</label>
                                    <input className="form-control" name="state" onChange={handleChange} />
                                </div>

                                <div className="col-md-6 form-group">
                                    <label>ZIP Code</label>
                                    <input className="form-control" name="zip" onChange={handleChange} />
                                </div>

                                {/* Create Account */}
                                <div className="col-md-12 form-group">
                                    <div className="custom-control custom-checkbox">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            id="newaccount"
                                            checked={createAccount}
                                            onChange={() => setCreateAccount(!createAccount)}
                                        />
                                        <label className="custom-control-label" htmlFor="newaccount">
                                            Create an account
                                        </label>
                                    </div>
                                </div>

                                {/* Ship Different */}
                                <div className="col-md-12">
                                    <div className="custom-control custom-checkbox">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            id="shipto"
                                            checked={shipDifferent}
                                            onChange={() => setShipDifferent(!shipDifferent)}
                                        />
                                        <label className="custom-control-label" htmlFor="shipto">
                                            Ship to different address
                                        </label>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Shipping Section Controlled */}
                        {shipDifferent && (
                            <div className="bg-light p-30 mb-5">
                                <h6>Shipping Address</h6>
                                <input className="form-control mb-2" placeholder="Shipping Address Line 1" />
                                <input className="form-control mb-2" placeholder="City" />
                            </div>
                        )}

                    </div>

                    {/* ===== ORDER SUMMARY ===== */}
                    <div className="col-lg-4">
                        <div className="bg-light p-30 mb-5">
                            <h6>Products</h6>

                            {products.map((item) => (
                                <div className="d-flex justify-content-between" key={item.cart_id}>
                                    <img src={item.image} alt={item.product_name} className="img-fluid" style={{ width: "50px", height: "50px" }} />
                                    <p>{item.product_name} x {item.quantity}</p>
                                    <p>₹{Number(item.price) * item.quantity}</p>
                                </div>
                            ))}

                            <hr />

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
                                <strong>₹{total}</strong>
                            </div>
                        </div>

                        {/* ===== PAYMENT ===== */}
                        <div className="bg-light p-30">
                            <h5 className="mb-3">Payment Method</h5>
                            {paymentMethods.map((method) => (
                                <div className="custom-control custom-radio mb-2" key={method}>
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        className="custom-control-input"
                                        id={method}
                                        checked={paymentMethod === method}
                                        onChange={() => setPaymentMethod(method)}
                                    />
                                    <label className="custom-control-label" htmlFor={method}>
                                        {method.charAt(0).toUpperCase() + method.slice(1)}
                                    </label>
                                </div>
                            ))}



                            <button
                                className="btn btn-block btn-primary font-weight-bold py-3 mt-3"
                                onClick={handlePlaceOrder}
                            >
                                Place Order
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Checkout;