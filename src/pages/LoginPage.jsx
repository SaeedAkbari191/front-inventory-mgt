import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ApiService from "../service/ApiService";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loginData = { email, password };
      const res = await ApiService.loginUser(loginData);

      if (res.status === 200) {
        ApiService.saveToken(res.token);
        ApiService.saveRole(res.role);
        navigate("/dashboard");
      }
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">

      <div className="card shadow-sm border-0 p-4" style={{ width: "100%", maxWidth: "400px" }}>

        <h4 className="text-center mb-4 fw-bold">Login</h4>

        {message && (
          <div className="alert alert-danger py-2 text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleLogin}>

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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary w-100 mt-2" type="submit">
            Login
          </button>

        </form>

        <p className="text-center mt-3 small text-muted">
          Don’t have an account?{" "}
          <Link to="/register" className="fw-semibold">
            Register
          </Link>
        </p>

      </div>

    </div>
  );
};

export default LoginPage;