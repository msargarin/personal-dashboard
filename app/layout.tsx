'use client';

import "@/app/globals.css";
import { Inter } from "next/font/google";
import AppNav from '@/app/nav/nav-bar';
import { LocationProvider } from "@/app/location/utils";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
          <div className="w-full flex-none md:w-72">
            <AppNav />
          </div>
          <div className="flex-grow bg-gray-150 md:overflow-y-auto md:p-4">
            <LocationProvider>
              {children}
            </LocationProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
