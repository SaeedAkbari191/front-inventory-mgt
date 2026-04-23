import React, { useEffect, useState } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getSuppliers = async () => {
      try {
        const res = await ApiService.getAllSuppliers();
        if (res.status === 200) {
          setSuppliers(res.suppliers || []);
        }
      } catch (error) {
        showMessage(error.response?.data?.message || "Error loading suppliers");
      }
    };
    getSuppliers();
  }, []);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleDeleteSupplier = async (id) => {
    if (window.confirm("Delete this supplier?")) {
      await ApiService.deleteSupplier(id);
      setSuppliers(prev => prev.filter(s => s.id !== id));
      showMessage("Supplier deleted");
    }
  };

  return (
    <Layout>
      <div className="container py-4">

        {message && (
          <div className="alert alert-success">{message}</div>
        )}

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold">Suppliers</h3>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/add-supplier")}
          >
            Add Supplier
          </button>
        </div>

        {/* TABLE */}
        <div className="shadow-sm border-0 ">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">

              <thead className="table-light">
                <tr>
                  <th >Name</th>
                  <th>Contact Info</th>
                  <th >Address</th>
                  <th className="pe-5 text-end ">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {suppliers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">
                      No suppliers found
                    </td>
                  </tr>
                )}

                {suppliers.map((s) => (
                  <tr key={s.id}>
                    <td className="fw-semibold">{s.name}</td>
                    <td className="fw-semibold">{s.contactInfo}</td>
                    <td className="fw-semibold">{s.address}</td>

                    <td className="text-end pe-4">
                      <div className="d-inline-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary px-3"
                          onClick={() => navigate(`/edit-supplier/${s.id}`)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger px-2"
                          onClick={() => handleDeleteSupplier(s.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default SupplierPage;