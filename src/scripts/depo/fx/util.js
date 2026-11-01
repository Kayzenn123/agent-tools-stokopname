// Util gerak — modul mungil tanpa dependensi (boleh diimpor fase ringan).
export function motionAllowed() {
  return !matchMedia('(prefers-reduced-motion: reduce)').matches
    && !document.body.classList.contains('motion-off');
}
