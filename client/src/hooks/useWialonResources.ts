import { useEffect, useState } from "react";
import { fetchResources } from "../services/wialon";
import type { WialonResourceItem, WialonSearchResponse } from "../types/wialon";

export function useWialonResources() {
  const [data, setData] = useState<WialonSearchResponse | null>(null);
  const [items, setItems] = useState<WialonResourceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetchResources();
        setData(res);
        setItems(res.items || []);
      } catch (e: any) {
        setError(e?.message || "Failed to load Wialon resources");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, items, loading, error };
}
