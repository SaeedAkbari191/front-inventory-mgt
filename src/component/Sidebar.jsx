import React, { useState } from "react";
import { Link } from "react-router-dom";
import ApiService from "../service/ApiService";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const isAuth = ApiService.isAuthenticated();
  const isAdmin = ApiService.isAdmin();

  const logout = () => {
    ApiService.logout();
  };

  return (
    <>
      {/* 🔥 Mobile Toggle */}
      <button className="menu-toggle" onClick={() => setOpen(!open)}>
        ☰
      </button>

      <div className={`sidebar ${open ? "open" : ""}`}>
        <h1 className="ims">IMS</h1>

        <ul className="nav-links">
          {isAuth && (
            <li><Link to="/dashboard">Dashboard</Link></li>
          )}

          {isAuth && (
            <li><Link to="/transaction">Transactions</Link></li>
          )}

          {isAdmin && (
            <li><Link to="/category">Category</Link></li>
          )}

          {isAdmin && (
            <li><Link to="/product">Product</Link></li>
          )}

          {isAdmin && (
            <li><Link to="/supplier">Supplier</Link></li>
          )}

          {isAuth && (
            <li><Link to="/purchase">Purchase</Link></li>
          )}

          {isAuth && (
            <li><Link to="/sell">Sell</Link></li>
          )}

          {isAuth && (
            <li><Link to="/return">Return To Supplier</Link></li>
          )}

          {isAdmin && (
            <li><Link to="/users">Users</Link></li>
          )}

          {isAuth && (
            <li>
              <Link onClick={logout} to="/login">Logout</Link>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;