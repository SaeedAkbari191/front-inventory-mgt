import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const AddEditProductPage = () => {
  const { productId } = useParams();
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    if (productId) fetchProductById();
  }, [productId]);

  const fetchCategories = async () => {
    try {
      const res = await ApiService.getAllCategory();
      setCategories(res.categories);
    } catch (error) {
      showMessage("Error loading categories");
    }
  };

  const fetchProductById = async () => {
    setIsEditing(true);
    try {
      const res = await ApiService.getProductById(productId);
      const p = res.product;

      setName(p.name);
      setSku(p.sku);
      setCategoryId(p.categoryId);
      setDescription(p.description);
      setImageUrl(p.imageUrl);
    } catch (error) {
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

    const reader = new FileReader();
    reader.onloadend = () => setImageUrl(reader.result);
    reader.readAsDataURL(file);
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
      {message && <div className="message">{message}</div>}

      <div className="product-form-page">
        <h1>{isEditing ? "Edit Product" : "Add Product"}</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>SKU</label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
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

          <div className="form-group">
            <label>Product Image</label>
            <input type="file" onChange={handleImageChange} />
            {imageUrl && (
              <img src={imageUrl} alt="preview" className="image-preview" />
            )}
          </div>

          <button type="submit">
            {isEditing ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddEditProductPage;