import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const AddEditProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCategories();
    if (productId) fetchProduct();
  }, [productId]);

  const fetchCategories = async () => {
    try {
      const res = await ApiService.getAllCategory();
      setCategories(res.categories || []);
    } catch {
      showMessage("Error loading categories");
    }
  };

  const fetchProduct = async () => {
    setIsEditing(true);
    try {
      const res = await ApiService.getProductById(productId);
      const p = res.product;

      setName(p.name);
      setSku(p.sku);
      setCategoryId(p.categoryId);
      setDescription(p.description);
      setImageUrl(p.imageUrl);
    } catch {
      showMessage("Error loading product");
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("sku", sku);
    formData.append("categoryId", categoryId);
    formData.append("description", description);
    if (imageFile) formData.append("imageFile", imageFile);

    try {
      if (isEditing) {
        formData.append("productId", productId);
        await ApiService.updateProduct(formData);
        showMessage("Product updated successfully");
      } else {
        await ApiService.addProduct(formData);
        showMessage("Product added successfully");
      }

      navigate("/product");
    } catch (error) {
      showMessage(error.response?.data?.message || "Error saving product");
    }
  };

  return (
    <Layout>
      <div className="container py-4">

        {message && (
          <div className="alert alert-info shadow-sm">{message}</div>
        )}

        <div className="card shadow-sm border-0">
          <div className="card-body">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-0">
                {isEditing ? "Edit Product" : "Add Product"}
              </h4>

              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate("/product")}
              >
                Back
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">SKU</label>
                <input
                  type="text"
                  className="form-control"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Product Image</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleImageChange}
                />

                {imageUrl && (
                  <div className="mt-3 text-center">
                    <img
                      src={imageUrl}
                      alt="preview"
                      className="img-fluid rounded shadow-sm"
                      style={{ maxHeight: "200px" }}
                    />
                  </div>
                )}
              </div>

              <button className="btn btn-primary w-100">
                {isEditing ? "Update Product" : "Add Product"}
              </button>

            </form>

          </div>
        </div>

      </div>
    </Layout>
  );
};

export default AddEditProductPage;