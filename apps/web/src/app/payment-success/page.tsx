import Link from "next/link";
import { loadBrandConfig } from "@/lib/brand";

export default async function PaymentSuccessPage() {
  const brand = await loadBrandConfig();
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--brand-bg)" }}>
      <header className="py-4 px-4 sm:px-10" style={{ borderBottom: "1px solid var(--brand-border)" }}>
        <Link href="/" className="text-xl font-bold" style={{ color: "var(--brand-primary)" }}>
          {brand.name}
        </Link>
      </header>

      <div className="flex-grow flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="card py-12">
            <svg className="w-16 h-16 mx-auto text-green-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h1 className="text-3xl font-bold mb-3">Payment Successful!</h1>
            <p className="mb-8" style={{ color: "var(--brand-muted)" }}>
              Your order has been processed. Credits will appear in your account shortly.
              Check your Telegram for confirmation.
            </p>
            <Link href="/" className="btn-primary px-8 py-3 text-sm font-semibold">
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>

      <footer className="py-6 px-4 text-center text-sm" style={{ color: "var(--brand-muted)", borderTop: "1px solid var(--brand-border)" }}>
        {new Date().getFullYear()} © All Rights Reserved | {brand.name}
      </footer>
    </div>
  );
}
