# BRIEF — STOKOPNAME "Depo 32" — 2026-11-01

## Masalah/usecase (1 kalimat + siapa yang kena)
Pemilik warung/UMKM menghitung stok manual di kertas lalu salah hitung selisih & nilai selisihnya — mereka butuh stock opname offline di HP yang langsung memberi tahu barang mana yang cocok, selisih, atau menipis.

## Konsep visual (1 kalimat)
Seluruh situs = satu papan keberangkatan stasiun Swiss untuk sebuah depo gudang — tiap barang adalah "perjalanan" bernomor gerbong, stok tercatat vs fisik = jadwal vs realisasi, selisih = keterlambatan, stok menipis = perjalanan dibatalkan.

## Hasil seed (ringkas, seed 2026-11-14 lolos pick-seed 2 penolakan)
- domain: jadwal KRL | layout: bento asimetris dipotong | referensi: Swiss/International Style
- batasan: layout miring 3-8 derajat
- gerak: A zoom-through teks jadi pintu | B marquee ikon SVG + teks | C scramble/decode | D drag inertia flick | E curtain wipe antar section
- ikon: hand-drawn goyang (feTurbulence), custom hand-built SVG
- font: Esteban (display) / Catamaran (body) / Playwrite DE Grund Guides (aksen tulisan tangan mandor)
- palet: dark/triadic hue 32 — bg oklch(0.15 0.059 32), surface 0.21, teks 0.94, muted 0.65, aksen hijau sinyal oklch(0.60 0.266 152), aksen-2 violet oklch(0.58 0.235 272), pop cyan oklch(0.85 0.236 188)

## 3 arah desain (2 kalimat masing-masing) + arah terpilih
1. **Koran kuning pasar loak** — papan skor kampung untuk stok; meriah tapi terlalu mirip SKORKAMPUNG (10-31) dan Loakan (10-18). Terlalu dekat dengan build kemarin.
2. **Struk thermal kasir** — opname sebagai struk belanja raksasa; dekat dengan NotaCepat (10-31, keluarga tool yang sama) dan ZakatKu (resi disobek). Risiko sekeluarga.
3. **Papan keberangkatan stasiun Swiss untuk depo** — TERPILIH. Paling jauh dari 14 build terakhir (tidak ada yang pakai metafora transportasi + Swiss grid), menyatu alami dengan domain seed "jadwal KRL", dan memberi kosakata interaksi yang kaya (peron, gerbong, keterlambatan, pembatalan) untuk status stok.

## Keputusan berani
Tanpa navbar & tanpa hero marketing — pengunjung langsung dilempar ke papan keberangkatan raksasa yang ISINYA adalah tool opname itu sendiri; navigasi = tab "jalur" (MASUK / OPNAME / RIWAYAT) seperti papan peron. Teks display raksasa "DEPO 32" berfungsi sebagai PINTU: scroll = zoom-through masuk ke dalam papan.

## Persona/suara
**Pak Mandor** — mandor depo yang galak tapi teliti. Bicara singkat, perintah, pakai istilah kereta: "gerbong" (barang), "cocok!" (tidak selisih), "telat 3 dus!" (selisih), "jalur ditutup" (stok habis). Error: "Nama gerbong kosong. Isi dulu, jangan ngelamun." Empty: "Depo masih kosong. Daftarkan gerbong pertama."

## Palet (harmoni, kenapa, psikologi warna, token final, kontras AA)
- Harmoni triadic hue 32 (coklat depo malam → hijau sinyal → violet → cyan). Psikologi: malam di depo — lampu sinyal hijau = aman/cocok, violet = perhatian/selisih, cyan = pengumuman.
- Token final: --bg oklch(0.15 0.059 32), --surface oklch(0.21 0.040 32), --text oklch(0.94 0.020 32), --muted oklch(0.65 0.030 32), --accent oklch(0.60 0.266 152), --accent2 oklch(0.58 0.235 272), --pop oklch(0.85 0.236 188). Proporsi 60-30-10: bg/surface dominan, teks, aksen hijau.
- Kontras AA (dihitung, bukan feeling): teks/bg ≈ 15:1, muted/bg ≈ 7:1, aksen hijau/bg ≈ 7:1 (lolos teks kecil), aksen-2 & pop hanya untuk elemen besar/badge.

## Font (display/body/aksen, alasan, id Fontsource, variable/bukan)
- Display: **Esteban** (serif roman — seperti poster jadwal kereta lawas; bukan grotesque generik). id: esteban.
- Body: **Catamaran** 400+700 (humanist sans, x-height lega, terbaca di HP). id: catamaran.
- Aksen: **Playwrite DE Grund Guides** 400 (coretan tangan Pak Mandor di pinggir papan). id: playwrite-de-grund-guides.
- Via Astro Fonts API (self-host, subset latin). Maks 3 family.

## Ikon (gaya, sumber, daftar 12+ ikon, 3+ custom)
- Gaya: hand-drawn goyang, outline 2px, filter feTurbulence+feDisplacementMap; sumber: custom hand-built SVG (didelegasikan ke subagent ikon).
- 14 ikon: box, barcode, shelf, clipboard-check, scale, warning-triangle, check-stamp, forklift, magnifier, plus-circle, download, printer, share-link, clock. Custom domain: check-stamp, shelf, forklift digambar dari nol untuk depo.

## Gerak (kategori A-F, narasi, MODE RINGAN)
- Narasi penyatu: **"masuk ke dalam depo"** — scroll = berjalan melewati pintu papan menuju meja mandor; marquee = pengumuman peron; scramble = papan flip angka; drag = menggeser strip pengumuman; stempel = cap mandor.
- A: zoom-through — teks "DEPO 32" raksasa di-scale 1→8 sebagai pintu ke papan (scrub).
- B: 2 band marquee (ikon SVG + teks pengumuman peron) arah berlawanan + skew ikut velocity scroll + tombol jeda.
- C: scramble/decode untuk angka jam stasiun & total nilai selisih; split-kata reveal untuk headline.
- D: strip pengumuman bisa di-drag dengan inertia/flick (touch-action pan-y); magnetic di tombol "Tutup Buku".
- E: curtain wipe antar section (MASUK→OPNAME→RIWAYAT) + clip-path lingkaran untuk stempel hasil.
- F: dipangkas (aturan pemangkasan).
- MODE RINGAN: matikan A zoom & F; marquee jadi statis; scramble diganti teks langsung.

## Storyboard hero moment
| Scroll | Terlihat | Kamera | Marquee | Teks | Interaksi |
|---|---|---|---|---|---|
| 0% | "DEPO 32" raksasa + jam stasiun hidup | — | band pengumuman jalan | scramble jam | — |
| 25% | huruf D-E-P-O membesar menelan layar | zoom 1→4 scrub | makin cepat + skew | — | — |
| 50% | melewati "pintu" — wipe | zoom 4→8, curtain wipe | — | headline decode | — |
| 75% | papan keberangkatan (tool opname) penuh | settle 1 | 2 band berlawanan | angka odometer | tambah gerbong |
| 100% | meja mandor: ringkasan + Tutup Buku | — | — | — | stempel jatuh |

Pertunjukan utama di 50%: melewati pintu teks. 5 detik pertama: jam stasiun berdetak + "DEPO 32" sebesar layar + pengumuman berjalan — orang langsung paham ini "stasiun untuk barang".

## Konten (15+ item nyata contoh, easter egg)
18 barang contoh warung (label "contoh"): Indomie Goreng (dus/40), Beras 5kg (karung), Minyak Goreng 2L (kardus/12), Gula Pasir 1kg (karung/20), Kopi Kapal Api 165g (renteng), Teh Botol Sosro (krat/24), Aqua 600ml (dus/24), Telur Ayam (kg), Terigu Segitiga 1kg (bal/12), Kecap Bango 620ml (dus/12), Mie Sedaap (dus/40), Chitato 68g (dus/20), Susu Ultra 1L (dus/12), Sabun Lifebuoy (lusin), Rinso 800g (dus/12), Minyak Kayu Putih 60ml (lusin), Kopi ABC Susu (renteng), Garam Cap Kapal (bal/20). Harga modal = contoh, bisa diubah.
Easter egg: klik jam stasiun 5x → jam menampilkan "LEMBUR" + toast Pak Mandor: "Masih di depo jam segini? Rajin."

## Teknik visual orisinal (2+)
1. SVG filter feTurbulence + feDisplacementMap ("goyang") di semua ikon & garis ornamen — tidak ada garis lurus sempurna.
2. Papan flip angka jam stasiun (split-flap ala Swiss) digambar murni CSS/SVG, berdetak tiap detik.
3. Pola "rel" berulang sebagai divider section (repeating-linear-gradient + mask), miring 4°.

## Suara
Tidak (tetap mute; fokus ke gerak).

## Fungsi (v2 FASE 1 — checklist implementasi)
- CRUD gerbong (nama, satuan, harga modal, stok tercatat, stok fisik, ambang) + validasi suara mandor
- Selisih & nilai selisih otomatis per baris + total; status COCOK/SELISIH/MENIPIS/HABIS
- Cari, filter status, urut (nama/selisih/nilai)
- Tutup Buku → stempel hasil + ringkasan; simpan sesi ke riwayat (localStorage key `stokopname/v1`, try/catch + cek skema)
- Deep-link ?gudang= (base64url JSON, maks 12 gerbong untuk share; validasi skema)
- Ekspor CSV/JSON, cetak laporan (print CSS), salin ringkasan WA (fallback textarea)
- Empty/loading/error state; tombol utama <3 detik terlihat
- Toggle gerak, jeda marquee, skip link, keyboard penuh, reduced-motion
