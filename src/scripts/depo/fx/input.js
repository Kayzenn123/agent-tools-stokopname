// Lapisan D — INPUT: drag inertia/flick di strip pengumuman + magnetic di tombol Tutup Buku.
import { motionAllowed } from './util.js';
import { marqueeBands } from './marquee.js';

export function initInput() {
  const cleanups = [];
  if (motionAllowed()) {
    document.querySelectorAll('.marquee-band').forEach((band) => {
      let dragging = false, startX = 0, lastX = 0, vel = 0, raf = 0;
      const st = () => marqueeBands().find((b) => b.el === band);
      const down = (e) => {
        dragging = true; startX = lastX = e.clientX; vel = 0;
        cancelAnimationFrame(raf);
        band.setPointerCapture?.(e.pointerId);
      };
      const move = (e) => {
        if (!dragging) return;
        const dx = e.clientX - lastX;
        lastX = e.clientX;
        vel = vel * 0.7 + dx * 0.3;
        const s = st(); if (s) s.manual += dx;
      };
      const up = () => {
        if (!dragging) return;
        dragging = false;
        const s = st(); if (!s) return;
        const flick = () => {
          vel *= 0.94;
          s.manual += vel;
          if (Math.abs(vel) > 0.4) raf = requestAnimationFrame(flick);
          else { s.manual = 0; } // kembali ke rel otomatis
        };
        flick();
      };
      band.addEventListener('pointerdown', down);
      band.addEventListener('pointermove', move);
      band.addEventListener('pointerup', up);
      band.addEventListener('pointercancel', up);
      cleanups.push(() => {
        band.removeEventListener('pointerdown', down);
        band.removeEventListener('pointermove', move);
        band.removeEventListener('pointerup', up);
        band.removeEventListener('pointercancel', up);
      });
    });

    // magnetic: tombol Tutup Buku
    const mag = document.getElementById('btn-tutup');
    if (mag && matchMedia('(pointer: fine)').matches) {
      const move = (e) => {
        const r = mag.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        mag.style.transform = `translate(${dx * 0.14}px, ${dy * 0.18}px)`;
      };
      const leave = () => { mag.style.transform = ''; };
      mag.addEventListener('pointermove', move);
      mag.addEventListener('pointerleave', leave);
      cleanups.push(() => {
        mag.removeEventListener('pointermove', move);
        mag.removeEventListener('pointerleave', leave);
        mag.style.transform = '';
      });
    }
  }
  return () => cleanups.forEach((fn) => fn());
}
