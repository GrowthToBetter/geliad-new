import Link from "next/link";

export const contact = "6285106655664";

export default function Footer() {
  return (
    <footer className="border-t bg-secondary text-black">
      <div className="container mx-auto px-4 md:px-6 lg:px-20 max-w-7xl py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-6">
          {/* Brand Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold tracking-[0.2rem]">GELIAD</h3>
              <p className="text-xs text-gray-500 tracking-wider">
                Menciptakan generasi hebat, Dari tugas Jadi karya
              </p>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Platform digital yang menghubungkan siswa, guru, dan validator dalam 
              mengelola karya akademik dengan sistem manajemen yang efisien dan efektif.
            </p>
          </div>

          {/* Navigation Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-primary">Navigasi</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-500 hover:text-black transition-colors duration-200"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/AjukanKarya"
                  className="text-sm text-gray-500 hover:text-black transition-colors duration-200"
                >
                  Ajukan Karya
                </Link>
              </li>
              <li>
                <Link
                  href="/ListKarya"
                  className="text-sm text-gray-500 hover:text-black transition-colors duration-200"
                >
                  List Karya
                </Link>
              </li>
              <li>
                <Link
                  href="/pengembang"
                  className="text-sm text-gray-500 hover:text-yellow-400 transition-colors duration-200"
                >
                  Developers
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Support Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-primary">Bantuan & Dukungan</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/panduan"
                  className="text-sm text-gray-500 hover:text-black transition-colors duration-200"
                >
                  Panduan Pengguna
                </Link>
              </li>
              <li>
                <Link
                  href="/profile/notification/Karya"
                  className="text-sm text-gray-500 hover:text-black transition-colors duration-200"
                >
                  Notifikasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-primary">Kontak & Informasi</h3>
            <div className="space-y-3">
              <address className="not-italic text-sm text-gray-500 leading-relaxed">
                <strong className="text-black">Muhammad Chusni Agus, M.Pd., Gr.</strong>
                <br />
                Malang, Jawa Timur
                <br />
                Indonesia
              </address>
              
              <div className="space-y-1">
                <p className="text-xs text-gray-400">WhatsApp:</p>
                <Link 
                  href={`https://wa.me/${contact}`}
                  className="text-sm text-green-400 hover:text-green-300 transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +{contact}
                </Link>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-gray-400">Email Support:</p>
                <Link 
                  href="mailto:support@geliad.edu"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  support@geliad.edu
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="border-t border-gray-600 pt-6 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-primary">Tentang Platform</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                GELIAD adalah platform manajemen karya akademik yang dirancang khusus 
                untuk mendukung proses pembelajaran dan validasi karya siswa dengan 
                teknologi modern dan user-friendly interface.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-primary">Fitur Utama</h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Upload dan Manajemen File Karya</li>
                <li>• Sistem Validasi Otomatis</li>
                <li>• Notifikasi Real-time</li>
                <li>• Dashboard Interaktif</li>
                <li>• Multi-format Support (DOC, PDF, Image, Link)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="pt-4 border-t border-gray-600 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} GELIAD Platform. All rights reserved.
            </p>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <Link 
                href="/terms" 
                className="hover:text-gray-500 transition-colors duration-200"
              >
                Syarat & Ketentuan
              </Link>
              <span>•</span>
              <Link 
                href="/privacy" 
                className="hover:text-gray-500 transition-colors duration-200"
              >
                Kebijakan Privasi
              </Link>
              <span>•</span>
              <span>
                Ver. 2.0.1
              </span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500 italic">
              {'"Transforming student work into meaningful achievements through digital innovation"'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}