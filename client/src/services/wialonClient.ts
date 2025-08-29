const API = import.meta.env.VITE_API_URL || "http://localhost:5001/api/";

export async function listResources(from = 0, to = 152) {
  const url = new URL(`${API}/wialon/resources`);
  url.searchParams.set("from", String(from));
  url.searchParams.set("to", String(to));
  const r = await fetch(url.toString(), { credentials: "include" });
  if (!r.ok) throw new Error(`Resources failed: ${r.status}`);
  return r.json();
}

export async function listUnits(from = 0, to = 200) {
  const url = new URL(`${API}/wialon/units`);
  url.searchParams.set("from", String(from));
  url.searchParams.set("to", String(to));
  const r = await fetch(url.toString(), { credentials: "include" });
  if (!r.ok) throw new Error(`Units failed: ${r.status}`);
  return r.json();
}

/** İstənilən Wialon servisinə raw POST */
export async function wialonRaw<T = unknown>(
  svc: string,
  params: Record<string, any>
) {
  const r = await fetch(`${API}/wialon/raw`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ svc, params }),
  });
  if (!r.ok) throw new Error(`Wialon raw failed: ${r.status}`);
  return r.json() as Promise<T>;
}
