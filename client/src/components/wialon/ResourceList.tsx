import { useEffect, useState } from "react";
import { WialonResourceItem } from "../../types/wialon";
import { fetchResources } from "../../services/wialon";
import axios from "axios";
// import { fetchResources, type WialonResourceItem } from "../services/wialon";

export default function ResourceList() {
  const [items, setItems] = useState<WialonResourceItem[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // const res = await fetchResources();
        const res = await axios.post(
          "https://hst-api.wialon.com/wialon/ajax.html?svc=token/login&params={'token':'6037ce360e711e993b9c64d7c53e603059460376A0E6B73BD0EF2A34F83AA0AD9ED96795'}"
        );
        console.log(res);

        // setItems(res.items ?? []);
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
