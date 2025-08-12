"use client";

import { useEffect, useState, useMemo } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Pagination from "@/components/admin/Pagination";
import Profile from "@/components/admin/profile";
import { Category } from "@/types";
import { Search as SearchIcon } from "lucide-react";

export default function ArticlesPage() {
  const [token, setToken] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");


  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);
  
  useEffect(() => {
    fetch("https://test-fe.mysellerpintar.com/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const SearchCategory = useMemo(() => {
    return categories.filter((category) => {
      const matchSearch = debouncedSearch
        ? category.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        : true;
      return matchSearch;
    });
  }, [categories, debouncedSearch]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(SearchCategory.length / itemsPerPage);
  const paginatedArticles = SearchCategory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openEditModal = (category: Category) => {
    setIsEdit(true);
    setCategoryName(category.name);
    setSelectedId(category.id);
    setError("");
    setShowFormModal(true);
  };

  const handleSave = async () => {
    if (!categoryName.trim()) {
      setError("Field cannot be empty");
      return;
    }

    try {
      const url = isEdit
        ? `https://test-fe.mysellerpintar.com/api/categories/${selectedId}`
        : "https://test-fe.mysellerpintar.com/api/categories";

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: categoryName }),
      });

      if (!res.ok) throw new Error("Failed to save category");

      setCategoryName("");
      setError("");
      setShowFormModal(false);

      setMessage(
        isEdit
          ? "Category updated successfully!"
          : "Category added successfully!"
      );
      setMessageType("success");

      const data = await fetch(
        "https://test-fe.mysellerpintar.com/api/categories"
      ).then((r) => r.json());
      setCategories(data.data || []);

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    } catch (err) {
      setMessage(
        isEdit ? "Failed to update category!" : "Failed to add category!"
      );
      setMessageType("error");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    }
  };

  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;
    try {
      const res = await fetch(
        `https://test-fe.mysellerpintar.com/api/categories/${selectedId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete category");

      setCategories((prev) => prev.filter((a) => a.id !== selectedId));
      setMessage("Category deleted successfully!");
      setMessageType("success");
    } catch (error) {
      console.error("Failed to delete:", error);
      setMessage("Failed to delete category!");
      setMessageType("error");
    } finally {
      setShowDeleteModal(false);
      setSelectedId(null);

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-5 bg-gray-50 ml-64">
        {message && (
          <div
            className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg text-white z-50 ${
              messageType === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {message}
          </div>
        )}
        <Profile />
        <div className="mt-4 bg-white rounded shadow">
          <div className="px-4 py-4 text-gray-700 font-semibold items-center">
            <span>Total Category: {categories.length}</span>
          </div>
          <div className="px-4 py-4 border-t flex items-center gap-4">
            <div className="flex items-center border rounded px-2 text-gray-400">
              <SearchIcon size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search Category "
                className="outline-none p-1 text-gray-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="ml-auto">
              <button
                onClick={() => {
                  setIsEdit(false);
                  setCategoryName("");
                  setError("");
                  setShowFormModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                + Add Category
              </button>
            </div>
          </div>
          <table className="border-t w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-black">
                <th className="p-2 text-center">Category</th>
                <th className="p-2 text-center">Created at</th>
                <th className="p-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedArticles.map((category) => (
                <tr
                  key={category.id}
                  className="border-t text-gray-300 text-center"
                >
                  <td className="p-4 text-gray-500">{category.name}</td>
                  <td className="p-4 text-gray-500">
                    {new Date(category.createdAt).toLocaleString("en-US", {
                      month: "long",
                      day: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="p-4 space-x-2 ">
                    <button
                      onClick={() => openEditModal(category)}
                      className="text-blue-500 underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(category.id)}
                      className="text-red-500 underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="py-3">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
        {showFormModal && (
          <div className="fixed inset-0 flex items-center justify-center fixed inset-0 bg-black/20 backdrop-blur-sm z-40">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {isEdit ? "Edit Category" : "Add Category"}
              </h2>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Input Category"
                className="text-black  w-full border border-gray-300 rounded px-3 py-2 mb-2"
              />
              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {isEdit ? "Save Changes" : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center fixed inset-0 bg-black/20 backdrop-blur-sm z-40">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Delete Category
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Deleting this category is permanent and cannot be undone. All
                related content will be removed.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
