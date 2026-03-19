import Link from "next/link";
import { loadBrandConfig } from "@/lib/brand";

export default async function PaymentCancelPage() {
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
            <svg className="w-16 h-16 mx-auto text-yellow-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h1 className="text-3xl font-bold mb-3">Payment Cancelled</h1>
            <p className="mb-8" style={{ color: "var(--brand-muted)" }}>
              No charges were made. You can try again whenever you&apos;re ready.
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
