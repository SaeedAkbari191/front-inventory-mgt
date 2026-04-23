import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const AddEditSupplierPage = () => {
  const { supplierId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (supplierId) {
      setIsEditing(true);

      const fetchSupplier = async () => {
        try {
          const res = await ApiService.getSupplierById(supplierId);
          if (res.status === 200) {
            setName(res.supplier.name);
            setContactInfo(res.supplier.contactInfo);
            setAddress(res.supplier.address);
          }
        } catch (error) {
          showMessage(
            error.response?.data?.message || "Error loading supplier"
          );
        }
      };

      fetchSupplier();
    }
  }, [supplierId]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { name, contactInfo, address };

    try {
      if (isEditing) {
        await ApiService.updateSupplier(supplierId, data);
        showMessage("Supplier updated successfully");
      } else {
        await ApiService.addSupplier(data);
        showMessage("Supplier added successfully");
      }

      navigate("/supplier");
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error saving supplier"
      );
    }
  };

  return (
    <Layout>
      <div className="container py-4">

        {message && (
          <div className="alert alert-info shadow-sm">{message}</div>
        )}

        <div className="card shadow-sm border-0">
          <div className="card-body">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-0">
                {isEditing ? "Edit Supplier" : "Add Supplier"}
              </h4>

              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate("/supplier")}
              >
                Back
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <label className="form-label">Supplier Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Contact Info</label>
                <input
                  type="text"
                  className="form-control"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <button className="btn btn-primary w-100">
                {isEditing ? "Update Supplier" : "Add Supplier"}
              </button>

            </form>

          </div>
        </div>

      </div>
    </Layout>
  );
};

export default AddEditSupplierPage;