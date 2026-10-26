# Angklung Adventure 🎋

Website edukasi interaktif tentang angklung dengan tema hutan bambu, warna hijau-krem, materi budaya, tombol referensi nada digital, rekaman angklung asli berlisensi CC0, mini game mengikuti urutan nada, dan kuis pilihan ganda dengan skor serta pembahasan.

## Menjalankan secara lokal
1. Ekstrak ZIP ini.
2. Buka `index.html` di browser modern.
3. Klik tombol nada pada bagian **Angklung Sound Lab** untuk mengaktifkan audio. Browser biasanya meminta interaksi pengguna sebelum audio dapat diputar.

Tidak ada proses build atau instalasi paket yang diperlukan. Google Fonts memerlukan internet; tanpa internet website tetap berjalan dengan font cadangan.

## Publikasikan ke GitHub Pages
1. Buat repository baru di GitHub.
2. Unggah `index.html`, `style.css`, `script.js`, dan folder `assets` (jika ada) ke root repository.
3. Buka **Settings → Pages**.
4. Pada bagian build/deployment, pilih **Deploy from a branch**, pilih branch `main` dan folder `/(root)`, lalu simpan.
5. Tunggu deployment selesai, kemudian buka URL GitHub Pages yang ditampilkan.

## Fitur
- Navigasi responsif dan menu mobile.
- Kartu materi sejarah, cara bermain, dan nilai kebersamaan dengan modal.
- Tombol Do–Si menggunakan nada referensi digital melalui Web Audio API; tombol pemutar terpisah memainkan rekaman angklung asli dari Wikimedia Commons. Rekaman: “The sound of angklung and Si Cepot” oleh Willaadrian, CC0 1.0. Sumber: https://commons.wikimedia.org/wiki/File:The_sound_of_angklung_and_Si_Cepot.webm.
- Catatan akurasi: rekaman CC0 yang tersedia adalah cuplikan permainan angklung, bukan sampel nada Do–Si yang direkam terpisah. Tombol Do–Si belum diklaim sebagai rekaman angklung asli per nada.
- Mini game “Ikuti Irama Angklung”: dengarkan urutan nada yang dimainkan otomatis, ulangi dengan tombol Do–Si, dan lanjut ke level dengan urutan yang makin panjang. Nada game menggunakan referensi digital, bukan sampel angklung asli per nada.
- Kuis 8 soal, 10 poin per jawaban benar, pembahasan setelah menjawab, progres, hasil, dan tombol main lagi.
- Tidak membutuhkan backend atau API key.

## Catatan konten
Materi diringkas untuk tujuan edukasi. UNESCO mencantumkan Indonesian Angklung pada Daftar Representatif Warisan Budaya Takbenda Kemanusiaan pada 2010. Rekaman asli dimuat dari Wikimedia Commons sehingga koneksi internet diperlukan untuk memutarnya.
