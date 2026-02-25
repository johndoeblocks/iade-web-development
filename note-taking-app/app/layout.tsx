import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { StickyNote } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SimpleNotes - Your digital brain",
  description: "A simple and elegant note taking application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-black selection:text-white`}
      >
        <div className="min-h-screen bg-white">
          <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                <StickyNote size={24} className="text-black" />
                <h1 className="text-xl font-bold tracking-tight text-black">SimpleNotes</h1>
              </Link>
              <div className="hidden sm:block text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">
                Digital Workspace v1.0
              </div>
            </div>
          </header>
          <main className="pt-20">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
