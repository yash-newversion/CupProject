import React from 'react';

export default function AnnouncementBar() {
  return (
    <div className="w-full bg-[#4C5528] text-white py-1.5 px-4 sm:px-8 text-xs font-medium border-b border-[#3D451E] relative z-50">
      <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-4">
        {/* Left Announcements */}
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none whitespace-nowrap">
          <div className="flex items-center gap-1.5">
            {/* Leaf Sprout Icon */}
            <svg className="w-3.5 h-3.5 fill-current text-white/90 shrink-0" viewBox="0 0 24 24">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66C7.6 17.5 9.5 12.5 17 11V8z" />
              <path d="M21 3C11.5 3 7 9.5 7 16c0 .55.45 1 1 1s1-.45 1-1c0-5.5 3.5-11 12-11V3z" />
            </svg>
            <span>Good Food. Good Mood. – Discover Our Fresh Collection</span>
          </div>
          <span className="text-white/40 hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5">
            {/* Delivery Truck Icon */}
            <svg className="w-4 h-4 fill-current text-white/90 shrink-0" viewBox="0 0 24 24">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
            </svg>
            <span>Free Shipping on Orders Above ₹999</span>
          </div>
        </div>

        {/* Right Social Media Icons */}
        <div className="flex items-center gap-2 text-white shrink-0">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-5 h-5 rounded-full border border-white/80 flex items-center justify-center hover:bg-white/20 transition-colors"
            title="Instagram"
          >
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-5 h-5 rounded-full border border-white/80 flex items-center justify-center hover:bg-white/20 transition-colors"
            title="Facebook"
          >
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z" />
            </svg>
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-5 h-5 rounded-full border border-white/80 flex items-center justify-center hover:bg-white/20 transition-colors"
            title="YouTube"
          >
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
