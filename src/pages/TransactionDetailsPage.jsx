import React, { useEffect, useState, useCallback } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useParams } from "react-router-dom";

const TransactionDetailsPage = () => {
  const { transactionId } = useParams();

  const [transaction, setTransaction] = useState(null);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  const showMessage = useCallback((msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  }, []);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await ApiService.getTransactionById(transactionId);

        if (res.status === 200) {
          setTransaction(res.transaction);
          setStatus(res.transaction.status);
        }
      } catch {
        showMessage("Error loading transaction");
      }
    };

    fetchTransaction();
  }, [transactionId, showMessage]);

  const handleUpdateStatus = async () => {
    try {
      await ApiService.updateTransactionStatus(transactionId, status);
      showMessage("Status updated successfully");
    } catch {
      showMessage("Failed to update status");
    }
  };

  if (!transaction) return null;

  const totalProducts =
    transaction.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const getBadge = (type) => {
    switch (type) {
      case "SALE":
        return "success";
      case "PURCHASE":
        return "primary";
      case "RETURN_TO_SUPPLIER":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "PROCESSING":
        return "primary";
      case "PENDING":
        return "warning";
      case "CANCELLED":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <Layout>
      <div className="container py-4">

        {/* ALERT */}
        {message && (
          <div className="alert alert-info shadow-sm border-0">
            {message}
          </div>
        )}

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <div>
            <h3 className="fw-bold mb-1">
              Transaction #{transaction.id}
            </h3>

            <p className="text-muted mb-0 small">
              {new Date(transaction.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="d-flex gap-2">
            <span className={`badge bg-${getBadge(transaction.transactionType)} px-3 py-2`}>
              {transaction.transactionType}
            </span>

            <span className={`badge bg-${getStatusBadge(transaction.status)} px-3 py-2`}>
              {transaction.status}
            </span>
          </div>
        </div>

        {/* TOP SUMMARY */}
        <div className="row g-3 mb-4">

          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <p className="text-muted mb-2">Total Price</p>
                <h4 className="fw-bold text-primary mb-0">
                  ${transaction.totalPrice?.toFixed(2) || "0.00"}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <p className="text-muted mb-2">Products Count</p>
                <h4 className="fw-bold mb-0">
                  {totalProducts}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <p className="text-muted mb-2">Current Status</p>
                <span className={`badge bg-${getStatusBadge(transaction.status)} px-3 py-2`}>
                  {transaction.status}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* MAIN CONTENT */}
        <div className="row g-4">

          {/* LEFT COLUMN */}
          <div className="col-lg-8">

            {/* PRODUCT TABLE */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-bottom fw-bold py-3">
                Product Details
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">

                  <thead className="table-light">
                    <tr>
                      <th>Product Name</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {transaction.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="fw-semibold">
                          {item.productName}
                        </td>

                        <td>{item.quantity}</td>

                        <td>${Number(item.unitPrice).toFixed(2)}</td>

                        <td className="fw-bold">
                          ${(item.quantity * item.unitPrice).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </div>

            {/* DESCRIPTION + NOTE */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-bottom fw-bold py-3">
                Additional Information
              </div>

              <div className="card-body">
                <div className="row g-4">

                  <div className="col-md-6">
                    <label className="text-muted small mb-1">
                      Description
                    </label>

                    <div className="fw-semibold">
                      {transaction.description || "-"}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="text-muted small mb-1">
                      Note
                    </label>

                    <div className="fw-semibold">
                      {transaction.note || "-"}
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="col-lg-4">

            {/* USER INFO */}
            {transaction.user && (
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white border-bottom fw-bold py-3">
                  User Information
                </div>

                <div className="card-body">
                  <p className="fw-semibold mb-1">
                    {transaction.user.name}
                  </p>

                  <p className="text-muted mb-1 small">
                    {transaction.user.email}
                  </p>

                  <p className="text-muted small mb-0">
                    {transaction.user.phoneNumber}
                  </p>
                </div>
              </div>
            )}

            {/* SUPPLIER INFO */}
            {transaction.supplier && (
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white border-bottom fw-bold py-3">
                  Supplier Information
                </div>

                <div className="card-body">
                  <p className="fw-semibold mb-1">
                    {transaction.supplier.name}
                  </p>

                  <p className="text-muted small mb-0">
                    {transaction.supplier.contactInfo}
                  </p>
                </div>
              </div>
            )}

            {/* STATUS UPDATE */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-bottom fw-bold py-3">
                Update Transaction Status
              </div>

              <div className="card-body">
                <select
                  className="form-select mb-3"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>

                <button
                  className="btn btn-primary w-100"
                  onClick={handleUpdateStatus}
                >
                  Update Status
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
};

export default TransactionDetailsPage;