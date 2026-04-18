import type { Metadata } from "next";
import { Bebas_Neue, Crimson_Pro, Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-crimson",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LA Roadsters Car Club | Hot Rods of Southern California",
  description: "The Los Angeles Roadsters Car Club was established in 1957 and remains active today. World-renowned show held annually at the Fairplex in Pomona, California.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bebasNeue.variable} ${crimsonPro.variable} ${inter.variable} min-h-screen flex flex-col pt-20`}>
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
