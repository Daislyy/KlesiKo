export type UserRole = "admin" | "user";

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: UserRole;
  token?: string;
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  categoryId: string | null;
  category: string | null;
  genres: string[];
  publisher: string | null;
  isbn: string | null;
  publishedYear: number | null;
  totalPages: number | null;
  description: string | null;
  coverImageUrl: string | null;
  stock: number;
  availableStock: number;
  averageRating: number;
  totalRatings: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  description: string | null;
  totalBooks: number;
}

export type BorrowStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "borrowed"
  | "returned"
  | "overdue"
  | "cancelled";

export interface LoanBook {
  bookId: string;
  title: string;
  author: string;
  coverImageUrl: string | null;
  quantity: number;
}

export interface LoanItem {
  id: string;
  code: string;
  userId: string;
  borrowerName: string;
  borrowerEmail: string;
  books: LoanBook[];
  borrowedAt: string;
  dueDate: string;
  returnedAt: string | null;
  status: BorrowStatus;
}

export interface MemberItem {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface BookReview {
  id: string;
  userId: string;
  bookId: string;
  fullName: string;
  username: string;
  rating: number;
  review: string | null;
  createdAt: string;
}

// Nilai form disimpan sebagai string agar mudah di-bind ke <input>.
export interface BookFormData {
  title: string;
  author: string;
  categoryId: string;
  publisher: string;
  isbn: string;
  publishedYear: string;
  totalPages: string;
  description: string;
  coverImageUrl: string;
  stock: string;
}
