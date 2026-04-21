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
      } catch (err) {
        showMessage("Error loading transaction");
      }
    };

    fetchTransaction();
  }, [transactionId, showMessage]);

  const handleUpdateStatus = async () => {
    try {
      await ApiService.updateTransactionStatus(transactionId, status);
      navigate("/transaction");
    } catch (err) {
      showMessage("Failed to update status");
    }
  };

  if (!transaction) return null;

  const totalProducts =
    transaction.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <Layout>
      {message && <p className="message">{message}</p>}

      <div className="transaction-details-page">

        {/* Transaction Info */}
        <div className="section-card">
          <h2>Transaction Information</h2>
          <p>Type: {transaction.transactionType}</p>
          <p>Status: {transaction.status}</p>
          <p>Description: {transaction.description}</p>
          <p>Note: {transaction.note}</p>
          <p>Total Products: {totalProducts}</p>
          <p>Total Price: {transaction.totalPrice?.toFixed(2)}</p>
          <p>
            Created At:{" "}
            {transaction.createdAt &&
              new Date(transaction.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Items */}
        <div className="section-card">
          <h2>Products In This Transaction</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
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
                  <td>{item.unitPrice}</td>
                  <td>{item.unitPrice * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* User */}
        {transaction.user && (
          <div className="section-card">
            <h2>User Information</h2>
            <p>Name: {transaction.user.name}</p>
            <p>Email: {transaction.user.email}</p>
            <p>Phone: {transaction.user.phoneNumber}</p>
          </div>
        )}

        {/* Supplier */}
        {transaction.supplier && (
          <div className="section-card">
            <h2>Supplier Information</h2>
            <p>Name: {transaction.supplier.name}</p>
            <p>Contact: {transaction.supplier.contactInfo}</p>
          </div>
        )}

        {/* Update Status */}
        <div className="section-card">
          <label>Status: </label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="PENDING">PENDING</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
          <button onClick={handleUpdateStatus}>Update Status</button>
        </div>

      </div>
    </Layout>
  );
};

export default TransactionDetailsPage;