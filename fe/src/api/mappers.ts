// Mengubah format data dari backend (snake_case) ke format frontend (camelCase).
import type {
  BookFormData,
  BookItem,
  BookReview,
  BorrowStatus,
  CategoryItem,
  LoanItem,
  MemberItem,
  User,
  UserRole,
} from "@/types/library";

export interface ApiUser {
  id: string;
  full_name: string;
  username: string;
  email: string;
  role: UserRole;
  is_active?: number | boolean;
  created_at?: string;
}

export interface ApiBook {
  id: string;
  title: string;
  author: string;
  category_id: string | null;
  category_name: string | null;
  publisher: string | null;
  isbn: string | null;
  published_year: number | null;
  total_pages: number | null;
  description: string | null;
  cover_image_url: string | null;
  stock: number;
  available_stock: number;
  average_rating: number;
  total_ratings: number;
  genres?: { id: string; name: string }[];
}

export interface ApiCategory {
  id: string;
  name: string;
  description: string | null;
  total_books?: number;
}

export interface ApiBorrowing {
  id: string;
  borrowing_code: string;
  user_id: string;
  borrower_name: string;
  borrower_email: string;
  borrowing_date: string;
  due_date: string;
  returned_at: string | null;
  status: BorrowStatus;
  items: {
    book_id: string;
    title: string;
    author: string;
    cover_image_url: string | null;
    quantity: number;
  }[];
}

export const mapUser = (row: ApiUser): User => ({
  id: row.id,
  fullName: row.full_name,
  username: row.username,
  email: row.email,
  role: row.role,
});

export const mapMember = (row: ApiUser): MemberItem => ({
  ...mapUser(row),
  isActive: Boolean(row.is_active),
  createdAt: row.created_at || "",
});

export const mapBook = (row: ApiBook): BookItem => ({
  id: row.id,
  title: row.title,
  author: row.author,
  categoryId: row.category_id,
  category: row.category_name,
  genres: (row.genres || []).map((g) => g.name),
  publisher: row.publisher,
  isbn: row.isbn,
  publishedYear: row.published_year,
  totalPages: row.total_pages,
  description: row.description,
  coverImageUrl: row.cover_image_url,
  stock: Number(row.stock),
  availableStock: Number(row.available_stock),
  averageRating: Number(row.average_rating || 0),
  totalRatings: Number(row.total_ratings || 0),
});

export const mapCategory = (row: ApiCategory): CategoryItem => ({
  id: row.id,
  name: row.name,
  description: row.description,
  totalBooks: Number(row.total_books || 0),
});

export const mapLoan = (row: ApiBorrowing): LoanItem => ({
  id: row.id,
  code: row.borrowing_code,
  userId: row.user_id,
  borrowerName: row.borrower_name,
  borrowerEmail: row.borrower_email,
  books: row.items.map((item) => ({
    bookId: item.book_id,
    title: item.title,
    author: item.author,
    coverImageUrl: item.cover_image_url,
    quantity: item.quantity,
  })),
  borrowedAt: row.borrowing_date,
  dueDate: row.due_date,
  returnedAt: row.returned_at,
  status: row.status,
});

export interface ApiRating {
  id: string;
  user_id: string;
  book_id: string;
  full_name: string;
  username: string;
  rating: number;
  review: string | null;
  created_at: string;
}

export const mapReview = (row: ApiRating): BookReview => ({
  id: row.id,
  userId: row.user_id,
  bookId: row.book_id,
  fullName: row.full_name,
  username: row.username,
  rating: Number(row.rating),
  review: row.review,
  createdAt: row.created_at,
});

// Form buku -> body request backend. Field kosong dikirim sebagai null.
export const toBookPayload = (form: BookFormData) => ({
  title: form.title.trim(),
  author: form.author.trim(),
  category_id: form.categoryId || null,
  publisher: form.publisher.trim() || null,
  isbn: form.isbn.trim() || null,
  published_year: form.publishedYear ? Number(form.publishedYear) : null,
  total_pages: form.totalPages ? Number(form.totalPages) : null,
  description: form.description.trim() || null,
  cover_image_url: form.coverImageUrl || null,
  stock: Number(form.stock),
});
