import React, { useState } from "react";
import { Link } from "react-router-dom";

const HeaderNavBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="container-fluid bg-dark mb-30">
      <div className="row px-xl-5">
        {/* Categories */}
        <div className="col-lg-3 d-none d-lg-block position-relative">
          <div
            className="btn d-flex align-items-center justify-content-between bg-primary w-100 py-3"
  style={{ paddingLeft: "20px", height:"100px", paddingRight: "20px", cursor: "pointer" }}
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
                <span className="nav-item nav-link font-weight-bold">
                  Dresses
                </span>

                <Link to="/shirts" className="nav-item nav-link">
                  Shirts
                </Link>
                <Link to="/jeans" className="nav-item nav-link">
                  Jeans
                </Link>
                <Link to="/shoes" className="nav-item nav-link">
                  Shoes
                </Link>
                <Link href="" class="nav-item nav-link">Swimwear</Link>
                        <Link to="" class="nav-item nav-link">Sleepwear</Link>
                        <Link to="" class="nav-item nav-link">Sportswear</Link>
                        <Link to="" class="nav-item nav-link">Jumpsuits</Link>
                        <Link to="" class="nav-item nav-link">Blazers</Link>
                        <Link to="" class="nav-item nav-link">Jackets</Link>
              </div>
            </div>
          )}
        </div>

        {/* Navbar */}
        <div className="col-lg-9">
          <nav className="navbar navbar-expand-lg bg-dark navbar-dark py-3 px-0">
            <Link to="/" className="text-decoration-none d-block d-lg-none">
              <span className="h1 text-uppercase text-dark bg-light px-2">
                Multi
              </span>
              <span className="h1 text-uppercase text-light bg-primary px-2 ml-n1">
                Shop
              </span>
            </Link>

            <div className="navbar-nav mr-auto py-0">
              <Link to="/" className="nav-item nav-link active">
                Home
              </Link>
              <Link to="/shop" className="nav-item nav-link">
                Shop
              </Link>
              <Link to="/cart" className="nav-item nav-link">
                Cart
              </Link>
              <Link to="/checkout" className="nav-item nav-link">
                Checkout
              </Link>
              <Link to="/contact" className="nav-item nav-link">
                Contact
              </Link>
            </div>

           <div class="navbar-nav ml-auto py-0 d-none d-lg-block">
                            <Link to="" className="btn px-0">
                                <i className="fas fa-heart text-primary"></i>
                                <span className="badge text-secondary border border-secondary rounded-circle" style={{"paddingBottom": "2px"}}>0</span>
                            </Link>
                            <Link to="" className="btn px-0 ml-3">
                                <i className="fas fa-shopping-cart text-primary"></i>
                                <span className="badge text-secondary border border-secondary rounded-circle" style={{"paddingBottom": "2px"}}>0</span>
                            </Link>
                        </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default HeaderNavBar;
