// Lapisan E — REVEAL: curtain wipe antar section + clip-path untuk stiker/kicker.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motionAllowed } from './util.js';

gsap.registerPlugin(ScrollTrigger);

export function initReveal() {
  const triggers = [];
  if (motionAllowed()) {
    // curtain wipe sekali saat tiap section besar masuk
    ['#papan', '#meja', '#riwayat'].forEach((sel) => {
      const sec = document.querySelector(sel);
      if (!sec) return;
      const st = ScrollTrigger.create({
        trigger: sec, start: 'top 78%', once: true,
        onEnter: () => {
          const c = document.getElementById('curtain');
          if (!c) return;
          gsap.timeline()
            .set(c, { transformOrigin: 'top', scaleY: 0 })
            .to(c, { scaleY: 1, duration: 0.32, ease: 'power3.in' })
            .set(c, { transformOrigin: 'bottom' })
            .to(c, { scaleY: 0, duration: 0.38, ease: 'power3.out' });
          gsap.from(sec.querySelectorAll('.kicker, .section-title, .lede'), {
            y: 26, opacity: 0, duration: 0.55, stagger: 0.07, ease: 'power3.out', clearProps: 'all',
          });
        },
      });
      triggers.push(st);
    });
    // kartu gerbong: reveal stagger saat masuk viewport
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          gsap.from(e.target, { y: 30, opacity: 0, duration: 0.5, ease: 'power3.out', clearProps: 'all' });
          io.unobserve(e.target);
        }
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    window.__depoCardObserver = io;
    document.querySelectorAll('.gerbong').forEach((el) => io.observe(el));
    triggers.push({ kill: () => io.disconnect() });
  }
  return {
    destroy() { triggers.forEach((t) => t.kill && t.kill()); ScrollTrigger.getAll().forEach((t) => { if (!t.vars?.id?.startsWith('cam')) t.kill(); }); },
    refresh() {
      ScrollTrigger.refresh();
      if (motionAllowed() && window.__depoCardObserver) {
        document.querySelectorAll('.gerbong').forEach((el) => window.__depoCardObserver.observe(el));
      }
    },
  };
}
