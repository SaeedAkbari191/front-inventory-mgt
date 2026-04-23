import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../component/PaginationComponent";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await ApiService.getAllProducts();

        if (res.status === 200) {
          setTotalPages(Math.ceil(res.products.length / itemsPerPage));

          setProducts(
            res.products.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            )
          );
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error loading products"
        );
      }
    };

    getProducts();
  }, [currentPage]);

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        await ApiService.deleteProduct(id);
        showMessage("Product deleted successfully");
        window.location.reload();
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error deleting product"
        );
      }
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  return (
    <Layout>
      <div className="container py-4">

        {message && (
          <div className="alert alert-info shadow-sm">{message}</div>
        )}

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Products</h4>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/add-product")}
          >
            + Add Product
          </button>
        </div>

        {/* Product Grid */}
        <div className="row g-3">
          {products.map((product) => (
            <div key={product.id} className="col-md-4">
              <div className="card shadow-sm h-100 border-0">

                {/* Image */}
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="card-img-top"
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                )}

                <div className="card-body">

                  {/* 🔥 اصلاح شده */}
                  <h5 className="card-title">{product.name}</h5>

                  <p className="mb-1 text-muted">
                    <strong>SKU:</strong> {product.sku}
                  </p>

                  <p className="mb-3">
                    <strong>Quantity:</strong> {product.stock ?? 0}
                  </p>

                  {/* Actions */}
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => navigate(`/edit-product/${product.id}`)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </Layout>
  );
};

export default ProductPage;