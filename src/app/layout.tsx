import type { Metadata, Viewport } from "next";
import "./globals.css";
import DataLayerInitializer from "../components/DataLayerInitializer";

export const metadata: Metadata = {
  title: "Log in | UPS - Canada",
  description: "Forgot your password or username? Reset your UPS account credentials.",
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
