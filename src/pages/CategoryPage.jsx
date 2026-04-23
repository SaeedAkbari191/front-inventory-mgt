import React, { useEffect, useState } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  //fetcg the categories form our backend

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await ApiService.getAllCategory();
        if (response.status === 200) {
          setCategories(response.categories);
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Loggin in a User: " + error
        );
      }
    };
    getCategories();
  }, []);

  //add category
  const addCategory = async () => {
    if (!categoryName) {
      showMessage("Category name cannot be empty");
      return;
    }
    try {
      await ApiService.createCategory({ name: categoryName });
      showMessage("Category sucessfully added");
      setCategoryName(""); //clear input
      window.location.reload(); //relode page
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error Loggin in a User: " + error
      );
    }
  };

  //Edit category
  const editCategory = async () => {
    try {
      await ApiService.updateCategory(editingCategoryId, {
        name: categoryName,
      });
      showMessage("Category sucessfully Updated");
      setIsEditing(false);
      setCategoryName(""); //clear input
      window.location.reload(); //relode page
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error Loggin in a User: " + error
      );
    }
  };

  //populate the edit category data
  const handleEditCategory = (category) => {
    setIsEditing(true);
    setEditingCategoryId(category.id);
    setCategoryName(category.name);
  };

  //delete category
  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await ApiService.deleteCategory(categoryId);
        showMessage("Category sucessfully Deleted");
        window.location.reload(); //relode page
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Deleting in a Category: " + error
        );
      }
    }
  };

  //metjhod to show message or errors
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  return (
  <Layout>
    <div className="container py-4">

      {message && (
        <div className="alert alert-danger">{message}</div>
      )}

      {/* TITLE */}
      <h3 className="fw-bold mb-4">Categories Management</h3>

      {/* FORM BAR */}
      <div className="bg-light p-3 rounded mb-4 border">
        <div className="row align-items-end g-2">

          <div className="col-md-6">
            <label className="form-label fw-semibold">Category Name</label>
            <input
              className="form-control"
              placeholder="Enter category name..."
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>

          <div className="col-md-6 d-flex gap-2">
            {!isEditing ? (
              <button className="btn btn-primary" onClick={addCategory}>
                Add Category
              </button>
            ) : (
              <>
                <button className="btn btn-warning" onClick={editCategory}>
                  Update
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setCategoryName("");
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>

        </div>
      </div>

      {/* TABLE */}
      <div className="table-responsive">
        <table className="table table-hover align-middle">

          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th className="text-end" style={{ width: "200px" }}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {categories.length === 0 && (
              <tr>
                <td colSpan="2" className="text-center text-muted py-4">
                  No categories found
                </td>
              </tr>
            )}

            {categories.map((category) => (
              <tr key={category.id}>
                <td className="fw-semibold">{category.name}</td>

                <td className="text-end">
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleEditCategory(category)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  </Layout>
);
};

export default CategoryPage;
