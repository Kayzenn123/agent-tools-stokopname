// Jam stasiun: berdetak tiap detik + easter egg "LEMBUR" (klik 5x).
export function initClock(onToast) {
  const el = document.getElementById('station-clock');
  if (!el) return () => {};
  const hh = el.querySelector('[data-hh]');
  const mm = el.querySelector('[data-mm]');
  const ss = el.querySelector('[data-ss]');
  let lembur = false, lemburT = null;

  const tick = () => {
    if (lembur) return; // jangan timpa tampilan LEMBUR tiap detik
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    if (hh) hh.textContent = p(d.getHours());
    if (mm) mm.textContent = p(d.getMinutes());
    if (ss) ss.textContent = p(d.getSeconds());
  };
  tick();
  const timer = setInterval(tick, 1000);

  let clicks = [], resetT = null;
  const click = () => {
    const now = Date.now();
    clicks = [...clicks.filter((t) => now - t < 3000), now];
    clearTimeout(resetT);
    resetT = setTimeout(() => { clicks = []; }, 3000);
    if (clicks.length >= 5 && !lembur) {
      lembur = true;
      el.classList.add('lembur');
      if (hh) hh.textContent = 'LE';
      if (mm) mm.textContent = 'MB';
      if (ss) ss.textContent = 'UR';
      onToast?.('<span class="hand">Pak Mandor:</span> Masih di depo jam segini? Rajin.');
      clearTimeout(lemburT);
      lemburT = setTimeout(() => { lembur = false; el.classList.remove('lembur'); tick(); }, 10000);
      clicks = [];
    }
  };
  el.addEventListener('click', click);
  el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); click(); } });

  return () => { clearInterval(timer); clearTimeout(resetT); clearTimeout(lemburT); el.removeEventListener('click', click); };
}
