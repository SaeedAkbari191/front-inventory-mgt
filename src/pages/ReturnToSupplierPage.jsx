import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";

const ReturnToSupplierPage = () => {
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
    } catch {
      showMessage("Error loading data");
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productId || !supplierId) {
      return showMessage("Select product & supplier");
    }

    if (quantity <= 0 || unitPrice <= 0) {
      return showMessage("Quantity & price must be greater than 0");
    }

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
      const res = await ApiService.returnToSupplier(body);
      showMessage(res.message);

      setProductId("");
      setSupplierId("");
      setQuantity("");
      setUnitPrice("");
      setDescription("");
      setNote("");

    } catch (error) {
      showMessage(error.response?.data?.message || "Error Returning Product");
    }
  };

  return (
    <Layout>
      <div className="container py-4">

        {message && (
          <div className="alert alert-warning">{message}</div>
        )}

        <div className="card shadow-sm">
          <div className="card-body">

            <h4 className="mb-4 fw-bold">Return To Supplier</h4>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">

                {/* Product */}
                <div className="col-md-6">
                  <label className="form-label">Product</label>
                  <select
                    className="form-select"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    required
                  >
                    <option value="">Select product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}{" "}
                        {p.stock !== undefined && `(Stock: ${p.stock})`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Supplier */}
                <div className="col-md-6">
                  <label className="form-label">Supplier</label>
                  <select
                    className="form-select"
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    required
                  >
                    <option value="">Select supplier</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div className="col-md-6">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>

                {/* Price */}
                <div className="col-md-6">
                  <label className="form-label">Return Price</label>
                  <input
                    type="number"
                    className="form-control"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div className="col-md-6">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Note */}
                <div className="col-md-6">
                  <label className="form-label">Note</label>
                  <input
                    type="text"
                    className="form-control"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>

              </div>

              <div className="mt-4 text-end">
                <button className="btn btn-warning px-5">
                  Return
                </button>
              </div>

            </form>

          </div>
        </div>

      </div>
    </Layout>
  );
};

export default ReturnToSupplierPage;