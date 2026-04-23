import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await ApiService.getUserById(id);
        setUser(res.user || {});
      } catch (error) {
        showMessage("Error loading user");
      }
    };
    loadUser();
  }, [id]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await ApiService.updateUser(id, user);
      showMessage("User updated successfully");
      setTimeout(() => navigate("/users"), 1000);
    } catch (error) {
      showMessage(error.response?.data?.message || "Error updating user");
    }
  };

  return (
    <Layout>
      <div className="container py-4">

        {/* MESSAGE */}
        {message && (
          <div className="alert alert-info shadow-sm">
            {message}
          </div>
        )}

        <div className="card shadow-sm border-0">
          <div className="card-body">

            <h4 className="fw-bold mb-4">Edit User</h4>

            <form onSubmit={handleSave}>
              <div className="row g-3">

                {/* NAME */}
                <div className="col-md-6">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={user.name || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* EMAIL */}
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={user.email || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* PHONE */}
                <div className="col-md-6">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    className="form-control"
                    value={user.phoneNumber || ""}
                    onChange={handleChange}
                  />
                </div>

              </div>

              {/* ACTIONS */}
              <div className="mt-4 d-flex justify-content-end gap-2">
                <button type="submit" className="btn btn-primary px-4">
                  Save
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary px-4"
                  onClick={() => navigate("/users")}
                >
                  Cancel
                </button>
              </div>

            </form>

          </div>
        </div>

      </div>
    </Layout>
  );
};

export default EditUserPage;