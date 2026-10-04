import type { Metadata, Viewport } from "next";
import "./globals.css";
import { RegisterSW } from "@/components/RegisterSW";

export const metadata: Metadata = {
  title: "Чисто — трекер привычек",
  description:
    "Бросай вредные привычки и следи за прогрессом: дни без срывов, сэкономленные деньги и вехи здоровья.",
  applicationName: "Чисто",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Чисто",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f2f7" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="h-full">
      <body className="min-h-full bg-app text-ink tap-highlight-none">
        <div className="mx-auto min-h-screen w-full max-w-md bg-app">
          {children}
        </div>
        <RegisterSW />
      </body>
    </html>
  );
}
