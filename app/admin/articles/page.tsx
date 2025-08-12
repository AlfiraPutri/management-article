"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/user/header";
import Footer from "@/components/user/footer";

function PreviewContent() {
  const params = useSearchParams();

  const title = params.get("title") ?? "";
  const content = params.get("content") ?? "";
  const imageUrl = params.get("imageUrl") ?? "";
  const categoryName = params.get("categoryName") ?? "Uncategorized";
  const createdAt = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="flex-1 pt-8 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <p className="text-gray-700 mb-2 text-center">
          {createdAt} • Preview Only
        </p>
        <h1 className="text-black text-3xl font-bold mb-6 text-center">
          {title}
        </h1>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className="w-full rounded-lg mb-6 object-cover"
          />
        )}
        <div
          className="text-gray-700 prose max-w-none leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </main>
  );
}

export default function PreviewArticlePage() {
  return (
    <div className="relative bg-gray-50 flex flex-col min-h-screen">
      <Header />
      <Suspense fallback={<div className="text-center py-8">Loading preview...</div>}>
        <PreviewContent />
      </Suspense>
      <Footer />
    </div>
  );
}
