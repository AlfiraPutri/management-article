"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  Image as ImageIcon,
  Undo2,
  Redo2,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/admin/Sidebar";
import Profile from "@/components/admin/profile";
import { Article, Category } from "@/types";

export default function EditArticlePage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const [activeCmd, setActiveCmd] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    trigger,
    watch,
    getValues,
    formState: { errors },
  } = useForm<Article>();

  const imageUrlValue = watch("imageUrl");
  const contentRef = useRef<HTMLDivElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const editorImageInputRef = useRef<HTMLInputElement>(null);
  const token = localStorage.getItem("token");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetch("https://test-fe.mysellerpintar.com/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.data || []))
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  useEffect(() => {
    if (!id || categories.length === 0) {
      if (categories.length > 0) setLoading(false);
      return;
    }

    fetch(`https://test-fe.mysellerpintar.com/api/articles/${id}`)
      .then((res) => res.json())
      .then((data) => {
        reset({
          title: data.title,
          category: data.category?.id,
          content: data.content,
          imageUrl: data.imageUrl,
        });
        if (contentRef.current)
          contentRef.current.innerHTML = data.content || "";

        setWordCount(
          (data.content || "")
            .replace(/<[^>]+>/g, "")
            .trim()
            .split(/\s+/)
            .filter(Boolean).length
        );
      })
      .catch((err) => console.error("Failed to fetch article:", err))
      .finally(() => setLoading(false));
  }, [id, reset, categories]);

  const execCommand = (command: string) => {
    if (command === "insertImage") {
      editorImageInputRef.current?.click();
      return;
    }
    if (contentRef.current) {
      contentRef.current.focus();
      document.execCommand(command, false);
      setActiveCmd(command);
      setValue("content", contentRef.current.innerHTML);
    }
  };

  const handleThumbnailSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("https://test-fe.mysellerpintar.com/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload gagal");
      const { url } = await res.json();
      setValue("imageUrl", url, { shouldValidate: true });
      trigger("imageUrl");
    } catch (err) {
      console.error(err);
      alert("Gagal upload thumbnail");
    }
  };

  const handleEditorImageSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("https://test-fe.mysellerpintar.com/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload gagal");
      const { url } = await res.json();
      if (contentRef.current) {
        contentRef.current.focus();
        document.execCommand("insertImage", false, url);
        setValue("content", contentRef.current.innerHTML);
      }
    } catch (err) {
      console.error(err);
      alert("Gagal upload gambar ke editor");
    }
  };

  const onSubmit = async (data: Article) => {
    if (contentRef.current) {
      data.content = contentRef.current.innerHTML;
    }

    try {
      const res = await fetch(
        `https://test-fe.mysellerpintar.com/api/articles/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: data.title,
            content: data.content,
            categoryId: data.category || null,
            imageUrl: data.imageUrl || null,
          }),
        }
      );
      if (!res.ok) throw new Error("Gagal update");
      setMessage({ type: "success", text: "Article updated successfully!" });
      localStorage.removeItem("draftArticle");
      setTimeout(() => setMessage(null), 3000);
      router.push("/admin");
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to update article" });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handlePreview = () => {
    const draft = {
      title: watch("title"),
      category: watch("category"),
      content: contentRef.current?.innerHTML || "",
      imageUrl: watch("imageUrl"),
    };
    localStorage.setItem("draftArticle", JSON.stringify(draft));
    router.push(
      `/admin/articles/?title=${encodeURIComponent(
        getValues("title")
      )}&content=${encodeURIComponent(getValues("content"))}`
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-5 bg-gray-50 ml-64">
        <Profile />
        {message && (
          <div
            className={`p-3 mb-4 rounded ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="mt-4 bg-white shadow-md rounded-lg border p-6">
          <Link
            href="/admin"
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-lg font-semibold text-black">
              Edit Articles
            </span>
          </Link>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block font-medium mb-2 text-black">
                Thumbnails
              </label>
              <div className="border rounded-lg p-4 inline-block">
                <div className="w-40 h-30 rounded">
                  <label className="w-40 h-30 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                    {imageUrlValue ? (
                      <img
                        src={imageUrlValue}
                        alt="Thumbnail"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <>
                        <ImageIcon size={40} className="text-gray-400 mb-2" />
                        <span className="text-gray-500 text-sm">
                          Click to select file
                        </span>
                        <span className="text-gray-400 text-xs">
                          Support file type: jpg or png
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      ref={thumbnailInputRef}
                      onChange={handleThumbnailSelect}
                      className="hidden"
                    />
                  </label>
                </div>
                <input type="hidden" {...register("imageUrl")} />
                {errors.imageUrl && (
                  <p className="text-red-500 text-sm">
                    {errors.imageUrl.message}
                  </p>
                )}

                <div className="mt-1 flex gap-2">
                  <span className="text-sm underline text-blue-500 cursor-pointer p-2 rounded hover:bg-blue-100">
                    Changes
                  </span>
                  <span className="text-sm underline text-red-500 cursor-pointer p-2 rounded hover:bg-red-100">
                    Delete
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2 text-black">Title</label>
              <input
                type="text"
                {...register("title")}
                className="border rounded w-full p-2 text-gray-700"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block font-medium mb-2 text-black">
                Category
              </label>
              <select
                {...register("category")}
                className="border rounded w-full p-2 text-gray-700"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <table className="w-full border border-gray-300 rounded">
                <tbody>
                  <tr className="border-b border-gray-300">
                    <td className="p-2">
                      <div className="flex gap-2 text-black">
                        {[
                          { cmd: "undo", icon: <Undo2 size={16} /> },
                          { cmd: "redo", icon: <Redo2 size={16} /> },
                          { cmd: "bold", icon: <Bold size={16} /> },
                          { cmd: "italic", icon: <Italic size={16} /> },
                          { cmd: "insertImage", icon: <ImageIcon size={16} /> },
                          { cmd: "justifyLeft", icon: <AlignLeft size={16} /> },
                          {
                            cmd: "justifyCenter",
                            icon: <AlignCenter size={16} />,
                          },
                          {
                            cmd: "justifyRight",
                            icon: <AlignRight size={16} />,
                          },
                        ].map((btn, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => execCommand(btn.cmd)}
                            className={`p-1 border rounded hover:bg-gray-100 ${
                              activeCmd === btn.cmd
                                ? "bg-blue-500 text-white"
                                : ""
                            }`}
                          >
                            {btn.icon}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2">
                      <div
                        ref={contentRef}
                        contentEditable
                        className="border rounded w-full p-2 min-h-[150px] focus:outline-none text-black"
                        onInput={(e) => {
                          const html = (e.target as HTMLDivElement).innerHTML;
                          setValue("content", html);
                          setWordCount(
                            html
                              .replace(/<[^>]+>/g, "")
                              .trim()
                              .split(/\s+/)
                              .filter(Boolean).length
                          );
                        }}
                      />
                      <div className="text-sm text-gray-500">
                        {wordCount} Words
                      </div>
                      <input type="hidden" {...register("content")} />
                      {errors.content && (
                        <p className="text-red-500 text-sm">
                          {errors.content.message}
                        </p>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
              <input
                type="file"
                accept="image/*"
                ref={editorImageInputRef}
                onChange={handleEditorImageSelect}
                className="hidden"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.push("/admin")}
                className="border px-4 py-2 rounded hover:bg-gray-100 text-gray-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePreview}
                className="border px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 text-white"
              >
                Preview
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
