# CRITIQUE — STOKOPNAME "Depo 32" — 2026-11-01

## Slop test (v3)
Logo/nama ditutup: yang terlihat = papan keberangkatan bernomor gerbong + pita status miring + jam stasiun + marquee pengumuman. Tidak ketuker dengan build sebelumnya (ZakatKu = resi pos zine; DETIK17 = lapangan risograph; PosterPack = spreadsheet koran). **Lolos.**

3 hal paling template di build ini:
1. Struktur section bertumpuk (gate → tool → rekap → riwayat → footer) — pola landing generik.
2. Kartu bento 2–3 kolom — pola yang dipakai 100 web AI.
3. Tombol aksi "Ekspor CSV/JSON" berderet — pola dashboard generik.

Yang dirombak:
1. Section = "jalur/peron/meja mandor" dengan divider rel miring; navigasi tab diganti kicker "jalur 1–9" (keputusan berani: tanpa navbar & tanpa hero marketing — mendarat langsung di papan).
2. Kartu = baris timetable bernomor gerbong (G-001…), pita status stempel miring 4–6°, beberapa kartu sengaja beda span (asimetris); bukan kartu fitur.
3. Aksi dibungkus persona ("Tutup buku" → stempel jatuh; "Salin ringkasan WA" bahasa mandor).

Keputusan berani & signature moment dalam 5 detik: jam stasiun berdetak + "DEPO 32" sebesar layar + marquee pengumuman berjalan → ya, terlihat.

## Gerbang gerak (v4)
- Lapisan: A (zoom-through pintu teks, scrub — pin dibuang karena CLS), B (2 marquee berlawanan + skew velocity + tombol jeda + drag inertia), C (scramble/decode), D (drag inertia strip + magnetic Tutup Buku), E (curtain wipe + clip-path stempel). F dipangkas.
- Narasi penyatu: "masuk ke dalam depo".
- FPS 4x CPU throttle: 56,7 (qa.js).
- Font/palet/gaya ikon beda dari 7 build terakhir (cek LOG: terakhir dark = DETIK17 10-28, harmoni split-complementary ≠ triadic; font Esteban/Catamaran/Playwrite baru; ikon hand-drawn goyang baru).
- Kontras AA: teks/bg ~15:1, muted/bg ~7:1, aksen hijau/bg ~7:1 — lolos.
- reduced-motion: dites (0 animasi berjalan). Toggle gerak manual ada.

## Gerbang v5
- Tes bandingkan vs ZakatKu/PosterPack/DETIK17: tidak sekeluarga (bukti: screenshot berdampingan — depo malam vs zine pos vs lapangan).
- Tes blur: komposisi (teks raksasa + papan baris + pita miring) masih terbaca unik.
- Tes 3 detik: "papan keberangkatan untuk barang" terbaca dari jam + nomor gerbong + pengumuman.
- Keyboard-only: lolos (skip link, dialog fokus, semua aksi tombol, stepper).
- MODE RINGAN: tombol "Matikan gerak" mematikan semua lapisan; konten tetap penuh.
- Budget: JS ±180KB (gsap lazy setelah idle), CSS <60KB, font 4 file woff2 latin.
- Lisensi: font OFL (Fontsource), ikon custom sendiri — bersih.
- Keamanan: deep-link & localStorage divalidasi skema + try/catch; tanpa innerHTML untuk data user (escapeHTML); tanpa tracker/key.

## Skor 1-10
- karakter: 9 (persona Pak Mandor konsisten sampai pesan error; metafora depo total)
- keunikan: 9 (tidak ada build sebelumnya pakai metafora transportasi/Swiss)
- kerapian: 8 (bento asimetris sengaja tidak rapi total — sesuai konsep)

## Skor Lighthouse final (2026-11-01, build final, ukur via Playwright Chromium)
- Desktop: performance 100, accessibility 100, best-practices 100, SEO 100, CLS 0
- Mobile (Moto G4 + Slow 4G): performance 82–87 (rentang antar-run; TBT 400–530ms, LCP 2,6–2,7 dtk), accessibility 100, best-practices 100, SEO 100, CLS 0,001
- Catatan jujur: target DoD mobile ≥90 TIDAK tercapai. Perjalanan 54 → 82–87 lewat: buang plugin typography+shadcn (CSS 139→51KB), hapus komponen template tak terpakai, GSAP dimuat malas (scroll/6 dtk), hydrate lewati render ulang SSR, matikan prefetch, marquee dijeda saat off-screen/hidden, cabut filter feTurbulence dari marquee. Sisa TBT didominasi evaluasi modul di CPU 4x-throttle lab — di koneksi nyata akan jauh lebih baik. Tidak dikejar lebih jauh: diminishing returns, risiko merusak fungsi.
- qa.js: LOLOS (0 overflow, 0 console issue, tap ≥44px, reduced-motion OK, fps4x 60,4)

## Bug yang ditemukan & diperbaiki saat QA akhir
1. Easter egg jam "LEMBUR": tick() tiap detik menimpa tampilan LEMBUR → tick() sekarang lewati saat lembur=true.
2. Clock di-destroy oleh bootFx lalu hidup lagi 6 dtk kemudian (listener mati sesaat) → clock init sekali di boot(), keluar dari daftar destroys.
3. Debug param ?nofx/?fx dihapus sebelum deploy.

## Keputusan konflik aturan
- Widget astrowind tidak dipakai untuk inti tool (v3 blacklist "hero + 3 kartu" vs mandat body; ATURAN 0 v5 #8: anti-slop menang — template dipakai sebagai scaffold: Layout, Fonts API, config, build).
- Pin ScrollTrigger dibuang demi CLS (v4 vs v5 budget performa; yang lebih ketat menang).
- Pan horizontal pinned diganti drag inertia strip pengumuman (fungsi setara, lebih ringan).

## Dipangkas
- Lapisan F (shader/fisika) — tidak dibutuhkan konsep.
- Mode blind-count & foto bukti (temuan riset Inveck) — di luar cakupan MVP; dicatat untuk iterasi.

## Putaran rombak
1. overflow-x di semua viewport (station-bar nowrap; kartu .cut bikin kolom implisit; rail-div scale) → diperbaiki, qa.js lolos.
2. CLS 0,36 dari init motion → pin dibuang, kartu di-SSR identik, scramble awal kartu dimatikan. (Skor Lighthouse akhir di bawah.)
