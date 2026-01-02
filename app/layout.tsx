import type React from "react";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ProgressBarProvider } from "@/components/providers/progress-bar-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { Toaster } from "@/components/ui/sonner";
import { MetaPixel } from "@/components/providers/meta-pixel-provider";
import { MetaPageView } from "@/components/providers/meta-page-view-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Marqen - Premium Clothing Bangladesh",
  description:
    "Shop trendy t-shirts, pants, and stylish clothing for men and women at Marqen. Quality fashion delivered across Bangladesh with Cash on Delivery.",
  generator: "next.js",
  icons: {
    icon: "/favicon.ico",
  },
  verification: {
    google: "Upg29v-LAQWZWqGlXE0bsuAsmHliLFK48WDVD2Smgw0",
  },
  openGraph: {
    title: "Marqen - Premium Clothing Bangladesh",
    description:
      "Shop trendy t-shirts, pants, and stylish clothing for men and women at Marqen. Quality fashion delivered across Bangladesh with Cash on Delivery.",
    url: "https://www.marqenbd.com",
    siteName: "Marqen",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marqen - Premium Clothing Bangladesh",
    description:
      "Shop trendy t-shirts, pants, and stylish clothing for men and women at Marqen. Quality fashion delivered across Bangladesh with Cash on Delivery.",
  },
  keywords: [
    "clothing Bangladesh",
    "t-shirts",
    "pants",
    "fashion",
    "Marqen",
    "cash on delivery",
    "men's clothing",
    "women's clothing",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const theme = savedTheme || (prefersDark ? 'dark' : 'light');

                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ClothingStore",
              name: "Marqen",
              description:
                "Premium clothing store in Bangladesh offering trendy t-shirts, pants, and stylish clothing for men and women with Cash on Delivery.",
              url: "https://www.marqenbd.com",
              logo: "https://www.marqenbd.com/light-mode-logo.png",
              image: "https://www.marqenbd.com/light-mode-logo.png",
              telephone: "+880-XXX-XXXXXX",
              address: {
                "@type": "PostalAddress",
                addressCountry: "BD",
                addressLocality: "Bangladesh",
              },
              priceRange: "$$",
              currenciesAccepted: "BDT",
              paymentAccepted: "Cash on Delivery, Credit Card, Debit Card",
              openingHours: "Mo-Su 00:00-23:59",
              sameAs: [
                "https://www.facebook.com/marqenbd",
                "https://www.instagram.com/marqenbd",
              ],
              potentialAction: {
                "@type": "SearchAction",
                target: "https://www.marqenbd.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <MetaPixel />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable}`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <Suspense fallback={null}>
            <ProgressBarProvider />
            <MetaPageView />
          </Suspense>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppFloat />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
