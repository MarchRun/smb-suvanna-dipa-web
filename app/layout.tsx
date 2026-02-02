import type { Metadata } from "next";
import { Fredoka, Nunito, Montserrat } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/providers/ToastContext";

const fredoka = Fredoka({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export const metadata: Metadata = {
  title: "SMB Suvanna Dipa - Sistem Informasi Sekolah Minggu Buddha",
  description: "Portal informasi dan manajemen Sekolah Minggu Buddha Suvanna Dipa",
  icons: {
    icon: "/images/logo-smbsd-v2.png",
    apple: "/images/logo-smbsd-v2.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${fredoka.variable} ${nunito.variable} ${montserrat.variable} antialiased`}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
