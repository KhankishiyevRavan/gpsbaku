const axios = require("axios");

let base =
  process.env.WIALON_BASE || "https://hst-api.wialon.eu/wialon/ajax.html";
// “hosting.wialon.*” yazılıbsa avtomatik düzəlt
base = base.replace("https://hosting.wialon.", "https://hst-api.wialon.");

const WIALON_BASE = base;
const WIALON_TOKEN = process.env.WIALON_TOKEN;
const SESSION_TTL = Number(process.env.WIALON_SESSION_TTL || 1800);

let sid = null;
let sidExpiresAt = 0;

const now = () => Math.floor(Date.now() / 1000);
const hasValidSid = () => sid && now() < sidExpiresAt - 10;

async function loginWithToken() {
  if (!WIALON_TOKEN) throw new Error("WIALON_TOKEN missing");
  const params = {
    svc: "token/login",
    params: JSON.stringify({ token: WIALON_TOKEN }),
  };
  const { data, status } = await axios.get(WIALON_BASE, {
    params,
    timeout: 15000,
    validateStatus: null,
  });
  if (status !== 200 || !data || !data.eid) {
    throw new Error("Wialon login failed");
  }
  sid = data.eid;
  sidExpiresAt = now() + SESSION_TTL;
  return sid;
}

async function ensureSid() {
  if (hasValidSid()) return sid;
  return await loginWithToken();
}

async function callWialon(svc, payload = {}) {
  await ensureSid();
  const params = { svc, params: JSON.stringify(payload), sid };
  const { data, status } = await axios.get(WIALON_BASE, {
    params,
    timeout: 20000,
    validateStatus: null,
  });
  if (status === 404)
    throw new Error("Endpoint 404 — wrong WIALON_BASE/region");
  if (data && (data.error === 4 || data.reason === "Session expired")) {
    sid = null;
    sidExpiresAt = 0;
    await ensureSid();
    params.sid = sid;
    const retry = await axios.get(WIALON_BASE, { params, timeout: 20000 });
    return retry.data;
  }
  return data;
}

module.exports = { ensureSid, callWialon };
