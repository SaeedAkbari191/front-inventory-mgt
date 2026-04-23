import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ApiService from "../service/ApiService";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const registerData = { name, email, password, phoneNumber };
      await ApiService.registerUser(registerData);

      setMessage("Registration successful");
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      showMessage(
        error.response?.data?.message || "Registration failed"
      );
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">

      <div className="card shadow-sm border-0 p-4" style={{ width: "100%", maxWidth: "420px" }}>

        <h4 className="text-center mb-4 fw-bold">Create Account</h4>

        {message && (
          <div className="alert alert-info py-2 text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleRegister}>

          <div className="mb-3">
            <label className="form-label text-muted small">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-muted small">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-muted small">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-muted small">Phone Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary w-100 mt-2" type="submit">
            Register
          </button>

        </form>

        <p className="text-center mt-3 small text-muted">
          Already have an account?{" "}
          <Link to="/login" className="fw-semibold">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
};

export default RegisterPage;