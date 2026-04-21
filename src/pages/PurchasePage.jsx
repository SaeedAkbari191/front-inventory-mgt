import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";

const PurchasePage = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [productId, setProductId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const p = await ApiService.getAllProducts();
      const s = await ApiService.getAllSuppliers();

      setProducts(p.products || []);
      setSuppliers(s.suppliers || []);
    } catch (err) {
      showMessage("Error loading data");
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ validation
    if (!productId || !supplierId) {
      return showMessage("Select product & supplier");
    }

    if (quantity <= 0 || unitPrice <= 0) {
      return showMessage("Quantity & price must be greater than 0");
    }

    // ✅ ساختار جدید (مطابق بک‌اند)
    const body = {
      supplierId: Number(supplierId),
      description,
      note,
      items: [
        {
          productId: Number(productId),
          quantity: Number(quantity),
          unitPrice: Number(unitPrice),
        },
      ],
    };

    try {
      const response = await ApiService.purchaseProduct(body);
      showMessage(response.message);

      // reset فرم (optional ولی حرفه‌ای)
      setProductId("");
      setSupplierId("");
      setQuantity("");
      setUnitPrice("");
      setDescription("");
      setNote("");

    } catch (error) {
      showMessage(error.response?.data?.message || "Error Purchasing Product");
    }
  };

  return (
    <Layout>
      {message && <div className="message">{message}</div>}

      <div className="product-form-page">
        <h1>Purchase Product</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Product</label>
            <select value={productId} onChange={(e) => setProductId(e.target.value)} required>
              <option value="">Select a product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.stock !== undefined ? `(Stock: ${p.stock})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Select Supplier</label>
            <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} required>
              <option value="">Select a supplier</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Buy Price</label>
            <input
              type="number"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Note</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <button type="submit">Purchase Product</button>
        </form>
      </div>
    </Layout>
  );
};

export default PurchasePage;