import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";

const SellPage = () => {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const p = await ApiService.getAllProducts();
      setProducts(p.products || []);
    } catch {
      showMessage("Error loading products");
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedProduct = products.find(p => p.id == productId);

    // ✅ validation
    if (!selectedProduct) {
      return showMessage("Select product");
    }

    if (quantity <= 0 || unitPrice <= 0) {
      return showMessage("Quantity & price must be greater than 0");
    }

    if (selectedProduct.stock !== undefined && quantity > selectedProduct.stock) {
      return showMessage("Not enough stock");
    }

    // ✅ ساختار جدید (items-based)
    const body = {
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
      const response = await ApiService.sellProduct(body);
      showMessage(response.message);

      // reset فرم
      setProductId("");
      setQuantity("");
      setUnitPrice("");
      setDescription("");
      setNote("");

    } catch (error) {
      showMessage(error.response?.data?.message || "Error Selling Product");
    }
  };

  return (
    <Layout>
      {message && <div className="message">{message}</div>}

      <div className="product-form-page">
        <h1>Sell Product</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Product</label>
            <select value={productId} onChange={(e) => setProductId(e.target.value)} required>
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} {product.stock !== undefined ? `(Stock: ${product.stock})` : ""}
                </option>
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
            <label>Sell Price</label>
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

          <button type="submit">Sell Product</button>
        </form>
      </div>
    </Layout>
  );
};

export default SellPage;