import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import "./common.css";

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const loadUser = async () => {
      const res = await ApiService.getUserById(id);
      setUser(res.user);
    };
    loadUser();
  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await ApiService.updateUser(id, user);
    alert("User updated");
    navigate("/users");
  };

  return (
    <Layout>
      <div className="edit-user-container">

        <div className="edit-user-card">
          <h2>Edit User</h2>

          <div className="form-group">
            <label>Name</label>
            <input
              name="name"
              value={user.name}
              onChange={handleChange}
              placeholder="Enter name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              name="phoneNumber"
              value={user.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          <div className="actions">
            <button className="save-btn" onClick={handleSave}>
              Save Changes
            </button>

            <button
              className="cancel-btn"
              onClick={() => navigate("/users")}
            >
              Cancel
            </button>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default EditUserPage;