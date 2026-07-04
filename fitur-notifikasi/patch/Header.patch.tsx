// PATCH — ganti baris ini di Header.tsx:
//
//   <button className="w-full text-center text-sm text-[#DC3545] font-semibold hover:text-[#C23B3B] py-2">
//     Lihat semua notifikasi
//   </button>
//
// Menjadi:

import Link from "next/link";

<Link
  href="/notifications"
  onClick={() => {
    setNotifClosing(true);
    setTimeout(() => {
      setNotifOpen(false);
      setNotifClosing(false);
    }, 200);
  }}
  className="w-full text-center block text-sm text-[#DC3545] font-semibold hover:text-[#C23B3B] py-2 transition-colors"
>
  Lihat semua notifikasi
</Link>
