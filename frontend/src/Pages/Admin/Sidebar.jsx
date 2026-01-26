import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const menuItem =
    "nav-item flex items-center gap-3 px-4 py-2 text-white text-lg hover:bg-blue-600";

  return (
    <div className=" overflow-auto scroll-smooth bg-gray-800 w-full">
      <h2 className="px-4 py-4 text-white font-bold text-xl text-nowrap">
        <i className="fa-solid  fa-gauge-high mr-2"></i>
        Admin Dashboard
      </h2>

      <hr className="border-gray-600" />

      <ul className="mt-3 flex flex-col gap-1">

        <li>
          <Link to="/admin" className={menuItem}>
            <i className="fa-solid fa-chart-line"></i>
            Dashboard
          </Link>
        </li>

        <li>
          <Link to="/admin/roles" className={menuItem}>
            <i className="fa-solid fa-user-shield"></i>
            Roles
          </Link>
        </li>

        <li>
          <Link to="/admin/permissions" className={menuItem}>
            <i className="fa-solid fa-key"></i>
            Permissions
          </Link>
        </li>

        <li>
          <Link to="/admin/users" className={menuItem}>
            <i className="fa-solid fa-users"></i>
            Users
          </Link>
        </li>

        <li>
          <Link to="/admin/products" className={menuItem}>
            <i className="fa-solid fa-box"></i>
            Products
          </Link>
        </li>

        <li>
          <Link to="/admin/categories" className={menuItem}>
            <i className="fa-solid fa-layer-group"></i>
            Categories
          </Link>
        </li>

        <li>
          <Link to="/admin/orders" className={menuItem}>
            <i className="fa-solid fa-cart-shopping"></i>
            Orders
          </Link>
        </li>

        <li>
          <Link to="/admin/payments" className={menuItem}>
            <i className="fa-solid fa-credit-card"></i>
            Payments
          </Link>
        </li>

        <li>
          <Link to="/admin/vendors" className={menuItem}>
            <i className="fa-solid fa-store"></i>
            Vendors
          </Link>
        </li>

        <li>
          <Link to="/admin/inventory" className={menuItem}>
            <i className="fa-solid fa-warehouse"></i>
            Inventory
          </Link>
        </li>

        <li>
          <Link to="/admin/coupons" className={menuItem}>
            <i className="fa-solid fa-ticket"></i>
            Coupons
          </Link>
        </li>

        <li>
          <Link to="/admin/reviews" className={menuItem}>
            <i className="fa-solid fa-star"></i>
            Reviews
          </Link>
        </li>

        <li>
          <Link to="/admin/shipping" className={menuItem}>
            <i className="fa-solid fa-truck"></i>
            Shipping
          </Link>
        </li>

        <li>
          <Link to="/admin/reports" className={menuItem}>
            <i className="fa-solid fa-file-lines"></i>
            Reports
          </Link>
        </li>

        <li>
          <Link to="/admin/logs" className={menuItem}>
            <i className="fa-solid fa-clock-rotate-left"></i>
            Activity Logs
          </Link>
        </li>

        <li>
          <Link to="/admin/notifications" className={menuItem}>
            <i className="fa-solid fa-bell"></i>
            Notifications
          </Link>
        </li>

        <li>
          <Link to="/admin/settings" className={menuItem}>
            <i className="fa-solid fa-gear"></i>
            Settings
          </Link>
        </li>

      </ul>
    </div>
  );
};

export default Sidebar;
