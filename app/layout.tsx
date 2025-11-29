import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/footer";
import ExitPopupWrapper from "@/components/layout/exit-popup-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BumpWin | Get Paid When Airlines Screw Up",
  description: "Track your flights, know your rights, and get the compensation you deserve when airlines delay, cancel, or bump you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        {/* Exit Intent Popup - Only shows on marketing pages */}
        <ExitPopupWrapper />
      </body>
    </html>
  );
}
