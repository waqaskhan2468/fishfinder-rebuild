import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const alikeAngular = localFont({
  src: "./fonts/alike-angular.woff2",
  variable: "--font-alike-angular",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bestfishfinderstoday.com"),
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
      </body>
    </html>
  );
}
