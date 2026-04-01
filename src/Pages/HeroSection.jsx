// ── HeroSection.jsx ─────────────────────────────────────────────────────────
// Contains: PayCity logo, warning banner, road background hero,
//           search enquiry type (radio + input), demo hints box
// ───────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { SearchIcon, PayCityLogo, Spinner, MOCK_DB } from "./Shared";

// ── Payment Modal (used after search → results → pay) ─────────────────────
import { ChevronLeft } from "./Shared";

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

// ── Results Page ───────────────────────────────────────────────────────────
import { Toast } from "./Shared";
import FooterSection from "./FooterSection";

const ResultsPage = ({ result, onBack }) => {
  const [selected, setSelected] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [paidRefs, setPaidRefs] = useState([]);
  const [toast, setToast] = useState(null);

  const outstanding = result.fines.filter(f => f.status === "outstanding" && !paidRefs.includes(f.ref));
  const paid = result.fines.filter(f => f.status === "paid" || paidRefs.includes(f.ref));
  const selectedFines = outstanding.filter(f => selected.includes(f.ref));

  const toggle = (ref) => setSelected(s => s.includes(ref) ? s.filter(r => r !== ref) : [...s, ref]);
  const selectAll = () => setSelected(outstanding.map(f => f.ref));
  const clearAll = () => setSelected([]);

  const handleSuccess = () => {
    const total = selectedFines.reduce((s, f) => s + f.amount, 0);
    setPaidRefs(p => [...p, ...selected]);
    setSelected([]);
    setShowModal(false);
    setToast({ msg: `Payment of R ${total} successful! ✓`, type: "success" });
    setTimeout(() => setToast(null), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-sm bg-white min-h-screen flex flex-col">
        {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        {showModal && <PaymentModal fines={selectedFines} onClose={() => setShowModal(false)} onSuccess={handleSuccess} />}

        {/* Sticky header */}
        <div className="bg-white px-5 pt-5 pb-4 border-b border-gray-100 sticky top-0 z-10">
          <button onClick={onBack} className="flex items-center gap-1 text-orange-500 text-sm font-semibold mb-3">
            <ChevronLeft /> Back to Search
          </button>
          <PayCityLogo size="sm" />
        </div>

        {/* Profile banner */}
        <div className="bg-orange-500 px-5 py-5 text-white">
          <p className="text-orange-100 text-xs uppercase tracking-widest font-bold mb-1">Account Holder</p>
          <h2 className="text-2xl font-black">{result.name}</h2>
          <p className="text-orange-200 text-sm mt-0.5">ID: {result.id}</p>
          <p className="text-orange-200 text-sm">{result.municipality}</p>
          <div className="flex gap-3 mt-4">
            <div className="bg-white/20 rounded-xl px-4 py-2 text-center flex-1">
              <p className="text-white text-xl font-black">{outstanding.length}</p>
              <p className="text-orange-100 text-xs font-medium">Outstanding</p>
            </div>
            <div className="bg-white/20 rounded-xl px-4 py-2 text-center flex-1">
              <p className="text-white text-xl font-black">R {outstanding.reduce((s, f) => s + f.amount, 0)}</p>
              <p className="text-orange-100 text-xs font-medium">Total Due</p>
            </div>
            <div className="bg-white/20 rounded-xl px-4 py-2 text-center flex-1">
              <p className="text-white text-xl font-black">{paid.length}</p>
              <p className="text-orange-100 text-xs font-medium">Paid</p>
            </div>
          </div>
        </div>

        {/* Fines list */}
        <div className="flex-1 px-5 pt-5 pb-32">
          {outstanding.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Outstanding Fines</h3>
                <div className="flex gap-3">
                  {selected.length > 0 && <button onClick={clearAll} className="text-xs text-gray-400 font-semibold">Clear</button>}
                  <button onClick={selected.length === outstanding.length ? clearAll : selectAll} className="text-xs text-orange-500 font-semibold">
                    {selected.length === outstanding.length ? "Deselect All" : "Select All"}
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {outstanding.map(f => (
                  <div key={f.ref} onClick={() => toggle(f.ref)}
                    className={`rounded-2xl border-2 p-4 cursor-pointer transition-all select-none ${selected.includes(f.ref) ? "border-orange-500 bg-orange-50" : "border-gray-100 bg-white hover:border-orange-200"}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-all ${selected.includes(f.ref) ? "bg-orange-500 border-orange-500" : "border-gray-300"}`}>
                        {selected.includes(f.ref) && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <p className="font-black text-gray-800 text-sm leading-tight">{f.desc}</p>
                          <span className="text-red-600 font-black text-base flex-shrink-0">R {f.amount}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5">📍 {f.location}</p>
                        <p className="text-xs text-gray-400">📅 {f.date} · <span className="font-mono">{f.ref}</span></p>
                        <span className="inline-block mt-2 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full">⚠ Outstanding</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-14">
              <div className="text-6xl mb-4">✅</div>
              <p className="font-black text-gray-700 text-lg">No Outstanding Fines</p>
              <p className="text-sm text-gray-400 mt-1">This account is completely clear</p>
            </div>
          )}

          {paid.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Paid Fines</h3>
              <div className="space-y-2">
                {paid.map(f => (
                  <div key={f.ref} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-500 text-sm">{f.desc}</p>
                        <p className="text-xs text-gray-400 mt-0.5 font-mono">{f.ref} · {f.date}</p>
                      </div>
                      <div className="text-right ml-3">
                        <span className="text-sm font-black text-gray-300 line-through block">R {f.amount}</span>
                        <span className="text-xs font-bold text-green-600">✓ Paid</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky pay button */}
        {selected.length > 0 && (
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm px-5 pb-6 pt-4 bg-white border-t border-gray-100 shadow-2xl">
            <button onClick={() => setShowModal(true)}
              className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-orange-200 text-base">
              Pay {selected.length} Fine{selected.length > 1 ? "s" : ""} — R {selectedFines.reduce((s, f) => s + f.amount, 0).toFixed(2)}
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

  if (result) {
    return <ResultsPage result={result} onBack={() => { setResult(null); setSearchValue(""); setError(""); }} />;
  }

  return (
    <>
      {/* ── Logo Header ── */}
      <div className="px-5 pt-6 pb-4 bg-white">
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

       {/* ── Warning Banner ── */}
      <div className="mx-4 border border-gray-200 rounded-xl px-4 py-3 mt-2 bg-white shadow-sm">
        <p className="text-red-600 text-sm leading-relaxed">
          <span className="text-yellow-500">⚠️</span> There is an outstanding traffic fine. Please pay it immediately.
          Failure to pay will result in hefty fines, license suspension, or even a court summons.
        </p>
      </div>
        <div className="relative z-10 px-5 pt-8 pb-10">
          <h1
            className="text-amber-50 text-xl font-bold tracking-widest mb-6 uppercase"
            // style={{ textShadow: "0 2px 8px rgba(0,0,0,0.45)" }}
          >
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

          {/* Demo hints */}
          {/* <div className="bg-black/30 backdrop-blur-sm rounded-2xl px-4 py-4">
            <p className="text-white/60 text-xs font-black uppercase tracking-widest mb-3">Demo — tap to autofill</p>
            <div className="space-y-1.5">
              {Object.entries(MOCK_DB).map(([type, records]) =>
                Object.entries(records).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => { setSelectedType(type); setSearchValue(key); setError(""); }}
                    className="block w-full text-left text-orange-300 hover:text-white text-xs font-mono py-1 transition-colors"
                  >
                    <span className="bg-white/10 px-1.5 py-0.5 rounded text-white/60 mr-2">{type}</span>
                    {key} — {val.name}
                  </button>
                ))
              )}
            </div>
          </div> */}
        </div>
      </div>
          <FooterSection/>
    </>
  );
}
