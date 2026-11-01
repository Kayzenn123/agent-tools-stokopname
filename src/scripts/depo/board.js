// StokOpname Depo 32 — render papan keberangkatan + CRUD + dialog + meja mandor.
import {
  hitung, ringkasan, fmtRp, saveItems, saveSession, loadHistory,
  deleteSession, toCSV, download, ringkasanWA, shareURL, validateForm, MAX_SHARE_ITEMS,
} from './store.js';
import { cardHTML, escapeHTML, STATUS_LABEL } from './cards.js';

const $ = (s, r = document) => r.querySelector(s);

export function createBoard(opts) {
  const els = {
    bento: $('#bento'), empty: $('#empty-state'),
    q: $('#q'), fStatus: $('#f-status'), fSort: $('#f-sort'),
    btnTambah: $('#btn-tambah'), dlg: $('#dlg-gerbong'), form: $('#form-gerbong'),
    formErr: $('#form-err'), dlgTitle: $('#dlg-title'),
    stTotal: $('#st-total'), stCocok: $('#st-cocok'), stSelisih: $('#st-selisih'), stNilai: $('#st-nilai'),
    btnTutup: $('#btn-tutup'), btnWa: $('#btn-wa'), btnCsv: $('#btn-csv'),
    btnJson: $('#btn-json'), btnPrint: $('#btn-print'), btnShare: $('#btn-share'),
    riwayat: $('#riwayat-list'), riwayatEmpty: $('#riwayat-empty'),
    stampLayer: $('#stamp-layer'), stamp: $('#stamp'), stampSub: $('#stamp-sub'),
    toasts: $('#toasts'),
  };

  let items = opts.items;
  const state = { q: '', status: 'semua', sort: 'nama' };
  let saveT = null;
  const persist = () => {
    clearTimeout(saveT);
    saveT = setTimeout(() => saveItems(items), 350);
  };

  /* ---------- toast ---------- */
  function toast(html, ms = 3200) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.setAttribute('role', 'status');
    t.innerHTML = html;
    els.toasts.appendChild(t);
    requestAnimationFrame(() => t.classList.add('in'));
    setTimeout(() => {
      t.classList.remove('in');
      setTimeout(() => t.remove(), 300);
    }, ms);
    while (els.toasts.children.length > 3) els.toasts.firstChild.remove();
  }
  const say = (s) => `<span class="hand">Pak Mandor:</span> ${s}`;

  /* ---------- filter/sort ---------- */
  function visible() {
    const q = state.q.trim().toLowerCase();
    let list = items.filter((it) => {
      if (q && !it.nama.toLowerCase().includes(q)) return false;
      if (state.status !== 'semua' && hitung(it).status !== state.status) return false;
      return true;
    });
    const by = {
      nama: (a, b) => a.nama.localeCompare(b.nama, 'id'),
      selisih: (a, b) => Math.abs(hitung(b).selisih ?? -1) - Math.abs(hitung(a).selisih ?? -1),
      nilai: (a, b) => Math.abs(hitung(b).nilai ?? -1) - Math.abs(hitung(a).nilai ?? -1),
    }[state.sort];
    return list.sort(by);
  }

  /* ---------- render kartu (template murni dari cards.js — identik dengan SSR) ---------- */

  function render() {
    const list = visible();
    els.bento.innerHTML = list.map(cardHTML).join('');
    els.empty.hidden = list.length > 0;
    els.bento.style.display = list.length ? '' : 'none';
    renderDesk();
    if (window.__depoReveal) window.__depoReveal.refresh();
  }

  function renderDesk() {
    const r = ringkasan(items);
    els.stTotal.textContent = r.total;
    els.stCocok.textContent = r.cocok;
    els.stSelisih.textContent = r.selisih + r.menipis + r.habis;
    els.stNilai.textContent = fmtRp(r.nilaiSelisih);
    els.stNilai.classList.toggle('bad', r.nilaiSelisih < 0);
    els.stNilai.classList.toggle('good', r.nilaiSelisih >= 0);
    renderHistory();
  }

  function renderHistory() {
    const h = loadHistory();
    els.riwayatEmpty.hidden = h.length > 0;
    els.riwayat.innerHTML = h.map((s) => `
      <div class="riwayat-item">
        <div><div class="t">${new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(s.at)}</div>
        <div class="m">${s.count} gerbong · ${s.cocok} cocok · ${s.selisih} selisih · ${fmtRp(s.nilaiSelisih)}</div></div>
        <span class="spacer"></span>
        <button class="btn btn-ghost" data-hload="${s.id}">Muat</button>
        <button class="mini-btn danger" data-hdel="${s.id}" aria-label="Hapus sesi">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-9 0l1 13h8l1-13"/></svg>
        </button>
      </div>`).join('');
  }

  /* ---------- interaksi papan ---------- */
  els.bento.addEventListener('change', (e) => {
    const input = e.target.closest('input[data-k]');
    if (!input) return;
    const card = input.closest('.gerbong');
    const it = items.find((x) => x.id === card.dataset.id);
    if (!it) return;
    const raw = input.value.trim().replace(',', '.');
    if (raw === '') {
      if (input.dataset.k === 'fisik') { it.fisik = null; }
      else { input.classList.add('invalid'); setTimeout(() => input.classList.remove('invalid'), 400); return; }
    } else {
      const n = Number(raw);
      if (!Number.isFinite(n) || n < 0) {
        input.classList.add('invalid');
        setTimeout(() => input.classList.remove('invalid'), 400);
        toast(say(`"${escapeHTML(input.value)}" bukan angka. Ulangi hitungnya.`));
        return;
      }
      it[input.dataset.k] = n;
    }
    persist();
    render();
  });

  els.bento.addEventListener('click', (e) => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const card = step.closest('.gerbong');
      const it = items.find((x) => x.id === card.dataset.id);
      if (!it) return;
      const cur = it.fisik === null ? 0 : it.fisik;
      it.fisik = Math.max(0, Math.round((cur + Number(step.dataset.step)) * 100) / 100);
      persist(); render();
      return;
    }
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const card = btn.closest('.gerbong');
    const it = items.find((x) => x.id === card.dataset.id);
    if (!it) return;
    if (btn.dataset.act === 'del') {
      items = items.filter((x) => x.id !== it.id);
      persist(); render();
      toast(say(`Gerbong <b>${escapeHTML(it.nama)}</b> dihapus dari papan.`));
    } else {
      openDialog(it);
    }
  });

  els.q.addEventListener('input', () => { state.q = els.q.value; render(); });
  els.fStatus.addEventListener('change', () => { state.status = els.fStatus.value; render(); });
  els.fSort.addEventListener('change', () => { state.sort = els.fSort.value; render(); });

  /* ---------- dialog ---------- */
  let editingId = null;
  function openDialog(it = null) {
    editingId = it ? it.id : null;
    els.dlgTitle.textContent = it ? 'Ubah gerbong' : 'Daftarkan gerbong baru';
    const f = els.form;
    f.nama.value = it?.nama ?? '';
    f.satuan.value = it?.satuan ?? 'pcs';
    f.modal.value = it?.modal ?? '';
    f.tercatat.value = it?.tercatat ?? '';
    f.fisik.value = it?.fisik ?? '';
    f.ambang.value = it?.ambang ?? '';
    els.formErr.hidden = true;
    els.formErr.textContent = '';
    f.querySelectorAll('.invalid').forEach((x) => x.classList.remove('invalid'));
    els.dlg.showModal();
    setTimeout(() => f.nama.focus(), 60);
  }
  els.btnTambah.addEventListener('click', () => openDialog());
  $('#dlg-cancel').addEventListener('click', () => els.dlg.close());

  els.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = els.form;
    const v = validateForm({
      id: editingId, nama: f.nama.value, satuan: f.satuan.value,
      modal: f.modal.value, tercatat: f.tercatat.value, fisik: f.fisik.value, ambang: f.ambang.value,
    });
    if (!v.ok) {
      els.formErr.innerHTML = v.errors.map(escapeHTML).join('<br>');
      els.formErr.hidden = false;
      return;
    }
    if (editingId) {
      const ix = items.findIndex((x) => x.id === editingId);
      if (ix > -1) items[ix] = v.item;
      toast(say(`Gerbong <b>${escapeHTML(v.item.nama)}</b> diperbarui.`));
    } else {
      items.push(v.item);
      toast(say(`Gerbong <b>${escapeHTML(v.item.nama)}</b> masuk jalur.`));
    }
    persist(); render();
    els.dlg.close();
  });

  /* ---------- meja mandor ---------- */
  els.btnTutup.addEventListener('click', () => {
    if (!items.length) { toast(say('Depo kosong. Daftarkan gerbong dulu baru tutup buku.')); return; }
    const r = ringkasan(items);
    const belum = r.belum;
    if (belum > 0 && !confirm(`Masih ada ${belum} gerbong belum dihitung fisiknya. Tetap tutup buku?`)) return;
    saveSession(items);
    const ok = r.selisih === 0 && r.menipis === 0 && r.habis === 0 && belum === 0;
    els.stamp.textContent = ok ? 'COCOK' : 'SELISIH';
    els.stamp.className = 'stamp ' + (ok ? 'cocok' : 'selisih');
    els.stampSub.textContent = ok
      ? 'semua gerbong cocok. mandor bangga.'
      : `nilai selisih ${fmtRp(r.nilaiSelisih)} — periksa lagi yang telat.`;
    els.stampLayer.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => els.stampLayer.classList.add('show')));
    renderHistory();
  });
  const closeStamp = () => { els.stampLayer.classList.remove('show'); setTimeout(() => { els.stampLayer.hidden = true; }, 200); };
  els.stampLayer.addEventListener('click', (e) => { if (e.target.closest('#btn-stamp-ok') || e.target === els.stampLayer) closeStamp(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !els.stampLayer.hidden) closeStamp(); });

  async function copyText(t, okMsg) {
    try {
      await navigator.clipboard.writeText(t);
      toast(say(okMsg));
    } catch {
      const ta = document.createElement('textarea');
      ta.value = t;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); toast(say(okMsg)); }
      catch { toast(say('Gagal menyalin. Salin manual ya.')); }
      ta.remove();
    }
  }

  els.btnWa.addEventListener('click', () => {
    if (!items.length) { toast(say('Belum ada gerbong untuk dilaporkan.')); return; }
    copyText(ringkasanWA(items), 'Ringkasan tersalin. Tempel di WA.');
  });
  els.btnCsv.addEventListener('click', () => {
    if (!items.length) { toast(say('Belum ada data untuk diekspor.')); return; }
    download('stokopname-depo32.csv', toCSV(items), 'text/csv;charset=utf-8');
    toast(say('CSV meluncur ke unduhan.'));
  });
  els.btnJson.addEventListener('click', () => {
    download('stokopname-depo32.json', JSON.stringify({ schema: 1, exportedAt: Date.now(), items }, null, 2), 'application/json');
    toast(say('JSON tersimpan. Buat cadangan.'));
  });
  els.btnPrint.addEventListener('click', () => {
    if (!items.length) { toast(say('Nggak ada yang bisa dicetak.')); return; }
    window.print();
  });
  els.btnShare.addEventListener('click', () => {
    if (!items.length) { toast(say('Belum ada gerbong untuk dibagikan.')); return; }
    const url = shareURL(items);
    const note = items.length > MAX_SHARE_ITEMS ? ` (hanya ${MAX_SHARE_ITEMS} gerbong pertama ikut — tautan kepanjangan)` : '';
    copyText(url, `Tautan gudang tersalin${note}.`);
  });

  els.riwayat.addEventListener('click', (e) => {
    const load = e.target.closest('[data-hload]');
    const del = e.target.closest('[data-hdel]');
    if (load) {
      const s = loadHistory().find((x) => x.id === load.dataset.hload);
      if (s && Array.isArray(s.snapshot)) {
        items = s.snapshot.map((o) => ({ ...o }));
        persist(); render();
        toast(say(`Sesi ${new Date(s.at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} dimuat kembali.`));
        document.querySelector('#papan').scrollIntoView({ behavior: 'smooth' });
      }
    } else if (del) {
      deleteSession(del.dataset.hdel);
      renderHistory();
      toast(say('Sesi dihapus dari arsip.'));
    }
  });

  /* ---------- API untuk motion ---------- */
  // hydrate: HTML SSR sudah identik (kunjungan pertama, contoh deterministik)
  // → lewati innerHTML ulang agar tidak membebani main thread & risiko CLS.
  if (opts.hydrate) renderDesk();
  else render();
  return {
    toast, say,
    get items() { return items; },
    setItems(list) { items = list; persist(); render(); },
  };
}
