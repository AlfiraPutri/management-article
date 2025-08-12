import Header from "@/components/user/header";
import { notFound } from "next/navigation";
import { Article } from "@/types";
import Link from "next/link";
import Footer from "@/components/user/footer";

async function getArticle(id: string): Promise<Article | null> {
  try {
    const res = await fetch(
      `https://test-fe.mysellerpintar.com/api/articles/${id}`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getOtherArticles(
  categoryId: string,
  excludeId: string
): Promise<Article[]> {
  try {
    const res = await fetch(
      `https://test-fe.mysellerpintar.com/api/articles?categoryId=${categoryId}`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) return [];

    const result = await res.json();
    const allArticles: Article[] = result.data || [];
    return allArticles.filter((a) => a.id !== excludeId).slice(0, 3);
  } catch (error) {
    console.error(error);
    return [];
  }
}

interface ArticleDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) {
    notFound();
  }
  const otherArticles = await getOtherArticles(article.category.id, article.id);

  return (
    <div className="relative bg-gray-50 flex-1">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-gray-700 mb-2  text-center">
          {new Date(article.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          • Created by {article.user.username}
        </p>
        <h1 className="text-black text-3xl font-bold mb-4 text-center">
          {article.title}
        </h1>
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full rounded-lg mb-6"
        />
        <div
          className="text-gray-700 prose max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {otherArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-black text-2xl font-bold mb-6">
              Other articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherArticles.map((oa) => (
                <Link href={`/articles/${oa.id}`} key={oa.id}>
                  <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer">
                    <img
                      src={oa.imageUrl}
                      alt={oa.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <p className="text-sm text-gray-500 mb-2">
                        {new Date(oa.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <h3 className="text-lg font-bold text-black line-clamp-2">
                        {oa.title}
                      </h3>
                      <div className="flex gap-2 flex-wrap">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {article.category.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
