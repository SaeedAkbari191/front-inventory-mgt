import React, { useEffect, useMemo, useState } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const DashboardPage = () => {
  const [message, setMessage] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedView, setSelectedView] = useState("amount");
  const [transactionData, setTransactionData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const fetchData = async () => {
    try {
      const res = await ApiService.getAllTransactions();

      if (res.status === 200) {
        setTransactionData(
          transformTransactionData(
            res.transactions || [],
            selectedMonth,
            selectedYear
          )
        );
      }
    } catch {
      showMessage("Error loading data");
    }
  };

  const getTotalQty = (items = []) =>
    items.reduce((sum, i) => sum + (i.quantity || 0), 0);

  const transformTransactionData = (transactions, month, year) => {
    const days = new Date(year, month, 0).getDate();
    const data = {};

    for (let i = 1; i <= days; i++) {
      data[i] = {
        day: i,
        salesAmount: 0,
        purchaseAmount: 0,
        returnAmount: 0,
        salesCount: 0,
        purchaseCount: 0,
        returnCount: 0,
        soldQty: 0,
        purchasedQty: 0,
        returnedQty: 0
      };
    }

    transactions.forEach((t) => {
      if (!t.createdAt) return;

      const d = new Date(t.createdAt);

      if (d.getMonth() + 1 === month && d.getFullYear() === year) {
        const day = d.getDate();
        const price = Number(t.totalPrice || 0);
        const qty = getTotalQty(t.items);

        if (t.transactionType === "SALE") {
          data[day].salesAmount += price;
          data[day].salesCount++;
          data[day].soldQty += qty;
        }

        if (t.transactionType === "PURCHASE") {
          data[day].purchaseAmount += price;
          data[day].purchaseCount++;
          data[day].purchasedQty += qty;
        }

        if (t.transactionType === "RETURN_TO_SUPPLIER") {
          data[day].purchaseAmount -= price;
          data[day].returnAmount += price;
          data[day].returnCount++;
          data[day].returnedQty += qty;
        }
      }
    });

    return Object.values(data);
  };

  const totals = useMemo(() => {
    return transactionData.reduce(
      (acc, d) => {
        acc.sales += d.salesAmount;
        acc.purchase += d.purchaseAmount;
        acc.return += d.returnAmount;
        acc.profit = acc.sales - acc.purchase;
        return acc;
      },
      { sales: 0, purchase: 0, return: 0, profit: 0 }
    );
  }, [transactionData]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div
          style={{
            background: "#0f172a",
            color: "#fff",
            padding: "10px",
            borderRadius: "8px",
            fontSize: "13px"
          }}
        >
          <strong>Day {label}</strong>
          {payload.map((p, i) => (
            <div key={i}>
              {p.name}: {p.value}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Layout>
      <div className="container py-4">

        {message && (
          <div className="alert alert-danger">{message}</div>
        )}

        {/* ================= SUMMARY ================= */}
        <div className="row g-3 mb-4">

          <div className="col-md-3">
            <div className="card shadow-sm card-sales">
              <div className="card-body">
                <h6 className="text-muted">Sales</h6>
                <h4 className="text-success">{totals.sales}</h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm card-purchase">
              <div className="card-body">
                <h6 className="text-muted">Purchases</h6>
                <h4 className="text-danger">{totals.purchase}</h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm card-return">
              <div className="card-body">
                <h6 className="text-muted">Returns</h6>
                <h4 style={{ color: "#f59e0b" }}>{totals.return}</h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm card-profit">
              <div className="card-body">
                <h6 className="text-muted">Profit</h6>
                <h4 style={{ color: "#06b6d4" }}>{totals.profit}</h4>
              </div>
            </div>
          </div>

        </div>

        {/* ================= CONTROLS ================= */}
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">

          <div className="btn-group">
            <button
              className={`btn btn-outline-secondary ${selectedView === "amount" ? "active" : ""}`}
              onClick={() => setSelectedView("amount")}
            >
              Amount
            </button>

            <button
              className={`btn btn-outline-secondary ${selectedView === "quantity" ? "active" : ""}`}
              onClick={() => setSelectedView("quantity")}
            >
              Quantity
            </button>

            <button
              className={`btn btn-outline-secondary ${selectedView === "count" ? "active" : ""}`}
              onClick={() => setSelectedView("count")}
            >
              Transactions
            </button>
          </div>

          <div className="d-flex gap-2">
            <select
              className="form-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(+e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>

            <select
              className="form-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(+e.target.value)}
            >
              {Array.from({ length: 5 }, (_, i) => {
                const y = new Date().getFullYear() - i;
                return <option key={y}>{y}</option>;
              })}
            </select>
          </div>

        </div>

        {/* ================= CHART ================= */}
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="mb-3">Dashboard Analytics</h5>

            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={transactionData}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />

                {selectedView === "amount" && (
                  <>
                    <Line type="monotone" dataKey="salesAmount" stroke="#22c55e" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="purchaseAmount" stroke="#ef4444" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="returnAmount" stroke="#f59e0b" strokeWidth={3} dot={false} />
                  </>
                )}

                {selectedView === "quantity" && (
                  <>
                    <Line type="monotone" dataKey="soldQty" stroke="#0ea5e9" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="purchasedQty" stroke="#8b5cf6" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="returnedQty" stroke="#f97316" strokeWidth={3} dot={false} />
                  </>
                )}

                {selectedView === "count" && (
                  <>
                    <Line type="monotone" dataKey="salesCount" stroke="#16a34a" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="purchaseCount" stroke="#dc2626" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="returnCount" stroke="#ea580c" strokeWidth={3} dot={false} />
                  </>
                )}

              </LineChart>
            </ResponsiveContainer>

          </div>
        </div>

      </div>
    </Layout>
  );
};

export default DashboardPage;