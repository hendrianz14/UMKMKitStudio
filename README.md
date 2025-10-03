# UMKM Kits Lite

V1 dari aplikasi UMKM Kits Studio yang dibangun dengan Next.js 14 (App Router), Tailwind CSS, dan integrasi Supabase untuk autentikasi dan data.

## Fitur utama

- Autentikasi email/kata sandi menggunakan Server Actions Supabase.
- Dukungan login Google OAuth dengan penanganan kode di sisi klien.
- Dashboard SSR tanpa cache yang menampilkan data nyata dari Supabase (profil, proyek, transaksi kredit, dan pekerjaan AI).
- Modal onboarding yang menyimpan informasi bisnis ke tabel `profiles`.
- Endpoint diagnosis `/api/_diag/dashboard` untuk memastikan sesi dan profil tersedia.
- Logout melalui route handler yang mengembalikan redirect 303 ke halaman masuk.

## Persiapan lingkungan

Buat file `.env.local` dan isi dengan kredensial Supabase Anda:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Pastikan di dashboard Supabase > Authentication > Redirect URLs menambahkan `http://localhost:3000/auth/callback`.

## Pengembangan

Instal dependensi dan jalankan server pengembangan dengan pnpm:

```bash
pnpm install
pnpm dev
```

Untuk memastikan tipe TypeScript valid, jalankan:

```bash
pnpm typecheck
```

## Produksi

Build aplikasi sebelum deploy:

```bash
pnpm build
```

Deploy di Vercel atau platform pilihan Anda dengan variabel lingkungan yang sama.
