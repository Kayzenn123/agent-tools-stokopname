# Riset Desain — StokOpname (Papan Keberangkatan Stasiun Swiss)

## 1. SBB departure board DIY — doruk.ch
https://doruk.ch/blog/sbb-transport-board

- Yang bisa dicuri: LED oranye/kuning di atas dark background = identitas visual instant "stasiun"; tiap baris = line number + destinasi + countdown dalam menit, tanpa dekorasi.
- Warna status bukan biner: delay merah, "GO NOW zone" (3–6 menit) hijau berdenyut — zona keputusan, bukan sekadar info. Analoginya: selisih >5% = merah, stok menipis = kuning, "siap hitung" = hijau.
- Tiap baris selalu menampilkan penyebab + konteks (nomor jalur + tujuan), sehingga glance 2 detik cukup. Formulir opname harus sama: angka fisik + book qty dalam satu baris.
- LED-dot / fosfor-glow pada teks membuat dark mode terasa fisik, bukan flat. Glow tipis pada angka besar = depth.
- Ticker berjalan di bawah untuk pesan konteks (crypto/weather di referensi; di kita: ringkasan selisih global).

## 2. Inveck — inventory verification dipakai nyata (5.000+ user)
https://inveck.com/

- Yang bisa dicuri: alur "milestone" 5 langkah (upload book stock → alokasi rak → count → rekonsiliasi → laporan) — opname warung = sesi opname per rak dengan progres %.
- Formulir opname cepat di HP: search by code/nama, scan barcode, input angka saja — bukan form panjang. Tombol +/- stepper (lihat Rapid Inventory: https://www.tec-it.com/en/software/mobile-data-acquisition/rapid-inventory/manual/Default.aspx) jauh lebih cepat dari keyboard numerik manual.
- Blind count: kuantitas book disembunyikan agar counter jujur. Setuju untuk mode "verifikasi independen".
- Entry yang hilang bisa ditambahkan di lantai ("floor-to-sheet item") — jangan blokir input barang baru.
- Bukti = foto + timestamp + nama verifier + tanda tangan, lalu count DIKUNCI. Rekonsiliasi menampilkan book vs counted + tombol Accept/Recount per baris.

## 3. Josef Müller-Brockmann — sistem grid SBB (1980) & Swiss Style
https://madegooddesigns.com/josef-muller-brockmann/ · https://www.lars-mueller-publishers.com/fahrgastinformationssystempassenger-information-system-0

- Yang bisa dicuri: grid dibangun dari ukuran huruf (field height = kelipatan line-height), bukan kolom asal. Semua angka rata kanan di sumbu yang sama — keterlambatan terbaca dari misalignment, bukan label.
- Asimetri seimbang: blok besar teks kiri, whitespace kanan — bento StokOpname: kartu status besar kiri, daftar baris rapat kanan.
- Satu ide kuat per tampilan; tanpa ornamen. Ekspresi (ikon hand-drawn goyang, elemen miring) adalah "sinyal masalah", bukan gaya default.
- Palet ketat 2–3 warna + hitam/putih: di SBB = merah sinyal (#EB0000) sebagai satu-satunya aksen. Di kita: merah = selisih/keterlambatan, kuning = peringatan (dibatalkan/menipis), hijau = ok, putih = teks.
- Tipografi objektif sans-serif, angka tabular besar — jadwal vs realisasi bersebelahan seperti timetable.

## Aturan main visual untuk build ini

Grid ketat ala Müller-Brockmann sebagai fondasi: angka tabular rata kanan, whitespace luas, maksimal 3 warna sinyal (merah selisih, kuning dibatalkan/menipis, hijau cocok). Di atas fondasi itu, lapis "keberangkatan": tiap barang = satu baris timetable bernomor gerbong, book vs fisik = scheduled vs actual dengan glow LED oranye di dark background, selisih = keterlambatan merah. Elemen miring 3–8° dan ikon hand-drawn goyang DIPAKAI HEMAT — hanya untuk menandai barang bermasalah (dibatalkan/selisih besar), seperti stamp manual di papan stasiun. Formulir input HP mengikuti Inveck: stepper +/− besar, search/scan cepat, blind count opsional, satu baris = satu aksi. Warna tidak pernah dipakai dekoratif: tiap warna = satu arti, selamanya.
