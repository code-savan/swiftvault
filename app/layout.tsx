import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins"
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto"
});

export const metadata: Metadata = {
  title: "SwiftVault - Digital Services Suite | OTP, eSIM, Social Media & More",
  description: "Your all-in-one digital services platform. Get virtual numbers for OTP verification, eSIM plans, social media accounts, account boosting, and more. Trusted by thousands worldwide.",
  keywords: "OTP verification, virtual numbers, eSIM, social media accounts, account boosting, digital services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${roboto.variable} font-poppins`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
