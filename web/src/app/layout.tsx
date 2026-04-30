import type { Metadata } from "next";
import "./globals.css";
import { GeistMono } from "geist/font/mono";
import { NavDesktop, NavMobile } from "@/components/layout/nav";

export const metadata: Metadata = {
  title: "TicketBay Tracker",
  description: "티켓베이 시세 트래킹 & 알림 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`h-full antialiased ${GeistMono.variable}`}>
      <body className="min-h-full flex flex-col">
        <NavDesktop />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <NavMobile />
      </body>
    </html>
  );
}
