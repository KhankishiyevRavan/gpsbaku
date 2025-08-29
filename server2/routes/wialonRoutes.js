const express = require("express");
const router = express.Router();
const axios = require("axios");
const { ensureSid, callWialon } = require("../services/wialonService");

const WIALON_BASE = process.env.WIALON_BASE;

/* Sürətli diaqnostika: birbaşa token/login cavabını göstərir */
router.get("/_debug", async (_req, res) => {
  try {
    const token = process.env.WIALON_TOKEN;
    if (!token) return res.status(500).json({ ok:false, message:"WIALON_TOKEN missing" });
    const params = { svc: "token/login", params: JSON.stringify({ token }) };
    const resp = await axios.get(WIALON_BASE, { params, timeout: 15000, validateStatus: null });
    res.json({ base: WIALON_BASE, status: resp.status, data: resp.data });
  } catch (e) {
    res.status(500).json({ ok:false, error: e.message });
  }
});

/* Session status */
router.get("/session", async (_req, res) => {
  try {
    const sid = await ensureSid();
    res.json({ ok:true, sidExists: Boolean(sid) });
  } catch (e) {
    res.status(500).json({ ok:false, message: e.message });
  }
});

/* Resurslar (avl_resource) */
router.get("/resources", async (req, res) => {
  try {
    const from = Number(req.query.from ?? 0);
    const to = Number(req.query.to ?? 152);
    const data = await callWialon("core/search_items", {
      spec: {
        itemsType: "avl_resource",
        propName: "rel_is_account,sys_name",
        propValueMask: "*",
        sortType: "sys_name",
        propType: "",
        or_logic: "0",
      },
      force: 1,
      flags: 5,
      from, to,
    });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error:"Wialon API error", detail: e.message });
  }
});

/* Unit-lər (avl_unit) */
router.get("/units", async (req, res) => {
  try {
    const from = Number(req.query.from ?? 0);
    const to = Number(req.query.to ?? 200);
    const data = await callWialon("core/search_items", {
      spec: {
        itemsType: "avl_unit",
        propName: "sys_name",
        propValueMask: "*",
        sortType: "sys_name",
      },
      force: 1,
      flags: 1,
      from, to,
    });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error:"Wialon API error", detail: e.message });
  }
});

/* İstənilən svc üçün raw POST */
router.post("/raw", async (req, res) => {
  try {
    const { svc, params } = req.body || {};
    if (!svc) return res.status(400).json({ error:"svc required" });
    const payload = typeof params === "string" ? JSON.parse(params) : (params || {});
    const data = await callWialon(svc, payload);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error:"Wialon API error", detail: e.message });
  }
});

module.exports = router;
