import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import "./globals.css";

const alikeAngular = localFont({
  src: "./fonts/alike-angular.woff2",
  variable: "--font-alike-angular",
  display: "swap",
});

export const metadata: Metadata = {
  // Must match the host Vercel actually serves (apex 308-redirects to www),
  // otherwise every canonical URL points at a redirect.
  metadataBase: new URL("https://www.bestfishfinderstoday.com"),
  title: "Best Fish Finders Today",
  robots: { index: true, follow: true },
  openGraph: { siteName: "Best Fish Finders Today", type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${alikeAngular.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-surface-alt text-ink">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
