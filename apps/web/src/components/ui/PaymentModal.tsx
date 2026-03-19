"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BrandConfig } from "@/types/brand";
import { isValidRedirectUrl } from "@/lib/validation";

interface PaymentModalProps {
  pkg: BrandConfig["creditPackages"][number] | null;
  onClose: () => void;
  brand: BrandConfig;
}

type Step = "input" | "loading" | "success" | "error";

export default function PaymentModal({ pkg, onClose, brand }: PaymentModalProps) {
  const [telegram, setTelegram] = useState("");
  const [step, setStep] = useState<Step>("input");
  const [errorMsg, setErrorMsg] = useState("");

  const telegramRegex = /^@[a-zA-Z0-9_]{4,31}$/;
  const isValid = telegramRegex.test(telegram);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || !pkg) return;

    setStep("loading");
    try {
      const res = await fetch(brand.payment.apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: pkg.id,
          packageName: pkg.name,
          price: pkg.price,
          credits: pkg.credits,
          telegram,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message ?? "Payment initiation failed");
      }

      const data = await res.json();
      if (data?.paymentUrl && isValidRedirectUrl(data.paymentUrl, ["nowpayments.io"])) {
        window.location.href = data.paymentUrl;
      } else if (data?.paymentUrl) {
        // URL failed validation - treat as error
        throw new Error("Invalid payment URL received from server");
      } else {
        setStep("success");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStep("error");
    }
  }

  if (!pkg) return null;

  return (
    <AnimatePresence>
      <div className="modal-backdrop" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md mx-4 rounded-2xl p-8"
          style={{ background: "var(--brand-bg-secondary)", border: "1px solid var(--brand-border)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {step === "input" && (
            <>
              <h2 className="text-xl font-bold mb-1">Complete Purchase</h2>
              <p className="text-sm mb-6" style={{ color: "var(--brand-muted)" }}>
                {pkg.name} — <span className="font-bold text-white">${pkg.price.toLocaleString()}</span>
                {" · "}{pkg.credits.toLocaleString()} credits
                {pkg.boost && <span style={{ color: "var(--brand-primary)" }}> · {pkg.boost}</span>}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Telegram Username
                  </label>
                  <input
                    type="text"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    placeholder="@yourusername"
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                    style={{
                      background: "var(--brand-bg-tertiary)",
                      border: `1px solid ${isValid || !telegram ? "var(--brand-border)" : "var(--brand-primary)"}`,
                      color: "var(--brand-text)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "var(--brand-primary)";
                    }}
                    onBlur={(e) => {
                      if (!isValid) e.currentTarget.style.borderColor = "var(--brand-border)";
                    }}
                  />
                  {telegram && !isValid && (
                    <p className="text-xs mt-1.5" style={{ color: "var(--brand-primary)" }}>
                      Must be @username format (5–32 characters)
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!isValid}
                  className="btn-primary w-full py-3 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Pay ${pkg.price.toLocaleString()} with Crypto
                </button>
              </form>

              <p className="text-xs text-center mt-4" style={{ color: "var(--brand-faint)" }}>
                Powered by NOWPayments · BTC, ETH, USDT accepted
              </p>
            </>
          )}

          {step === "loading" && (
            <div className="text-center py-8">
              <div className="w-10 h-10 border-2 rounded-full mx-auto animate-spin mb-4"
                style={{ borderColor: "var(--brand-border)", borderTopColor: "var(--brand-primary)" }} />
              <p className="text-sm" style={{ color: "var(--brand-muted)" }}>Initializing payment...</p>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-8">
              <svg className="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-xl font-bold mb-2">Payment Initiated!</h3>
              <p className="text-sm" style={{ color: "var(--brand-muted)" }}>
                Check your Telegram for next steps. Credits will be applied within minutes.
              </p>
            </div>
          )}

          {step === "error" && (
            <div className="text-center py-8">
              <svg className="w-16 h-16 mx-auto text-yellow-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-xl font-bold mb-2">Something went wrong</h3>
              <p className="text-sm mb-6" style={{ color: "var(--brand-muted)" }}>{errorMsg}</p>
              <button onClick={() => setStep("input")} className="btn-primary px-6 py-2.5 text-sm">
                Try Again
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
