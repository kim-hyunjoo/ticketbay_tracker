import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
