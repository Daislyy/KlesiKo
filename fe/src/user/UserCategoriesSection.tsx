"use client";

import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import type { CategoryItem } from "@/types/library";

interface UserCategoriesSectionProps {
  categories: CategoryItem[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

// Sesuai PRD Section 3D: Menampilkan kategori dari database; ketika diklik, filter katalog.
export function UserCategoriesSection({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: UserCategoriesSectionProps) {
  if (categories.length === 0) return null;

  return (
    <motion.section
      id="kategori"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b-4 border-black pb-3">
        <div>
          <span className="bg-black text-white text-xs font-black uppercase px-2 py-0.5">
            Klasifikasi Koleksi
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mt-1">
            Kategori Buku
          </h2>
        </div>
        <p className="text-xs font-bold text-neutral-600">
          Klik salah satu kategori untuk menyaring daftar buku di katalog.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((cat, idx) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <motion.button
              key={cat.id}
              type="button"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
              whileHover={{ y: -3 }}
              onClick={() => onSelectCategory(isSelected ? "" : cat.id)}
              className={`neo-card p-4 text-left cursor-pointer flex flex-col justify-between gap-3 transition-colors ${
                isSelected ? "bg-[#FFE814]" : "bg-white hover:bg-[#FFFDF9]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="w-8 h-8 border-2 border-black bg-neutral-100 flex items-center justify-center">
                    <Layers size={15} strokeWidth={2.6} />
                  </span>
                  <span className="text-[11px] font-black uppercase bg-black text-white px-2 py-0.5">
                    {cat.totalBooks} Buku
                  </span>
                </div>
                <h3 className="text-base font-black uppercase tracking-tight mt-3">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-xs font-medium text-neutral-600 line-clamp-2 mt-1">
                    {cat.description}
                  </p>
                )}
              </div>

              <span className="text-[11px] font-black uppercase underline">
                {isSelected ? "Filter Aktif" : "Lihat Kategori →"}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
}
