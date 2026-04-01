// ── FooterSection.jsx ───────────────────────────────────────────────────────
// Contains: MEDIA, USEFUL LINKS, OUR CONTACTS, Copyright + Terms/PAIA
// Design: dark zinc-900 background, same as screenshot
// ───────────────────────────────────────────────────────────────────────────

import { TwitterIcon, FacebookIcon, PhoneIcon, MailIcon, ChevronRight } from "./Shared";

export default function FooterSection() {
  return (
    <div className="bg-zinc-900 text-white px-5 pt-8 pb-12">

      {/* ── MEDIA ── */}
      <div className="mb-8">
        <h2 className="text-xs font-black tracking-widest uppercase text-white mb-1">
          MEDIA
        </h2>
        <div className="w-16 h-px bg-gray-700 mb-4" />
        <div className="flex flex-col">
          <a
            href="#"
            className="flex items-center gap-4 py-3.5 border-b border-gray-800 hover:text-orange-400 transition-colors"
          >
            <TwitterIcon />
            <span className="text-gray-300 text-sm">Follow us on X</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-4 py-3.5 hover:text-orange-400 transition-colors"
          >
            <FacebookIcon />
            <span className="text-gray-300 text-sm">Like us on Facebook</span>
          </a>
        </div>
      </div>

      {/* ── USEFUL LINKS ── */}
      <div className="mb-8">
        <h2 className="text-xs font-black tracking-widest uppercase text-white mb-1">
          USEFUL LINKS
        </h2>
        <div className="w-20 h-px bg-gray-700 mb-4" />
        {["About Us", "Our Services", "Frequently Asked Questions"].map((link, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-3.5 border-b border-gray-800 cursor-pointer hover:text-orange-400 transition-colors group"
          >
            <span className="text-gray-300 text-sm group-hover:text-orange-400 transition-colors">
              {link}
            </span>
            <span className="text-gray-600 group-hover:text-orange-400 transition-colors">
              <ChevronRight />
            </span>
          </div>
        ))}
      </div>

      {/* ── OUR CONTACTS ── */}
      <div>
        <h2 className="text-xs font-black tracking-widest uppercase text-white mb-1">
          OUR CONTACTS
        </h2>
        <div className="w-20 h-px bg-gray-700 mb-4" />
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 flex-shrink-0">
              <PhoneIcon />
            </div>
            <span className="text-gray-300 text-sm">(+27) 087 237 7011</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 flex-shrink-0">
              <MailIcon />
            </div>
            <span className="text-gray-300 text-sm">team@paycity.co.za</span>
          </div>
        </div>
      </div>

      {/* ── Copyright + Terms + PAIA ── */}
      <div className="mt-10 pt-6 border-t border-gray-800 text-center">
        <p className="text-gray-500 text-xs mb-3">
          All Content Copyright Syntell (Pty.) Ltd.
        </p>
        <div className="flex items-center justify-center gap-3">
          <a href="#" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">
            Terms and Conditions
          </a>
          <span className="text-gray-700 text-xs">|</span>
          <a href="#" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">
            PAIA Document
          </a>
        </div>
      </div>

    </div>
  );
}
