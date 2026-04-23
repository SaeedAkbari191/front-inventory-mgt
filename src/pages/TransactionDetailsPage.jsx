import React, { useEffect, useState, useCallback } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const TransactionDetailsPage = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();

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
      navigate("/transaction");
    } catch {
      showMessage("Failed to update status");
    }
  };

  if (!transaction) return null;

  const totalProducts =
    transaction.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

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

  return (
    <Layout>
      <div className="container py-4">

        {/* MESSAGE */}
        {message && (
          <div className="alert alert-danger">{message}</div>
        )}

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold">Transaction Details</h4>
          <span className={`badge bg-${getBadge(transaction.transactionType)}`}>
            {transaction.transactionType}
          </span>
        </div>

        {/* SUMMARY */}
        <div className="row g-3 mb-4">

          <div className="col-md-4">
            <div className="card shadow-sm border-0 text-center">
              <div className="card-body">
                <h6 className="text-muted">Total Price</h6>
                <h5 className="fw-bold">
                  ${transaction.totalPrice?.toFixed(2)}
                </h5>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-0 text-center">
              <div className="card-body">
                <h6 className="text-muted">Products</h6>
                <h5 className="fw-bold">{totalProducts}</h5>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-0 text-center">
              <div className="card-body">
                <h6 className="text-muted">Status</h6>
                <span className="badge bg-secondary">
                  {transaction.status}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* GENERAL INFO */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h5 className="mb-3">General Info</h5>

            <div className="row">
              <div className="col-md-4">
                <p><strong>Description:</strong><br />{transaction.description || "-"}</p>
              </div>

              <div className="col-md-4">
                <p><strong>Note:</strong><br />{transaction.note || "-"}</p>
              </div>

              <div className="col-md-4">
                <p>
                  <strong>Date:</strong><br />
                  {new Date(transaction.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ITEMS */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {transaction.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.productName}</td>
                      <td>{item.quantity}</td>
                      <td>${item.unitPrice}</td>
                      <td>
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        </div>

        {/* USER */}
        {transaction.user && (
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <h5>User</h5>
              <p className="mb-1">{transaction.user.name}</p>
              <p className="mb-1 text-muted">{transaction.user.email}</p>
              <p className="text-muted">{transaction.user.phoneNumber}</p>
            </div>
          </div>
        )}

        {/* SUPPLIER */}
        {transaction.supplier && (
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <h5>Supplier</h5>
              <p className="mb-1">{transaction.supplier.name}</p>
              <p className="text-muted">{transaction.supplier.contactInfo}</p>
            </div>
          </div>
        )}

        {/* UPDATE */}
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h5 className="mb-3">Update Status</h5>

            <div className="d-flex gap-2 flex-wrap">
              <select
                className="form-select"
                style={{ maxWidth: "220px" }}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="PENDING">PENDING</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>

              <button
                className="btn btn-primary"
                onClick={handleUpdateStatus}
              >
                Update
              </button>
            </div>

          </div>
        </div>

      </div>
    </Layout>
  );
};

export default TransactionDetailsPage;