import type { Metadata } from "next";
import { Noto_Sans_Arabic } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { RoleProvider } from "@/providers/RoleProvider";

const arabic = Noto_Sans_Arabic({ subsets: ["arabic"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "General HR system",
  description: "White-label HR, payroll, attendance, recruitment, and operations platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={arabic.variable}>
      <body className="font-sans antialiased">
        <RoleProvider>
          {children}
        </RoleProvider>
      </body>
    </html>
  );
}
