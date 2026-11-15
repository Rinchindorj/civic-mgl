import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { AppStateProvider } from "@/context/AppStateContext";
import AppShell from "@/components/AppShell";
import Splash from "@/components/Splash";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Civic MGL — Цахим үйлчилгээний нэгдсэн систем",
  description:
    "Civic MGL: иргэдэд зориулсан цахим үйлчилгээний загвар аппликейшн (демо).",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0066FF",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="mn" className={`${manrope.variable} antialiased`}>
      <body className="min-h-screen">
        {/* App state lives in localStorage, so the shell renders in the browser.
            The splash is the prerendered HTML until it does. */}
        <Suspense fallback={<Splash />}>
          <AppStateProvider>
            <AppShell>{children}</AppShell>
          </AppStateProvider>
        </Suspense>
      </body>
    </html>
  );
}
