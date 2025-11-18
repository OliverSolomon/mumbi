import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "In Loving Memory: Mumbi Judy Jacqueline Kimaru",
  description: "A memorial site honoring the life and memory of Mumbi Judy Jacqueline Kimaru (1986-2025)",
  openGraph: {
    title: "In Loving Memory: Mumbi Judy Jacqueline Kimaru",
    description: "A memorial site honoring the life and memory of Mumbi Judy Jacqueline Kimaru (1986-2025)",
    images: [
      {
        url: "/judy.jpg",
        width: 1200,
        height: 630,
        alt: "Mumbi Judy Jacqueline Kimaru",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "In Loving Memory: Mumbi Judy Jacqueline Kimaru",
    description: "A memorial site honoring the life and memory of Mumbi Judy Jacqueline Kimaru (1986-2025)",
    images: ["/judy.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfairDisplay.variable} ${inter.variable} antialiased`}
      >
        <Header/>
        {children}
      </body>
    </html>
  );
}
