"use client";

import { useEffect, useState, useMemo } from "react";
import { Article, Category } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import Pagination from "@/components/admin/Pagination";
import Profile from "@/components/admin/profile";
import { Search as SearchIcon } from "lucide-react";

export default function ArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetch("https://test-fe.mysellerpintar.com/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.data || []))
      .catch(console.error);
  }, []);

  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchCategory = categoryFilter
        ? article.category?.id === categoryFilter
        : true;
      const matchSearch = debouncedSearch
        ? article.title.toLowerCase().includes(debouncedSearch.toLowerCase())
        : true;
      return matchCategory && matchSearch;
    });
  }, [articles, categoryFilter, debouncedSearch]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;
    try {
      await fetch(
        `https://test-fe.mysellerpintar.com/api/articles/${selectedId}`,
        {
          method: "DELETE",
        }
      );
      setArticles((prev) => prev.filter((a) => a.id !== selectedId));
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setShowModal(false);
      setSelectedId(null);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Checking login...</p>;
  }

  return (
    <div className="flex min-h-screen ">
      <Sidebar />
      <main className="flex-1 p-5 bg-gray-50 ml-64">
        <Profile />
        <div className="mt-4 bg-white rounded shadow">
          <div className="px-4 py-4 text-gray-700 font-semibold items-center">
            <span>Total Article: {filteredArticles.length}</span>
          </div>

          <div className="px-4 py-4 border-t flex items-center gap-4">
            <select
              className="border rounded p-2 text-black"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <div className="flex items-center border rounded px-2 text-gray-400">
              <SearchIcon size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search by title "
                className="outline-none p-1 text-gray-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="ml-auto">
              <Link
                href="/admin/add-article"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                + Add Article
              </Link>
            </div>
          </div>

          <table className="border-t w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-black">
                <th className="p-2 text-center">Thumbnail</th>
                <th className="p-2 text-center">Title</th>
                <th className="p-2 text-center">Category</th>
                <th className="p-2 text-center">Created at</th>
                <th className="p-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedArticles.map((article) => (
                <tr
                  key={article.id}
                  className="border-t text-gray-300 text-center align-middle"
                >
                  <td className="p-2 flex justify-center items-center">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="p-2 max-w-[200px] truncate whitespace-nowrap text-gray-500">
                    {article.title}
                  </td>
                  <td className="p-2 text-gray-500">
                    {article.category?.name}
                  </td>
                  <td className="p-2 text-gray-500">
                    {new Date(article.createdAt).toLocaleString("en-US", {
                      month: "long",
                      day: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="p-2 space-x-2">
                    <Link
                      href={`/articles/${article.id}`}
                      className="text-blue-500 underline"
                    >
                      Preview
                    </Link>
                    <Link
                      href={`/admin/edit-article/${article.id}`}
                      className="text-blue-500 underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(article.id)}
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

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center fixed inset-0 bg-black/20 backdrop-blur-sm z-40">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Delete Article
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Deleting this article is permanent and cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
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
