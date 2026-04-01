// ── shared.jsx — icons, logo, mock data, shared components ─────────────────

export const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
  </svg>
);

export const ChevronRight = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export const ChevronLeft = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

export const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

export const MailIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

// ── Logo ───────────────────────────────────────────────────────────────────
export const PayCityLogo = ({ size = "lg" }) => {
  const big = size === "lg";
  return (
    <div>
      <div
        className={`${big ? "text-5xl" : "text-3xl"} font-light text-gray-800 leading-none`}
        style={{ fontFamily: "'Georgia', serif", letterSpacing: "-1px" }}
      >
        pay
        <span className="relative inline-block">
          C
          <span
            className="absolute bg-orange-500 rounded-full"
            style={{ width: big ? 10 : 7, height: big ? 10 : 7, top: big ? -8 : -5, right: big ? -2 : -1 }}
          />
        </span>
        ity
      </div>
      <p
        className="text-gray-400 italic mt-1"
        style={{ fontFamily: "'Georgia', serif", fontSize: big ? 14 : 11 }}
      >
        connected citizens
      </p>
    </div>
  );
};

// ── Spinner ────────────────────────────────────────────────────────────────
export const Spinner = () => (
  <div className="flex justify-center items-center py-10">
    <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
  </div>
);

// ── Toast ──────────────────────────────────────────────────────────────────
export const Toast = ({ msg, type, onClose }) => (
  <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold text-white max-w-xs w-full ${type === "success" ? "bg-green-600" : "bg-red-600"}`}>
    <span>{type === "success" ? "✓" : "✗"}</span>
    <span className="flex-1">{msg}</span>
    <button onClick={onClose} className="text-white/70 hover:text-white">✕</button>
  </div>
);

// ── Mock Database ──────────────────────────────────────────────────────────
export const MOCK_DB = {
  RSA: {
    "8501015001085": {
      name: "Ahmed Hussain",
      id: "8501015001085",
      municipality: "City of Cape Town",
      fines: [
        { ref: "CPT-2024-11847", desc: "Exceeding Speed Limit", location: "N2 Highway", date: "14 Mar 2026", amount: 500, status: "outstanding" },
        { ref: "CPT-2024-11902", desc: "Illegal Parking", location: "Long Street", date: "22 Mar 2026", amount: 180, status: "outstanding" },
      ],
    },
    "9203045002081": {
      name: "Fatima Nkosi",
      id: "9203045002081",
      municipality: "Johannesburg Metro",
      fines: [
        { ref: "JHB-2024-55312", desc: "Running Red Light", location: "William Nicol Dr", date: "02 Apr 2026", amount: 750, status: "outstanding" },
      ],
    },
  },
  BRN: {
    "2015/123456/07": {
      name: "ABC Logistics (Pty) Ltd",
      id: "2015/123456/07",
      municipality: "eThekwini Metro",
      fines: [
        { ref: "ETH-2024-33201", desc: "Overloaded Vehicle", location: "N3 Toll Route", date: "18 Mar 2026", amount: 1200, status: "outstanding" },
        { ref: "ETH-2024-33450", desc: "No Valid Permit", location: "Durban CBD", date: "25 Mar 2026", amount: 650, status: "outstanding" },
        { ref: "ETH-2024-30011", desc: "Illegal Parking", location: "Berea Road", date: "01 Feb 2026", amount: 180, status: "paid" },
      ],
    },
  },
  TRN: {
    "TRN-2024-00847": {
      name: "Sipho Dlamini",
      id: "TRN-2024-00847",
      municipality: "Tshwane Metro",
      fines: [
        { ref: "TSH-2024-20011", desc: "Exceeding Speed Limit", location: "R21 Highway", date: "10 Mar 2026", amount: 500, status: "outstanding" },
      ],
    },
    "TRN-2024-01123": {
      name: "Zanele Mokoena",
      id: "TRN-2024-01123",
      municipality: "City of Ekurhuleni",
      fines: [],
    },
  },
};