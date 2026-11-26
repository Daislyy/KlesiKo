"use client";

import { useState } from "react";
import { UserHomePage } from "@/user/UserHomePage";
import { UserAuthPage, type AuthMode } from "@/user/UserAuthPage";
import { UserBookDetailPage } from "@/user/UserBookDetailPage";
import { UserDashboardView } from "@/user/dashboard/UserDashboard";
import { AdminDashboardPage } from "@/admin/AdminDashboardPage";
import { BorrowConfirmModal } from "@/components/BorrowConfirmModal";
import { bookApi, borrowingApi, categoryApi, favoriteApi } from "@/api";
import { useFetch } from "@/hooks/useFetch";
import { useAuth } from "@/context/AuthContext";
import type { BookItem, PageMeta, User } from "@/types/library";

const CATALOG_PAGE_SIZE = 12;

type ActiveView = "user" | "auth" | "book-detail" | "admin" | "user-dashboard";

export function LandingPage() {
  const { user } = useAuth();

  // Navigasi halaman utama (semua tampilan berupa halaman penuh, kecuali modal konfirmasi pinjam)
  const [currentView, setCurrentView] = useState<ActiveView>("user");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [feedback, setFeedback] = useState("");

  // State filter katalog yang dikirim ke API backend
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [page, setPage] = useState(1);

  // Buku yang sedang dikonfirmasi di modal peminjaman (PRD Section 7 Step 2)
  const [confirmingBook, setConfirmingBook] = useState<BookItem | null>(null);
  const [borrowingSubmitting, setBorrowingSubmitting] = useState(false);

  // 1. Ambil buku unggulan & kategori dari MySQL
  const overviewQuery = useFetch(async () => {
    const [featuredRes, categories] = await Promise.all([
      bookApi.list({ limit: 8 }),
      categoryApi.list(),
    ]);
    return { featuredBooks: featuredRes.books, categories };
  }, "public-overview");

  // 2. Ambil daftar katalog sesuai search, filter kategori, ketersediaan, dan halaman
  const catalogKey = `catalog:${search}:${selectedCategoryId}:${onlyAvailable}:${page}`;
  const catalogQuery = useFetch(
    () =>
      bookApi.list({
        search: search.trim() || undefined,
        categoryId: selectedCategoryId || undefined,
        available: onlyAvailable,
        page,
        limit: CATALOG_PAGE_SIZE,
      }),
    catalogKey
  );

  // 3. Ambil riwayat peminjaman & daftar wishlist/favorit user yang sedang login
  const loansQuery = useFetch(
    () => (user ? borrowingApi.mine() : Promise.resolve([])),
    `my-loans:${user?.id || "guest"}`
  );

  const favoritesQuery = useFetch(
    () => (user ? favoriteApi.list() : Promise.resolve([])),
    `my-favorites:${user?.id || "guest"}`
  );

  const favorites = favoritesQuery.data ?? [];

  const reloadAll = () => {
    overviewQuery.reload();
    catalogQuery.reload();
    loansQuery.reload();
    favoritesQuery.reload();
  };

  const openAuthPage = (mode: AuthMode = "login") => {
    setAuthMode(mode);
    setCurrentView("auth");
  };

  const openBookDetailPage = (book: BookItem) => {
    setSelectedBook(book);
    setCurrentView("book-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Refresh data satu buku ketika ulasan baru ditambahkan
  const handleRefreshSelectedBook = async () => {
    reloadAll();
    if (!selectedBook) return;
    try {
      const fresh = await bookApi.getById(selectedBook.id);
      setSelectedBook(fresh);
    } catch {
      // Abaikan jika gagal refresh
    }
  };

  // Klik tombol "Borrow / Pinjam Buku": jika belum login arahkan ke halaman login
  const handleStartBorrow = (book: BookItem) => {
    if (!user) {
      openAuthPage("login");
      return;
    }
    setConfirmingBook(book);
  };

  // Konfirmasi peminjaman -> kirim POST /api/borrowings (status awal: pending)
  const handleConfirmBorrow = async (book: BookItem) => {
    setBorrowingSubmitting(true);
    try {
      await borrowingApi.create(book.id);
      setConfirmingBook(null);
      setCurrentView("user");
      setFeedback(
        `Permintaan peminjaman buku "${book.title}" berhasil diajukan (status: Pending) dan menunggu persetujuan admin.`
      );
      reloadAll();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Gagal mengajukan peminjaman.");
    } finally {
      setBorrowingSubmitting(false);
    }
  };

  // Tambah / hapus wishlist (favorites) di database
  const handleToggleFavorite = async (book: BookItem) => {
    const exists = favorites.some((f) => f.id === book.id);
    try {
      if (exists) {
        await favoriteApi.remove(book.id);
      } else {
        await favoriteApi.add(book.id);
      }
      favoritesQuery.reload();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Gagal memperbarui wishlist.");
    }
  };

  const handleCancelLoan = async (loanId: string) => {
    try {
      await borrowingApi.updateStatus(loanId, "cancelled");
      setFeedback("Permintaan peminjaman berhasil dibatalkan.");
      reloadAll();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Gagal membatalkan peminjaman.");
    }
  };

  // Setelah login/register berhasil: arahkan otomatis sesuai role dari database
  const handleAuthSuccess = (loggedUser: User) => {
    if (loggedUser.role === "admin") {
      setCurrentView("admin");
    } else {
      setCurrentView("user");
      setFeedback(`Selamat datang, ${loggedUser.fullName || loggedUser.username}.`);
    }
  };

  // 1. Halaman Login / Register Split-Screen (bukan modal)
  if (currentView === "auth") {
    return (
      <UserAuthPage
        initialMode={authMode}
        onBack={() => setCurrentView("user")}
        onSuccess={handleAuthSuccess}
      />
    );
  }

  // 2. Halaman Detail Buku Penuh
  if (currentView === "book-detail" && selectedBook) {
    const isFav = favorites.some((f) => f.id === selectedBook.id);
    return (
      <>
        <UserBookDetailPage
          book={selectedBook}
          user={user}
          isFavorite={isFav}
          onBack={() => setCurrentView("user")}
          onBorrow={handleStartBorrow}
          onToggleFavorite={handleToggleFavorite}
          onRequireLogin={() => openAuthPage("login")}
          onBookUpdated={handleRefreshSelectedBook}
        />

        <BorrowConfirmModal
          book={confirmingBook}
          submitting={borrowingSubmitting}
          onClose={() => setConfirmingBook(null)}
          onConfirm={handleConfirmBorrow}
        />
      </>
    );
  }

  // 3. Halaman Dashboard Admin
  if (currentView === "admin" && user?.role === "admin") {
    return (
      <AdminDashboardPage
        onBackToUser={() => {
          reloadAll();
          setCurrentView("user");
        }}
      />
    );
  }

  // 4. Halaman Dashboard Anggota
  if (currentView === "user-dashboard" && user) {
    return (
      <UserDashboardView
        loans={loansQuery.data ?? []}
        favorites={favorites}
        onCancelLoan={handleCancelLoan}
        onSelectBookDetail={openBookDetailPage}
        onRemoveFavorite={handleToggleFavorite}
        onBackToHome={() => setCurrentView("user")}
      />
    );
  }

  const defaultMeta: PageMeta = {
    page,
    limit: CATALOG_PAGE_SIZE,
    total: 0,
    total_pages: 1,
  };

  // 5. Halaman Utama (Public Landing Page & User Homepage)
  return (
    <>
      <UserHomePage
        user={user}
        featuredBooks={overviewQuery.data?.featuredBooks ?? []}
        catalogBooks={catalogQuery.data?.books ?? []}
        catalogMeta={catalogQuery.data?.meta ?? defaultMeta}
        catalogLoading={catalogQuery.loading}
        categories={overviewQuery.data?.categories ?? []}
        loans={loansQuery.data ?? []}
        search={search}
        selectedCategoryId={selectedCategoryId}
        onlyAvailable={onlyAvailable}
        feedback={feedback || catalogQuery.error}
        onChangeSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onChangeCategory={(catId) => {
          setSelectedCategoryId(catId);
          setPage(1);
        }}
        onToggleAvailable={() => {
          setOnlyAvailable((prev) => !prev);
          setPage(1);
        }}
        onChangePage={setPage}
        onResetFilter={() => {
          setSearch("");
          setSelectedCategoryId("");
          setOnlyAvailable(false);
          setPage(1);
        }}
        onClearFeedback={() => setFeedback("")}
        onBorrowBook={handleStartBorrow}
        onSelectBookDetail={openBookDetailPage}
        onCancelLoan={handleCancelLoan}
        onOpenAuth={openAuthPage}
        onNavigateAdmin={() => {
          if (!user || user.role !== "admin") {
            openAuthPage("login");
            return;
          }
          setCurrentView("admin");
        }}
        onNavigateUserDashboard={() => {
          if (!user) {
            openAuthPage("login");
            return;
          }
          setCurrentView("user-dashboard");
        }}
      />

      <BorrowConfirmModal
        book={confirmingBook}
        submitting={borrowingSubmitting}
        onClose={() => setConfirmingBook(null)}
        onConfirm={handleConfirmBorrow}
      />
    </>
  );
}
