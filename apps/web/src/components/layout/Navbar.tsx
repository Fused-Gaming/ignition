"use client";

import { useState } from "react";
import Link from "next/link";
import type { BrandConfig } from "@/types/brand";

interface NavbarProps {
  brand: BrandConfig;
}

export default function Navbar({ brand }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="py-4 px-4 sm:px-10 z-50 min-h-[70px] sticky top-0"
      style={{ background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--brand-border)" }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-x-4">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <span className="text-xl font-bold" style={{ color: "var(--brand-primary)" }}>
            {brand.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-x-8">
          {brand.nav.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-x-3">
          <Link href="#shop" className="btn-primary text-sm px-5 py-2">
            {brand.nav.cta}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 text-gray-400 hover:text-white"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden mt-4 pb-4 border-t pt-4" style={{ borderColor: "var(--brand-border)" }}>
          <nav className="flex flex-col gap-y-3 px-4">
            {brand.nav.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-white"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="#shop" className="btn-primary text-sm mt-2" onClick={() => setMenuOpen(false)}>
              {brand.nav.cta}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
