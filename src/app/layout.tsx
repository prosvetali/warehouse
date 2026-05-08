import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense, type ReactNode } from "react";

import { QueryProvider } from "@/shared/lib/QueryProvider";
import { ToastsHost } from "@/shared/ui/ToastsHost";

import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Warehouse Catalog",
  description: "Адмін-панель каталогу товарів складу",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk" className={inter.variable}>
      <body className="font-sans">
        <QueryProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <ToastsHost />
        </QueryProvider>
      </body>
    </html>
  );
}
