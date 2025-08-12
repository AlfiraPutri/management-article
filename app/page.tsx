"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Article, Category } from "@/types";
import Header from "@/components/user/header";
import Hero from "@/components/user/hero";
import ArticleCard from "@/components/user/articleCard";
import Pagination from "@/components/user/pagination";
import Footer from "@/components/user/footer";

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);

  const fetchArticles = async (
    searchText = "",
    selectedCategory = "",
    page = 1
  ) => {
    try {
      const res = await axios.get(
        `https://test-fe.mysellerpintar.com/api/articles`,
        {
          params: {
            title: searchText,
            category: selectedCategory,
            page,
            limit: 9,
            sortBy: "createdAt",
            sortOrder: "desc",
          },
        }
      );
      setArticles(res.data.data || []);
      setTotalArticles(res.data.total ?? articles.length);
      setTotalPages(res.data.totalPages || Math.ceil(res.data.total / 9));
    } catch (err) {
      console.error("Gagal fetch artikel:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `https://test-fe.mysellerpintar.com/api/categories`
      );
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Gagal fetch kategori:", err);
    }
  };

  useEffect(() => {
    fetchArticles(search, category, currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setCurrentPage(1);
    fetchArticles(value, category, 1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    fetchArticles(search, e.target.value, 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/background.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-blue-700 opacity-80"></div>
        <Header />
        <Hero
          categories={categories}
          category={category}
          search={search}
          onCategoryChange={handleCategoryChange}
          onSearchChange={handleSearchChange}
        />
      </div>

      <main className="bg-gray-50 flex-1">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-4">
            <p className="text-gray-700 text-sm font-medium">
              Showing {articles.length} of {totalArticles} articles
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
