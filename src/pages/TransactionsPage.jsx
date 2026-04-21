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

  return (
    <Layout>
      {message && <p className="message">{message}</p>}

      <div className="transactions-page">
        <div className="transactions-header">
          <h1>Transactions</h1>

          <div className="transaction-search">
            <input
              placeholder="Search transaction ..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              type="text"
            />
            <button onClick={handleSearch}>Search</button>
          </div>
        </div>

        <table className="transactions-table">
          <thead>
            <tr>
              <th>TYPE</th>
              <th>STATUS</th>
              <th>TOTAL PRICE</th>
              <th>TOTAL PRODUCTS</th>
              <th>DATE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>{t.transactionType}</td>
                <td>{t.status}</td>

                <td>{t.totalPrice ?? 0}</td>

                {/* FIX اصلی */}
                <td>
  {t.items
    ? t.items.reduce((sum, i) => sum + i.quantity, 0)
    : 0}
</td>

                <td>
                  {t.createdAt
                    ? new Date(t.createdAt).toLocaleString()
                    : "-"}
                </td>

                <td>
                  <button onClick={() => navigateToTransactionDetailsPage(t.id)}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </Layout>
  );
};

export default TransactionsPage;