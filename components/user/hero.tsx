"use client";
import { Category } from "@/types";
import React from "react";

interface HeroProps {
  categories: Category[];
  category: string;
  search: string;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Hero({
  categories,
  category,
  search,
  onCategoryChange,
  onSearchChange,
}: HeroProps) {
  return (
    <section className="relative  flex flex-col items-center justify-center text-center min-h-[60vh] px-4">
      <p className="mb-2 text-sm font-medium">Blog genzet</p>
      <h2 className="text-3xl md:text-4xl font-bold leading-snug mb-3">
        The Journal : Design Resources, <br />
        Interviews, and Industry News
      </h2>
      <p className="text-lg text-blue-100 mb-6">
        Your daily dose of design insights!
      </p>
      <div className="bg-blue-400 px-3 py-3 rounded">
        <div className="flex items-center gap-3 w-full max-w-xl">
          <select
            value={category}
            onChange={onCategoryChange}
            className="p-3 w-48 text-gray-700 outline-none bg-white rounded-lg shadow"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={search}
            onChange={onSearchChange}
            placeholder="Search articles"
            className="px-4 py-3 flex-1 text-gray-700 focus:outline-none bg-white rounded-lg shadow"
          />
        </div>
      </div>
    </section>
  );
}
