// StokOpname Depo 32 — orkestrasi: state + papan + semua lapisan gerak.
// Lapisan gerak (GSAP) dimuat malas setelah idle agar tidak menahan first paint.
import {
  loadItems, saveItems, contohItems, parseShare,
} from './store.js';
import { createBoard } from './board.js';

let destroys = [];

async function bootFx() {
  destroys.forEach((d) => { try { d(); } catch {} });
  destroys = [];
  // Fase ringan (vanilla, tanpa GSAP): marquee, teks, input — setelah idle.
  const [
    { initMarquee, setMarqueePaused }, { initText }, { initInput },
  ] = await Promise.all([
    import('./fx/marquee.js'), import('./fx/text.js'), import('./fx/input.js'),
  ]);
  destroys.push(initMarquee());
  destroys.push(initText());
  destroys.push(initInput());
  window.__depoSetMarqueePaused = setMarqueePaused;
  window.addEventListener('visibilitychange', () => {
    setMarqueePaused(document.hidden || document.body.classList.contains('motion-off'));
  });
  // Fase berat (GSAP: kamera scrub + reveal) — hanya saat dibutuhkan: scroll
  // pertama atau 6 detik setelah load, agar tidak membebani TBT/LCP.
  let heavyDone = false;
  const bootHeavy = async () => {
    if (heavyDone) return;
    heavyDone = true;
    const [{ initCamera }, { initReveal }] = await Promise.all([
      import('./fx/camera.js'), import('./fx/reveal.js'),
    ]);
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    const gsap = (await import('gsap')).default;
    gsap.registerPlugin(ScrollTrigger);
    destroys.push(initCamera());
    {
      const reveal = initReveal();
      window.__depoReveal = reveal;
      destroys.push(() => reveal.destroy());
    }
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    let rzT;
    window.addEventListener('resize', () => { clearTimeout(rzT); rzT = setTimeout(() => ScrollTrigger.refresh(), 250); });
  };
  const heavyT = setTimeout(bootHeavy, 6000);
  window.addEventListener('scroll', function onFirstScroll() {
    window.removeEventListener('scroll', onFirstScroll);
    clearTimeout(heavyT);
    bootHeavy();
  }, { passive: true });
  window.__depoBootHeavy = bootHeavy;
}

function boot() {
  // Jam stasiun: modul mungil, init SEKALI di sini — jangan masuk destroys
  // (bootFx menghancurkan isi destroys; clock tidak boleh mati & hidup lagi).
  import('./fx/clock.js').then(({ initClock }) => {
    initClock((html) => window.__depoBoard?.toast(html));
  });

  // Sisanya (state + papan + fx) menunggu idle: konten kritis sudah di-SSR,
  // jadi evaluasi JS tidak menahan LCP/TTI.
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 50));
  idle(() => bootMain());
}

function bootMain() {
  // deep-link ?gudang= lebih utama dari simpanan lokal
  const shared = parseShare();
  let items = shared;
  let fromShare = false;
  let pristine = false; // kunjungan pertama: SSR contoh == state → hydrate tanpa render ulang
  if (!items) {
    const saved = loadItems();
    if (saved) items = saved;
    else {
      items = contohItems();
      pristine = true; // SSR contoh == state → hydrate tanpa render ulang
      saveItems(items);
      setTimeout(() => {
        window.__depoBoard?.toast('<span class="hand">Pak Mandor:</span> 18 gerbong <b>contoh</b> sudah di jalur. Ubah atau hapus sesukamu — angka & harga cuma contoh.');
      }, 1200);
    }
  }
  if (shared) {
    fromShare = true;
    saveItems(items);
    try { history.replaceState(null, '', location.pathname); } catch {}
  }

  const board = createBoard({ items, hydrate: pristine && !shared });
  window.__depoBoard = board;
  // fx ringan (vanilla, tanpa GSAP) → idle; fx berat (GSAP) → scroll pertama / 6 dtk.
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 50));
  idle(() => bootFx());

  if (fromShare) {
    setTimeout(() => board.toast(board.say('Kiriman gudang dimuat. Cocokkan fisiknya!')), 900);
    setTimeout(() => document.querySelector('#papan')?.scrollIntoView(), 1400);
  }

  // toggle gerak: hancurkan + nyalakan ulang semua lapisan
  const btnMotion = document.getElementById('btn-motion');
  btnMotion?.addEventListener('click', () => {
    const off = document.body.classList.toggle('motion-off');
    btnMotion.setAttribute('aria-pressed', String(off));
    btnMotion.setAttribute('aria-label', off ? 'Nyalakan gerak' : 'Matikan gerak');
    if (!off && window.__depoSetMarqueePaused) window.__depoSetMarqueePaused(false);
    bootFx();
  });

  // tombol contoh di empty state
  document.getElementById('btn-contoh')?.addEventListener('click', () => {
    board.setItems(contohItems());
    board.toast(board.say('18 gerbong contoh masuk jalur lagi.'));
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
