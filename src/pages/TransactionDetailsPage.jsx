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
      showMessage("Status updated");
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
          <div className="alert alert-info shadow-sm">{message}</div>
        )}

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-1">Transaction #{transaction.id}</h4>
            <small className="text-muted">
              {new Date(transaction.createdAt).toLocaleString()}
            </small>
          </div>

          <div className="d-flex gap-2 align-items-center">
            <span className={`badge bg-${getBadge(transaction.transactionType)} px-3 py-2`}>
              {transaction.transactionType}
            </span>

            <span className="badge bg-secondary px-3 py-2">
              {transaction.status}
            </span>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="row g-3 mb-4">

          <div className="col-md-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center">
                <p className="text-muted mb-1">Total Price</p>
                <h4 className="fw-bold mb-0">
                  ${transaction.totalPrice?.toFixed(2)}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center">
                <p className="text-muted mb-1">Total Items</p>
                <h4 className="fw-bold mb-0">{totalProducts}</h4>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center">
                <p className="text-muted mb-1">Description</p>
                <p className="fw-semibold mb-0">
                  {transaction.description || "-"}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* MAIN GRID */}
        <div className="row g-4">

          {/* LEFT SIDE */}
          <div className="col-lg-8">

            {/* ITEMS */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body p-0">

                <div className="px-3 py-2 border-bottom fw-semibold">
                  Products
                </div>

                <div className="table-responsive">
                  <table className="table table-hover mb-0 align-middle">
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
                          <td className="fw-semibold">{item.productName}</td>
                          <td>{item.quantity}</td>
                          <td>${item.unitPrice}</td>
                          <td className="fw-semibold">
                            ${(item.unitPrice * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="col-lg-4">

            {/* USER */}
            {transaction.user && (
              <div className="card shadow-sm border-0 mb-3">
                <div className="card-body">
                  <h6 className="fw-bold mb-2">User</h6>
                  <p className="mb-1 fw-semibold">{transaction.user.name}</p>
                  <small className="text-muted d-block">
                    {transaction.user.email}
                  </small>
                  <small className="text-muted">
                    {transaction.user.phoneNumber}
                  </small>
                </div>
              </div>
            )}

            {/* SUPPLIER */}
            {transaction.supplier && (
              <div className="card shadow-sm border-0 mb-3">
                <div className="card-body">
                  <h6 className="fw-bold mb-2">Supplier</h6>
                  <p className="mb-1 fw-semibold">
                    {transaction.supplier.name}
                  </p>
                  <small className="text-muted">
                    {transaction.supplier.contactInfo}
                  </small>
                </div>
              </div>
            )}

            {/* UPDATE */}
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h6 className="fw-bold mb-3">Update Status</h6>

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