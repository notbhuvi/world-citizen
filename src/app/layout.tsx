import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegistration from "@/components/layout/ServiceWorkerRegistration";
import AppShell from "@/components/layout/AppShell";
import AuthGate from "@/components/auth/AuthGate";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { BASE_PATH } from "@/lib/basePath";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Moved Out — New place. New start. You belong.",
  description: "New place. New start. You belong. Everything you need to know, anywhere in the world.",
  manifest: `${BASE_PATH}/manifest.webmanifest`,
  applicationName: "Moved Out",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Moved Out",
  },
  icons: {
    icon: [
      { url: `${BASE_PATH}/icons/favicon-32.png`, sizes: "32x32", type: "image/png" },
      { url: `${BASE_PATH}/icons/favicon-16.png`, sizes: "16x16", type: "image/png" },
      { url: `${BASE_PATH}/icons/icon-192.png`, sizes: "192x192", type: "image/png" },
      { url: `${BASE_PATH}/icons/icon-512.png`, sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: `${BASE_PATH}/apple-touch-icon.png`, sizes: "180x180", type: "image/png" }],
  },
  formatDetection: { telephone: false },
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#08080C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ServiceWorkerRegistration />
        <AuthProvider>
          <AuthGate>
            <AppShell>{children}</AppShell>
          </AuthGate>
        </AuthProvider>
      </body>
    </html>
  );
}
