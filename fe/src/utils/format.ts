// Helper format tanggal & angka untuk tampilan.

const LOAN_DAYS = 7; // sama dengan default masa pinjam di backend

export function formatDate(value: string | Date | null | undefined) {
  if (!value) return "-";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export function estimateReturnDate(from: Date) {
  return new Date(from.getTime() + LOAN_DAYS * 24 * 60 * 60 * 1000);
}

export { LOAN_DAYS };
