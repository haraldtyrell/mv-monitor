import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MV Monitor | Critical Minerals Intelligence",
  description: "Real-time monitoring of critical minerals markets and supply chain events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#0a0a0a]">
        {children}
      </body>
    </html>
  );
}
