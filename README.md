# StokOpname — Depo 32

Stock opname warung & UMKM, 100% offline di browser — dikemas sebagai **papan keberangkatan stasiun Swiss untuk sebuah depo gudang**.

Tiap barang = satu "gerbong" bernomor. Kolom **tercatat** = jadwal di bukumu. Kolom **fisik** = hasil hitunganmu di gudang. Kalau beda, Pak Mandor teriak: selisih = keterlambatan, stok menipis = jalur mau ditutup.

**Live:** https://agent-tools-stokopname.vercel.app (fallback: https://kayzenn123.github.io/agent-tools-stokopname/)

## Fitur

- CRUD gerbong (nama, satuan, harga modal, stok tercatat, stok fisik, ambang menipis)
- Selisih & nilai selisih otomatis per baris + rekap total
- Status: COCOK / SELISIH / MENIPIS / HABIS / BELUM HITUNG — dengan pita status miring ala stempel
- Stepper +/− untuk hitung cepat di HP (temuan riset Inveck)
- Cari, saring status, urut (nama / selisih / nilai)
- Tutup Buku → stempel COCOK/SELISIH + arsip sesi (localStorage, maks 20)
- Deep-link `?gudang=` (snapshot base64url, maks 12 gerbong)
- Ekspor CSV/JSON, cetak laporan, salin ringkasan WA, bagikan tautan
- Validasi suara Pak Mandor, empty/loading/error state
- Toggle gerak, jeda marquee, skip link, keyboard penuh, `prefers-reduced-motion`

## Seed (2026-11-14, lolos pick-seed)

domain **jadwal KRL** · layout **bento asimetris dipotong** · referensi **Swiss/International Style** · batasan **miring 3–8°** · gerak A **zoom-through teks jadi pintu** · B **marquee ikon SVG + teks** · C **scramble/decode** · D **drag inertia flick** · E **curtain wipe** · ikon **hand-drawn goyang custom SVG** · font **Esteban / Catamaran / Playwrite DE Grund Guides** · palet **dark triadic hue 32**

## Tech

Astro 5 (static) + Tailwind v4 + GSAP + ScrollTrigger. Vanilla JS modules (`src/scripts/depo/`): `store.js`, `board.js`, `app.js`, `fx/{camera,marquee,text,input,reveal,clock}.js`. Font self-host via Astro Fonts API. Tanpa tracker, tanpa API key, data di localStorage peramban.

## Skor

- Lighthouse: lihat CRITIQUE.md
- FPS CPU throttle 4x: 56,7
- qa.js: lolos (0 overflow, 0 console issue, tap target ≥44px, reduced-motion OK)

## Jalanin lokal

```bash
npm install
npm run dev    # http://localhost:4321
npm run build  # ./dist
```

Angka & harga bawaan = **contoh** (18 gerbong contoh warung). Ganti dengan notamu sendiri.
Ikon: 14 SVG hand-drawn custom (`src/assets/icons/`), filter `goyang` (feTurbulence + feDisplacementMap).
