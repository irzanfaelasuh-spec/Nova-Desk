# NOVA DESKTOP

Desktop OS berbasis web: HTML + CSS + JS murni, tanpa build step. Buka `index.html` lewat server statis (mis. GitHub Pages atau `python3 -m http.server`). File System Access API butuh **HTTPS atau localhost**.

## Fitur
- **Desktop Icons & Shortcuts**: ikon bawaan, klik kanan / tekan lama 0,5 dtk, double-click / double-tap, drag & drop (di HP: tekan lama lalu geser), rename inline (F2), Remove from Desktop (aplikasi tetap ada), Delete Shortcut ke Recycle Bin (salinan), Pin to Desktop dari Start Menu, Pin/Unpin Taskbar, Properties, View/Sort by/Auto arrange/Align to grid/Show icons, Personalize, Reset Desktop. Semua tersimpan di `localStorage`.
- **File Explorer**: memilih folder asli lewat `showDirectoryPicker` (izin baca/tulis diminta eksplisit). Kategori dihitung dari file nyata. Open/preview, rename, hapus (dengan konfirmasi), salin, pindah, folder baru, ekstrak ZIP, cari, urut, pilih ganda, bagikan/unduh.
- **Window manager**: geser, resize (desktop), minimize, maximize, taskbar, single-instance.

## Batasan jujur
- Website biasa **tidak** bisa membaca seluruh penyimpanan HP atau folder terproteksi Android. Hanya folder yang kamu pilih.
- Rename/hapus/salin/pindah/ekstrak ke folder asli hanya di **Chrome/Edge desktop** (File System Access API). Di browser lain (Firefox, Safari, Chrome Android) File Explorer berjalan **baca-saja** lewat `<input type=file>`; aksi tulis dinonaktifkan dan dijelaskan di UI.
- Penghapusan **permanen**; browser tidak punya Trash sistem, dan NOVA tidak berpura-pura punya.
- ZIP: metode Stored/Deflate via `DecompressionStream`; path berbahaya (`..`, absolut) ditolak (anti ZIP Slip). RAR/7Z/ZIP64 belum didukung.
- `Notepad.exe` adalah representasi virtual NOVA, bukan executable Windows.
- My Computer hanya menampilkan info yang dilaporkan browser.

## Jalur native Android
Bungkus dengan Capacitor, lalu pakai plugin filesystem + Storage Access Framework (izin `READ_MEDIA_*` / `ACTION_OPEN_DOCUMENT_TREE`). Adapter di `mkFiles` (scan/rename/delete/copy) adalah titik tukar untuk implementasi native.

## Belum ada
Favorites & Trash internal File Explorer, drag-and-drop file, folder virtual di desktop, Terminal/WAVE Music/Games/Control Panel.
