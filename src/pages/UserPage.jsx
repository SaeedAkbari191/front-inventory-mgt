import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../component/PaginationComponent";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("");
  const [valueToSearch, setValueToSearch] = useState("");

  const navigate = useNavigate();
  const isAdmin = ApiService.isAdmin();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const itemsPerPage = 10;

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await ApiService.getAllUsers(
          currentPage - 1,
          itemsPerPage,
          valueToSearch
        );

        if (res.status === 200) {
          setUsers(res.users || []);
          setTotalPages(res.totalPages || 0);
        }
      } catch (error) {
        showMessage(error.response?.data?.message || "Error loading users");
      }
    };

    getUsers();
  }, [currentPage, valueToSearch]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setValueToSearch(filter);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await ApiService.updateUserRole(userId, newRole);
      setUsers(prev =>
        prev.map(u =>
          u.id === userId ? { ...u, role: newRole } : u
        )
      );
      showMessage("Role updated successfully");
    } catch (error) {
      showMessage(error.response?.data?.message || "Error updating role");
    }
  };

  return (
    <Layout>
      <div className="container py-4">

        {message && (
          <div className="alert alert-danger">{message}</div>
        )}

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h3 className="fw-bold">Users</h3>

          <div className="d-flex gap-2">
            <input
              className="form-control"
              placeholder="Search user..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />

            <button className="btn btn-primary" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="shadow-sm border-0">
          <div className="card-body p-0">

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">

                <thead className="table-light  users-thead justify-content-center">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th className="pe-5 text-end">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        No users found
                      </td>
                    </tr>
                  )}

                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.phoneNumber}</td>

                      <td>
                        {isAdmin ? (
                          <select
                            className="form-select"
                            value={u.role}
                            onChange={(e) =>
                              handleRoleChange(u.id, e.target.value)
                            }
                          >
                            <option value="ADMIN">ADMIN</option>
                            <option value="MANAGER">MANAGER</option>
                          </select>
                        ) : (
                          <span className="badge bg-secondary">{u.role}</span>
                        )}
                      </td>

                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary me-2 px-3"
                          onClick={() => navigate(`/users/edit/${u.id}`)}
                        >
                          Edit
                        </button>

                        {isAdmin && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={async () => {
                              if (window.confirm("Delete this user?")) {
                                await ApiService.deleteUser(u.id);
                                setUsers(prev =>
                                  prev.filter(x => x.id !== u.id)
                                );
                                showMessage("User deleted");
                              }
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

          </div>
        </div>

        {/* PAGINATION */}
        <div className="mt-4">
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

      </div>
    </Layout>
  );
};

export default UsersPage;