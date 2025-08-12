"use client";

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
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import Profile from "@/components/admin/profile";
import { Category } from "@/types";

interface ArticleFormInput {
  title: string;
  categoryId: string;
  content: string;
  imageUrl?: string | null;
}

export default function AddArticlePage() {
  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    getValues,
  } = useForm<ArticleFormInput>();

  const [categories, setCategories] = useState<Category[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeCmd, setActiveCmd] = useState("");
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const editorImageInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetch("https://test-fe.mysellerpintar.com/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.data || []))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch("https://test-fe.mysellerpintar.com/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.data || []);

        const saved = localStorage.getItem("draftArticle");
        if (saved) {
          const draft = JSON.parse(saved);
          setValue("title", draft.title || "");
          setValue("content", draft.content || "");
          setValue("categoryId", draft.categoryId || "");
          setValue("imageUrl", draft.imageUrl || "");

          if (contentRef.current) {
            contentRef.current.innerHTML = draft.content || "";
          }
        }
      })
      .catch((err) => console.error(err));
  }, [setValue]);

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  const onSubmit = async (data: ArticleFormInput) => {
    const payload = {
      title: data.title,
      content: data.content,
      categoryId: data.categoryId,
      imageUrl: data.imageUrl || null,
    };

    try {
      const res = await fetch(
        "https://test-fe.mysellerpintar.com/api/articles",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        console.error(errData);
        setMessage({
          type: "error",
          text: errData.message || "Gagal menambahkan artikel",
        });
        return;
      }

      setMessage({ type: "success", text: "Artikel berhasil ditambahkan" });
      localStorage.removeItem("draftArticle");
      setTimeout(() => {
        router.push("/admin");
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: "Terjadi kesalahan saat mengunggah artikel",
      });
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-5 bg-gray-50 ml-64">
        <Profile />
        {message && (
          <div
            className={`p-3 mb-4 rounded ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
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
              Create Articles
            </span>
          </Link>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block font-medium mb-2 text-black">
                Thumbnails
              </label>
              <label className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                <ImageIcon size={40} className="text-gray-400 mb-2" />
                <span className="text-gray-500 text-sm">
                  Click to select file
                </span>
                <span className="text-gray-400 text-xs">
                  Support file type: jpg or png
                </span>
                <input
                  type="file"
                  accept="image/*"
                  ref={thumbnailInputRef}
                  onChange={handleThumbnailSelect}
                  className="hidden"
                />
              </label>
              <input type="hidden" {...register("imageUrl")} />
            </div>

            <div>
              <label className="block font-medium mb-2 text-black">Title</label>
              <input
                type="text"
                placeholder="Input title"
                {...register("title", { required: "Please enter title" })}
                className="border rounded w-full p-2 text-gray-700"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block font-medium mb-2 text-black">
                Category
              </label>
              <select
                {...register("categoryId", {
                  required: "Please select category",
                })}
                className="border rounded w-full p-2 text-gray-700"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.categoryId.message}
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
                      ></div>
                      <div className="text-sm text-gray-500">
                        {wordCount} Words
                      </div>
                      <input
                        type="hidden"
                        {...register("content", {
                          required: "Please enter content",
                        })}
                      />
                      {errors.content && (
                        <p className="text-red-500 text-sm mt-1">
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
                className="border px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 text-white"
                onClick={() => {
                  const formData = getValues();
                  localStorage.setItem(
                    "draftArticle",
                    JSON.stringify(formData)
                  );
                  router.push(
                    `/admin/articles/?title=${encodeURIComponent(
                      getValues("title")
                    )}&content=${encodeURIComponent(getValues("content"))}`
                  );
                }}
              >
                Preview
              </button>

              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Upload
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
