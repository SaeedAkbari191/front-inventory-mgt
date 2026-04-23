import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../component/PaginationComponent";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("");
  const [valueToSearch, setValueToSearch] = useState("");

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const itemsPerPage = 10;

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const res = await ApiService.getAllTransactions(
          currentPage - 1,
          itemsPerPage,
          valueToSearch
        );

        if (res.status === 200) {
          setTransactions(res.transactions || []);
          setTotalPages(res.totalPages || 0);
          console.log(res)
          
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Getting transactions"
        );
      }
    };

    getTransactions();
  }, [currentPage, valueToSearch]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setValueToSearch(filter);
  };

  const navigateToTransactionDetailsPage = (id) => {
    navigate(`/transaction/${id}`);
  };

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

        {/* ALERT */}
        {message && (
          <div className="alert alert-danger">{message}</div>
        )}

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h3 className="fw-bold">Transactions</h3>

          <div className="d-flex gap-2">
            <input
              className="form-control"
              placeholder="Search transaction..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />

            <button className="btn btn-primary" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="shadow-sm rounded border bg-light ">
          <div className="card-body p-0 ">

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">

                <thead className="table-light">
                  <tr>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total Price</th>
                    <th>Date</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        No transactions found
                      </td>
                    </tr>
                  )}

                  {transactions.map((t) => (
                    <tr key={t.id}>

                      {/* TYPE */}
                      <td>
                        <span className={`badge bg-${getBadge(t.transactionType)}`}>
                          {t.transactionType}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td>
                        <span className="badge bg-secondary">
                          {t.status}
                        </span>
                      </td>

                      {/* QTY */}
                      <td>
                        {t.items
                          ? t.items.reduce((sum, i) => sum + i.quantity, 0)
                          : 0}
                      </td>

                      {/* Unit Price */}
                      <td>
                        {t.items
                          ? t.items.reduce((sum, i) => sum + i.unitPrice, 0)
                          : 0}
                      </td>

                      {/* PRICE */}
                      <td className="fw-semibold">
                        {t.totalPrice ?? 0}
                      </td>

                      

                      {/* DATE */}
                      <td className="text-muted small">
                        {t.createdAt
                          ? new Date(t.createdAt).toLocaleString()
                          : "-"}
                      </td>

                      {/* ACTION */}
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() =>
                            navigateToTransactionDetailsPage(t.id)
                          }
                        >
                          Details
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

          </div>
        </div>

        {/* PAGINATION */}
        <div className="mt-4">
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

      </div>
    </Layout>
  );
};

export default TransactionsPage;