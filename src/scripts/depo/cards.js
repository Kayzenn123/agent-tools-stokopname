// StokOpname Depo 32 — template kartu gerbong MURNI (dipakai SSR di Astro + client di board.js).
// Harus byte-identik di kedua sisi agar tidak ada layout shift.
import { hitung, fmtRp, fmtNum } from './store.js';

export const STATUS_LABEL = {
  cocok: 'COCOK', selisih: 'SELISIH', menipis: 'MENIPIS', habis: 'HABIS', belum: 'BELUM HITUNG',
};

export function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function mandorNote(it, h) {
  const n = Math.abs(h.selisih ?? 0);
  switch (h.status) {
    case 'cocok': return 'cocok! lanjut gerbong berikutnya.';
    case 'selisih': return h.selisih < 0
      ? `telat ${fmtNum(n)} ${it.satuan}! cari di kolong rak.`
      : `lebih ${fmtNum(n)} ${it.satuan}. ada yang nyelip?`;
    case 'menipis': return `tinggal ${fmtNum(it.fisik)} ${it.satuan} — jalur mau ditutup!`;
    case 'habis': return 'jalur ditutup. restok sana.';
    default: return 'fisik belum dihitung. turun ke gudang!';
  }
}

export function cardHTML(it, idx) {
  const h = hitung(it);
  const selisihTxt = h.selisih === null ? '—'
    : h.selisih === 0 ? '0'
    : (h.selisih > 0 ? '+' : '') + fmtNum(h.selisih);
  const selisihCls = h.selisih === null || h.selisih === 0 ? 'zero' : h.selisih > 0 ? 'pos' : 'neg';
  const nilaiTxt = h.nilai === null ? '—' : fmtRp(h.nilai);
  const cut = (idx + 1) % 7 === 0 ? ' cut' : '';
  return `
    <article class="gerbong${cut}" data-id="${it.id}">
      <span class="status-tape ${h.status}">${STATUS_LABEL[h.status]}</span>
      <div class="gerbong-top">
        <span class="gerbong-no">G-${String(idx + 1).padStart(3, '0')}</span>
        <h3 class="gerbong-name">${escapeHTML(it.nama)}</h3>
        <div class="gerbong-actions">
          <button class="mini-btn" data-act="edit" aria-label="Ubah ${escapeHTML(it.nama)}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 013 3L8 19l-4 1z"/></svg>
          </button>
          <button class="mini-btn danger" data-act="del" aria-label="Hapus ${escapeHTML(it.nama)}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-9 0l1 13h8l1-13"/></svg>
          </button>
        </div>
      </div>
      <div class="gerbong-grid">
        <div class="cell">
          <label for="t-${it.id}">tercatat (${escapeHTML(it.satuan)})</label>
          <input id="t-${it.id}" data-k="tercatat" inputmode="decimal" value="${it.tercatat}" aria-label="Stok tercatat ${escapeHTML(it.nama)}">
        </div>
        <div class="cell">
          <label for="f-${it.id}">fisik (${escapeHTML(it.satuan)})</label>
          <div class="stepper">
            <button type="button" class="step-btn" data-step="-1" aria-label="Kurangi 1 ${escapeHTML(it.satuan)}">−</button>
            <input id="f-${it.id}" data-k="fisik" inputmode="decimal" placeholder="hitung…" value="${it.fisik === null ? '' : it.fisik}" aria-label="Stok fisik ${escapeHTML(it.nama)}">
            <button type="button" class="step-btn" data-step="1" aria-label="Tambah 1 ${escapeHTML(it.satuan)}">+</button>
          </div>
        </div>
        <div class="cell"><label>harga modal</label><output>${fmtRp(it.modal)}</output></div>
        <div class="cell"><label>nilai selisih</label><output>${nilaiTxt}</output></div>
        <div class="selisih-row">
          <span class="hand-note">${escapeHTML(mandorNote(it, h))}</span>
          <span class="selisih-num ${selisihCls}" data-scramble>${selisihTxt}</span>
        </div>
      </div>
    </article>`;
}
