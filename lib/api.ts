import type { Post } from "@/types/post";

export const API_BASE = "https://dev.codeleap.co.uk/careers/";

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/** Ensures URL has trailing slash (required by Django). */
function ensureTrailingSlash(url: string): string {
  return url.endsWith("/") ? url : `${url}/`;
}

/** Fetches all posts from the server (all users). No username filter – list shows every candidate's posts. */
export async function fetchPosts(pageUrl?: string | null): Promise<PaginatedResponse<Post>> {
  const url = pageUrl ? ensureTrailingSlash(pageUrl) : API_BASE;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function createPost(username: string, title: string, content: string): Promise<Post> {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, title, content }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to create post");
  }
  return res.json();
}

export async function updatePost(id: number, title: string, content: string): Promise<Post> {
  const res = await fetch(`${API_BASE}${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });
  if (!res.ok) throw new Error("Failed to update post");
  return res.json();
}

export async function deletePost(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}${id}/`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete post");
}
