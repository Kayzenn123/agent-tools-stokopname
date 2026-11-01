// Lapisan A — KAMERA: zoom-through teks "DEPO 32" sebagai pintu (scrub, tanpa pin demi CLS).
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motionAllowed } from './util.js';

gsap.registerPlugin(ScrollTrigger);

export function initCamera() {
  const word = document.querySelector('.gate-word');
  const gate = document.querySelector('.gate');
  if (!word || !gate || !motionAllowed()) return () => {};
  // tanpa pin (pin-spacer = CLS) — zoom scrub biasa saat section lewat
  const tl = gsap.timeline({
    scrollTrigger: { trigger: gate, start: 'top top', end: 'bottom top', scrub: 1 },
  });
  tl.to(word, { scale: 5, ease: 'none', duration: 1 }, 0);
  tl.to('.gate-sub, .gate-cue', { opacity: 0, duration: 0.2 }, 0);
  return () => {
    tl.scrollTrigger && tl.scrollTrigger.kill();
    tl.kill();
    gsap.set([word, '.gate-sub', '.gate-cue'], { clearProps: 'all' });
  };
}
