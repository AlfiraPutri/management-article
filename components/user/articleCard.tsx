import { Article } from "@/types";
import Link from "next/link";

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/articles/${article.id}`}>
      <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <p className="text-sm text-gray-500 mb-2">
            {new Date(article.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h3 className="text-lg text-black font-bold mb-2 hover:underline cursor-pointer">
            {article.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2">
            {article.content.replace(/<[^>]+>/g, "")}
          </p>
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              {article.category.name}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
