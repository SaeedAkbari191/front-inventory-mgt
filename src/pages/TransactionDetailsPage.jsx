import React, { useEffect, useState, useCallback } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";

// ----------------------------------------------
//  کامپوننت‌های کوچک و قابل استفاده مجدد
// ----------------------------------------------

const getBadgeVariant = (type) => {
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

const TransactionSummary = ({ totalPrice, totalProducts, status }) => (
  <div className="row g-3 mb-4">
    <div className="col-md-4">
      <div className="card shadow-sm border-0 text-center">
        <div className="card-body">
          <h6 className="text-muted">Total Price</h6>
          <h5 className="fw-bold">${totalPrice?.toFixed(2)}</h5>
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
          <span className="badge bg-secondary">{status}</span>
        </div>
      </div>
    </div>
  </div>
);

const GeneralInfo = ({ description, note, createdAt }) => (
  <div className="card shadow-sm border-0 mb-4">
    <div className="card-body">
      <h5 className="mb-3">General Info</h5>
      <div className="row">
        <div className="col-md-4">
          <p><strong>Description:</strong><br />{description || "-"}</p>
        </div>
        <div className="col-md-4">
          <p><strong>Note:</strong><br />{note || "-"}</p>
        </div>
        <div className="col-md-4">
          <p><strong>Date:</strong><br />{new Date(createdAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  </div>
);

const ItemsTable = ({ items }) => {
  if (!items || items.length === 0) return null;
  
  return (
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
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.productName}</td>
                  <td>{item.quantity}</td>
                  <td>${item.unitPrice}</td>
                  <td>${(item.unitPrice * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const UserCard = ({ user }) => {
  if (!user) return null;
  
  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body">
        <h5>User</h5>
        <p className="mb-1">{user.name}</p>
        <p className="mb-1 text-muted">{user.email}</p>
        <p className="text-muted">{user.phoneNumber}</p>
      </div>
    </div>
  );
};

const SupplierCard = ({ supplier }) => {
  if (!supplier) return null;
  
  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body">
        <h5>Supplier</h5>
        <p className="mb-1">{supplier.name}</p>
        <p className="text-muted">{supplier.contactInfo}</p>
      </div>
    </div>
  );
};

const StatusUpdatePanel = ({ status, onStatusChange, onUpdate }) => (
  <div className="card shadow-sm border-0">
    <div className="card-body">
      <h5 className="mb-3">Update Status</h5>
      <div className="d-flex gap-2 flex-wrap">
        <select
          className="form-select"
          style={{ maxWidth: "220px" }}
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="PENDING">PENDING</option>
          <option value="PROCESSING">PROCESSING</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
        <button className="btn btn-primary" onClick={onUpdate}>
          Update
        </button>
      </div>
    </div>
  </div>
);

// ----------------------------------------------
//  صفحه اصلی
// ----------------------------------------------

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

  const totalProducts = transaction.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <Layout>
      <div className="container py-4">
        {/* پیام خطا */}
        {message && <div className="alert alert-danger">{message}</div>}

        {/* هدر با عنوان و نوع تراکنش */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold">Transaction Details</h4>
          <span className={`badge bg-${getBadgeVariant(transaction.transactionType)}`}>
            {transaction.transactionType}
          </span>
        </div>

        {/* خلاصه کارت‌ها */}
        <TransactionSummary
          totalPrice={transaction.totalPrice}
          totalProducts={totalProducts}
          status={transaction.status}
        />

        {/* اطلاعات عمومی */}
        <GeneralInfo
          description={transaction.description}
          note={transaction.note}
          createdAt={transaction.createdAt}
        />

        {/* جدول محصولات */}
        <ItemsTable items={transaction.items} />

        {/* اطلاعات کاربر (در صورت وجود) */}
        <UserCard user={transaction.user} />

        {/* اطلاعات تأمین‌کننده (در صورت وجود) */}
        <SupplierCard supplier={transaction.supplier} />

        {/* بخش تغییر وضعیت */}
        <StatusUpdatePanel
          status={status}
          onStatusChange={setStatus}
          onUpdate={handleUpdateStatus}
        />
      </div>
    </Layout>
  );
};

export default TransactionDetailsPage;