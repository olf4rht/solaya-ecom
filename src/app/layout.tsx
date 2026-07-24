import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solaya - 3D Product Showcase",
  description:
    "Explore product visuals created with Solaya's 3D scanning technology. The most efficient content production solution for eCommerce brands ready to scale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        {children}
      </body>
    </html>
  );
}
