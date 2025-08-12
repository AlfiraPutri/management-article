import { notFound } from "next/navigation";

export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  createdAt: string;
  category: Category;
  user: {
    id: string;
    username: string;
  };
  imageUrl: string;
  content: string;
}
