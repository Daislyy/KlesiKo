"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Hook sederhana untuk mengambil data dari API.
 *
 * - `load`  : fungsi yang mengembalikan Promise data.
 * - `key`   : string penanda; jika berubah, data diambil ulang (misal: filter pencarian).
 *
 * Mengembalikan { data, loading, error, reload }.
 */
export function useFetch<T>(load: () => Promise<T>, key: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  // Simpan fungsi load terbaru tanpa memicu fetch ulang setiap render.
  const loadRef = useRef(load);
  useEffect(() => {
    loadRef.current = load;
  });

  useEffect(() => {
    let active = true;

    loadRef.current()
      .then((result) => {
        if (!active) return;
        setData(result);
        setError("");
      })
      .catch((err: Error) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [key, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  return { data, loading, error, reload };
}
