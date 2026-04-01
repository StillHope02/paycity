// ── HeroSection.jsx ─────────────────────────────────────────────────────────

import { useState } from "react";
import { SearchIcon, PayCityLogo, Spinner, MOCK_DB } from "./Shared";
import { ChevronLeft } from "./Shared";
import { Toast } from "./Shared";

// ── Payment Modal ──────────────────────────────────────────────────────────
const PaymentModal = ({ fines, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("card");
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);

  const total = fines.reduce((s, f) => s + f.amount, 0);

  const handlePay = () => {
    if (method === "card" && (!cardNum || !expiry || !cvv)) return;
    setProcessing(true);
    setTimeout(() => { setProcessing(false); onSuccess(); }, 2000);
  };

  const formatCard = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/60 flex items-end justify-center" onClick={onClose}>
      <div className="w-full max-w-sm bg-white rounded-t-3xl pb-8 pt-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-5" />
        {step === 1 && (
          <div className="px-5">
            <h2 className="text-lg font-black text-gray-800 mb-1">Review & Pay</h2>
            <p className="text-gray-400 text-sm mb-4">{fines.length} fine{fines.length > 1 ? "s" : ""} selected</p>
            <div className="space-y-2 mb-4 max-h-44 overflow-y-auto">
              {fines.map(f => (
                <div key={f.ref} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{f.desc}</p>
                    <p className="text-xs text-gray-400">{f.ref}</p>
                  </div>
                  <span className="text-sm font-black text-red-600">R {f.amount}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center bg-orange-50 rounded-xl px-4 py-3 mb-5 border border-orange-100">
              <span className="font-bold text-gray-700">Total Due</span>
              <span className="text-xl font-black text-orange-500">R {total.toFixed(2)}</span>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Select Payment Method</p>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {[{ id: "card", label: "💳 Card" }, { id: "ozow", label: "🔗 Ozow" }, { id: "eft", label: "🏦 EFT" }].map(m => (
                <button key={m.id} onClick={() => setMethod(m.id)}
                  className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${method === m.id ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"}`}>
                  {m.label}
                </button>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl transition-colors text-base">
              Continue →
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="px-5">
            <button onClick={() => setStep(1)} className="flex items-center gap-1 text-orange-500 text-sm font-semibold mb-4">
              <ChevronLeft /> Back
            </button>
            <h2 className="text-lg font-black text-gray-800 mb-4">
              {method === "card" ? "Card Details" : method === "ozow" ? "Ozow EFT" : "Bank Transfer"}
            </h2>
            {method === "card" && (
              <div className="space-y-3 mb-5">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Card Number</label>
                  <input value={formatCard(cardNum)} onChange={e => setCardNum(e.target.value.replace(/\s/g, ""))}
                    placeholder="0000 0000 0000 0000"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Expiry</label>
                    <input value={formatExpiry(expiry)} onChange={e => setExpiry(e.target.value)} placeholder="MM/YY"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">CVV</label>
                    <input value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="•••" type="password"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors" />
                  </div>
                </div>
              </div>
            )}
            {method === "ozow" && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5 text-sm text-blue-700">
                You will be redirected to Ozow's secure payment portal to complete your EFT payment instantly.
              </div>
            )}
            {method === "eft" && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5 text-sm text-gray-700 space-y-1">
                <p><span className="font-bold">Bank:</span> First National Bank</p>
                <p><span className="font-bold">Branch:</span> 250655</p>
                <p><span className="font-bold">Account:</span> 62847291003</p>
                <p><span className="font-bold">Reference:</span> {fines[0]?.ref}</p>
              </div>
            )}
            <div className="flex justify-between items-center bg-orange-50 rounded-xl px-4 py-3 mb-4 border border-orange-100">
              <span className="text-sm font-bold text-gray-700">Amount Due</span>
              <span className="font-black text-orange-500 text-lg">R {total.toFixed(2)}</span>
            </div>
            <button onClick={handlePay} disabled={processing}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-black py-4 rounded-2xl transition-colors flex items-center justify-center gap-2 text-base">
              {processing
                ? <><div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Processing...</>
                : `Pay R ${total.toFixed(2)}`}
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">🔒 Secured by Mastercard, Visa & Ozow EFT</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Pending Fines Page (screenshot se match) ───────────────────────────────
const PendingFinesPage = ({ result, onBack }) => {
  const [showModal, setShowModal] = useState(false);
  const [paidRefs, setPaidRefs] = useState([]);
  const [toast, setToast] = useState(null);

  const outstanding = result.fines.filter(f => f.status === "outstanding" && !paidRefs.includes(f.ref));
  const fine = outstanding[0];

  // 50% discount as per legislation note
  const discounted = fine ? fine.amount * 0.5 : 0;

  const handleSuccess = () => {
    if (!fine) return;
    setPaidRefs(p => [...p, fine.ref]);
    setShowModal(false);
    setToast({ msg: `Payment of R ${discounted.toFixed(2)} successful! ✓`, type: "success" });
    setTimeout(() => setToast(null), 5000);
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-sm bg-white min-h-screen flex flex-col">

        {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        {showModal && fine && (
          <PaymentModal
            fines={[{ ...fine, amount: discounted }]}
            onClose={() => setShowModal(false)}
            onSuccess={handleSuccess}
          />
        )}

        {/* ── Sticky Header ── */}
        <div className="px-5 pt-6 pb-4 bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
          <PayCityLogo size="lg" />
        </div>

        {/* ── Page Content ── */}
        <div className="flex-1 px-5 pt-5 pb-32">

          {/* Back button */}
          <button onClick={onBack} className="flex items-center gap-1 text-orange-500 text-sm font-semibold mb-5">
            <ChevronLeft /> Back to Search
          </button>

          <h1 className="text-2xl font-bold text-gray-800 mb-6">Pending Fines</h1>

          {outstanding.length === 0 ? (
            <div className="text-center py-14">
              <div className="text-6xl mb-4">✅</div>
              <p className="font-black text-gray-700 text-lg">No Outstanding Fines</p>
              <p className="text-sm text-gray-400 mt-1">This account is completely clear</p>
            </div>
          ) : (
            <>
              {/* ── Fines Table ── */}
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 w-2/5 align-top">Description</td>
                      <td className="px-4 py-3 text-gray-600">{fine.desc}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 align-top">Deadline</td>
                      <td className="px-4 py-3 text-gray-600">{fine.date}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 align-top">Notice Number</td>
                      <td className="px-4 py-3 text-gray-600 font-mono text-xs break-all">{fine.ref}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 align-top">Original Fine</td>
                      <td className="px-4 py-3">
                        <span className="text-red-500 font-semibold line-through">R {fine.amount}</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 align-top">Discounted Fine</td>
                      <td className="px-4 py-3">
                        <span className="text-red-600 font-bold text-base">R {discounted.toFixed(0)}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ── Important Notice ── */}
              <p className="text-xs text-gray-500 leading-relaxed mb-8">
                **IMPORTANT: According to current legislation, if the offender pays within the first three days,
                the value will be reduced by 50% of the minimum amount. Not paying the traffic fine on time will
                result in additional costs and transit restrictions.
              </p>
            </>
          )}
        </div>

        {/* ── Sticky Next Step Button ── */}
        {outstanding.length > 0 && (
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm px-5 pb-6 pt-4 bg-white border-t border-gray-100 shadow-2xl">
            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-4 rounded-lg transition-all shadow-lg shadow-orange-200 text-base"
            >
              Next Step
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── HeroSection (main export) ──────────────────────────────────────────────
export default function HeroSection() {
  const [selectedType, setSelectedType] = useState("TRN");
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const enquiryTypes = [
    { id: "RSA", label: "RSA ID Number" },
    { id: "BRN", label: "Business Registration Number (BRN)" },
    { id: "TRN", label: "Traffic Registration Number (TRN)" },
  ];

  const placeholderMap = {
    RSA: "Please enter RSA ID Number",
    BRN: "Please enter Business Registration Number (BRN)",
    TRN: "Please enter Traffic Registration Number (TRN)",
  };

  const handleSearch = () => {
    const val = searchValue.trim();
    if (!val) { setError("Please enter a valid number to search."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => {
      const found = MOCK_DB[selectedType]?.[val];
      setLoading(false);
      if (found) {
        setResult(found);
      } else {
        setError(`No records found for "${val}". Try one of the demo values below.`);
      }
    }, 1400);
  };

  // ── Show Pending Fines page after successful search ──
  if (result) {
    return (
      <PendingFinesPage
        result={result}
        onBack={() => { setResult(null); setSearchValue(""); setError(""); }}
      />
    );
  }

  return (
    <>
      {/* ── Sticky Logo Header ── */}
      <div className="px-5 pt-6 pb-4 bg-white sticky top-0 z-50 shadow-sm">
        <PayCityLogo size="lg" />
      </div>

      {/* ── Hero Road Background ── */}
      <div
        className="relative"
        style={{
          background: "linear-gradient(180deg,#6b7c5a 0%,#8b9467 20%,#c4a882 60%,#d4b896 100%)",
          minHeight: 440,
        }}
      >
        {/* Orange network lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 375 440" preserveAspectRatio="xMidYMid slice">
            <g stroke="#e8650a" strokeWidth="1.5" fill="none" opacity="0.65">
              <line x1="187" y1="220" x2="50" y2="120" />
              <line x1="187" y1="220" x2="320" y2="110" />
              <line x1="187" y1="220" x2="80" y2="400" />
              <line x1="187" y1="220" x2="300" y2="410" />
              <line x1="187" y1="220" x2="20" y2="270" />
              <line x1="187" y1="220" x2="355" y2="250" />
              <line x1="187" y1="220" x2="150" y2="438" />
              <line x1="187" y1="220" x2="230" y2="438" />
              <circle cx="187" cy="220" r="5" fill="#e8650a" />
              <circle cx="50" cy="120" r="3" fill="#e8650a" />
              <circle cx="320" cy="110" r="3" fill="#e8650a" />
              <circle cx="80" cy="400" r="3" fill="#e8650a" />
              <circle cx="300" cy="410" r="3" fill="#e8650a" />
              <circle cx="20" cy="270" r="3" fill="#e8650a" />
              <circle cx="355" cy="250" r="3" fill="#e8650a" />
            </g>
          </svg>
        </div>

        <div className="relative z-10 px-5 pt-8 pb-10">

          {/* ── Warning Banner — hero ke andar, search type se upar ── */}
          <div className="mb-5 border border-red-300 rounded-xl px-4 py-3 bg-white/90 shadow-sm">
            <p className="text-red-600 text-sm leading-relaxed">
              <span className="text-yellow-500">⚠️</span> There is an outstanding traffic fine. Please pay it immediately.
              Failure to pay will result in hefty fines, license suspension, or even a court summons.
            </p>
          </div>

          <h1 className="text-amber-50 text-xl font-bold tracking-widest mb-6 uppercase">
            SEARCH ENQUIRY TYPE
          </h1>

          {/* Radio buttons */}
          <div className="flex flex-col gap-4 mb-6">
            {enquiryTypes.map(type => (
              <label
                key={type.id}
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => { setSelectedType(type.id); setSearchValue(""); setError(""); }}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${selectedType === type.id ? "border-blue-500 bg-white" : "border-white/80 bg-transparent"}`}>
                  {selectedType === type.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                </div>
                <span className="text-white text-sm font-medium" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
                  {type.label}
                </span>
              </label>
            ))}
          </div>

          {/* Search input */}
          <div className={`flex rounded-full overflow-hidden shadow-lg mb-2 ${error ? "ring-2 ring-red-400" : ""}`}>
            <input
              type="text"
              value={searchValue}
              onChange={e => { setSearchValue(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder={placeholderMap[selectedType]}
              className="flex-1 px-5 py-3.5 text-gray-700 text-sm bg-white outline-none placeholder-gray-400"
            />
            <button
              onClick={handleSearch}
              className="bg-orange-500 hover:bg-orange-600 px-5 flex items-center justify-center text-white transition-colors"
            >
              <SearchIcon />
            </button>
          </div>

          {error && <p className="text-red-200 text-xs font-semibold mb-2 px-2">{error}</p>}

          <p className="text-white/80 text-xs text-center leading-relaxed px-2 mb-4">
            Please provide a valid ID Number, Traffic Registration Number or Business Registration Number.
          </p>

          {loading && <Spinner />}
        </div>
      </div>
    </>
  );
}
