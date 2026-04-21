import React, { useEffect, useMemo, useState } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import "./dashboard.css"
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
            res.transactions,
            selectedMonth,
            selectedYear
          )
        );
      }
    } catch (error) {
      showMessage("Error loading data");
    }
  };

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
      const d = new Date(t.createdAt);
      if (d.getMonth() + 1 === month && d.getFullYear() === year) {
        const day = d.getDate();
        const price = Number(t.totalPrice);
        const qty = Number(t.totalProducts);

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
        <div className="tooltip">
          <strong>Day {label}</strong>
          {payload.map((p, i) => (
            <div key={i}>{p.name}: {p.value}</div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Layout>
      <div className="dashboard-page">

        {message && <div className="message">{message}</div>}

        {/* 🔥 Summary */}
        <div className="summary-cards">
          <div className="card">
            <h4>Sales</h4>
            <p>{totals.sales}</p>
          </div>
          <div className="card">
            <h4>Purchases</h4>
            <p>{totals.purchase}</p>
          </div>
          <div className="card">
            <h4>Returns</h4>
            <p>{totals.return}</p>
          </div>
          <div className="card profit">
            <h4>Profit</h4>
            <p>{totals.profit}</p>
          </div>
        </div>

        {/* 🔥 Controls */}
        <div className="controls">
          <div className="buttons">
            <button onClick={() => setSelectedView("amount")} className={selectedView === "amount" ? "active" : ""}>Amount</button>
            <button onClick={() => setSelectedView("quantity")} className={selectedView === "quantity" ? "active" : ""}>Quantity</button>
            <button onClick={() => setSelectedView("count")} className={selectedView === "count" ? "active" : ""}>Transactions</button>
          </div>

          <div className="filters">
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(+e.target.value)}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>

            <select value={selectedYear} onChange={(e) => setSelectedYear(+e.target.value)}>
              {Array.from({ length: 5 }, (_, i) => {
                const y = new Date().getFullYear() - i;
                return <option key={y}>{y}</option>;
              })}
            </select>
          </div>
        </div>

        {/* 🔥 Chart */}
        <div className="chart-container">
          <h3>Dashboard Analytics</h3>

          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={transactionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {selectedView === "amount" && (
                <>
                  <Line type="monotone" dataKey="salesAmount" stroke="#16a34a" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="purchaseAmount" stroke="#dc2626" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="returnAmount" stroke="#f59e0b" strokeWidth={3} dot={false} />
                </>
              )}

              {selectedView === "quantity" && (
                <>
                  <Line type="monotone" dataKey="soldQty" stroke="#2563eb" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="purchasedQty" stroke="#7c3aed" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="returnedQty" stroke="#ea580c" strokeWidth={3} dot={false} />
                </>
              )}

              {selectedView === "count" && (
                <>
                  <Line type="monotone" dataKey="salesCount" stroke="#22c55e" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="purchaseCount" stroke="#ef4444" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="returnCount" stroke="#f97316" strokeWidth={3} dot={false} />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </Layout>
  );
};

export default DashboardPage;