import type { Metadata } from "next";
import { Poppins, Noto_Sans_Khmer } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const notoSansKhmer = Noto_Sans_Khmer({
  variable: "--font-khmer",
  subsets: ["khmer"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Julian & Vivian - Wedding Invitation",
  description: "Elegant wedding invitation with minimalism dark red theme",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="km"
      className={`${poppins.variable} ${notoSansKhmer.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
