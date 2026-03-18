import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { loadBrandConfig, themeToCSSVars } from "@/lib/brand";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const brand = await loadBrandConfig();
  return {
    title: brand.seo.title,
    description: brand.seo.description,
    keywords: brand.seo.keywords,
    metadataBase: new URL(`https://${brand.domain}`),
    openGraph: {
      title: brand.seo.title,
      description: brand.seo.description,
      siteName: brand.name,
    },
    twitter: {
      card: "summary_large_image",
      title: brand.seo.title,
      description: brand.seo.description,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const brand = await loadBrandConfig();
  const cssVars = themeToCSSVars(brand.theme);

  return (
    <html lang={brand.languageDefault} suppressHydrationWarning>
      <head>
        <style>{`:root { ${cssVars} }`}</style>
      </head>
      <body
        className={`${poppins.variable} ${inter.variable} font-sans bg-black text-gray-100 antialiased`}
      >
        {children}
        {/* Tawk.to chat — injected per brand */}
        {brand.chat?.provider === "tawk" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
                (function(){
                  var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                  s1.async=true;
                  s1.src='https://embed.tawk.to/${brand.chat.propertyId}/${brand.chat.widgetId}';
                  s1.charset='UTF-8';
                  s1.setAttribute('crossorigin','*');
                  s0.parentNode.insertBefore(s1,s0);
                })();
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}
