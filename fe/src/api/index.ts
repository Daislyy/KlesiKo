import { api } from "./client";
import {
  mapBook,
  mapCategory,
  mapLoan,
  mapMember,
  mapReview,
  mapUser,
  toBookPayload,
  type ApiBook,
  type ApiBorrowing,
  type ApiCategory,
  type ApiRating,
  type ApiUser,
} from "./mappers";
import type { BookFormData, BorrowStatus, PageMeta, User } from "@/types/library";

export { getSession, saveSession, clearSession } from "./client";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PageMeta;
}

export interface BookQuery {
  search?: string;
  categoryId?: string;
  available?: boolean;
  sort?: "rating";
  page?: number;
  limit?: number;
}

export interface RegisterInput {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

function toQueryString(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") query.set(key, String(value));
  }
  const text = query.toString();
  return text ? `?${text}` : "";
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Gagal membaca file gambar."));
    reader.readAsDataURL(file);
  });
}

// ---------- AUTH ----------
export const authApi = {
  async login(identifier: string, password: string): Promise<User> {
    const res = await api.post<ApiResponse<{ user: ApiUser; token: string }>>("/auth/login", {
      identifier,
      password,
    });
    return { ...mapUser(res.data.user), token: res.data.token };
  },

  async register(input: RegisterInput): Promise<User> {
    const res = await api.post<ApiResponse<{ user: ApiUser; token: string }>>("/auth/register", {
      full_name: input.fullName,
      username: input.username,
      email: input.email,
      password: input.password,
    });
    return { ...mapUser(res.data.user), token: res.data.token };
  },

  async me(): Promise<User> {
    const res = await api.get<ApiResponse<ApiUser>>("/auth/me");
    return mapUser(res.data);
  },
};

// ---------- BUKU ----------
export const bookApi = {
  async list(query: BookQuery = {}) {
    const qs = toQueryString({
      search: query.search,
      category_id: query.categoryId,
      available: query.available ? "true" : undefined,
      sort: query.sort,
      page: query.page,
      limit: query.limit,
    });
    const res = await api.get<ApiResponse<ApiBook[]>>(`/books${qs}`);
    const meta: PageMeta = res.meta ?? {
      page: 1,
      limit: res.data.length,
      total: res.data.length,
      total_pages: 1,
    };
    return { books: res.data.map(mapBook), meta };
  },

  async getById(id: string) {
    const res = await api.get<ApiResponse<ApiBook>>(`/books/${id}`);
    return mapBook(res.data);
  },

  create: (form: BookFormData) => api.post("/books", toBookPayload(form)),
  update: (id: string, form: BookFormData) => api.put(`/books/${id}`, toBookPayload(form)),
  remove: (id: string) => api.delete(`/books/${id}`),
};

// ---------- KATEGORI ----------
export const categoryApi = {
  async list() {
    const res = await api.get<ApiResponse<ApiCategory[]>>("/categories");
    return res.data.map(mapCategory);
  },
  create: (name: string, description: string) =>
    api.post("/categories", { name, description: description || null }),
  remove: (id: string) => api.delete(`/categories/${id}`),
};

// ---------- PEMINJAMAN ----------
export const borrowingApi = {
  create: (bookId: string) => api.post("/borrowings", { book_id: bookId, quantity: 1 }),
  async mine() {
    const res = await api.get<ApiResponse<ApiBorrowing[]>>("/borrowings/my");
    return res.data.map(mapLoan);
  },
  async all() {
    const res = await api.get<ApiResponse<ApiBorrowing[]>>("/borrowings");
    return res.data.map(mapLoan);
  },
  updateStatus: (id: string, status: BorrowStatus) =>
    api.patch(`/borrowings/${id}/status`, { status }),
};

// ---------- FAVORIT / WISHLIST ----------
export const favoriteApi = {
  async list() {
    const res = await api.get<ApiResponse<ApiBook[]>>("/favorites");
    return res.data.map(mapBook);
  },
  add: (bookId: string) => api.post(`/favorites/${bookId}`),
  remove: (bookId: string) => api.delete(`/favorites/${bookId}`),
};

// ---------- RATING & REVIEW ----------
export const ratingApi = {
  async listByBook(bookId: string) {
    const res = await api.get<ApiResponse<ApiRating[]>>(`/books/${bookId}/ratings`);
    return res.data.map(mapReview);
  },
  upsert: (bookId: string, rating: number, review: string) =>
    api.post(`/books/${bookId}/ratings`, { rating, review: review.trim() || null }),
  remove: (ratingId: string) => api.delete(`/ratings/${ratingId}`),
};

// ---------- ANGGOTA (admin) ----------
export const userApi = {
  async list() {
    const res = await api.get<ApiResponse<ApiUser[]>>("/users");
    return res.data.map(mapMember);
  },
  setActive: (id: string, isActive: boolean) => api.put(`/users/${id}`, { is_active: isActive }),
};

// ---------- UPLOAD COVER (admin) ----------
export const uploadApi = {
  async cover(file: File): Promise<string> {
    const dataUrl = await readFileAsDataUrl(file);
    const res = await api.post<ApiResponse<{ url: string }>>("/uploads/cover", { data: dataUrl });
    return res.data.url;
  },
};
