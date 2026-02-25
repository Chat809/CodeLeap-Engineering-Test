const LIKES_KEY = "codeleap-post-likes";
const COMMENTS_KEY = "codeleap-post-comments";
const COMMENT_LIKES_KEY = "codeleap-comment-likes";
const MEDIA_KEY = "codeleap-post-media";

export interface StoredComment {
  id: string;
  username: string;
  content: string;
  created_datetime: string;
  parentId?: string;
}

export type LikesMap = Record<number, string[]>;
export type CommentsMap = Record<number, StoredComment[]>;
export type MediaMap = Record<number, string>;

function getJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota or parse errors
  }
}

export function getLikes(): LikesMap {
  return getJson<LikesMap>(LIKES_KEY, {});
}

export function setLikes(map: LikesMap): void {
  setJson(LIKES_KEY, map);
}

export function toggleLike(postId: number, username: string): boolean {
  const map = getLikes();
  const list = map[postId] ?? [];
  const idx = list.indexOf(username);
  if (idx >= 0) {
    list.splice(idx, 1);
  } else {
    list.push(username);
  }
  if (list.length === 0) delete map[postId];
  else map[postId] = list;
  setLikes(map);
  return list.includes(username);
}

export function getComments(): CommentsMap {
  return getJson<CommentsMap>(COMMENTS_KEY, {});
}

export function setComments(map: CommentsMap): void {
  setJson(COMMENTS_KEY, map);
}

export function addComment(postId: number, comment: StoredComment): void {
  const map = getComments();
  const list = map[postId] ?? [];
  list.push(comment);
  map[postId] = list;
  setComments(map);
}

export type CommentLikesMap = Record<string, string[]>;

export function getCommentLikes(): CommentLikesMap {
  return getJson<CommentLikesMap>(COMMENT_LIKES_KEY, {});
}

export function toggleCommentLike(commentId: string, username: string): boolean {
  const map = getCommentLikes();
  const list = map[commentId] ?? [];
  const idx = list.indexOf(username);
  if (idx >= 0) {
    list.splice(idx, 1);
  } else {
    list.push(username);
  }
  if (list.length === 0) delete map[commentId];
  else map[commentId] = list;
  setJson(COMMENT_LIKES_KEY, map);
  return list.includes(username);
}

export function getMedia(): MediaMap {
  return getJson<MediaMap>(MEDIA_KEY, {});
}

export function setMediaForPost(postId: number, dataUrl: string | null): void {
  const map = getMedia();
  if (dataUrl) map[postId] = dataUrl;
  else delete map[postId];
  setJson(MEDIA_KEY, map);
}

export function setMediaMap(map: MediaMap): void {
  setJson(MEDIA_KEY, map);
}
