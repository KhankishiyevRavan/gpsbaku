import { useEffect, useState } from "react";
import { listResources } from "../../services/wialonClient";

export default function WialonResourcesBox() {
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await listResources(0, 152);
        setData(res);
      } catch (e: any) {
        setErr(e.message || "Xəta");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Yüklənir…</div>;
  if (err) return <div style={{ color: "crimson" }}>Xəta: {err}</div>;
  return (
    <pre style={{ maxHeight: 400, overflow: "auto" }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
