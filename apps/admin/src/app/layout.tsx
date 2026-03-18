import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fused Gaming — Admin",
  description: "Brand management and deployment console",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
