import { useEffect, useState } from "react";
import { WialonResourceItem } from "../../types/wialon";
import { fetchResources } from "../../services/wialon";
// import { fetchResources, type WialonResourceItem } from "../services/wialon";

export default function ResourceList() {
  const [items, setItems] = useState<WialonResourceItem[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchResources();
        setItems(res.items ?? []);
      } catch (e: any) {
        setErr(e?.message ?? "Xəta baş verdi");
      }
    })();
  }, []);

  if (err) return <div style={{ color: "red" }}>{err}</div>;

  return (
    <ul>
      {items.map((it) => (
        <li key={it.id}>
          {it.nm} — <small>#{it.id}</small>
        </li>
      ))}
    </ul>
  );
}
