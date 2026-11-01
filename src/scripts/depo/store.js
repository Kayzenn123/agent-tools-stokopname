// StokOpname Depo 32 — state, persistence, validasi, ekspor, deep-link.
// Semua angka contoh bertanda "contoh" di UI (ATURAN 10 v5).

const KEY = 'stokopname/v1';
const HIST_KEY = 'stokopname/history/v1';
const SCHEMA = 1;
export const MAX_SHARE_ITEMS = 12;

const uid = () =>
  'g' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export const fmtRp = (n) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);

export const fmtNum = (n) =>
  new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(n ?? 0);

/** 18 barang contoh warung — harga & stok = contoh, bisa diubah.
 *  ID deterministik (contoh-NN) agar HTML SSR identik dengan render client (anti CLS). */
export function contohItems() {
  const rows = [
    ['Indomie Goreng', 'dus', 112000, 40, 40, 38, 5],
    ['Beras 5kg', 'karung', 62000, 20, 20, 20, 4],
    ['Minyak Goreng 2L', 'kardus', 248000, 12, 12, 11, 3],
    ['Gula Pasir 1kg', 'karung', 345000, 20, 20, 20, 4],
    ['Kopi Kapal Api 165g', 'renteng', 198000, 10, 10, 9, 2],
    ['Teh Botol Sosro', 'krat', 96000, 24, 24, 24, 6],
    ['Aqua 600ml', 'dus', 52000, 24, 24, 22, 6],
    ['Telur Ayam', 'kg', 28000, 30, 30, 28, 5],
    ['Terigu Segitiga 1kg', 'bal', 132000, 12, 12, 12, 3],
    ['Kecap Bango 620ml', 'dus', 276000, 12, 12, 10, 3],
    ['Mie Sedaap', 'dus', 108000, 40, 40, 40, 5],
    ['Chitato 68g', 'dus', 214000, 20, 20, 19, 4],
    ['Susu Ultra 1L', 'dus', 228000, 12, 12, 12, 3],
    ['Sabun Lifebuoy', 'lusin', 42000, 12, 12, 11, 2],
    ['Rinso 800g', 'dus', 198000, 12, 12, 12, 3],
    ['Minyak Kayu Putih 60ml', 'lusin', 216000, 6, 6, 6, 2],
    ['Kopi ABC Susu', 'renteng', 168000, 10, 10, 2, 3],
    ['Garam Cap Kapal', 'bal', 96000, 20, 20, 20, 4],
  ];
  return rows.map(([nama, satuan, modal, isi, tercatat, fisik, ambang], i) => ({
    id: 'contoh-' + String(i + 1).padStart(2, '0'), nama, satuan, modal, tercatat, fisik, ambang,
  }));
}

function validItem(o) {
  if (!o || typeof o !== 'object') return null;
  const nama = String(o.nama ?? '').trim().slice(0, 80);
  if (!nama) return null;
  const num = (v, dflt = 0) => {
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? n : dflt;
  };
  return {
    id: typeof o.id === 'string' && o.id ? o.id.slice(0, 40) : uid(),
    nama,
    satuan: String(o.satuan ?? 'pcs').trim().slice(0, 20) || 'pcs',
    modal: num(o.modal),
    tercatat: num(o.tercatat),
    fisik: o.fisik === null || o.fisik === undefined || o.fisik === '' ? null : num(o.fisik, null),
    ambang: num(o.ambang),
  };
}

/** selisih & status per gerbong */
export function hitung(it) {
  const selisih = it.fisik === null ? null : it.fisik - it.tercatat;
  const nilai = selisih === null ? null : selisih * it.modal;
  let status = 'belum';
  if (selisih !== null) {
    if (it.fisik === 0) status = 'habis';
    else if (it.fisik <= it.ambang) status = 'menipis';
    else if (selisih === 0) status = 'cocok';
    else status = 'selisih';
  }
  return { selisih, nilai, status };
}

export function ringkasan(items) {
  const r = { total: items.length, cocok: 0, selisih: 0, menipis: 0, habis: 0, belum: 0, nilaiSelisih: 0, nilaiStok: 0 };
  for (const it of items) {
    const h = hitung(it);
    r[h.status] = (r[h.status] ?? 0) + 1;
    if (h.nilai !== null) r.nilaiSelisih += h.nilai;
    if (it.fisik !== null) r.nilaiStok += it.fisik * it.modal;
  }
  return r;
}

function readKey(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const data = JSON.parse(raw);
    if (!data || data.schema !== SCHEMA) return fallback;
    return data;
  } catch {
    return fallback;
  }
}

export function loadItems() {
  const data = readKey(KEY, null);
  if (!data || !Array.isArray(data.items)) return null;
  const items = data.items.map(validItem).filter(Boolean);
  return items;
}

export function saveItems(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ schema: SCHEMA, savedAt: Date.now(), items }));
    return true;
  } catch { return false; }
}

export function loadHistory() {
  const data = readKey(HIST_KEY, { items: [] });
  return Array.isArray(data.items) ? data.items : [];
}

export function saveSession(items) {
  const h = loadHistory();
  const r = ringkasan(items);
  h.unshift({
    id: uid(), at: Date.now(), count: items.length,
    cocok: r.cocok, selisih: r.selisih, nilaiSelisih: r.nilaiSelisih,
    snapshot: items,
  });
  try {
    localStorage.setItem(HIST_KEY, JSON.stringify({ schema: SCHEMA, items: h.slice(0, 20) }));
    return true;
  } catch { return false; }
}

export function deleteSession(id) {
  const h = loadHistory().filter((s) => s.id !== id);
  try {
    localStorage.setItem(HIST_KEY, JSON.stringify({ schema: SCHEMA, items: h }));
    return true;
  } catch { return false; }
}

export function clearItems() {
  try { localStorage.removeItem(KEY); return true; } catch { return false; }
}

/* ---------- ekspor ---------- */

export function toCSV(items) {
  const head = ['nama', 'satuan', 'harga_modal', 'stok_tercatat', 'stok_fisik', 'selisih', 'nilai_selisih', 'status'];
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = [head.join(',')];
  for (const it of items) {
    const h = hitung(it);
    lines.push([it.nama, it.satuan, it.modal, it.tercatat, it.fisik ?? '', h.selisih ?? '', h.nilai ?? '', h.status].map(esc).join(','));
  }
  return '﻿' + lines.join('\r\n');
}

export function download(name, content, type) {
  const blob = new Blob([content], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 400);
}

export function ringkasanWA(items) {
  const r = ringkasan(items);
  const L = [
    '*STOK OPNAME — DEPO 32*',
    `Tanggal: ${new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date())}`,
    '',
    `Gerbong: ${r.total} | Cocok: ${r.cocok} | Selisih: ${r.selisih} | Menipis: ${r.menipis} | Habis: ${r.habis}`,
    `Nilai selisih: ${fmtRp(r.nilaiSelisih)}`,
    '',
  ];
  for (const it of items) {
    const h = hitung(it);
    if (h.status === 'selisih' || h.status === 'menipis' || h.status === 'habis') {
      L.push(`• ${it.nama}: tercatat ${fmtNum(it.tercatat)}, fisik ${it.fisik === null ? '?' : fmtNum(it.fisik)} (${h.selisih === null ? '?' : (h.selisih > 0 ? '+' : '') + fmtNum(h.selisih)} ${it.satuan})`);
    }
  }
  L.push('', '_Dihitung di StokOpname Depo 32_');
  return L.join('\n');
}

/* ---------- deep-link ?gudang= ---------- */

const b64url = {
  enc: (s) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
  dec: (s) => decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/')))),
};

export function shareURL(items) {
  const slim = items.slice(0, MAX_SHARE_ITEMS).map((it) => ({
    nama: it.nama, satuan: it.satuan, modal: it.modal,
    tercatat: it.tercatat, fisik: it.fisik, ambang: it.ambang,
  }));
  const code = b64url.enc(JSON.stringify({ v: 1, items: slim }));
  const u = new URL(location.href);
  u.search = '';
  u.searchParams.set('gudang', code);
  return u.toString();
}

export function parseShare() {
  try {
    const code = new URL(location.href).searchParams.get('gudang');
    if (!code || code.length > 4000) return null;
    const data = JSON.parse(b64url.dec(code));
    if (!data || data.v !== 1 || !Array.isArray(data.items)) return null;
    const items = data.items.map(validItem).filter(Boolean).slice(0, MAX_SHARE_ITEMS);
    return items.length ? items : null;
  } catch { return null; }
}

/** validasi form tambah/edit — mengembalikan {ok, item?, errors[]} suara Pak Mandor */
export function validateForm(f) {
  const errors = [];
  const nama = String(f.nama ?? '').trim();
  if (!nama) errors.push('Nama gerbong kosong. Isi dulu, jangan ngelamun.');
  if (nama.length > 80) errors.push('Nama kepanjangan. Maksimal 80 huruf, mandor nggak kuat baca.');
  const num = (v, label) => {
    if (v === '' || v === null || v === undefined) return { v: label === 'fisik' ? null : 0 };
    const n = Number(String(v).replace(',', '.'));
    if (!Number.isFinite(n) || n < 0) return { err: `${label} harus angka ≥ 0. Jangan ngarang.` };
    return { v: n };
  };
  const out = {};
  for (const [k, label] of [['modal', 'Harga modal'], ['tercatat', 'Stok tercatat'], ['fisik', 'Stok fisik'], ['ambang', 'Ambang']]) {
    const r = num(f[k], label);
    if (r.err) errors.push(r.err); else out[k] = r.v;
  }
  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    item: { id: f.id || uid(), nama, satuan: String(f.satuan || 'pcs').trim().slice(0, 20) || 'pcs', ...out },
  };
}
